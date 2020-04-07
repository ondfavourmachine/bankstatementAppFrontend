import { InjectionToken } from "@angular/core";

export const REGISTRATION_API = new InjectionToken<string>("registrationApi");
export const LOGIN_API = new InjectionToken<string>("loginApi");
export const DASHBOARD_API = new InjectionToken<string>("dashboardApi");
export const FORGOTPASSWORD_API = new InjectionToken<string>(
  "forgotPassword_api"
);

export const UPDATEPROFILE_API = new InjectionToken<string>("profileUpdateApi");
export const UPDATEPASSWORD_API = new InjectionToken<string>(
  "updatePasswordApi"
);

export const RESETPASSWORD_API = new InjectionToken<string>("resetPasswordApi");
export const BILLING_API = new InjectionToken<string>("billingApi");
export const SENDEMAIL_API = new InjectionToken<string>("sendEmailApi");
export const PAYMENTINITIATION_API = new InjectionToken("paymentInitiateApi");
export const PAYMENTVERIFICATION_API = new InjectionToken(
  "paymentVerificationApi"
);

export const FREESUBSCRIPTION_API = new InjectionToken("freeSubscription");
export const GETHISTORYOFSTATEMENTS_API = new InjectionToken(
  "getHistoryOfStatements"
);

export const GETRECENTSTATEMENTANALYSED = new InjectionToken(
  "getRecentStatementAnalysed"
);
