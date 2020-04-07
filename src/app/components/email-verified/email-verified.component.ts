import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

interface EmailValidationDetails {
  email?: string;
  token?: string;
}
@Component({
  selector: "app-email-verified",
  templateUrl: "./email-verified.component.html",
  styleUrls: ["./email-verified.component.css"]
})
export class EmailVerifiedComponent implements OnInit {
  public dontShow: string = "yes";
  private validationDetails: EmailValidationDetails;
  constructor(
    private location: Location,
    private activatedroute: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.activatedroute.queryParams.subscribe(
      (val: EmailValidationDetails) => {
        this.validationDetails = { ...val };
      },
      err => console.log(err)
    );
  }

  ngOnInit() {
    this.confirmEmail();
  }

  goback(): void {
    this.location.back();
  }

  confirmEmail() {
    this.http
      .get(
        `http://app.bankstatement.ai/register/validate-email?email=${this.validationDetails.email}&token=${this.validationDetails.token}`
      )
      .subscribe(
        val => (this.dontShow = "no"),
        err => {
          window.alert(err.error.error);
          this.router.navigate(["/user/dashboard"]);
        }
      );
  }
}
