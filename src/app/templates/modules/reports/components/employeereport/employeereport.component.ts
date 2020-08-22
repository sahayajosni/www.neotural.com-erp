import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';

@Component({
  selector: "app-employeereport",
  templateUrl: "./employeereport.component.html",
  styleUrls: ["./employeereport.component.scss"]
})
export class EmployeeReportComponent implements OnInit {

  constructor(
    private router: Router,
  ) {}

  ngOnInit() {}

  dailyReport(){
    this.router.navigate(["reports/dailyreport"]);
  }

}
