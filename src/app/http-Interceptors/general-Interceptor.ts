import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent
} from "@angular/common/http";
import { Observable } from "rxjs";
import { GeneralService } from "../services/general.service";

@Injectable()
export class GeneralInterceptor implements HttpInterceptor {
  constructor(private generalservice: GeneralService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this.generalservice.getSavedToken();
    if (!authToken) {
      return next.handle(request);
    } else {
      const clonedRequest = request.clone({
        headers: request.headers.set("Authorization", `Bearer ${authToken}`)
      });

      return next.handle(clonedRequest);
    }
  }
}
