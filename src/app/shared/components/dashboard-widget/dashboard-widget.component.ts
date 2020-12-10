import { Component, OnInit, Input } from "@angular/core";
import { WidgetData } from "./dashboard-widget.model";
import { SalesService } from "src/app/templates/modules/sales/services/sales.service";
import { PurchaseService } from "src/app/templates/modules/purchase/services/purchase.service";
import { FinanceService } from "src/app/templates/modules/finance/services/finance.service";

@Component({
  selector: "app-dashboard-widget",
  templateUrl: "./dashboard-widget.component.html",
  styleUrls: ["./dashboard-widget.component.scss"]
})
export class DashboardWidgetComponent implements OnInit {
  @Input() param: WidgetData;
  invoiceList: any = {};
  salesOrderList: any = {};
  purchaseOrderList: any = {};
  profitandLossList: any = {};
  model:any = {};
  pageNumber: number = 0;
  pageSize: number = 10

  constructor(
    private salesService: SalesService,
    private purchaseService: PurchaseService,
    private financeService: FinanceService
  ) {}

  ngOnInit() {
    this.model.totalCredit = 0;
    this.model.purchaseCount = 0;
    this.model.salesCount = 0;
    this.model.salesInvoiceCount = 0;
    this.getSalesCount();
    this.getSalesInvoiceCount();
    this.getPurchaseCount();
    this.getProfitLossCopunt();
  }

  getSalesInvoiceCount(){
    this.salesService.loadInvoice().subscribe(res => { 
      this.invoiceList = res;
      if(this.invoiceList.length > 0){
        for(let i=0; i<this.invoiceList.length; i++){
          this.model.salesInvoiceCount += this.invoiceList[i].qty;
        }
      }
    });
  }

  getSalesCount(){
    this.salesService.loadDashSO().subscribe(
    (res) => {
      this.salesOrderList = res;
      if(this.salesOrderList.length > 0){
        for(let i=0; i<this.salesOrderList.length; i++){
          this.model.salesCount += this.salesOrderList[i].qty;
        }
      }
    });
  }

  getPurchaseCount(){
    this.purchaseService.getPurchaseOrderLists(this.pageNumber, this.pageSize).subscribe(
    (res) => {
      this.purchaseOrderList = res;
      if(this.purchaseOrderList.length > 0){
        for(let i=0; i<this.purchaseOrderList.length; i++){
          this.model.purchaseCount += this.purchaseOrderList[i].qty;
        }
      }
    });
  }

  getProfitLossCopunt(){
    this.financeService.getProfitLoss().subscribe(
    (res) => {
      this.profitandLossList = res;
      if(this.profitandLossList.length > 0){
        for(let i=0; i<this.profitandLossList.length; i++){
          this.model.totalCredit += this.profitandLossList[i].credit;
        }
      }
    });
  }

}
