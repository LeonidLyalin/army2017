import {Injectable} from '@angular/core';
import {Http /*, Response*/} from '@angular/http';

import 'rxjs';


@Injectable()
export class ConferenceApi {
 // private baseUrl = 'http://army2017.ru/api';

  private list: any = {};


  constructor(public http: Http) {
    console.log('conferenceSingle api is created');
  }

//  public userId:any;

  getApi(apiUrl) {
    console.log('**about to make HTTP call for all');
    return this.http.get(apiUrl)
      .map(response => {
        this.list = response.json();
        console.log("after API");
        console.log(this.list);
        return this.list;
      });
  }




}
