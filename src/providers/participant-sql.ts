import {Injectable} from '@angular/core';
import {BaseSql} from "./base-sql";
import {Http} from "@angular/http";
/*
 Generated class for the Sqlite provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
export interface participant {
  id: string;
  name_rus: string;
  name_eng: string;
  desc_rus: string;
  desc_eng: string;
  logo: string;
  country_rus: string;
  country_eng: string;
  address_rus: string;
  address_eng: string;
  phone: string;
  email: string;
  www: string;
  place: string;
  thematic: string
}

declare let window: any;
@Injectable()

export class ParticipantSql extends BaseSql{
  public text: string = "";
/*  public db = null;
  public arr = [];*/

  constructor(public http: Http) {
    super(http,'participant',[
      {name:"id", type:"text PRIMARY KEY"},
      {name:"name_rus", type:"text"},
      {name:"name_eng", type:"text"},
      {name:"desc_rus", type:"text"},
      {name:"desc_eng", type:"text"},
      {name:"logo text,' ", type:"text"},
      {name:"country_rus", type:"text"},
      {name:"country_eng", type:"text"},
      {name:"address_rus", type:"text"},
      {name:"address_eng", type:"text"},
      {name:"phone text", type:"text"},
      {name:"email text", type:"text"},
      {name:"www text", type:"text"},
      {name:"place text", type:"text"},
      {name:"'thematic text",type:"text"},
      {name:"name_rus_upper", type:"text"},
      ]
    );
    console.log('Hello ThematicConferenceSql Provider');
   /* this.openDb();*/
  }


  /**
   *
   * @param {participant} participantSingle
   * @returns {Promise<any>}
   */
  addItemParticipant(participantSingle: participant) {
    return new Promise(resolve => {
      let InsertQuery = 'insert or replace into participant(' +
        'id, ' +
        'name_rus, ' +
        'desc_rus, ' +
        'country_rus, ' +
        'address_rus,' +
        'name_eng, ' +
        'desc_eng, ' +
        'country_eng, ' +
        'address_eng, ' +
        'phone, ' +
        'email, ' +
        'www,' +
        'logo, ' +
        'place, ' +
        'thematic,' +
        'name_rus_upper) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,? )';
      this.db.executeSql(InsertQuery, [participantSingle.id,
        participantSingle.name_rus,
        participantSingle.desc_rus,
        participantSingle.country_rus,
        participantSingle.address_rus,
        participantSingle.name_eng,
        participantSingle.desc_eng,
        participantSingle.country_eng,
        participantSingle.address_eng,
        participantSingle.phone,
        participantSingle.email,
        participantSingle.www,
        participantSingle.logo,
        participantSingle.place,
        participantSingle.thematic,
        participantSingle.name_rus.toUpperCase()], (r) => {
        console.log('Inserted... Sucess..', parseInt(participantSingle.id));
        this.select().then(s => {
          resolve(true)
        });
      }, e => {
        console.log('Inserted Error', e);
        resolve(false);
      })
    })
  }






  //to Update any Item
  update(id, txt) {
    return new Promise(res => {
      let query = "UPDATE Todo SET todoItem=?  WHERE id=?";
      this.db.executeSql(query, [txt, id], (s) => {
        console.log('Update Success...', s);
        this.select().then(s => {
          res(true);
        });
      }, (err) => {
        console.log('Updating Error', err);
      });
    })

  }



}
