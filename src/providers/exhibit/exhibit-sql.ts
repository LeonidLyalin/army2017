import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {BaseSql} from "../base-sql";
import {ExhibitApiService} from "../../providers/exhibit/exhibit-api-service";

/*
 Generated class for the exhibitSql provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */



export interface exhibitRus {
  id: string;
  name_rus: string;
  name_rus_upper: string;
  place_name: string;

  place: string;
  format: string;

  contact: string;

  thematic_exhibit: string;
  organizer: string;

  date_event: string;
  time_beg: string;
  time_end: string;


}

export interface exhibit extends exhibitRus {

  name_eng: string;

  place_name_eng: string;


  format_eng: string;

  contact_eng: string;


  organizer_eng: string;





}

export interface ExhibitsSql extends exhibitRus{

  my_forum_id: string;
  place_name_place: string;
}



declare let window: any;

@Injectable()
export class ExhibitSql extends BaseSql{
  public text: string = "";
/*  public db = null;
  public arr = [];*/

  public api:ExhibitApiService;

  constructor(public http: Http) {
    super(http,'exhibit',[
      {name:"id", type:"text PRIMARY KEY"},
        {name:"name_place",type:"text"},
        {name:"coords", type:"text"},
        {name:"name_rus", type:"text"},
        {name:"purpose", type:"text"},
        {name:"characteristics", type:"text"},
        {name:"name_eng", type:"text"},
        {name:"purpose_eng", type:"text"},
        {name:"composition", type:"text"},
        {name:"characteristics_eng", type:"text"},
        {name:"map", type:"text"},
        {name:"name_map", type:"text"},
        {name:"place",type:"text"}]);






  }



addFromApi(){
  this.api=new ExhibitApiService(this.http);
  this.api.getExhibit().subscribe(res=>{
    let listApi=<exhibit[]>res;
    for (let i=0;i<listApi.length;i++){
   //   this.addItemexhibit(listApi[i]);
    }
  });
}
/*  addItemexhibit(exhibitSingle: exhibit) {
    return new Promise(resolve => {

      const InsertQuery = 'insert or replace into exhibit(' +
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
        'thematic_exhibit, ' +
        'organizer, ' +
        'organizer_eng, ' +
        'date_event, ' +
        'time_beg, ' +
        'time_end,' +
        'name_rus_upper' +
        ') values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ? )';
      this.db.executeSql(InsertQuery, [
        exhibitSingle.id,
        exhibitSingle.name_rus,
        exhibitSingle.name_eng,
        exhibitSingle.place_name,
        exhibitSingle.place_name_eng,
        exhibitSingle.place,
        exhibitSingle.format,
        exhibitSingle.format_eng,
        exhibitSingle.contact,
        exhibitSingle.contact_eng,
        exhibitSingle.thematic_exhibit,
        exhibitSingle.organizer,
        exhibitSingle.organizer_eng,
        exhibitSingle.date_event,
        exhibitSingle.time_beg,
        exhibitSingle.time_end,
        exhibitSingle.name_rus.toUpperCase()

      ], (r) => {
        //console.log('Inserted... Sucess..', parseInt(exhibitSingle.id));
        this.select().then(s => {
          resolve(true)
        });
      }, e => {
        //console.log('Inserted Error', e);
        resolve(false);
      })
    })
  }*/






}
