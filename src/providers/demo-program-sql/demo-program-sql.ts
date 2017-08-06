import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {BaseApi} from "../../providers/base-api-service";
import {BaseSql} from "../base-sql";

/*
 Generated class for the ConferenceSql provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */

/*
 id+
 name_rus+
 PLACE_NAME+
 NAME_ENG,+
 PLACE,+
 FORMAT+
 ,
 THEMATIC_CONFERENCE,+
 ORGANIZER,+


 DATE_EVENT,+
 TIME_BEG,+
 TIME_END,+
 CONTACT,+
 ORGANIZER_ENG,+
 CONTACT_ENG,+
 PLACE_NAME_ENG,+
 FORMAT_ENG*/

export interface demoProgramRus {
  id: string;
  name_rus: string;
  name_rus_upper: string;
  place_name: string;

  place: string;
  format: string;

  contact: string;

  thematic_conference: string;
  organizer: string;

  date_event: string;
  time_beg: string;
  time_end: string;


}

export interface demoProgram extends demoProgramRus {

  name_eng: string;

  place_name_eng: string;


  format_eng: string;

  contact_eng: string;


  organizer_eng: string;





}

export interface demoProgramRusMyForum extends demoProgramRus{

  my_forum_id: string;
  place_name_place: string;
}



declare let window: any;

@Injectable()
export class DemoProgramSql extends BaseSql{
  public text: string = "";


  public api:BaseApi;




  constructor(public http: Http) {

    super(http,'demo-program', [
      {name:"id", type:"text PRIMARY KEY"},
      {name:"name_rus", type:"text"},
      {name:"name_eng", type:"text"},
      {name:"place_name", type:"text"},
      {name:"place_name_eng", type:"text"},
      {name:"place", type:"text"},
      {name:"format", type:"text"},
      {name:"format_eng", type:"text"},
      {name:"contact", type:"text"},
      {name:"contact_eng", type:"text"},
      {name:"thematic_conference", type:"text"},
      {name:"organizer", type:"text"},
      {name:"organizer_eng", type:"text"},
      {name:"date_event", type:"text"},
      {name:"time_beg", type:"text"},
      {name:"time_end", type:"text"},
      {name:"name_rus_upper", type:"text"},
    ]);

  }



addFromApi(){
  this.api=new BaseApi(this.http);
  this.api.getApi(`http://army2017.ru/api/conference_list.php`).subscribe(res=>{
    let listApi=<demoProgram[]>res;
    for (let i=0;i<listApi.length;i++){
      this.addItem(listApi[i]);
    }
  });
}



}
