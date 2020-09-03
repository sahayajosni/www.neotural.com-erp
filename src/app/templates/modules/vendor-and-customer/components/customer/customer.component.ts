import {
  Component,
  OnInit,
  ViewChild,
  Input,
  SimpleChanges,
  OnChanges,
  AfterContentChecked
} from "@angular/core";

import {
  MatTableDataSource,
  MatPaginator,
  MatSnackBar
} from "@angular/material";
import { VendorAndCustomerDetailComponent } from "../vendor-and-customer-detail/vendor-and-customer-detail.component";
import { CustomerAddComponent } from "../customer-add/customer-add.component";
//import { Vendor } from "./vendor-and-customer-list.component.model";
import { VendorService } from "../../services/vendor.service";
import { CustomerService } from "../../services/customer.service";
import { Customer, Vendor } from "src/app/core/common/_models";
import { PrintDialogService } from "src/app/core/services/print-dialog/print-dialog.service";
import {MatDialog, MatDialogConfig} from "@angular/material";
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: "app-customer",
  templateUrl: "./customer.component.html",
  styleUrls: ["./customer.component.scss"],
  // providers: [NgbModalConfig, NgbModal]
})
export class CustomerComponent implements OnInit {
  @Input() tabChange: boolean = false;
  @Input() componentType: string;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  enable:boolean;

  // To get the child component reference after *ngIf
  private vendorDetail: VendorAndCustomerDetailComponent;
  @ViewChild(VendorAndCustomerDetailComponent, { static: false }) set content(
    content: VendorAndCustomerDetailComponent
  ) {
    setTimeout(() => {
      this.vendorDetail = content;
    }, 0);
  }
  dialogConfig = new MatDialogConfig();

  chosenId: any;
  showDetail: boolean;
  vendorListshow: boolean;
  customerListshow: boolean;
  customersDS: any;
  vendors: MatTableDataSource<Vendor>;
  vendor: Vendor;
  isEditMode: boolean;
  customers: MatTableDataSource<Customer>;
  customer: Customer;
  button:string;

  imageError:string;
  isImageSaved:boolean;
  cardImageBase64: string;
  model: any = {};
  btnname:string;
  name:string;
  public div1 = false;
  dialogTxt:string;

  customerList: any = {};

  constructor(
    private vendorService: VendorService,
    private customerService: CustomerService,
    private snackBar: MatSnackBar,
    private printDialogService: PrintDialogService,
    private dialog: MatDialog,
    private _sanitizer: DomSanitizer,
    config: NgbModalConfig, private modalService: NgbModal,
    private SpinnerService: NgxSpinnerService,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.SpinnerService.show();  
    this.getAllCustomerDetails();
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes.tabChange && changes.componentType.currentValue) {
  //     this.showDetail = false;
  //     if (changes.componentType.currentValue === "Vendor") {
  //       this.getAllVendorDetails();
  //       this.vendorListshow = true;
  //       this.customerListshow = false;
  //     } else {
  //       this.getAllCustomerDetails();
  //       this.customerListshow = true;
  //       this.vendorListshow = false;
  //     }
  //     if (this.vendors) {
  //       this.vendors.paginator = this.paginator;
  //     }
  //   }
  // }

  getAllCustomerDetails() {
    console.log("getAllCustomerDetails");
    this.customerService.load().subscribe(
      (res) => {
        this.customersDS = res;
        this.customerList = this.customersDS;
        this.SpinnerService.hide();
        if(this.customersDS.length > 0){
          this.enable = true;
        }else {
          this.enable = false;
        }
       // this.customers = new MatTableDataSource(this.customersDS);
       // this.customers.paginator = this.paginator;
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

  addCustomer(id:string,custcode:string,customerName:string,country:string,address:string,
    email:string,city:string,phoneNumber:string,customerbase64:string){

    const modalRef = this.modalService.open(CustomerAddComponent, { windowClass: 'vendor-class'});
   
    if (id !== null) {
      this.button = "Update";
    } else {
      this.button = "Add";
    }
    let data = { dialogText: this.button, id: id, custcode: custcode, 
      customerName: customerName, country: country, email: email, address: address,
      city: city, phoneNumber: phoneNumber, customerbase64: customerbase64 }

    modalRef.componentInstance.fromParent = data;
    modalRef.result.then((result) => {
      //this.getAllCustomerDetails();
    }, (reason) => {
      this.getAllCustomerDetails();
    }); 


   
    /* let data: any;
    if (id !== null) {
      this.button = "Update";
    } else {
      this.button = "Add";
    }
    data = { dialogText: this.button, id: id, custcode: custcode, 
      customerName: customerName, country: country, email: email, address: address,
      city: city, phoneNumber: phoneNumber, customerbase64: customerbase64 };

    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.position = {
      'top': '1000',
      left: '100'
    };
    let dialogRef = this.dialog.open(CustomerAddComponent,{
      panelClass: 'addcustomer',
      data: data,
      disableClose: true,
      //hasBackdrop: true
    })
    dialogRef.backdropClick().subscribe(result => {
      this.getAllCustomerDetails();
    });                
    dialogRef.afterClosed().subscribe(result => {
      this.getAllCustomerDetails();
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
    this.model.customerbase64 = this.cardImageBase64;
    if(this.model.id !== null){
      this.dialogTxt = "Updated";  
    }else {
      this.dialogTxt = "Added";  
    }
    this.customerService.save(this.model)
    .subscribe(
      data => {
        setTimeout(() => {
          this.snackBar.open("Customer " +this.dialogTxt+ " Successfully", "", {
            panelClass: ["success"],
            verticalPosition: 'top'      
          });
        });
        this.modalService.dismissAll();
        this.getAllCustomerDetails();
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
    this.model.customerName = '';
    this.model.address = '';
    this.model.phoneNumber = '';
    this.model.mobileNumber = '';
    this.model.email = '';
    this.model.country = '';
    this.model.city = '';
  }


  editCustomer(id:string,custcode:string,customerName:string,country:string,address:string,
    email:string,city:string,phoneNumber:string,customerbase64:string,customer) {
      this.model.id = id;
      this.model.custcode = custcode;
      this.model.customerName = customerName;
      this.model.country = country;
      this.model.address = address;
      this.model.email = email;
      this.model.city = city;
      this.model.phoneNumber = phoneNumber;
      this.model.customerbase64 = customerbase64;
      this.btnname = "Update";
      if(this.model.customerbase64!=undefined){
        this.div1 = true;
        this.isImageSaved = false;
      }   
      this.modalService.open(customer, { windowClass: 'customer-class'});
  }

  toggleVendorDetailView(code?, edit?) {
    this.showDetail = !this.showDetail;
    this.vendor = undefined;
    this.chosenId = code;
    this.isEditMode = edit;
    let assignValue = '';
    if (code && !edit) {
      assignValue = 'viewCustomer';
    } else {
      assignValue = edit ? 'Customer':'addCustomer';
    }
    this.customerService.getComponentType(assignValue);
   }

  deleteVendorCustomer(code: string) {
    console.log("code -->" + code);
    this.customerService.remove(code).subscribe(
      data => {
        this.customer = data;
        setTimeout(() => {
          this.snackBar.open("Customer is deleted successfully", "", {
            panelClass: ["success"],
            verticalPosition: "top"
          });
        });
        this.getAllCustomerDetails();
      },
      error => {
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

  backNavigation() {
    // if (this.vendorListshow == true) {
    //   this.getAllVendorDetails();
    // } else {
    //   this.getAllCustomerDetails();
    // }
    this.getAllCustomerDetails();
    this.showDetail = false;
  }

  applyFilter(filterValue: string) {
    if (this.vendorListshow == true) {
      this.vendors.filter = filterValue.trim().toLowerCase();
      if (this.vendors.paginator) {
        this.vendors.paginator.firstPage();
      }
    } else {
      this.customers.filter = filterValue.trim().toLowerCase();
      if (this.customers.paginator) {
        this.customers.paginator.firstPage();
      }
    }
    //this.vendors.filter = filterValue.trim().toLowerCase();
    //if (this.vendors.paginator) {
    //   this.vendors.paginator.firstPage();
    //  }
  }

  printPage(data) {
    this.printDialogService.openDialog(data);
  }

  onSearchChange(searchValue: string): void {  
    console.log(searchValue);
    this.customersDS = this.customerList.filter(customer =>
    customer.customerName.toLowerCase().indexOf(searchValue.toLowerCase()) !==-1)
  }
}
