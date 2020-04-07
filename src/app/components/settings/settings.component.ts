import { Component, OnInit, OnDestroy, Injector } from "@angular/core";
import { GeneralService } from "src/app/services/general.service";
import { UserComponent } from "../user/user.component";
import { Alert, AlertObject } from "../../models/Alert";
import { defer, Subscription, TimeoutError } from "rxjs";
import { timeout } from "rxjs/operators";
import { DashboardData } from "src/app/models/dashboard-data";

interface profileUpdate {
  fullname?: string;
  phone?: string;
  company?: string;
}

interface passwordUpdate {
  old_password?: string;
  new_password?: string;
}

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"]
})
export class SettingsComponent extends UserComponent
  implements OnInit, OnDestroy {
  formElements: NodeListOf<HTMLFormElement>;
  passwordGeneratedObservable: Subscription;
  // updateGeneratedObservable: Subscription;
  public alertContainer: AlertObject = { instance: null };
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.addEventListenersToForm();
  }

  addEventListenersToForm(): void {
    this.formElements = document.querySelectorAll("form");
    this.formElements.forEach((formElement: HTMLFormElement) => {
      // console.log(formElement);
      formElement.addEventListener("submit", e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        this.handleSubmitEvent(e, this.getAccordionButtons(e), formElement);
      });
    });
  }

  // this function will handle the submit event
  handleSubmitEvent(
    event: Event,
    anchorTag: HTMLAnchorElement,
    form: HTMLFormElement
  ) {
    if (event.srcElement["name"] == "PasswordResetForm") {
      let firstInput = event.srcElement["0"] as HTMLInputElement;
      let secondInput = event.srcElement["1"] as HTMLInputElement;
      let BtnElement = event.srcElement["2"] as HTMLButtonElement;
      let objectToSend: passwordUpdate = {
        old_password: firstInput.value,
        new_password: secondInput.value
      };
      this.handlePasswordUpdate(objectToSend, BtnElement, anchorTag, form);
    }
    if (event.srcElement["name"] == "fullnameResetForm") {
      let fullname = (event.srcElement as HTMLFormElement)["0"].value;
      let ButtonThatFiredEvent = (event.srcElement as HTMLFormElement)[
        "1"
      ] as HTMLButtonElement;
      let obj: profileUpdate = { fullname };
      this.handleProfileUpdate(obj, ButtonThatFiredEvent, anchorTag, form);
    }
    if (event.srcElement["name"] == "companyNameResetForm") {
      let company = (event.srcElement as HTMLFormElement)["0"].value;
      let ButtonThatFiredEvent = (event.srcElement as HTMLFormElement)[
        "1"
      ] as HTMLButtonElement;
      let obj: profileUpdate = { company };
      this.handleProfileUpdate(obj, ButtonThatFiredEvent, anchorTag, form);
    } else {
      let inputFromWhichEventWasFired = event.srcElement[
        "0"
      ] as HTMLInputElement;
      let ButtonThatFiredEvent = event.srcElement["1"] as HTMLButtonElement;
      let obj: profileUpdate = { phone: inputFromWhichEventWasFired.value };
      this.handleProfileUpdate(obj, ButtonThatFiredEvent, anchorTag, form);
    }
  }

  async handlePasswordUpdate(
    obj: passwordUpdate,
    btn: HTMLButtonElement,
    anchor: HTMLAnchorElement,
    form: HTMLFormElement
  ) {
    if (!obj.new_password || !obj.old_password) {
      this.alertContainer["instance"] = new Alert(
        "alert-soft-danger fade show",
        "fa fa-minus-circle alert-icon mr-3",
        `All password fields must be filled.`
      );
      setTimeout(() => {
        delete this.alertContainer["instance"];
      }, 2000);
      return;
    }

    this.passwordGeneratedObservable = defer(
      async () => await super.submitRequestToChangePassword(obj, btn)
    )
      .pipe(timeout(15000))
      .subscribe(
        val => {
          // console.log(val);
          this.alertContainer["instance"] = new Alert(
            "alert-primary fade show",
            "success",
            `${val.success}`
          );
          this.generalservice.loading4button(btn, "done", "Submit");
          anchor.click();
          form.reset();
          setTimeout(() => {
            delete this.alertContainer["instance"];
          }, 3000);
        },
        err => {
          if (err instanceof TimeoutError) {
            this.alertContainer[
              "instance"
            ] = this.generalservice.handleGeneraTimeErrors(err);
            this.generalservice.loading4button(btn, "done", "Submit");
            anchor.click();
            form.reset();
            setTimeout(() => {
              delete this.alertContainer["instance"];
            }, 3000);
          } else {
            this.alertContainer[
              "instance"
            ] = this.generalservice.handleOtherErrors(err);
            this.generalservice.loading4button(btn, "done", "Submit");
            anchor.click();
            form.reset();
            setTimeout(() => {
              delete this.alertContainer["instance"];
            }, 3000);
          }
        }
      );
  }

  async handleProfileUpdate(
    val: profileUpdate,
    btn: HTMLButtonElement,
    anchor: HTMLAnchorElement,
    form: HTMLFormElement
  ) {
    if (Object.values(val).includes("")) {
      this.alertContainer["instance"] = new Alert(
        "alert-soft-danger fade show",
        "fa fa-minus-circle alert-icon mr-3",
        `The field cannot be empty, Enter something valid and then submit!`
      );
      setTimeout(() => {
        delete this.alertContainer["instance"];
      }, 2000);
      return;
    }
    console.log(val);
    defer(async () => await super.submitRequestToChangeStuff(val, btn))
      .pipe(timeout(15000))
      .subscribe(
        val => {
          // console.log(val);
          this.updateSettings();
          this.alertContainer["instance"] = new Alert(
            "alert-primary fade show",
            "success",
            `${val.message}`
          );
          this.generalservice.loading4button(btn, "done", "Submit");
          anchor.click();
          form.reset();
          this.updateSettings();
          setTimeout(() => {
            delete this.alertContainer["instance"];
          }, 3000);
        },
        err => {
          if (err instanceof TimeoutError) {
            this.alertContainer[
              "instance"
            ] = this.generalservice.handleGeneraTimeErrors(err);
            this.generalservice.loading4button(btn, "done", "Submit");
            anchor.click();
            form.reset();
            setTimeout(() => {
              delete this.alertContainer["instance"];
            }, 3000);
          } else {
            this.alertContainer[
              "instance"
            ] = this.generalservice.handleOtherErrors(err);
            this.generalservice.loading4button(btn, "done", "Submit");
            anchor.click();
            form.reset();
            setTimeout(() => {
              delete this.alertContainer["instance"];
            }, 3000);
          }
        }
      );
  }

  public getAccordionButtons(evt): HTMLAnchorElement {
    let anchorTag: HTMLAnchorElement = evt.srcElement.parentElement.parentElement.parentElement.querySelector(
      "a"
    );
    return anchorTag;
  }

  async updateSettings() {
    let totalStatements = document.getElementById(
      "totalStatements"
    ) as HTMLHeadingElement;

    defer(async () => await super.fetchDashBoardDetails())
      .pipe(timeout(60000))
      .subscribe(
        (val: DashboardData) => {
          totalStatements.innerText = String(val.user.transactions_left);
          sessionStorage.setItem("userDashboardData", JSON.stringify(val));
        },
        err => {
          console.log(err);
          // this.handleError(err, totalStatements, emailVerification);
        }
      );
  }
  ngOnDestroy() {
    // this.passwordGeneratedObservable.unsubscribe();
    // this.updateGeneratedObservable.unsubscribe();
  }
}
