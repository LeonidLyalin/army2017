import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
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

export interface conferenceRus {
  id: string;
  name_rus: string;

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


declare var window: any;
@Injectable()
export class ConferenceSql extends BaseSql{
  public text: string = "";
  public db = null;
  public arr = [];

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
      {name:"time_end", type:"text"}
    ]);
/*    this.openDb();*/
  }

  /**
   *
   * Open The Datebase
   */
  /*openDb() {
    this.db = window
      .sqlitePlugin
      .openDatabase({name: 'todo.db', location: 'default'});
    this.db.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS conference (' +
        'id text PRIMARY KEY, ' +
        'name_rus text,' +
        'name_eng text,' +
        'place_name text,' +
        'place_name_eng text,' +
        'place text,' +
        'format text,' +
        'format_eng text,' +
        'contact text,' +
        'contact_eng text,' +
        'thematic_conference text,' +
        'organizer text,' +
        'organizer_eng text,' +
        'date_event text,' +
        'time_beg text,' +
        'time_end text' + ');')
    }, (e) => {
      console.log('Transaction conference create Error', e);
    }, () => {
      console.log('Created conference OK..');
    })
  }*/

/*
  delConference(id) {
    return new Promise(resolve => {
      var query = "DELETE FROM conference WHERE id=?";
      this.db.executeSql(query, [id], (s) => {
        console.log('Delete Success...', s);

        resolve(true);

      }, (err) => {
        console.log('Deleting Error', err);
      });
    })

  }
*/

/*  checkConferenceForId(id) {
    return new Promise(res => {
      let query = 'SELECT * FROM conference WHERE id=' + id;
      this.db.executeSql(query, [], rs => {
        console.log("checkParticipantForId(id)!!! id=", id, query);
        console.log(rs);
        console.log(rs.rows.length);
        if (rs.rows.length > 0) return res(true)
        else return res(false);

      });
    });
  }*/


/*  checkTableForId(id, tableName) {
    return new Promise(res => {
      let query = 'SELECT * FROM ' + tableName + ' WHERE id=' + id;
      this.db.executeSql(query, [], rs => {
        console.log("checkParticipantForId(id)!!! id=", id, query);
        console.log(rs);
        console.log(rs.rows.length);
        if (rs.rows.length > 0) return res(true)
        else return res(false);

      });
    });
  }*/
/*

  delTableId(id, tableName) {
    return new Promise(resolve => {
      var query = "DELETE FROM " + tableName + " WHERE id=?";
      this.db.executeSql(query, [id], (s) => {
        console.log('Delete Success...', s);

        resolve(true);

      }, (err) => {
        console.log('Deleting Error', err);
      });
    })

  }
*/


  addItemConference(conferenceSingle: conference) {
    return new Promise(resolve => {

      var InsertQuery = 'insert or replace into conference(' +
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
        'time_end' +
        ') values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ? )';
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

      ], (r) => {
        console.log('Inserted... Sucess..', parseInt(conferenceSingle.id));
        this.select().then(s => {
          resolve(true)
        });
      }, e => {
        console.log('Inserted Error', e);
        resolve(false);
      })
    })
  }


/*
  selectConference() {
    return new Promise(res => {
      this.arr = [];
      let query = "SELECT * FROM conference";
      this.db.executeSql(query, [], rs => {
        if (rs.rows.length > 0) {
          this.arr=[];
          for (var i = 0; i < rs.rows.length; i++) {

            this.arr.push(<conference>rs.rows.item(i));

          }
        }
        res(this.arr);
      }, (e) => {
        console.log('Sql Query Error', e);
      });
    })

  }
*/

/*
  delAllConference() {
    console.log('try to delete all');
    return new Promise(resolve => {
      let query = "DELETE FROM conference";
      this.db.executeSql(query, [], (s) => {
        console.log('Delete All Success...', s);
        this.selectConference().then(s => {
          resolve(true);
        });
      }, (err) => {
        console.log('Deleting Error', err);
      });
    })

  }
*/
/*
  delAllTable(tableName) {
    console.log('try to delete all');
    return new Promise(resolve => {
      let query = "DELETE FROM "+tableName;
      this.db.executeSql(query, [], (s) => {
        console.log('Delete All Success...', s);
        this.selectConference().then(s => {
          resolve(true);
        });
      }, (err) => {
        console.log('Deleting Error', err);
      });
    })

  }*/
/*
  getMyForumForConference(id){
    return new Promise(res => {
        let userId=localStorage.getItem('userid');
        if (!userId) return (res(false))
        let query ="select id from myforum where my_iblock_id=14 and my_id="+id+' and user='+userId;
        console.log(query);
        this.db.executeSql(query, [], rs => {
          if (rs){
            res(rs.rows.item(0).id);
          }
          else res(false);
        });
      }
    );
  }*/



}
