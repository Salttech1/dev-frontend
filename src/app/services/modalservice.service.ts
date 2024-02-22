import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class ModalService {

  constructor(private dialog: MatDialog) { }
  //  dialogRefference = this.dialog.open(ModalComponent);
  showErrorDialog(titleVal: any, message: string, type: string) {
    const dialogRef = this.dialog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: titleVal,
        message: message,
        template: "",
        type: type
      },
    });
    dialogRef.afterOpened().subscribe(() => {
      console.log("Dialog Opened")
    })
    dialogRef.afterClosed().subscribe((result: any) => {
    });
  }


  showErrorDialogCallBack(titleVal: any, message: string, callBackFunc: any, type: string) {
    const dialogRef = this.dialog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: titleVal,
        message: message,
        template: "",
        type: type
      },
    });
    dialogRef.afterOpened().subscribe(() => {
      console.log("Dialog Opened")
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      callBackFunc

    });
  }

}