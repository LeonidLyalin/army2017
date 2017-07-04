import {Injectable} from '@angular/core';
import {Http /*, Response*/} from '@angular/http';

import 'rxjs';


@Injectable()
export class ConferenceApi {
  private baseUrl = 'http://army2017.ru/api';

  private conference: any = {};


  constructor(public http: Http) {
    console.log('conferenceSingle api is created');
  }

  public userId:any;

  getConference() {
    console.log('**about to make HTTP call for all');
    return this.http.get(`${this.baseUrl}/conference_list.php`)
      .map(response => {
        this.conference = response.json();
        console.log("after API");
        console.log(this.conference);
        return this.conference;
      });
  }




}
