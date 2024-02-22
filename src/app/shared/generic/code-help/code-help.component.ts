import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonReportsService } from 'src/app/services/reports.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-code-help',
  templateUrl: './code-help.component.html',
  styleUrls: ['./code-help.component.css'],
})
export class CodeHelpComponent implements OnInit {
  data: any[] = [];
  qf!: FormGroup;
  loader: boolean = false;

  displayedColumns!: string[];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  master: string[] = [
    'BUILDING',
    'COMPANY',
    'PARTY',
    'WORK',
    'MATERIAL',
    'HSN MASTER',
    'SAC MASTER',
    'WORK/MATRIAL NARRATION',
  ];

  constructor(private _report: CommonReportsService, private fb: FormBuilder) {
    this.dataSource = new MatTableDataSource(this.data);
  }

  ngOnInit(): void {
    this.qf = this.fb.group({
      tableName: '',
      matLevel: '',
      search: '',
    });

    this.qf.get('tableName')?.valueChanges.subscribe((val) => {
      val && this.getCode(val);
    });

    this.qf.get('matLevel')?.valueChanges.subscribe((val) => {
      val && this.getCode(this.qf.get('tableName')?.value, val);
    });
  }

  getCode(table: any, level?: any) {
    this.data = [];
    this.displayedColumns = [];
    this.dataSource = new MatTableDataSource(this.data);

    let params: any = { tableName: table };
    if (level) {
      params['matLevel'] = level;
    }

    this.loader = true;
    this._report
      .getCodeHelp(params)
      .pipe(
        take(1),
        finalize(() => (this.loader = false))
      )
      .subscribe({
        next: (res: any) => {
          this.data = res.data;
          // To order 'code' before 'cgstperc'
          if (table == 'SAC MASTER' || table == 'HSN MASTER') {
            this.displayedColumns = [
              'code',
              'desc',
              'cgstperc',
              'igstperc',
              'sgstperc',
            ];
          }
          //To add GSTNo for Party as its null for some cases
          else if (table == 'PARTY') {
            this.displayedColumns = [
              'code',
              'name',
              'type',
              'pmtacnum',
              'gstno',
              'address',
            ];
          } else {
            this.displayedColumns = Object.keys(this.data[0]);
          }

          this.dataSource = new MatTableDataSource(this.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.applyFilter();
        },
      });
  }

  applyFilter(event?: Event, column?: string) {
    // filter/search by code & name
    if (column) {
      let prop = '';
      let table = this.qf.get('tableName')?.value;
      switch (table) {
        case 'BUILDING':
        case 'COMPANY':
        case 'PARTY':
        case 'WORK':
          prop = column == 'code' ? 'code' : 'name';
          break;
        case 'MATERIAL':
          prop = column == 'code' ? 'matgroup' : 'name';
          break;
        case 'HSN MASTER':
        case 'SAC MASTER':
          prop = column == 'code' ? 'code' : 'desc';
          break;
        case 'WORK/MATRIAL NARRATION':
          prop = column == 'code' ? 'matCertCode' : 'matItemDesc';
          break;
        default:
          prop = '';
      }

      this.dataSource.filterPredicate = function (
        data,
        filter: string
      ): boolean {
        return data[prop]?.toLowerCase().includes(filter);
      };
    }

    const filterValue = (event?.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue?.trim()?.toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
