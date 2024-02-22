import { Injectable } from '@angular/core';
import { buttonsList } from '../shared/interface/common';
import { busttonsList } from 'src/constants/commonconstant';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormArray, FormGroup } from '@angular/forms';
import { PDFDocument } from 'pdf-lib';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  api: String = environment.API_URL;
  constructor(private http: HttpClient) { }

  // action buttons on every footer page
  buttonsList: Array<buttonsList> = busttonsList;
  // filter out button list according to id's list
  getButtonsByIds(keys: string[]): Array<buttonsList> {
    const result = [];
    for (const key of keys) {
      const item = this.buttonsList.find((item) => item.key === key);
      if (item) {
        result.push(item);
      }
    }
    return result;
  }
  // diabled or enable ids by passing butons list and ids list with state which action need to performe
  enableDisableButtonsByIds(
    idsToDisable: string[],
    arrayList: Array<buttonsList>,
    state: boolean
  ): void {
    arrayList.forEach((item) => {
      if (idsToDisable.includes(item.key)) {
        item.isDisabled = state ? true : false;
      }
    });
  }

  changeButtonName(
    buttonName: String,
    newButtonName: any,
    arrayList: Array<buttonsList>
  ) {
    arrayList.forEach((item) => {
      if (buttonName.includes(item.key)) {
        item.name = newButtonName.name;
        item.key = newButtonName.key;
      }
    });
  }

  // convert the arry into string
  convertArryaToString(val: any) {
    if (val) {
      if (typeof val == 'object') {
        if (val.length <= 1) {
          if (typeof val[0] == 'string') {
            return val[0];
          } else {
            return val[0][0];
          }
        } else {
          return val.join(`','`);
        }
      } else {
        return val;
      }
    } else {
      return val;
    }
  }

  formatKeysToTwoDecimalPlaces(data: any, keys: any) {
    return data.map(function (obj: any) {
      var formattedObj = { ...obj };
      keys.forEach(function (key: any) {
        if (formattedObj.hasOwnProperty(key)) {
          formattedObj[key] = obj[key].toFixed(2);
        }
      });
      return formattedObj;
    });
  }

  // add colun to payload for report
  addSingleQuotationForString(excludedKeys: Array<any>, object: any) {
    for (const key in object) {
      if (object.hasOwnProperty(key) && !excludedKeys.includes(key)) {
        object[key] = `'${object[key]}'`;
      }
    }

    return object;
  }

  /**
 * Delete records from temporary table for session id 
 *
 * ## Example
 *
 *
 * ```ts
 * this.delSessId('saogrp04p', 'sump_sessid', String(sessId));
 *
 * ```
 *
 *
 * @param {string} tempTableName - Temporary table name 
 * @param {string} sesIdColName - Session Id column name in the temporary table
 * @param {string} sessionId - Session Id to be deleted from the temporary table
 * 
 * @return Response Object with status & message
 */
  deleteSessionId(
    tempTableName: string,
    sesIdColName: string,
    sessionId: string
  ) {
    // 12.12.23   RS
    let params = new HttpParams()
      .set('tempTableName', tempTableName)
      .set('sesIdColName', sesIdColName)
      .set('sessionId', sessionId);

    return this.http.delete<any>(
      `${this.api}commonmethods/delete-Temp-Data-For-SessId`,
      { params }
    );
  }

  // dissabled all form controls
  disableAllControls(
    formGroup: FormGroup | FormArray,
    isDisable: boolean
  ): void {
    Object.keys(formGroup.controls).forEach((key: string) => {
      const control = formGroup.get(key);

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.disableAllControls(control, true);
      } else {
        isDisable ? control?.disable() : control?.enable();
      }
    });
  }

  // insert another pdf to another pdf (use for QR code merge to bill)
  async insertPdfAtPositionForQR(pdfBlob1: Blob, pdfBlob2: Blob, position: number, x: number, y: number) {
    const pdfBytes1 = await pdfBlob1.arrayBuffer();
    const pdfBytes2 = await pdfBlob2.arrayBuffer();
    const pdfDoc1 = await PDFDocument.load(pdfBytes1);
    const pdfDoc2 = await PDFDocument.load(pdfBytes2);
    if (position < 0 || position > pdfDoc1.getPageCount()) {
      throw new Error('Invalid insertion position');
    }
    const pagesToInsert = await pdfDoc1.copyPages(pdfDoc2, pdfDoc2.getPageIndices());
    const targetPage = pdfDoc1.getPage(position);
    if (!targetPage) {
      throw new Error('Target page not found');
    }
    pagesToInsert.forEach(async (pageToInsert) => {
      const embeddedPage = await pdfDoc1.embedPage(pageToInsert);
      const scaledWidth = embeddedPage.width * 0.25;
      const scaledHeight = embeddedPage.height * 0.22;
      targetPage.drawPage(embeddedPage, { x, y, width: scaledWidth, height: scaledHeight });
      // y += scaledHeight;
    });
    const mergedPdfBytes = await pdfDoc1.save();
    return new Blob([mergedPdfBytes], { type: 'application/pdf' });
  }

  fetchChar1FromEntity(
    entClass: string,
    entId: string,
    extraWhereClause: string
  ) {
    // 21.12.23   RS
    let params = new HttpParams()
      .set('clazz', entClass)
      .set('id', entId)
      .set('extraWhereClause', extraWhereClause);

    return this.http.get<any>(
      `${this.api}entity/fetch-char1-by-class-and-id`,
      { params }
    );

  }




}
