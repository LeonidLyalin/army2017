import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {BaseSql} from "../base-sql";
import {BaseApi} from "../../providers/base-api-service";

/*
 Generated class for the MapConferenceSql provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
declare let window: any;

export interface map {

  id: number,
  map: string,
  place_previous: string,

  name_map: string,
  name_rus: string,
  name_eng: string,
}

@Injectable()
export class MapSql extends BaseSql {

  public mapApi: BaseApi;

  constructor(public http: Http,) {
    super(http, 'map', [
      {name: 'id', type: 'text PRIMARY KEY'},
      {name: 'map', type: 'text'},
      {name: 'place_previous', type: 'text'},
      {name: "name_map", type: 'text'},
      {name: "name_rus", type: 'text'},
      {name: "name_eng", type: 'text'},
      {name: "width", type: 'text'},
      {name: "height", type: 'text'},
      {name: "map_left", type: 'text'},
      {name: "map_right", type: 'text'},
      {name: "map_up", type: 'text'},
      {name: "map_down", type: 'text'},
    ]);
    //console.log('Hello MapConferenceSql Provider');
    /*  this.mapApi= new BaseApi(http);
      this.mapApi.getApi(`map_list.php`).subscribe(res => {
        //console.log('res in MapSql constructor=', res);
        this.addItemList(<any>res);
      });*/


  }


  getMapOfConference(conferenceId) {
    //console.log('getMap for participant');
    return new Promise(res => {
      let query = 'select map from conference';
      query += ' where id=' + conferenceId;
      //console.log(query);
      this.db.executeSql(query, [], rs => {
        //console.log(rs);
        let list = rs.rows.item(0).map;
        //console.log(list);
        this.getMapList(list).then(rs => {
            //console.log("res after getMapList=", rs);
            res(rs);
          }
        )
      });

    });
  }

  getMapList(list: string) {
    return new Promise(res => {
      //console.log('get map list=', list);
      let thematic: string[];
      thematic = list.split(',');
      //console.log('an array=', thematic);
      let whereStr: string = ' where ';
      for (let i = 0; i < thematic.length; i++) {
        if (i > 0) whereStr += ' or ';
        whereStr += 'number=' + thematic[i];
      }
      //console.log("whereStr=", whereStr);
      let query = "SELECT * FROM map";
      query += ' ' + whereStr;
      //console.log(query);
      this.arr = [];
      this.db.executeSql(query, [], rs => {
        if (rs.rows.length > 0) {
          this.arr = [];
          for (let i = 0; i < rs.rows.length; i++) {
            this.arr.push(<map>rs.rows.item(i));
          }
        }
        res(this.arr);
      }, (e) => {
        //console.log('Sql Query Error', e);
      });
    })
  }

  /*  getParticipantForMap(thematic: string) {
      //console.log("getParticipantForMap");
      //console.log("thematic=", thematic);
      return new Promise(res => {
        let query = 'select a.id, a.name_rus, a.name_eng, a.desc_rus as desc, ' +
          'a.desc_eng, a.logo, a.address_rus, a.address_eng, a.phone, a.email, ' +
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
