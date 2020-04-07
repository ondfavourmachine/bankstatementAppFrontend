import { Injectable, Inject, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { GeneralService } from "../general.service";
import { GeneralApi } from "src/app/generalApi";

@Injectable({
  providedIn: "root"
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  initiatePaymentToGetTransactionRef(id: string): Observable<any> {
    return this.http
      .get(`${GeneralApi}payment/initiate/${id}`)
      .pipe(map(val => val["payment"]));
  }

  verifyPayment(body): Observable<any> {
    return this.http.post(`${GeneralApi}payment/verify`, body);
  }

  freePlanSubscription(): Observable<any> {
    return this.http.get(`${GeneralApi}payment/free`);
  }

  getUserDataFromServer(): Promise<any> {
    return this.http.get(`${GeneralApi}dashboard/`).toPromise();
  }
}
