import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryproductService } from '../services/categoryproduct.service';
import { MatSnackBar, MatDialog, MatDialogConfig } from "@angular/material";
import { AddnewcategoryComponent } from '../categoryitem/categoryitem.component';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class CategoryComponent implements OnInit {
  constructor(private router: Router,
    private dialog: MatDialog,
    private catprodservice: CategoryproductService,
    private snackBar: MatSnackBar,
    config: NgbModalConfig, private modalService: NgbModal,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  categorylist:any = {};
  model:any = {};
  dialogConfig = new MatDialogConfig();
  enable: boolean;

  ngOnInit() {
    this.loadCategory();
  }

  loadCategory(){
    this.catprodservice.load()
     .subscribe(
       data => {
          this.categorylist = data;
          if(this.categorylist.length > 0){
            this.enable = true;
          }else{
            this.enable = false;
            setTimeout(() => {
              this.snackBar.open("Category data is empty", "dismiss", {
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
           this.snackBar.open("Network error: server is temporarily unavailable", "dismss", {
             panelClass: ["error"],
             verticalPosition: 'top'      
           });
         });   
       }
     );
  }

  categoryedit(categorycode:string,name:string,desc:string){
    const modalRef = this.modalService.open(AddnewcategoryComponent, { windowClass: 'my-class'});
   
    let data = { categorycode: categorycode, name: name, desc: desc }

    modalRef.componentInstance.fromParent = data;
    modalRef.result.then((result) => {
      this.loadCategory();
    }, (reason) => {
      this.loadCategory();
    }); 
    /* this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.position = {
      'top': '100',
      left: '100'
    };
    this.dialog.open(AddnewcategoryComponent,{
      width:'90vh',
      height:'40vh',
      panelClass: 'addnewcategory',
      data: {categorycode: categorycode, name: name,desc: desc},
      disableClose: true,
     // hasBackdrop: true
    })
    .afterClosed().subscribe(result => {
      this.loadCategory();
    });  */
    
  }

  categorydelete(categorycode:string){
    this.catprodservice.remove(categorycode)
      .subscribe(
        data => {
          setTimeout(() => {
            this.snackBar.open("Category Deleted Successfully", "", {
              panelClass: ["success"],
              verticalPosition: 'top'      
            });
          });
          this.loadCategory();
      },
      error => {
        setTimeout(() => {
          this.snackBar.open("Network error: server is temporarily unavailable", "dismss", {
            panelClass: ["error"],
            verticalPosition: 'top'      
          });
        }); 
      }
    );
  }

}
