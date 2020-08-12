import { Component, OnInit, ViewChild ,ElementRef,Inject} from '@angular/core';
import { Purchase } from 'src/app/core/common/_models';
import { AlertService } from 'src/app/core/common/_services';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import { MatExpansionPanel, MatSnackBar, Sort } from "@angular/material";
import { PurchaseService } from '../../services/purchase.service';

@Component({
  selector: 'app-purchase-return',
  templateUrl: './purchase-return.component.html',
  styleUrls: ['./purchase-return.component.scss']
})
export class PurchaseReturnComponent implements OnInit {

  model: any ={};
  public poreturnList : any;
  dialogConfig = new MatDialogConfig();
  isDtInitialized:boolean = false;
  todayDate : Date = new Date();
  purchasereturnList: any = {};

  public returntable = false;

  fieldArray: Array<any> = [];
  returnarray: Array<any> = [];

  constructor(
    private purchaseService: PurchaseService,
    private dialog: MatDialog,
    private router: Router, 
    private alertService: AlertService
  ) {  
  

   }
  ngOnInit() {
    this.returnList();
  }

  returnList(){
    this.purchaseService.loadReturn()
      .subscribe(res => { 
        this.poreturnList = res;
        this.purchasereturnList = this.poreturnList;
        if(this.poreturnList.length == 0){
          this.returntable = false;
        }else{
          this.returntable = true;
        }
      },
      error => {
        setTimeout(() => {
          this.alertService.error("Network error: server is temporarily unavailable");
        }, 2000);
      }
    );
  }

  onSearchChange(searchValue: string): void {  
    console.log(searchValue);
    this.poreturnList = this.purchasereturnList.filter(poreturn =>
      poreturn.vendorname.toLowerCase().indexOf(searchValue.toLowerCase()) !==-1)
  }
  
}

