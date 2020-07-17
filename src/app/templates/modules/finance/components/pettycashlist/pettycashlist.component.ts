import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FinanceService } from "../../services/finance.service";
import { MatSnackBar, MatDialogConfig, MatDialog } from "@angular/material";
import { AddPettycashComponent } from '../addpettycash/addpettycash.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pettycashlist',
  templateUrl: './pettycashlist.component.html',
  styleUrls: ['./pettycashlist.component.scss'],
  // providers: [NgbModalConfig, NgbModal]
})
export class PettycashlistComponent implements OnInit {
  model: any = {};
  pettyCashList: any = {};
  financeList: any = {};
  dialogConfig = new MatDialogConfig();
  title: string = "";
  button: string = "";
  enable: boolean;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private financeService:FinanceService,
    private snackBar: MatSnackBar,
    private SpinnerService: NgxSpinnerService,
    config: NgbModalConfig, private modalService: NgbModal,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  
  load(){
    this.financeService.load()
    .subscribe(
      data => { 
        this.pettyCashList = data;
        if(this.pettyCashList.length > 0) {
          this.enable = true;
        } else {
          this.enable = false;
          setTimeout(() => {
            this.snackBar.open("Petty Cash data is empty", "", {
              duration: undefined, // 3mints
              panelClass: ["warning"],
              verticalPosition: "top",
              horizontalPosition: 'center'
            });
          });
        }
       
      },
      error => {
      }
    );
  }
  ngOnInit() {   
    this.SpinnerService.show();  
    this.load();
    setTimeout(() => {
      this.SpinnerService.hide();
    }, 100);
  }

  addPetty(id:string,description:string,addedDate:string,type:string,
    toPerson:string,totalAmount:string,currency:string,invoicenumber:string){

    /* if(this.snackBar.open) {
      this.snackBar.dismiss();
    } */
    const modalRef = this.modalService.open(AddPettycashComponent, { windowClass: 'petty-class'});

    if (id !== null) {
      this.title = "Edit Petty Cash";
      this.button = "Update";
    } else {
      this.title = "Add Petty Cash";
      this.button = "Add";
    }
    let data = { dialogTitle: this.title, dialogText: this.button, id: id,
      description: description, addedDate: addedDate, type: type,toPerson: toPerson, 
      totalAmount: totalAmount,currency: currency,invoicenumber: invoicenumber }

    modalRef.componentInstance.fromParent = data;
    modalRef.result.then((result) => {
      this.load();
    }, (reason) => {
      this.load();
    });   
    //return modalRef.result;
    /* this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.position = {
      top: "1000",
      left: "100",
    };
    let dialogRef = this.dialog
    .open(AddPettycashComponent, {
      width:'150vh',
      //height:'80vh',
      data: data,
      disableClose: true,
      //: true
    })
    dialogRef.backdropClick().subscribe(result => {
      this.load();
    });                
    dialogRef.afterClosed().subscribe(result => {
      this.load();
    }); */
  }

  pettydelete(id:string){
    this.financeService.remove(id).subscribe((data: any) => {
      if (data === null) {
        setTimeout(() => {
          this.snackBar.open(
            "Petty Cash has been deleted successfully",
            "dismss",
            {
              panelClass: ["success"],
              verticalPosition: "top",
              duration: undefined
            }
          );
        });
        this.load();
      } else if (data === 500) {
        setTimeout(() => {
          this.snackBar.open("Internal server error", "dismss", {
            panelClass: ["error"],
            verticalPosition: "top",
          });
        });
      } else {
        setTimeout(() => {
          this.snackBar.open("Bad request data", "dismss", {
            panelClass: ["error"],
            verticalPosition: "top",
          });
        });
      }
    });
  }

  ngOnDestroy(){
    this.snackBar.dismiss();
    (<HTMLElement>document.querySelector('.mat-drawer-content')).style.overflow = 'auto';
  }
  
}
