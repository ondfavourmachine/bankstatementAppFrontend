import { Component, OnInit, AfterViewInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { debounceTime } from "rxjs/operators";
import { Observable, fromEvent } from "rxjs";
import { Router } from "@angular/router";
// import * as Paystack from "paystack-js";

@Component({
  selector: "app-cards",
  templateUrl: "./cards.component.html",
  styleUrls: ["./cards.component.css"]
})
export class CardsComponent implements OnInit, AfterViewInit {
  paymentForm: FormGroup;
  public showCvcWarning: boolean;
  public showWrongCardDetailsError: boolean;
  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.paymentForm = this.fb.group(this.generatePaymentForm());
  }

  ngAfterViewInit() {
    // setting up event listeners to listen for events on the certain input fields
    document.getElementById("CVC").addEventListener("input", e => {
      e.preventDefault();
      let input = e.target as HTMLInputElement;
      if (input.style.border.includes("red")) {
        this.showCvcWarning = true;
      } else {
        this.showCvcWarning = false;
      }
    });

    document.getElementById("cardNumber").addEventListener("input", e => {
      e.preventDefault();
      let input = e.target as HTMLInputElement;
      if (input.style.border.includes("red")) {
        this.showWrongCardDetailsError = true;
      } else {
        this.showWrongCardDetailsError = false;
      }
    });
  }

  generatePaymentForm(): Object {
    return {
      cardHolderName: ["", [Validators.required]],
      expiryDate: ["", [Validators.required, Validators.minLength(5)]],
      cardNumber: ["", [Validators.required]],
      cvc: ["", [Validators.required, Validators.minLength(3)]]
    };
  }

  public async submitCardDetails(form: FormGroup) {
    let paystackTransactionData: object = {},
      cardToSubmit: object = {};
    console.log(form.value);
    cardToSubmit["number"] = form.value["cardNumber"];
    cardToSubmit["cvv"] = form.value["cvc"];
    cardToSubmit["month"] = form.value["expiryDate"].substr(0, 2);
    cardToSubmit["year"] = form.value["expiryDate"].substr(3, 4);

    console.log(cardToSubmit);

    paystackTransactionData["email"] = JSON.parse(
      sessionStorage.getItem("registeredUser")
    ).email;

    paystackTransactionData["amount"] = 100;
    paystackTransactionData["key"] =
      "pk_test_6feb7dca80f00bc32d576032fe06b48b0a77708f";

    // let transaction = await Paystack.Transaction.request(
    //   paystackTransactionData
    // );
  }

  get cardNumber() {
    return this.paymentForm.get("cardNumber");
  }

  get cvc() {
    return this.paymentForm.get("cvc");
  }

  // this function generates a random string which will be used as transaction reference
  public randomString(len: number, charSet: string) {
    charSet =
      charSet ||
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString: string = "";
    let count = 0;
    while (count < len) {
      var randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz, randomPoz + 1);
      count++;
    }
    // for (var i = 0; i < len; i++) {
    //   var randomPoz = Math.floor(Math.random() * charSet.length);
    //   randomString += charSet.substring(randomPoz, randomPoz + 1);
    // }
    return randomString;
  }

 
}
