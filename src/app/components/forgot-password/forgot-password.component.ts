import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Alert, AlertObject } from "../../models/Alert";
import { GeneralService } from "src/app/services/general.service";
import { AuthService } from "src/app/services/auth.service";
import { timeout } from "rxjs/operators";
import { TimeoutError } from "rxjs";
// import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"]
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  public resetLinkSent: string = "no";
  public alertContainer: AlertObject = { instance: null };
  public resetDetails: { email?: string; token?: string } = {};
  constructor(
    private fb: FormBuilder,
    private generalservice: GeneralService,
    private authservice: AuthService // private http: HttpClient
  ) {
    // http
    //   .get("http://app.bankstatement.ai/packages/")
    //   .subscribe(val => console.log(val), err => console.log(err))
  }

  ngOnInit() {
    this.forgotPasswordForm = this.fb.group(this.generateForgotPasswordForm());
  }

  generateForgotPasswordForm(): Object {
    return {
      email: ["", [Validators.required]]
    };
  }

  // this function will submit the email entered by the user and
  // change the form from forgot to reset form.
  submitForgotPassword(form: FormGroup): void {
    let formToSubmit = { email: form.value.email };
    let forgotPasswordBtn = document.getElementById(
      "forgotPasswordBtn"
    ) as HTMLButtonElement;
    this.generalservice.loading4button(forgotPasswordBtn, "yes", "Sending...");
    this.authservice
      .forgotPassword(formToSubmit)
      .pipe(timeout(15000))
      .subscribe(
        res => {
          this.resetDetails.email = res.email;
          this.resetDetails.token = res.user_token;
          this.alertContainer["instance"] = new Alert(
            "alert-primary fade show",
            "success",
            `Token to reset password has been sent to ${res.email}`
          );
          this.resetLinkSent = "yes";
          setTimeout(() => {
            delete this.alertContainer["instance"];
          }, 2500);
        },
        err => {
          // console.log(err);
          if (err instanceof TimeoutError) {
            this.alertContainer[
              "instance"
            ] = this.generalservice.handleGeneraTimeErrors(err);
            this.generalservice.loading4button(
              forgotPasswordBtn,
              "done",
              "Send Confirmation"
            );
            setTimeout(() => {
              delete this.alertContainer["instance"];
            }, 2500);
          } else {
            this.alertContainer[
              "instance"
            ] = this.generalservice.handleOtherErrors(err);
            this.generalservice.loading4button(
              forgotPasswordBtn,
              "done",
              "Send Confirmation"
            );
            setTimeout(() => {
              delete this.alertContainer["instance"];
            }, 2500);
          }
        }
      );

    // sessionStorage.setItem("userEmail", JSON.stringify(form.value.email));
    // this.alertContainer["instance"] = new Alert(
    //   "alert-soft-success fade show",
    //   "fa fa-check-circle alert-icon mr-3",
    //   ` A reset link has been sent to ${form.value.email}`
    // );
    // setTimeout(() => {
    //   delete this.alertContainer["instance"];
    //   this.resetLinkSent = "yes";
    //   this.resetEmail = `${form.value.email}`;
    // }, 3000);
  }
}
