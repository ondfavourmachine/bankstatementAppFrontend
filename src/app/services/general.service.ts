import { Injectable } from "@angular/core";
import { Alert } from "../models/Alert";
import { TimeoutError, Subject, BehaviorSubject } from "rxjs";
import { DashboardData } from "../models/dashboard-data";

@Injectable({
  providedIn: "root"
})
export class GeneralService {
  nameOfstring = "access_token";
  public fromLend: boolean = false;
  public notAbleToLoginUserInfromLend: boolean = true;
  public notifierSubject = new Subject();
  public notifier$ = this.notifierSubject.asObservable();

  private screensizeNotifierSubject = new Subject();
  public screensize$ = this.screensizeNotifierSubject.asObservable();
  // this is a global notification rxjs subject, designed to notify
  // users of errors wherever they are on the system
  public globalModalNotifierBehaviorSubject = new BehaviorSubject("");
  public notifyGlobally$ = this.globalModalNotifierBehaviorSubject.asObservable();

  //  this observable will be used for notifying the login component of user coming
  //  from lend

  sendNotificationToLoginComponent = new BehaviorSubject("");
  warnLoginOfIncomingUser$ = this.sendNotificationToLoginComponent.asObservable();

  public changeDashboardDataSubject = new Subject();
  public changeDashboardDataInStorage$ = this.changeDashboardDataSubject.asObservable();

  private getTransactionsHistorySubject = new BehaviorSubject('');
  public getTransactionHistory$ = this.getTransactionsHistorySubject.asObservable();
  constructor() {}

  //this function will display spinner on a button element while a process is happening
  loading4button(
    button: HTMLButtonElement,
    apiCall: string,
    displayString?: string
  ) {
    switch (apiCall) {
      case "yes":
        button.innerText = "";
        button.disabled = true;
        button.innerHTML = `${displayString} <i class="fa fa-sync fa-spin"></i>`;
        break;
      case "done":
        button.innerHTML = "";
        button.disabled = false;
        button.innerHTML = `${displayString || "Submit"}`;
    }
  }

  //this function will display spinner on a anchor element while a process is happening
  loading4Anchor(
    anchor: HTMLAnchorElement,
    apiCall: string,
    displayString?: string
  ) {
    switch (apiCall) {
      case "yes":
        anchor.innerText = "";
        anchor.style.pointerEvents = "none";
        anchor.innerHTML = `${displayString} <i class="fa fa-sync fa-spin"></i>`;
        break;
      case "done":
        anchor.innerHTML = "";
        anchor.style.pointerEvents = "auto";
        anchor.innerHTML = `${displayString || "Submit"}`;
    }
  }

  encodeStuff(stuff: any): string {
    if (typeof stuff == "string") {
      return window.btoa(stuff);
    }
  }

  saveStuff(nameOFThingToSave: string, thingToSave): void {
    sessionStorage.setItem(nameOFThingToSave, thingToSave);
  }

  getSavedToken(): string {
    return sessionStorage.getItem(this.encodeStuff(this.nameOfstring));
  }

  logOut(): void {
    sessionStorage.clear();
  }

  getAndDecryptPayloadData(): Object {
    const token: string = this.getSavedToken();
    try {
      let payload;
      if (token) {
        payload = token.split(".")[1];
        payload = JSON.parse(atob(payload));
      }
      // console.log(payload.user);
      return payload.user;
    } catch (e) {
      return;
    }
  }
  extractEmailFromPayload(): string {
    return this.getAndDecryptPayloadData()["email"];
  }

  handleGeneraTimeErrors(error: TimeoutError) {
    if (error.name == "TimeoutError") {
      return new Alert(
        "alert-soft-danger fade show",
        "fa fa-minus-circle alert-icon mr-3",
        "The Server response timed out. Please try again"
      );
    }
  }

  handleOtherErrors(error) {
    return new Alert(
      "alert-soft-danger fade show",
      "fa fa-minus-circle alert-icon mr-3",
      `${error.error.failed || error.error.error}`
    );
  }

  respondToChangesInScreenSize(anything): void {
    this.screensizeNotifierSubject.next(anything);
  }

  changeObservable(anything) {
    this.notifierSubject.next(anything);
  }

  // broadcast global error messages
  globalNotificationModal(anything: any) {
    this.globalModalNotifierBehaviorSubject.next(anything);
  }

  // broadcast message to change dashboard data in storage
  broadcastMessageToChangeDashboardDataInStorage(anything) {
    this.changeDashboardDataSubject.next(anything);
  }

  broadCastGetTransactionHistoryMessage(anything){
    this.getTransactionsHistorySubject.next(anything);
  }

  modifyPricingString(price: any): string {
    let temp: string = price.toString();
    if (temp.length < 2) {
      return temp;
    } else {
      if (temp.length == 4) {
        return (temp = temp.substr(0, 1) + "," + temp.substr(1));
      }
      if (temp.length == 5) {
        return (temp = temp.substr(0, 2) + "," + temp.substr(2, 4));
      }
    }
  }

  getUserSavedDataFromStorage(): DashboardData {
    return JSON.parse(sessionStorage.getItem("userDashboardData"));
  }

  updateUserDataInStorage(newObj) {
    sessionStorage.removeItem("userDashboardData");
    sessionStorage.setItem("userDashboardData", JSON.stringify(newObj));
  }

  checkDisplayAndSetAppropriateView(): string {
    return window.outerWidth > 760 ? "desktop" : "mobile";
  }

  changeScreenDisplay(): string {
    let screensize = window.outerWidth > 760 ? "desktop" : "mobile";
    return screensize;
  }

  activateNotificationFromLend(anything) {
    this.sendNotificationToLoginComponent.next(anything);
  }
}
