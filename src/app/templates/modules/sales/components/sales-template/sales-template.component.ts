import { Component, OnInit, OnDestroy, ViewChild ,ElementRef,Inject} from '@angular/core';
import { MatExpansionPanel, MatSnackBar, Sort } from "@angular/material";
import { SalesService } from '../../services/sales.service';
import * as _ from 'lodash';
import { Common } from "src/app/core/common/_models";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-sales-template',
  templateUrl: './sales-template.component.html',
  styleUrls: ['./sales-template.component.scss']
})
export class SalesTemplateComponent implements OnInit {
  
  model:any = {};
  invoiceList: any;
  btnlabel: any;
  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: string;
  company: Common = new Common();
  public div1 = false;

  constructor(
    private salesservice: SalesService,
    private snackBar: MatSnackBar,
    private _sanitizer: DomSanitizer,
  ) { 
       
  }
  

  ngOnInit() { 
    this.model.companyname = "";
    this.model.address = "";
    this.model.city = "";
    this.model.country = "";
    this.model.companylogo = "";
    this.getTemplateDetails();
  }
  
  getTemplateDetails(){
    this.model.templateType = "Sales Invoice";
    this.salesservice.getTemplateDetails(this.model.templateType).subscribe(
      (data) => {
        if(data == null){
          this.btnlabel = "Save";
        }else{
          this.company = data;
          this.btnlabel = "Update";
          this.model.companyname = this.company.companyname;
          this.model.address = this.company.address;
          this.model.city = this.company.city;
          this.model.country = this.company.country;
          this.model.companylogo = this.company.companylogo;
          if(this.model.companylogo!=undefined){
            this.div1 = true;
            this.isImageSaved = false;
          } 
        }
      },
      (error) => {
        setTimeout(() => {
          this.snackBar.open(
            "Network error: server is temporarily unavailable", "", {
              panelClass: ["error"],
              verticalPosition: "top",
            }
          );
        });
      }
    );
  }

  getImage(imgData) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(imgData);
  }

  addTemplateDetails(){
    if(this.cardImageBase64 == null || this.cardImageBase64 == ''){

    }else{
      this.model.companylogo=this.cardImageBase64;
    }
    this.salesservice.addTemplateDetails(this.model).subscribe(
      (respose) => {
          this.snackBar.open("Company details "+this.btnlabel+"d Successfully", "", {
              panelClass: ["success"],
              verticalPosition: "top",
            }
          );
        this.getTemplateDetails();
      },
      (error) => {
        setTimeout(() => {
          this.snackBar.open(
            "Network error: server is temporarily unavailable",
            "",
            {
              panelClass: ["error"],
              verticalPosition: "top",
            }
          );
        });
      }
    );
  }

  fileChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
        // Size Filter Bytes
        const max_size = 20971520;
        const allowed_types = ['image/png', 'image/jpeg'];
        const max_height = 1200;
        const max_width = 600;

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

}
