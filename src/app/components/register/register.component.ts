import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Alert, AlertObject } from "../../models/Alert";
import { AuthService } from "../../services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { retry, timeout } from "rxjs/operators";
import { GeneralService } from "src/app/services/general.service";
import { RegistrationForm } from "src/app/models/registrationForm";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  registrationForm: FormGroup;
  private transaction_id: string;
  public alertContainer: AlertObject = { instance: null };
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authservice: AuthService,
    private generalservice: GeneralService,
    private activatedRoute: ActivatedRoute
  ) {
    activatedRoute.queryParams.subscribe(val => {
      this.transaction_id = val["transaction_id"]
        ? val["transaction_id"]
        : null;
    });
    // console.log(this.transaction_id);
  }

  ngOnInit() {
    this.registrationForm = this.fb.group(this.generateRegistrationForm());
  }

  private generateRegistrationForm() {
    return {
      fullname: ["", [Validators.required]],
      phone: ["", [Validators.required]],
      company: [""],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmpassword: ["", [Validators.required]],
      transaction_id: [""]
    };
  }

  // this function will enable the registration of users!
  public registerUser(form: FormGroup) {
    let formToSubmit: RegistrationForm = {};
    console.log(form.value.length);
    if (form.value.phone.toString().length < 10) {
      this.alertContainer["instance"] = new Alert(
        "alert-soft-danger fade show",
        "fa fa-minus-circle alert-icon mr-3",
        "Please provide a valid Nigerian number"
      );

      setTimeout(() => {
        delete this.alertContainer["instance"];
      }, 3000);
    } else {
      const btn = document.getElementById("submitButton") as HTMLButtonElement;
      this.generalservice.loading4button(btn, "yes", "Registering...");
      // sessionStorage.setItem("registeredUser", JSON.stringify(form.value));
      formToSubmit = { ...form.value };
      if (!this.transaction_id) {
        delete formToSubmit.transaction_id;
      } else {
        formToSubmit.transaction_id = this.transaction_id;
      }
      formToSubmit["phone"] = String(formToSubmit["phone"]);
      delete formToSubmit["confirmpassword"];

      this.authservice
        .registrationRequest(formToSubmit)
        .pipe(
          retry(2),
          timeout(20000)
        )
        .subscribe(
          val => {
            this.alertContainer["instance"] = new Alert(
              "alert-soft-success fade show",
              "fa fa-check-circle alert-icon mr-3",
              "Registration was successfull!"
            );
            if (val.message) {
              setTimeout(() => {
                delete this.alertContainer["instance"];
                if (this.transaction_id) {
                  this.manageProcessIfTransactionIDIsPresent(
                    this.transaction_id
                  );
                  return;
                }
                this.router.navigate(["/login"], {
                  queryParams: { returnUrl: "/billing" }
                });
              }, 2000);
            }
          },
          err => this.handleRegistrationError(err, btn)
        );
    }
  }

  // this is a getter for easy access to the password formcontrol Object
  get password() {
    return this.registrationForm.get("password");
  }

  // this is a getter for easy access to the fullname formcontrol Object
  get fullname() {
    return this.registrationForm.get("fullname");
  }

  // this is a getter for easy access to the confirmpassword formcontrol Object
  get confirmpassword() {
    return this.registrationForm.get("confirmpassword");
  }

  // this is a getter for easy access to the email formcontrol Object
  get email() {
    return this.registrationForm.get("email");
  }
  // this is a getter for easy access to the phone formcontrol Object
  get phone() {
    return this.registrationForm.get("phone");
  }

  // this function will enable us display appropriate error message when the
  // password has been touched and the user decides to leave
  public passwordIsRequired(): boolean {
    return this.password.hasError("required") && this.password.touched;
  }

  // this function will enable us display appropriate error message when the
  // values of password and confirmpassword dont match
  public passwordsDontMatch(): boolean {
    return this.confirmpassword.value !== this.password.value;
  }

  public passwordsMustBeOfCertainLength(): boolean {
    return this.password.hasError("minlength") && this.password.touched;
  }

  // this function will enable us display appropriate error message when the
  // phone field is touched without any input.
  public phoneNumberIsRequired(): boolean {
    return this.phone.touched && this.phone.hasError("required");
  }

  public phoneNumberDoesntConform(): boolean {
    return this.phone.touched && this.phone.hasError("minlength");
  }

  // this function will enable us display appropriate error message when the
  // email field is touched without any input.
  public emailIsRequired(): boolean {
    return this.email.hasError("required") && this.email.touched;
  }

  public emailDoesntConform(): boolean {
    return this.email.hasError("email") && this.email.touched;
  }

  // this function will enable us display appropriate error message when the
  // fullname field is touched without any input.
  public fullnameIsRequired(): boolean {
    return this.fullname.hasError("required") && this.fullname.touched;
  }

  removeInstance() {
    delete this.alertContainer["instance"];
  }

  // this function handles errors which may arise during registration
  handleRegistrationError(err, button: HTMLButtonElement) {
    // console.log(err);

    if (!window.navigator.onLine) {
      // console.log(err);
      this.alertContainer["instance"] = new Alert(
        "alert-soft-danger fade show",
        "fa fa-minus-circle alert-icon mr-3",
        "You do not have an active internet connection. Please, check and try again"
      );
      this.generalservice.loading4button(button, "done", "");
      setTimeout(() => {
        delete this.alertContainer["instance"];
      }, 3000);
      return;
    }
    if (err instanceof HttpErrorResponse && err.status == 0) {
      // console.log(error);
      this.generalservice.loading4button(button, "done", "");
      this.alertContainer["instance"] = new Alert(
        "alert-soft-danger fade show",
        "fa fa-minus-circle alert-icon mr-3",
        "You seem to have bad internet. Please try again"
      );
      setTimeout(() => {
        delete this.alertContainer["instance"];
      }, 3000);
    }
    if (err.name == "TimeoutError") {
      this.generalservice.loading4button(button, "done", "");
      this.alertContainer["instance"] = new Alert(
        "alert-soft-danger fade show",
        "fa fa-minus-circle alert-icon mr-3",
        "The Server response timed out. Please try again"
      );

      setTimeout(() => {
        delete this.alertContainer["instance"];
      }, 3000);
    } else {
      this.router.navigate(["/login"], {
        queryParams: { returnUrl: "/billing" }
      });
      this.generalservice.loading4button(button, "done", "");
      this.alertContainer["instance"] = new Alert(
        "alert-soft-danger fade show",
        "fa fa-minus-circle alert-icon mr-3",
        `${err.error.failed ? err.error.failed : err.error.error}`
      );

      setTimeout(() => {
        delete this.alertContainer["instance"];
      }, 3000);
    }
  }

  manageProcessIfTransactionIDIsPresent(transID: string) {
    sessionStorage.setItem("transactionID", transID);
    this.router.navigate(["/billing"]);
  }
}

//09057994647
