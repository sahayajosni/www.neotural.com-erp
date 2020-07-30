import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";

import { API_ENDPOINTS } from "./../usermgt.config";

@Injectable()
export class UserManagementService {
  constructor(private http: HttpClient) {}

  loadDepartment() {
    return this.http.get(`${environment.apiUrl}${API_ENDPOINTS.LOAD_DEPARTMENT}`);
  }

  save(userArray: Array<any>){
    return this.http.post(
        `${environment.apiUrl}${API_ENDPOINTS.save}`,
        userArray
    );     
  }
 
}
