import {Injectable} from '@angular/core';
import {Http /*, Response*/} from '@angular/http';

import 'rxjs';
import {BaseApi} from "../base-api-service";


@Injectable()
export class PlaceApi extends BaseApi{
  //private baseUrl = 'http://army2017.ru/api';

  private place: any = {};


  constructor(public http: Http) {
    super(http);
    //console.log('conferenceSingle api is created');
  }
  public userId:any;

  getPlace(name_map) {
    //console.log('**about to make HTTP call for all');
    return this.http.get(this.baseUrlApi+'/place_list.php?NAME_MAP='+name_map)
      .map(response => {
        this.place = response.json();
        //console.log(this.place);
        return this.place;
      });
  }





}
