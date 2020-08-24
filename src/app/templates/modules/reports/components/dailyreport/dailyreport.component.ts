import {
  Component,
  OnInit,
  Input,
  ViewChild,ElementRef, AfterViewInit 
} from "@angular/core";

import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, ActivatedRoute } from '@angular/router';
import {Observable, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { ReportService } from "../../services/reports.service";
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: "app-dailyreport",
  templateUrl: "./dailyreport.component.html",
  styleUrls: ["./dailyreport.component.scss"]
})
export class DailyReportComponent implements OnInit {

	@ViewChild('monthreportContent', {static:true}) templateRef: ElementRef<any>;

	monthlyList:any = {};
	customList:any = {};
	model: any = {};
	montherepnable : boolean;
	customenable: boolean;

	searchText:string;
	showMenu = false;
	public employeelist: any;
	public employeeData = [ ];

	public monthlist = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

	constructor(private router: Router,
		private snackBar: MatSnackBar,
		private reportService:ReportService,	
		config: NgbModalConfig, private modalService: NgbModal,
		private SpinnerService: NgxSpinnerService,
	) { 
		config.backdrop = 'static';
    	config.keyboard = false;
	}

	ngAfterViewInit() {
		const modalRef = this.modalService.open(this.templateRef, {  windowClass: 'modal-class' });
		modalRef.result.then((result) => {
			this.loadMonthlyReport();
		}, (reason) => {
			this.loadMonthlyReport();
		}); 
	}

	ngOnInit() {
		this.loadEmployee();
		this.model.reporttype = "monthlyreport";
	}

	getReport(reportContent){
		this.model.employeecode = '';
		this.model.monthname = '';
		this.model.name = '';
		this.model.code = '';
		this.montherepnable = false;
		this.customenable = false;
		if(this.model.reporttype == "monthlyreport"){
			this.modalService.open(reportContent, {  windowClass: 'modal-class' });
		}else if(this.model.reporttype == "customreport"){
			this.modalService.open(reportContent, {  windowClass: 'modal-class1' });
		}
	}

	search = (text$: Observable<string>) =>
		text$.pipe(
		debounceTime(200),
		distinctUntilChanged(),
		map(term => term === '' ? []
			: this.employeeData.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
	)
	
	loadEmployee(){
		this.reportService.loadEmployee().subscribe(
			data => {         
			 	this.employeelist = data;
			 	for (var i in this.employeelist) {
			  		this.employeeData.push(this.employeelist[i].name+'-'+this.employeelist[i].employeecode);     
				}
		   		console.log("Employee list size-->"+this.employeeData.length);
			},
			error => { }
		); 
	}

	loadMonthlyReport(){
		this.monthlyList = '';
		this.modalService.dismissAll();
		var nameArr = this.model.employeecode.split('-');
		this.model.name = nameArr[0];
		this.model.code = nameArr[1];
		this.customenable = false;
		this.reportService.load(this.model)
			.subscribe(
			data => {
				this.monthlyList = data;
				if(this.monthlyList.length > 0){
					this.montherepnable = true;
				}else {
					this.montherepnable = false;
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


	loadCustomReport(){
		this.customList = '';
		this.modalService.dismissAll();
		var nameArr = this.model.employeecode.split('-');
		this.model.name = nameArr[0];
		this.model.code = nameArr[1];
		this.montherepnable = false;
		this.reportService.load(this.model)
			.subscribe(
			data => {
				this.customList = data;
				if(this.customList.length > 0){
					this.customenable = true;
				}else {
					this.customenable = false;
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


}
