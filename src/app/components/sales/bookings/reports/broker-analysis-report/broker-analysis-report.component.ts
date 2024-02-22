import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { buttonsList } from 'src/app/shared/interface/common';

@Component({
  selector: 'app-broker-analysis-report',
  templateUrl: './broker-analysis-report.component.html',
  styleUrls: ['./broker-analysis-report.component.css'],
})
export class BrokerAnalysisReportComponent implements OnInit {
  config = {
    isLoading: false,
  };

  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds([
    'download',
    'print',
    'reset',
    'exit',
  ]);

  ReportCriteria: FormGroup = this.formBuilder.group({
    period: this.formBuilder.group({
      fromdate: [''], 
      uptodate: [''],
    }),
  });

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {}

  buttonAction(event: string) {
    if (event === 'download') {
      // this.getGstFlag(false);
    } else if (event === 'print') {
      // this.getGstFlag(true);
    } else if (event === 'exit') {
      this.router.navigateByUrl('/dashboard');
    } else if (event === 'reset') {
      this.ReportCriteria.reset();
    }
  }

}
