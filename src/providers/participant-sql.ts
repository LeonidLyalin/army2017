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

declare var window: any;
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

      ]
    )
    console.log('Hello ThematicConferenceSql Provider');
   /* this.openDb();*/
  }

  /**
   *
   * Open The Datebase
   */
/*
  openDb() {
    this.db = window
      .sqlitePlugin
      .openDatabase({name: 'todo.db', location: 'default'});
    this.db.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS participant (' +
        'id text PRIMARY KEY, ' +
        'name_rus text,' +
        'name_eng text,' +
        'desc_rus text,' +
        'desc_eng text,' +
        'logo text,' +
        'country_rus text,' +
        'country_eng text,' +
        'address_rus text,' +
        'address_eng text,' +
        'phone text,' +
        'email text,' +
        'www text,' +
        'place text,' +
        'thematic text,' +
        'name_rus_upper text)');
    }, (e) => {
      console.log('Transaction participant  Error', e);
    }, () => {
      console.log('Created participant OK..');
    })
  }
*/


/*  //to delete any Item
  delParticipant(id) {
    return new Promise(resolve => {
      var query = "DELETE FROM participant WHERE id=?";
      this.db.executeSql(query, [id], (s) => {
        console.log('Delete Success...', s);

        resolve(true);

      }, (err) => {
        console.log('Deleting Error', err);
      });
    })

  }*/

/*  checkParticipantForId(id) {
    return new Promise(res => {
      let query = 'SELECT * FROM participant WHERE id=' + id;
      this.db.executeSql(query, [], rs => {
        console.log("checkParticipantForId(id)!!! id=", id, query);
        console.log(rs);
        console.log(rs.rows.length);
        if (rs.rows.length > 0) return res(true)
        else return res(false);

      });
    });
  }*/


  /**
   *
   * @param addItem for adding: function
   */
  addItemParticipant(participantSingle: participant) {
    return new Promise(resolve => {
      var InsertQuery = 'insert or replace into participant(' +
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

  //Refresh everytime

/*  selectParticipant() {
    return new Promise(res => {
      this.arr = [];
      let query = "SELECT * FROM participant";
      this.db.executeSql(query, [], rs => {
        if (rs.rows.length > 0) {
          this.arr = [];
          for (var i = 0; i < rs.rows.length; i++) {

            this.arr.push(<participant>rs.rows.item(i));

          }
        }
        res(this.arr);
      }, (e) => {
        console.log('Sql Query Error', e);
      });
    })

  }*/


  selectRusParticipant() {
    return new Promise(res => {
      this.arr = [];
      let query = 'SELECT id, name_rus, desc_rus, country_rus, address_rus, phone, email, www, logo, place, thematic  FROM participant';
      this.db.executeSql(query, [], rs => {
        console.log("right after executeSql");
        console.log(rs);
        console.log(rs.rows.item(0).id);
        if (rs.rows.length > 0) {
          this.arr = [];
          for (var i = 0; i < rs.rows.length; i++) {
            var item = rs.rows.item(i);
            this.arr.push(item);
          }
        }
        res(true);
      }, (e) => {
        console.log('Sql Query Error', e);
      });
    })

  }

/*
  delAllParticipant() {
    console.log('try to delete all');
    return new Promise(resolve => {
      let query = "DELETE FROM participant";
      this.db.executeSql(query, [], (s) => {
        console.log('Delete All Success...', s);
        this.select().then(s => {
          resolve(true);
        });
      }, (err) => {
        console.log('Deleting Error', err);
      });
    })

  }*/

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

/*  getMyForumForId(id) {
    return new Promise(res => {
        let userId = localStorage.getItem('userid');
        if (!userId) return (res(false))
        let query = "select id from myforum where my_id=" + id + ' and user=' + userId;
        console.log(query);
        this.db.executeSql(query, [], rs => {
          if (rs) {
            res(rs.rows.item(0).id);
          }
          else res(false);
        });
      }
    );
  }*/

}
