import {
  Component,
  OnInit,
  Renderer2,
  AfterViewInit,
  Input,
  Inject,
  Optional
} from "@angular/core";
import { formatDate } from "@angular/common";
import { Purchase } from "src/app/core/common/_models";
import { AlertService } from "src/app/core/common/_services";
import { Router } from "@angular/router";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { PurchaseService } from "../../services/purchase.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { VendorService } from "src/app/templates/modules/vendor-and-customer/services/vendor.service";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';

export interface UsersData{
  dialogTitle:string;
  qty:string;
  unit:string;
  categoryname:string; 
  categorycode:string;
  vendorname: string;
  vendorcode:string;
  productname:string;
  productcode:string;
  subtotal:string;
  unitprice:string;
  id:string;
  date :string;
  description:string;
  status:string;
  dialogText: string;
  //noavailableqty: string;
}

@Component({
  selector: "app-purchaseadd",
  templateUrl: "./purchaseadd.component.html",
  styleUrls: ["./purchaseadd.component.scss"],
})
export class PurchaseAddComponent implements OnInit, AfterViewInit {
  purchase: Purchase = new Purchase();
  model: any = {};
  public purchasetable = false;
  headElements = ["#ID", "Product Name", "Category Name", "Quantity"];
  todayDate: Date = new Date();
  dialogConfig = new MatDialogConfig();

  fieldArray: Array<any> = [];
  purchasesearcharray: Array<any> = [];

  productList: any;
  categoryList: any;
  firstField = true;
  vendorList: any;
  //purchaseDate: any;
  currentDate = new Date();
  purchaseDate: any;
  public productchosendiv = false;
  noavailableqty: boolean = false;
  @Input() fromParent: UsersData;

  constructor(
    private dialog: MatDialog,
    //public dialogRef: MatDialogRef<PurchaseAddComponent>,
    private purchaseService: PurchaseService,
    private router: Router,
    private alertService: AlertService,
    private snackBar: MatSnackBar,
    private renderer: Renderer2,
    private vendorservice: VendorService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,    
  ) {
    this.purchaseDate = formatDate(this.currentDate, "dd/MMM/yyy", "en-US");
  }

  ngOnInit() {
    this.model.subtotal = 0;
    this.editPurchaseOrder(this.fromParent);
    this.purchasetable = false;
    //this.getcategoryList();
    this.model.sNo = 0;
    this.model.deliveryCost = 0;
    this.model.subTotal = 0;
    this.model.totalItem = 0;
    /* if (this.model.sNo == 0) {
      this.getProductList();
    } else {
    } */
    this.getVendorLists();
  }
  ngAfterViewInit() {
    (<HTMLElement>(
      document.querySelector(".mat-dialog-container")
    )).style.background = "inherit";
  }
  getcategoryList() {
    this.purchaseService.loadCategory().subscribe(
      (res) => {
        this.categoryList = res;
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

        // setTimeout(() => {
        //   this.alertService.error("Network error: server is temporarily unavailable");
        //  }, 2000);
      }
    );
  }

  getProductList() {
    this.purchaseService.loadItem().subscribe(
      (res) => {
        this.productList = res;
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

  getNetAmount(productName: string, quantity: string, category: string) {
    console.log("productName -->" + productName);
    console.log("quantity -->" + quantity);
    if(this.snackBar.open) {
      this.snackBar.dismiss();
    }
    if(productName == '' || productName == undefined){
      this.productchosendiv = false;
    }else{
      this.productchosendiv = true;
      this.model.zeroquantity = Number.parseInt(quantity);
      if (quantity == "" || quantity == undefined) {
        console.log("--- No Quantity are available ---");
        this.model.netAmount = 0.00;   
        this.purchaseService.getUnitPrice(productName, category).subscribe(
          (data) => {
            this.purchase = data;
            this.model.unitPrice = this.purchase.sellingprice;   
            this.model.unit = this.purchase.unit;  
            
          }
        );
      } if (this.model.zeroquantity == 0){
        setTimeout(() => {
          this.snackBar.open("Quantity must be Valid", "", {
            duration: undefined, 
            panelClass: ["warning"],
            verticalPosition: "top",
            horizontalPosition: 'center'
          });
        });
      } else {
        this.purchaseService.getUnitPrice(productName, category).subscribe(
          (data) => {
            this.purchase = data;
            this.model.unitPrice = this.purchase.sellingprice;
            this.model.unit = this.purchase.unit;  
            this.model.vendorName =
              this.purchase.vendorname + "-" + this.purchase.vendorcode;
            this.model.netAmount = Number.parseInt(quantity) * this.purchase.sellingprice;           
            /* let res = quantity.replace(/\D/g, "");
            this.model.netAmount =
              Number.parseInt(res) * this.purchase.sellingprice; */
            console.log("Price ---->" +this.model.unitPrice +
                " --netAmount -->" +this.model.netAmount);
          },
          (error) => {}
        );
      }
    }
  }

  resetPurchase(form: FormGroup) {
    form.reset();
    this.fieldArray = [];
    /* this.purchasetable = false;
    this.model.vendorName = '';
    this.model.productName = '';
    this.model.deliveryCost = '';   
    this.model.qty = '';
    this.model.unit = '';
    this.model.unitPrice = '';
    this.model.category = ''; */
    this.model.sNo = 0;
    this.model.subTotal = 0.00;
    this.model.netAmount = 0.00;
    this.productchosendiv = false;
  }

  addProduct(sNo: number) {
    this.purchasetable = true;
    let totalAmount = 0.0;
    var item = 0;
    this.fieldArray.push({
      vendorName: this.model.vendorName,
      category: this.model.category,
      productName: this.model.productName,
      unitPrice: this.model.unitPrice,
      quantity: this.model.quantity,
      netAmount: this.model.netAmount,
      description: this.model.description,
    });

    console.log(this.fieldArray);
    this.model.sNo = sNo + 1;
    this.purchase.id = this.model.sNo;
    for (let j = 0; j < this.fieldArray.length; j++) {
      totalAmount += this.fieldArray[j].netAmount;
      this.model.subTotal = totalAmount;
      console.log("Add SubTotal -->" + this.model.subTotal);

      let response = this.fieldArray[j].quantity.replace(/\D/g, "");
      item += Number.parseInt(response);
      this.model.totalItem = item;
      console.log("Add Total Item -->" + this.model.totalItem);
    }

    /* if (this.model.sNo == 0) {
      console.log("--- NO Vendor Choose ---");
    } else {
      this.getVendorProduct(this.model.vendorName);
    } */
    // CLEAR TEXTBOX.
    this.model.category = null;
    this.model.productName = null;
    this.model.quantity = "";
    this.model.netAmount = "";
    this.model.unitPrice = "";
    this.model.description = "";
  }

  getVendorProduct(vendorName: string) {
    console.log("Vendor Name -->" + vendorName);
    this.purchaseService.loadVendorItem(vendorName).subscribe(
      (res) => {
        this.productList = res;
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
  deleteFieldValue(index, qty: string, amt: number) {
    this.fieldArray.splice(index, 1);
    console.log("Size -->" + this.fieldArray.length);
    if (this.fieldArray.length == 0) {
      this.fieldArray = [];
      this.model.vendorName = "";
      this.model.sNo = 0;
      this.model.subTotal = "";
      this.model.totalItem = 0;
      this.getProductList();
    }
    this.model.sNo = this.fieldArray.length;
    let totqty = qty.replace(/\D/g, "");
    this.model.totalItem -= Number.parseInt(totqty);
    this.model.subTotal -= amt;

    if (this.fieldArray[0]) {
      this.purchasetable = true;
    } else {
      this.purchasetable = false;
    }
  }

  savePurchase() {
    this.purchasesearcharray = [];
    console.log(this.fieldArray);
    if (this.fieldArray.length == 0) {
      setTimeout(() => {
        this.snackBar.open(
          "Warning: There is No Item/Product is being selected.",
          "",
          {
            panelClass: ["warning"],
            verticalPosition: "top",
          }
        );
      });
    } else {
      this.purchasesearcharray.push(this.fieldArray);
      console.log("Purchase Array -->");
      console.log(this.purchasesearcharray);
      this.purchase.vendorName = this.model.vendorName;
      this.purchaseService
        .save(this.purchasesearcharray, this.model.deliveryCost)
        .subscribe(
          (res) => {
            this.modalService.dismissAll();
            console.log("............1 ....");
            setTimeout(() => {
              this.snackBar.open(
                "Order created Successfully",
                "",
                {
                  panelClass: ["success"],
                  verticalPosition: "top",
                }
              );
            });

            this.fieldArray = [];
            this.purchasetable = false;
            this.model.vendorName = "";
            this.model.sNo = 0;
            this.model.subTotal = "";
            this.model.totalItem = 0;
            this.model.deliveryCost = "";
            this.getProductList();
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
  }

  getVendorLists() {
    this.vendorservice.load().subscribe(
      (data) => {
        this.vendorList = data;
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

  addPurchaseOrder(data: any) {
    let categoryname = "";
    let categorycode = "";
    let productname = "";
    let productcode = "";
    let vendorname = "";
    let vendorcode = "";
    let qty = "";
    let addPurchaseData: any;

    if (this.model.qty !== null && this.model.price !== null) {
      this.model.subtotal = Number.parseInt(this.model.qty) * this.model.unitPrice;
    }

    if (this.model.category !== undefined) {
      const splitCategory = this.model.category.split("-");
      categoryname = splitCategory[0];
      categorycode = splitCategory[1];
    }

    if (this.model.vendorName !== undefined) {
      const splitVendor = this.model.vendorName.split("-");
      vendorname = splitVendor[0];
      vendorcode = splitVendor[1];
    }

    if (this.model.productName !== undefined) {
      const splitProduct = this.model.productName.split("-");
      productname = splitProduct[0];
      productcode = splitProduct[1];
    }

    addPurchaseData = {
      categoryname: categoryname,
      categorycode: categorycode,
      productname: productname,
      productcode: productcode,
      vendorname: vendorname,
      vendorcode: vendorcode,
      qty: this.model.qty !== null ? this.model.qty : 0,
      subtotal: this.model.subtotal,
      unit: this.model.unit,
      unitprice: this.model.unitPrice,
      date: data.id !== undefined ? data.date : this.purchaseDate,
      description: "",
      status: data.id !== undefined ? data.status : "Open",
      pocode: data.id !== undefined ? data.pocode : data.pocode,
    };

    if (data.id !== undefined) {
      addPurchaseData.id = data.id;
      this.updatePurchaseOrderData(addPurchaseData);
    } else {
      this.addPurchaseOrderData(addPurchaseData);
    }
  }

  onSubTotalCalc(value: any, type: string) {
    if (value !== "NaN" && type === "price" && this.model.qty !== undefined) {
      this.model.subtotal = Number.parseInt(value) * this.model.qty;
      document.getElementById("total").innerHTML = this.model.subtotal;
    } else if (
      value !== "NaN" &&
      type === "qty" &&
      this.model.price !== undefined
    ) {
      this.model.subtotal = value * Number.parseInt(this.model.price);
      document.getElementById("total").innerHTML = this.model.subtotal;
    }
  }

  editPurchaseOrder(data: any) {
    if (data.id !== undefined) {
      this.model.qty = data.qty;
      this.model.unit = data.unit;
      this.model.category = data.categoryname + "-" + data.categorycode;
      this.model.vendorName = data.vendorname + "-" + data.vendorcode;
      this.model.productName = data.productname + "-" + data.productcode;
      this.model.subtotal = data.subtotal;
      this.model.netAmount = data.subtotal;
      this.model.unitPrice = data.subtotal / data.qty;
      this.getVendorProduct(this.model.vendorName);
    }
  }

  addPurchaseOrderData(addPurchaseData: any) {
    this.purchaseService.addPurchaseOrder(addPurchaseData).subscribe(
      (res) => {
        if (res === null) {
          this.modalService.dismissAll();
          setTimeout(() => {
            this.snackBar.open(
              "Order created Successfully",
              "",
              {
                panelClass: ["success"],
                verticalPosition: "top",
              }
            );
          });
          this.getProductList();
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

  updatePurchaseOrderData(addPurchaseData: any) {
    this.purchaseService.updatePurchaseOrder(addPurchaseData).subscribe(
      (res) => {
        if (res === null) {
          setTimeout(() => {
            this.modalService.dismissAll();
            this.snackBar.open(
              "Order updated Successfully",
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
    this.activeModal.close()
  }

}
