//Auxilary module interface
export interface auxiQueryString {
  bldCode: string;
  wingCode: string;
  flatNo?:string,
  finalString: string;
  getFlatNumber: string;
  getWing: string;
  getReceiptNum: string;
}

export interface auxiliaryConfig{
  isProccesed:boolean
}

export interface auxiReceiptEntry{
  cheques:cheques,
  gridRequest:gridRequest
}

export interface cheques{
  bank:string,
  outstat:string,
  acType:string,
  fundSource:string,
  chequeDate:string,
  chequeNumber:string,
  chequeAmount:string,
}

export interface gridRequest{
  monthName:string,
  narrationCode:string,
  narration:string,
  auxiPaid:string,
  intPaid:string,
  admin:string,
  cgst:string,
  sgst:string,
  igst:string,
  cgstPercent:string,
  sgstPercent:string,
  igstPercent:string,
  tds:string,
}

export interface CollQueryString {
  bldCode: string;
  wingCode: string;
  flatNo?:string,
  finalString: string;
  getFlatNumber: string;
  getWing: string;
  getReceiptNum: string;
}

export interface CollinvString {
  ownerid: string;
  ownerName: string;
  invoiceno: string;
}