import {Injectable} from '@angular/core';
import {Http /*, Response*/} from '@angular/http';

import 'rxjs';


@Injectable()
export class BaseApi {
  private baseUrl = 'http://army2017.ru/api';

  private result: any = {};


  constructor(public http: Http) {
    console.log('conferenceSingle api is created');
  }

  //public userId:any;

  getApi(apiPhp) {
    console.log('**about to make HTTP call for all');
    return this.http.get(`${this.baseUrl}/`+apiPhp)
      .map(response => {
        this.result = response.json();
        console.log(this.result);
        return this.result;
      });
  }




}
