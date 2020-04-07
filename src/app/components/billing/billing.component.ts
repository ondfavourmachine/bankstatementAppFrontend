import {
  Component,
  OnInit,
  Inject,
  ViewChildren,
  QueryList,
  ElementRef
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { PaystackResponse } from "../../models/payStack-response";
import { GeneralService } from "src/app/services/general.service";
import { HttpClient } from "@angular/common/http";
// import { BILLING_API } from "src/app/token";
import {
  PaymentPlans,
  PaymentInitiationReturnVal
} from "../../models/PaymentPlans";
import { Observable, Subscription, TimeoutError } from "rxjs";
import { PaymentApi } from "../../models/PaymentPlans";
import { PaymentService } from "src/app/services/Payments/payment.service";
import { Alert, AlertObject } from "../../models/Alert";
import { timeout } from "rxjs/operators";
// import { element } from "protractor";
import { DashboardData } from "src/app/models/dashboard-data";

@Component({
  selector: "app-billing",
  templateUrl: "./billing.component.html",
  styleUrls: ["./billing.component.css"]
})
export class BillingComponent implements OnInit {
  @ViewChildren("planHolder") planHolder: QueryList<ElementRef>;
  public planPrice: string;
  public title: string;
  public plans: Array<PaymentPlans>;
  public reference;
  transactionID: number;
  alertContainer: AlertObject = { instance: null };
  payStackPayment: PaymentApi;

  constructor(
    private router: Router,
    public generalservice: GeneralService,
    private activatedroute: ActivatedRoute,
    private http: HttpClient,
    // @Inject(BILLING_API) private biilingApi,
    private payment: PaymentService
  ) {}

  ngOnInit() {
    // this.reference = `ref-${this.randomString(15)}`;
    this.getBillingPlans();
    this.generalservice.notifier$.subscribe((val: PaystackResponse) => {
      if (typeof val == "object") {
        let body = {
          payment_reference: val.reference,
          transaction_id: this.transactionID
        };
        this.sendReferenceOfPaymentToBackend(body);
        // this.router.navigate(["/user/dashboard"]);
      }
    });

    this.generalservice.changeDashboardDataInStorage$.subscribe(async val => {
      if (val == "change DashBoardData In Storage.") {
        // fetch the changed data from server
        // then modify it in the sessionstorage
        this.modifyTheUserDataInStorage("/freebies");
      }
    });
  }
  ngAfterViewInit() {
    if (this.planHolder.length == 3) {
      this.planHolder.forEach(element => {
        let div = element.nativeElement as HTMLDivElement;
        div.classList.value = "col-md-4 g-mb-30";
      });
    }
  }

  getPlanPrice(event: MouseEvent) {
    this.planPrice =
      event.target["dataset"]["id"].toString().substring(0, 1) +
      "," +
      event.target["dataset"]["id"].toString().substring(1);
  }

  getAmount(index): string {
    // console.log(this.plans[index].price + "00");
    return this.plans[index].price === 0 ? "1" : this.plans[index].price + "00";
  }

  private getBillingPlans() {
    let plans: Array<any> = this.activatedroute.snapshot.data.result;
    this.plans = this.modifyPaymentPlanResponseFromResolver(plans);
  }

  public startPaymentProcess(plan: PaymentPlans, index) {
    const paymentTrigger = document.getElementById(
      index.toString()
    ) as HTMLButtonElement;
    if (plan.name == "free") {
      this.subscribeToFreePlan(paymentTrigger);
    } else {
      this.generalservice.loading4button(
        paymentTrigger,
        "yes",
        "Please wait..."
      );
      // if (plan.name == "free") return this.router.navigate(["/freebies"]);
      this.getTransactionRefAndModifyParameters(plan, paymentTrigger);
    }
  }
  getTransactionRefAndModifyParameters(
    plan: PaymentPlans,
    trigger: HTMLButtonElement
  ) {
    this.payment
      .initiatePaymentToGetTransactionRef(plan.id.toString())
      .pipe(timeout(2000))
      .subscribe(
        (val: PaymentInitiationReturnVal) => {
          // console.log(val);
          this.transactionID = val.transaction_id;
          this.payStackPayment = new PaymentApi(
            this.generalservice,
            val.package_price.toString() === "0"
              ? "1"
              : val.package_price.toString(),
            val.payment_reference
          );
          setTimeout(() => {
            const hiddenAngularPaystackButton = document.getElementById(
              "hiddenAngularPaystackButton"
            ) as HTMLAnchorElement;
            hiddenAngularPaystackButton.click();
            this.generalservice.loading4button(trigger, "done", "Pay Now");
          }, 850);
        },
        err => this.handleInitiationOrPaymentVerificationErrors(err, trigger)
      );
  }

  sendReferenceOfPaymentToBackend(paymentDetails: object) {
    this.payment.verifyPayment(paymentDetails).subscribe(
      async val => {
        // alert
        this.alertContainer["instance"] = new Alert(
          "alert-dismissible fade show g-bg-teal g-color-white rounded-50",
          "success",
          `${val.message}`
        );
        this.modifyTheUserDataInStorage("/user/dashboard");
      },
      err => this.handleInitiationOrPaymentVerificationErrors(err)
    );
  }

  handleInitiationOrPaymentVerificationErrors(e, btn?: HTMLButtonElement) {
    if (e instanceof TimeoutError) {
      this.alertContainer["instance"] = new Alert(
        "alert-dismissible fade show g-bg-red g-color-white rounded-50",
        "fa fa-minus-circle alert-icon mr-3",
        "The Server response timed out. Please try again"
      );
      if (btn) {
        this.generalservice.loading4button(btn, "done", "Pay now");
      }
      setTimeout(() => {
        delete this.alertContainer["instance"];
      }, 2500);
    }
  }

  modifyPaymentPlanResponseFromResolver(plans: Array<PaymentPlans>) {
    return this.generalservice.getUserSavedDataFromStorage().user
      .free_plan_used == 1
      ? plans.slice(1)
      : plans;
  }

  subscribeToFreePlan(btn: HTMLButtonElement) {
    this.generalservice.loading4button(btn, "yes", "Please wait...");
    this.payment
      .freePlanSubscription()
      .pipe(timeout(20000))
      .subscribe(
        val => {
          if (val.completed) {
            // change dashboardData Saved in Session Storage. this Very Important
            // the function below will broadcast a message to change the dashboardData
            // in the storage.
            this.generalservice.broadcastMessageToChangeDashboardDataInStorage(
              "change DashBoardData In Storage."
            );
            this.generalservice.loading4button(btn, "done", "Free");
          }
        },
        err => window.location.reload()
      );
  }

  async modifyTheUserDataInStorage(route: string) {
    try {
      let response: DashboardData = await this.payment.getUserDataFromServer();
      this.generalservice.updateUserDataInStorage(response);
      this.router.navigate([route]);
    } catch (e) {
      // console.log(e);
      this.generalservice.logOut();
    }
  }

  clearTransactionIDIfPresent() {
    return sessionStorage.getItem("transactionID")
      ? sessionStorage.removeItem("transactionID")
      : null;
  }
  // try {
  //   let response: DashboardData = await this.payment.getUserDataFromServer();
  //   this.generalservice.updateUserDataInStorage(response);
  //   this.router.navigate(["/freebies"]);
  // } catch (e) {
  //   console.log(e);
  //   this.generalservice.logOut();
  // }
}
