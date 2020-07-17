import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialogConfig, MatDialog } from "@angular/material";
import { AddUserMgtComponent } from '../addusermgt/addusermgt.component';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-usermgt",
  templateUrl: "./usermgt.component.html",
  styleUrls: ["./usermgt.component.scss"],
  // providers: [NgbModalConfig, NgbModal]
})
export class UserManagementComponent implements OnInit {
  activeTab: number = 0;
  dialogConfig = new MatDialogConfig();

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    config: NgbModalConfig, private modalService: NgbModal,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }


  ngOnInit() {
    
  }

  tabChanged(event) {
    this.activeTab = event;
  }

  setTabIndex(tabIndex) {
    this.activeTab = tabIndex;
  }

  addUserMgt(){
    const modalRef = this.modalService.open(AddUserMgtComponent, { windowClass: 'modal-class'});

    modalRef.result.then((result) => {
      this.ngOnInit();
    }, (reason) => {
      this.ngOnInit();
    }); 

    /* this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.position = {
      top: "1000",
      left: "100",
    };
    let dialogRef = this.dialog
    .open(AddUserMgtComponent, {
      width:'150vh',
      height:'80vh',
      //data: data,
      disableClose: true,
     // hasBackdrop: true
    })
    dialogRef.backdropClick().subscribe(result => {
      this.ngOnInit();
    });                
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    }); */
  }


}
