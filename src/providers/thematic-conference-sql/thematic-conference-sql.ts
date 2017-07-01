import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {BaseSql} from "../base-sql";

/*
  Generated class for the ThematicConferenceSql provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
declare var window: any;
export interface thematicConference {
  id: number;
  name_rus: string;
  name_eng: string;
  number: string;

}

@Injectable()
export class ThematicConferenceSql extends BaseSql{
  //public text: string = "";
 /* public db = null;
  public arr = [];

  tableName='thematic_conference'*/

  constructor(public http: Http) {
    super(http,'thematic_conference',[
      {name:"id", type:"text PRIMARY KEY"    },
      {name:"name_rus", type:"text"    },
      {name:"name_eng", type:"text"    },
      {name:"number", type:"text"    },
      ]
    )
    console.log('Hello ThematicConferenceSql Provider');
    //this.openDb();
  }

/*  openDb() {
    this.db = window.sqlitePlugin.openDatabase({name: 'todo.db', location: 'default'});
    this.db.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS '+this.tableName+' (' +
        'id text PRIMARY KEY,' +
        'name_rus text,' +
        'name_eng text,' +
        'number text)'
      );
    }, (e) => {
      console.log('Transaction thematic_conference Error', e);
    }, () => {
      console.log('Created thematic_conference..');
    })
  }*/

/*  delThematic(id) {
    return new Promise(resolve => {
      var query = "DELETE FROM "+this.tableName+" WHERE id=?";
      this.db.executeSql(query, [id], (s) => {
        console.log('Delete from place Success...', s);

        resolve(true);

      }, (err) => {
        console.log('Deleting Error', err);
      });
    })
  }*/

/*
  checkThematicForId(id) {
    return new Promise(res => {
      let query = 'SELECT * FROM '+this.tableName+' WHERE id=' + id;
      this.db.executeSql(query, [], rs => {
        console.log("checkThematicForId(id)!!! id=", id, query);
        console.log(rs);
        console.log(rs.rows.length);
        if (rs.rows.length > 0) return res(true)
        else return res(false);

      });
    });
  }
*/
/*
  addItemThematic(thematicConference) {
    return new Promise(resolve => {
      var InsertQuery = 'insert or replace into '+this.tableName+' (' +
        'id, ' +
        'name_rus, ' +
        'name_eng, ' +
        'number ' +
        ') values (?, ?, ?, ?)';
      this.db.executeSql(InsertQuery, [thematicConference.id,
        thematicConference.name_rus,
        thematicConference.name_eng,
        thematicConference.number], (r) => {
        console.log('Inserted... Sucess..', thematicConference.id);
      }, e => {
        console.log('Inserted Error', e);
        resolve(false);
      })
    })
  }*/

/*  selectThematic() {
    return new Promise(res => {
      this.arr = [];
      let query = "SELECT * FROM "+this.tableName;
      this.db.executeSql(query, [], rs => {

        if (rs.rows.length > 0) {
          this.arr = [];
          for (var i = 0; i < rs.rows.length; i++) {
            this.arr.push(<thematicConference>rs.rows.item);
          }
          console.log("right after SELECT * FROM "+this.tableName,this.arr)
        }
        res(this.arr);
      }, (e) => {
        console.log('Sql Query Error', e);
      });
    })

  }*/

/*
  delAllThematic() {
    console.log('try to delete all thematic');
    return new Promise(resolve => {
      var query = "DELETE FROM "+this.tableName;
      this.db.executeSql(query, [], (s) => {
        console.log('Delete All Success...', s);

      }, (err) => {
        console.log('Deleting Error', err);
      });
    })

  }
*/

  getThematicOfConference(conferenceId) {
    console.log('getThematic for participant');
    return new Promise(res => {
      let query = 'select thematic_conference from conference';
      query += ' where id=' + conferenceId;
      console.log(query);
      this.db.executeSql(query, [], rs => {
        console.log(rs);
        let list = rs.rows.item(0).thematic_conference;
        console.log(list);
        this.getThematicList(list).then(rs => {
            console.log("res after getThematicList=", rs);
            res(rs);
          }
        )
      });

    });
  }

  getThematicList(list: string) {
    return new Promise(res => {
      console.log('get thematicConference list=', list);
      let thematic: string[];
      thematic = [];
      thematic = list.split(',');
      console.log('an array=', thematic);
      let whereStr: string = 'where ';
      for (let i = 0; i < thematic.length; i++) {
        if (i > 0) whereStr += ' or ';
        whereStr += 'id=' + thematic[i];
      }
      console.log("whereStr=", whereStr);
      let query = "SELECT * FROM "+this.tableName;
      query += ' ' + whereStr;
      console.log(query);
      this.arr = [];
      this.db.executeSql(query, [], rs => {
        if (rs.rows.length > 0) {
          this.arr = [];
          for (var i = 0; i < rs.rows.length; i++) {
            this.arr.push(<thematicConference>rs.rows.item(i));
          }
        }
        res(this.arr);
      }, (e) => {
        console.log('Sql Query Error', e);
      });
    })
  }

  getParticipantForThematic(thematic: string) {
    console.log("getParticipantForThematic");
    console.log("thematic=", thematic);
    return new Promise(res => {
      let query = 'select a.id, a.name_rus, a.name_eng, a.desc_rus, ' +
        'a.desc_eng, a.logo, a.address_rus, a.address_eng, a.phone, a.email, ' +
        'a.www, b.id as my_forum_id, c.name_rus as place_name ' +
        'from participant a left join myforum b on a.id=b.my_id left join place c on a.place=c.id ' +
        'where a.thematic like "' + thematic + ',%" or a.thematic like "%,' + thematic + ',%" or a.thematic like "%,' + thematic + '" or a.thematic="' + thematic + '"';
      console.log(query);
      this.db.executeSql(query, [], rs => {
        this.arr = [];
        if (rs.rows.length > 0) {
          for (var i = 0; i < rs.rows.length; i++) {
            this.arr.push({
              id: rs.rows.item(i).id,
              name_rus: rs.rows.item(i).name_rus,
              name_eng: rs.rows.item(i).name_eng,
              desc_rus: rs.rows.item(i).desc_rus,
              desc_eng: rs.rows.item(i).desc_eng,
              address_rus: rs.rows.item(i).address_rus,
              address_eng: rs.rows.item(i).address_eng,
              phone: rs.rows.item(i).phone,
              email: rs.rows.item(i).email,
              www: rs.rows.item(i).www,
              logo: rs.rows.item(i).logo,
              place_name: rs.rows.item(i).place_name,
              my_forum_id: rs.rows.item(i).my_forum_id,
            });
          }
        }
        res(this.arr);
      }, (e) => {
        console.log('Sql Query Error', e);
      });
    })
  }
}


