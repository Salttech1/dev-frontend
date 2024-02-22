import {
  Component,
  HostListener,
  Inject,
  OnInit,
  Renderer2,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subject, take } from 'rxjs';
import { DynapopService } from 'src/app/services/dynapop.service';

export interface emitData {
  value: Object[];
  bbc: number;
}

@Component({
  selector: 'app-f1-popup',
  templateUrl: './f1-popup.component.html',
  styleUrls: ['./f1-popup.component.css'],
})
export class F1PopupComponent implements OnInit {
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();

  items: {
    data: { dataSet: any[]; bringBackColumn: number };
    mainheader: String;
  } = {
    data: { dataSet: [], bringBackColumn: 1 },
    mainheader: 'Select',
  };

  loader: boolean = false;
  sendData: emitData = { value: [], bbc: 1 };
  count: number = 0;

  constructor(
    private dynapop: DynapopService,
    public toastr: ToastrService,
    private renderer: Renderer2,
    public dialogRef: MatDialogRef<F1PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthChange: false,
      scrollY: '50vh',
      scrollCollapse: false,
      select: {
        style: this.data?.multi ? 'os' : 'single',
        className: 'outline1',
        info: false,
      },
      data: this.items.data.dataSet,
      createdRow: (row: Node) => {
        $('td', row).parent().attr('tabindex', '0');
        return row;
      },
    };

    this.getItemList();

    // emit data before popup closed
    this.dialogRef.beforeClosed().subscribe(() => {
      if (this.items.data.dataSet.length) {
        const datalength = $('.f1Table')
          ?.DataTable()
          ?.rows('.outline1')
          ?.data(); //returns datatable Object
        if (datalength.length) {
          // get selected elements from returned Object Array
          this.sendData.value = datalength?.splice(0, datalength.length);
        }
      }
    });
  }

  // show table data using dynaPop Id
  getItemList() {
    this.loader = true;
    this.dynapop
      .getDynaPopListObj(this.data.id, this.data.subId ?? '')
      .pipe(
        // take(1),
        finalize(() => (this.loader = false))
      )
      .subscribe({
        next: (res: any) => {
          if (res.status && res.data.dataSet?.length) {
            this.items = res;
            this.sendData.bbc = res.data.bringBackColumn; // set which column is primary
            this.dtOptions.data = res.data.dataSet;
            this.dtOptions.columns = this.getTableHead(res);
            this.dtTrigger.next(this.dtOptions);
            // this.highlightRow();
            setTimeout(() => {
              const dataTable = $('.f1Table')?.DataTable();
              if (this.data.value) {
                for (let val of this.data.value) {
                  let columnIndex = 0; // Index of the column to search in (zero-based)
                  let searchValue = val;

                  dataTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
                    var rowData: any = this.data(); // Get the data for the current row
                    var cellValue = rowData[columnIndex]; // Get the value of the specific cell

                    // Check if the cell value matches the desired value
                    if (cellValue === searchValue) {
                      // Select the row
                      dataTable.row(rowIdx).select();
                    }
                  });
                }
              }
            }, 50);
          } else {
            this.toastr.error('Not found');
          }
        },
      });
  }

  // get table columns heading
  getTableHead(val: any) {
    let thead: any = [];
    // loop response object key name
    Object.keys(val.data).forEach((v: string) => {
      v.startsWith('colhead')
        ? thead.push({ title: val.data[v].trim() }) // push into array if key name starts with colhead
        : null;
    });
    return thead;
  }

  // single & mulit select event handler
  @HostListener('click', ['$event'])
  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.escape', ['$event'])
  async selectItem(e: any) {
    let nodeList = ['TD', 'TR'];
    if (!this.data?.multi) {
      // select tr and emit data in single select
      if (nodeList.includes(e.target.nodeName)) {
        $('.f1Table')?.DataTable().rows(e.target).select();
        // used async/await to avoid deselect of 1st row on click
        await new Promise((res) => {
          $('.f1Table')?.DataTable().rows(e.target).select();
          this.emitData();
          res;
        });
      }

      if (e.target.nodeName == 'INPUT' && e.type == 'keydown') {
        this.emitData();
      }
    } else {
      // add or remove class on keydown event in multi select
      if (
        nodeList.includes(e.target.nodeName) &&
        e.type == 'keydown' &&
        e.keyCode != 27 // if event is esc btn dont remove outline class from last item
      ) {
        e.target.classList?.contains('outline1')
          ? this.renderer.removeClass(e.target, 'outline1')
          : this.renderer.addClass(e.target, 'outline1');
      }

      // emit data on esc btn
      if (e.keyCode == 27) {
        this.emitData();
      }
    }
  }

  // for navigation between rows on arrow up down
  @HostListener('keydown.ArrowDown', ['$event'])
  @HostListener('keydown.ArrowUp', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.data?.multi) {
      const key = event.key;
      const dataTable = $('.f1Table').DataTable();

      const currentPage = dataTable.page();
      const pageSize = dataTable.page.len();

      if (key === 'ArrowUp') {
        const rows = dataTable.rows({ search: 'applied' }).nodes().toArray();
        const currentRowIndex = rows.findIndex((row) =>
          $(row).hasClass('outline1')
        );
        const firstRowIndex = currentPage * pageSize;
        if (currentRowIndex === firstRowIndex && currentPage > 0) {
          dataTable.page('previous').draw(false);
          const updatedRows = dataTable
            .rows({ search: 'applied' })
            .nodes()
            .toArray();
          const lastRowIndex = currentPage * pageSize - 1;
          $(updatedRows[lastRowIndex]).addClass('outline1');
          dataTable.rows({ search: 'applied' }).deselect();
          dataTable.row(updatedRows[lastRowIndex]).select();
          event.preventDefault();
        } else if (currentRowIndex > 0) {
          dataTable.row('.outline1').deselect();
          $(rows[currentRowIndex - 1]).addClass('outline1');
          dataTable.row(rows[currentRowIndex - 1]).select();
          event.preventDefault();
        }
      } else if (key === 'ArrowDown') {
        const rows = dataTable.rows({ search: 'applied' }).nodes().toArray();
        const currentRowIndex = rows.findIndex((row) =>
          $(row).hasClass('outline1')
        );
        const lastRowIndex = currentPage * pageSize + (pageSize - 1);

        if (
          currentRowIndex === lastRowIndex &&
          currentPage + 1 < dataTable.page.info().pages
        ) {
          dataTable.page('next').draw('page');
          const updatedRows = dataTable
            .rows({ search: 'applied' })
            .nodes()
            .toArray();
          $(updatedRows[rows[currentRowIndex + 1]]).addClass('outline1');
          dataTable.rows({ search: 'applied' }).deselect();
          dataTable.row(rows[currentRowIndex + 1]).select();
          event.preventDefault();
        } else if (currentRowIndex < lastRowIndex) {
          dataTable.row('.outline1').deselect();
          $(rows[currentRowIndex + 1]).addClass('outline1');
          dataTable.row(rows[currentRowIndex + 1]).select();
          event.preventDefault();
        }
      }
    }
  }

  // emit/pass selected items
  emitData() {
    const datalength = $('.f1Table')?.DataTable()?.rows('.outline1')?.data(); //returns datatable Object
    if (datalength.length) {
      // get selected elements from returned Object Array
      this.sendData.value = datalength?.splice(0, datalength.length);
    }
    this.dialogRef.close(this.sendData);
  }

  emitSearchedData() {
    const datalength = $('.f1Table')
      ?.DataTable()
      ?.rows('.outline1', { search: 'applied' })
      ?.data(); // returns datatable Object
    if (datalength.length) {
      // get selected elements from returned Object Array
      this.sendData.value = datalength?.splice(0, datalength.length);
    }
    this.dialogRef.close(this.sendData);
  }

  // search
  @HostListener('input', ['$event'])
  onSearch(e: InputEvent) {
    const dataTable = $('.f1Table').DataTable();
    let el = e.target as HTMLInputElement;
    switch (el?.id) {
      case 'globalSearch': {
        dataTable.search(el?.value).draw();
        break;
      }
      case 'codeSearch': {
        dataTable.column(0).search(el?.value).draw();
        break;
      }
      case 'nameSearch': {
        dataTable.column(1).search(el?.value).draw();
        break;
      }
    }
    // on search filter match value select automatically
    const firstRow = dataTable.rows({ filter: 'applied' }).nodes()[0];
    if (firstRow) {
      !this.data.multi?dataTable.row(firstRow).select():'';
    }
  }

  // on enter in search, select focused item
  onEnterInSearch(e: any) {
    const datalength = $('.f1Table')?.DataTable()?.rows()?.data(); //returns datatable Object
    if (datalength.length) {
      // get selected elements from returned Object Array
      this.sendData.value = datalength?.splice(0, datalength.length);
    }
  }
}
