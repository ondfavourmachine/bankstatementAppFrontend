import { Routes } from "@angular/router";
import { DashboardComponent } from "src/app/components/dashboard/dashboard.component";
import { UserComponent } from "src/app/components/user/user.component";
import { SettingsComponent } from "src/app/components/settings/settings.component";
import { ViewStatementHistoryComponent } from "src/app/components/view-statement-history/view-statement-history.component";
// import { AltDashboardComponent } from "src/app/components/alt-dashboard/alt-dashboard.component";
import { AltDashboardComponent } from "../../alt-dashboard/alt-dashboard.component";
// import { EmailVerifiedComponent } from "src/app/components/email-verified/email-verified.component";

export const routes: Routes = [
  {
    path: "",
    component: UserComponent,
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full"
      },
      { path: "dashboard", component: DashboardComponent },
      { path: "settings", component: SettingsComponent },
      { path: "alt-dashboard", component: AltDashboardComponent },
      {
        path: "viewStatementsHistory",
        component: ViewStatementHistoryComponent
      }

      //   {
      //     path: "email-verified",
      //     component: EmailVerifiedComponent
      //   }
      // { path: "notLive", component: LiveCompaniesComponent }
    ]
  },

  { path: "", redirectTo: "", pathMatch: "full" }
];
