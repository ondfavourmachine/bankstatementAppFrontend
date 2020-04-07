import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  Router,
  ActivatedRoute,
  NavigationStart,
  NavigationEnd
} from "@angular/router";
import { PaymentService } from "./services/Payments/payment.service";
import { PaymentApi } from "./models/PaymentPlans";
import { GeneralService } from "./services/general.service";
import {
  StatementsRecentlyAnalysed,
  AnalysisSuccessOrPreviewMessage
} from "./models/StatementsRecentlyAnalysed";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, OnDestroy {
  title: string = "";
  recentlyAnalysed: AnalysisSuccessOrPreviewMessage;

  destroynotification: Subscription;
  constructor(
    private router: Router,
    public generalService: GeneralService,
    private activatedRoute: ActivatedRoute,
    private payment: PaymentService
  ) {
    this.router.events.subscribe(val => {
      if (val instanceof NavigationStart) {
        if (val.url.includes("authorize")) {
          this.generalService.fromLend = true;
          let nav: NavigationStart = { ...val };
          this.handleUsersFromLend(nav);
        }
      }
    });
  }

  ngOnInit() {
    this.destroynotification = this.generalService.notifyGlobally$.subscribe(
      val => {
        if (val.length < 2) {
          return;
        }
        // console.log(val);
        this.notifyUserOfIssuesArising(val);
      }
    );

    window.addEventListener("storage", e => {
      if (e.newValue == null) {
        this.router.navigate(["/login"]);
      }
    });

    // this.testingStuff();
  }

  // async testingStuff() {
  //   console.log(new PaymentApi(this.generalService, this.payment));
  // }

  notifyUserOfIssuesArising(val: any) {
    const triggerButton = document.getElementById(
      "triggerButton"
    ) as HTMLButtonElement;
    const insideModalBody = document.getElementById(
      "insideModalBody"
    ) as HTMLDivElement;
    if (typeof val == "object" && val instanceof ReferenceError) {
      insideModalBody.innerHTML = this.returnMessage(
        "Oops! due to some error, you will not be able to analyse documents at this time. Please check your internet connection and try reloading the page.",
        "warning.svg"
      );
      triggerButton.click();
    } else if (typeof val == "object" && val["analytics_pdf"]) {
      // console.log(val);
      const pdf = val["analytics_pdf"];
      insideModalBody.innerHTML = this.analysisMessage(pdf);
      triggerButton.click();
    } else if (typeof val == "string" && val.includes("preview")) {
      // console.log(val);
      this.previewMessage(insideModalBody, val);
      triggerButton.click();
    } else {
      insideModalBody.innerHTML = this.returnMessage(val);
      triggerButton.click();
    }
  }

  returnMessage(str: any, alternativeImage?: string) {
    // {{
    //   dashBoardDataFromApiCall?.user?.current_package_validity
    //     | date: "fullDate"
    // }}. If you wish to continue, you will be charged N
    // {{ currentUsersSubscription?.price }}.
    return `<div
      style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center"
      >
          <div>
              <img
              class="position-relative u-z-index-3 mx-5"
              src="../../../assets/svg/mockups/${
                !alternativeImage ? "card.svg" : alternativeImage
              }"
              alt="Image description"
                />
          </div>
      ${str}

      <button (click)="closeModal()" type="button" style="margin-top: 20px;" class="btn btn-secondary" data-dismiss="modal">
          I understand
      </button>
      </div>`;
  }

  closeModal() {
    // console.log("i am working!");
    if (sessionStorage.getItem("transactionID")) {
      sessionStorage.removeItem("transactionID");
    }
  }
  // public showRecentlyAnalysedPdfInAnotherWindow() {
  //   console.log("i am working-");

  // }

  get nameOfUser() {
    return (this.title = !this.generalService.getUserSavedDataFromStorage()
      ? ""
      : this.generalService.getUserSavedDataFromStorage().user.fullname);
  }

  analysisMessage(pdf: string): string {
    // console.log(this.recentlyAnalysed.analysisPdf);
    this.recentlyAnalysed = new AnalysisSuccessOrPreviewMessage(
      "data.svg",
      "Click the button below to view your recently analysed statement. You can also see the recently analysed statement when you click on view statement history in your dashboard.",
      pdf
    );
    // console.log(this.recentlyAnalysed.analysisPdf);
    return `<div
        id="HoldingAnalysisSuccessMessage"
            style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center"
      >
          <div>
              <img
              class="position-relative u-z-index-3 mx-5"
              src="../../../assets/svg/mockups/${this.recentlyAnalysed.svg}"
              alt="Image description"
                />
          </div>
          ${this.recentlyAnalysed.message}

      <a href="${this.recentlyAnalysed.analysisPdf}" target="_blank" style="margin-top: 20px;" class="btn btn-secondary">
            View Analysis
      </a>
      </div>`;
  }

  previewMessage(html: HTMLElement, pdf: string) {
    const previewMessages = new AnalysisSuccessOrPreviewMessage(
      "stop-violence.svg",
      "Sorry you do not have any current subscription and so will not be able to view the recently analysed document. Please subscibe to a plan to view your statement analysis",
      pdf
    );

    html.innerHTML = previewMessages.previewResponse();
  }

  handleUsersFromLend(obj: NavigationStart) {
    const { url } = obj;
    const lendDetails = {};
    lendDetails["url"] = url.split("?")[0];
    lendDetails["token"] = url.split("?")[1].split("=")[1];
    // console.log(lendDetails);
    this.generalService.activateNotificationFromLend(lendDetails);
  }

  ngOnDestroy() {
    this.destroynotification.unsubscribe();
  }
}
