import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryproductService } from '../services/categoryproduct.service';
import { MatSnackBar, MatDialogConfig, MatDialog } from "@angular/material";
import { AddunitsComponent } from '../addunits/addunits.component';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss'],
  // providers: [NgbModalConfig, NgbModal]
})
export class UnitsComponent implements OnInit {
  constructor(private router: Router,
    private catprodservice: CategoryproductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
     config: NgbModalConfig, private modalService: NgbModal,
  ) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  unitlist:any = {};
  model:any = {};
  dialogConfig = new MatDialogConfig();
  enable: boolean;

  ngOnInit() {
    this.model.rowId = "RowId";
    this.loadUnits();
  }

  loadUnits(){
    let id = "all";
    this.catprodservice.loadUnitList(id)
     .subscribe(
       data => {
         this.unitlist = data;
         if(this.unitlist.length > 0) {
          this.enable = true;
        } else {
          this.enable = false;
          setTimeout(() => {
            this.snackBar.open("Unit data is empty", "", {
              duration: undefined,   
              panelClass: ["warning"],
              verticalPosition: "top",
              horizontalPosition: 'center'
            });
          });
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

  unitedit(id:number,unitname:string,unitsymbol:string,quantityname:string,quantitysymbol:string,dimensionsymbol:string){
    this.model.rowId = "";
    this.model.rowId = "editRowId";

    const modalRef = this.modalService.open(AddunitsComponent, { windowClass: 'unit-class'});
    let data = {id: id, unitname: unitname,unitsymbol: unitsymbol,quantityname:quantityname,quantitysymbol:quantitysymbol,dimensionsymbol:dimensionsymbol}

    modalRef.componentInstance.fromParent = data;
    modalRef.result.then((result) => {
      this.loadUnits();
    }, (reason) => {
      this.loadUnits();
    }); 
    //modalRef.result.then(function(){
      //this.ngOnInit();
    //});
    /* this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.position = {
      'top': '100',
      left: '100'
    };
    let dialogRef = this.dialog
      .open(AddunitsComponent, {
        panelClass: 'addNewUnit',
        data: {id: id, unitname: unitname,unitsymbol: unitsymbol,quantityname:quantityname,quantitysymbol:quantitysymbol,dimensionsymbol:dimensionsymbol},
        height:'110vh',
        width:'150vh',
      })
      dialogRef.backdropClick().subscribe(result => {
        console.log('backdropClick');
        this.ngOnInit();
      });                
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.ngOnInit();
      }); */
  }

  unitdelete(id:string){
    this.catprodservice.removeUnit(id)
      .subscribe(
        data => {
          setTimeout(() => {
            this.snackBar.open("Unit Deleted Successfully", "", {
              panelClass: ["success"],
              verticalPosition: 'top'      
            });
          });
          this.loadUnits();
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

  addNewUnits(){
    const modalRef = this.modalService.open(AddunitsComponent, { windowClass: 'unit-class'});
    let id = null;
    let data = {id: id}

    modalRef.componentInstance.fromParent = data;
    modalRef.result.then((result) => {
      this.loadUnits();
    }, (reason) => {
      this.loadUnits();
    }); 
    //this.router.navigate(["category-and-product/addunits"]);
  }
}
