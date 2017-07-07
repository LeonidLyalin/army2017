import {Injectable} from '@angular/core';
import {BaseSql} from "./base-sql";
import {Http} from "@angular/http";
import {MyForumApi} from "../pages/shared/my-forum/my-forum-api";
/*
 Generated class for the Sqlite provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
declare var window: any;
@Injectable()

export class MyForumSQL extends BaseSql {
  // public text: string = "";
  /*
   public db = null;
   public arr = [];
   */

  constructor(public http: Http, public myForumApi: MyForumApi) {
    super(http, 'myforum', [
        {name: 'id', type: 'text PRIMARY KEY'},
        {name: 'user', type: 'text'},
        {name: 'my_iblock_id', type: 'text'},
        {name: 'my_id', type: 'text'}],
      'UNIQUE ("user", "my_id")'
    );
    console.log("create MyForumSQL");
    //  this.openDb();
  }



  /**
   * get only records which are in MyForum also
   * @returns {Promise<T>}
   */
  getRusParticipantMyForum(userId: string = '') {
    //@TODO add option - if userId='' then exit from the function
    console.log('getRusParticipantMyForum()');
    return new Promise(res => {
      this.arr = [];
      let query = 'select a.id, a.name_rus, a.desc_rus, a.country_rus, ' +
        'a.address_rus, a.phone, a.email, a.www, a.logo, a.place, b.id as my_forum_id,' +
        ' c.name_rus as place_name, c.name_rus as place_name_place, c.coords, c.name_map from participant a, myforum b ' +
        'left join place c on a.place=c.id where a.id=b.my_id';
      if (userId != '') {
        query = query + ' and  b.user=' + userId;
      }
      console.log(query);
      this.db.executeSql(query, [], rs => {
        console.log("right after executeSql");
        console.log(rs);
        console.log(rs.rows.item(0).id);
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

  getRusConferenceMyForum(userId: string = '') {
    //@TODO add option - if userId='' then exit from the function
    console.log('getRusParticipantMyForum()');
    return new Promise(res => {
      this.arr = [];
      let query = 'select a.id, a.name_rus, a.place_name, a.place, a.format, a.contact, ' +
        'a.thematic_conference, a.organizer, a.date_event,  a.time_beg, a.time_end,' +
        'b.id as my_forum_id, c.name_rus as place_name_place,c.coords, c.name_map ' +
        'from conference a, myforum b  left join place c on a.place=c.id where a.id=b.my_id'

      if (userId != '') {
        query += ' and  b.user=' + userId;
      }
      query += ' order by a.date_event, a.time_beg, a.time_end, a.id';
      console.log(query);
      this.db.executeSql(query, [], rs => {
        console.log("right after executeSql");
        console.log(rs);
        console.log(rs.rows.item(0).id);
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

  /**
   * get ALL records from participant and ADD a filed from MyForum
   * @returns {Promise<T>}
   */
  getRusParticipant(where: string = '') {
    console.log('getRusParticipantMyForum()');
    console.log(' where=' + where);
    return new Promise(res => {
      this.arr = [];
      let userId = localStorage.getItem('userid');
      let query = 'select a.id, a.name_rus, a.desc_rus, a.country_rus, a.address_rus, a.phone, a.email, a.www, a.logo, a.place,' +
        'b.id as my_forum_id, c.name_rus as place_name, c.name_rus as place_name_place, c.name_map, c.coords ' +
        'from participant a left join myforum b on a.id=b.my_id'
      if (userId) query += ' and b.user=' + userId;

      query += ' left join place c on a.place=c.id';
      console.log(query);
      if (where != '') query = query + where;

      this.db.executeSql(query, [], rs => {
        console.log("right after executeSql in getRusParticipant");
        console.log(rs);
        // console.log(rs.rows.item(0).id);
        this.arr = [];
        if (rs.rows.length) {
          for (var i = 0; i < rs.rows.length; i++) {
            this.arr.push(<any>rs.rows.item(i));

          }
        }
        console.log("this.arr=", this.arr);
        res(this.arr);
      }, (e) => {
        console.log('Sql Query Error', e);
      });
    })

  }


  getRusConference(where: string = '') {
    console.log('getRusParticipantMyForum()');
    console.log(' where=' + where);
    //  let whereStr = where;
    return new Promise(res => {
      this.arr = [];
      let userId = localStorage.getItem('userid');
      let query = 'select a.id, a.name_rus, a.place_name, a.place, a.format, a.contact, ' +
        'a.thematic_conference, a.organizer, a.date_event,  a.time_beg, a.time_end,' +
        'b.id as my_forum_id, c.name_rus as place_name_place, c.name_map, c.coords ' +
        'from conference a left join myforum b on a.id=b.my_id '
      if (userId != '') query += ' and b.user=' + userId;
      query += ' left join place c on a.place=c.id';
      if (where != '') query += where;


      query += ' order by a.date_event, a.time_beg, a.time_end, a.id';
      console.log(query);
      this.db.executeSql(query, [], rs => {
        console.log("right after executeSql in getRusConference");
        console.log(rs);
        this.arr = [];
        if (rs.rows.length) {
          for (var i = 0; i < rs.rows.length; i++) {
            this.arr.push(<any>rs.rows.item(i));

          }
        }
        console.log("this.arr=", this.arr);
        res(this.arr);
      }, (e) => {
        console.log('Sql Query Error', e);
      });
    })

  }

  /**
   *
   * @param where
   * @returns {any}
   */
  getRusConferenceReturn(where: string = '') {
    console.log('getRusConference()');
    console.log(' where=' + where);

    this.arr = [];
    let userId = localStorage.getItem('userid');
    let query = 'select a.id, a.name_rus, a.place_name, a.place, a.format, a.contact, ' +
      'a.thematic_conference, a.organizer, a.date_event,  a.time_beg, a.time_end,' +
      'b.id as my_forum_id, c.name_rus as place_name_place ' +
      'from conference a left join myforum b on a.id=b.my_id '
    if (userId) query += ' ' + ' and b.user=' + userId;

    query += ' left join place c on a.place=c.id';

    console.log(query);
    if (where != '') query += where;
    query += ' order by a.date_event, a.time_beg, a.time_end, a.id';
    return this.db.executeSql(query, [], rs => {
        console.log("right after executeSql in getRusConferenceReturn");
        console.log(rs);

      },
      /* console.log("this.arr=", this.arr);
       return(this.arr.);*/
      (e) => {
        console.log('Sql Query Error', e);

      });


  }



  //to Update any Item
  update(id, txt) {
    return new Promise(res => {
      var query = "UPDATE Todo SET todoItem=?  WHERE id=?";
      this
        .db
        .executeSql(query, [
          txt, id
        ], (s) => {
          console.log('Update Success...', s);
          this.select().then(s => {
            res(true);
          });
        }, (err) => {
          console.log('Updating Error', err);
        });
    })

  }

  /**
   *
   * @param id of deleted element
   * @returns {boolean}
   */
  delFromMyForum(id) {
    console.log("delFromMyForum id=", id);
    return new Promise(resolve => {
      this.myForumApi.delFromMyForum(id).subscribe(res => {
          if (res) {
            this.delId(id);
            resolve(true);
          }
          else (resolve(false))
        }
      );
    })
  }

  /**
   *
   * @param id of added element
   * @param iblockId of the infoblock in bitrix site
   * @param userId
   * @param elementList - there we will insert my_forum_id value directly to avoid waiting
   * @returns {Promise<T>}
   */
  addToMyForumSite(id, iblockId, userId, elementList: any = '') {
    console.log("elementList before inserting in addToMyForumSite =", elementList);
    console.log('add', id);
    let my_forum_id: any;
    return new Promise(rs => {
      this.checkForFieldValues(
        [{name: "my_id", value: id, type: ''},
          {name: "user", value: userId, type: ''}]).then(res => {
        console.log("this.checkForFieldValues, res=", res);
        if (res == 0) {
          return new Promise(resolve => {
            this.myForumApi.addToMyForumSite(iblockId, id).subscribe(data => {
              console.log("here are the results of adding through api");
              console.log(data);
              my_forum_id = data;
              if (elementList != '') {
                for (let conference of elementList) {
                  if (conference.id == id) conference.my_forum_id = data;

                }
              }
              console.log("elementList after inserting in addToMyForumSite =", elementList);
              console.log("my_forum_id=", my_forum_id);
              //@TODO make an api and prepare all parameters for insert
              //  this.sqlMyForum.addItemAndSelect(data, this.userId, this.iblockId, id).then(res => {
              this.addItem({id: data, user: userId, my_iblock_id: iblockId, my_id: id}).then(res => {
                console.log("this.addItem res=", res);
                resolve(my_forum_id);
              });
              resolve(0)
            });
          });
        }
        // res(my_forum_id);
      })
      rs(my_forum_id);
    });
  }


}
