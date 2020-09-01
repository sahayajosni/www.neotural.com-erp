import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { EmployeeService } from "../../services/employee.service";
import { MatSnackBar } from "@angular/material";
import { CommonService } from "../../../../../core/common/_services/common.service";
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { Employee } from 'src/app/core/common/_models';

@Component({
  selector: "app-employee-detail",
  templateUrl: "./employee-detail.component.html",
  styleUrls: ["./employee-detail.component.scss"]
})
export class EmployeeDetailComponent implements OnInit {
  
  attendanceDetails = [];
  employeeDet: any;
  events: string[] = [];
  employee:Employee = new Employee;
  model:any =[];
  dailyReportList:any = {};
  @Input() getDailyReportDetail: any;

  constructor(
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    public commonService: CommonService,
    private _sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private SpinnerService: NgxSpinnerService,
  ) {}

  ngOnInit() {
    this.SpinnerService.show();
    this.activatedRoute.params.subscribe(params => {
      this.viewEmployee(params.id);
    });
    this.model.report = "";
    // setTimeout(function () {
    //   (<HTMLElement>document.querySelector('#date-picker')).click();
    // }, 500);
  }

  getImage(imgData) {
    //if (Array.isArray(imgData)){
      return this._sanitizer.bypassSecurityTrustResourceUrl(imgData);
    //}    
  }

  viewEmployee(empCode: string) {
    this.SpinnerService.hide();
    this.employeeService.getEmployeeDetail(empCode).subscribe((res: any) => {
      if (res.length > 0) {
        this.employeeDet = res[0];
        const item = {date:this.commonService.getTodayDate(),type:'M',employeecode: empCode};
        this.employeeService.getAbsentLists(item).subscribe((data: any) => { 
          if (data.length > 0) { 
            this.attendanceDetails = data;
          }
        })
        
      }
    });
  }
  
  /* showDailyReport() { 
    setTimeout(function () { 
      (<HTMLElement>document.querySelector('.mat-icon-button')).click();
      (<HTMLElement>document.querySelector('.mat-calendar')).style.width = '300px';
      (<HTMLElement>document.querySelector('.mat-calendar')).style.height = '0px';
      (<HTMLElement>document.querySelector('.mat-icon-button ')).style.visibility = 'hidden';
     }, 500);
  } */

  addEvent(type: string, event: MatDatepickerInputEvent<Date>,picker) {
    this.events.push(`${type}: ${event.value}`); 
    console.log('test', `${type}: ${event.value}`);
    (<HTMLElement>document.querySelector('.mat-datepicker-popup')).style.pointerEvents = 'initial !important';
    //picker.open();
    console.log('picker', picker)
  }

  editEmp(employeeDet: any){
    employeeDet.editable = !employeeDet.editable;
  }

  update(employeeDet: any){
    this.employeeService.save(employeeDet)
		.subscribe(
			data => {
				this.employee =  data; 
				setTimeout(() => {
					this.snackBar.open("Employee Updated Successfully", "", {
						panelClass: ["success"],
						verticalPosition: 'top'      
					});
				});
				this.ngOnInit();
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

  cancelEmp(employeeDet: any){
    employeeDet.editable = false;
    this.ngOnInit();
  }

  removeEmp(employeecode:string) {
    this.employeeService.remove(employeecode)
    .subscribe(
      data => {
        setTimeout(() => {
          this.snackBar.open("Employee Removed Successfully", "", {
            panelClass: ["success"],
            verticalPosition: 'top'      
          });
        });
        this.router.navigate(['/employment']);
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

  getDailyReportLists(employeecode:string,date:string){
    this.model.report = "";
    this.model.employeecode = employeecode;
    this.model.date = date;
    this.employeeService.getDailyReportLists(this.model)
    .subscribe(
      data => {
        this.dailyReportList = data;
        for (var i = 0; i < this.dailyReportList.length; i++) {
          this.dailyReportList[i].editable = false; 
        }
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

  editDailyReport(c: any){
		c.editable = !c.editable;
	}

	cancelDailyReport(c:any){
    c.editable = false;
    this.getDailyReportLists(this.employeeDet.employeecode,this.model.date);
  }
  
  updateDailyReport(employeecode:string,date:string,report:string){
    this.model.employeecode = employeecode;
    this.model.type = this.getDailyReportDetail === undefined ? 'save': 'update';
    this.model.date = date;
    this.model.report = report;

    if (this.model.report !== '') { 
      this.employeeService.saveDailyReport(this.model).subscribe((res: any) => {
        this.snackBar.open("Daily Report Updated Successfully", "", {
          panelClass: ["success"],
          duration: undefined, 
          verticalPosition: 'top'      
        });
        this.ngOnInit();
      },
      error => {
        setTimeout(() => {
          this.snackBar.open("Network error: server is temporarily unavailable", "", {
            panelClass: ["error"],
            verticalPosition: 'top'      
          });
        }); 
      });
    }
  }

  editEmptyDailyReport(){
		this.model.editable = true;
	}

	cancelEmptyDailyReport(){
    this.model.editable = false;
    this.dailyReportList.length = 0;
  }
  
  saveDailyReport(report:any){
    this.model.employeecode = this.employeeDet.employeecode;
    this.model.report = report;
    this.model.type = this.getDailyReportDetail === undefined ? 'save': 'update';
    if (this.model.report !== '') { 
      this.employeeService.updateDailyReport(this.model).subscribe((res: any) => {
        this.snackBar.open("Daily Report Updated Successfully", "", {
          panelClass: ["success"],
          duration: undefined, 
          verticalPosition: 'top'      
        });
      });
    }
  }


}
