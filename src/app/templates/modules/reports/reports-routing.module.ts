import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router"; 

// Components
import { ReportComponent } from "./components/reports/reports.component";
import { EmployeeReportComponent } from "./components/employeereport/employeereport.component";
import { DailyReportComponent } from "./components/dailyreport/dailyreport.component";

const routes: Routes = [
  {
      path: '',
      component: ReportComponent,
      pathMatch: 'full'
  },
  {
    path: 'reports',
    component: ReportComponent,
  },
  {
    path: 'employeereport',
    component: EmployeeReportComponent,
  },
  {
    path: 'dailyreport',
    component: DailyReportComponent,
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule {}
