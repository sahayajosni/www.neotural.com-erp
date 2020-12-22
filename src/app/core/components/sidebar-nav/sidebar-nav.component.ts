import { Component, OnInit } from "@angular/core";
import { InteractionService } from './../../common/_services/interaction.service';
import { MenuItem } from "./sidebar-nav.model";
import { SidenavItems } from "src/app/core/common/config/sidenav.config";
import { Location } from "@angular/common";
import { Router, NavigationEnd } from "@angular/router";
import { AuthenticationService } from "src/app/core/common/_services/index";
import { UserManagementService } from "src/app/templates/modules/usermanagement/services/usermanagement.service";
import { User } from "src/app/core/common/_models/index";

@Component({
  selector: "app-sidebar-nav",
  templateUrl: "./sidebar-nav.component.html",
  styleUrls: ["./sidebar-nav.component.scss"]
})
export class SidebarNavComponent implements OnInit {
  
  //menuItems: MenuItem[];
  menuItems = [];
  isExpanded: boolean;
  currentPath: string;
  assignPath: string;
  showChildNum:number = NaN;
  menuList: any = {};
  submenuList: any = {};
  model: any = {};
  user: User;
  menuAsubMenu : any = {};
  purchasemenuItems = [];
  productmenuItems = [];
  salesmenuItems = [];
  financemenuItems = [];
  reportmenuItems = [];

  constructor(
      private interactionService:InteractionService, 
      location: Location, router: Router,
      private authenticationService:AuthenticationService,
      private userMgtService: UserManagementService,) {

    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentPath = location.path();
        const splitPath = this.currentPath.split('/');
        this.assignPath = splitPath[0]+'/'+splitPath[1];
       }
    });
  }

  ngOnInit() {
    //this.menuItems = SidenavItems;
    this.getMenuName1("MEN10000");
    this.getMenuName2("MEN10001");
    this.getMenuName3("MEN10002");
    this.getMenuName4("MEN10003");
    this.getMenuName5("MEN10004");
    this.getMenuName6("MEN10005");
    this.getMenuName7("MEN10006");
    this.getMenuName8("MEN10007");
    this.getMenuName9("MEN10008");
    this.getMenuName10("MEN10009");
    this.getPurchaseSubMenuName1("SUBMEN10001");
    this.getPurchaseSubMenuName2("SUBMEN10002");
    this.getPurchaseSubMenuName3("SUBMEN10003");
    this.getPurchaseSubMenuName4("SUBMEN10012");
    this.getProductSubMenuName1("SUBMEN10004");
    this.getProductSubMenuName2("SUBMEN10005");
    this.getProductSubMenuName3("SUBMEN10006");
    this.getSalesSubMenuName1("SUBMEN10007");
    this.getSalesSubMenuName2("SUBMEN10008");
    this.getSalesSubMenuName3("SUBMEN10009");
    this.getSalesSubMenuName4("SUBMEN10010");
    this.getSalesSubMenuName5("SUBMEN10011");
    this.getSalesSubMenuName6("SUBMEN10013");
    this.getFinanceSubMenuName1("SUBMEN10014");
    this.getFinanceSubMenuName2("SUBMEN10015");
    this.getFinanceSubMenuName3("SUBMEN10016");
    this.getFinanceSubMenuName4("SUBMEN10017");
    this.getReportSubMenuName1("SUBMEN10018");
    this.load();
    this.interactionService.viewSideNaviSource.subscribe(value => {
      this.isExpanded = value;

      this.menuItems.map((item, index) => {
        if(item.path == this.assignPath) {
          this.shuffleOverrideLinks(index);
        }
      })
    });
  }
  //added to toggle sidenavi

  shuffleChildLinks(num){
    this.showChildNum = this.showChildNum !== num ? this.showChildNum = num : -1;
  }

  shuffleOverrideLinks(num) {
    setTimeout(() => {
      this.showChildNum = num;
    })
  }

  /*   Start getting Menus and SubMenus */
  getMenuName1(menu1){
    this.userMgtService.getMenu(menu1)
    .subscribe(
      data => {
        this.menuList = data;
        this.model.menu1 = this.menuList[0].menuname;
      });
  }

  getMenuName2(menu2){
    this.userMgtService.getMenu(menu2)
    .subscribe(
      data => {
        this.menuList = data;
        this.model.menu2 = this.menuList[0].menuname;
      });
  }

  getMenuName3(menu3){
    this.userMgtService.getMenu(menu3)
    .subscribe(
      data => {
        this.menuList = data;
        this.model.menu3 = this.menuList[0].menuname;
      });
  }

  getMenuName7(menu7){
    this.userMgtService.getMenu(menu7)
    .subscribe(
      data => {
        this.menuList = data;
        this.model.menu7 = this.menuList[0].menuname;
      });
  }

  getMenuName4(menu4){
    this.userMgtService.getMenu(menu4)
    .subscribe(
      data => {
        this.menuList = data;
        this.model.menu4 = this.menuList[0].menuname;
      });
  }

  getMenuName5(menu5){
    this.userMgtService.getMenu(menu5)
    .subscribe(
      data => {
        this.menuList = data;
        this.model.menu5 = this.menuList[0].menuname;
      });
  }

  getMenuName6(menu6){
    this.userMgtService.getMenu(menu6)
    .subscribe(
      data => {
        this.menuList = data;
        this.model.menu6 = this.menuList[0].menuname;
      });
  }

  getMenuName8(menu8){
    this.userMgtService.getMenu(menu8)
    .subscribe(
      data => {
        this.menuList = data;
        this.model.menu8 = this.menuList[0].menuname;
      });
  }

  getMenuName9(menu9){
    this.userMgtService.getMenu(menu9)
    .subscribe(
      data => {
        this.menuList = data;
        this.model.menu9 = this.menuList[0].menuname;
      });
  }

  getMenuName10(menu10){
    this.userMgtService.getMenu(menu10)
    .subscribe(
      data => {
        this.menuList = data;
        this.model.menu10 = this.menuList[0].menuname;
      });
  }

  getPurchaseSubMenuName1(purchasesubmenu1){
    this.userMgtService.getSubMenu(purchasesubmenu1)
    .subscribe(
      data => {
        this.submenuList = data;
        this.model.purchasesubmenu1 = this.submenuList[0].submenuname;
      });
  }

  getPurchaseSubMenuName2(purchasesubmenu2){
    this.userMgtService.getSubMenu(purchasesubmenu2)
    .subscribe(
      data => {
        this.submenuList = data;
        this.model.purchasesubmenu2 = this.submenuList[0].submenuname;
      });
  }

  getPurchaseSubMenuName3(purchasesubmenu3){
    this.userMgtService.getSubMenu(purchasesubmenu3)
    .subscribe(
      data => {
        this.submenuList = data;
        this.model.purchasesubmenu3 = this.submenuList[0].submenuname;
      });
  }

  getPurchaseSubMenuName4(purchasesubmenu4){
    this.userMgtService.getSubMenu(purchasesubmenu4)
    .subscribe(
      data => {
        this.submenuList = data;
        this.model.purchasesubmenu4 = this.submenuList[0].submenuname;
      });
  }

  getProductSubMenuName1(productsubmenu1){
    this.userMgtService.getSubMenu(productsubmenu1)
    .subscribe(
      data => {
        this.submenuList = data;
        this.model.productsubmenu1 = this.submenuList[0].submenuname;
      });
  }

  getProductSubMenuName2(productsubmenu2){
    this.userMgtService.getSubMenu(productsubmenu2)
    .subscribe(
      data => {
        this.submenuList = data;
        this.model.productsubmenu2 = this.submenuList[0].submenuname;
      });
  }

  getProductSubMenuName3(productsubmenu3){
    this.userMgtService.getSubMenu(productsubmenu3)
    .subscribe(
      data => {
        this.submenuList = data;
        this.model.productsubmenu3 = this.submenuList[0].submenuname;
      });
  }

  getSalesSubMenuName1(salessubmenu1){
    this.userMgtService.getSubMenu(salessubmenu1)
    .subscribe(
      data => {
        this.submenuList = data;
        this.model.salessubmenu1 = this.submenuList[0].submenuname;
      });
  }

  getSalesSubMenuName2(salessubmenu2){
    this.userMgtService.getSubMenu(salessubmenu2)
    .subscribe(
      data => {
        this.submenuList = data;
        this.model.salessubmenu2 = this.submenuList[0].submenuname;
      });
  }

  getSalesSubMenuName3(salessubmenu3){
    this.userMgtService.getSubMenu(salessubmenu3)
    .subscribe(
      data => {
        this.submenuList = data;
        this.model.salessubmenu3 = this.submenuList[0].submenuname;
      });
  }

  getSalesSubMenuName4(salessubmenu4){
    this.userMgtService.getSubMenu(salessubmenu4)
    .subscribe(
      data => {
        this.submenuList = data;
        this.model.salessubmenu4 = this.submenuList[0].submenuname;
      });
  }

  getSalesSubMenuName5(salessubmenu5){
    this.userMgtService.getSubMenu(salessubmenu5)
    .subscribe(
      data => {
        this.submenuList = data;
        this.model.salessubmenu5 = this.submenuList[0].submenuname;
      });
  }

  getSalesSubMenuName6(salessubmenu6){
    this.userMgtService.getSubMenu(salessubmenu6)
    .subscribe(
      data => {
        this.submenuList = data;
        this.model.salessubmenu6 = this.submenuList[0].submenuname;
      });
  }

  getFinanceSubMenuName1(financesubmenu1){
    this.userMgtService.getSubMenu(financesubmenu1)
    .subscribe(
      data => {
        this.submenuList = data;
        this.model.financesubmenu1 = this.submenuList[0].submenuname;
      });
  }

  getFinanceSubMenuName2(financesubmenu2){
    this.userMgtService.getSubMenu(financesubmenu2)
    .subscribe(
      data => {
        this.submenuList = data;
        this.model.financesubmenu2 = this.submenuList[0].submenuname;
      });
  }

  getFinanceSubMenuName3(financesubmenu3){
    this.userMgtService.getSubMenu(financesubmenu3)
    .subscribe(
      data => {
        this.submenuList = data;
        this.model.financesubmenu3 = this.submenuList[0].submenuname;
      });
  }

  getFinanceSubMenuName4(financesubmenu4){
    this.userMgtService.getSubMenu(financesubmenu4)
    .subscribe(
      data => {
        this.submenuList = data;
        this.model.financesubmenu4 = this.submenuList[0].submenuname;
      });
  }

  getReportSubMenuName1(reportsubmenu1){
    this.userMgtService.getSubMenu(reportsubmenu1)
    .subscribe(
      data => {
        this.submenuList = data;
        this.model.reportsubmenu1 = this.submenuList[0].submenuname;
      });
  }

  load(){
    let invoice = localStorage.getItem('invoiceNumber')
    this.authenticationService.getUser(invoice)
    .subscribe(
      data => {
        this.menuAsubMenu = data;
        localStorage.setItem("menuItem1",this.menuAsubMenu[0].menuItem1);
        localStorage.setItem("menuItem2",this.menuAsubMenu[0].menuItem2);
        localStorage.setItem("menuItem3",this.menuAsubMenu[0].menuItem3);
        localStorage.setItem("menuItem4",this.menuAsubMenu[0].menuItem4);
        localStorage.setItem("menuItem5",this.menuAsubMenu[0].menuItem5);
        localStorage.setItem("menuItem6",this.menuAsubMenu[0].menuItem6);
        localStorage.setItem("menuItem7",this.menuAsubMenu[0].menuItem7);
        localStorage.setItem("menuItem8",this.menuAsubMenu[0].menuItem8);
        localStorage.setItem("menuItem9",this.menuAsubMenu[0].menuItem9);
        localStorage.setItem("menuItem10",this.menuAsubMenu[0].menuItem10);

        localStorage.setItem("purchasesubmenu1",this.menuAsubMenu[0].purchasesubmenu1);
        localStorage.setItem("purchasesubmenu2",this.menuAsubMenu[0].purchasesubmenu2);
        localStorage.setItem("purchasesubmenu3",this.menuAsubMenu[0].purchasesubmenu3);
        localStorage.setItem("purchasesubmenu4",this.menuAsubMenu[0].purchasesubmenu4);
        localStorage.setItem("productsubmenu1",this.menuAsubMenu[0].productsubmenu1);
        localStorage.setItem("productsubmenu2",this.menuAsubMenu[0].productsubmenu2);
        localStorage.setItem("productsubmenu3",this.menuAsubMenu[0].productsubmenu3);
        localStorage.setItem("salessubmenu1",this.menuAsubMenu[0].salessubmenu1);
        localStorage.setItem("salessubmenu2",this.menuAsubMenu[0].salessubmenu2);
        localStorage.setItem("salessubmenu3",this.menuAsubMenu[0].salessubmenu3);
        localStorage.setItem("salessubmenu4",this.menuAsubMenu[0].salessubmenu4);
        localStorage.setItem("salessubmenu5",this.menuAsubMenu[0].salessubmenu5);
        localStorage.setItem("salessubmenu6",this.menuAsubMenu[0].salessubmenu6);
        localStorage.setItem("financesubmenu1",this.menuAsubMenu[0].financesubmenu1);
        localStorage.setItem("financesubmenu2",this.menuAsubMenu[0].financesubmenu2);
        localStorage.setItem("financesubmenu3",this.menuAsubMenu[0].financesubmenu3);
        localStorage.setItem("financesubmenu4",this.menuAsubMenu[0].financesubmenu4);
        localStorage.setItem("reportsubmenu1",this.menuAsubMenu[0].reportsubmenu1);
        this.loadMenu();
      });
  }


  loadMenu(){
    if(localStorage.getItem("menuItem1") == "MEN10000"){
      this.menuItems.push({ id: "dashboard", label: this.model.menu1, icon: "assets/images/dashboard.png",
        path: "/dashboard", childern: [], submenu: false });
    }
    
    if(localStorage.getItem("menuItem2") == "MEN10001"){
      this.menuItems.push({ id: "employment", label: this.model.menu2, icon: "assets/images/employee.png",
        path: "/employment", childern: [], submenu: false });
    }

    if(localStorage.getItem("menuItem3") == "MEN10002"){
      this.menuItems.push({ id: "vendorAndCustomer", label: this.model.menu3, icon: "assets/images/vendor-customer.png",
        path: "/vendor-and-customer", childern: [], submenu: false });
    }

    /* Purchase Menu and Submenu */
    if(localStorage.getItem("purchasesubmenu1") == "SUBMEN10001"){
      this.purchasemenuItems.push({ id: "purchase-order", label: this.model.purchasesubmenu1, path: "/purchase" });
      this.model.firpurchaseSubMenu = "/purchase";
    }
    if(localStorage.getItem("purchasesubmenu2") == "SUBMEN10002"){
      this.purchasemenuItems.push({ id: "purchase-invoice", label: this.model.purchasesubmenu2, path: "/purchase/invoice" });
      this.model.firpurchaseSubMenu = "/purchase/invoice";
    }
    if(localStorage.getItem("purchasesubmenu3") == "SUBMEN10003"){
      this.purchasemenuItems.push({ id: "purchase-return", label: this.model.purchasesubmenu3, path: "/purchase/return" });
      this.model.firpurchaseSubMenu = "/purchase/return";
    }
    if(localStorage.getItem("purchasesubmenu4") == "SUBMEN10012"){
      this.purchasemenuItems.push({ id: "purchase-template", label: this.model.purchasesubmenu4, path: "/purchase/template" });
      this.model.firpurchaseSubMenu = "/purchase/template";
    }
    if(localStorage.getItem("menuItem4") == "MEN10003"){
      this.menuItems.push({ id: "purchase", label: this.model.menu4, icon: "assets/images/circle-cropped.png",
        path: this.model.firpurchaseSubMenu, childern: this.purchasemenuItems, submenu: true });
    }

    /* Product Menu and SubMenu */
    if(localStorage.getItem("productsubmenu1") == "SUBMEN10004"){
      this.productmenuItems.push({ id: "product", label: this.model.productsubmenu1, path: "/category-and-product" });
      this.model.firproductSubMenu = "/category-and-product";
    }
    if(localStorage.getItem("productsubmenu2") == "SUBMEN10005"){
      this.productmenuItems.push({ id: "units", label: this.model.productsubmenu2, path: "/category-and-product/units" });
      this.model.firproductSubMenu = "/category-and-product/units";
    }
    if(localStorage.getItem("productsubmenu3") == "SUBMEN10006"){
      this.productmenuItems.push({ id: "category", label: this.model.productsubmenu3, path: "/category-and-product/category" });
      this.model.firproductSubMenu = "/category-and-product/category";
    }
    if(localStorage.getItem("menuItem5") == "MEN10004"){
      this.menuItems.push({ id: "product", label: this.model.menu5, icon: "assets/images/category-product.png",
        path: this.model.firproductSubMenu, childern: this.productmenuItems, submenu: true });
    }

    /* Sales Menu and SubMenu */
    if(localStorage.getItem("salessubmenu1") == "SUBMEN10007"){
      this.salesmenuItems.push({ id: "sales-order", label: this.model.salessubmenu1, path: "/sales" });
      this.model.firsalesSubMenu = "/sales";
    }
    if(localStorage.getItem("salessubmenu2") == "SUBMEN10008"){
      this.salesmenuItems.push({ id: "sales-invoice", label: this.model.salessubmenu2, path: "/sales/invoice" });
      this.model.firsalesSubMenu = "/sales/invoice";
    }
    if(localStorage.getItem("salessubmenu3") == "SUBMEN10009"){
      this.salesmenuItems.push({ id: "customers", label: this.model.salessubmenu3, path: "/vendor-and-customer/customer" });
      this.model.firsalesSubMenu = "/vendor-and-customer/customer";
    }
    if(localStorage.getItem("salessubmenu4") == "SUBMEN10010"){
      this.salesmenuItems.push({ id: "sales-invoice", label: this.model.salessubmenu4, path: "/sales/return" });
      this.model.firsalesSubMenu = "/sales/return";
    }

    if(localStorage.getItem("salessubmenu5") == "SUBMEN10011"){
      this.salesmenuItems.push({ id: "promotionlist", label: this.model.salessubmenu5, path: "/category-and-product/promotionlist" });
      this.model.firsalesSubMenu = "/category-and-product/promotionlist";
    }
    if(localStorage.getItem("salessubmenu6") == "SUBMEN10013"){
      this.salesmenuItems.push({ id: "sales-template", label: this.model.salessubmenu6, path: "/sales/template" });
      this.model.firsalesSubMenu = "/sales/template";
    }
    if(localStorage.getItem("menuItem6") == "MEN10005"){
      this.menuItems.push({ id: "sales", label: this.model.menu6, icon: "assets/images/sales.png",
        path: this.model.firsalesSubMenu, childern: this.salesmenuItems, submenu: true });
    }

    /* Stock Menu */
    if(localStorage.getItem("menuItem7") == "MEN10006"){
      this.menuItems.push({ id: "stock", label: this.model.menu7, icon: "assets/images/stock.png",
        path: "/stock", childern: [], submenu: false });
    }

    /* Finance Menu and SubMenu */
    if(localStorage.getItem("financesubmenu1") == "SUBMEN10014"){
      this.financemenuItems.push({ id: "pettycash", label: this.model.financesubmenu1, path: "/finance/pettycashlist" });
      this.model.firfinanaceSubMenu = "/finance/pettycashlist";
    }
    if(localStorage.getItem("financesubmenu2") == "SUBMEN10015"){
      this.financemenuItems.push({ id: "invoice", label: this.model.financesubmenu2, path: "/finance/invoicelist" });
      this.model.firfinanaceSubMenu = "/finance/invoicelist";
    }
    if(localStorage.getItem("financesubmenu3") == "SUBMEN10016"){
      this.financemenuItems.push({ id: "return", label: this.model.financesubmenu3, path: "/finance/returnlist" });
      this.model.firfinanaceSubMenu = "/finance/returnlist";
    }
    if(localStorage.getItem("financesubmenu4") == "SUBMEN10017"){
      this.financemenuItems.push({ id: "profitandloss", label: this.model.financesubmenu4, path: "/finance/profitandloss" });
      this.model.firfinanaceSubMenu = "/finance/profitandloss";
    }
    if(localStorage.getItem("menuItem8") == "MEN10007"){
      this.menuItems.push({ id: "finance", label: this.model.menu8, icon: "assets/images/finance.png",
        path: this.model.firfinanaceSubMenu, childern: this.financemenuItems, submenu: true });
    }

    /* Report Menu and SubMenu */
    if(localStorage.getItem("reportsubmenu1") == "SUBMEN10018"){
      this.reportmenuItems.push({ id: "employeereport", label: this.model.reportsubmenu1, path: "/reports/employeereport" });
      this.model.firreportSubMenu = "/reports/employeereport";
    }
    if(localStorage.getItem("menuItem9") == "MEN10008"){
      this.menuItems.push({ id: "report", label: this.model.menu9, icon: "assets/images/reports.png",
        path: this.model.firreportSubMenu, childern: this.reportmenuItems, submenu: true });
    }
    
    /* UserMgmt Menu */
    if(localStorage.getItem("menuItem10") == "MEN10009"){
      this.menuItems.push({ id: "userManagement", label: this.model.menu10, icon: "assets/images/usermgt.png",
        path: "/user-management", childern: [], submenu: false });
    }
  }

}
