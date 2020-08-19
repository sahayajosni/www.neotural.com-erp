import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { InteractionService } from './../../common/_services/interaction.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../common/_services';
import {Observable, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';


let indexDataList = ['test','alex'];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private listener: Subscription;
  searchText:string;
  showMenu = false;
  public indexresponselist: any;
  public indexData = ['add-purchaseorder', 'add-salesorder', 'create-sales invoice',  
  'create-purchase invoice', 'add-new employee', 
  'stock', 'accounts', 'reports', 'add-new customer', 'view-employee', 'sales-report', 'sales-invoice-reports', 'sales-order-report', 'Louisiana', 'Maine',
  'find-employee', 'accounts', 'view-category', 'view-items', 'add-items', 'add-product', 'view-product', 'stock-report',
  'add-category', 'add-unit', 'view-unit', 'employee-daily-report', 'item-report', 'item-add'
];

  public model: any;
  
  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  formatter = (result: string) => result.toUpperCase();

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.indexData.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
   )

    
  @HostListener('document:click', ['$event']) closeNaviOnOutClick(event) {

    this.optionListToggle(false);
    
    if (event.target && event.target.classList.contains('header-menu')){
      return;
    }
    if (event.target && event.target.classList.contains('navi-link-deduct')) {
      return;
    }
    if (event.target && event.target.classList.contains('child-shuffle')) {
      return;
    }
    
    this.interactionService.toggleSideNavi(false);
  }
  
  constructor(private authenticationService:AuthenticationService,
    private router: Router,private interactionService: InteractionService) { }
  ngOnInit() {
    this.loadIndexValue();
    // this.listener = this.authenticationService.loadIndex().subscribe(
    //   data => {         
    //    this.indexresponselist = data;
    //    for (var i in this.indexresponselist) {
    //     this.indexData.push(this.indexresponselist[i].value);     
    //   }
    //  console.log("Index list size-->"+this.indexData.length);
    //   },
    //   error => {
  
    //   }
    // );
   }
   loadIndexValue(){
     console.log("Indexload is getting called..");
     this.authenticationService.loadIndex().subscribe(
      data => {         
       this.indexresponselist = data;
       for (var i in this.indexresponselist) {
        this.indexData.push(this.indexresponselist[i].value);     
      }
     console.log("Index list size-->"+this.indexData.length);
      },
      error => {
  
      }
    );
   
   }
  toggleSideNavi() {
    this.interactionService.toggleSideNavi();
  }

  action(){
  }
  optionListToggle(value) {
    this.showMenu = value;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
