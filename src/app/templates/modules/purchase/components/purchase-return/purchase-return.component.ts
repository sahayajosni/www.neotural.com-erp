import { Component, OnInit, ViewChild ,ElementRef,Inject} from '@angular/core';
import { Purchase } from 'src/app/core/common/_models';
import { AlertService } from 'src/app/core/common/_services';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import { MatExpansionPanel, MatSnackBar, Sort } from "@angular/material";
import { PurchaseService } from '../../services/purchase.service';
import { PurchaseCreateReturnComponent } from '../purchase-create-return/purchase-create-return.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-purchase-return',
  templateUrl: './purchase-return.component.html',
  styleUrls: ['./purchase-return.component.scss']
})
export class PurchaseReturnComponent implements OnInit {

  model: any ={};
  public poreturnList : any;
  dialogConfig = new MatDialogConfig();
  isDtInitialized:boolean = false;
  todayDate : Date = new Date();
  purchasereturnList: any = {};

  public returntable = false;

  fieldArray: Array<any> = [];
  returnarray: Array<any> = [];

  constructor(
    private purchaseService: PurchaseService,
    private dialog: MatDialog,
    private router: Router, 
    private snackBar: MatSnackBar,
    private alertService: AlertService,
    private SpinnerService: NgxSpinnerService,
    config: NgbModalConfig, private modalService: NgbModal,
  ) {  
    config.backdrop = 'static';
    config.keyboard = false;
  }
  ngOnInit() {
    this.SpinnerService.show(); 
    this.returnList();
  }

  returnList(){
    this.purchaseService.loadReturn()
      .subscribe(res => { 
        this.poreturnList = res;
        this.SpinnerService.hide();
        this.purchasereturnList = this.poreturnList;
        if(this.poreturnList.length == 0){
          this.returntable = false;
        }else{
          this.returntable = true;
        }
      },
      error => {
        this.SpinnerService.hide();
        setTimeout(() => {
          this.alertService.error("Network error: server is temporarily unavailable");
        }, 2000);
      }
    );
  }

  onSearchChange(searchValue: string): void {  
    console.log(searchValue);
    this.poreturnList = this.purchasereturnList.filter(poreturn =>
      poreturn.vendorname.toLowerCase().indexOf(searchValue.toLowerCase()) !==-1)
  }

  modifyReturn(id:string,item: any){
    const modalRef = this.modalService.open(PurchaseCreateReturnComponent, { windowClass: 'modal-class'});
    let data: any;
    data = {
      invoicenumber: item.invoicenumber,
      vendorname: item.vendorname,
      vendorcode: item.vendorcode,
      productname: item.itemname,
      pocode: item.pocode,
      date: item.invoiceddate,
      invqty: item.invoicedqty,
      itemStatus: item.itemStatus,
      returnStatus: item.returnStatus,
      qty: item.qty,
      price: item.price,
      paymentstatus: item.paymentstatus,
      id: id
    };

    modalRef.componentInstance.fromParent = data;
    modalRef.result.then((result) => {
      this.ngOnInit();
    }, (reason) => {
      this.ngOnInit();
    }); 
  }

  removeReturn(id:string,invoicenumber:string){
    this.purchaseService.removePoReturn(id,invoicenumber)
      .subscribe(
        data => {
          setTimeout(() => {
            this.snackBar.open("Category Deleted Successfully", "", {
              panelClass: ["success"],
              verticalPosition: 'top'      
            });
          });
          this.returnList();
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

