import { Component, Inject, OnChanges,Optional, OnInit,Input } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialogRef } from '@angular/material';
import { MatSnackBar } from "@angular/material/snack-bar";
import { PurchaseService } from "../../services/purchase.service";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

export interface UsersData{
  vendorname:string;
  vendorcode:string;
  productname:string;
  invqty:string;
  date:string,
  subtotal:string;
  pocode:string;
  invoicenumber:string;
  itemStatus:string;
  returnStatus:string;
  qty:number;
  id:string;
  price:string;
  paymentstatus:string;
}

@Component({
  selector: 'app-purchase-create-return',
  templateUrl: './purchase-create-return.component.html',
  styleUrls: ['./purchase-create-return.component.scss']
})
export class PurchaseCreateReturnComponent implements OnInit {
  model:any = {};
  btnsave:string;
  headerlabel: string;
  paymentType:string;
  returnType:string;
  quantity:number;
  @Input() fromParent : UsersData;

  constructor(    
    //public dialogRef: MatDialogRef<PurchaseCreateReturnComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data, 
    private purchaseService:PurchaseService,
    private snackBar: MatSnackBar,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) { 
      
    }

  ngOnInit() {
    this.model.vendorname = this.fromParent.vendorname;
    this.model.vendorcode = this.fromParent.vendorcode;
    this.model.productname = this.fromParent.productname;
    this.model.invqty = this.fromParent.invqty;
    this.model.date = this.fromParent.date;
    this.model.subtotal = this.fromParent.subtotal;
    this.model.pocode = this.fromParent.pocode;
    this.btnsave = "Create";
    this.headerlabel = "Create";
    this.editPurchaseReturn(this.fromParent);
  }

  editPurchaseReturn(data: any) {
    if (data.id !== undefined) {
      this.model.vendorname = this.fromParent.vendorname;
      this.model.vendorcode = this.fromParent.vendorcode;
      this.model.productname = this.fromParent.productname;
      this.model.pocode = this.fromParent.pocode;
      this.model.invoicenumber = this.fromParent.invoicenumber;
      this.model.date = this.fromParent.date;
      this.model.invqty = this.fromParent.invqty;
      this.model.itemstatus = this.fromParent.itemStatus;
      this.model.paymentType = this.fromParent.returnStatus;
      this.model.quantity = this.fromParent.qty;
      this.model.id = this.fromParent.id;
      this.model.price = this.fromParent.price;
      this.model.paymentstatus = this.fromParent.paymentstatus;
      this.model.subtotal = this.model.quantity * Number.parseInt(this.model.price);
      this.btnsave = "Update";
      this.headerlabel = "Modify";
      this.model.qtystatus = '';
    }
  }

  getPrice(quantity:number){
    this.model.qtystatus = "";
    if(this.snackBar.open) {
      this.snackBar.dismiss();
    }
    let price = this.model.subtotal/quantity;
    if(this.model.quantity > this.model.invqty){
      this.model.qtystatus = "Above";
      setTimeout(() => {
        this.snackBar.open(
          "Qty cannot be more than Invoiced Qty.",
          "",
          {
            duration: undefined,   
            panelClass: ["warning"],
            verticalPosition: "top",
          }
        );   
      });
    }else if(quantity == 0){
      setTimeout(() => {
        this.snackBar.open(
          "Qty must be valid.",
          "",
          {
            duration: undefined, 
            panelClass: ["warning"],
            verticalPosition: "top",
          }
        );   
      });
    }
    if(price == Infinity){
      this.model.price = 0;
    }else{
      this.model.price = price;
    }
  }

  getPaymentValid(paymentType:string){
    if(paymentType == null){
      document.getElementById("cash").style.background = '#c18484';
      document.getElementById("credit").style.background = '#c18484';
      document.getElementById("voucher").style.background = '#c18484';
    }else{
      document.getElementById("cash").style.background = '#1A2D39';
      document.getElementById("credit").style.background = '#1A2D39';
      document.getElementById("voucher").style.background = '#1A2D39';
    }
  }

  getItemValid(itemstatus:string){
    if(itemstatus == null){
      document.getElementById("damaged").style.background = '#c18484';
      document.getElementById("expired").style.background = '#c18484';
      document.getElementById("others").style.background = '#c18484';
    }else{
      document.getElementById("damaged").style.background = '#1A2D39';
      document.getElementById("expired").style.background = '#1A2D39';
      document.getElementById("others").style.background = '#1A2D39';
    }
  }

  addReturn() {

    if(this.snackBar.open) {
      this.snackBar.dismiss();
    }

    if(this.model.itemstatus == null){
      console.log("ItemStatus not chosen");
      document.getElementById("damaged").style.background = '#c18484';
      document.getElementById("expired").style.background = '#c18484';
      document.getElementById("others").style.background = '#c18484';
    }
    if(this.model.paymentType == null){
      console.log("Payment not chosen");
      document.getElementById("cash").style.background = '#c18484';
      document.getElementById("credit").style.background = '#c18484';
      document.getElementById("voucher").style.background = '#c18484';
    }else if(this.model.quantity > this.model.invqty){
      this.snackBar.open(
        "Qty cannot be more than Invoiced Qty.",
        "",
        {
          duration: undefined, 
          panelClass: ["warning"],
          verticalPosition: "top",
        }
      );
    }else if(this.model.quantity == 0){
      setTimeout(() => {
        this.snackBar.open(
          "Qty must be valid.",
          "",
          {
            duration: undefined, 
            panelClass: ["warning"],
            verticalPosition: "top",
          }
        );   
      });
    }else{

      if(this.model.id == null || this.model.id == ""){
        const invoice = {
          "createddate": new Date().toJSON().slice(0, 10).split('-').reverse().join('/'),
          "invoicedqty": this.model.invqty,
          "vendorcode" : this.model.vendorcode,
          "vendorname" : this.model.vendorname,
          "itemname" : this.model.productname,
          "itemStatus" : this.model.itemstatus,
          "returnStatus" : this.model.paymentType,
          "qty" : this.model.quantity,
          "invoiceddate" : this.model.date,
          "price" : this.model.price,
          "pocode" : this.model.pocode
        }
        this.purchaseService.createReturn(invoice).subscribe(
          (respose) => {
            if (respose === null) {
              this.modalService.dismissAll();
              setTimeout(() => {
                this.snackBar.open(
                  "Purchase Return Created Successfully",
                  "",
                  {
                    panelClass: ["success"],
                    verticalPosition: "top",
                  }
                );
    
              });
            }
          },
          (error) => {
            setTimeout(() => {
              this.snackBar.open(
                "Network error: server is temporarily unavailable",
                "",
                {
                  panelClass: ["error"],
                  verticalPosition: "top",
                }
              );
            });
          }
        );
      }else{
        this.updateReturn();
      }
    }
      
  }

  updateReturn(){
    const invoice = {
      "invoicedqty": this.model.invqty,
      "vendorcode" : this.model.vendorcode,
      "vendorname" : this.model.vendorname,
      "itemname" : this.model.productname,
      "itemStatus" : this.model.itemstatus,
      "returnStatus" : this.model.paymentType,
      "qty" : this.model.quantity,
      "invoiceddate" : this.model.date,
      "price" : this.model.price,
      "pocode" : this.model.pocode,
      "invoicenumber" : this.model.invoicenumber,
      "id" : this.model.id
    }
    this.purchaseService.updateReturn(invoice).subscribe(
      (respose) => {
        if (respose === null) {
          this.modalService.dismissAll();
          setTimeout(() => {
            this.snackBar.open(
              "Purchase Return Updated Successfully",
              "",
              {
                panelClass: ["success"],
                verticalPosition: "top",
              }
            );

          });
        }
      },
      (error) => {
        setTimeout(() => {
          this.snackBar.open(
            "Network error: server is temporarily unavailable",
            "",
            {
              panelClass: ["error"],
              verticalPosition: "top",
            }
          );
        });
      }
    );
  }

  ngOnDestroy(){
    this.snackBar.dismiss();
    (<HTMLElement>document.querySelector('.mat-drawer-content')).style.overflow = 'auto';
  }

  closeModal() {
    this.activeModal.close();
  }

}
