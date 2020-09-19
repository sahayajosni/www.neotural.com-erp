import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";

import { API_ENDPOINTS } from "./../reports.config";

@Injectable()
export class ReportService {
  constructor(private http: HttpClient) {}

  loadEmployee(pagination:number) {
    return this.http.get(`${environment.apiUrl}${API_ENDPOINTS.loadEmployee}`);
    /* return this.http.get(
      `${environment.apiUrl}${API_ENDPOINTS.loadEmployee}`.replace(
        "{param}",
        pagination.toString()
      )
    ); */
  }

  load(data: any) {
    return this.http.post(
      `${environment.apiUrl}${API_ENDPOINTS.LOADDAILYREPORT}`,
      data
    )
  } 


}
