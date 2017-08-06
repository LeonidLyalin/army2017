import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {BaseSql} from "../base-sql";

/*
  Generated class for the ThematicConferenceSql provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
declare let window: any;

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
  [{"name":"id", "type":"text PRIMARY KEY"},{"name":"name_rus", "type":"text"},{"name":"name_eng", "type":"text"}, {"name":"number", "type":"text"}]

  tableName='thematic_conference'*/

  constructor(public http: Http) {
    super(http,'thematic_conference',[
      {name:"id", type:"text PRIMARY KEY"    },
      {name:"name_rus", type:"text"    },
      {name:"name_eng", type:"text"    },
      {name:"number", type:"text"    },
      ]
    );
    //console.log('Hello ThematicConferenceSql Provider');
    //this.openDb();
  }





  getThematicOfConference(conferenceId) {
    //console.log('getThematic for participant');
    return new Promise(res => {
      let query = 'select thematic_conference from conference';
      query += ' where id=' + conferenceId;
      //console.log(query);
      this.db.executeSql(query, [], rs => {
        //console.log(rs);
        let list = rs.rows.item(0).thematic_conference;
        //console.log(list);
        this.getThematicList(list).then(rs => {
            //console.log("res after getThematicList=", rs);
            res(rs);
          }
        )
      });

    });
  }

  getThematicList(list: string) {
    return new Promise(res => {
      //console.log('get thematicConference list=', list);
      let thematic: string[];
      thematic = list.split(',');
      //console.log('an array=', thematic);
      let whereStr: string = ' where ';
      for (let i = 0; i < thematic.length; i++) {
        if (i > 0) whereStr += ' or ';
        whereStr += 'id=' + thematic[i];
      }
      //console.log("whereStr=", whereStr);
      let query = "SELECT * FROM "+this.tableName;
      query += ' ' + whereStr;
      //console.log(query);
      this.arr = [];
      this.db.executeSql(query, [], rs => {
        if (rs.rows.length > 0) {
          this.arr = [];
          for (let i = 0; i < rs.rows.length; i++) {
            this.arr.push(<thematicConference>rs.rows.item(i));
          }
        }
        res(this.arr);
      }, (e) => {
        //console.log('Sql Query Error', e);
      });
    })
  }

/*  getParticipantForThematic(thematic: string) {
    //console.log("getParticipantForThematic");
    //console.log("thematic=", thematic);
    return new Promise(res => {
      let query = 'select a.id, a.name_rus, a.name_eng, a.desc_rus as desc, ' +
        'a.desc_eng as desc, a.logo, a.address_rus, a.address_eng, a.phone, a.email, ' +
        'a.www, b.id as my_forum_id, c.name_rus as place_name ' +
        'from participant a left join myforum b on a.id=b.my_id left join place c on a.place=c.id ' +
        ' where a.thematic like "' + thematic + ',%" or a.thematic like "%,' + thematic + ',%" or a.thematic like "%,' + thematic + '" or a.thematic="' + thematic + '"';
      //console.log(query);
      this.db.executeSql(query, [], rs => {
        this.arr = [];
        if (rs.rows.length > 0) {
          for (var i = 0; i < rs.rows.length; i++) {
            this.arr.push(<any>rs.rows.item(i));


          }
        }
        res(this.arr);
      }, (e) => {
        //console.log('Sql Query Error', e);
      });
    })
  }*/
}


