import { Component, OnInit, Injector, AfterViewInit } from "@angular/core";
import { UserComponent } from "../user/user.component";
import {
  TransactionHistory,
  Transactions
} from "src/app/models/transactionHistory";
import { test } from "src/app/services/sampleData";
import { defer } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { Summary } from "src/app/models/summaryData";
import { take } from "rxjs/operators";

@Component({
  selector: "app-view-statement-history",
  templateUrl: "./view-statement-history.component.html",
  styleUrls: ["./view-statement-history.component.css"]
})
export class ViewStatementHistoryComponent extends UserComponent
  implements OnInit, AfterViewInit {
  count: number = 0;
  showPagination: boolean;
  nextButton: boolean;
  public noContent: string = undefined;
  public realDocTwo: HTMLDivElement;
  public transactions: Array<Transactions> = [];
  public summary: Summary = {};
  public newSummary = [];
  public error = false;
  noStatementHistory: boolean = false;
  overlayResult: HTMLDivElement;
  test = test;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.getDataToDisplay();
    this.generalservice.getTransactionHistory$.subscribe(val => {
      if (val.length < 1) {
        return;
      }
      this.getDataToDisplay();
    });
  }

  ngAfterViewInit() {
    this.realDocTwo = document.querySelector(".real-two") as HTMLDivElement;
    this.overlayResult = document.querySelector(
      ".overlayResult"
    ) as HTMLDivElement;
    this.overlayResult.style.display = "none";
    // realDocTwo.style.display = "block";
  }
  async getDataToDisplay(number?: string) {
    defer(
      async () => await super.fetchUserHistoryOfTransactions(number)
    ).subscribe(
      (val: TransactionHistory) => {
        // console.log(val);
        if ((val as Object).hasOwnProperty('transactions') && val["transactions"].length == 0) {
          this.noStatementHistory = true;
          return;
        }
        this.transactions = [];
        if (!val["end"] && (val as Object).hasOwnProperty('transactions') &&  val["transactions"].length > 8) {
          this.nextButton = true;
          this.showPagination = true;
        } else {
          this.showPagination = false;
          this.nextButton = false;
        }
        const { transactions } = val;
        this.transactions = [...this.filter(transactions as Array<any>)];
        // this.transactions = [...transactions];
        // if (val.transactions.length == 0) {
        //   this.transactions = this.test;
        // }
        // this.noContent = "true";
        this.noStatementHistory = false;
      },
      (err: HttpErrorResponse) => {
        if (err.status == 403) {
          this.handleSessionExpiration();
        }
        console.error;
      }
    );
  }

  public modifyStatementLink(str: string): string {
    return (str = str.length > 5 ? "View Statement ..." : str);
  }

  public retrieveSummary(summary: object) {
    (document.querySelector(
      ".modal-dialog.modal-dialog-scrollable"
    ) as HTMLDivElement).style.minWidth = "720px";
    this.summary = summary;
  }

  public modifyDisplay(str: string): string {
    if (!str) return;
    return str.replace(/&#/gi, "");
  }

  private handleSessionExpiration() {
    this.noContent = "true";
    this.error = true;
  }

  filter(transactions: Array<any>) {
    let approvedTransactionsToDisplay = [];
    // for (const transaction in transactions){
    //   Object.
    // }
    if(transactions){
      transactions.forEach(transaction => {
      // console.log(transaction);
      if (transaction["analytics_score"]) {
        approvedTransactionsToDisplay.push(transaction);
      }
    });
    }
    

    return approvedTransactionsToDisplay;

    // console.log(approvedTransactionsToDisplay);
  }

  downloadPdf(pdf) {
    if (pdf.includes("pdf")) {
      const a = document.createElement("a");
      const img = document.querySelector(".slidable-img");
      a.href = pdf;
      a.setAttribute("download", pdf);
      img.insertAdjacentElement("afterend", a);
      a.click();
    } else {
      return;
    }
  }

  closeOverlayResultDisplay(nameOfClass: string) {
    const overlay = document.querySelector(`.${nameOfClass}`) as HTMLDivElement;
    overlay.style.display = "none";
    overlay.style.zIndex = "-1";
  }

  showAnalysisSummary(summary: object) {
    let approvedSummaryForDisplay = {};
    this.overlayResult.style.display = "flex";
    if (typeof summary !== "object") {
      return;
    }
    this.newSummary = [];
    for (let item in summary) {
      if (
        item == "total_deposit" ||
        item == "current_balance" ||
        item == "average_monthly_deposit" ||
        item == "total_utility" ||
        item == "average_monthly_withdraw" ||
        item == "last_loan" ||
        item == "last_loan_amount" ||
        item == "last_loan_date" ||
        item == "total_cashflow" ||
        item == "frequent_salary_amount"
      ) {
        approvedSummaryForDisplay[item] = summary[item];
      } else {
        continue;
      }
    }

    // console.log(approvedSummaryForDisplay);

    Object.entries(approvedSummaryForDisplay).forEach(entry => {
      this.newSummary.push(entry);
    });
  }

  enlargeFunction(sum: any) {
    console.log(sum);
  }

  getPreviousSetOfTransactions() {
    if (this.count == 0) {
      return;
    } else if (this.count == 11) {
      this.count -= 11;
      this.getDataToDisplay(String(this.count));
    } else {
      this.count -= 10;
      this.getDataToDisplay(String(this.count));
    }
  }

  getNextSetOfTransactions() {
    if (this.count == 0) {
      this.count += 11;
      // console.log(this.count);
      this.getDataToDisplay(String(this.count));
    } else {
      this.count += 10;
      // console.log(this.count);
      this.getDataToDisplay(String(this.count));
    }
  }
}
