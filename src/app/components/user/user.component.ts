import { Component, OnInit, Injector } from "@angular/core";
import { UserService } from "src/app/services/User/user.service";
import { Router } from "@angular/router";
import { GeneralService } from "src/app/services/general.service";
import { Observable, of } from "rxjs";
import { PaymentService } from "src/app/services/Payments/payment.service";
import { map, timeout, catchError } from "rxjs/operators";
import { PaymentPlans, PaymentApi } from "src/app/models/PaymentPlans";
import { TransactionHistory } from "src/app/models/transactionHistory";
import { AuthService } from "src/app/services/auth.service";
import { Bank } from "src/app/models/dashboard-data";
// import { switchMap } from "rxjs/operators";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"]
})
export class UserComponent implements OnInit {
  userservice: UserService;
  generalservice: GeneralService;
  authservice: AuthService;
  payment: PaymentService;
  userDetails;
  constructor(injector: Injector) {
    this.userservice = injector.get(UserService);
    this.generalservice = injector.get(GeneralService);
    this.payment = injector.get(PaymentService);
  }

  ngOnInit() {
    this.getUserDetails();
  
  }

  async fetchDashBoardDetails(): Promise<any> {
    return await this.userservice.getDashboardData().toPromise();
  }

  async submitRequestToChangeStuff(
    valueToChange: object,
    btn: HTMLButtonElement
  ): Promise<any> {
    this.generalservice.loading4button(btn, "yes", "Please wait...");
    return await this.userservice
      .updateAllOrAnyProfileField(valueToChange)
      .toPromise();
  }

  async submitRequestToChangePassword(
    valueToChange: Object,
    btn: HTMLButtonElement
  ): Promise<any> {
    this.generalservice.loading4button(btn, "yes", "Please wait...");
    return await this.userservice.updatePassword(valueToChange).toPromise();
  }

  verifyEmail(email: string): Promise<any> {
    return this.userservice.sendEmail({ email: email }).toPromise();
  }

  getUserDetails(): void {
    this.userDetails = { ...this.generalservice.getAndDecryptPayloadData() };
  }

  retrievePaymentStuff(id: string) {
    return this.payment.initiatePaymentToGetTransactionRef(id).toPromise();
  }

  getCurrentUsersPlan(id: number): Observable<PaymentPlans> {
    return this.userservice
      .fetchBillingPlans(id)
      .pipe(map(val => val["package"] as PaymentPlans));
  }

  replyWithNewPaymentApi(price: string, ref: string) {
    return new PaymentApi(this.generalservice, price.toString(), ref);
  }

  fetchUserHistoryOfTransactions(number?: string): Promise<TransactionHistory> {
    return this.userservice
      .getHistoryOfUserAnalysedStatements(number)
      .toPromise();
  }

  analyseTransID(ID: string): Promise<any> {
    return this.authservice.getRecentlyAnalysedStatements(ID);
  }

  async getAllNigerianBanks(): Promise<Bank[]>{

    return new Promise((resolve, reject) => {
      const NigerianBanks =  this.userservice.fetchBankNames();
      resolve(NigerianBanks);
    })
   
  }
}
