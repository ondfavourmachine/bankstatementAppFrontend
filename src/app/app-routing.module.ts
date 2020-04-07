import { NgModule } from "@angular/core";
// components

import { Routes, RouterModule } from "@angular/router";
import { RegisterComponent } from "./components/register/register.component";
import { BillingComponent } from "./components/billing/billing.component";
import { LoginComponent } from "./components/login/login.component";
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { CardsComponent } from "./components/cards/cards.component";
import { FreebiesComponent } from "./components/freebies/freebies.component";
import { AuthGuard } from "./guards/AuthGuard/auth.guard";
import { EmailVerifiedComponent } from "./components/email-verified/email-verified.component";
import { HomeComponent } from "./components/home/home.component";

// resolvers
import { BillingPlansResolver } from "./services/resolvers/planResolver";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "authorize", redirectTo: "login", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "register", canActivate: [AuthGuard], component: RegisterComponent },
  {
    path: "billing",
    resolve: { result: BillingPlansResolver },
    component: BillingComponent
  },
  { path: "home", component: HomeComponent },
  { path: "resetPassword", component: ResetPasswordComponent },
  { path: "forgotPassword", component: ForgotPasswordComponent },
  // { path: "payment", component: CardsComponent },
  { path: "login", canActivate: [AuthGuard], component: LoginComponent },
  { path: "freebies", component: FreebiesComponent },
  { path: "email-verified", component: EmailVerifiedComponent },
  {
    path: "user",
    canLoad: [AuthGuard],
    loadChildren: () =>
      import("./modules/user/user.module").then(m => m.UserModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [BillingPlansResolver]
})
export class AppRoutingModule {}
