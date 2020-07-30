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
  //departmentList:any = {};
  departmentList:any = [];

  public purchase = false;
  public product = false;
  public sales = false;

  passwordtype = "password";
  purchaseArray: Array<any> = [];
  prodArray: Array<any> = [];
  salesArray: Array<any> = [];
  
  menuArray: Array<any> = [];
  userArray: Array<any> = [];

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
    console.log('Purchase SingleSelect  -->'+puritem.purchase_item_text+" ID -->"+puritem.purchase_item_id);
    this.purchaseArray.push(puritem.purchase_item_text);
  }
  onPurSelectAll(puritems: any) {
    this.purchaseArray = [];
    this.purchaseArray.push("Orders","Invoices","Return");
  }

  onDeSelectPurchase(items: any){
    this.purchaseArray = [];
  }

  onProductSelect(proditem: any) {
    console.log('Product SingleSelect  -->'+proditem.product_item_text+" ID -->"+proditem.product_item_id);
    this.prodArray.push(proditem.product_item_text);
  }

  onprodSelectAll(proditems: any) {
    this.prodArray = [];
    this.prodArray.push("product","units","category");
  }

  onDeSelectProduct(items: any){
    this.prodArray = [];
  }

  onSalesSelect(item: any) {
    console.log('Product SingleSelect  -->'+item.sales_item_text+" ID -->"+item.sales_item_id);
    this.salesArray.push(item.sales_item_text);
  }

  onSalesAll(items: any) {
    this.salesArray = [];
    this.salesArray.push("Orders","Invoices","Customer","Return","Promotion");
  }

  onDeSalesAll(items: any){
    this.salesArray = [];
  }

  getPurchase(isPurchaseChecked: boolean){
    console.log("Is Purchase Check Boolean --->"+isPurchaseChecked);
    this.purchaseArray = [];
    if (isPurchaseChecked) {
      this.purchase = true;
    }else{
      this.purchase = false;
    }
  }

  getProduct(isProductChecked: boolean){
    this.prodArray = [];
    if (isProductChecked) {
      this.product = true;
    }else{
      this.product = false;
    }
  }

  getSales(isSalesChecked: boolean){
    this.salesArray = [];
    if (isSalesChecked) {
      this.sales = true;
    }else{
      this.sales = false;
    }
  }

  getMenu1(menu1){
    if(menu1 == true){
      this.model.menuItem1 = 'DashBoard';
    }else if(menu1 == false){
      this.model.menuItem1 = '';
    }
    console.log("Menu1 -- >"+this.model.menuItem1);
  }

  getMenu2(menu2){
    if(menu2 == true){
      this.model.menuItem2 = 'Employee';
    }else if(menu2 == false){
      this.model.menuItem2 = '';
    }
    console.log("Menu2 -- >"+this.model.menuItem2);
  }

  getMenu3(menu3){
    if(menu3 == true){
      this.model.menuItem3 = 'Vendor';
    }else if(menu3 == false){
      this.model.menuItem3 = '';
    }
    console.log("Menu3 -- >"+this.model.menuItem3);
  }

  getMenu7(menu7){
    if(menu7 == true){
      this.model.menuItem7 = 'Stock';
    }else if(menu7 == false){
      this.model.menuItem7 = '';
    }
    console.log("Menu7 -- >"+this.model.menuItem7);
  }

  getMenu8(menu8){
    if(menu8 == true){
      this.model.menuItem8 = 'Finance';
    }else if(menu8 == false){
      this.model.menuItem8 = '';
    }
    console.log("Menu8 -- >"+this.model.menuItem8);
  }

  saveUserMgt(){
    console.log("user Name -->"+this.model.username);
    console.log("Password -->"+this.model.password);
    console.log("Department Name -->"+this.model.departmentname);
    console.log("Menu Name1 -->"+this.model.menuItem1);
    console.log("Menu Name2 -->"+this.model.menuItem2);
    console.log("Menu Name3 -->"+this.model.menuItem3);
    console.log("Menu Name7 -->"+this.model.menuItem7);
    console.log("Menu Name8 -->"+this.model.menuItem8);
    console.log("Menu Name9 -->"+this.model.menuItem9);
    console.log("Purchase Sub Name -->"+this.purchaseArray.length);
    console.log("Product Sub Name -->"+this.prodArray.length);
    console.log("Sales Name -->"+this.salesArray.length);  

    if(this.purchaseArray.length > 0){
      this.model.menuItem4 = 'Purchases';
    }else{
      this.model.menuItem4 = '';
    }
    
    if(this.prodArray.length > 0){
      this.model.menuItem5 = 'Product';
    }else{
      this.model.menuItem5 = '';
    }

    if(this.salesArray.length > 0){
      this.model.menuItem6 = 'Sales';
    }else{
      this.model.menuItem6 = '';
    }

    console.log("Menu Name4 -->"+this.model.menuItem4);
    console.log("Menu Name5 -->"+this.model.menuItem5);
    console.log("Menu Name6 -->"+this.model.menuItem6);

    this.menuArray.push( this.model.menuItem1,this.model.menuItem2,this.model.menuItem3,this.model.menuItem4,
      this.purchaseArray,this.model.menuItem5,this.prodArray,this.model.menuItem6,this.salesArray, 
      this.model.menuItem7,this.model.menuItem8 )
    
    this.userArray.push({ username : this.model.username,password : this.model.password,
      departmentname:this.model.departmentname,menuArray: this.menuArray });
    
    /* this.menuArray.push({ username : this.model.username,password : this.model.password,
      departmentname:this.model.departmentname,menuItem1 : this.model.menuItem1,menuItem2 : this.model.menuItem2,
      menuItem3 : this.model.menuItem3, menuItem4 : this.model.menuItem4,purchasesubmenu : this.purchaseArray,
      menuItem5 : this.model.menuItem5,productsubmenu : this.prodArray, menuItem6 : this.model.menuItem6,
      salessubmenu : this.salesArray, menuItem7 : this.model.menuItem7, menuItem8 : this.model.menuItem8 }); */

    this.userMgtService.save(this.userArray)
    .subscribe(
      (res) => {
        this.modalService.dismissAll();
        setTimeout(() => {
          this.snackBar.open(
            "User was created Successfully",
            "",
            {
              panelClass: ["success"],
              verticalPosition: "top",
            }
          );
        });
    
      });
    this.modalService.dismissAll();
  }
}
