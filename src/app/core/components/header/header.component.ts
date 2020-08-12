import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { InteractionService } from './../../common/_services/interaction.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../common/_services';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

const states = ['add-purchase', 'add-sales order', 'create sales invoice',  
  'name: alex phone: 11111 email:test@gmail.com - customer', 'name: magin - vendor', 
  'stock', 'accounts', 'reports', 'employee-add', 'employee-view', 'sales-report', 'sales-invoice-reports', 'sales-order-report', 'Louisiana', 'Maine',
  'find-employee', 'accounts', 'view-category', 'view-items', 'add-items', 'add-product', 'view-product', 'stock-report',
  'add-category', 'unit-view', 'unit-add', 'employee-daily-report', 'item-report', 'item-add'
];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  searchText:string;
  showMenu = false;
  public states : any;
  public model: any;

  // formatter = (result: string) => result.toUpperCase();

  // search = (text$: Observable<string>) =>
  //   text$.pipe(
  //     debounceTime(200),
  //     distinctUntilChanged(),
  //     map(term => term === '' ? []
  //       : states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  //   )



    @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  formatter = (result: string) => result.toUpperCase();

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
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
  
  constructor(private authenticationService:AuthenticationService,private router: Router,private interactionService: InteractionService) { }

  ngOnInit() {
    this.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

   }

  toggleSideNavi() {
    this.interactionService.toggleSideNavi();
  }

  optionListToggle(value) {
    this.showMenu = value;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
