import { Component, OnInit,EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-bankbaranch-entryedit',
  templateUrl: './bankbaranch-entryedit.component.html',
  styleUrls: ['./bankbaranch-entryedit.component.css']
})
export class BankbaranchEntryeditComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @Output() closeEvent = new EventEmitter<void>();

  close(): void {
    this.closeEvent.emit();
  }
}
