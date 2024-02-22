import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as fileSaver from 'file-saver';
import { take } from 'rxjs';
import { DynapopService } from 'src/app/services/dynapop.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-combined-interest',
  templateUrl: './combined-interest.component.html',
  styleUrls: ['./combined-interest.component.css'],
})
export class CombinedInterestComponent
  implements OnInit, AfterViewInit, OnChanges
{
  combinedInterestForm: FormGroup = new FormGroup({
    coy: new FormControl<string | null>('', Validators.required),
    companyName: new FormControl<string | null>({ value: '', disabled: true }),
    transer: new FormControl<any>('', Validators.required),
    toDate:new FormControl('')
  });

  company: any;
  coy_condition = "coy_fdyn='Y'";
  transer: any;
  companyColumns!: any[];
  transerColumns!: any[];
  loaderToggle: boolean = false;
  formName: string = '';

  @ViewChild(F1Component) comp!: F1Component;

  constructor(
    private dynapop: DynapopService,
    private toastr: ToasterapiService,
    private cdref: ChangeDetectorRef,
    private renderer: Renderer2,
    private commonReportService: CommonReportsService,
    private _service: ServiceService
  ) {}

  ngOnInit(): void {
    this.getCompanyList();

    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'`;
      },
    });
    this.fetchToDate()
  }

  ngAfterViewInit(): void {
    this.renderer.selectRootElement(this.comp.fo1.nativeElement).focus(); //To add default focus on input field
  }

  //added to remove change detection console error
  ngOnChanges(changes: SimpleChanges): void {}

  //added to remove change detection console error
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  getCompanyList() {
    this.dynapop
      .getDynaPopListObj('COMPANY', "coy_fdyn='Y'")
      .subscribe((res: any) => {
        this.company = res.data;
        this.companyColumns = [
          res?.data?.colhead1,
          res?.data?.colhead2,
          res?.data?.colhead3,
          res?.data?.colhead4,
          res?.data?.colhead5,
        ];
      });
  }

  getTranserList() {
    this.dynapop.getDynaPopListObj('TRANSER1', '').subscribe((res: any) => {
      this.transer = res.data;
      this.transerColumns = [
        res?.data?.colhead1,
        res?.data?.colhead2,
        res?.data?.colhead3,
        res?.data?.colhead4,
        res?.data?.colhead5,
      ];
    });
  }

  getSelectedCompany(e: any[]) {
    if (e?.length) {
      this.combinedInterestForm.patchValue({
        coy: e[0],
        companyName: e[1],
      });
      this.getTranserList();
    }
  }

  getSelectedTranser(e: any[]) {
    if (e?.length) {
      this.combinedInterestForm.patchValue({
        transer: e.join(`','`),
      });
    }
  }

  fetchToDate(){
    let transer = this.combinedInterestForm.get('transer');
    transer?.valueChanges.subscribe((val)=>{
      if(val.length){
        let trArrDt =  val.split(`','`);
        this.commonReportService.fetchTransDate(trArrDt).pipe(take(1)).subscribe({
          next:(res:any)=>{
            if(res.status){
              console.log(res);
              this.combinedInterestForm.get('toDate')?.patchValue(res.data)
            }
            else{
              this.combinedInterestForm.get('toDate')?.patchValue(null)
            }
          }
        })
      }
    })
  }

  getReport(print: Boolean) {
    if (this.combinedInterestForm.valid) {
      let payload = {
        name: 'CombinedListofInt.rpt',
        isPrint: false,
        seqId: 1,
        reportParameters: {
          coy: this.combinedInterestForm.get('coy')?.value,
          transer: `'${this.combinedInterestForm.get('transer')?.value}'`,
          h1: "'Interest Payment Ledger'",
          h2: `'${this.combinedInterestForm.get('coy')?.value}'`,
          h3: `'${this.combinedInterestForm.get('companyName')?.value}'`,
          formname: this.formName,
          ToDate: `'${this.combinedInterestForm.get('toDate')?.value}'`
        },
      };

      this.loaderToggle = true;
      this.commonReportService
        .getTtxParameterizedReport(payload)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            if (res) {
              let pdf = new Blob([res], { type: 'application/pdf' });
              let filename = this.commonReportService.getReportName();
              if (print) {
                const blobUrl = URL.createObjectURL(pdf);
                const oWindow = window.open(blobUrl, '_blank');
                oWindow?.print();
              } else {
                fileSaver.saveAs(pdf, filename);
              }
            }
          },
          error: () => (this.loaderToggle = false),
          complete: () => (this.loaderToggle = false),
        });
    } else {
      this.toastr.showError('Please fill the form properly to retrieve data');
      this.combinedInterestForm.markAllAsTouched();
    }
  }
}
