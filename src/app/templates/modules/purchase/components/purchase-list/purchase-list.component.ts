import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { PurchaseService } from "../../services/purchase.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  MatDialog,
  MatDialogConfig,
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from "@angular/material";
import { PurchaseAddComponent } from "../purchaseadd/purchaseadd.component";
import { PurchaseCreateInvoiceComponent } from "./../purchase-create-invoice/purchase-create-invoice.component";
import { PurchaseCreateReturnComponent } from '../purchase-create-return/purchase-create-return.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-purchaselist",
  templateUrl: "./purchase-list.component.html",
  styleUrls: [
    "./purchase-list.component.scss"
  ],
  // providers: [NgbModalConfig, NgbModal]
})
export class PurchaseListComponent implements OnInit, OnDestroy {
  purchaseOrderList: any;
  dialogConfig = new MatDialogConfig();
  prodArr = [];
  isCheckedArr = [];
  vendorArr = [];
  //isCreateReturn: boolean = false;
  isDeleteButton: boolean = false;
  isCreateInvoice: boolean = false;
  isShowEditDelete = [];
  isAddPurchaseOrder: boolean = false;
  isVendorErrMsg: boolean = false;
  isSortStatusDesc: boolean = false;
  isSortStatusAsc: boolean = true;
  isSortDateDesc: boolean = false;
  isSortDateAsc: boolean = true;
  title: string = "";
  button: string = "";
  checkedInfo: any;

  public purchaseTable = false;
  poreturnList: any = {};
  purchaseList: any = {};

  purchaseInvoiceList: any = {};
  purchaseReturnList: any = {};
  model: any = {};
  pageNumber: number = 0;
  pageSize: number = 10
  constructor(
    private purchaseService: PurchaseService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    config: NgbModalConfig, private modalService: NgbModal,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.SpinnerService.show();  
    this.isCheckedArr = [];
    this.getPurchaseOrderLists();
    setTimeout(() => {
        this.SpinnerService.hide();
    }, 100);

    // this.SpinnerService.show();  
    // this.getPurchaseOrderLists();
    // this.SpinnerService.hide();
  }

  ngOnDestroy() {
    (<HTMLElement>(
      document.querySelector(".mat-drawer-content")
    )).style.overflow = "auto";
  }
/*
  removeScrollBar() {
    setTimeout(function () {
      (<HTMLElement>(
        document.querySelector(".mat-drawer-content")
      )).style.overflow = "inherit";
    }, 300);
  } */
  getDeleteButtonStyle() {
    if (!this.isDeleteButton) {
      let myStyles = {
        color: "gray",
        background: "#1A2D39",
        border: "1px solid #1A2D39",
        display: "none",
      };
      return myStyles;
    }
  }

  /* getCreateReturnStyle() {
    if (!this.isCreateReturn) {
      let myStyles = {
        color: "gray",
        background: "#1A2D39",
        border: "1px solid #1A2D39",
        display: "none",
      };
      return myStyles;
    }
  } */

  getCreateInvoiceStyle() {
    if (!this.isCreateInvoice) {
      let myStyles = {
        color: "gray",
        background: "#1A2D39",
        border: "1px solid #1A2D39",
        display: "none",
      };
      return myStyles;
    }
  }

  getAddPurchaseOrderStyle() {
    if (this.isAddPurchaseOrder) {
      let myStyles = {
        color: "gray",
        background: "#1A2D39",
        border: "1px solid #1A2D39",
        display: "none",
      };
      return myStyles;
    }
  }


  getPurchaseOrderLists() {
    console.log("pageNumber-->"+this.pageNumber);
    console.log("pageSize-->"+this.pageSize);
    this.purchaseService.getPurchaseOrderLists(this.pageNumber, this.pageSize).subscribe(
      (res: []) => {
        this.purchaseOrderList = res;
        this.purchaseList = this.purchaseOrderList;
        if(this.purchaseOrderList.length == 0){
          this.purchaseTable = false;
        }else{
          this.purchaseTable = true;
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

  rowSelected(index: number, item: any, isChecked: boolean) {
    this.checkedInfo = isChecked;
    if (isChecked) {
      item.indexVal = index;
      this.prodArr.push(item);
      this.isCheckedArr.push({ checked: true, indexVal: index });
      this.vendorArr.push({ vendorName: item.vendorname, indexVal: index });
      this.isShowEditDelete[index] = false;
    } else {
      this.removeItem(this.isCheckedArr, index, "checked");
      this.removeItem(this.prodArr, index, "product");
      this.removeItem(this.vendorArr, index, "vendor");
    }

    if (this.prodArr.length > 0) {
      this.isAddPurchaseOrder = true;
      this.prodArr.forEach((item, index) => {
        const status = item.status;
        const vendorName = item.vendorname;
        if (this.prodArr.length > 1) {
          //this.isCreateReturn = false;
          if (status !== "Placed" && status !== "Returned") {
            let getVendorName = "";
            this.vendorArr.forEach((item, indexCheck) => {
              if (indexCheck > 0) {
                getVendorName = this.vendorArr[indexCheck - 1].vendorName;
                if (vendorName !== getVendorName) {
                  this.isCreateInvoice = false;
                  this.isDeleteButton = false;
                  this.getErrorMsg(true);
                } else {
                  this.isDeleteButton = true;
                  this.isCreateInvoice = true;
                  //this.isCreateReturn = false;
                  this.getErrorMsg(false);
                }
              }
            });
          }else if (status !== "Returned" && status !== "Open") {
            setTimeout(() => {
              this.snackBar.open("You need to select only one Invoice", "", {
                panelClass: ["warn"],
                verticalPosition: "top",
              });
            });
          } else {
            this.isDeleteButton = false;
            this.isCreateInvoice = false;
          }
        } else {
          this.isDeleteButton = false;
          this.getErrorMsg(false);
          if (status === "Open" && this.isCheckedArr[0].checked) {
            this.isCreateInvoice = true;
          } else {
            this.isCreateInvoice = false;
          }
          /* if (status === "Placed" && this.isCheckedArr[0].checked) {
            let pocode = "All";
            this.purchaseService.loadReturn(pocode)
              .subscribe(res => { 
                this.poreturnList = res;
                if(this.poreturnList.length == 0){
                  this.isCreateReturn = true;
                }else{
                  for(let i=0; i<this.poreturnList.length; i++){
                    if(this.poreturnList[i].pocode == this.prodArr[0].pocode ){
                      this.isCreateReturn = false;
                      this.isAddPurchaseOrder = true;
                      setTimeout(() => {
                        this.snackBar.open("Purchase was Returned already.", "", {
                          panelClass: ["warn"],
                          verticalPosition: "top",
                          duration: undefined
                        });
                      });
                      break;  
                    }else{
                      this.isCreateReturn = true;
                    }
                  }
                }
                                
              },
              error => { }
            );
          } else {
            this.isCreateReturn = false;
          } */
        }
      });
    } else {
      this.isCreateInvoice = false;
      //this.isCreateReturn = false;
      this.isDeleteButton = false;
      this.isAddPurchaseOrder = false;
    }
  }
 
  addPurchaseOrder(id: string, item: any) {

    const modalRef = this.modalService.open(PurchaseAddComponent, { windowClass: 'modal-class'});
    let data: any;
    if (id !== null) {
      this.title = "Edit Place Order";
      this.button = "Update";
      item.dialogTitle = this.title;
      item.dialogText = this.button;
      item.selected = false;
      item.selected = true;
      data = item;
    } else {
      this.title = "Place Order";
      this.button = "Add";
      data = { dialogTitle: this.title, dialogText: this.button };
    }

    modalRef.componentInstance.fromParent = data;
    modalRef.result.then((result) => {
      console.log("Close Icon Click");
      //this.getPurchaseOrderLists();
    }, (reason) => {
      console.log("Reload When add Purchase");
      this.getPurchaseOrderLists();
    }); 

    /* this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.position = {
      top: "1000",
      left: "100",
    };
    let dialogRef = this.dialog
      .open(PurchaseAddComponent, {
        panelClass: "addpromotion",
        width:'200vh',
        //height:'400vh',
        data: data,
        disableClose: true,
      //  hasBackdrop: true
      })
      dialogRef.backdropClick().subscribe(result => {
        console.log('backdropClick');
        this.ngOnInit();
      });                
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.ngOnInit();
      }); */
      this.checkedInfo.target.checked = false;
      this.isAddPurchaseOrder = true;
  }

  getErrorMsg(isErrMsg: boolean) {
    // console.log('isErrMsg', isErrMsg)
    if (isErrMsg) {
      setTimeout(() => {
        this.snackBar.open("Select only one vendor", "", {
          panelClass: ["warn"],
          verticalPosition: "top",
        });
      });
    } else {
      return "";
    }
  }

  removeItem(isCheckedArr: any, index: number, type: string) {
    // console.log('isCheckedArr', isCheckedArr)
    // console.log('index12', index)
    isCheckedArr.forEach((item, indexCheck) => {
      // console.log('indexVal', item.indexVal)
      // console.log('index', index)
      if (item.indexVal === index) {
        isCheckedArr.splice(indexCheck, 1);
      }
    });

    if (type === "checked") {
      this.isCheckedArr = isCheckedArr;
    } else if (type === "product") {
      this.prodArr = isCheckedArr;
    } else {
      this.vendorArr = isCheckedArr;
    }
  }

  sortByOrder(column: string, order: string) {
    if (column === "status" && order === "desc") {
      this.isSortStatusDesc = true;
      this.isSortStatusAsc = false;
      this.purchaseOrderList.sort((a, b) => b.status.localeCompare(a.status));
    } else if (column === "status" && order === "asc") {
      this.isSortStatusDesc = false;
      this.isSortStatusAsc = true;
      this.purchaseOrderList.sort((a, b) => a.status.localeCompare(b.status));
    } else if (column === "date" && order === "desc") {
      this.isSortDateDesc = true;
      this.isSortDateAsc = false;
      this.purchaseOrderList.sort((a, b) => b.date.localeCompare(a.date));
    } else {
      this.isSortDateDesc = false;
      this.isSortDateAsc = true;
      this.purchaseOrderList.sort((a, b) => a.date.localeCompare(b.date));
    }
  }

  removePurchaseOrder(id: string) {
    
    this.purchaseService.removePurchaseOrder(id).subscribe((data: any) => {
      if (data === null) {
        setTimeout(() => {
          this.snackBar.open(
            "Order has been deleted successfully",
            "",
            {
              panelClass: ["success"],
              verticalPosition: "top",
            }
          );
        });
        this.getPurchaseOrderLists();
      } else if (data === 500) {
        setTimeout(() => {
          this.snackBar.open("Internal server error", "", {
            panelClass: ["error"],
            verticalPosition: "top",
          });
        });
      } else {
        setTimeout(() => {
          this.snackBar.open("Bad request data", "", {
            panelClass: ["error"],
            verticalPosition: "top",
          });
        });
      }
    });
  }

  createInvoice() {
    let data: any;
    data = {
      dialogPaneTitle: "Pending for Purchase",
      dialogInvoiceTitle: "Purchase Order",
      dialogText: "Create",
      invoiceItems: this.prodArr,
      venderName: this.prodArr[0].vendorname,
      date: new Date()
    };

    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.position = {
      top: "1000",
      left: "100",
    };

    let dialogRef = this.dialog.open(PurchaseCreateInvoiceComponent, {
      panelClass: "purchaseCreateInvoice",
      data: data,
    })
    dialogRef.backdropClick().subscribe(result => {
      console.log('backdropClick');
      this.ngOnInit();
      let indexx = this.prodArr.indexOf(this.prodArr[0].pocode);
      this.prodArr.splice(indexx, 1);
      this.isCreateInvoice = false;
      this.isDeleteButton = false;
      this.isAddPurchaseOrder = true; 
    }); 
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
      let indexx = this.prodArr.indexOf(this.prodArr[0].pocode);
      this.prodArr.splice(indexx, 1);
      this.isCreateInvoice = false;
      this.isDeleteButton = false;
      this.isAddPurchaseOrder = true; 
    });
    this.checkedInfo.target.checked = false;
    this.isAddPurchaseOrder = true;
  }

  createReturn() {
    console.log("createReturn");
    const modalRef = this.modalService.open(PurchaseCreateReturnComponent, { windowClass: 'modal-class'});
   
    let data: any;
    data = {
      vendorname: this.prodArr[0].vendorname,
      vendorcode: this.prodArr[0].vendorcode,
      productname: this.prodArr[0].productname,
      invqty: this.prodArr[0].qty,
      date: this.prodArr[0].date,
      subtotal: this.prodArr[0].subtotal,
      pocode: this.prodArr[0].pocode
    };

    modalRef.componentInstance.fromParent = data;
    modalRef.result.then((result) => {
      /* this.ngOnInit();
      let indexx = this.prodArr.indexOf(this.prodArr[0].pocode);
      this.prodArr.splice(indexx, 1);
      this.isCreateReturn = false;
      this.isAddPurchaseOrder = true; 
      this.isCheckedArr = []; */
    }, (reason) => {
      this.ngOnInit();
      let indexx = this.prodArr.indexOf(this.prodArr[0].pocode);
      this.prodArr.splice(indexx, 1);
      //this.isCreateReturn = false;
      this.isAddPurchaseOrder = true; 
    }); 
    /* this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.position = {
    };

    let dialogRef = this.dialog.open(PurchaseCreateReturnComponent, {
      panelClass: "purchaseCreateReturn",
      width:'120vh',
      //height:'200vh',
      //disableClose: true,
      //hasBackdrop: true
      data: data,
    })
    dialogRef.backdropClick().subscribe(result => {
      console.log('backdropClick');
      this.ngOnInit();
    }); 
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
      let indexx = this.prodArr.indexOf(this.prodArr[0].pocode);
      this.prodArr.splice(indexx, 1);
      this.isCreateReturn = false;
      this.isAddPurchaseOrder = true; 
     }); */
     this.checkedInfo.target.checked = false;
     this.isAddPurchaseOrder = true;
  }

  onSearchChange(searchValue: string): void {  
    this.purchaseOrderList = this.purchaseList.filter(purchase =>
    purchase.vendorname.toLowerCase().indexOf(searchValue.toLowerCase()) !==-1)
  }

  purchaseflow(detailContent,item: any){
    this.model.type = '';
    this.model.rettype = '';
    this.model.invoicedate = '';
    this.model.returndate = '';
    this.model.orderdate = '';

    this.model.status = item.status;
    this.model.orderdate = item.date;

    if(item.status == "Placed"){

      this.purchaseService.load(item.invoicenumber).subscribe(
        (res) => {
          this.purchaseInvoiceList = res;
          if(this.purchaseInvoiceList.length > 0){
            for(let i=0; i<this.purchaseInvoiceList.length; i++){
              if(item.invoicenumber === this.purchaseInvoiceList[i].invoicenumber){
                this.model.invoicedate = this.purchaseInvoiceList[i].invoicedate;
                this.model.type = "Invoice";
              }
            }
          }
        },
        (error) => {  });

    }
    
    if(item.status == "Returned"){

      this.purchaseService.load(item.invoicenumber).subscribe(
        (res) => {
          this.purchaseInvoiceList = res;
          if(this.purchaseInvoiceList.length > 0){
            for(let i=0; i<this.purchaseInvoiceList.length; i++){
              if(item.invoicenumber === this.purchaseInvoiceList[i].invoicenumber){
                this.model.invoicedate = this.purchaseInvoiceList[i].invoicedate;
                this.model.type = "Invoice";
              }
            }
          }
        },
        (error) => {  });

      this.purchaseService.loadReturn(item.pocode).subscribe(
        (res) => {
          this.purchaseReturnList = res;
          if(this.purchaseReturnList.length > 0){
            for(let i=0; i<this.purchaseReturnList.length; i++){
              if(item.pocode == this.purchaseReturnList[i].pocode){
                this.model.returndate = this.purchaseReturnList[i].createddate;
                this.model.rettype = "Return";
              }
            }
          }
        },
        (error) => {  });

    }
    
    this.modalService.open(detailContent, { windowClass: 'modal-class'});

  }

}
