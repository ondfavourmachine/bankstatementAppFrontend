import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

// external Modules
import { Angular4PaystackModule } from "angular4-paystack";

// Components
import { DashboardComponent } from "../../components/dashboard/dashboard.component";
import { UserComponent } from "src/app/components/user/user.component";
import { SharedModule } from "../shared/shared.module";
import { StatementanalyseComponent } from "../../components/statementanalyse/statementanalyse.component";
import { ViewStatementHistoryComponent } from "../../components/view-statement-history/view-statement-history.component";
import { ProfileAndEmailComponent } from "../../components/profile-and-email/profile-and-email.component";
import { SettingsComponent } from "../../components/settings/settings.component";
import { AltDashboardComponent } from "../../alt-dashboard/alt-dashboard.component";

// User routes
import { routes } from "./user-routes";
import { CoreModule } from "../coreModule/core/core.module";
import { SendCustomerForAnalysisComponent } from "src/app/components/send-customer-for-analysis/send-customer-for-analysis.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    DashboardComponent,
    UserComponent,
    StatementanalyseComponent,
    ViewStatementHistoryComponent,
    ProfileAndEmailComponent,
    SettingsComponent,
    AltDashboardComponent,
    SendCustomerForAnalysisComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    CoreModule,
    Angular4PaystackModule
  ],
  exports: [RouterModule]
})
export class UserModule {}
