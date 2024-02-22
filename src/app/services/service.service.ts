import { ElementRef, Injectable } from '@angular/core';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, take } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PDFDocument } from 'pdf-lib';

export interface pageData {
  breadcrumb: any[];
  code: string;
  formName: string;
  access?: any[];
  role?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  constructor(private toastr: ToastrService, private http: HttpClient) {}

  usrName = new BehaviorSubject<string | null>(
    sessionStorage.getItem('userName')
  );

  formName = new BehaviorSubject(sessionStorage.getItem('formName'));

  accessRightArr = new BehaviorSubject(
    sessionStorage.getItem('accessRightArr')
  );

  menu: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  greetings: BehaviorSubject<any> = new BehaviorSubject<any>('');
  wsMsg: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  fetchMenu: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  // for websocket

  _ws: BehaviorSubject<any> = new BehaviorSubject<boolean>(false);

  updateWs(data:boolean){
    this._ws.next(data)
  }

  dataOnRoute: pageData = {
    breadcrumb: [],
    code: '',
    formName: '',
    role: '',
  };

  pageData: BehaviorSubject<pageData> = new BehaviorSubject<pageData>(
    this.dataOnRoute
  );

  updateAccessRight(data: any) {
    this.accessRightArr.next(data);
  }

  getPageData(url: any) {
    this.menu.subscribe((val) => {
      val.length && this.getModule(url, val);
    });
  }

  getModule(url: string[], menu: any[]) {
    this.dataOnRoute = { breadcrumb: [], code: '', formName: '' };

    for (let i = 0; i < menu.length; i++) {
      let d: any = menu[i].description;

      if (d.toLowerCase().replace(/\/|\#|\\|\(|\)|\`|\s/g, '') == url[0]) {
        this.dataOnRoute.breadcrumb.push(d);
        this.getComp(menu[i], url, 0);
        break;
      }
    }
  }

  getComp(main: any, url: any, urlIndex: number) {
    urlIndex++;

    if (main.hasOwnProperty('sub_menu') && main.sub_menu.length) {
      for (let i = 0; i < main.sub_menu.length; i++) {
        let d = main.sub_menu[i].description;
        let s = main.sub_menu[i];
        if (
          d.toLowerCase().replace(/\/|\#|\\|\(|\)|\`|\s/g, '') == url[urlIndex]
        ) {
          this.dataOnRoute.breadcrumb.push(d);
          this.getComp(s, url, urlIndex);
          break;
        }
      }
    } else {
      this.dataOnRoute.formName = main.formName ?? '';
      this.dataOnRoute.code = main.code ?? 0;
      this.dataOnRoute.access = main.accessRights ?? [];
      this.fetchMenu.subscribe((v) => {
        this.dataOnRoute.role = v?.extraData;
      });
      sessionStorage.setItem('menucode', this.dataOnRoute.code);
    }
    this.pageData.next(this.dataOnRoute);
  }

  getAccess(action: string): boolean {
    if (this.dataOnRoute.role == 'Y') {
      return true;
    } else {
      if (this.dataOnRoute.access?.includes(action)) {
        return true;
      } else {
        return false;
      }
    }
  }

  setFocusField(formControls: any, el: any) {
    for (const key of Object.keys(formControls)) {
      if (formControls[key].invalid) {
        const invalidControl = el.querySelector(
          '[formcontrolname="' + key + '"] > input'
        )
          ? el.querySelector('[formcontrolname="' + key + '"] > input')
          : el.querySelector('[formcontrolname="' + key + '"]');
        invalidControl?.focus();
        break;
      }
    }
  }

  // common pdf, excel download method
  exportReport(print: Boolean, res: any, v: string, filename: any) {
    let pdf = new Blob([res], { type: 'application/pdf' });
    let ex1 = new Blob([res], { type: 'application/octet-stream' });
    if (print) {
      const blobUrl = URL.createObjectURL(pdf);
      const oWindow = window.open(blobUrl, '_blank');
      oWindow?.print();
    } else {
      if (v == 'PDF') {
        fileSaver.saveAs(pdf, filename + '.pdf');
      } else {
        fileSaver.saveAs(ex1, filename + '.xls');
      }
    }
  }
  // can't print excel document
  printExcelChk(print: Boolean, v: string) {
    if (print) {
      if (v !== 'PDF') {
        this.toastr.error('cannot print Excel Document');
        return false;
      }
    }
    return true;
  }

  getMenuList() {
    var payload = { username: `${sessionStorage.getItem('userName')}` };
    return this.http.post(`${environment.API_URL}menu/fetch-menu`, payload);
  }

  
  showGreeting(message: any) {
    this.greetings.next(message);
  }

  getWsMsg(data:boolean){
    this.wsMsg.next(data)
  }

  // for pdf view multiple pdf merge into one pdf
  mergeBlobsToPdf = async (blobs :Array<Blob>): Promise<Blob> => {
    const pdfDoc = await PDFDocument.create();
    for (const blob of blobs) {
      const arrayBuffer = await this.blobToArrayBuffer(blob);
      const page = await pdfDoc.copyPages(await PDFDocument.load(arrayBuffer), [0]);
      pdfDoc.addPage(page[0]);
    }
    const mergedPdfBytes = await pdfDoc.save();
    return new Blob([mergedPdfBytes], { type: 'application/pdf' });
  };

  blobToArrayBuffer = (blob: Blob): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  };

}
