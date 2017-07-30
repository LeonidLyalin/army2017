import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';



import {BaseSql} from "../base-sql";


/*
 Generated class for the ThematicSql provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
export interface thematic {
  id: string,
  name_rus: string,
  name_eng: string,
  number: string
}


declare let window: any;
@Injectable()
export class FilterSql extends BaseSql {

//@TODO Why ThematicConferenceApi and not ThematicApi? Why Conference?
  constructor(public http: Http, tableName:string) {

    super(http, tableName);
    console.log('Hello ThematicSql Provider');


    this.countTable().then(res => {
      console.log("after count table", res);
    })
  }


}
