import {Injectable} from '@angular/core';
import {Http /*, Response*/} from '@angular/http';

import 'rxjs';


@Injectable()
export class BaseApi {
  public baseUrl = 'http://army2017.ru';
  public baseUrlApi;
  public baseUrlAjax;
  private result: any = {};


  constructor(public http: Http) {
    //console.log('new Base  api is created');
    this.baseUrlApi = this.baseUrl + '/api';
    this.baseUrlAjax = this.baseUrl + '/ajax';
  }

  //public userId:any;

  getApi(apiPhp) {
    //console.log('**about to make HTTP call for', apiPhp);


    return this.http.get(`${this.baseUrlApi}/` + apiPhp)
      .map(response => {
        this.result = response.json();
        //console.log("getApi result=", this.result);
        return this.result;
      });
  }


}
