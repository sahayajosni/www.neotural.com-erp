import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Usermgt } from '../../../../core/common/_models/usermgt';

import { environment } from "src/environments/environment";

import { API_ENDPOINTS } from "./../usermgt.config";

@Injectable()
export class UserManagementService {
  constructor(private http: HttpClient) {}

  loadDepartment(pagination:number) {
    return this.http.get(`${environment.apiUrl}${API_ENDPOINTS.LOAD_DEPARTMENT}`);
    /* return this.http.get(
      `${environment.apiUrl}${API_ENDPOINTS.LOAD_DEPARTMENT}`.replace(
        "{param}",
        pagination.toString()
      )
    ); */
  }

  save(userArray: Array<any>){
    return this.http.post(
        `${environment.apiUrl}${API_ENDPOINTS.save}`,
        userArray
    );     
  }

  load() {
    return this.http.get(`${environment.apiUrl}${API_ENDPOINTS.load}`);
  }

  getMenu(menuCode: string){
    console.log("Menu Code -->" + menuCode);
    return this.http.get<Usermgt>(
      `${environment.apiUrl}${API_ENDPOINTS.getMenuName}`+'?menuCode='+menuCode);
  }

  getSubMenu(submenuCode: string){
    console.log("Sub Menu Code -->" + submenuCode);
    return this.http.get<Usermgt>(
      `${environment.apiUrl}${API_ENDPOINTS.getSubMenuName}`+'?submenuCode='+submenuCode);
  }

  remove(id: string) {
     return this.http.delete<Usermgt>(
       `${environment.apiUrl}${API_ENDPOINTS.removeUser}`+'?id='+id);
   }
 
}
