import {
  Component,
  OnInit,
  ViewChild,
  Input,
  OnDestroy
} from "@angular/core";

import {
  MatTableDataSource,
  MatPaginator,
  MatSnackBar,
  MatDialog,
  MatDialogConfig
} from "@angular/material";
import { VendorAndCustomerDetailComponent } from "../vendor-and-customer-detail/vendor-and-customer-detail.component";
//import { Vendor } from "./vendor-and-customer-list.component.model";
import { VendorService } from "../../services/vendor.service";
import { CustomerService } from "../../services/customer.service";
import { Customer, Vendor } from "src/app/core/common/_models";
import { PrintDialogService } from "src/app/core/services/print-dialog/print-dialog.service";
import { VendorDetailsComponent } from './../vendor-details/vendor-details.component';
import { CustomerAddComponent } from './../customer-add/customer-add.component';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-vendor-and-customer-list",
  templateUrl: "./vendor-and-customer-list.component.html",
  styleUrls: ["./vendor-and-customer-list.component.scss"]
})
export class VendorAndCustomerListComponent implements OnInit, OnDestroy {

  dialogConfig = new MatDialogConfig();

  @Input() tabChange: boolean = false;
  @Input() componentType: string;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  // To get the child component reference after *ngIf
  private vendorDetail: VendorAndCustomerDetailComponent;
  @ViewChild(VendorAndCustomerDetailComponent, { static: false }) set content(
    content: VendorAndCustomerDetailComponent
  ) {
    setTimeout(() => {
      this.vendorDetail = content;
    }, 0);
  }

  chosenId: any;
  showDetail: boolean;
  vendorListshow: boolean;
  customerListshow: boolean;
  //vendorsDS: Vendor[];
  vendorsDS = [];
  customersDS: any = {};
  vendors: MatTableDataSource<Vendor>;
  vendor: Vendor;
  isEditMode: boolean;
  displayedColumns: string[] = [
    "vendorCode",
    "vendorName",
    "addeddate",
    "phone",
    "action"
  ];

  customers: MatTableDataSource<Customer>;
  customer: Customer;
  displayedColumns2: string[] = [
    "custcode",
    "customerName",
    "addeddate",
    "phoneNumber",
    "action"
  ];

  isSortCodeDesc: boolean = false;
  isSortCodeAsc: boolean = true;
  enable: boolean;

  imageError:string;
  isImageSaved:boolean;
  cardImageBase64: string;
  model: any = {};
  btnname:string;
  name:string;
  public div1 = false;
  dialogTxt:string;

  constructor(
    private vendorService: VendorService,
    private customerService: CustomerService,
    private snackBar: MatSnackBar,
    private printDialogService: PrintDialogService,
    private dialog: MatDialog,
    private _sanitizer: DomSanitizer,
    private SpinnerService: NgxSpinnerService,
    config: NgbModalConfig, private modalService: NgbModal,

  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.SpinnerService.show();  
    this.getAllVendorDetails();
  }
 
  ngOnDestroy() {
    this.snackBar.dismiss();
    (<HTMLElement>(
      document.querySelector(".mat-drawer-content")
    )).style.overflow = "auto";
  }

 /*
  removeScrollBar() {
    setTimeout(function () {
      (<HTMLElement>(
        document.querySelector(".mat-drawer-content")
      )).style.overflow = "inherit";
    }, 300);
  } */

  getAllVendorDetails() {
    console.log("getAllVendorDetails");
    this.vendorService.load().subscribe(
      (data: Vendor[]) => {
        this.vendorsDS = data;
        this.SpinnerService.hide();
        if(this.vendorsDS.length > 0) {
          this.enable = true;
        } else {
          this.enable = false;
          setTimeout(() => {
            this.snackBar.open("Vendor data is empty", "", {
              duration: undefined, // 5 mints
              panelClass: ["warning"],
              verticalPosition: "top",
              horizontalPosition: 'center'
            });
          });
        }
        this.vendors = new MatTableDataSource(this.vendorsDS);
        this.vendors.paginator = this.paginator;
      },
      error => {
        this.SpinnerService.hide();
        setTimeout(() => {
          this.snackBar.open(
            "Network error: server is temporarily unavailable",
            "",
            {
              panelClass: ["error"],
              verticalPosition: "top"
            }
          );
        });
      }
    );
  }

  sortByOrder(column: string, order: string) {
    if (column === "code" && order === "desc") {
      this.isSortCodeDesc = true;
      this.isSortCodeAsc = false;
      this.vendorsDS.sort((a, b) => b.vendorcode.localeCompare(a.vendorcode));
    } else if (column === "code" && order === "asc") {
      this.isSortCodeDesc = false;
      this.isSortCodeAsc = true;
      this.vendorsDS.sort((a, b) => a.vendorcode.localeCompare(b.vendorcode));
    } 
  }

  goToVendorDetails(item) {
    let dialogRef = this.dialog.open(VendorDetailsComponent, {
      panelClass: "vendorDetailsView",
      data: item
    });
    dialogRef.backdropClick().subscribe(result => {
      this.getAllVendorDetails();
    });  
    dialogRef.afterClosed().subscribe(result => {
      this.getAllVendorDetails();
    });
  }

  addVendor(vendor){
    this.btnname = "Add";

    const modalRef = this.modalService.open(CustomerAddComponent, { windowClass: 'vendor-class'});

    let data = { key: 'vendor' }

    modalRef.componentInstance.fromParent = data;
    modalRef.result.then((result) => {
      this.getAllVendorDetails();
    }, (reason) => {
      this.getAllVendorDetails();
    }); 

    /* if(this.snackBar.open) {
      this.snackBar.dismiss();
    }
    let data = {key:"vendor"};
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.position = {
      'top': '1000',
      left: '100'
    };
    this.dialog.open(CustomerAddComponent,{
      panelClass: 'addcustomer',
      data: data,
      disableClose: true,
     // hasBackdrop: true
    })
    .afterClosed().subscribe(result => {
      this.ngOnInit();
    }); */
  }

  getImage(imgData) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(imgData);
  }

  fileChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
        // Size Filter Bytes
        const max_size = 20971520;
        const allowed_types = ['image/png', 'image/jpeg'];
        const max_height = 15200;
        const max_width = 25600;

        if (fileInput.target.files[0].size > max_size) {
          this.imageError =
              'Maximum size allowed is ' + max_size / 1000 + 'Mb';
          return false;
        }

        if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
          this.imageError = 'Only Images are allowed ( JPG | PNG )';
          return false;
        }
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const image = new Image();
          image.src = e.target.result;
          image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];
          console.log(img_height, img_width);
          if (img_height > max_height && img_width > max_width) {
            this.imageError =
                'Maximum dimentions allowed ' +
                max_height +
                '*' +
                max_width +
                'px';
            return false;
          } else {
            const imgBase64Path = e.target.result;
            this.cardImageBase64 = imgBase64Path;
            if(this.cardImageBase64!=null){
              console.log("no value...");
            }
            this.isImageSaved = true;
          }
        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  removeImage() {
    this.cardImageBase64 = null;
    this.isImageSaved = false;
  }

  save(){
    this.model.vendorbase64 = this.cardImageBase64;
    this.vendorService.save(this.model)
    .subscribe(
      data => {
        setTimeout(() => {
          this.snackBar.open("Vendor created Successfully", "", {
            panelClass: ["success"],
            verticalPosition: 'top'      
          });
        });
        this.modalService.dismissAll();
        this.getAllVendorDetails();
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

  emptyFields() {
    this.model.vendorName = '';
    this.model.address = '';
    this.model.phoneNumber = '';
    this.model.mobileNumber = '';
    this.model.email = '';
    this.model.country = '';
    this.model.city = '';
  }

  removeVendor(vendorcode:string){
    console.log("Remove Vendor......");
    this.vendorService.remove(vendorcode)
    .subscribe(
      data => {
        setTimeout(() => {
          this.snackBar.open("Vendor Removed", "", {
            panelClass: ["success"],
            verticalPosition: 'top'      
          });
        });
        this.getAllVendorDetails();
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
