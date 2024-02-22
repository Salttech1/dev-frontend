import { Renderer2 } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { DynapopService } from 'src/app/services/dynapop.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { fileConstants } from 'src/constants/fileconstants';

@Component({
  selector: 'app-policy-asset-details',
  templateUrl: './policy-asset-details.component.html',
  styleUrls: ['./policy-asset-details.component.css']
})
export class PolicyAssetDetailsComponent implements OnInit {
  @ViewChild(F1Component) initFocus!: F1Component;
  POLICYID: any;
  POLICYIDColumns!: any[];
  formname!: any;

  constructor(
    private commonReportService: CommonReportsService,
    private router: Router,
    private _service: ServiceService,
    private toastr: ToastrService,
    private dynapop: DynapopService,
    private rendered: Renderer2
  ) {}

  loaderToggle: boolean = false

  ngOnInit(): void {}
  ngAfterViewInit(): void {}
  PolicyAssetItems = new FormGroup({
    name: new FormControl('Adm_RP_insurance_AssetItems.rpt'),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),

      TxtPolicyAssetItems: new FormControl<String[]>([], Validators.required),
    }),
  });

  getReport(print: boolean) {
    if (this.PolicyAssetItems.valid) {
      let reval =
        this.PolicyAssetItems.controls['reportParameters']?.get(
          'TxtPolicyAssetItems'
        )?.value;
      this.loaderToggle = true;

      let payload = {
        name: 'Adm_RP_insurance_AssetItems.rpt',
        isPrint: false,
        reportParameters: {
          PolicyID: reval?.[0],
        },
      };

      this.commonReportService
        .getParameterizedReport(payload)
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
