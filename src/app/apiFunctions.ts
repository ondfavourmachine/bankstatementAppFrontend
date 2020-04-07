import {
  REGISTRATION_API,
  LOGIN_API,
  DASHBOARD_API,
  FORGOTPASSWORD_API,
  UPDATEPASSWORD_API,
  UPDATEPROFILE_API,
  BILLING_API,
  RESETPASSWORD_API,
  SENDEMAIL_API,
  PAYMENTINITIATION_API,
  PAYMENTVERIFICATION_API,
  FREESUBSCRIPTION_API,
  GETHISTORYOFSTATEMENTS_API,
  GETRECENTSTATEMENTANALYSED
} from "./token";
import { GeneralApi } from "./generalApi";

export class ApiFunctions {
  static registrationApi() {
    return {
      provide: REGISTRATION_API,
      useValue: `${GeneralApi}register`
    };
  }

  static loginApi() {
    return {
      provide: LOGIN_API,
      useValue: `${GeneralApi}login`
    };
  }

  static dashboardApi() {
    return {
      provide: DASHBOARD_API,
      useValue: `${GeneralApi}dashboard/`
    };
  }

  static forgotPasswordApi() {
    return {
      provide: FORGOTPASSWORD_API,
      useValue: `${GeneralApi}profile/forgot-password`
    };
  }

  static resetPasswordApi() {
    return {
      provide: RESETPASSWORD_API,
      useValue: `${GeneralApi}profile/reset-password`
    };
  }

  static updateProfileApi() {
    return {
      provide: UPDATEPROFILE_API,
      useValue: `${GeneralApi}profile/update`
    };
  }

  static billingPlanApi() {
    return {
      provide: BILLING_API,
      useValue: `${GeneralApi}packages/`
    };
  }

  static updatePassword() {
    return {
      provide: UPDATEPASSWORD_API,
      useValue: `${GeneralApi}profile/update-password`
    };
  }

  static sendVerificationEmail() {
    return {
      provide: SENDEMAIL_API,
      useValue: `${GeneralApi}register/send-email`
    };
  }

  static paymentVerification() {
    return {
      provide: PAYMENTVERIFICATION_API,
      useValue: `${GeneralApi}payment/verify`
    };
  }

  static paymentInitiation() {
    return {
      provide: PAYMENTINITIATION_API,
      useValue: `${GeneralApi}payment/initiate/`
    };
  }

  static freeSubscription() {
    return {
      provide: FREESUBSCRIPTION_API,
      useValue: `${GeneralApi}payment/free`
    };
  }

  static getHistory() {
    return {
      provide: GETHISTORYOFSTATEMENTS_API,
      useValue: `${GeneralApi}dashboard/transactions`
    };
  }

  static getRecentStatement() {
    return {
      provide: GETRECENTSTATEMENTANALYSED,
      useValue: `${GeneralApi}analytics/status/`
    };
  }
}
