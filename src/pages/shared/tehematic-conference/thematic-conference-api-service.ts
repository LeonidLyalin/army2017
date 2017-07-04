import {Injectable} from '@angular/core';
import {Http /*, Response*/} from '@angular/http';

import 'rxjs';


@Injectable()
export class ThematicConferenceApi {
  private baseUrl = 'http://army2017.ru/api';

  private thematic: any = {};


  constructor(public http: Http) {
    console.log('conferenceSingle api is created');
  }

  public userId:any;

  getThematic() {
    console.log('**about to make HTTP call for all thematic_conference_list.php');
    return this.http.get(`${this.baseUrl}/thematic_conference_list.php`)
      .map(response => {
        this.thematic = response.json();
        console.log(this.thematic);
        return this.thematic;
      });
  }




}
