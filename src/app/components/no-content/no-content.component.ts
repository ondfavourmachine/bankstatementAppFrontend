import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";

@Component({
  selector: "app-no-content",
  templateUrl: "./no-content.component.html",
  styleUrls: ["./no-content.component.css"]
})
export class NoContentComponent implements OnInit, OnChanges {
  @Input("message") message: string;
  constructor() {}

  ngOnChanges(change: SimpleChanges) {
    // console.log(change);
  }

  ngOnInit() {}
}
