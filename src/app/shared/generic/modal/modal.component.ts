import { Component, HostListener, Inject, OnInit, TemplateRef } from '@angular/core';
import {MatDialog,MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  imagePath: any;
  constructor(public dialog:MatDialogRef<ModalComponent>, @Inject(MAT_DIALOG_DATA) public data: {
    title:string
    isF1Pressed: boolean,
    message: string,
    template:TemplateRef<any> ,
    type:string
    confirmationDialog: boolean
   
  },) { 
  
  }

  ngOnInit(): void {
    this.imagePath = "assets/images/"+this.data.type+".png"
  }

  @HostListener('keydown.escape', ['$event'])
  handleKeyEscape(event: KeyboardEvent) {
    this.dialog.close();
  }

  onConfirm(): void {
    this.dialog.close(true);
}

onDismiss(): void {
    this.dialog.close(false);
}

}
