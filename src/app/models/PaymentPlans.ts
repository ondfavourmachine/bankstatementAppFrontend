import { GeneralService } from "../services/general.service";
import { PaystackResponse } from "./payStack-response";

export interface PaymentPlans {
  id?: number;
  name?: string;
  no_of_statements: number;
  expiration_days: number;
  price: number;
}
export interface PaymentInitiationReturnVal {
  package_id: string;
  package_price: number;
  payment_reference: string;
  transaction_id: number;
}

export class PaymentApi {
  public email: string = this.service.extractEmailFromPayload();
  public amount: string;
  public reference: string;
  public title: string;
  public key: string = "pk_test_6feb7dca80f00bc32d576032fe06b48b0a77708f";

  constructor(
    private service: GeneralService,
    amount: string,
    reference: string
  ) {
    this.amount = amount === "1" ? amount : amount + "00";
    this.reference = reference;
  }

  paymentGenerator() {
    return `<a
    style="align-self: center; background: #363795;"
    class="btn text-uppercase text-white u-btn-primary g-rounded-50 g-font-size-12 g-font-weight-700 g-pa-15-30 g-mb-10"
    angular4-paystack
    [key]="key"
    [email]="email"
    [amount]="amount"
    [ref]="reference"
    [class]="'btn btn-primary'"
    (paymentInit)="paymentInit()"
    (close)="paymentCancel()"
    (callback)="paymentDone($event)"
    >Pay Now</a
  >`;
  }

  randomString(len: number, charSet?: string) {
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
    return randomString;
  }

  changePlans() {
    return `<a
    id="changePlansDynamically"
    style="align-self: center; background: #363795;"
    class="anchorInsidePElement btn text-uppercase text-white u-btn-primary g-rounded-50 g-font-size-12 g-font-weight-700 g-pa-15-30 g-mb-10"
    >Change Plans</a
  >`;
  }

  paymentInit() {
    // console.log("Payment initialized");
  }

  paymentDone(ref: PaystackResponse) {
    // this.title = "Payment successfull";
    // console.log(this.title, ref);
    this.service.changeObservable(ref);
  }

  paymentCancel() {
    console.log("payment failed");
  }
}
