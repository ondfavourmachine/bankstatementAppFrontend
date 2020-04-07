import { Injectable, Inject } from "@angular/core";

import { Resolve, Router } from "@angular/router";

import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { PaymentPlans } from "src/app/models/PaymentPlans";
// import { BILLING_API } from "src/app/token";
import { map, catchError } from "rxjs/operators";
import { GeneralService } from "../general.service";
import { GeneralApi } from "src/app/generalApi";
// import 'rxjs/add/observable/of';
// import 'rxjs/add/operator/delay';

@Injectable()
export class BillingPlansResolver implements Resolve<Observable<string>> {
  constructor(
    private http: HttpClient,
    private router: Router,
    private generalservice: GeneralService
  ) // @Inject(BILLING_API) private biilingApi
  {}

  resolve() {
    return this.http.get<Array<PaymentPlans>>(`${GeneralApi}packages/`).pipe(
      map((plan: PaymentPlans[]) => plan["packages"]),
      catchError(err => this.handleErrors())
    );
    // return Observable.of('Hello Alligator!').delay(2000);
  }

  handleErrors(): any {
    this.router.navigate([""]);
    this.generalservice.globalNotificationModal(
      "Oops! An error occured. Please check your internet and try again"
    );
  }
}
