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
    this.SpinnerService.show();  
    this.getMenuName1("MEN10000");
    this.getMenuName2("MEN10001");
    this.getMenuName3("MEN10002");
    this.getMenuName4("MEN10003");
    this.getMenuName5("MEN10004");
    this.getMenuName6("MEN10005");
    this.getMenuName7("MEN10006");
    this.getMenuName8("MEN10007");
    this.enable = false;
    this.load();
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
      this.ngOnInit();
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

  getMenuName8(menu8){
    this.userMgtService.getMenu(menu8)
    .subscribe(
      data => {
        this.menuList = data;
        this.model.menu8 = this.menuList[0].menuname;
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

  removeuser(id:string){
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
  
  
}
