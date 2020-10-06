import { Component, OnInit,HostListener, OnChanges, Input, ViewChild ,ElementRef,Inject,Optional,OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

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
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import *  as  XLSX from 'xlsx';
import { EmployeeReportComponent } from "../employee-report/employee-report.component";
import { EmployeeAbsenceComponent } from "../employee-absence/employee-absence.component";
import { EmployeeChecinCheckoutComponent } from "../employee-checkin-checkout/employee-checkin-checkout.component";

@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.scss"],
  // providers: [NgbModalConfig, NgbModal]
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  employeesDS: any = {};
  employeesList: any = {};
  employeesTempList: any = {};

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
  enable: boolean;

  model:any = {};
  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: string;
  pageSkip: number = 0; 
  @ViewChild('employeeReport', {static:false}) employeeReport: ElementRef;  

  
  isDisableCheckin: boolean = false;
  isDisableAbsent: boolean = false;
  //totalrowCount: number = 0;  

  constructor(
    private employeeService: EmployeeService,
    private alertService: AlertService,
    private printDialogService: PrintDialogService,
    private snackBar: MatSnackBar,
    //private config: MatSnackBarConfig,
    private dialog: MatDialog,
    public commonService: CommonService,
    public router: Router,
    private SpinnerService: NgxSpinnerService,
    config: NgbModalConfig, private modalService: NgbModal,
    private _sanitizer: DomSanitizer,

  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() { 
    this.SpinnerService.show();  
    //this.totalrowCount = this.getAllEmployeeRowCount();
    //this.employeesDS = this.allemplist(this.pageSkip);
    this.employeesDS = this.allemplist();
  }
  /* onScrollDown() {
    console.log('scrolled down!!');
    this.pageSkip = this.pageSkip + 20; 
    if(this.totalrowCount > this.pageSkip) {
      this.employeesTempList = this.allemplist(this.pageSkip);
      this.employeesDS.push(this.employeesTempList); 
    }
  }
 
  onScrollUp() {
    console.log('scrolled up!!');
  } */

  printPage(data) {
    this.printDialogService.openDialog(data);
  }

  /* getAllEmployeeRowCount() {
    this.employeeService.getAllEmployeeRowCount().subscribe(
      data => { 
        this.totalrowCount = data;
        console.log("Row Count-->"+this.totalrowCount);
      },
      error => {
        this.SpinnerService.hide();
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
    return this.totalrowCount;
  } */
  

  /* allemplist(pagination:number) {
    this.employeeService.load(pagination).subscribe( */
  allemplist() {
    this.employeeService.load().subscribe(
      data => { 
        this.employeesDS = data;
        this.employeesList = this.employeesDS;
        this.SpinnerService.hide();
        if(this.employeesDS.length > 0) {
          this.enable = true;
        } else {
          this.enable = false;
          setTimeout(() => {
            this.snackBar.open("Employee data is empty", "", {
              duration: undefined,   
              panelClass: ["warning"],
              verticalPosition: "top",
              horizontalPosition: 'center'
            });
          });
        }
       // alert(this.employeesDS.length);
        console.log(this.employeesDS);
      },
      error => {
        this.SpinnerService.hide();
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
    return this.employeesDS;
  }
  

  onSearchChange(searchValue: string): void {  
    console.log(searchValue);
    this.employeesDS = this.employeesList.filter(employee =>
    employee.name.toLowerCase().indexOf(searchValue.toLowerCase()) !==-1)
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
          //this.allemplist(this.pageSkip);
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
  localpath = "/assets/images/no-image.png";
  addEmployee() {
    const modalRef = this.modalService.open(EmployeeAddComponent, { windowClass: 'employee-class'});

    let data: any;
    modalRef.componentInstance.passedData= data;
    modalRef.result.then((result) => {
      //this.allemplist(this.pageSkip);
    }, (reason) => {
      this.pageSkip = 0;  
      //this.allemplist(this.pageSkip);
      this.allemplist();
    }); 
    
    /* if(this.snackBar.open) {
      this.snackBar.dismiss();
    }
     let data = {};
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.position = {
      'top': '1000',
      left: '100'
    };
    this.dialog.open(EmployeeAddComponent,{
      panelClass: 'addpromotion',
      width:'200vh',
      //height:'400vh',
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

    const modalRef = this.modalService.open(EmployeeReportComponent, { windowClass: 'dailyreport-class'});
    let data: any;
    data = item;

    modalRef.componentInstance.fromParent = data;
    modalRef.result.then((result) => {
    }, (reason) => { }); 

    /* this.employeeService.getDailyReportLists(item).subscribe((res: any) => {
      if (res.length > 0) { 
        this.getDailyReportDetail = res[0];
      }
    }) */
  }

  /* closePopup(value: boolean, index, type: string) {
    if (type === 'report') {
      this.showHideDailyReport[index] = value;
    } else if (type === 'absence') {
      this.isShowHideAbsent[index] = value;
    } else {
      this.isShowHideCheckinCheckout[index] = value;
    }
  } */

  absentPopup(index: number, item: any,temp) { 
    this.isShowHideAbsent = [];
    this.showHideDailyReport = [];
    this.isShowHideCheckinCheckout = [];
    this.isShowHideAbsent[index] = true;
    item.date = this.commonService.getTodayDate();
    item.reporttype = "Absent";
    if(temp == 1){
      this.getEmployeeAttendanceDetail(item);
    }else if(temp == 2){
      this.getEmployeeAbsentDetail(item);
    }
  }

  checkinCheckout(index: number, item: any) {
    this.todayTime = '';
    const currentDate = new Date();
    this.todayTime = currentDate;
    item.currentTime = this.todayTime;
    this.showHideDailyReport = [];
    this.isShowHideAbsent = [];
    this.isShowHideCheckinCheckout = [];
    this.isShowHideCheckinCheckout[index] = true;
    item.reporttype = "CheckInOut";
    this.getEmployeeAbsentDetail(item);
  }

  getEmployeeAbsentDetail(item: any) {
    this.getAbsentDetail = undefined;
    item.date = this.commonService.getTodayDate();
    item.type = 'D';
    let modalRef: any;
    let data: any;
    item.checkoutreason = null;
    item.checkinreason = null;

    this.employeeService.getAbsentLists(item).subscribe((res: any) => { 
      if (res.length > 0) { 
        this.getAbsentDetail = res[0];
        item.checkoutreason = this.getAbsentDetail.checkoutreason;
        item.checkinreason = this.getAbsentDetail.checkinreason;
        item.checkintime = this.getAbsentDetail.checkintime;
        item.checkouttime = this.getAbsentDetail.checkouttime;
        item.absent = this.getAbsentDetail.absent;
        this.model.checktype = "In";
      }
    })

    if(item.reporttype == "Absent"){
      modalRef = this.modalService.open(EmployeeAbsenceComponent, { windowClass: 'absent-class'});
      if(item.absent === 'yes'){
        this.isDisableAbsent = true;
        this.isDisableCheckin = true;
      }else{
        this.isDisableAbsent = false;
        this.isDisableCheckin = false;
      }
      data = item;
    }else if(item.reporttype == "CheckInOut"){
      modalRef = this.modalService.open(EmployeeChecinCheckoutComponent, { windowClass: 'checkinout-class'});
      if(this.model.checktype !== "In"){
        item.checkoutreason = null;
        item.checkinreason = null;
        item.checkintime = null;
        item.checkouttime = null;
      }
      data = item;
    }

    modalRef.componentInstance.fromParent = data;
    modalRef.result.then((result) => {
    }, (reason) => { }); 

    /* this.employeeService.getAbsentLists(item).subscribe((res: any) => { 
      if (res.length > 0) { 
        this.getAbsentDetail = res[0];
      }
    }) */
  }

  getEmployeeAttendanceDetail(item: any) {
    this.getAbsentDetail = undefined;
    item.date = this.commonService.getTodayDate();
    item.type = 'D';
    item.checkoutreason = null;
    item.checkinreason = null;

    this.employeeService.getAbsentLists(item).subscribe((res: any) => { 
      if (res.length > 0) { 
        this.getAbsentDetail = res[0];
        item.checkoutreason = this.getAbsentDetail.checkoutreason;
        item.checkinreason = this.getAbsentDetail.checkinreason;
        item.absent = this.getAbsentDetail.absent;
      }
    })

    if(item.reporttype == "Absent"){
      if(item.absent == 'yes'){
        this.isDisableAbsent = true;
        this.isDisableCheckin = true;
      }else{
        this.isDisableAbsent = false;
        this.isDisableCheckin = false;
      }
    }
  }

  /* absentMouseover(index: number, item: any) { 
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
  } */

  saveEmployee() { 
    this.model.profilepic=this.cardImageBase64;
    this.employeeService.save(this.model)
      .subscribe(
      data => {
        setTimeout(() => {
          this.snackBar.open("Employee created Successfully", "", {
            panelClass: ["success"],
            verticalPosition: 'top'      
          });
        });
        this.modalService.dismissAll();
        //this.allemplist(this.pageSkip);
        this.allemplist();
      },
      error => {
        setTimeout(() => {
          this.snackBar.open("Network error: server is temporarily unavailable", "", {
            panelClass: ["error"],
            verticalPosition: 'top'      
          });
        });  
      }
    );
  }

  addEmplyeeFields() {
    this.model.name = '';
    this.model.rank = '';
    this.model.phonenumber = '';
    this.model.address = '';
    this.model.email = '';
    this.model.dob = '';
    this.model.contractnumber = '';
    this.model.npwp = '';
    this.model.bpjs = '';
    this.model.monthlysalary = '';
    this.model.workHour = '';
    this.model.annualLeave = '';
    this.model.departmentname = '';
    this.model.location = '';
  }

  fileChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
        // Size Filter Bytes
        const max_size = 20971520;
        const allowed_types = ['image/png', 'image/jpeg'];
        const max_height = 1200;
        const max_width = 600;

        if (fileInput.target.files[0].size > max_size) {
          this.imageError =
              'Maximum size allowed is ' + max_size / 1000 + 'Mb';
          return false;
        }

        if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
          this.imageError = 'Only Images are allowed ( JPG | PNG )';
          return false;
        }
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const image = new Image();
          image.src = e.target.result;
          image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];
          console.log(img_height, img_width);
          if (img_height > max_height && img_width > max_width) {
            this.imageError =
                'Maximum dimentions allowed ' +
                max_height +
                '*' +
                max_width +
                'px';
            return false;
          } else {
            const imgBase64Path = e.target.result;
            this.cardImageBase64 = imgBase64Path;
            this.isImageSaved = true;
          }
        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  removeImage() {
    this.cardImageBase64 = null;
    this.isImageSaved = false;
  }

  getImage(imgData) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(imgData);
  }

  exportAsExcel() {  
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.employeeReport.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); 
    XLSX.writeFile(wb, 'Employee.xlsx');  
  } 
  
}
