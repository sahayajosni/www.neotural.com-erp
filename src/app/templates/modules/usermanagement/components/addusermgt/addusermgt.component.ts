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
  public validationMsg = false;
  pagination: number = 0;  

  userArray: Array<any> = [];

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private userMgtService: UserManagementService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) { 
    
  }

  ngOnInit() {
    this.model.password = "";
    this.pagination = 0;
    this.validationMsg = false;
    this.userMgtService.loadDepartment(this.pagination).subscribe(
      data => { 
        this.departmentList = data;
      },
      error => { }
    );

    this.purdropdownList = [
      { purchase_item_id: 'SUBMEN10001', purchase_item_text: 'Orders' },
      { purchase_item_id: 'SUBMEN10002', purchase_item_text: 'Invoices' },
      { purchase_item_id: 'SUBMEN10003', purchase_item_text: 'Return' }
    ];

    this.proddropdownList = [
      { product_item_id: 'SUBMEN10004', product_item_text: 'product' },
      { product_item_id: 'SUBMEN10005', product_item_text: 'units' },
      { product_item_id: 'SUBMEN10006', product_item_text: 'category' }
    ];

    this.saledropdownList = [
      { sales_item_id: 'SUBMEN10007', sales_item_text: 'Orders' },
      { sales_item_id: 'SUBMEN10008', sales_item_text: 'Invoices' },
      { sales_item_id: 'SUBMEN10009', sales_item_text: 'Customer' },
      { sales_item_id: 'SUBMEN10010', sales_item_text: 'Return' },
      { sales_item_id: 'SUBMEN10011', sales_item_text: 'Promotion' }

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

    this.model.menuItem1 = 'MEN0';
    this.model.menuItem2 = 'MEN0';
    this.model.menuItem3 = 'MEN0';
    this.model.menuItem7 = 'MEN0';
    this.model.menuItem8 = 'MEN0';

    this.model.purchasesubmenu1 = 'SUBMEN0';
    this.model.purchasesubmenu2 = 'SUBMEN0';
    this.model.purchasesubmenu3 = 'SUBMEN0';
    this.model.productsubmenu1 = 'SUBMEN0';
    this.model.productsubmenu2 = 'SUBMEN0';
    this.model.productsubmenu3 = 'SUBMEN0';
    this.model.salessubmenu1 = 'SUBMEN0';
    this.model.salessubmenu2 = 'SUBMEN0';
    this.model.salessubmenu3 = 'SUBMEN0';
    this.model.salessubmenu4 = 'SUBMEN0';
    this.model.salessubmenu5 = 'SUBMEN0';
  }

  onPurchaseSelect(puritem: any) {
    console.log('Purchase SingleSelect  -->'+puritem.purchase_item_text+" ID -->"+puritem.purchase_item_id);
    this.validationMsg = false;
    if(puritem.purchase_item_id == 'SUBMEN10001'){
      this.model.purchasesubmenu1 = 'SUBMEN10001';
    }else if(puritem.purchase_item_id == 'SUBMEN10002'){
      this.model.purchasesubmenu2 = 'SUBMEN10002';
    }else if(puritem.purchase_item_id == 'SUBMEN10003'){
      this.model.purchasesubmenu3 = 'SUBMEN10003';
    }
  }
  onPurSelectAll(puritems: any) {
    this.model.purchasesubmenu1 = 'SUBMEN10001';
    this.model.purchasesubmenu2 = 'SUBMEN10002';
    this.model.purchasesubmenu3 = 'SUBMEN10003';
  }

  onDeSelectAllPurchase(items: any){
    this.model.purchasesubmenu1 = 'SUBMEN0';
    this.model.purchasesubmenu2 = 'SUBMEN0';
    this.model.purchasesubmenu3 = 'SUBMEN0';
  }

  onDeSelectPurchase(puritem: any) {
    console.log('Purchase Single DeSelect  -->'+puritem.purchase_item_id);
    this.model.number = puritem.purchase_item_id;
    if(this.model.number == 'SUBMEN10001'){
      this.model.purchasesubmenu1 = 'SUBMEN0';
    }else if(this.model.number == 'SUBMEN10002'){
      this.model.purchasesubmenu2 = 'SUBMEN0';
    }else if(this.model.number == 'SUBMEN10003'){
      this.model.purchasesubmenu3 = 'SUBMEN0';
    }
  }

  onProductSelect(proditem: any) {
    this.validationMsg = false;
    console.log('Product SingleSelect  -->'+proditem.product_item_text+" ID -->"+proditem.product_item_id);
    if(proditem.product_item_id == 'SUBMEN10004'){
      this.model.productsubmenu1 = 'SUBMEN10004';
    }else if(proditem.product_item_id == 'SUBMEN10005'){
      this.model.productsubmenu2 = 'SUBMEN10005';
    }else if(proditem.product_item_id == 'SUBMEN10006'){
      this.model.productsubmenu3 = 'SUBMEN10006';
    }
  }

  onprodSelectAll(proditems: any) {
    this.model.productsubmenu1 = 'SUBMEN10004';
    this.model.productsubmenu2 = 'SUBMEN10005';
    this.model.productsubmenu3 = 'SUBMEN10006';
  }

  onDeSelectAllProduct(items: any){
    this.model.productsubmenu1 = 'SUBMEN0';
    this.model.productsubmenu2 = 'SUBMEN0';
    this.model.productsubmenu3 = 'SUBMEN0';
  }

  onDeSelectProduct(proditem: any) {
    console.log('Product Single DeSelect  -->'+proditem.product_item_id);
    this.model.number = proditem.product_item_id;
    if(this.model.number == 'SUBMEN10004'){
      this.model.productsubmenu1 = 'SUBMEN0';
    }else if(this.model.number == 'SUBMEN10005'){
      this.model.productsubmenu2 = 'SUBMEN0';
    }else if(this.model.number == 'SUBMEN10006'){
      this.model.productsubmenu3 = 'SUBMEN0';
    }
  }

  onSalesSelect(item: any) {
    this.validationMsg = false;
    console.log('Sales SingleSelect  -->'+item.sales_item_id);
    if(item.sales_item_id == 'SUBMEN10007'){
      this.model.salessubmenu1 = 'SUBMEN10007';
    }else if(item.sales_item_id == 'SUBMEN10008'){
      this.model.salessubmenu2 = 'SUBMEN10008';
    }else if(item.sales_item_id == 'SUBMEN10009'){
      this.model.salessubmenu3 = 'SUBMEN10009';
    }else if(item.sales_item_id == 'SUBMEN10010'){
      this.model.salessubmenu4 = 'SUBMEN10010';
    }else  if(item.sales_item_id == 'SUBMEN10011'){
      this.model.salessubmenu5 = 'SUBMEN10011';
    }
  }

  onSalesAll(items: any) {
    this.model.salessubmenu1 = 'SUBMEN10007';
    this.model.salessubmenu2 = 'SUBMEN10008';
    this.model.salessubmenu3 = 'SUBMEN10009';
    this.model.salessubmenu4 = 'SUBMEN10010';
    this.model.salessubmenu5 = 'SUBMEN10011';
  }

  onDeSalesAll(items: any){
    this.model.salessubmenu1 = 'SUBMEN0';
    this.model.salessubmenu2 = 'SUBMEN0';
    this.model.salessubmenu3 = 'SUBMEN0';
    this.model.salessubmenu4 = 'SUBMEN0';
    this.model.salessubmenu5 = 'SUBMEN0';
  }

  onSalesDeSelect(item: any) {
    console.log('Sales Single DeSelect  -->'+item.sales_item_id);
    this.model.number = item.sales_item_id;
    if(this.model.number == 'SUBMEN10007'){
      this.model.salessubmenu1 = 'SUBMEN0';
    }else if(this.model.number == 'SUBMEN10008'){
      this.model.salessubmenu2 = 'SUBMEN0';
    }else if(this.model.number == 'SUBMEN10009'){
      this.model.salessubmenu3 = 'SUBMEN0';
    }else if(this.model.number == 'SUBMEN10010'){
      this.model.salessubmenu4 = 'SUBMEN0';
    }else if(this.model.number == 'SUBMEN10011'){
      this.model.salessubmenu5 = 'SUBMEN0';
    }
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

  getMenu1(menu1){
    this.validationMsg = false;
    if(menu1 == true){
      this.model.menuItem1 = 'MEN10000';
    }else if(menu1 == false){
      this.model.menuItem1 = 'MEN0';
    }
    console.log("Menu1 -- >"+this.model.menuItem1);
  }

  getMenu2(menu2){
    this.validationMsg = false;
    if(menu2 == true){
      this.model.menuItem2 = 'MEN10001';
    }else if(menu2 == false){
      this.model.menuItem2 = 'MEN0';
    }
    console.log("Menu2 -- >"+this.model.menuItem2);
  }

  getMenu3(menu3){
    this.validationMsg = false;
    if(menu3 == true){
      this.model.menuItem3 = 'MEN10002';
    }else if(menu3 == false){
      this.model.menuItem3 = 'MEN0';
    }
    console.log("Menu3 -- >"+this.model.menuItem3);
  }

  getMenu7(menu7){
    this.validationMsg = false;
    if(menu7 == true){
      this.model.menuItem7 = 'MEN10006';
    }else if(menu7 == false){
      this.model.menuItem7 = 'MEN0';
    }
    console.log("Menu7 -- >"+this.model.menuItem7);
  }

  getMenu8(menu8){
    this.validationMsg = false;
    if(menu8 == true){
      this.model.menuItem8 = 'MEN10007';
    }else if(menu8 == false){
      this.model.menuItem8 = 'MEN0';
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

    if(this.model.purchasesubmenu1 == 'SUBMEN10001' || this.model.purchasesubmenu2 == 'SUBMEN10002' ||
      this.model.purchasesubmenu3 == 'SUBMEN10003'){
      this.model.menuItem4 = 'MEN10003';
    }else{
      this.model.menuItem4 = 'MEN0';
    }
    
    if(this.model.productsubmenu1 == 'SUBMEN10004' || this.model.productsubmenu2 == 'SUBMEN10005' ||
      this.model.productsubmenu3 == 'SUBMEN10006'){
      this.model.menuItem5 = 'MEN10004';
    }else{
      this.model.menuItem5 = 'MEN0';
    }

    if(this.model.salessubmenu1 == 'SUBMEN10007' || this.model.salessubmenu2 == 'SUBMEN10008' ||
      this.model.salessubmenu3 == 'SUBMEN10009' || this.model.salessubmenu4 == 'SUBMEN10010' || 
      this.model.salessubmenu5 == 'SUBMEN10011'){
      this.model.menuItem6 = 'MEN10005';
    }else{
      this.model.menuItem6 = 'MEN0';
    }

    console.log("Menu Name4 -->"+this.model.menuItem4);
    console.log("Menu Name5 -->"+this.model.menuItem5);
    console.log("Menu Name6 -->"+this.model.menuItem6);
    
    if(this.model.menuItem1 == 'MEN0' && this.model.menuItem2 == 'MEN0' && this.model.menuItem3 == 'MEN0' && 
        this.model.menuItem7 == 'MEN0' && this.model.menuItem8 == 'MEN0' && this.model.menuItem4 == 'MEN0' && 
        this.model.menuItem5 == 'MEN0' && this.model.menuItem6 == 'MEN0'){

        this.validationMsg = true;

    
      /* this.snackBar.open(
        "Please Choose atleast one Menu",
        "",
        {
          panelClass: ["warning"],
          verticalPosition: "top",
        }
      ); */

    }else{
      
      this.userArray.push({ username : this.model.username,password : this.model.password,
        departmentname:this.model.departmentname,menuItem1 : this.model.menuItem1,menuItem2 : this.model.menuItem2,
        menuItem3 : this.model.menuItem3, menuItem4 : this.model.menuItem4,purchasesubmenu1 : this.model.purchasesubmenu1,
        purchasesubmenu2 : this.model.purchasesubmenu2,purchasesubmenu3 : this.model.purchasesubmenu3,menuItem5 : this.model.menuItem5, 
        productsubmenu1 : this.model.productsubmenu1,productsubmenu2 : this.model.productsubmenu2,productsubmenu3 : this.model.productsubmenu3,
        menuItem6 : this.model.menuItem6,salessubmenu1 : this.model.salessubmenu1,salessubmenu2 : this.model.salessubmenu2,
        salessubmenu3 : this.model.salessubmenu3,salessubmenu4 : this.model.salessubmenu4,salessubmenu5 : this.model.salessubmenu5,
        menuItem7 : this.model.menuItem7, menuItem8 : this.model.menuItem8 }); 

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

    }
  }

  closeModal() {
    this.activeModal.close();
  }

}
