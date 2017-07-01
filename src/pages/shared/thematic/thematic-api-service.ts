import {Injectable} from '@angular/core';
import {Http /*, Response*/} from '@angular/http';

import 'rxjs';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ThematicApi {
  private baseUrl = 'http://army2017.ru/api';

  private thematic: any = {};


  constructor(public http: Http) {
    console.log('conferenceSingle api is created');
  }

  public userId:any;

  getThematic() {
    console.log('**about to make HTTP call for all');
    return this.http.get(`${this.baseUrl}/thematic_list.php`)
      .map(response => {
        this.thematic = response.json();
        console.log(this.thematic);
        return this.thematic;
      });
  }




}