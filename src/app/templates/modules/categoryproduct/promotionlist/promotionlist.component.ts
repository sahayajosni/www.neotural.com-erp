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

@Component({
  selector: "app-promotionlist",
  templateUrl: "./promotionlist.component.html",
  styleUrls: ["./promotionlist.component.scss"]
})
export class PromotionListComponent implements OnInit {
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
		this.SpinnerService.show();  
		this.promotiondiv = false;
		setTimeout(() => {
			this.SpinnerService.hide();
		}, 100);
	}

	getpromotionlist(promotionType: string){
		this.promotiondiv = true;
		if(promotionType == "discount"){
			this.loadDiscount();
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

	loadDiscount(){
		this.freegiftTable = false;
		let discountType = "discount";
		this.catprodservice.loadDiscount(discountType)
			.subscribe(
			data => {
				this.discountList = data;
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


}
