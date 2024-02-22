import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { buttonsList } from 'src/app/shared/interface/common';

@Component({
  selector: 'app-flat-parking-details-report',
  templateUrl: './flat-parking-details-report.component.html',
  styleUrls: ['./flat-parking-details-report.component.css'],
})
export class FlatParkingDetailsReportComponent implements OnInit {
  filter_wing = '';
  filter_flat = '';
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
    bldgcode: ['', Validators.required],
    wing: [{ value: '', disabled: true }],
    flatNum: [''],
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

  onLeaveBuildingCode(val: string) {
    this.filter_wing = `bldg_code = '` + val + `'`;
    this.filter_flat = `flat_bldgcode = '` + val + `'`;
  }
}
