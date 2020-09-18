import {
  Component,
  OnInit,
  Input,
  ViewChild,ElementRef 
} from "@angular/core";

import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, ActivatedRoute } from '@angular/router';
import {Observable, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { ReportService } from "../../services/reports.service";
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import *  as  XLSX from 'xlsx';

@Component({
  selector: "app-dailyreport",
  templateUrl: "./dailyreport.component.html",
  styleUrls: ["./dailyreport.component.scss"]
})
export class DailyReportComponent implements OnInit {

	@ViewChild('monthreportContent', {static:true}) templateRef: ElementRef<any>;
	@ViewChild('customreportContent', {static:true}) templateRef1: ElementRef<any>;
	
	monthlyList:any = {};
	customList:any = {};
	model: any = {};
	montherepnable : boolean;
	customenable: boolean;

	searchText:string;
	showMenu = false;
	filterdiv = false;
	public employeelist: any;
	public employeeData = [ ];
	pagination: number = 0;

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
	
	ngOnInit() {
		this.pagination = 0;
		this.loadEmployee();
		this.filterdiv = false;
		this.monthlyList = '';
		//this.model.reporttype = "monthlyreport";
	}

	backtoreport(){
		this.router.navigate(["reports"]);
	}

	@ViewChild('employeeMonthlyReport', {static:false}) monthlyReport: ElementRef; 	
	@ViewChild('employeeCustomReport', {static:false}) customReport: ElementRef; 	

	getReport(reportContent){
		this.model.employeecode = '';
		this.model.monthname = '';
		this.model.name = '';
		this.model.code = '';
		this.montherepnable = false;
		this.customenable = false;
		this.monthlyList = '';
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
		this.reportService.loadEmployee(this.pagination).subscribe(
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
		this.filterdiv = true;
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
		this.filterdiv = true;
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


	showDialog(){
		if(this.model.reporttype == "monthlyreport"){
			const modalRef = this.modalService.open(this.templateRef, {  windowClass: 'modal-class' });
		}else if(this.model.reporttype == "customreport"){
			const modalRef = this.modalService.open(this.templateRef1, {  windowClass: 'modal-class1' });
		}
	}

	exportAsExcel() {  
		if(this.model.reporttype == "monthlyreport"){

			const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.monthlyReport.nativeElement);
			const wb: XLSX.WorkBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); 
			XLSX.writeFile(wb, this.model.name+' MonthlyReport.xlsx'); 

		}else if(this.model.reporttype == "customreport"){

			const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.customReport.nativeElement);
			const wb: XLSX.WorkBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); 
			XLSX.writeFile(wb, this.model.name+' CustomReport.xlsx'); 
			
		}
		 
	} 


}
