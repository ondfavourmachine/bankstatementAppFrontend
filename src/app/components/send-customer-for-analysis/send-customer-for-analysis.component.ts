import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Bank } from 'src/app/models/dashboard-data';
import { UserService } from 'src/app/services/User/user.service';

@Component({
  selector: 'app-send-customer-for-analysis',
  templateUrl: './send-customer-for-analysis.component.html',
  styleUrls: ['./send-customer-for-analysis.component.css']
})
export class SendCustomerForAnalysisComponent implements OnInit {
@Input('banksToDisplay') banksToDisplay: Bank[];
customerDetailsForm: FormGroup;
checkingCustomerDetails: boolean = false;
  constructor(private fb: FormBuilder, private user: UserService) { }

  ngOnInit() {
    this.customerDetailsForm = this.fb.group({
      account_number: ['', Validators.required],
      bank_code: ['', Validators.required],
      account_name: ['', Validators.required],
      has_internet_banking: ['', Validators.required],
    })
  }

  get bankCodeOfCustomer () {
    return this.customerDetailsForm.get('bank_code');
  }

  submitForm(form: FormGroup){
    console.log(form.value);
  }


  fetchAccountNumber(acctNumber){
    const customerBankCode = this.bankCodeOfCustomer.value;
    this.checkingCustomerDetails = true;
    this.user.confirmAccountDetailsOfParent({bank_code: customerBankCode, account_number: acctNumber})
    .subscribe(val => {
      console.log(val);
      this.checkingCustomerDetails = false;
    }, 
    err => {
      console.table(err);
      this.checkingCustomerDetails = false;
    }
    )
  
  }


  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
