import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

import {BaseSql} from "./base-sql";

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
export class ThematicSql extends BaseSql {
  /* public text: string = "";
   public db = null;
   public arr = [];*/

  /*  public fileds = [
   {name: 'id', type: 'text'},
   {name: 'name_rus', type: 'text'},
   {name: 'name_eng', type: 'text'},
   {name: 'number', type: 'text'}
   ];*/

  /* tableName: string = 'thematic';*/

  constructor(public http: Http
              ) {

    super(http, 'thematic', [
      {name: 'id', type: 'text PRIMARY KEY'},
      {name: 'name_rus', type: 'text'},
      {name: 'name_eng', type: 'text'},
      {name: 'number', type: 'text'}
    ]);
    console.log('Hello ThematicSql Provider');
    //   this.openDb();
    this.countTable().then(res => {
      console.log("after count table", res);
    })
  }







  getThematicOfParticipant(participantId) {
    console.log('getThematic for participant');
    return new Promise(res => {
      let query = 'select thematic from participant';
      query += ' where id=' + participantId;
      console.log(query);
      this.db.executeSql(query, [], rs => {
        console.log(rs);
        let list = rs.rows.item(0).thematic;
        console.log(list);
        this.getThematicList(list).then(rs => {
            console.log("res after getThematicList=", rs);
            res(rs);
          }
        )
      });

    });
  }


  /*  getFieldFromTable(id, field, table) {
   console.log('get ' + field + ' for ' + table
   );
   return new Promise(res => {
   let query = 'select thematic from ' + table;
   query += ' where id=' + id;
   console.log(query);
   this.db.executeSql(query, [], rs => {
   console.log(rs);
   let list = rs.rows.item(0).thematic;
   console.log(list);
   this.getThematicList(list).then(rs => {
   console.log("res after getThematicList=", rs);
   res(rs);
   }
   )
   });

   });
   }*/
  /**
   * thematic can be a string of thematics separated with ','
   * @param list
   * @returns {Promise<T>}
   */

  getThematicList(list: string) {
    return new Promise(res => {
      console.log('get thematic list=', list);
      let thematic: string[];
      thematic = [];
      thematic = list.split(',');
      console.log('an array=', thematic);
      let whereStr: string = ' where ';
      for (let i = 0; i < thematic.length; i++) {
        if (i > 0) whereStr += ' or ';
        whereStr += 'number=' + thematic[i];
      }
      console.log("whereStr=", whereStr);
      let query = "SELECT * FROM thematic";
      query += ' ' + whereStr;
      console.log(query);
      this.arr = [];
      this.db.executeSql(query, [], rs => {
        if (rs.rows.length > 0) {

          for (let i = 0; i < rs.rows.length; i++) {
            this.arr.push(<thematic>rs.rows.item(i));
          }
        }
        res(this.arr);
      }, (e) => {
        console.log('Sql Query Error', e);
      });
    })
  }

  /**
   * Make a list of participants for a certain thematic
   * @param thematic
   * @returns {Promise<T>}
   */
  getParticipantForThematic(thematic: string) {
    console.log("getParticipantForThematic");
    console.log("thematic=", thematic);
    return new Promise(res => {
      let query = 'select a.id, a.name_rus, a.name_eng, a.desc_rus as desc, ' +
        'a.desc_eng as desc, a.logo, a.address_rus, a.address_eng, a.phone, a.email, ' +
        'a.www, b.id as my_forum_id, c.name_rus as place_name ' +
        'from participant a left join myforum b on a.id=b.my_id left join place c on a.place=c.id ' +
        ' where a.thematic like "' + thematic + ',%" or a.thematic like "%,' + thematic + ',%" or a.thematic like "%,' + thematic + '" or a.thematic="' + thematic + '"';
      console.log(query);
      this.db.executeSql(query, [], rs => {
        this.arr = [];
        if (rs.rows.length > 0) {
          for (let i = 0; i < rs.rows.length; i++) {
            this.arr.push(<any>rs.rows.item[i]);
          }

        }


        res(this.arr);
        (e) => {
          console.log('Sql Query Error', e);
        }
      });

    });
  }

}
