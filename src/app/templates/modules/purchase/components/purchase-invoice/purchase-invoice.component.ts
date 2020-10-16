import { Component, OnInit, OnDestroy, ViewChild ,ElementRef,Inject} from '@angular/core';
import { MatExpansionPanel, MatSnackBar, Sort } from "@angular/material";
import { PurchaseService } from '../../services/purchase.service';
import { PurchaseCreateReturnComponent } from '../purchase-create-return/purchase-create-return.component';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-purchase-invoice',
  templateUrl: './purchase-invoice.component.html',
  styleUrls: ['./purchase-invoice.component.scss']
})
export class PurchaseInvoiceComponent implements OnInit, OnDestroy {
  
  model:any = {};
  invoiceList: any;
  public invTale = false;
  isCheckedArr = [];
  invArr = [];
  isShowEditDelete = [];
  isAddStock: boolean = false;
  checkedInfo: any;

  poinvoiceList: any = {};

  isDisableReceived: boolean = false;
  isOrderPartial: boolean = false;
  isOrderReturn: boolean = false;

  constructor(
    private purchaseservice: PurchaseService,
    private snackBar: MatSnackBar,
    config: NgbModalConfig, private modalService: NgbModal,
  ) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }
  

  ngOnInit() { 
    this.getInvoiceLists();
    // this.removeScrollBar();
  }

  ngOnDestroy() {
    (<HTMLElement>(
      document.querySelector(".mat-drawer-content")
    )).style.overflow = "auto";
  }
 /* removeScrollBar() {
    setTimeout(function () {
      (<HTMLElement>(
        document.querySelector(".mat-drawer-content")
      )).style.overflow = "inherit";
    }, 300);
  } */
  getInvoiceLists() {
    let invoicenumber = "All";
    this.isAddStock = false;
    this.isDisableReceived = false;
    this.isOrderReturn = false;
    this.isOrderPartial = false;
    this.purchaseservice.load(invoicenumber).subscribe(res => { 
      this.invoiceList = res;
      this.poinvoiceList = this.invoiceList;
      if(this.invoiceList.length == 0 ){
        this.invTale = false;
      }else{
        this.invTale = true;
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

  generatePdf(data: any){
    if (data === null) {
      setTimeout(() => {
        this.snackBar.open("PDF data is empty", "", {
          panelClass: ["error"],
          verticalPosition: 'top'      
        });
      });
    } else {  
      const width = 800;
      const height = 370;
      var left = (screen.width/2)-(width/2);
      var top = (screen.height/2)-(height/2);
      const win = window.open("","", 'toolbar=0, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+width+', height='+height+', top='+top+', left='+left);

      //const win = window.open("","", 'width='+width+', height='+height+', top='+top+', left='+left);
      let html = '';

      html += '<html>';
      html += '<body style="margin:0!important">';
      html += '<embed width="100%" height="100%" src="data:application/pdf;base64,'+data+'" type="application/pdf" />';
      html += '</body>';
      html += '</html>';

      setTimeout(() => {
        win.document.write(html);
      }, 0);
    }
  }

  getaddStockStyle() {
    if (!this.isAddStock) {
      let myStyles = {
        color: "gray",
        background: "#1A2D39",
        border: "1px solid #1A2D39",
        display: "none",
      };
      return myStyles;
    }
  }

  getaddPartialStyle() {
    if (!this.isOrderPartial) {
      let myStyles = {
        color: "gray",
        background: "#1A2D39",
        border: "1px solid #1A2D39",
        display: "none",
      };
      return myStyles;
    }
  }

  getaddReturnStyle() {
    if (!this.isOrderReturn) {
      let myStyles = {
        color: "gray",
        background: "#1A2D39",
        border: "1px solid #1A2D39",
        display: "none",
      };
      return myStyles;
    }
  }

  getReceivedStyle() {
    if (!this.isDisableReceived) {
      let myStyles = {
        color: "gray",
        background: "#1A2D39",
        border: "1px solid #1A2D39",
        display: "none",
      };
      return myStyles;
    }
  }

  rowSelected(index: number, item: any, isChecked: boolean) {
    this.checkedInfo = isChecked;
    if (isChecked) {
      item.indexVal = index;
      this.invArr.push(item);
      this.isCheckedArr.push({ checked: true, indexVal: index });
      this.isShowEditDelete[index] = false;
    } else {
      this.removeItem(this.isCheckedArr, index, "checked");
      this.removeItem(this.invArr, index, "product");
    }

    if (this.invArr.length > 0) {
      this.invArr.forEach((item, index) => {
        const status = item.status;
        if (this.invArr.length > 1) {
          this.isAddStock = false;
          this.isDisableReceived = false;
          this.getErrorMsg(true);
        } else {
          this.getErrorMsg(false);
          if (status === "Pending" && this.isCheckedArr[0].checked) {
            this.isDisableReceived = true;
          } else {
            this.isDisableReceived = false;
          }
          if (status === "Received" && this.isCheckedArr[0].checked) {
            if(item.pophasestatus === "Returned"){
              this.isAddStock = false;
              this.isOrderPartial = false;
              this.isOrderReturn = true;
            }else if(item.pophasestatus == "Partial" || item.pophasestatus == "Completed"){
              this.isAddStock = false;
              this.isOrderPartial = false;
              this.isOrderReturn = false;
            }else{
              this.isAddStock = true;
              this.isOrderPartial = true;
              this.isOrderReturn = true;
            }
            
          } else {
            this.isAddStock = false;
            this.isOrderPartial = false;
            this.isOrderReturn = false;
          } 
        }
      });
    } else {
      this.isDisableReceived = false;
      this.isAddStock = false;
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
    } else if (type === "product") {
      this.invArr = isCheckedArr;
    }
  }

  getErrorMsg(isErrMsg: boolean) {
    if (isErrMsg) {
      setTimeout(() => {
        this.snackBar.open("Select only one Invoice", "", {
          panelClass: ["warn"],
          verticalPosition: "top",
        });
      });
    } else {
      return "";
    }
  }

  getReceived(){
    this.model.invoiceNumber = this.invArr[0].invoicenumber;
    this.purchaseservice.poStatusReceived(this.model.invoiceNumber).subscribe(
      (respose) => {
        this.snackBar.open("Status Received Successfully", "", {
            panelClass: ["success"],
            verticalPosition: "top",
          }
        );
        this.isCheckedArr = [];
        this.invArr = [];
        this.checkedInfo.target.checked = false;
        this.getInvoiceLists();
      },
      (error) => {
        setTimeout(() => {
          this.snackBar.open(
            "Network error: server is temporarily unavailable", "",
            {
              panelClass: ["error"],
              verticalPosition: "top",
            }
          );
        });
      }
    );
  }

  addStock(){
    this.model.invoiceNumber = this.invArr[0].invoicenumber;
    this.purchaseservice.createStock(this.model.invoiceNumber).subscribe(
      (respose) => {
        this.snackBar.open("Stock was added Successfully", "", {
            panelClass: ["success"],
            verticalPosition: "top",
          }
        );
        this.isCheckedArr = [];
        this.invArr = [];
        this.checkedInfo.target.checked = false;
        this.getInvoiceLists();
      },
      (error) => {
        setTimeout(() => {
          this.snackBar.open(
            "Network error: server is temporarily unavailable", "",
            {
              panelClass: ["error"],
              verticalPosition: "top",
            }
          );
        });
      }
    );
  }

  onSearchChange(searchValue: string): void {  
    console.log(searchValue);
    this.invoiceList = this.poinvoiceList.filter(poinvoice =>
      poinvoice.vendorname.toLowerCase().indexOf(searchValue.toLowerCase()) !==-1)
  }

  returnOrder(){
    const modalRef = this.modalService.open(PurchaseCreateReturnComponent, { windowClass: 'modal-class'});
   
    let data: any;
    data = {
      invoicenumber: this.invArr[0].invoicenumber
    };

    modalRef.componentInstance.fromParent = data;
    modalRef.result.then((result) => {
     
    }, (reason) => {
      this.isCheckedArr = [];
      this.invArr = [];
      this.checkedInfo.target.checked = false;
      this.getInvoiceLists();
    }); 
  }

  addPartialOrder(){
    this.model.invoiceNumber = this.invArr[0].invoicenumber;
    this.purchaseservice.addPartialOrder(this.model.invoiceNumber).subscribe(
      (respose) => {
        this.snackBar.open("Partial Order was added Successfully", "", {
            panelClass: ["success"],
            verticalPosition: "top",
          }
        );
        this.isCheckedArr = [];
        this.invArr = [];
        this.checkedInfo.target.checked = false;
        this.getInvoiceLists();
      },
      (error) => {
        setTimeout(() => {
          this.snackBar.open(
            "Network error: server is temporarily unavailable", "",
            {
              panelClass: ["error"],
              verticalPosition: "top",
            }
          );
        });
      }
    );
  }

}
