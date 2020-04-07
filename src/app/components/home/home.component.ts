import { Component, OnInit, AfterViewInit } from "@angular/core";
import { GeneralService } from "src/app/services/general.service";
import { Router, RouterStateSnapshot } from "@angular/router";
import { DashboardData } from "src/app/models/dashboard-data";

declare var $: any;
declare var CreditClan: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit, AfterViewInit {
  userData: any;
  cc: any;
  screensize: string = this.generalservice.checkDisplayAndSetAppropriateView();
  constructor(private generalservice: GeneralService, private router: Router) {
    try {
      this.userData = this.generalservice.getAndDecryptPayloadData();
      // console.log(this.userData);
    } catch (e) {
      return;
    }
  }

  ngOnInit() {
    $(window).on("scroll", function() {
      if ($(window).scrollTop() > 40) {
        $("#header").addClass("fixedHeader animated flipInX");
        $("#register").removeClass("text-white");
        $("#login").removeClass("text-white");
        // $("#navigation").addClass("animated flipInX");
      } else {
        // $("#navigation").removeClass("fixedHeader animated flipInX");
        $("#header").removeClass("fixedHeader animated flipInX");
        $("#register").addClass("text-white");
        $("#login").addClass("text-white");
      }
    });
    window.addEventListener("scroll", () => {
      let navigator = document.getElementById("navigation");
      try {
        if ($(window).scrollTop() > 40 && navigator) {
          navigator.classList.add("myFixedHeader");
        } else {
          navigator.classList.remove("myFixedHeader");
        }
      } catch (e) {
        return;
      }
    });
    window.addEventListener("resize", e => {
      this.screensize = this.generalservice.changeScreenDisplay();
    });
    // this.checkDisplayAndSetAppropriateView();
  }

  ngAfterViewInit() {
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
    // this.cc.open();
  }

  public checkUserSubscriptionStatus(evt) {
    let anchor = evt.srcElement as HTMLAnchorElement;
    this.generalservice.loading4Anchor(anchor, "yes", "Please wait...");
    if (!this.generalservice.getSavedToken()) {
      this.clickHiddenAnchorToStartAnalysisProcess(anchor);
      return;
    }
    let dashboard: DashboardData = JSON.parse(
      sessionStorage.getItem("userDashboardData")
    );
    if (
      !dashboard.user.current_package_validity ||
      dashboard.user.transactions_left < 1
    ) {
      let hiddenBtn = document.getElementById("hiddenBtn");
      hiddenBtn.click();
      this.generalservice.loading4Anchor(anchor, "done", "Run analysis");
    } else {
      this.clickHiddenAnchorToStartAnalysisProcess(anchor);
    }
  }

  get displayAppropriateText() {
    return {
      user: this.generalservice.getSavedToken() ? "My Dashboard" : "Register",
      LoggedIn: this.generalservice.getSavedToken() ? "Logout" : "Signin"
    };
  }

  LogOutOrSignIn(evt): void {
    if (evt.srcElement.textContent.trim() == "Logout") {
      this.generalservice.logOut();
      // this.displayAppropriateText;
    } else {
      this.router.navigate(["/login"], {
        queryParams: { returnUrl: "/" }
      });
    }
  }

  public routeToPlans() {
    const modalCloseBtn = document.getElementById(
      "closeModal"
    ) as HTMLButtonElement;
    modalCloseBtn.click();
    this.router.navigate(["/billing"]);
  }

  registerOrDashboard(evt): void {
    if (evt.srcElement.textContent.trim() == "Register") {
      this.router.navigate(["/register"]);
    } else {
      if (sessionStorage.getItem("origin")) {
        this.router.navigate(["/user/alt-dashboard"]);
        return;
      }
      this.router.navigate(["/user/dashboard"]);
    }
  }

  addScriptTagForWidget() {
    if (window.document.getElementById("extraFunction")) {
      let token = this.generalservice.getSavedToken();
      let script = document.createElement("script");
      script.type = "text/javascript";
      script.id = "extraFunction";
      script.text = `
      var cc = CreditClan.init('z2BhpgFNUA99G8hZiFNv77mHDYcTlecgjybqDACv', { class: 'ccopen', token: ${token} })
      `;
      window.document.body.appendChild(script);
    }
  }

  // this code violates the DRY principle
  private clickHiddenAnchorToStartAnalysisProcess(anchor): void {
    let ccopen = document.querySelector(".ccopen") as HTMLAnchorElement;
    ccopen.click();
    try {
      if (CreditClan.iframe) {
        this.generalservice.loading4Anchor(anchor, "done", "Run analysis");
      }
    } catch (e) {
      this.generalservice.globalNotificationModal(e);
      this.generalservice.loading4Anchor(anchor, "done", "Run analysis");
    }
    // else {
    //   console.error;
    // }
  }
}
