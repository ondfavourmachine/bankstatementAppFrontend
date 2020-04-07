import { Component, OnInit, AfterViewInit } from "@angular/core";
import { DashboardData } from "../models/dashboard-data";
import { GeneralService } from "../services/general.service";
declare var CreditClan: any;
@Component({
  selector: "app-alt-dashboard",
  templateUrl: "./alt-dashboard.component.html",
  styleUrls: ["./alt-dashboard.component.css"]
})
export class AltDashboardComponent implements OnInit, AfterViewInit {
  public lendUser: { fullname: string; email: string } = {
    fullname: "",
    email: ""
  };
  dashBoardDataFromApiCall: DashboardData = {};
  cc: any;
  constructor(private generalservice: GeneralService) {}

  ngOnInit() {
    this.emailAndName();
    this.getDashboardData();
  }

  ngAfterViewInit() {
    const token = this.generalservice.getSavedToken()
      ? `Bearer ${this.generalservice.getSavedToken()}`
      : null;
    try {
      this.cc = CreditClan.init("z2BhpgFNUA99G8hZiFNv77mHDYcTlecgjybqDACv", {
        class: "ccopen",
        token: token
      });
    } catch (e) {
      this.generalservice.globalNotificationModal(e);
    }

    // grab dom references for adding event listeners
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
    // let dashboardSettingsLink = document.querySelector(
    //   ".dashboard__settings"
    // ) as HTMLElement;

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

    // open the slider for the link
    // dashboardSettingsLink.addEventListener("click", e => {
    //   e.preventDefault();
    //   (InnerContainer[0] as HTMLElement).style.display = "none";
    //   (InnerContainer[1] as HTMLElement).style.display = "block";
    //   slidableArticle.classList.add("show");

    //   setTimeout(() => {
    //     realDocSecond.style.display = "flex";
    //     // realDocSecond.style.display = "flex";
    //     (realDocTwoSecond as HTMLDivElement).style.display = "block";
    //     placeholderThree.style.display = "none";
    //     placeholderFour.style.display = "none";
    //   }, 1500);
    // });

    //close the slider when the close button is clicked
    slidableCloser.addEventListener("click", e => {
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
      el.addEventListener("click", () => {
        settingsForm[i].classList.toggle("show");
        settingsItem[i].classList.toggle("active");
      });
    });
  }

  emailAndName() {
    try {
      let data: DashboardData = {};
      data = { ...JSON.parse(sessionStorage.getItem("userDashboardData")) };
      // document.querySelector(".placeholder-one")["style"]["display"] = "none";
      this.lendUser = {
        fullname: data.user.fullname,
        email: data.user.email
      };
    } catch (e) {
      console.log(e);
      return;
    }
  }

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

  getDashboardData() {
    this.dashBoardDataFromApiCall = this.generalservice.getUserSavedDataFromStorage();
  }
}
