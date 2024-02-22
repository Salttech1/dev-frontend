import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { DynapopService } from 'src/app/services/dynapop.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';

@Component({
  selector: 'app-logicnoteboqvendor',
  templateUrl: './logicnoteboqvendor.component.html',
  styleUrls: ['./logicnoteboqvendor.component.css']
})
export class LogicnoteboqvendorComponent implements OnInit {
  @ViewChild(F1Component) initFocus!: F1Component;
  formname!: any;

  constructor(
    private commonReportService: CommonReportsService,
    private router: Router,
    private _service: ServiceService,
    private toastr: ToastrService,
    private dynapop: DynapopService,
    private rendered: Renderer2
  ) {}

  loaderToggle: boolean = false;

  ngOnInit(): void {
    this._service.pageData.subscribe({
      next: (val) => {
        this.formname = `'${val.formName}'`;
        this.logicNoteBoqVendorDetailForm.patchValue({
          reportParameters: {
            formname: `'${val.formName}'`,
          },
        });
      },
    });
  }

  ngAfterViewInit(): void {
    
  }

  logicNoteBoqVendorDetailForm = new FormGroup({
    name: new FormControl('EN_RP_LOGICNOTEBOQDTLS.rpt'),
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    conditionId: new FormControl(1),
    reportParameters: new FormGroup({
      formname: new FormControl(''),

      ProjectCode: new FormControl<String[]>([], Validators.required),
    }),
  });

    getReport(print: boolean) {
    if (this.logicNoteBoqVendorDetailForm.valid) {
      let reval =
        this.logicNoteBoqVendorDetailForm.controls['reportParameters']?.get(
          'ProjectCode'
        )?.value;
      this.loaderToggle = true;

      let trimval = reval?.map((val) => val.toString().trim());
      let siteNam = {
        name: 'EN_RP_LOGICNOTEBOQDTLS.rpt',
        isPrint: false,
        seqId: 1,
        conditionId: 1,
        reportParameters: {
          formname:'EN_RP_LOGICNOTEBOQDTLS',
          ProjectCode: `${trimval?.join(`','`)}`,
        },
      };

      this.commonReportService
        .getParameterizedReport(siteNam)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            this.loaderToggle = false;
            let pdfFile = new Blob([res], { type: 'application/pdf' });
            let fileName = this.commonReportService.getReportName();
            if (print) {
              const blobUrl = URL.createObjectURL(pdfFile);
              const oWindow = window.open(blobUrl, '_blank');
              oWindow?.print();
            } else {
              fileSaver.saveAs(pdfFile, fileName);
            }
          },
          error: (err: any) => {
            this.loaderToggle = false;
          },
          complete: () => {
            this.loaderToggle = false;
          },
        });
    } else {
      this.toastr.error('Please fill the input properly');
    }
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }
}
