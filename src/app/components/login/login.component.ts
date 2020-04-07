import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Alert, AlertObject } from "../../models/Alert";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { GeneralService } from "src/app/services/general.service";
import { DashboardData, User } from "../../models/dashboard-data";
import { retry, timeout } from "rxjs/operators";
import { UserService } from "src/app/services/User/user.service";
import { StatementsRecentlyAnalysed } from "src/app/models/StatementsRecentlyAnalysed";
import { HttpErrorResponse } from "@angular/common/http";
import { RegistrationForm } from "src/app/models/registrationForm";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public alertContainer: AlertObject = { instance: null };
  returnUrl: Params;
  transaction_id: any;
  constructor(
    private fb: FormBuilder,
    private authservice: AuthService,
    private router: Router,
    private generalservice: GeneralService,
    private userservice: UserService,
    private activatedRoute: ActivatedRoute
  ) {
    activatedRoute.queryParams.subscribe(val => {
      this.returnUrl = val;
      this.transaction_id = val["transaction_id"]
        ? val["transaction_id"]
        : null;
    });
    // console.log(this.transaction_id);
  }

  ngOnInit() {
    this.generalservice.warnLoginOfIncomingUser$.subscribe(val => {
      if (val.length < 2) return;
      this.manageUsersFromLend(val);
    });
    this.loginForm = this.fb.group(this.generateLoginForm());
  }

  // this function will generate an login in object that is passed into formbuilder
  generateLoginForm(): Object {
    return {
      email: ["", [Validators.required]],
      password: ["", [Validators.required]]
    };
  }

  // this function will log the user into the application
  submitLogin(form: FormGroup) {
    let nameOfToken: string = "access_token";
    let loginButton = document.getElementById(
      "loginButton"
    ) as HTMLButtonElement;
    let formToSubmit = form.value;
    if (this.transaction_id) {
      sessionStorage.setItem("transactionID", this.transaction_id);
      formToSubmit["transaction_id"] = this.transaction_id;
      // formToSubmit["is_from_credit_clan"] = 0;
    }
    this.generalservice.loading4button(loginButton, "yes", "Please wait ...");
    this.authservice
      .LoginRequest(formToSubmit)
      .pipe(
        retry(2),
        timeout(100000)
      )
      .subscribe(
        // when we get a value and its true then check if the logged in user
        // has any active package, if he does, go straight to his dashboard
        // else go to billing page for him to choose a plan.
        async val => {
          if (val.completed == true) {
            this.generalservice.saveStuff(
              this.generalservice.encodeStuff(nameOfToken),
              val["token"]
            );
            try {
              let response: DashboardData = await this.getLoggedInUserDashBoardData();
              sessionStorage.setItem(
                "userDashboardData",
                JSON.stringify(response)
              );
              if (
                !response.user.current_package_validity ||
                response.user.transactions_left < 1
              ) {
                this.generalservice.loading4button(loginButton, "done");
                this.router.navigate(["/billing", { id: form.value.email }]);
              } else {
                this.showUserHisRecentlyAnalysedStatement(response.user);
                this.generalservice.loading4button(loginButton, "done");
                this.returnUrl.returnUrl
                  ? this.router.navigate([this.returnUrl.returnUrl])
                  : this.router.navigate(["user"]);
              }
            } catch (e) {
              this.handleLoginError(e, loginButton);
            }
          }
        },
        err => this.handleLoginError(err, loginButton)
      );

    //   this.alertContainer["instance"] = new Alert(
    //     "alert-soft-danger fade show",
    //     "fa fa-minus-circle alert-icon mr-3",
    //     `Wrong email or password!`
    //   );
  }

  async getLoggedInUserDashBoardData(): Promise<DashboardData> {
    let response: DashboardData = await this.userservice
      .getDashboardData()
      .toPromise();
    return await response;
  }

  // this is a getter for the email formcontrol
  get email() {
    return this.loginForm.get("email");
  }

  // this is a getter for the password formcontrol
  get password() {
    return this.loginForm.get("password");
  }

  // this function will show a small error message when the user enters the email field and leaves without any input
  public emailIsRequired(): boolean {
    return this.email.hasError("required") && this.email.touched;
  }

  // this function will show a small error message when the user enters the password field and leaves without any input
  public passwordIsRequired(): boolean {
    return this.password.hasError("required") && this.password.touched;
  }

  handleLoginError(error, btn): void {
    // console.log(error);
    if (!window.navigator.onLine) {
      // console.log(error);
      this.alertContainer["instance"] = new Alert(
        "alert-soft-danger fade show",
        "fa fa-minus-circle alert-icon mr-3",
        "You do not have an active internet connection. Please, check and try again"
      );
      setTimeout(() => {
        delete this.alertContainer["instance"];
      }, 3500);
      this.generalservice.loading4button(btn, "done", "");
      return;
    }

    if (error instanceof HttpErrorResponse && (error.status) == 0) {
      this.generalservice.loading4button(btn, "done", "");
      this.alertContainer["instance"] = new Alert(
        "alert-soft-danger fade show",
        "fa fa-minus-circle alert-icon mr-3",
        "The Server response timed out. Please try again"
      );

      setTimeout(() => {
        delete this.alertContainer["instance"];
      }, 3000);

    
  } 
    if (error instanceof HttpErrorResponse && String(error.status).includes('4')) {
      // console.log(error);
      this.generalservice.loading4button(btn, "done", "");
      this.alertContainer["instance"] = new Alert(
        "alert-soft-danger fade show",
        "fa fa-minus-circle alert-icon mr-3",
        "Wrong email or password!. Please try again"
      );
      setTimeout(() => {
        delete this.alertContainer["instance"];
      }, 3000);
    }
    if (error.name == "TimeoutError") {
      this.generalservice.loading4button(btn, "done", "");
      this.alertContainer["instance"] = new Alert(
        "alert-soft-danger fade show",
        "fa fa-minus-circle alert-icon mr-3",
        "The Server response timed out. Please try again"
      );

      setTimeout(() => {
        delete this.alertContainer["instance"];
      }, 3000);

      
    } else {
      console.log(error);
      this.generalservice.loading4button(btn, "done", "");
      this.alertContainer["instance"] = new Alert(
        "alert-soft-danger fade show",
        "fa fa-minus-circle alert-icon mr-3",
        `${
          "An error occured. Please try again" || error.error.failed
            ? error.error.failed[0]
            : error.error.error
        }`
      );

      setTimeout(() => {
        delete this.alertContainer["instance"];
      }, 3000);
    }
  }

  async showUserHisRecentlyAnalysedStatement(user: User) {
    const transactionID = sessionStorage.getItem("transactionID");
    if (!user.transactions_left) {
      return this.router.navigate(["/billing"]);
    }
    if (!user.current_package_validity) {
      return this.router.navigate(["/billing"]);
    }
    try {
      const response: StatementsRecentlyAnalysed = await this.authservice.getRecentlyAnalysedStatements(
        transactionID
      );
      // let analytics_pdf;
      let analyticspdf: string = response.analytics_pdf;
      // console.log(analyticspdf);
      if (!analyticspdf) {
        sessionStorage.removeItem("transactionID");
        return;
      } else if (analyticspdf.includes("preview")) {
        // notify the user that he cant view since he doesnt have enough transaction
        this.generalservice.globalNotificationModal(response.analytics_pdf);
        console.log(response);
      } else {
        // notify the user that he can click to view what he has analysed.
        this.generalservice.globalNotificationModal(response);
      }
    } catch (e) {
      return;
    }
  }

  manageUsersFromLend(obj) {
    let nameOfToken: string = "access_token";
    const loadingScreen = document.getElementById(
      "loadingScreen"
    ) as HTMLDivElement;
    let coverFromLend = document.querySelector(
      ".coverForUserFromLend"
    ) as HTMLDivElement;
    const copy = { ...obj };
    if (copy.hasOwnProperty("url" || "token")) {
      const { token, url } = copy;
      console.log(token, url);
      this.authservice.handleTrafficFromLend(token, loadingScreen).subscribe(
        val => {
          if (val instanceof HttpErrorResponse) {
            this.manageErrorScenarios(val, loadingScreen);
            console.log(val);
            this.generalservice.notAbleToLoginUserInfromLend = false;
            console.log(this.generalservice.notAbleToLoginUserInfromLend);
            return;
          }
          loadingScreen.innerText = "Logging you in....";
          this.generalservice.saveStuff(
            this.generalservice.encodeStuff(nameOfToken),
            val["token"]
          );
          sessionStorage.setItem("origin", "fromLend");
          let copy = { ...val };
          // i am deleting token just to conform to the format of a normal
          // user not from lend. The token has been saved previously
          delete copy["token"];
          sessionStorage.setItem("userDashboardData", JSON.stringify(copy));
          this.router.navigate(["/user/alt-dashboard"]);
          // just making sure, it is not really
          this.generalservice.notAbleToLoginUserInfromLend = true;
          setTimeout(() => {
            coverFromLend.style.display = "none";
            coverFromLend.style.zIndex = "-1";
            coverFromLend.style.visibility = "hidden";
            loadingScreen.style.display = "none";
            loadingScreen.style.zIndex = "-1";
          }, 550);
          setTimeout(() => {}, 1000);
        },
        err => {
          this.registerUserFromLend(err);
        }
      );
    }
  }

  registerUserFromLend(err: HttpErrorResponse) {
    console.log(err);
    if (String(err.status).includes("4")) {
      // console.log(this.authservice.detailsFromLend);
      let registerFormForUserFromLend: RegistrationForm = {};
      registerFormForUserFromLend.email = this.authservice.detailsFromLend[
        "email"
      ];
      registerFormForUserFromLend.phone = this.authservice.detailsFromLend[
        "phone"
      ];
      registerFormForUserFromLend.company = this.authservice.detailsFromLend[
        "business_name"
      ];
      registerFormForUserFromLend.password = "password";
      registerFormForUserFromLend.fullname = this.authservice.detailsFromLend[
        "name"
      ];
      this.authservice
        .registrationRequest(registerFormForUserFromLend)
        .subscribe(
          val => {
            if (val["completed"]) {
              this.router.navigate(["/user/alt-dashboard"]);
            }
          },
          err => console.log(err)
        );
    }
  }

  manageErrorScenarios(val: HttpErrorResponse, loader: HTMLDivElement) {
    this.generalservice.notAbleToLoginUserInfromLend = false;
    sessionStorage.clear();
    this.router.navigate(["/login"]);
  }

  // <i class="exclamation circle icon"></i>
}
