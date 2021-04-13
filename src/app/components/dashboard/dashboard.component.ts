import {
  Component,
  OnInit,
  Injector,
  AfterViewInit,
  ChangeDetectorRef
} from "@angular/core";
import { UserComponent } from "../user/user.component";
import { defer, Subscription } from "rxjs";
import { Bank, DashboardData } from "../../models/dashboard-data";
import { Router } from "@angular/router";
import {
  PaymentApi,
  PaymentPlans,
  PaymentInitiationReturnVal
} from "../../models/PaymentPlans";
// import { PaystackResponse } from "src/app/models/payStack-response";
import { HttpClient } from "@angular/common/http";
// import { EmailVerifiedComponent } from "../email-verified/email-verified.component";
import { timeout, catchError } from "rxjs/operators";
import { StatementsRecentlyAnalysed } from "src/app/models/StatementsRecentlyAnalysed";
import { AlertObject, Alert } from "src/app/models/Alert";

declare var CreditClan: any;

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent extends UserComponent
  implements OnInit, AfterViewInit {
  screensize: string = "desktop";
  origin: string;
  // this.generalservice.checkDisplayAndSetAppropriateView();
  theUserDetails: object = {};
  payStackPayment: PaymentApi;
  totalStatements: string | number;
  preventMemoryLeakage: Subscription;
  dashBoardDataFromApiCall: DashboardData = {};
  currentUsersSubscription: PaymentPlans;
  dontShow: boolean = false;
  userWantsToSendCustomerForBS: boolean = false;
  NigerianBanks: Bank[] = [];
  public alertContainer: AlertObject = { instance: null };

  cc: any;

  public title: string;
  constructor(
    injector: Injector,
    private router: Router,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {
    super(injector);
    this.origin = sessionStorage.getItem("origin");
  }

  async ngOnInit() {
    window.addEventListener("resize", e => {
      this.screensize = this.generalservice.changeScreenDisplay();
      // console.log(this.screensize);
    });

    window.addEventListener("message", (e: MessageEvent) => {
      if (e.data == "cclan-analysis-completed") {
        // console.log(e.data);
        this.updateThingsAsTheyShouldBe();
        this.generalservice.broadCastGetTransactionHistoryMessage('fetch history')
      }
    });

    
    if (sessionStorage.getItem("allBanks")) {
      let allBanks = JSON.parse(sessionStorage.getItem("allBanks"));
      this.NigerianBanks = allBanks["data"] as Array<Bank>;
      return;
    }

     super.getAllNigerianBanks().subscribe(
       val => {
         sessionStorage.setItem("allBanks", JSON.stringify(val));
         this.NigerianBanks = val.data;
       },
       err => {
         console.log({err});
       }
     )
  }

  ngAfterViewInit() {
    // this.displayAppropriateSectionsForLendUsers();
    this.retrieveAllDashboardData();
    this.getUserDetails();
    // this.attachDynamicClickEvent();
    this.checkIfTransactionIDIsPresentAndHandleIt();
    const token = this.generalservice.getSavedToken()
      ? `Bearer ${this.generalservice.getSavedToken()}`
      : null;
    // this will initialize the creditclan widget, if successfull then no errors will occur
    // however if there is an error, then the global error notification cycle will display an appropriate
    // error to notify the user.
    try {
      this.cc = CreditClan.init("z2BhpgFNUA99G8hZiFNv77mHDYcTlecgjybqDACv", {
        class: "ccopen",
        token: token
      });
    } catch (e) {
      this.generalservice.globalNotificationModal(e);
    }

    //toggle article slidable element

    let slidableArticle = document.querySelector(".slidable-container");
    let slidableCloser = document.querySelector(".slidable-close");
    let viewJs = document.querySelector(".viewjs");
    let realDoc = document.querySelector(".real") as HTMLDivElement;
    let realDocTwo = document.querySelector(".real-two") as HTMLDivElement;
    let realDocSecond = document.querySelector(
      ".real-second"
    ) as HTMLDivElement;
    let realDocTwoSecond = document.querySelector(".real-second-two");
    let placeholder = document.querySelector(".placeholder-one") as HTMLElement;
    let InnerContainer = document.querySelectorAll(
      ".slidable-container__inner"
    ) as NodeList;
    // let placeholderTwo = document.querySelector(
    //   ".placeholder-two"
    // ) as HTMLElement;
    let placeholderThree = document.querySelector(
      ".placeholder-three"
    ) as HTMLElement;
    let placeholderFour = document.querySelector(
      ".placeholder-four"
    ) as HTMLElement;
    let dashboardSettingsLink = document.querySelector(
      ".dashboard__settings"
    ) as HTMLElement;

    //open the slider when button is clicked
    viewJs.addEventListener("click", e => {
      slidableArticle.classList.add("show");
      (InnerContainer[0] as HTMLDivElement).style.display = "block";
      (InnerContainer[1] as HTMLDivElement).style.display = "none";
      realDocTwo.style.display = "block";
      placeholder.style.display = "block";
      realDoc.style.display = "flex";
      setTimeout(() => {
        //
        // placeholder.style.display = "none";
        // placeholderTwo.style.display = "none";
      }, 1500);
    });

    //open the slider for the link
    dashboardSettingsLink.addEventListener("click", e => {
      // console.log(e);
      e.preventDefault();

      (InnerContainer[0] as HTMLElement).style.display = "none";
      (InnerContainer[1] as HTMLElement).style.display = "block";
      slidableArticle.classList.add("show");

      setTimeout(() => {
        realDocSecond.style.display = "flex";
        // realDocSecond.style.display = "flex";
        (realDocTwoSecond as HTMLDivElement).style.display = "block";
        placeholderThree.style.display = "none";
        placeholderFour.style.display = "none";
      }, 1500);
    });

    //close the slider when the close button is clicked
    slidableCloser.addEventListener("click", e => {
      // console.log(e);
      setTimeout(() => {
        realDoc.style.display = "none";
        realDoc.style.display = "none";
        realDocSecond.style.display = "none";
        (realDocTwoSecond as HTMLElement).style.display = "none";
        placeholder.style.display = "block";
        // placeholderTwo.style.display = "initial";
        placeholderThree.style.display = "block";
        placeholderFour.style.display = "initial";
      }, 1500);
      slidableArticle.classList.remove("show");
    });

    let settingsForm = document.querySelectorAll(".settings__form");
    let settingsHeader = document.querySelectorAll(".settings-item-header");
    let settingsItem = document.querySelectorAll(".settings-item");
    let edit = document.querySelectorAll(".edit");
    let up = document.querySelectorAll(".up");

    settingsHeader.forEach((el, i) => {
      el.addEventListener("click", e => {
        // console.log(e);
        settingsForm[i].classList.toggle("show");
        settingsItem[i].classList.toggle("active");
      });
    });

    this.cd.detectChanges();
  }

  // this retrieves all necessary data about the user for use in this component.
  async retrieveAllDashboardData() {
    let totalStatements = document.getElementById(
      "totalStatements"
    ) as HTMLHeadingElement;
    let emailVerification = document.getElementById(
      "emailVerification"
    ) as HTMLParagraphElement;
    // typescript mixin is really awesome!
    // i can mix 2 types together, my custom type and inbuilt type
    const tempDashBoardData: DashboardData & Object = {
      ...this.generalservice.getUserSavedDataFromStorage()
    };
    if (tempDashBoardData.hasOwnProperty("completed")) {
      this.dashBoardDataFromApiCall = { ...tempDashBoardData };
      this.insertTheNecessaryDataIntoDashboard(this.dashBoardDataFromApiCall);
      return;
    }
    this.preventMemoryLeakage = defer(
      async () => await super.fetchDashBoardDetails()
    )
      .pipe(timeout(60000))
      .subscribe(
        (val: DashboardData) => {
          this.dashBoardDataFromApiCall = { ...val };
          let topupAnchor = document.getElementById(
            "topup"
          ) as HTMLButtonElement;
          this.disableAnalyseButton(this.dashBoardDataFromApiCall);
          this.totalStatements =
            val.user.transactions_left == 0
              ? "0"
              : val.user.transactions_left.toString().substring(0, 4);
          totalStatements.innerText = this.totalStatements.toString();
          this.handleUserEmailNotVerified(
            this.dashBoardDataFromApiCall,
            emailVerification
          );
          this.handleUserDoesNotHaveActivePlan(
            this.dashBoardDataFromApiCall,
            topupAnchor
          );
        },
        err => {
          // console.log(err);
          this.handleError(err, totalStatements, emailVerification);
        }
      );
  }

  // this function will arrange things in the dashboard;
  // if the dashboardData is already available.
  insertTheNecessaryDataIntoDashboard(val) {
    let emailVerification = document.getElementById(
      "emailVerification"
    ) as HTMLParagraphElement;
    let totalStatements = document.getElementById(
      "totalStatements"
    ) as HTMLHeadingElement;
    let topupAnchor = document.getElementById("topup") as HTMLButtonElement;
    this.disableAnalyseButton(this.dashBoardDataFromApiCall);
    this.totalStatements =
      val.user.transactions_left == 0
        ? "0"
        : val.user.transactions_left.toString().substring(0, 4);
    totalStatements.innerText = this.totalStatements.toString();
    this.handleUserEmailNotVerified(
      this.dashBoardDataFromApiCall,
      emailVerification
    );
    this.handleUserDoesNotHaveActivePlan(
      this.dashBoardDataFromApiCall,
      topupAnchor
    );
  }

  getUserDetails(): void {
    // debugger;
    this.theUserDetails = super.userDetails;
    // console.log(super.theUserDetails);
  }

  // add a changePlan Anchor element dynamically
  async insertChangePlanAnchorDynamically(e) {
    let innerText = e.srcElement.textContent;
    e.stopPropagation();
    e.stopImmediatePropagation();
    let anchor = e.srcElement as HTMLButtonElement;
    const changePlan = document.getElementById(
      "changePlan"
    ) as HTMLParagraphElement;
    // changePlan.innerHTML = this.payStackPayment.changePlans();
    // console.log(payNow.innerHTML);

    this.generalservice.loading4button(anchor, "yes", "Please wait ....");
    try {
      if (JSON.parse(sessionStorage.getItem("currentUsersSubscription"))) {
        this.currentUsersSubscription = JSON.parse(
          sessionStorage.getItem("currentUsersSubscription")
        );
        this.processAndHadleTopUpIfDataIsCached(changePlan, anchor, innerText);
      } else {
        if (this.dashBoardDataFromApiCall.user.transactions_left > 1) {
          this.generalservice.globalNotificationModal(
            "You still have an active subscription, You can subscribe to a new plan when you have no statements left."
          );
          this.generalservice.loading4button(anchor, "done", "Top up");
          return;
        }
        this.processAndHandleTopUpIfDataIsNotCached(
          changePlan,
          anchor,
          innerText
        );
      }
    } catch (e) {
      sessionStorage.removeItem("currentUsersSubscription");
      this.processAndHandleTopUpIfDataIsNotCached(
        changePlan,
        anchor,
        innerText
      );
    }
  }

  // prevents memory leakage due to unsuscribed observables
  ngOnDestroy() {
    // this.preventMemoryLeakage.unsubscribe();
  }

  // routes to billing page
  routeToBilling(e) {
    const closeModal = document.getElementById("closeModal");
    closeModal.click();
    this.router.navigate(["/billing"]);
  }
  // if the topup anchor is available, then add a click listener to it,
  // once the click happens add a click listener to the changePlansDynamically button
  // which will by then have been attached to the DOM and then fire the routetobilling function
  // on the paystackpaymnet class.
  attachDynamicClickEvent() {
    try {
      const topup = document.getElementById("topup") as HTMLAnchorElement;
      topup.addEventListener("click", e => {
        const changePlansDynamically = document.getElementById(
          "changePlansDynamically"
        );
        changePlansDynamically.addEventListener("click", e =>
          this.routeToBilling(e)
        );
      });
    } catch (e) {
      // console.log(e);
    }
  }

  async verifyUserEmail() {
    const email = this.dashBoardDataFromApiCall.user.email;
    const hiddenSecondModalButton = document.getElementById(
      "hiddenSecondModalButton"
    ) as HTMLButtonElement;
    const emailVerification = document.getElementById(
      "emailVerification"
    ) as HTMLParagraphElement;
    const imagePlaceHolder = document.getElementById(
      "imagePlaceHolder"
    ) as HTMLDivElement;
    const insideLife = document.querySelector(".insideLife") as HTMLDivElement;
    this.dontShow = false;
    defer(async () => await super.verifyEmail(email))
      .pipe(timeout(20000))
      .subscribe(
        val => {
          if (val) {
            this.dontShow = true;
            hiddenSecondModalButton.click();
            this.sentActivationLinkSuccessfully(
              hiddenSecondModalButton,
              emailVerification,
              imagePlaceHolder,
              insideLife
            );
          }
        },
        err => {
          this.handleErrorsFromSendingEmails(
            err,
            hiddenSecondModalButton,
            emailVerification,
            imagePlaceHolder,
            insideLife
          );
        }
      );
  }

  emailVerified(p: HTMLParagraphElement) {
    p.innerHTML = `<i class="fa fa-check-circle fa-2x"></i> Email Verified`;
    p.removeEventListener("click", this.verifyUserEmail);
    this.title = "Email verified!";
    p.style.cursor = "auto";
    this.dontShow = true;
  }

  // this function checks whether the user email has been verified!
  handleUserEmailNotVerified(data: DashboardData, p: HTMLParagraphElement) {
    if (!data.user.email_verified) {
      this.modifyParagraphHoldingEmailVerificationMessage(p);
    } else {
      this.emailVerified(p);
    }
  }

  // displays appropriate message to user if activation link was sent!
  sentActivationLinkSuccessfully(
    btn: HTMLButtonElement,
    p: HTMLParagraphElement,
    imgPH: HTMLDivElement,
    inner: HTMLDivElement
  ) {
    imgPH.innerHTML = `
      <img
      style="object-fit: cover;"
      class="img-fluid position-relative u-z-index-3 "
      src="../../../assets/svg/mockups/email-sent.svg"
      alt="Image description"
    />`;
    inner.innerHTML = `
      <p style="color: #222222;">
      Activation email has been sent to
      <span style="font-weight: 400; color: #ff9800">
        ${this.dashBoardDataFromApiCall.user.email}
      </span>
    </p>
    `;
    this.dontShow = true;
    btn.click();
  }
  // this function checks how much the transaction left the person has
  handleUserDoesNotHaveActivePlan(data: DashboardData, a: HTMLButtonElement) {
    if (data.user.transactions_left < 1) {
      a.textContent = "Subscribe";
    } else if (
      data.user.transactions_left >= 1 &&
      data.user.transactions_left < 3
    ) {
      a.textContent = "Top Up";
    } else {
      a.textContent = "Top Up";
    }
  }

  // handles error by displaying appropriate message to user if error
  handleErrorsFromSendingEmails(
    e,
    btn: HTMLButtonElement,
    p: HTMLParagraphElement,
    imgPH: HTMLDivElement,
    inner: HTMLDivElement
  ) {
    imgPH.innerHTML = `
    <img
    style="object-fit: cover;"
    class="img-fluid position-relative u-z-index-3 "
    src="../../../assets/svg/mockups/no-response.svg"
    alt="Image description"
  />`;
    inner.innerHTML = `
  <p style="color: #222222;">
   Unable to send activation email to
   <span style="font-weight: 400; color: #ff9800">
    ${this.dashBoardDataFromApiCall.user.email}
  </span>
   Please try again later!
  </p>
  `;
    this.dontShow = true;
    btn.click();
  }

  handleError(
    e,
    statement: HTMLParagraphElement,
    emailHolder: HTMLParagraphElement
  ) {
    if (e.name == "TimeoutError") {
      statement.textContent = "!";
      this.dashBoardDataFromApiCall = { user: { fullname: "!" } };
      this.modifyParagraphHoldingEmailVerificationMessage(emailHolder);
    } else {
      statement.textContent = "!";
      this.dashBoardDataFromApiCall = { user: { fullname: "!" } };
      this.modifyParagraphHoldingEmailVerificationMessage(emailHolder);
    }
  }

  modifyParagraphHoldingEmailVerificationMessage(p: HTMLParagraphElement) {
    this.dontShow = true;
    p.textContent = "Email not verified!";
    this.title = "Click to verify your email!";
    p.style.cursor = "pointer";
    this;
    p.addEventListener("click", () => {
      this.verifyUserEmail();
    });
  }

  // this will clean up the paystack object
  cleanThingsUp() {
    delete this.payStackPayment;
    // delete this.currentUsersSubscription;
  }

  async processAndHandleTopUpIfDataIsNotCached(
    changePlan: HTMLParagraphElement,
    anchor: HTMLButtonElement,
    innerText: string
  ) {
    super
      .getCurrentUsersPlan(this.dashBoardDataFromApiCall.user.active_package)
      .subscribe(
        async (val: PaymentPlans) => {
          this.currentUsersSubscription = val;
          sessionStorage.setItem(
            "currentUsersSubscription",
            JSON.stringify(this.currentUsersSubscription)
          );
          if (this.currentUsersSubscription.name.includes("free")) {
            this.handleCaseOfUserBeingOnFreePlan();
            return;
          }
          try {
            let response: PaymentInitiationReturnVal = await super.retrievePaymentStuff(
              this.dashBoardDataFromApiCall.user.active_package.toString()
            );
            this.payStackPayment = super.replyWithNewPaymentApi(
              response.package_price.toString(),
              response.payment_reference
            );
            changePlan.innerHTML = this.payStackPayment.changePlans();
            (anchor.nextElementSibling as HTMLButtonElement).click();
            this.generalservice.loading4button(anchor, "done", `${innerText}`);
          } catch (e) {
            this.handleErrorFromFetchingPlans(e, anchor, innerText, changePlan);
          }
        },
        err =>
          this.handleErrorFromFetchingPlans(err, anchor, innerText, changePlan)
      );
  }

  // this allows faster topup. it makes one less api call. PS, this function was
  // written before micheal made modifications. i might come back to change the
  // way the function works.
  async processAndHadleTopUpIfDataIsCached(
    changePlan: HTMLParagraphElement,
    anchor: HTMLButtonElement,
    innerText
  ) {
    if (
      JSON.parse(sessionStorage.getItem("currentUsersSubscription")) ||
      (this.currentUsersSubscription &&
        this.currentUsersSubscription.name.includes("free"))
    ) {
      this.handleCaseOfUserBeingOnFreePlan();
      return;
    }
    try {
      let response: PaymentInitiationReturnVal = await super.retrievePaymentStuff(
        this.dashBoardDataFromApiCall.user.id.toString()
      );
      this.payStackPayment = super.replyWithNewPaymentApi(
        response.package_price.toString(),
        response.payment_reference
      );
      changePlan.innerHTML = this.payStackPayment.changePlans();
      (anchor.nextElementSibling as HTMLButtonElement).click();
      this.generalservice.loading4button(anchor, "done", `${innerText}`);
    } catch (e) {
      // console.log(e);
    }
  }

  handleErrorFromFetchingPlans(
    e,
    anchor: HTMLButtonElement,
    text: string,
    changePlan: HTMLParagraphElement
  ) {
    // alert(
    //   "You still have an active subscription, You can subscribe to a new plan when you have less than 2 statements left."
    // );
    this.generalservice.globalNotificationModal(
      "You still have an active subscription, You can subscribe to a new plan when you have no statements left."
    );
    sessionStorage.removeItem("currentUsersSubscription");
    this.generalservice.loading4button(anchor, "done", text);
  }

  // this disables the analyse button if the users current package is null
  disableAnalyseButton(currentUserDetails: DashboardData) {
    const buttonAnalyse = document.getElementById(
      "buttonAnalyse"
    ) as HTMLAnchorElement;
    if (
      !currentUserDetails.user.current_package_validity ||
      currentUserDetails.user.transactions_left < 1
    ) {
      buttonAnalyse.style.pointerEvents = "none";
    } else {
      buttonAnalyse.style.pointerEvents = "auto";
    }
  }

  // this code violates the DRY principle
  clickHiddenAnchorToStartAnalysisProcess(evt): void {
    let anchor = evt.srcElement as HTMLButtonElement;
    // console.log(anchor);
    if (!this.dashBoardDataFromApiCall.user.current_package_validity) return;
    let ccopen = document.querySelector(".ccopen") as HTMLAnchorElement;
    ccopen.click();
    try {
      if (CreditClan.iframe) {
        this.generalservice.loading4button(anchor, "done", "Analyse");
      }
    } catch (e) {
      // catch any errors and send it to the globalNotifier to notify the user
      this.generalservice.globalNotificationModal(e);
      this.generalservice.loading4button(anchor, "done", "Analyse");
    }
  }

  public handleCaseOfUserBeingOnFreePlan() {
    this.router.navigate(["billing"]);
  }

  public gotoSettings() {
    this.router.navigate(["/user/settings"]);
  }

  // this function checks if there's is a transaction and then handles it appropriately
  private checkIfTransactionIDIsPresentAndHandleIt() {
    const transactionID = sessionStorage.getItem("transactionID");
    // console.log(transactionID);
    if (transactionID) {
      this.processExistingTransactionID(transactionID);
    }
  }

  //
  async processExistingTransactionID(transID: string) {
    // console.log(this.dashBoardDataFromApiCall);
    if (this.dashBoardDataFromApiCall.user == undefined) {
      // console.log(this.dashBoardDataFromApiCall);
      return;
    } else {
      if (this.dashBoardDataFromApiCall.user.transactions_left >= 1) {
        try {
          const response: StatementsRecentlyAnalysed = await super.analyseTransID(
            transID
          );
          this.generalservice.globalNotificationModal(response);
        } catch (e) {
          // console.log(e);
          sessionStorage.removeItem("transactionID");
        }
      }
    }
  }

  get emailAndName() {
    try {
      let data: DashboardData = {};
      data = { ...JSON.parse(sessionStorage.getItem("userDashboardData")) };
      document.querySelector(".placeholder-one")["style"]["display"] = "none";
      return {
        fullname: data.user.fullname,
        email: data.user.email
      };
    } catch (e) {
      return;
    }
  }
  // fetchTransactionHistory() {}

  displayAppropriateSectionsForLendUsers() {
    if (sessionStorage.getItem("origin")) {
      // const cover = document.querySelector(
      //   "coverForUserFromLend"
      // ) as HTMLDivElement;
      const userFromLend = document.getElementById("userFromLend");
      const mainUser = document.getElementById("mainUser");
      // cover.style.display = "none";
      // cover.style.zIndex = "-1";
      mainUser.style.display = "none";
      userFromLend.style.display = "block";
    }
  }

  // i am here working

  async updateThingsAsTheyShouldBe() {
    let totalStatements = document.getElementById(
      "totalStatements"
    ) as HTMLHeadingElement;

    defer(async () => await super.fetchDashBoardDetails())
      .pipe(timeout(60000))
      .subscribe(
        (val: DashboardData) => {
          // console.log(val);
          if (val.user.transactions_left != 0) {
            totalStatements.innerText = String(val.user.transactions_left);
            sessionStorage.setItem("userDashboardData", JSON.stringify(val));
          } else {
            sessionStorage.setItem("userDashboardData", JSON.stringify(val));
            // let buttonAnalyse = document.getElementById('buttonAnalyse');
            this.alertContainer["instance"] = new Alert(
              "alert-soft-danger fade show",
              "fa fa-minus-circle alert-icon mr-3",
              "You 0 statments left to run. Please subscribe to a package"
            );
          }
        },
        err => {
          console.log(err);
          // this.handleError(err, totalStatements, emailVerification);
        }
      );
  }

  removeInstance() {
    delete this.alertContainer["instance"];
  }


  startBSForCustomer(){
    this.userWantsToSendCustomerForBS = true;
    document.getElementById('startBSintiationForCustomer').click();
  }
}




// C:\Users\Ndubisi\Downloads\ngrok-stable-windows-amd64
