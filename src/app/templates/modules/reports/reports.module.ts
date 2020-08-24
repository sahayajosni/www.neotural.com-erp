import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModalModule } from "ngx-bootstrap";

// Modules
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule
} from "@angular/material";

import { ReportRoutingModule } from "./reports-routing.module";
import { DataTablesModule } from "angular-datatables";
import { CoreModule } from "src/app/core/core.module";

// Services
import { ReportService } from "./services/reports.service";

// Components
import { ReportComponent } from "./components/reports/reports.component";
import { DailyReportComponent } from "./components/dailyreport/dailyreport.component";
import { EmployeeReportComponent } from "./components/employeereport/employeereport.component";
import { FormsModule } from "@angular/forms";

import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { MomentModule } from 'angular2-moment'; // optional, provides moment-style pipes for date formatting
import { NgxSpinnerModule,NgxSpinnerService  } from 'ngx-spinner';
import { NgbModal, NgbModalConfig, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    ReportComponent,
    DailyReportComponent,
    EmployeeReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReportRoutingModule,
    CoreModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    NgbTypeaheadModule, 
    NgIdleKeepaliveModule.forRoot(),
    MomentModule,
    NgxSpinnerModule,
    NgbModule,

    ModalModule.forRoot(),
    DataTablesModule.forRoot()
  ],
  entryComponents: [ ],
  providers: [ReportService,NgbModalConfig,NgxSpinnerService, NgbModal],
})
export class ReportModule {}
