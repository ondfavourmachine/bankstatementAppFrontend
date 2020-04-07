import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GeneralService } from "src/app/services/general.service";

@Component({
  selector: "app-forbidden",
  templateUrl: "./forbidden.component.html",
  styleUrls: ["./forbidden.component.css"]
})
export class ForbiddenComponent implements OnInit {
  constructor(private router: Router, private generalservice: GeneralService) {}

  ngOnInit() {}

  routeToLogin(): void {
    this.generalservice.logOut();
    this.router.navigate(["/login"]);
  }
}
