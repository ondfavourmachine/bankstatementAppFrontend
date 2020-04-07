import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { GeneralService } from "../general.service";
import { Observable } from "rxjs";
import { DashboardData } from "../../models/dashboard-data";
// import { inject } from "@angular/core/testing";
import { TransactionHistory } from "src/app/models/transactionHistory";
import { GeneralApi } from "src/app/generalApi";

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
}
