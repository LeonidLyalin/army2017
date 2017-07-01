import {Injectable} from '@angular/core';
import {Http /*, Response*/} from '@angular/http';

import 'rxjs';


@Injectable()
export class PlaceApi {
  private baseUrl = 'http://army2017.ru/api';

  private place: any = {};


  constructor(public http: Http) {
    console.log('conferenceSingle api is created');
  }

  public userId:any;

  getPlace(name_map) {
    console.log('**about to make HTTP call for all');
    return this.http.get(`${this.baseUrl}/place_list.php`+`?NAME_MAP=`+name_map)
      .map(response => {
        this.place = response.json();
        console.log(this.place);
        return this.place;
      });
  }





}
