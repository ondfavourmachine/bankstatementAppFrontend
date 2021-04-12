import { Component, Input, OnInit } from '@angular/core';
import { Bank } from 'src/app/models/dashboard-data';

@Component({
  selector: 'app-send-customer-for-analysis',
  templateUrl: './send-customer-for-analysis.component.html',
  styleUrls: ['./send-customer-for-analysis.component.css']
})
export class SendCustomerForAnalysisComponent implements OnInit {
@Input('banksToDisplay') banksToDisplay: Bank[]
  constructor() { }

  ngOnInit() {
  }

}
