import {
  Component,
  OnInit,
  ViewChild,
  Input,
} from "@angular/core";

import { MatSnackBar } from "@angular/material/snack-bar";
import { CategoryproductService } from '../services/categoryproduct.service';
import { Category, Product } from '../../../../core/common/_models';
import { PrintDialogService } from "src/app/core/services/print-dialog/print-dialog.service";
import {MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';

@Component({
  selector: "app-promotionlist",
  templateUrl: "./promotionlist.component.html",
  styleUrls: ["./promotionlist.component.scss"]
})
export class PromotionListComponent implements OnInit {
	@ViewChild(DataBindingDirective,{static:false}) dataBinding: DataBindingDirective;
    public gridData: any[];
    public gridView: any[];
    public mySelection: string[] = [];

	public freegiftgridData: any[];
    public freegiftgridView: any[];
    public freegiftSelection: string[] = [];

	constructor(private router: Router,
		private dialog: MatDialog,
		private catprodservice: CategoryproductService,
		private snackBar: MatSnackBar,
		private SpinnerService: NgxSpinnerService,
	) { 
		
	}

	discountList:any = {};
	freegiftList:any = {};
	model:any = {};
	product:Product = new Product();
	public freegiftTable = false;
	public discountTable = false;
	public promotiondiv = false;

	ngOnInit() {
		this.loadDiscount();
		this.SpinnerService.show();  
		this.promotiondiv = true;
		this.discountTable = true;
		setTimeout(() => {
			this.SpinnerService.hide();
		}, 100);
	}

	getpromotionlist(promotionType: string){
		this.promotiondiv = true;
		if(promotionType == "discount"){
			this.loadDiscount();
			//this.freegiftTable = false;
			//let discountType = "discount";
		}else if(promotionType == "freegift"){
			this.loadFreegift();
		}
	}

	loadFreegift(){
		this.discountTable = false;
		let discountType = "freegift";
		this.catprodservice.loadDiscount(discountType)
			.subscribe(
			data => {
				this.freegiftList = data;
				this.freegiftgridData = this.freegiftList;
				this.freegiftgridView = this.freegiftgridData;
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

	public onFreegiftFilter(inputValue: string): void {
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
	}

	loadDiscount(){
		this.freegiftTable = false;
		let discountType = "discount";
		this.catprodservice.loadDiscount(discountType)
			.subscribe(
			data => {
				this.discountList = data;
				this.gridData = this.discountList;
				this.gridView = this.gridData;
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

	public onDiscountFilter(inputValue: string): void {
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
	}
	

}
