import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private _http: HttpClient) { }

  // api call based on bias param
  getData(bias?: string) {
    let url = 'http://localhost:8000';
    if (bias) {
      return this._http.get(`${url}/${bias}`);
    } else {
      return this._http.get(url);
    }
  }
}
