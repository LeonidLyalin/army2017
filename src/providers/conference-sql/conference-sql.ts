import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {BaseSql} from "../base-sql";
import {ConferenceApi} from "./conference-api-service";

/*
 Generated class for the ConferenceSql provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */



export interface conferenceRus {
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

export interface conference extends conferenceRus {

  name_eng: string;

  place_name_eng: string;


  format_eng: string;

  contact_eng: string;


  organizer_eng: string;





}

export interface conferenceRusMyForum extends conferenceRus{

  my_forum_id: string;
  place_name_place: string;
}



declare let window: any;

@Injectable()
export class ConferenceSql extends BaseSql{
  public text: string = "";
  public db = null;
  public arr = [];

  public api:ConferenceApi;

  constructor(public http: Http) {
    super(http,'conference',[
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
/*    this.openDb();*/
  }



addFromApi(){
  this.api=new ConferenceApi(this.http);
  this.api.getConference().subscribe(res=>{
    let listApi=<conference[]>res;
    for (let i=0;i<listApi.length;i++){
      this.addItemConference(listApi[i]);
    }
  });
}
  addItemConference(conferenceSingle: conference) {
    return new Promise(resolve => {

      const InsertQuery = 'insert or replace into conference(' +
        'id, ' +
        'name_rus, ' +
        'name_eng, ' +
        'place_name, ' +
        'place_name_eng, ' +
        'place, ' +
        'format, ' +
        'format_eng, ' +
        'contact, ' +
        'contact_eng, ' +
        'thematic_conference, ' +
        'organizer, ' +
        'organizer_eng, ' +
        'date_event, ' +
        'time_beg, ' +
        'time_end,' +
        'name_rus_upper' +
        ') values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ? )';
      this.db.executeSql(InsertQuery, [
        conferenceSingle.id,
        conferenceSingle.name_rus,
        conferenceSingle.name_eng,
        conferenceSingle.place_name,
        conferenceSingle.place_name_eng,
        conferenceSingle.place,
        conferenceSingle.format,
        conferenceSingle.format_eng,
        conferenceSingle.contact,
        conferenceSingle.contact_eng,
        conferenceSingle.thematic_conference,
        conferenceSingle.organizer,
        conferenceSingle.organizer_eng,
        conferenceSingle.date_event,
        conferenceSingle.time_beg,
        conferenceSingle.time_end,
        conferenceSingle.name_rus.toUpperCase()

      ], (r) => {
        //console.log('Inserted... Sucess..', parseInt(conferenceSingle.id));
        this.select().then(s => {
          resolve(true)
        });
      }, e => {
        //console.log('Inserted Error', e);
        resolve(false);
      })
    })
  }






}
