import {
  Component,
  OnInit,
  ViewChild,
  Input,
} from "@angular/core";

import { MatSnackBar } from "@angular/material/snack-bar";
import { CategoryproductService } from '../services/categoryproduct.service';
import { Product } from '../../../../core/common/_models';
import { MatDialog } from "@angular/material";
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PromotionAddComponent } from './../promotionadd/promotionadd.component';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';

@Component({
  selector: "app-promotionlist",
  templateUrl: "./promotionlist.component.html",
  styleUrls: ["./promotionlist.component.scss"]
})
export class PromotionListComponent implements OnInit {
	//@ViewChild(DataBindingDirective,{static:false}) dataBinding: DataBindingDirective;
    //public gridData: any[];
    //public gridView: any[];
    //public mySelection: string[] = [];

	//public freegiftgridData: any[];
    //public freegiftgridView: any[];
    //public freegiftSelection: string[] = [];

	constructor(
		private router: Router,
		private dialog: MatDialog,
		private catprodservice: CategoryproductService,
		private snackBar: MatSnackBar,
		private SpinnerService: NgxSpinnerService,
    	public activeModal: NgbActiveModal,
    	config: NgbModalConfig, private modalService: NgbModal,
	) { 
		config.backdrop = 'static';
    	config.keyboard = false;
	}

	discountList:any = {};
	freegiftList:any = {};
	model:any = {};
	product:Product = new Product();
	public freegiftTable = false;
	public discountTable = false;
	public promotiondiv = false;

	stockList:any = {};
	public stockTable = false;
	promotionArr = [];
  	isCheckedArr = [];
	checkedInfo: any;
	
	isAddPromotion: boolean = false;

	ngOnInit() {
		this.loadDiscount();
		this.SpinnerService.show();  
		this.promotiondiv = true;
		this.discountTable = true;
		this.model.promotionType = "discount";
		setTimeout(() => {
			this.SpinnerService.hide();
		}, 100);
	}

	getAddPromotionStyle() {
		if (!this.isAddPromotion) {
			let myStyles = {
			  color: "gray",
			  background: "#1A2D39",
			  border: "1px solid #1A2D39",
			  display: "none",
			};
			return myStyles;
		}
	}
	

	getpromotionlist(promotionType: string){
		this.promotiondiv = true;
		this.removeItem(this.isCheckedArr, 1, "checked");
		this.removeItem(this.promotionArr, 1, "promotion");
		if(promotionType == "discount"){
			this.loadDiscount();
			this.freegiftTable = false;
			//let discountType = "discount";
		}else if(promotionType == "freegift"){
			this.loadFreegift();
		}else if(promotionType == "all"){
			this.loadAllStock();
		}
	}

	loadFreegift(){
		this.discountTable = false;
		this.stockTable = false;
		let discountType = "freegift";
		this.catprodservice.loadDiscount(discountType)
			.subscribe(
			data => {
				this.freegiftList = data;
				//this.freegiftgridData = this.freegiftList;
				//this.freegiftgridView = this.freegiftgridData;
				if(this.freegiftList.length == 0){
					this.freegiftTable = false;
				}else{
					this.freegiftTable = true;
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

	/* public onFreegiftFilter(inputValue: string): void {
        this.freegiftgridView = process(this.freegiftgridData, {
	        filter: {
                logic: "or",
                filters: [
                    {
                        field: 'categorycode',
    	                operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'productname',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'freegift',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'fromdate_promotionperiod',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'todate_promotionperiod',
                        operator: 'contains',
                        value: inputValue
                    }
                ],
            }
        }).data;

        this.dataBinding.skip = 0;
	} */

	loadDiscount(){
		this.freegiftTable = false;
		this.stockTable = false;
		let discountType = "discount";
		this.catprodservice.loadDiscount(discountType)
			.subscribe(
			data => {
				this.discountList = data;
				//this.gridData = this.discountList;
				//this.gridView = this.gridData;
				if(this.discountList.length == 0){
					this.discountTable = false;
				}else{
					this.discountTable = true;
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

	/* public onDiscountFilter(inputValue: string): void {
        this.gridView = process(this.gridData, {
            filter: {
                logic: "or",
                filters: [
                    {
                        field: 'categorycode',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'productname',
                        operator: 'contains',
                        value: inputValue
                   },
                   {
                        field: 'qty',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'fromdate_promotionperiod',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'todate_promotionperiod',
                        operator: 'contains',
                        value: inputValue
                     }
                ],
            }
        }).data;

        this.dataBinding.skip = 0;
	} */
	
	loadAllStock(){
		this.freegiftTable = false;
		this.discountTable = false;
		let status = "Ready for Sales";
		this.catprodservice.loadStock(status)
			.subscribe(
			data => {
				this.stockList = data;
				if(this.stockList.length == 0){
					this.stockTable = false;
				}else{
					this.stockTable = true;
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

	rowSelected(index: number, item: any, isChecked: boolean) {
		this.checkedInfo = isChecked;
		if (isChecked) {
			item.indexVal = index;
			this.promotionArr.push(item);
			this.isCheckedArr.push({ checked: true, indexVal: index });
		} else {
			this.removeItem(this.isCheckedArr, index, "checked");
			this.removeItem(this.promotionArr, index, "promotion");
		}
	  
	  if (this.promotionArr.length > 1) {
			setTimeout(() => {
			  this.snackBar.open("Select only one CheckBox", "", {
				panelClass: ["warn"],
				verticalPosition: "top",
			  });
			});
			this.isAddPromotion = false;
		}else {
			if (this.promotionArr.length == 1) {
				this.isAddPromotion = true;
			} else {
				this.isAddPromotion = false;
			}
		}
	}

	removeItem(isCheckedArr: any, index: number, type: string) {
		isCheckedArr.forEach((item, indexCheck) => {
		  	if (item.indexVal === index) {
				isCheckedArr.splice(indexCheck, 1);
		  	}
		});
	
		if (type === "checked") {
		  this.isCheckedArr = isCheckedArr;
		} else if (type === "promotion") {
		  this.promotionArr = isCheckedArr;
		}
	}

	addPromotion(title:string,show:string){
		const modalRef = this.modalService.open(PromotionAddComponent, { windowClass: 'promotion-class'});
		let data = {
			title: title, 
			key: show,
			productname: this.promotionArr[0].itemname+'-'+this.promotionArr[0].itemcode,
			categorycode: this.promotionArr[0].category+'-'+this.promotionArr[0].categorycode,
		}
		modalRef.componentInstance.fromParent = data;	
		modalRef.result.then((result) => {

		}, (reason) => {
			this.removeItem(this.isCheckedArr, 1, "checked");
			this.removeItem(this.promotionArr, 1, "promotion");
			this.isAddPromotion = false;
			this.isCheckedArr = [];
		}); 
													  
	}

}
