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
export interface country {
  id: number;
  name_rus: string;
  name_eng: string;


}

@Injectable()
export class CountrySql extends BaseSql{
  //public text: string = "";
 /* public db = null;
  public arr = [];

  tableName='thematic_conference'*/

  constructor(public http: Http) {
    super(http,'country',[
      {name:"id", type:"text PRIMARY KEY"    },
      {name:"country_rus", type:"text"    },
      {name:"country_eng", type:"text"    },

      ]
    );
    console.log('Hello CountrySql Provider');
    //this.openDb();
  }



/*  getThematicOfConference(conferenceId) {
    console.log('getThematic for participant');
    return new Promise(res => {
      let query = 'select thematic_conference from conference';
      query += ' where id=' + conferenceId;
      console.log(query);
      this.db.executeSql(query, [], rs => {
        console.log(rs);
        let list = rs.rows.item(0).thematic_conference;
        console.log(list);
        this.getTableList(list).then(rs => {
            console.log("res after getThematicList=", rs);
            res(rs);
          }
        )
      });

    });
  }*/

/*
  getThematicList(list: string) {
    return new Promise(res => {
      console.log('get thematicConference list=', list);
      let thematic: string[];
      thematic = [];
      thematic = list.split(',');
      console.log('an array=', thematic);
      let whereStr: string = ' where ';
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
            this.arr.push(<any>rs.rows.item(i));
          }
        }
        res(this.arr);
      }, (e) => {
        console.log('Sql Query Error', e);
      });
    })
  }
*/

  getParticipantForCountry(country: string) {
    console.log("getParticipantForThematic");
    console.log("country=", country);
    return new Promise(res => {
      let query = 'select a.id, a.name_rus, a.name_eng, a.desc_rus as desc, ' +
        'a.desc_eng as desc, a.logo, a.address_rus, a.address_eng, a.phone, a.email, ' +
        'a.www, b.id as my_forum_id, c.name_rus as country_name ' +
        'from participant a left join myforum b on a.id=b.my_id left join country c on a.place=c.id ' +
        ' where a.name_rus like "' + country + ',%" or a.country like "%,' + country + ',%" or a.country like "%,' + country + '" or a.country="' + country + '"';
      console.log(query);
      this.db.executeSql(query, [], rs => {
        this.arr = [];
        if (rs.rows.length > 0) {
          for (let i = 0; i < rs.rows.length; i++) {
            this.arr.push(<any> rs.rows.item(i));
              /*{
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
            });*/
          }
        }
        res(this.arr);
      }, (e) => {
        console.log('Sql Query Error', e);
      });
    })
  }
}


