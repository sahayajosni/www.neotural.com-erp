import { Component, OnInit, Input, Output, EventEmitter, Optional, Inject } from "@angular/core";
import { EmployeeService } from "../../services/employee.service";
import { CommonService } from "../../../../../core/common/_services/common.service";
import {formatDate } from '@angular/common';

import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

export interface UsersData{
  employeecode:string;
  date:string;
  type:string;
  currentTime:string;
  checkoutreason:string;
  checkinreason:string;
  checkintime: string;
}

@Component({
  selector: "app-employee-checkin-checkout",
  templateUrl: "./employee-checkin-checkout.component.html",
  styleUrls: ["./employee-checkin-checkout.component.scss"]
})
export class EmployeeChecinCheckoutComponent implements OnInit {
  model: any = {};
  //@Output() closeCheckinCheckoutPopup: EventEmitter<any> = new EventEmitter<any>();
  //@Output() enableAbsentIcon: EventEmitter<any> = new EventEmitter<any>();
  //@Input() absenceItem: any;
  //@Input() getAbsentDetail: any;
  //@Input() currentTime: any;
  isSaveAbsent: boolean = false;
  todayTime: any;
  isSaveChecinCheckout: boolean = false;
  isDisableCheckout: boolean = false;
  isDisableCheckin: boolean = false;
  checkoutLabel: string = '';
  checkinLabel: string = '';
  getAttendanceDetail:any = {};
  @Input() fromParent: UsersData;

  constructor(
    private employeeService: EmployeeService,
    public commonService: CommonService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UsersData, 
  ) { 

    }

  ngOnInit() { 
    //this.todayTime = formatDate(this.currentTime, 'HH:mm', 'en-US', '+0530');
    this.todayTime = formatDate(this.fromParent.currentTime, 'hh:mm aa', 'en-US', '+0530'); 
    setTimeout(() => { 
      this.model.checkinCheckoutReason = '';
      this.disableCheckoutButton();
      this.disableCheckinButton();
    }, 200);
   
  }

  checkinCheckoutPopupClose() { 
    this.activeModal.close();
    //this.closeCheckinCheckoutPopup.emit(false);
  }

  objectKeys(obj) {
    return Object.keys(obj);
  }
  saveCheckinCheckedout(type: string) {
    this.isSaveChecinCheckout = true; 
    this.model.employeecode = this.fromParent.employeecode;
    this.model.type = this.fromParent.type;
    //this.model.employeecode = this.absenceItem.employeecode;
    //this.model.type = this.getAbsentDetail === undefined ? 'save':'update';
    this.model.date = this.commonService.getTodayDate();
    let msg = '';
    if (type === 'checkedin') {
      this.model.checkinreason = this.model.checkinCheckoutReason;
      this.model.checkintime = this.todayTime;
      this.model.checkoutreason = null;
      this.model.checkouttime = null;
      msg = 'Checked in successfully';
    } else {
      this.model.checkoutreason = this.model.checkinCheckoutReason;
      this.model.checkouttime = this.todayTime;
      this.model.checkinreason = this.fromParent.checkinreason;
      this.model.checkintime = this.fromParent.checkintime; 
      msg = 'Checked out successfully';
    }
    
    this.model.absent = null;
    this.model.reason = null;
    if (this.model.checkinCheckoutReason !== '') {
          this.employeeService.saveEmployeeAbsent(this.model).subscribe((res: any) => {
          this.commonService.getSuccessErrorMsg(res,msg);
          if (res === null) {
            //this.enableAbsentIcon.emit(false);
            this.checkinCheckoutPopupClose();
          }
        });
    }
  }

  disableCheckoutButton() { 
    if (this.fromParent.checkoutreason !== null ) {
      this.isDisableCheckout = true;
      this.checkoutLabel = 'Checked-Out';
    } else {
      this.isDisableCheckout = false;
      this.checkoutLabel = 'Check-Out';
    } 
  }

  disableCheckinButton() { 
    if (this.fromParent.checkinreason !== null ) {
      this.isDisableCheckin = true;
      this.checkinLabel = 'Checked-In';
    } else {
      this.isDisableCheckin = false;
      this.checkinLabel = 'Check-In';
    } 
  }
}
