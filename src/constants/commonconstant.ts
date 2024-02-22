import { buttonsList } from 'src/app/shared/interface/common';
export const coyCloseDate = '01/01/2050';
export const closeDate = '01-JAN-2050';
export const closeDateFt = '01.Jan.2050';
export const doubleSpaceString = '  ';
export const enum segment {
  TDS = 'TDS',
  LBLDG = 'LBLDG',
  Z = 'Z',
  PARTY = 'PARTY',
  STAFF = 'STAFF',
  PAPA = 'PAPA',
  BANK = 'BANK',
  BLDG = 'BLDG',
  POA = 'POA',
  COY = 'COY',
  PROJ = 'PROJ',
  DEP = 'DEP',
  EMPL = 'EMPL',
}
export enum AdType {
  PUNE = 'PUNE',
  IFRSD = 'IRF',
  OF = 'OF',
  OUTO = 'OUTO',
  WORK = 'WORK',
  HOME = 'HOME',
  PMT = 'PMT',
  BL = 'BL',
  ML = 'ML',
  MAIL = 'MAIL',
  RES = 'RES',
  LOC3 = 'LOC3',
  ADMIN = 'ADMIN',
  RS = 'RS',
  LOC1 = 'LOC1',
  LOC2 = 'LOC2',
  LOC = 'LOC',
  OUTG = 'OUTG',
}
export const maxPartyLength = 12;
export const serverPath = '\\\\prodsrv\\FA.Net\\Server\\KR-ERP';

// buttons list
export const busttonsList: Array<buttonsList> = [
  { id: 1, position: 1, name: 'Add', accessKey: 'a', key: 'add', isDisabled: false },
  { id: 2, position: 1, name: 'Retrieve', accessKey: 'r', key: 'retrieve', isDisabled: false },
  { id: 3, position: 1, name: 'Delete', accessKey: 'd', key: 'delete', isDisabled: false },
  { id: 4, position: 1, name: 'Process', accessKey: 'p', key: 'process', isDisabled: false },

  { id: 5, position: 1, name: 'Save', accessKey: 's', key: 'save', isDisabled: false },
  { id: 6, position: 1, name: 'Back', accessKey: 'b', key: 'back', isDisabled: false },
  { id: 7, position: 2, name: 'Exit', accessKey: 'x', key: 'exit', isDisabled: false },
  {
    id: 8,
    position: 1,
    name: 'Print Rec.',
    accessKey: 'p',
    key: 'print_rec',
    isDisabled: false,
  },
  {
    id: 9,
    position: 7,
    name: 'Print Vouch',
    accessKey: 'v',
    key: 'print_vouch',
    isDisabled: false,
  },
  {
    id: 10,
    position: 1,
    name: 'View',
    accessKey: 'v',
    key: 'view',
    isDisabled: false,
  },
  {
    id: 11,
    position: 1,
    name: 'Print',
    accessKey: 'p',
    key: 'print',
    isDisabled: false,
  },
  {
    id: 12,
    position: 1,
    name: 'Export',
    accessKey: 'e',
    key: 'export',
    isDisabled: false,
  },
  {
    id: 13,
    position: 1,
    name: 'Priview',
    accessKey: 'p',
    key: 'priview',
    isDisabled: false,
  },
  {
    id: 14,
    position: 1,
    name: 'Download',
    accessKey: 'd',
    key: 'download',
    isDisabled: false,
  },
  {
    id: 15,
    position: 5,
    name: 'Reset',
    accessKey: 't',
    key: 'reset',
    isDisabled: false
  },
  {
    id: 16,
    position: 1,
    name: 'Edit',
    accessKey: 'e',
    key: 'edit',
    isDisabled: false
  },
  {
    id: 17,
    position: 1,
    name: 'List',
    accessKey: 'l',
    key: 'list',
    isDisabled: false
  },
  {
    id: 18,
    position: 5,
    name: 'Address',
    accessKey: 'e',
    key: 'address',
    isDisabled: false
  },
  {
    id: 19,
    position: 5,
    name: 'Acc Post',
    accessKey: 'p',
    key: 'accPost',
    isDisabled: false
  },
  {
    id: 20,
    position: 1,
    name: 'Generate Payment List',
    accessKey: 'g',
    key: 'generatePaymentList',
    isDisabled: false
  },
  {
    id: 21,
    position: 9,
    name: 'RetrieveDocs',
    accessKey: 'd',
    key: 'retrieveDocs',
    isDisabled: false
  },
  {
    id: 22,
    position: 1,
    name: 'SelectDocs',
    accessKey: 's',
    key: 'selectDocs',
    isDisabled: false
  },
  {
    id: 23,
    position: 1,
    name: 'FinalisePayList',
    accessKey: 'f',
    key: 'finalisePayList',
    isDisabled: false
  },
  {
    id: 24,
    position: 2,
    name: 'LC Details',
    accessKey: 'c',
    key: 'lcDetails',
    isDisabled: false
  },
   {
    id: 25,
    position: 1,
    name: 'Confirm',
    accessKey: 'c',
    key: 'confirm',
    isDisabled: false
  }

];
