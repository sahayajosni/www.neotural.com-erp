import { Router } from '@angular/router';
import { MatSnackBar } from "@angular/material";
import { Component, OnInit, Inject,Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { UserManagementService } from "../../services/usermanagement.service";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-addusermgt',
  templateUrl: './addusermgt.component.html',
  styleUrls: ['./addusermgt.component.scss']
})
export class AddUserMgtComponent implements OnInit {
  disabled = false;
  showFilter = false;
  limitSelection = false;
  purdropdownList:any = {};
  proddropdownList:any = [];
  saledropdownList:any = [];
  selectedItems:any = [];
  purchasedropdownSettings:any = {};
  productdropdownSettings:any = {};
  salesdropdownSettings:any = {};
  model: any = {};
  departmentList:any = {};

  public purchase = false;
  public product = false;
  public sales = false;

  passwordtype = "password";
  purchaseArray: Array<any> = [];
  prodArray: Array<any> = [];
  salesArray: Array<any> = [];
  
  constructor(
    private router: Router,
    //public dialogRef: MatDialogRef<AddUserMgtComponent>,
    private snackBar: MatSnackBar,
    private userMgtService: UserManagementService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) { 
    
  }

  ngOnInit() {
    this.model.password = "";
    this.userMgtService.loadDepartment().subscribe(
      data => { 
        this.departmentList = data;
      },
      error => { }
    );

    this.purdropdownList = [
      { purchase_item_id: 1, purchase_item_text: 'Orders' },
      { purchase_item_id: 2, purchase_item_text: 'Invoices' },
      { purchase_item_id: 3, purchase_item_text: 'Return' }
    ];

    this.proddropdownList = [
      { product_item_id: 1, product_item_text: 'product' },
      { product_item_id: 2, product_item_text: 'units' },
      { product_item_id: 3, product_item_text: 'category' }
    ];

    this.saledropdownList = [
      { sales_item_id: 1, sales_item_text: 'Orders' },
      { sales_item_id: 2, sales_item_text: 'Invoices' },
      { sales_item_id: 3, sales_item_text: 'Customer' },
      { sales_item_id: 4, sales_item_text: 'Return' },
      { sales_item_id: 5, sales_item_text: 'Promotion' }

    ];

    this.purchasedropdownSettings = {
      singleSelection: false,
      idField: 'purchase_item_id',
      textField: 'purchase_item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: this.showFilter,
      closeDropDownOnSelection: true,
    };

    this.productdropdownSettings = {
      singleSelection: false,
      idField: 'product_item_id',
      textField: 'product_item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: this.showFilter,
      closeDropDownOnSelection: true,
    };

    this.salesdropdownSettings = {
      singleSelection: false,
      idField: 'sales_item_id',
      textField: 'sales_item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: this.showFilter,
      closeDropDownOnSelection: true,
    };
  }

  onPurchaseSelect(puritem: any) {
    console.log('Purchase onItemSelect'+puritem);
    this.purchaseArray.push({
      pursubmenu : puritem
    });
  }
  onPurSelectAll(puritems: any) {
    console.log('purchase onSelectAll'+puritems);
    //this.members.push({ item_id: member, item_text: member });

    this.purchaseArray.push({
      pursubmenu : puritems
    });
  }

  onProductSelect(proditem: any) {
    console.log('Product onItemSelect'+proditem);
    this.prodArray.push({
      productsubmenu : proditem
    });
  }

  onprodSelectAll(proditems: any) {
    console.log('product onSelectAll'+proditems);
    this.prodArray.push({
      productsubmenu : proditems
    });
  }

  onSalesSelect(item: any) {
    console.log('Sales onItemSelect'+item);
    this.salesArray.push({
      productsubmenu : item
    });
  }

  onSalesAll(items: any) {
    console.log('Sales onSelectAll'+items);
    this.salesArray.push({
      productsubmenu : items
    });
  }

  getPurchase(isPurchaseChecked: boolean){
    console.log("Is Purchase Check Boolean --->"+isPurchaseChecked);
    if (isPurchaseChecked) {
      this.purchase = true;
    }else{
      this.purchase = false;
    }
  }

  getProduct(isProductChecked: boolean){
    if (isProductChecked) {
      this.product = true;
    }else{
      this.product = false;
    }
  }

  getSales(isSalesChecked: boolean){
    if (isSalesChecked) {
      this.sales = true;
    }else{
      this.sales = false;
    }
  }

  saveUserMgt(){
    console.log("user Name -->"+this.model.username);
    console.log("Password -->"+this.model.password);
    console.log("Department Name -->"+this.model.departmentname);
    console.log("Menu Name1 -->"+this.model.menuItem1);
    console.log("Menu Name2 -->"+this.model.menuItem2);
    console.log("Menu Name3 -->"+this.model.menuItem3);
    console.log("Menu Name4 -->"+this.model.menuItem4);
    console.log("Menu Name5 -->"+this.model.menuItem5);
    console.log("Menu Name6 -->"+this.model.menuItem6);
    console.log("Menu Name7 -->"+this.model.menuItem7);
    console.log("Menu Name8 -->"+this.model.menuItem8);
    console.log("Menu Name9 -->"+this.model.menuItem9);
    console.log("Purchase Sub Name -->"+this.purchaseArray);
    console.log("Product Sub Name -->"+this.prodArray);
    console.log("Sales Name -->"+this.salesArray);

    setTimeout(() => {
      this.snackBar.open(
        "User Login was created Successfully",
        "",
        {
          panelClass: ["success"],
          verticalPosition: "top",
        }
      );
    });

    this.modalService.dismissAll();
  }
}
