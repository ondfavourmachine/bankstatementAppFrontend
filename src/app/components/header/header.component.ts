import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
import { GeneralService } from "src/app/services/general.service";
import { DashboardData } from "src/app/models/dashboard-data";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  @Input("userData") userData: object;
  // public email: string = !this.generalservice.getAndDecryptPayloadData()[
  //   "fullname"
  // ]
  //   ? ""
  //   : this.generalservice.getAndDecryptPayloadData()["fullname"];

  public colorToDisplay: string;
  public currentUser: any;
  constructor(private router: Router, private generalservice: GeneralService) {}

  ngOnInit() {
    // this.checkAndDisplayAppropriateWarningMessage(this.currentUser);
    this.checkAndDisplayAppropriateWarningMessage();
  }

  // ngOnChanges() {
  //   // this.currentUser = { ...data.userData.currentValue };
  // }
  routeToBilling() {
    this.router.navigate(["/billing"]);
  }

  // routeToUserSettings(name) {
  //   // const settings = document.querySelector(name);
  //   // event = new CustomEvent('settings', {bubbles: true, detail: 'settings clicked'});
  //   // dispatchEvent()
  //   // this.router.navigate(["/user/settings"]);
  // }

  routeToProfile() {
    this.router.navigate(["/user/dashboard"]);
  }

  signout(): void {
    this.generalservice.logOut();
    this.router.navigate(["/login"]);
  }

  public routeToHome() {
    this.router.navigate(["/home"]);
  }

  // displays appropriate warning to user depending on the validity of their current
  // package
  checkAndDisplayAppropriateWarningMessage() {
    const data: DashboardData = this.generalservice.getUserSavedDataFromStorage();
    // console.log(data);
    const small = document.querySelector("small") as HTMLElement;
    try {
      if (!data.user.id) return;
      // console.log(data.user);
      if (
        data.user.transactions_left == 0 ||
        !data.user["current_package_validity"]
      ) {
        small.textContent =
          "You do not have any active package, please subscribe to a package!";
        this.colorToDisplay = "red";
        console.log(small);
      } else {
        // console.log(small);
        const temp = new Date(data.user["current_package_validity"]);
        // the calculation within the if condition checks if the
        // package validity is less than 2 days
        if ((temp.getTime() - Date.now()) / 86400000 < 2) {
          this.formatResponse(small, temp, "orange");
        }

        this.formatResponse(small, temp, "green");
      }
    } catch (e) {
      // console.log(e);
      return;
    }
  }

  get color() {
    return this.colorToDisplay;
  }

  // formats the colour of the textContent of the small element.
  formatResponse(small: HTMLElement, temp: Date, colorModification?: string) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    small.textContent = `Your subscription will end on ${new Intl.DateTimeFormat(
      "en-GB",
      options
    ).format(temp)}`;
    this.colorToDisplay = colorModification;
    // console.log(temp);
  }

  toggleDropdown() {
    const headerMain = document.getElementById("headerMain");
    const dropDown = headerMain.querySelector(".dropdown");
    const menu = headerMain.querySelector(".menu") as HTMLDivElement;

    // console.log(menu, dropDown);
    if (dropDown.classList.contains("active")) {
      dropDown.classList.remove("active", "visible");
      menu.classList.remove("visible");
      menu.classList.add("hidden");
      menu.style.display = "none";
    } else {
      dropDown.classList.add("active", "visible");
      menu.classList.add("visible");
      menu.classList.remove("hidden");
      menu.style.display = "block";
    }
  }
}
