import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Alert, AlertObject } from "../../models/Alert";

@Component({
  selector: "app-freebies",
  templateUrl: "./freebies.component.html",
  styleUrls: ["./freebies.component.css"]
})
export class FreebiesComponent implements OnInit, OnDestroy {
  public alertContainer: AlertObject = { instance: null };
  constructor(private router: Router) {}

  ngOnInit() {
    this.alertContainer["instance"] = new Alert(
      "alert-primary fade show",
      "success",
      "You have subscribed to the free plan, and you have 3 free statements. Enjoy!"
    );
  }

  gotoDashboard(): void {
    this.router.navigate(["user"]);
  }

  ngOnDestroy() {
    delete this.alertContainer["instance"];
  }
}
