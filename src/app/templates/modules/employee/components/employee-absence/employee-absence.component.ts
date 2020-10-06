import { Component, OnInit, Input, Output, EventEmitter,Optional, Inject } from "@angular/core";
import { EmployeeService } from "../../services/employee.service";
import { CommonService } from "../../../../../core/common/_services/common.service";

import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

export interface UsersData{
  employeecode:string;
  date:string;
  type:string;
  checkinreason:string;
}

@Component({
  selector: "app-employee-absence",
  templateUrl: "./employee-absence.component.html",
  styleUrls: ["./employee-absence.component.scss"]
})
export class EmployeeAbsenceComponent implements OnInit {
  model: any = {};
  //@Output() closeAbsencePopup: EventEmitter<any> = new EventEmitter<any>();
  @Input() absenceItem: any;
  @Input() getAbsentDetail: any;
  isSaveAbsent: boolean = false;
  isDisableAbsent: boolean = false;
  @Input() fromParent: UsersData;
  
  constructor(
    private employeeService: EmployeeService,
    public commonService: CommonService,        
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UsersData, 
  ) {}

  ngOnInit() {
   setTimeout(() => {
    this.model.reason = this.getAbsentDetail !== undefined ? this.getAbsentDetail.reason:'';
  }, 200);
  }

  absencePopupClose() {
    this.activeModal.close();
    //this.closeAbsencePopup.emit(false);
  }

  objectKeys(obj) {
    return Object.keys(obj);
  }

  saveAbsence() { 
    let msg = '';
    this.isSaveAbsent = true;
    this.model.employeecode = this.fromParent.employeecode;
    this.model.type = this.fromParent.type; 
    //this.model.employeecode = this.absenceItem.employeecode;
    //this.model.type = this.getAbsentDetail === undefined ? 'save':'update';
    this.model.date = this.commonService.getTodayDate();
    this.model.checkinreason = null;
    this.model.checkintime = null;
    this.model.checkoutreason = null;
    this.model.checkouttime = null;
    this.model.absent = 'yes';
    if (this.model.reason !== '') {
      //if (this.getAbsentDetail === undefined) {
        msg = 'Absence has been added successfully';
      /* } else { console.log('model', this.model)
        msg = 'Absence has been updated successfully';
      } */
        this.employeeService.saveEmployeeAbsent(this.model).subscribe((res: any) => {
          this.commonService.getSuccessErrorMsg(res,msg);
          if (res === null) {
            this.absencePopupClose();
          }
        });
    
    // else {
    //     this.model.checkinreason = null;
    //     this.model.checkintime = null;
    //     this.model.checkoutreason = null;
    //     this.model.checkouttime = null;
    //     this.model.absent = 'yes';
    //     msg = 'Absence has been updated successfully';
    //     this.employeeService.updateEmployeeAbsent(this.model).subscribe((res: any) => {
    //       this.commonService.getSuccessErrorMsg(res,msg);
    //       if (res === null) {
    //         this.absencePopupClose();
    //       }
    //     });
    // } 
    }
  }

}
