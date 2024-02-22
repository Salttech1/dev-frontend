import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-vehicle-average-report',
  templateUrl: './vehicle-average-report.component.html',
  styleUrls: ['./vehicle-average-report.component.css']
})
export class VehicleAverageReportComponent implements OnInit {

  loaderToggle: boolean = false;
  formname!: any;

  VehicleAverageRep: FormGroup = new FormGroup({
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    name: new FormControl<string>('VehicleKmsRun.rpt', Validators.required),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      reportOption:new FormControl('VehicleKmsRun'),
    }),
  });

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private _service: ServiceService,
    private commonReportService: CommonReportsService,
  ) { }

  ngOnInit(): void {
    this._service.pageData.subscribe({
      next: (val) => {
        this.formname = `${val.formName}`;
        this.VehicleAverageRep.patchValue({
          reportParameters: {
            formname: `${val.formName}`,
          },
        });
      },
    });
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  getReport(print: boolean) {
    console.log('form',this.VehicleAverageRep)
    if (this.VehicleAverageRep.valid){
    this.loaderToggle = true;
    this.VehicleAverageRep.patchValue({
      name : this.VehicleAverageRep.controls['reportParameters'].get('reportOption')?.value == 'VehicleKmsRun' ?  'VehicleKmsRun-CrossTab.rpt' :   'VehiclePetrolAndMaintCrossTab.rpt',
    });

    this.commonReportService
    .getParameterizedReport(this.VehicleAverageRep.value)
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
      this.toastr.error('Please fill the input properly')
    
    }
  }

}
