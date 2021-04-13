import { Injectable } from "@angular/core";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GeneralService } from "../general.service";
import { from, Observable } from "rxjs";
import { Bank, DashboardData } from "../../models/dashboard-data";
// import { inject } from "@angular/core/testing";
import { TransactionHistory } from "src/app/models/transactionHistory";
import { GeneralApi } from "src/app/generalApi";
import { timeout } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${GeneralApi}dashboard/`);
  }

  updateAllOrAnyProfileField(value: object): Observable<string> {
    return this.http.post<string>(`${GeneralApi}profile/update`, value);
  }

  updatePassword(value: Object): Observable<string> {
    return this.http.post<string>(
      `${GeneralApi}profile/update-password`,
      value
    );
  }

  sendEmail(email: object): Observable<any> {
    return this.http.post(`${GeneralApi}register/send-email`, email);
  }

  fetchBillingPlans(id: number) {
    return this.http.get(`${GeneralApi}packages/${id}`);
  }

  // checkUserFromCentralLendplatform(key: { key: string }): Promise<any> {
  //   return this.http.post("localhost:4200/alt-dashboard", key).toPromise();
  // }

  getHistoryOfUserAnalysedStatements(
    number?: string
  ): Observable<TransactionHistory> {
    if (number) {
      return this.http.get<TransactionHistory>(
        `${GeneralApi}dashboard/transactions/${number}`
      );
    }
    return this.http.get<TransactionHistory>(
      `${GeneralApi}dashboard/transactions`
    );
  }


  confirmAccountDetailsOfParent(obj: { bank_code: any; account_number: any }) {
    let url = "https://mobile.creditclan.com/webapi/v1/account/resolve";
    const confirmAccount = async (obj) => {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
          "x-api-key": "z2BhpgFNUA99G8hZiFNv77mHDYcTlecgjybqDACv"
        }
      })

     const banks = await res.json();
     return banks;
    }

    const obs = from(confirmAccount(obj));
    return obs;
  }


  fetchBankNames(): Observable<any>{ 
    let url = "https://mobile.creditclan.com/webapi/v1/banks";
    const getNigerianBanks = async () => {
      const res = await fetch(url, {
        headers: {
          "x-api-key": "z2BhpgFNUA99G8hZiFNv77mHDYcTlecgjybqDACv"
        }
      })

     const banks = await res.json();
     return banks;
    }

    const obs = from(getNigerianBanks());
    return obs;
        
  }



  submitCustomerForBSAnalysis(form): Observable<any>{

    let url = "https://dataupload.creditclan.com/api/v3/bankstatement/initiate";
    const initiateBSForCustomer = async (form) => {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(form),
        headers: {
          "x-api-key": "z2BhpgFNUA99G8hZiFNv77mHDYcTlecgjybqDACv"
        }
      })

     const banks = await res.json();
     return banks;
    }
    const obs = from(initiateBSForCustomer(form));
    return obs;
  }
}
