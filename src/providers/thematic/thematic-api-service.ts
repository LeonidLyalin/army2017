import {Injectable} from '@angular/core';
import {Http /*, Response*/} from '@angular/http';

import 'rxjs';
import {BaseApi} from "../../providers/base-api-service";


@Injectable()
export class ThematicApi extends BaseApi {
 // private baseUrl = 'http://army2017.ru/api';

  private thematic: any = {};


  constructor(public http: Http) {
    super(http);
    //console.log('conferenceSingle api is created');
  }

  public userId:any;

  getThematic() {
    //console.log('**about to make HTTP call for all');
    return this.http.get(`${this.baseUrlApi}/thematic_list.php`)
      .map(response => {
        this.thematic = response.json();
        //console.log(this.thematic);
        return this.thematic;
      });
  }




}
