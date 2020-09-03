import { Component, OnInit, OnChanges, Input, ViewChild ,ElementRef,Inject,Optional } from '@angular/core';
import { Router } from '@angular/router';
import {MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import { MatExpansionPanel, MatSnackBar, Sort } from "@angular/material";
import { VendorService } from 'src/app/templates/modules/vendor-and-customer/services/vendor.service';
import { Category, Product } from '../../../../../core/common/_models';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VendorDetailsService } from 'src/app/templates/modules/vendor-and-customer/services/vendorDetails.service';

export interface UsersData {
  vendorcode: string;
  vendorName: string;
  prodheaderlabel: string;
  prodbtnlabel: string;
  btnlabel: string;
}

@Component({
  selector: 'app-addnewproduct',
  styleUrls: ['./addnewproduct.component.scss'],
  templateUrl: './addnewproduct.component.html', 
})

export class AddnewproductComponent implements OnInit {
  model: any = {};
  allcategorylist:any = {};
  categorylist:any = {};
  vendornamelist: any = {};
  allUnitlist:any = {};
  data: any = {};
  category:Category;
  product:Product;
  selectedFiles: any = {};
  allproducedittlist:any = {};

  isImageSaved0: boolean;
  isImageSaved1:boolean;
  isImageSaved2: boolean;
  isImageSaved3:boolean;
  
  imageError: string;
  inputproductcode:string;
  vendorcode:string;
  public div1 = false;
  public div2 = false;
  public div3 = false;
  public div4 = false;
  productImage: Array<any> = [];
  imageIndex0:boolean = false;
  imageIndex1:boolean = false;
  imageIndex2:boolean = false;
  imageIndex3:boolean = false;

  imgBase64Path:any;
  @Input() fromParent: UsersData;
  prodheaderlabel: string;
  prodbtnlabel: string;

  constructor(
    //public dialogRef: MatDialogRef<AddnewproductComponent>,
    private vendorservice: VendorService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router, config: NgbModalConfig, 
    private modalService: NgbModal,
    private _sanitizer: DomSanitizer,
    public activeModal: NgbActiveModal,
    private vendorDetailsService: VendorDetailsService

    ) { 
      
      this.categorylist="";
      this.vendorDetailsService.loadCategoryName()
      .subscribe(
        data => {
          this.categorylist = data;
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

     //this.vendorservice.load()
     this.vendorservice.loadvendornamecode()
     .subscribe(
        data => {
          this.vendornamelist = data;
          console.log("category name"+this.vendornamelist);
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
     
     //--load unitList
     let id = "all";
     this.allUnitlist="";
     this.vendorDetailsService.loadUnitList(id)
      .subscribe(
        data => {
          this.allUnitlist = data;
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
      this.model.sellingprice = 0;
  }

  ngOnInit() {
    this.prodheaderlabel = this.fromParent.prodheaderlabel;
    this.prodbtnlabel = this.fromParent.prodbtnlabel;

    this.model.vendorcode = this.fromParent.vendorcode;
    this.model.vendorName = this.fromParent.vendorName;
    this.model.vendor = this.fromParent.vendorName + '-' +this.model.vendorcode;
  }

  fileChangeEvent(fileInput: any,imageNumber:number) {
    console.log("Add Product");
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

      
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = rs => {
                const img_height = rs.currentTarget['height'];
                const img_width = rs.currentTarget['width'];

                console.log(img_height, img_width);


                if (img_height > max_height && img_width > max_width) {
                 
                    return false;
                } else {
                    this.imgBase64Path = e.target.result;
                   // this.cardImageBase64 = imgBase64Path;
                   if(this.productImage[imageNumber]!=null){
                     console.log("no value...");
                   }
                   if(imageNumber==0){
                      if(this.imageIndex1==false){
                        console.log("First Time");
                        this.productImage.push(this.imgBase64Path);
                        this.isImageSaved0 = true;
                        this.div1 = false;
                        this.imageIndex1=true;
                        console.log("First time Base 64 array value-->"+this.productImage[0]);
                      }
                      else{
                        console.log("else");
                        console.log("Second time Before update Base 64 array value-->"+this.productImage[0]);
                        console.log("Second time Base 64-->"+this.imgBase64Path);
                        this.productImage[0] = this.imgBase64Path;
                        this.isImageSaved0 = true;
                        console.log("Second time Base 64 array value-->"+this.productImage[0]);
                        //this.imageIndex1=true;
                      }
                  }
                  // Second Image
                  if(imageNumber==1){
                    if(this.imageIndex1==false){
                      console.log("First Time");
                      this.productImage.push(this.imgBase64Path);
                      this.isImageSaved1 = true;
                      this.imageIndex1=true;
                      console.log("First time Base 64 array value-->"+this.productImage[1]);
                    }
                    else{
                      console.log("else");
                      console.log("Second time Before update Base 64 array value-->"+this.productImage[1]);
                      console.log("Second time Base 64-->"+this.imgBase64Path);
                      this.productImage[1] = this.imgBase64Path;
                      this.isImageSaved1 = true;
                      console.log("Second time Base 64 array value-->"+this.productImage[1]);
                    }
                }

                // Third Image
                if(imageNumber==2){
                  if(this.imageIndex2==false){
                    console.log("First Time");
                    this.productImage.push(this.imgBase64Path);
                    this.isImageSaved2 = true;
                    this.imageIndex2=true;
                    console.log("First time Base 64 array value-->"+this.productImage[2]);
                  }
                  else{
                    console.log("else");
                    console.log("Third time Before update Base 64 array value-->"+this.productImage[2]);
                    console.log("Third time Base 64-->"+this.imgBase64Path);
                    this.productImage[2] = this.imgBase64Path;
                    this.isImageSaved2 = true;
                    console.log("Third time Base 64 array value-->"+this.productImage[2]);
                  }
              }

              // Fourth Image
              if(imageNumber==3){
                if(this.imageIndex3==false){
                  console.log("First Time");
                  this.productImage.push(this.imgBase64Path);
                  this.isImageSaved3 = true;
                  this.imageIndex3=true;
                  console.log("First time Base 64 array value-->"+this.productImage[1]);
                }
                else{
                  console.log("else");
                  console.log("Fourth time Before update Base 64 array value-->"+this.productImage[3]);
                  console.log("Fourth time Base 64-->"+this.imgBase64Path);
                  this.productImage[3] = this.imgBase64Path;
                  this.isImageSaved3 = true;
                  console.log("Fourth time Base 64 array value-->"+this.productImage[1]);
                }
              }    
            }
          };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  removeImage(i:number) {
    this.productImage[i]=null;
    if(i==0){
      this.isImageSaved0 = false;
    }
    if(i==1){
      this.isImageSaved1 = false;
    }
    if(i==2){
      this.isImageSaved2 = false;
    }
    if(i==3){
      this.isImageSaved3 = false;
    }
  }

  marginPrice:any;
  taxPrice:any;
  getSellingPrice(price:string,tax:string,margin:string){
    console.log("price-->"+price + "--- Tax --->"+tax+"-- Margin ---->"+margin);
    if(tax == null || tax == undefined){
      if(margin == null || tax == undefined){
        this.model.sellingprice = price;
      }else{
        this.marginPrice = Number.parseInt(price) * (Number.parseInt(margin)/100);
        this.model.sellingprice = Number.parseInt(price)+Number.parseInt(this.marginPrice);
      }
    }else if(margin == null || tax == undefined){
      if(tax == null || tax == undefined){
        this.model.sellingprice = price;
      }else{
        this.marginPrice = Number.parseInt(price) * (Number.parseInt(tax)/100);
        this.model.sellingprice = Number.parseInt(price)+Number.parseInt(this.marginPrice);
      }
    }else{
      this.marginPrice = Number.parseInt(price) * (Number.parseInt(margin)/100);
      this.taxPrice = Number.parseInt(price) * (Number.parseInt(tax)/100);
      this.model.sellingprice = Number.parseInt(price)+Number.parseInt(this.marginPrice)+Number.parseInt(this.taxPrice);
    }
  }

  saveNewProduct(prodbtnlabel: string){
      this.model.productImage = this.productImage;
      this.model.vendorcode = this.fromParent.vendorName+'-'+this.fromParent.vendorcode;
      this.model.productImage1 = this.productImage[0];
      console.log("Selling Price -->"+this.model.sellingprice);
      this.vendorDetailsService.productsave(this.model)
      .subscribe(
        data => {
          this.product = data; 
          setTimeout(() => {
            this.snackBar.open("Product saved Successfully", "", {
              panelClass: ["success"],
              verticalPosition: 'top'      
            });
          });
          this.model.sellingprice = 0;
          this.modalService.dismissAll();
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

  closeModal() {
    this.activeModal.close();
  }

}


