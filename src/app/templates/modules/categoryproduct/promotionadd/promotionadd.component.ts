import { Component, OnInit, Input,Inject,Optional } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from "@angular/material";
import { CategoryproductService } from '../services/categoryproduct.service';
import { Discount } from '../../../../core/common/_models/discount';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export interface UsersData {
  title: string;
  key: string;
  categorycode: string;
  productname:string;
}

@Component({
  selector: 'app-promotionadd',
  templateUrl: './promotionadd.component.html',
  styleUrls: ['./promotionadd.component.scss']
})

export class PromotionAddComponent implements OnInit {
  model: any = {};
  title:string;
  key:string;
  discount:Discount;
  discountShow:boolean;
  freegiftShow:boolean;
  otherShow:boolean;

  local_data:any;
  @Input() fromParent: UsersData;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UsersData,
    private catprodservice: CategoryproductService,
    private snackBar: MatSnackBar,
    private router: Router,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) {

  }

    ngOnInit(){
      this.title = this.fromParent.title;
      this.key = this.fromParent.key;
      this.model.productname = this.fromParent.productname;
      this.model.categorycode = this.fromParent.categorycode;
    }

    savePromotion(){
      console.log("Category Name -->"+this.model.categorycode);
      console.log("Item Name -->"+this.model.productname);
      console.log("discount from date-->"+this.model.fromdate_promotionperiod);
      console.log("discount to date-->"+this.model.todate_promotionperiod);
      console.log("discount type -->"+this.model.discountType);
      console.log("discount qty  -->"+this.model.qty);
      console.log("Free gift  -->"+this.model.freegift);
      console.log("Other item  -->"+this.model.others);

      this.catprodservice.addpromotionsave(this.model)
      .subscribe(
        data => {
          this.discount =  data; 
          this.modalService.dismissAll();
          setTimeout(() => {
            this.snackBar.open("Promotion created Successfully", "", {
              panelClass: ["success"],
              verticalPosition: 'top',
              duration: undefined     
            });
          });
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

    freediscountBox(title:string){
      if(title == "freegift"){
        this.freegiftShow = true;
        this.discountShow = false;
        this.otherShow = false;
      }else if(title == "discount"){
        this.freegiftShow = false;
        this.discountShow = true;
        this.otherShow = false;
      }else if(title == "others"){
        this.freegiftShow = false;
        this.discountShow = false;
        this.otherShow = true;
      }
    }

    closeModal() {
      this.activeModal.close();
  }

}
