import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { debounceTime, timeout } from "rxjs/operators";
import { Alert, AlertObject } from "../../models/Alert";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { ResetPassword } from "src/app/models/resetPassword";
import { GeneralService } from "src/app/services/general.service";
import { TimeoutError } from "rxjs";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"]
})
export class ResetPasswordComponent implements OnInit, OnChanges {
  @Input("detailsFromForgotPassword") detailsFromForgotPassword: Object;
  resetForm: FormGroup;
  public alertContainer: AlertObject = { instance: null };
  constructor(
    private fb: FormBuilder,
    private authservice: AuthService,
    private router: Router,
    private generalservice: GeneralService
  ) {}

  ngOnInit() {
    this.resetForm = this.fb.group({
      email: ["" || this.detailsFromForgotPassword["email"]],
      token: ["" || this.detailsFromForgotPassword["token"]],
      new_password: [""],
      confirmpassword: [""]
    });
    // this.token.valueChanges.pipe(debounceTime(150)).subscribe(val => {
    //   if (val.length >= 6) {
    //     this.token.patchValue(this.token.value.toString().substring(0, 6));
    //     this.token.disable();
    //   }
    // });
  }

  ngOnChanges() {
    // console.log(this.detailsFromForgotPassword);
  }

  // this function will submit the resetForm
  submitResetForm(form: FormGroup) {
    let resetPasswordBtn = document.getElementById(
      "resetPasswordBtn"
    ) as HTMLButtonElement;
    let formToSubmit: ResetPassword = {};
    for (let key in form.getRawValue()) {
      if (key == "confirmpassword") {
        continue;
      }
      formToSubmit[key] = form.getRawValue()[key];
    }
    // console.log(formToSubmit);
    this.generalservice.loading4button(resetPasswordBtn, "yes", "Reseting...");
    this.authservice
      .resetPassword(formToSubmit)
      .pipe(timeout(15000))
      .subscribe(
        val => console.log(val),
        err => {
          // console.log(err);
          if (err instanceof TimeoutError) {
            this.alertContainer[
              "instance"
            ] = this.generalservice.handleGeneraTimeErrors(err);
            this.generalservice.loading4button(
              resetPasswordBtn,
              "done",
              "Reset my password"
            );
            setTimeout(() => {
              delete this.alertContainer["instance"];
            }, 2500);
          } else if (err.statusText == "Unknown Error") {
            this.alertContainer["instance"] = new Alert(
              "alert-soft-danger fade show",
              "fa fa-minus-circle alert-icon mr-3",
              "Oops! Something went wrong, Please try again."
            );
            this.generalservice.loading4button(
              resetPasswordBtn,
              "done",
              "Reset my password"
            );
            setTimeout(() => {
              delete this.alertContainer["instance"];
            }, 2500);
          } else {
            this.alertContainer[
              "instance"
            ] = this.generalservice.handleOtherErrors(err);
            this.generalservice.loading4button(
              resetPasswordBtn,
              "done",
              "Send Confirmation"
            );
            setTimeout(() => {
              delete this.alertContainer["instance"];
            }, 2500);
          }
        }
      );
  }

  get token() {
    return this.resetForm.get("token");
  }

  get email() {
    return this.resetForm.get("email");
  }

  get new_password() {
    return this.resetForm.get("new_password");
  }

  get confirmpassword() {
    return this.resetForm.get("confirmpassword");
  }

  public passwordsDontMatch(): boolean {
    return this.confirmpassword.value !== this.new_password.value;
  }
}
