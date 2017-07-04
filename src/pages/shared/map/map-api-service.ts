import {Injectable} from '@angular/core';
import {Http /*, Response*/} from '@angular/http';

import 'rxjs';


@Injectable()
export class MapApi {
  private baseUrl = 'http://army2017.ru/api';

  private map: any = {};


  constructor(public http: Http) {
    console.log('conferenceSingle api is created');
  }

  public userId:any;

  getMap() {
    console.log('**about to make HTTP call for all');
    return this.http.get(`${this.baseUrl}/map_list.php`)
      .map(response => {
        this.map = response.json();
        console.log(this.map);
        return this.map;
      });
  }




}
