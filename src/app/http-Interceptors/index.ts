import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { GeneralInterceptor } from "./general-Interceptor";

export const HttpInterceptProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: GeneralInterceptor, multi: true }
];
