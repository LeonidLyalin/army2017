import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {BaseSql} from "../base-sql";

/*
 Generated class for the PlaceSql provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */

export interface place {
  id: number;
  coords: number[];
  name_rus: string;
  name_eng: string;
  number_on_map: string;
  name_map: string;
  goto: string;
  shape: string;
}

declare let window: any;

@Injectable()


export class PlaceSql extends BaseSql {
  public text: string = "";
/*  public db = null;
  public arr = [];*/

  constructor(public http: Http) {
    super(http, 'place', [
        {name: "id", type: "text PRIMARY KEY"},
        {name: "name_rus", type: "text"},
        {name: "name_eng", type: "text"},
        {name: "coords", type: "text"},
        {name: "number_on_map", type: "text"},
        {name: "name_map", type: "text"},
        {name: "goto", type: "text"},
        {name: "shape", type: "text"},
      ]
    );
    console.log('Hello ThematicConferenceSql Provider');
    console.log('Hello PlaceSql Provider');
    /*    this.openDb();*/
  }

/*   /!**
   *
   * Open The Datebase
   *!/
  openDb() {
    this.db = window.sqlitePlugin.openDatabase({name: 'todo.db', location: 'default'});
    this.db.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS place (' +
        'id text PRIMARY KEY,' +
        'name_rus text,' +
        'name_eng text,' +
        'coords text,' +
        'number_on_map text,' +
        'name_map text,' +
        'goto text,' +
        'shape text)');
    }, (e) => {
      console.log('Transaction place create Error', e);
    }, () => {
      console.log('Created Place OK..');
    })
  }*/

/*  delPlace(id) {
    return new Promise(resolve => {
      var query = "DELETE FROM place WHERE id=?";
      this.db.executeSql(query, [id], (s) => {
        console.log('Delete from place Success...', s);

        resolve(true);

      }, (err) => {
        console.log('Deleting Error', err);
      });
    })

  }*/

/*  checkPlaceForId(id) {
    return new Promise(res => {
      let query = 'SELECT * FROM place WHERE id=' + id;
      this.db.executeSql(query, [], rs => {
        console.log("checkPlaceForId(id)!!! id=", id, query);
        console.log(rs);
        console.log(rs.rows.length);
        if (rs.rows.length > 0) return res(true)
        else return res(false);

      });
    });
  }*/

  addItemPlace(placeIns: place) {
    return new Promise(resolve => {
      let InsertQuery = 'insert or replace into place(' +
        'id, ' +
        'name_rus, ' +
        'name_eng, ' +
        'coords, ' +
        'number_on_map,' +
        'name_map, ' +
        'goto,' +
        'shape' +
        ') values (?, ?, ?, ?, ?, ?,?,?)';
      this.db.executeSql(InsertQuery, [
        placeIns.id,
        placeIns.name_rus,
        placeIns.name_eng,
        placeIns.coords,
        placeIns.number_on_map,
        placeIns.name_map,
        placeIns.goto,
        placeIns.shape
      ], (r) => {
        console.log('Inserted... Sucess..', placeIns.id);

      }, e => {
        console.log('Inserted Error', e);
        resolve(false);
      })
    })
  }


  addAllItemPlace(places) {

    for (let place of places) {
      this.addItemPlace(place);
    }
  }

  /**
   * select all places or certain place accordind id (idPalce
   * @param idPlace - id of the record in 'place' table
   * @returns {Promise<T>}
   */
/*  selectPlace(idPlace = '') {
    return new Promise(res => {
      this.arr = [];
      let query = "SELECT * FROM place";
      if (idPlace != '') query += ' where id=' + idPlace;
      this.db.executeSql(query, [], rs => {
        if (rs.rows.length > 0) {
          this.arr = [];
          for (var i = 0; i < rs.rows.length; i++) {
            console.log("<place>rs.rows.item(i)=", <place>rs.rows.item(i));
            this.arr.push((<place>rs.rows.item(i))
            );
          }
        }
        res(this.arr);
      }, (e) => {
        console.log('Sql Query Error', e);
      });
    })
  }*/

  /**
   * select all places for a certain map (nameMap)
   * @param nameMap
   * @returns {Promise<T>}
   */
/*  selectPlaceMap(nameMap: string) {
    console.log('selectPlaceMap');
    return new Promise(res => {
      this.arr = [];
      let query = "SELECT * FROM place";
      if (nameMap != '') query += ' where name_map="' + nameMap + '"';

      console.log(query);
      this.db.executeSql(query, [], rs => {
        if (rs.rows.length > 0) {

          for (var i = 0; i < rs.rows.length; i++) {
            console.log("<place>rs.rows.item(i)=", <place>rs.rows.item(i));
            this.arr.push(<place>rs.rows.item(i));
          }
        }
        console.log(this.arr);
        res(this.arr);
      }, (e) => {
        console.log('Sql Query Error', e);
      });
    })

  }*/

/*
  delAllPlace(name_map: string = '') {
    console.log('try to delete all places');
    return new Promise(resolve => {
      var query = "DELETE FROM place";
      if (name_map != '') query = query + ' where name_map="' + name_map + '"';
      console.log('query for delete');
      console.log(query);
      this.db.executeSql(query, [], (s) => {
        console.log('Delete All Success...', s);

      }, (err) => {
        console.log('Deleting Error', err);
      });
    })

  }*/

  /**
   * get Participant for certain place on the map
   * @param id of place
   * @returns {Promise<T>}
   */
  getPlaceParticipant(id) {
    console.log('try to find participant=', id);
    return new Promise(res => {

      this.arr = [];
      let query = 'SELECT * FROM participant WHERE place=' + id;
      console.log('query from getPlaceParticipant=', query);
      this.db.executeSql(query, [], rs => {
          console.log("select participant place=", id, query);
          console.log("rs=", rs);
          console.log("rs.rows.length=", rs.rows.length);
          if (rs.rows.length > 0) return res(<any>rs.rows.item(0));
            /*{
            id: rs.rows.item(0).id,
            name_rus: rs.rows.item(0).name_rus,
            desc_rus: rs.rows.item(0).desc_rus,
            country_rus: rs.rows.item(0).country_rus,
            address_rus: rs.rows.item(0).address_rus,
            name_eng: rs.rows.item(0).name_eng,
            desc_eng: rs.rows.item(0).desc_eng,
            country_eng: rs.rows.item(0).country_rus,
            address_eng: rs.rows.item(0).address_eng,
            phone: rs.rows.item(0).phone,
            email: rs.rows.item(0).email,
            www: rs.rows.item(0).www,
            logo: rs.rows.item(0).logo,
            place: rs.rows.item(0).place,
            thematic: rs.rows.item(0).thematic
          })*/


          else return res(false);

        }, (err) => {
          console.log('Select Error in getPlaceParticipant=', err);
        }
      );
    });

  }
}
