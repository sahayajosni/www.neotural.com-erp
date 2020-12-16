import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialogConfig, MatDialog } from "@angular/material";
import { AddUserMgtComponent } from '../addusermgt/addusermgt.component';
import { UserManagementService } from "../../services/usermanagement.service";
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: "app-usermgt",
  templateUrl: "./usermgt.component.html",
  styleUrls: ["./usermgt.component.scss"],
  // providers: [NgbModalConfig, NgbModal]
})
export class UserManagementComponent implements OnInit {
  activeTab: number = 0;
  dialogConfig = new MatDialogConfig();

  userList: any = [];
  model: any = {};
  menuList: any = {};
  submenuList:any = {};
  enable: boolean;

  userArray: Array<any> = [];
  
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private userMgtService: UserManagementService,
    config: NgbModalConfig, private modalService: NgbModal,
    private SpinnerService: NgxSpinnerService,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }


  ngOnInit() {
    this.userList = '';
    this.userArray = [];
    this.SpinnerService.show();  
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
    this.enable = false;
    this.load();
  }
  menulable:string = "Show Menu";
  showMenu(){
    if(this.menulable == "Show Menu") {
      this.menulable = "Hide Menu";
    } else {
      this.menulable = "Show Menu";

    }
  }
  openScrollableContent(longContent,id:string) {
    this.modalService.open(longContent, { windowClass: 'modal-class'});
    this.userArray = [];
    this.userMgtService.load().subscribe(
      data => { 
        this.userList = data;
        for(let i=0; i<this.userList.length;i++){
          if(this.userList[i].id == id){
            this.model.menuItem1 = this.userList[i].menuItem1;
            this.model.menuItem2 = this.userList[i].menuItem2;
            this.model.menuItem3 = this.userList[i].menuItem3;
            this.model.menuItem4 = this.userList[i].menuItem4;
            this.model.purchasesubmenuItem1 = this.userList[i].purchasesubmenu1;
            this.model.purchasesubmenuItem2 = this.userList[i].purchasesubmenu2;
            this.model.purchasesubmenuItem3 = this.userList[i].purchasesubmenu3;
            this.model.purchasesubmenuItem4 = this.userList[i].purchasesubmenu4;
            this.model.menuItem5 = this.userList[i].menuItem5;
            this.model.productsubmenuItem1 = this.userList[i].productsubmenu1;
            this.model.productsubmenuItem2 = this.userList[i].productsubmenu2;
            this.model.productsubmenuItem3 = this.userList[i].productsubmenu3;
            this.model.menuItem6 = this.userList[i].menuItem6;
            this.model.salessubmenuItem1 = this.userList[i].salessubmenu1;
            this.model.salessubmenuItem2 = this.userList[i].salessubmenu2;
            this.model.salessubmenuItem3 = this.userList[i].salessubmenu3;
            this.model.salessubmenuItem4 = this.userList[i].salessubmenu4;
            this.model.salessubmenuItem5 = this.userList[i].salessubmenu5;
            this.model.salessubmenuItem6 = this.userList[i].salessubmenu6;
            this.model.menuItem7 = this.userList[i].menuItem7;
            this.model.menuItem8 = this.userList[i].menuItem8;
            this.model.financesubmenuItem1 = this.userList[i].financesubmenu1;
            this.model.financesubmenuItem2 = this.userList[i].financesubmenu2;
            this.model.financesubmenuItem3 = this.userList[i].financesubmenu3;
            this.model.financesubmenuItem4 = this.userList[i].financesubmenu4;
            this.model.menuItem9 = this.userList[i].menuItem9;
            this.model.reportsubmenuItem1 = this.userList[i].reportsubmenu1;
          }
        }
      },
      error => {
        this.SpinnerService.hide();
      }
    );
  }
  load(){
    this.userMgtService.load().subscribe(
      data => { 
        this.userList = data;
        this.SpinnerService.hide();
        if(this.userList.length > 0){
          this.enable = true;
        }else {
          this.enable = false;
        }
      },
      error => {
        this.SpinnerService.hide();
      }
    );
  }

  addUserMgt(){
    const modalRef = this.modalService.open(AddUserMgtComponent, { windowClass: 'modal-class'});
    modalRef.result.then((result) => {
      //this.ngOnInit();
    }, (reason) => {
      this.ngOnInit(); 
    }); 
  }

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


  removeuser(id:string){
    //$scope.submenuList[id] == id;
    this.userMgtService.remove(id)
      .subscribe(
        data => {
          setTimeout(() => {
            this.snackBar.open("User Deleted Successfully", "", {
              panelClass: ["success"],
              verticalPosition: 'top'      
            });
          });
          this.load();
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

  
  getupdatemenu0(isMenuChecked: boolean){
    console.log("Menu1 Check Boolean --->"+isMenuChecked);
    this.model.menuItem1 = '';
    if(isMenuChecked == true){
      this.model.menuItem1 = 'MEN10000';
    }else{
      this.model.menuItem1 = 'MEN0';
    }
    console.log("Menu1 Code --->"+this.model.menuItem1);
  }

  getupdatemenu1(isMenuChecked: boolean){
    console.log("Menu2 Check Boolean --->"+isMenuChecked);
    this.model.menuItem2 = '';
    if(isMenuChecked == true){
      this.model.menuItem2 = 'MEN10001';
    }else{
      this.model.menuItem2 = 'MEN0';
    }
    console.log("Menu2 Code --->"+this.model.menuItem2);
  }

  getupdatemenu2(isMenuChecked: boolean){
    console.log("Menu3 Check Boolean --->"+isMenuChecked);
    this.model.menuItem3 = '';
    if(isMenuChecked == true){
      this.model.menuItem3 = 'MEN10002';
    }else{
      this.model.menuItem3 = 'MEN0';
    }
    console.log("Menu3 Code --->"+this.model.menuItem3);
  }

  getupdatemenu3(isMenuChecked: boolean){
    console.log("Menu4 Check Boolean --->"+isMenuChecked);
    this.model.menuItem4 = '';
    if(isMenuChecked == true){
      this.model.menuItem4 = 'MEN10003';
    }else{
      this.model.menuItem4 = 'MEN0';
    }
    console.log("Menu4 Code --->"+this.model.menuItem4);
  }

  getPurchasesubmenu1(isSubMenuChecked: boolean){
    console.log("Purchase SubMenu1 Check Boolean --->"+isSubMenuChecked);
    this.model.purchasesubmenuItem1 = '';
    if(isSubMenuChecked == true){
      this.model.purchasesubmenuItem1 = 'SUBMEN10001';
    }else{
      this.model.purchasesubmenuItem1 = 'SUBMEN0';
    }
    console.log("Purchase SubMenu1 Code --->"+this.model.purchasesubmenuItem1);
  }  

  getPurchasesubmenu2(isSubMenuChecked: boolean){
    console.log("Purchase SubMenu2 Check Boolean --->"+isSubMenuChecked);
    this.model.purchasesubmenuItem2 = '';
    if(isSubMenuChecked == true){
      this.model.purchasesubmenuItem2 = 'SUBMEN10002';
    }else{
      this.model.purchasesubmenuItem2 = 'SUBMEN0';
    }
    console.log("Purchase SubMenu2 Code --->"+this.model.purchasesubmenuItem2);
  } 

  getPurchasesubmenu3(isSubMenuChecked: boolean){
    console.log("Purchase SubMenu3 Check Boolean --->"+isSubMenuChecked);
    this.model.purchasesubmenuItem3 = '';
    if(isSubMenuChecked == true){
      this.model.purchasesubmenuItem3 = 'SUBMEN10003';
    }else{
      this.model.purchasesubmenuItem3 = 'SUBMEN0';
    }
    console.log("Purchase SubMenu3 Code --->"+this.model.purchasesubmenuItem3);
  } 

  getPurchasesubmenu4(isSubMenuChecked: boolean){
    console.log("Purchase SubMenu4 Check Boolean --->"+isSubMenuChecked);
    this.model.purchasesubmenuItem4 = '';
    if(isSubMenuChecked == true){
      this.model.purchasesubmenuItem4 = 'SUBMEN10012';
    }else{
      this.model.purchasesubmenuItem4 = 'SUBMEN0';
    }
    console.log("Purchase SubMenu4 Code --->"+this.model.purchasesubmenuItem4);
  } 
  
  getupdatemenu4(isMenuChecked: boolean){
    console.log("Menu5 Check Boolean --->"+isMenuChecked);
    this.model.menuItem5 = '';
    if(isMenuChecked == true){
      this.model.menuItem5 = 'MEN10004';
    }else{
      this.model.menuItem5 = 'MEN0';
    }
    console.log("Menu5 Code --->"+this.model.menuItem5);
  }

  getProductsubmenu1(isSubMenuChecked: boolean){
    console.log("Product SubMenu1 Check Boolean --->"+isSubMenuChecked);
    this.model.productsubmenuItem1 = '';
    if(isSubMenuChecked == true){
      this.model.productsubmenuItem1 = 'SUBMEN10004';
    }else{
      this.model.productsubmenuItem1 = 'SUBMEN0';
    }
    console.log("Product SubMenu1 Code --->"+this.model.productsubmenuItem1);
  } 

  getProductsubmenu2(isSubMenuChecked: boolean){
    console.log("Product SubMenu2 Check Boolean --->"+isSubMenuChecked);
    this.model.productsubmenuItem2 = '';
    if(isSubMenuChecked == true){
      this.model.productsubmenuItem2 = 'SUBMEN10005';
    }else{
      this.model.productsubmenuItem2 = 'SUBMEN0';
    }
    console.log("Product SubMenu2 Code --->"+this.model.productsubmenuItem2);
  }

  getProductsubmenu3(isSubMenuChecked: boolean){
    console.log("Product SubMenu3 Check Boolean --->"+isSubMenuChecked);
    this.model.productsubmenuItem3 = '';
    if(isSubMenuChecked == true){
      this.model.productsubmenuItem3 = 'SUBMEN10006';
    }else{
      this.model.productsubmenuItem3 = 'SUBMEN0';
    }
    console.log("Product SubMenu3 Code --->"+this.model.productsubmenuItem3);
  }

  getupdatemenu5(isMenuChecked: boolean){
    console.log("Menu6 Check Boolean --->"+isMenuChecked);
    this.model.menuItem6 = '';
    if(isMenuChecked == true){
      this.model.menuItem6 = 'MEN10005';
    }else{
      this.model.menuItem6 = 'MEN0';
    }
    console.log("Menu6 Code --->"+this.model.menuItem6);
  }

  getSalessubmenu1(isSubMenuChecked: boolean){
    console.log("Sales SubMenu1 Check Boolean --->"+isSubMenuChecked);
    this.model.salessubmenuItem1 = '';
    if(isSubMenuChecked == true){
      this.model.salessubmenuItem1 = 'SUBMEN10007';
    }else{
      this.model.salessubmenuItem1 = 'SUBMEN0';
    }
    console.log("Sales SubMenu1 Code --->"+this.model.salessubmenuItem1);
  }

  getSalessubmenu2(isSubMenuChecked: boolean){
    console.log("Sales SubMenu2 Check Boolean --->"+isSubMenuChecked);
    this.model.salessubmenuItem2 = '';
    if(isSubMenuChecked == true){
      this.model.salessubmenuItem2 = 'SUBMEN10008';
    }else{
      this.model.salessubmenuItem2 = 'SUBMEN0';
    }
    console.log("Sales SubMenu2 Code --->"+this.model.salessubmenuItem2);
  }

  getSalessubmenu3(isSubMenuChecked: boolean){
    console.log("Sales SubMenu3 Check Boolean --->"+isSubMenuChecked);
    this.model.salessubmenuItem3 = '';
    if(isSubMenuChecked == true){
      this.model.salessubmenuItem3 = 'SUBMEN10009';
    }else{
      this.model.salessubmenuItem3 = 'SUBMEN0';
    }
    console.log("Sales SubMenu3 Code --->"+this.model.salessubmenuItem3);
  }

  getSalessubmenu4(isSubMenuChecked: boolean){
    console.log("Sales SubMenu4 Check Boolean --->"+isSubMenuChecked);
    this.model.salessubmenuItem4 = '';
    if(isSubMenuChecked == true){
      this.model.salessubmenuItem4 = 'SUBMEN10010';
    }else{
      this.model.salessubmenuItem4 = 'SUBMEN0';
    }
    console.log("Sales SubMenu4 Code --->"+this.model.salessubmenuItem4);
  }

  getSalessubmenu5(isSubMenuChecked: boolean){
    console.log("Sales SubMenu5 Check Boolean --->"+isSubMenuChecked);
    this.model.salessubmenuItem5 = '';
    if(isSubMenuChecked == true){
      this.model.salessubmenuItem5 = 'SUBMEN10011';
    }else{
      this.model.salessubmenuItem5 = 'SUBMEN0';
    }
    console.log("Sales SubMenu5 Code --->"+this.model.salessubmenuItem5);
  }

  getSalessubmenu6(isSubMenuChecked: boolean){
    console.log("Sales SubMenu6 Check Boolean --->"+isSubMenuChecked);
    this.model.salessubmenuItem6 = '';
    if(isSubMenuChecked == true){
      this.model.salessubmenuItem6 = 'SUBMEN10013';
    }else{
      this.model.salessubmenuItem6 = 'SUBMEN0';
    }
    console.log("Sales SubMenu5 Code --->"+this.model.salessubmenuItem6);
  }


  getupdatemenu6(isMenuChecked: boolean){
    console.log("Menu7 Check Boolean --->"+isMenuChecked);
    this.model.menuItem7 = '';
    if(isMenuChecked == true){
      this.model.menuItem7 = 'MEN10006';
    }else{
      this.model.menuItem7 = 'MEN0';
    }
    console.log("Menu7 Code --->"+this.model.menuItem7);
  }

  getupdatemenu7(isMenuChecked: boolean){
    console.log("Menu8 Check Boolean --->"+isMenuChecked);
    this.model.menuItem8 = '';
    if(isMenuChecked == true){
      this.model.menuItem8 = 'MEN10007';
    }else{
      this.model.menuItem8 = 'MEN0';
    }
    console.log("Menu8 Code --->"+this.model.menuItem8);
  }

  getFinancesubmenu1(isSubMenuChecked: boolean){
    console.log("Finance SubMenu1 Check Boolean --->"+isSubMenuChecked);
    this.model.financesubmenuItem1 = '';
    if(isSubMenuChecked == true){
      this.model.financesubmenuItem1 = 'SUBMEN10014';
    }else{
      this.model.financesubmenuItem1 = 'SUBMEN0';
    }
    console.log("Finance SubMenu1 Code --->"+this.model.financesubmenuItem1);
  }

  getFinancesubmenu2(isSubMenuChecked: boolean){
    console.log("Finance SubMenu2 Check Boolean --->"+isSubMenuChecked);
    this.model.financesubmenuItem2 = '';
    if(isSubMenuChecked == true){
      this.model.financesubmenuItem2 = 'SUBMEN10015';
    }else{
      this.model.financesubmenuItem2 = 'SUBMEN0';
    }
    console.log("Finance SubMenu3 Code --->"+this.model.financesubmenuItem2);
  }

  getFinancesubmenu3(isSubMenuChecked: boolean){
    console.log("Finance SubMenu3 Check Boolean --->"+isSubMenuChecked);
    this.model.financesubmenuItem3 = '';
    if(isSubMenuChecked == true){
      this.model.financesubmenuItem3 = 'SUBMEN10016';
    }else{
      this.model.financesubmenuItem3 = 'SUBMEN0';
    }
    console.log("Finance SubMenu3 Code --->"+this.model.financesubmenuItem3);
  }

  getFinancesubmenu4(isSubMenuChecked: boolean){
    console.log("Finane SubMenu1 Check Boolean --->"+isSubMenuChecked);
    this.model.financesubmenuItem4 = '';
    if(isSubMenuChecked == true){
      this.model.financesubmenuItem4 = 'SUBMEN10017';
    }else{
      this.model.financesubmenuItem4 = 'SUBMEN0';
    }
    console.log("Finane SubMenu1 Code --->"+this.model.financesubmenuItem4);
  }

  getupdatemenu8(isMenuChecked: boolean){
    console.log("Menu9 Check Boolean --->"+isMenuChecked);
    this.model.menuItem9 = '';
    if(isMenuChecked == true){
      this.model.menuItem9 = 'MEN10008';
    }else{
      this.model.menuItem9 = 'MEN0';
    }
    console.log("Menu9 Code --->"+this.model.menuItem9);
  }

  getReportsubmenu1(isSubMenuChecked: boolean){
    console.log("Report SubMenu1 Check Boolean --->"+isSubMenuChecked);
    this.model.reportsubmenuItem1 = '';
    if(isSubMenuChecked == true){
      this.model.reportsubmenuItem1 = 'SUBMEN10018';
    }else{
      this.model.reportsubmenuItem1 = 'SUBMEN0';
    }
    console.log("Report SubMenu1 Code --->"+this.model.reportsubmenuItem1);
  }

  updateUser(id:string){  
    if(this.model.purchasesubmenuItem1 == 'SUBMEN10001' || this.model.purchasesubmenuItem2 == 'SUBMEN10002' ||
      this.model.purchasesubmenuItem3 == 'SUBMEN10003' || this.model.purchasesubmenuItem4 == 'SUBMEN10012'){
        this.model.menuItem4 = 'MEN10003';
    }else{
      this.model.menuItem4 = 'MEN0';
    }
    
    if(this.model.productsubmenuItem1 == 'SUBMEN10004' || this.model.productsubmenuItem2 == 'SUBMEN10005' ||
      this.model.productsubmenuItem3 == 'SUBMEN10006'){
        this.model.menuItem5 = 'MEN10004';
    }else{
      this.model.menuItem5 = 'MEN0';
    }

    if(this.model.salessubmenuItem1 == 'SUBMEN10007' || this.model.salessubmenuItem2 == 'SUBMEN10008' ||
    this.model.salessubmenuItem3 == 'SUBMEN10009' || this.model.salessubmenuItem4 == 'SUBMEN10010' || 
    this.model.salessubmenuItem5 == 'SUBMEN10011' || this.model.salessubmenuItem6 == 'SUBMEN10013'){
        this.model.menuItem6 = 'MEN10005';
    }else{
      this.model.menuItem6 = 'MEN0';
    }

    if(this.model.financesubmenuItem1 == 'SUBMEN10014' || this.model.financesubmenuItem2 == 'SUBMEN10015' ||
      this.model.financesubmenuItem3 == 'SUBMEN10016' || this.model.financesubmenuItem4 == 'SUBMEN10017'){
        this.model.menuItem8 = 'MEN10007';
    }else{
      this.model.menuItem8 = 'MEN0';
    }

    if(this.model.reportsubmenuItem1 == 'SUBMEN10018'){
      this.model.menuItem9 = 'MEN10008';
    }else{
      this.model.menuItem9 = 'MEN0';
    }

    this.userArray.push({ id:id, menuItem1 : this.model.menuItem1,menuItem2 : this.model.menuItem2, menuItem3 : this.model.menuItem3, 
      menuItem4 : this.model.menuItem4,purchasesubmenu1 : this.model.purchasesubmenuItem1, purchasesubmenu2 : this.model.purchasesubmenuItem2,
      purchasesubmenu3 : this.model.purchasesubmenuItem3,purchasesubmenu4 : this.model.purchasesubmenuItem4, menuItem5 : this.model.menuItem5,
      productsubmenu1 : this.model.productsubmenuItem1,productsubmenu2 : this.model.productsubmenuItem2, productsubmenu3 : this.model.productsubmenuItem3, 
      menuItem6 : this.model.menuItem6,salessubmenu1 : this.model.salessubmenuItem1, salessubmenu2 : this.model.salessubmenuItem2,
      salessubmenu3 : this.model.salessubmenuItem3,salessubmenu4 : this.model.salessubmenuItem4, salessubmenu5 : this.model.salessubmenuItem5, 
      salessubmenu6: this.model.salessubmenuItem6, menuItem7 : this.model.menuItem7, menuItem8 : this.model.menuItem8, 
      financesubmenu1: this.model.financesubmenuItem1, financesubmenu2: this.model.financesubmenuItem2, financesubmenu3: this.model.financesubmenuItem3, 
      financesubmenu4: this.model.financesubmenuItem4, menuItem9 : this.model.menuItem9, reportsubmenu1: this.model.reportsubmenuItem1 }); 

    this.userMgtService.update(this.userArray)
    .subscribe(
    (res) => {
      this.modalService.dismissAll();
      this.load(); 
      setTimeout(() => {
        this.snackBar.open(
          "User was updated Successfully",
          "",
          {
            panelClass: ["success"],
            verticalPosition: "top",
          }
        );
      });
      this.userArray = [];
    });

  }
  
}
