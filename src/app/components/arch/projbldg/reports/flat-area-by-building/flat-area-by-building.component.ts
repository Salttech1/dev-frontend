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
import { projbldgconstatnts } from '../../projbldgconstants';

@Component({
  selector: 'app-flat-area-by-building',
  templateUrl: './flat-area-by-building.component.html',
  styleUrls: ['./flat-area-by-building.component.css'],
})
export class FlatAreaByBuildingComponent implements OnInit {
  @ViewChild(F1Component) initFocus!: F1Component;

  BldgWingSelectionform = new FormGroup({
    name: new FormControl(projbldgconstatnts.flatareabybldgreport),
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    conditionId: new FormControl(6),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      TxtBldgCode: new FormControl<string[]>([], [Validators.required]),
      Txtwing: new FormControl<string[]>([]),
      flatType: new FormControl<String>('A'),
      conditionId: new FormControl(),
    }),
  });

  loaderToggle: boolean = false;
  BldgColHeadings!: any[];
  BldgF1List: any;
  BldgF1Bbc: any;

  WingColHeadings!: any[];
  WingF1List: any;
  WingF1Bbc: any;

  bldgCode = '';

  constructor(
    private dynapop: DynapopService,
    private _service: ServiceService,
    private rendered: Renderer2,
    private commonReportService: CommonReportsService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this._service.pageData.subscribe({
      next: (val) => {
        this.BldgWingSelectionform.patchValue({
          reportParameters: {
            formname: `'${val.formName}'`,
          },
        });
      },
    });

    this.BldgWingSelectionform.get('reportParameters')
      ?.get('TxtBldgCode')
      ?.valueChanges.subscribe({
        next: (res: any) => {
          if (res) {
            let bldg = res;
            this.bldgCode = `FLAT_bldgcode IN ('${bldg.join(
              "','"
            )}') AND flat_wing <> ' '`;
          }
        },
      });
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  getReport(print: boolean) {
    if (this.BldgWingSelectionform.valid) {
      let condition;
      let wing = `${
        this.BldgWingSelectionform.controls['reportParameters'].get('Txtwing')
          ?.value
      }`;

      let flatType =
        this.BldgWingSelectionform.value.reportParameters?.flatType;

      if (wing == '') {
        if (flatType == 'U') {
          condition = 4;
        } else if (flatType == 'P') {
          condition = 5;
        } else {
          condition = 6;
        }
      } else {
        if (flatType == 'U') {
          condition = 1;
        } else if (flatType == 'P') {
          condition = 2;
        } else {
          condition = 3;
        }
      }

      let payload: any = {
        name: projbldgconstatnts.flatareabybldgreport,
        isPrint: false,
        seqId: 1,
        conditionId: condition,
        reportParameters: {
          TxtBldgCode: `'${this.BldgWingSelectionform.controls[
            'reportParameters'
          ]
            .get('TxtBldgCode')
            ?.value?.join(`','`)}'`,

          Txtwing: `'${this.BldgWingSelectionform.controls['reportParameters']
            .get('Txtwing')
            ?.value?.join(`','`)}'`,

          formname:
            this.BldgWingSelectionform.controls['reportParameters'].get(
              'formname'
            )?.value,
        },
      };

      this.loaderToggle = true;
      this.commonReportService
        .getTtxParameterizedReportWithCondition(payload)
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

}
