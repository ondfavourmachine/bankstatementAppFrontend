import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { RegistrationForm } from "../models/registrationForm";
import { LoginForm } from "../models/loginForm";
import { ResetPassword } from "../models/resetPassword";
import { switchMap, catchError, retry } from "rxjs/operators";
import { GeneralApi } from "../generalApi";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  detailsFromLend: object = {};
  constructor(private http: HttpClient) {}

  // makes an http post registration request and returns an observable response
  public registrationRequest(form: RegistrationForm): Observable<any> {
    return this.http.post(`${GeneralApi}register`, form);
  }

  // makes an http post login request and returns an observable response
  public LoginRequest(form?: LoginForm): Observable<any> {
    // console.log(form);
    return this.http.post(`${GeneralApi}login`, form);
  }

  public forgotPassword(email: Object): Observable<any> {
    return this.http.post(`${GeneralApi}profile/forgot-password`, email);
  }

  public resetPassword(form: ResetPassword): Observable<any> {
    return this.http.post(`${GeneralApi}profile/reset-password`, form);
  }

  public getRecentlyAnalysedStatements(transactionID: string): Promise<any> {
    return this.http
      .get(`${GeneralApi}analytics/status/${transactionID}`)
      .toPromise();
  }

  handleTrafficFromLend(token: string, div: HTMLDivElement) {
    let headers = new HttpHeaders({
      "X-API-KEY": "z2BhpgFNUA99G8hZiFNv77mHDYcTlecgjybqDACv"
    });
    setTimeout(() => {
      if (!div.innerText.includes("error")) div.innerText = "Authorising ...";
    }, 2000);
    return this.http
      .post(
        `https://mobile.creditclan.com/api/v3/lender/authorize`,
        { token },
        { headers }
      )
      .pipe(
        switchMap(val => {
          const { email, business_name, phone, name } = val["data"];
          this.detailsFromLend = {
            email,
            business_name,
            phone,
            name
          };
          div.innerText = "Please wait ...";
          return this.LoginRequest({ email, password: "password" });
        }),
        catchError(err => of(err)),
        retry(2)
      );
  }
}

// localhost:4200/authorize?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjExODAiLCJlbWFpbCI6ImRhbWlsb2xhLnNob2ZhcmFzaW5AY3JlZGl0Y2xhbi5jb20iLCJpYXQiOjE1ODQzNjc4MjQsImV4cCI6MTU4NDU4MzgyNCwibGVuZGVyX2lkIjoiNjg0OSIsImlzX2NvbXBhbnlfc3RhZmYiOmZhbHNlLCJjb21wYW55X2lkIjpudWxsLCJicmFuY2hfaWQiOm51bGwsImlzX2hlYWRfb2ZmaWNlIjpudWxsfQ.4xG0DkwApmrKzk-hR4sBKSUPbkgIvED1cZCUustqkb4
