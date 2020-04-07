// Angular modules
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

// Routing
import { AppRoutingModule } from "./app-routing.module";

// external libraries
import { Angular4PaystackModule } from "angular4-paystack";

// components
import { AppComponent } from "./app.component";
import { RegisterComponent } from "./components/register/register.component";
import { CardsComponent } from "./components/cards/cards.component";
import { BillingComponent } from "./components/billing/billing.component";
import { FreebiesComponent } from "./components/freebies/freebies.component";
import { LoginComponent } from "./components/login/login.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";
import { PagenotfoundComponent } from "./components/pagenotfound/pagenotfound.component";
import { EmailVerifiedComponent } from "./components/email-verified/email-verified.component";

// directives
// import { CreditCardDirective } from "./directives/credit-card.directive";
// import { CvcdirectiveDirective } from "./directives/cvcdirective.directive";

// others : services, guards, interceptors
import { ApiFunctions } from "./apiFunctions";
import { AuthService } from "./services/auth.service";
import { GeneralService } from "./services/general.service";
import { HttpInterceptProviders } from "./http-Interceptors";
import { AuthGuard } from "./guards/AuthGuard/auth.guard";
import { HomeComponent } from "./components/home/home.component";

import { CoreModule } from "./modules/coreModule/core/core.module";
import { PaymentService } from "./services/Payments/payment.service";
import { LOGIN_API, DASHBOARD_API, REGISTRATION_API } from "./token";
import { GeneralApi } from "./generalApi";
// import { AltDashboardComponent } from './alt-dashboard/alt-dashboard.component';
// import { ForbiddenComponent } from './components/forbidden/forbidden.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    CardsComponent,
    BillingComponent,
    FreebiesComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    PagenotfoundComponent,
    EmailVerifiedComponent,
    HomeComponent
    // AltDashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    Angular4PaystackModule.forRoot(
      "pk_test_6feb7dca80f00bc32d576032fe06b48b0a77708f"
    ),
    CoreModule,
    AppRoutingModule
  ],
  providers: [
    HttpInterceptProviders,
    AuthService,
    GeneralService,
    PaymentService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
