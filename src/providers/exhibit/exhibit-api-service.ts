import {Injectable} from '@angular/core';
import {Http /*, Response*/} from '@angular/http';

import 'rxjs';
import {BaseApi} from "../base-api-service";


@Injectable()
export class ExhibitApiService extends BaseApi{
//  private baseUrl = 'http://army2017.ru/api';

  private conference: any = {};


  constructor(public http: Http) {
    super(http);
    //console.log('conferenceSingle api is created');
  }

  public userId:any;

  getExhibit() {
    //console.log('**about to make HTTP call for all');
    return this.http.get(this.baseUrlApi+'conference_list.php')
      .map(response => {
        this.conference = response.json();
        //console.log("after API");
        //console.log(this.conference);
        return this.conference;
      });
  }




}
