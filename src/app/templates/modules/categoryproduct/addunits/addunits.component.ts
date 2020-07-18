import { Router } from '@angular/router';
import { MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { CategoryproductService } from '../services/categoryproduct.service';
import { Component, OnInit, Inject,Optional,Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

// categoryeditdelete end
export interface UsersData {
  id: number;
  unitname: string;
  unitsymbol: string;
  quantityname: string;
  quantitysymbol: string;
  dimensionsymbol: string;
  //unitsymbol: string;
  //desc:string;
}


@Component({
  selector: 'app-addunits',
  templateUrl: './addunits.component.html',
  styleUrls: ['./addunits.component.scss']
})
export class AddunitsComponent implements OnInit {
  model: any = {};
  local_data:any;
  showbackbtn:boolean;
  btnsave:string;
  @Input() fromParent: UsersData;

  constructor(
    private router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UsersData,
    private catprodservice: CategoryproductService,
    private snackBar: MatSnackBar,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) { 
    /* console.log(data);
    this.local_data = {...data};
    this.model.id=this.local_data.id;
    this.model.unitname=this.local_data.unitname;
    this.model.unitsymbol=this.local_data.unitsymbol;
    this.model.quantityname=this.local_data.quantityname;
    this.model.quantitysymbol=this.local_data.quantitysymbol;
    this.model.dimensionsymbol=this.local_data.dimensionsymbol;    
    if(this.local_data.id!=null){
      this.showbackbtn=false;
      this.btnsave="Update";
    }else{
      this.showbackbtn=true;
      this.btnsave="Save";
    } */
  }

  ngOnInit() {  
    if(this.fromParent.id!=null){
      this.showbackbtn = false;
      this.btnsave = "Update";

      this.model.id=this.fromParent.id;
      this.model.unitname=this.fromParent.unitname;
      this.model.unitsymbol=this.fromParent.unitsymbol;
      this.model.quantityname=this.fromParent.quantityname;
      this.model.quantitysymbol=this.fromParent.quantitysymbol;
      this.model.dimensionsymbol=this.fromParent.dimensionsymbol;  
    }else{
      this.showbackbtn = false;
      this.btnsave = "Save";
    }
  }

  unitClose(){
    this.router.navigate(["category-and-product/units"]);
  }

  addUnit(btnsave:string) {
    if(btnsave == "Save"){
      this.saveUnit();
    }else if(btnsave == "Update"){
      this.updateUnit();
    }
  }
  
  saveUnit(){
    console.log(this.model.unitname);
    console.log(this.model.unitsymbol);
    console.log(this.model.quantityname);
    console.log(this.model.quantitysymbol);
    console.log(this.model.dimensionsymbol);
    this.catprodservice.saveUnit(this.model)
      .subscribe(
        data => {
          setTimeout(() => {
            this.snackBar.open("Unit Saved Successfully", "", {
              panelClass: ["success"],
              verticalPosition: 'top'      
            });
          });
          this.modalService.dismissAll();
          this.unitClose();
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

  updateUnit(){
    console.log(this.model.unitname);
    console.log(this.model.unitsymbol);
    console.log(this.model.quantityname);
    console.log(this.model.quantitysymbol);
    console.log(this.model.dimensionsymbol);
    this.catprodservice.saveUnit(this.model)
      .subscribe(
        data => {
          this.modalService.dismissAll();
          setTimeout(() => {
            this.snackBar.open("Unit Updated Successfully", "", {
              panelClass: ["success"],
              verticalPosition: 'top'      
            });
          });
          this.unitClose();
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
