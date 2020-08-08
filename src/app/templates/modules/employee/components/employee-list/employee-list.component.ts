import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Inject,Optional,
  OnDestroy
} from "@angular/core";

import { MatSnackBar } from "@angular/material/snack-bar";
import { Employee } from "./employee-list.model";
import { EmployeeDetailComponent } from "../employee-detail/employee-detail.component";
import { EmployeeService } from "../../services/employee.service";
import { AlertService } from "src/app/core/common/_services/index";
import { PrintDialogService } from "src/app/core/services/print-dialog/print-dialog.service";
import {MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import { EmployeeAddComponent } from "../employee-add/employee-add.component";
import { CommonService } from "../../../../../core/common/_services/common.service";
import {formatDate } from '@angular/common';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.scss"]
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  employeesDS: any = {};
  employees: MatTableDataSource<Employee>;
  employee;
  dialogConfig = new MatDialogConfig();
  showHideDailyReport = [];
  getDailyReportDetail: any;
  isShowHideAbsent = [];
  getAbsentDetail: any;
  isShowHideCheckinCheckout = [];
  isAbsentMouseover = [];
  todayTime: any;
  employeeDetails: any;

  isSortIdDesc: boolean = false;
  isSortIdAsc: boolean = true;
  isSortNameDesc: boolean = false;
  isSortNameAsc: boolean = true;

  model:any = {};
  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: string;
  
  constructor(
    private employeeService: EmployeeService,
    private alertService: AlertService,
    private printDialogService: PrintDialogService,
    private snackBar: MatSnackBar,
    //private config: MatSnackBarConfig,
    private dialog: MatDialog,
    public commonService: CommonService,
    public router: Router,
    config: NgbModalConfig, private modalService: NgbModal,
    private _sanitizer: DomSanitizer,
    private SpinnerService: NgxSpinnerService,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() { 
    this.SpinnerService.show();  
    this.allemplist();
  }

  printPage(data) {
    this.printDialogService.openDialog(data);
  }

  enable: boolean;
  allemplist() {
    this.employeeService.load().subscribe(
      data => { 
        this.employeesDS = data;
        this.SpinnerService.hide();
        if(this.employeesDS.length > 0) {
          this.enable = true;
        } else {
          this.enable = false;
          setTimeout(() => {
            this.snackBar.open("Employee data is empty", "dismiss", {
              duration: undefined,
              panelClass: ["warning"],
              verticalPosition: "top",
              horizontalPosition: 'center'
            });
          });
        }
        console.log(this.employeesDS);
      },
      error => {
        this.SpinnerService.hide();
        setTimeout(() => {
          this.snackBar.open(
            "Network error: server is temporarily unavailable",
            "dismss",
            {
              panelClass: ["error"],
              verticalPosition: "top"
            }
          );
        });
      }
    );
  }

  deleteEmployee(employeecode: string) {
    this.employeeService.remove(employeecode).subscribe(
      data => {
        this.employee = data;
        if (this.employee.status == "Success") {
          setTimeout(() => {
            this.snackBar.open("Employee is deleted successfully", "", {
              panelClass: ["error"],
              verticalPosition: "top"
            });
          });
          this.allemplist();
          this.employees = new MatTableDataSource(this.employeesDS);
          setTimeout(() => {
            this.alertService.clear();
          }, 1500);
        } else {
          setTimeout(() => {
            this.snackBar.open(
              "Network error: server is temporarily unavailable",
              "",
              {
                panelClass: ["error"],
                verticalPosition: "top"
              }
            );
          });
        }
        this.allemplist();
      },
      error => {
        setTimeout(() => {
          this.snackBar.open(
            "Network error: server is temporarily unavailable",
            "",
            {
              panelClass: ["error"],
              verticalPosition: "top"
            }
          );
        });
      }
    );
  }

  sortByOrder(column: string, order: string) {
    if (column === "code" && order === "desc") {
      this.isSortIdDesc = true;
      this.isSortIdAsc = false;
      this.employeesDS.sort((a, b) => b.employeecode.localeCompare(a.employeecode));
    } else if (column === "code" && order === "asc") {
      this.isSortIdDesc = false;
      this.isSortIdAsc = true;
      this.employeesDS.sort((a, b) => a.employeecode.localeCompare(b.employeecode));
    } else if (column === "name" && order === "desc") {
      this.isSortNameDesc = true;
      this.isSortNameAsc = false;
      this.employeesDS.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      this.isSortNameDesc = false;
      this.isSortNameAsc = true;
      this.employeesDS.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  applyFilter(filterValue: string) {
    this.employees.filter = filterValue.trim().toLowerCase();
    if (this.employees.paginator) {
      this.employees.paginator.firstPage();
    }
  }

  addEmployee() {
    const modalRef = this.modalService.open(EmployeeAddComponent, { windowClass: 'employee-class'});

    let data: any;
    modalRef.componentInstance.passedData= data;
    modalRef.result.then((result) => {
      this.allemplist();
    }, (reason) => {
      this.allemplist();
    }); 

    if(this.snackBar.open) {
      this.snackBar.dismiss();
    }
    /* let data = {};
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.position = {
      'top': '1000',
      left: '100'
    };
    this.dialog.open(EmployeeAddComponent,{
      panelClass: 'addpromotion',
      width:'200vh',
      height:'400vh',
      data: data,
      disableClose: true,
     // hasBackdrop: true
    }) */
    //.afterClosed().subscribe(result => {
    //  this.allemplist();
   // });
    
  }

  ngOnDestroy(){
    this.snackBar.dismiss();
    (<HTMLElement>document.querySelector('.mat-drawer-content')).style.overflow = 'auto';
  }

/*  removeScrollBar() {
    setTimeout(function () {
        (<HTMLElement>document.querySelector('.mat-drawer-content')).style.overflow = 'inherit';
      }, 300);
  }
*/
  dailyReport(index: number, item: any) { 
    this.showHideDailyReport = [];
    this.isShowHideAbsent = [];
    this.isShowHideCheckinCheckout = [];
    this.showHideDailyReport[index] = true;
    item.date = this.commonService.getTodayDate();
    this.employeeService.getDailyReportLists(item).subscribe((res: any) => {
      if (res.length > 0) { 
        this.getDailyReportDetail = res[0];
      }
    })
  }

  closePopup(value: boolean, index, type: string) {
    if (type === 'report') {
      this.showHideDailyReport[index] = value;
    } else if (type === 'absence') {
      this.isShowHideAbsent[index] = value;
    } else {
      this.isShowHideCheckinCheckout[index] = value;
    }
  }

  absentPopup(index: number, item: any) { 
    this.isShowHideAbsent = [];
    this.showHideDailyReport = [];
    this.isShowHideCheckinCheckout = [];
    this.isShowHideAbsent[index] = true;
    item.date = this.commonService.getTodayDate();
    this.getEmployeeAbsentDetail(item);
  }

  checkinCheckout(index: number, item: any) {
    this.todayTime = '';
    const currentDate = new Date();
    this.todayTime = currentDate;
    this.showHideDailyReport = [];
    this.isShowHideAbsent = [];
    this.isShowHideCheckinCheckout = [];
    this.isShowHideCheckinCheckout[index] = true;
    this.getEmployeeAbsentDetail(item);
  }

  getEmployeeAbsentDetail(item: any) {
    this.getAbsentDetail = undefined;
    item.date = this.commonService.getTodayDate();
    item.type = 'D';
    this.employeeService.getAbsentLists(item).subscribe((res: any) => { 
      if (res.length > 0) { 
        this.getAbsentDetail = res[0];
      }
    })
  }

  absentMouseover(index: number, item: any) { 
    this.isAbsentMouseover = [];
    item.date = this.commonService.getTodayDate();
    item.type = 'D';
    this.employeeService.getAbsentLists(item).subscribe((res: any) => { 
      if (res.length > 0) { 
        this.getAbsentDetail = res[0];
        if (this.getAbsentDetail.absent === 'yes') {
          this.isAbsentMouseover[index] = true;
        } else {
          this.isAbsentMouseover[index] = false;
        }
      } else {
        this.isAbsentMouseover[index] = false;
      }
    }) 
  }

  enableAbsentIcon(value: boolean, index: number) {
    this.isAbsentMouseover[index] = value;
  }

  getImage(imgData) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(imgData);
  }

}
