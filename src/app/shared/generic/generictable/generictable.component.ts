import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
declare const $: any;

@Component({
  selector: 'app-generictable',
  templateUrl: './generictable.component.html',
  styleUrls: ['./generictable.component.css'],
})
export class GenerictableComponent implements OnInit, OnChanges {
  @Input() tableData = [];
  @Input() columnHeader: any;
  @Output() selectedRowData = new EventEmitter<any>();
  @Output() fieldDataEntered = new EventEmitter();
  @Input() multiSelect: string = 'single';
  @Output() modalClose = new EventEmitter<any>()
  constructor(private renderer: Renderer2,public dialog: MatDialog,) { }

  // dynamic filter
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject();

  ngOnInit(): void {
    //search on keyup event
    $('#globalSearchtext').on('keyup', (e: any) => {
      if (e.keyCode != 9) {
        // inside if condition to avoid jump from last to 1st page on tab click
        $('.generictbl').DataTable().search(e?.target.value).draw();
        this.onSearchEnter(e);
      }
    });

    $('#searchCodetext').on('keyup', (e: any) => {
      if (e.keyCode != 9) {
        $('.generictbl').DataTable().column(0).search(e?.target.value).draw();
        this.onSearchEnter(e);
      }
    });

    $('#searchNametext').on('keyup', (e: any) => {
      if (e.keyCode != 9) {
        $('.generictbl').DataTable().column(1).search(e?.target.value).draw();
        this.onSearchEnter(e);
      }
    });
  }

  ngOnChanges(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthChange: false,
      data: this.tableData,
      scrollY: '50vh',
      scrollCollapse: false,
      select: {
        style: this.multiSelect,
        className: 'outline1',
        info: false,
      },
      columns: this.maptitle(this.columnHeader),
      oLanguage: {
        sInfo: 'Showing _START_ out of _END_ Results ',
      },
      createdRow: (row: Node, data: any[], dataIndex: number) => {
        $('td', row).parent().attr('tabindex', '0'); //added tab keyboard navigation
        $('td', row).off('dblclick');
        $('td', row)
          .parent()
          .on('click', () => {
            if (this.multiSelect == 'single') {
              this.selectedRow(data);
            }
          });
        $('td', row)
          .parent()
          .on('keyup', (e: any) => {
            if (this.multiSelect == 'single') {
              if (e.keyCode == 13) {
                this.selectedRow(data);
              }
            }
          });
        return row;
      },
    };
  }

  @HostListener('document:keydown', ['$event'])
  selectOnEnter(e: any) {
    let tr = e.target;
    if (this.multiSelect == 'os') {
      if (e.keyCode == 13) {
        if (tr.classList.contains('outline1')) {
          this.renderer.removeClass(tr, 'outline1');
        } else {
          this.renderer.addClass(tr, 'outline1');
        }
      }

      if (e.keyCode == 27) {
        this.selectedRow($('.generictbl').DataTable().rows('.outline1').data());
      }
    } else {
      //remove class .outline1 from 1st tr when tab is clicked
      if (e.keyCode == 9 && tr.classList.contains('outline1')) {
        this.renderer.removeClass(tr, 'outline1');
      }
    }
  }

  //get selected tr on modal close btn mouse click
  @HostListener('document:click', ['$event'])
  selectOnClose(e: any) {
    let esc = e?.target;
    if (this.multiSelect == 'os' && esc?.classList?.contains('btn-close')) {
      this.selectedRow($('.generictbl').DataTable().rows('.outline1').data());
    }
  }

  //highlight and select 1st row on keyup event in search inputs
  onSearchEnter(event: any) {
    if (this.multiSelect == 'single') {
      //highlight 1st row on search keyup
      $('.generictbl')
        .DataTable()
        .row(':eq(0)', { search: 'applied' })
        .select();

      let visible_row = $('.generictbl')
        .DataTable()
        .rows({ search: 'applied' })
        .data();
      console.log('visible_row ', visible_row);

      //select 1st row on key enter in search inputs
      if (event.keyCode == 13 && visible_row.length) {
        this.selectedRow(visible_row[0]);
      }
    }
  }

  selectedRow(currenttr: any) {
    if (this.multiSelect == 'single') {
      this.selectedRowData.emit(currenttr);
      this.fieldDataEntered.emit(currenttr);
      this.modalClose.emit()
      // this.dialog.closeAll();
    } else if (currenttr.length) {
      let multiSelected: any[] = [];
      for (let i = 0; i < currenttr.length; i++) {
        multiSelected.push(currenttr[i][0]);
      }
      this.selectedRowData.emit(multiSelected);
      this.fieldDataEntered.emit(currenttr);
      this.modalClose.emit()
    }
  }

  //convert table columns/thead data in Array of Objects format
  maptitle(data: any) {
    let th: Array<Object> = [];
    data?.forEach((v: any) => (v ? th.push({ title: v }) : ''));
    return th;
  }
}
