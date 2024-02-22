export const Add_Depositor = 'depositor/add-depositor';
export const update_Depositor = 'depositor/update-depositor';
export const Add_Deposit = 'deposit/add-deposit';
export const Renew_Deposit = 'deposit/add-deposit-renew';
export const DepositorId_Chk =
  'depositor/check-depositorid-and-companycode-exists';
export const dynapop = 'dynapop';
export const dynapopSearch = '/dynapop-find-by-search-text';
export const RecieptNumber_Chk = 'deposit/check-reciept-number-exists';
export const ErrorDialog_Title = 'K.Raheja ERP';
export const coyCloseDate = '01/01/2050';

export const api_url = {
  paramReport: 'report/generate-report-parameter',
  fetchDeposit:
    'deposit/fetch-deposit-by-companycode-and-depositorid-and-receiptno',
  depositDischargeRetrieve:
    'deposit/fetch-deposits-by-companycode-and-depositorid',
  depositDischargeFetchInterestRate: 'deposit/fetch-interest-rate',
  depositDischargeCalcInterest: 'deposit/calculate-interest-for-discharge',
  saveDepositDischargeCalcInterest: 'deposit/discharge-deposit',
  depositTransfer: 'deposit/transfer-deposit',
  depintFetchInterestTaxEntry:
    'depint/fetch-cheque-by-depositorId-and-recieptNum-and-companyCode',
  updateTaxEntryData:
    'depint/update-cheque-by-depositorId-and-recieptNum-and-companyCode',
  fetchInterestAndTDS:
    'depint/fetch-interest-by-depositorId-and-recieptNum-and-companyCode',
  checkIsTranserNoValidByPartyCode:
    'depint/check-is-transer-valid-by-partycode',
  fetchForm15hgDetails:
    'form-15hg/fetch-form15hg-by-depositorId-and-companyCode-and-accountYear-and-quater',
  fetchForm15hgAddDetails:
    'form-15hg/fetch-uniqueid-and-income-and-fromDate-and-toDate',
  updateForm15hgDetails:
    'form-15hg/update-form15hg-by-depositorId-and-companyCode-and-accountYear-and-quater',
  depositRenewalGlEntry: 'deposit/calculate-interest-for-renewal-gl-entry',
  form15hgdepositor: 'depositor/form15hg-by-depositorid-and-companycode',
  addForm15hg:
    'form-15hg/add-form15hg-by-depositorId-and-companyCode-and-accountYear-and-quater',
  deleteForm15hg:
    'form-15hg/delete-form15hg-by-depositorId-and-companyCode-and-accountYear-and-quater',
  generateForm15hgReturnsFile: 'form-15hg/export-15hg-report',
  processInitialiseYTD: 'yearend-process/initialise-ytd',
  processRecalculateBrokerYTD: 'yearend-process/recalculate-broker-ytd',
  fetchCompanyCloseDate: 'company/fetch-coy-closedate',
  fetchNEFTDetails:
    'fd-report/fetch-neft-report-fromDate-and-toDate-and-coyBankAC',
  // depositRenewalGlEntry:"deposit/calculate-interest-for-renewal-gl-entry"
  ttxParamReport: 'report/generate-report-ttx',
  ttxParamReportWithCondition: 'report/generate-report-ttx-condition',
  exportNeftReport: 'fd-report/export-neft-report',
  validateDepositPrintRev: 'deposit/validate-deposit-printrev',
  fetchFixedDepositParams: 'fd-report/fetch-fixed-deposit-receipt-parameters',
  paramReportWithCondition: 'report/generate-report-condition-and-parameter',
  paramReportWithMultipleConditionAndParameter:
    'report/generate-report-with-multiple-condition-and-parameter',
  fecthDebitNoetBySerialNo: 'dbnote/fetch-dbnoteh-by-ser',
  checkSuppBillForDebitNote: 'dbnote/check-supplier-bill-number',

  //Auxillary URLS
  getAuxiFlatOwnerData:
    'outinfra/fetch-flatowner-data-by-Bldgcode-and-Flatnum-and-Wing',
  getAuxiStartDate: 'outinfra/fetch-start-date',
  getAllocationDetails: 'outinfra/auxilary-allocation-grid',
  saveAuxiliaryReceiptEntryDetails: 'outinfra/save-incheqe-details',
  getGSTFlag: 'infra/fetch-infra-gst-flag',
  getCarParks: 'infra/fetch-infra-car-parks',
  getAdvanceFlag: 'infra/fetch-infra-advance-flag',
  getBillGenration: 'outinfra/infra-auxi-bill-generation',
  addBillGeneration: 'outinfra/bill-print',
  viewBillGeneration: 'outinfra/bill-view',
  deleteBillGeneration: 'outinfra/bill-delete',
  fetchBillGenerationNextBillDate: 'outinfra/fetch-next-bill-date',

  // Admin Exp Urls -> Billing
  // 1. Admin Advance Payment
  getAdminAdvancePayment: 'admadvance-bill/fetch-admadvance-bill-by-Ser',
  createAdminAdvancePayment: 'admadvance-bill/save-admadvance-bill',
  updateAdminAdvancePayment: 'admadvance-bill/update-admadvance-bill',
  // 2. Admin Advance Payment Passing
  getAdminAdvancePaymentPassing:
    'admadvance-bill-passing/fetch-admadvance-bill-by-Pinv-and-Ser',
  AdminAdvancePaymentPassing:
    'admadvance-bill-passing/fetch-admadvance-bill-by-Pinv-and-Ser',
  createAdminAdvancePaymentPassing:
    'admadvance-bill-passing/update-admadvance-bill',
  // 3. Debit Note Entry
  getDebitNoteEntry: 'debit-note/fetch-debit-note-by-Ser',
  updateDebitNoteEntry: 'debit-note/update-debit-note-bill',
  getByInvoice: 'debit-note/fetch-debit-note-by-invoiceNum',
  createDebitNoteEntry: 'debit-note/save-debit-note-bill',
  // 4. Debit Note Cancellation
  getDebitNoteCancellation: 'debit-note/fetch-debit-note-by-Ser',
  // createDebitNoteCancellation: 'debitNoteCancellation/save-debit-note', //check
  cancelDebitNoteCancellation: 'debit-note/cancel-debit-note',
  // 5. Invoice Creation
  getRegularInvocieFormate: 'invoice-creation/fetch-invPartyMaster-list',
  getInvoiceDetails: 'invoice-creation/fetch-invoice-bill',
  addInvoice: 'invoice-creation/save-invoice-bill',
  accountPostInvoice: 'invoice-creation/post-invoice-bill',
  updateInvoice: 'invoice-creation/modify-invoice-bill',
  fetchPartyCodeExist: 'invoice-creation/fetch-party-code-exists',

  // 6. Intercompany Invoice
  createInterCompanyGroupInvocie:'inter-company/add',
  createIntercompanyInvoice: 'inter-company/fetch-greid',
  getIntercompanyInvoice: 'inter-company/retrive-greid',
  accountPostingIntercompanyInvoice: 'inter-company/post-inter-coy',

  // 7. Admin bill Entry
  getAdminDetailsBySerNo : 'admbill/fetch-admbill-by-Ser',
  getAdminBillGstAndBasicDetails:'admbill/fetch-admbill-details-new-entry',
  getAdminBillMinTypeIsDisabled:'admbill/fetch-party-legal-or-security',
  createBillEntry:'admbill/add-admbill',
  updateBillEntry:'admbill/update-admbill',
  getGstPercentage:'admbill/fetch-gst-rates',
  getTDSPercentage:'admbill/fetch-tds-percentage',
  getIsBillExist:'admbill/fetch-bill-exists',
  // 8. Admin Bill Passing
  getBillPassing : 'admin-bill-passing/fetch-admbill-by-Ser',
  createBillPassing : 'admin-bill-passing/pass-admin-bill-by-Ser',
  // 9. Admin Bill Cancellation
  getBillCancellation : 'admbill-bill-cancellation/fetch-admbill-by-Ser',
  cancelBillCancellation: 'admbill-bill-cancellation/cancel-admin-bill-by-Ser',

  // QR code
  getQRCode:'qr/generate-qr',
  
  // Engineering Module
  // 1. Lc Certificate System -> Data Entry
  // 1.1 Lc certificate Entry
  fetchLcCertNum: 'certificate/retrieve-last-lc-certificate',
  createLcCertificate: 'certificate/create-lc-certificate',
  fetchLcCertificate: 'certificate/retrieve-lc-certificate',
  fetchContractDetails : 'certificate/get-contract-detail'


};

// export const fd_route_const={
//     fd:{
//         path:'fd/depositentry/reports/activedepositindividualwise',
//         loadChildren:()=> import(`../app/components/fd/depositentry/reports/activedepositindividualwise/activedepositindividualwise.module`).then(m=>m.ActivedepositindividualwiseModule),
//       }
// }
