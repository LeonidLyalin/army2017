import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {BaseApi} from "../pages/shared/base-api-service";


/*
 base class for operation with thematic table
 */
export interface thematic {
  id: string,
  name_rus: string,
  name_eng: string,
  number: string
}

export interface baseField {
  name: string;
  type: string;
}

declare let window: any;

@Injectable()
export class BaseSql {
  //public text: string = "";
  public db = null;
  public arr = [];
  public fields;

  tableName: string;//'thematic';

  constructor(public http: Http,
              // public thematicApi: ThematicConferenceApi,
              tableName: string,
              fields?, constrains?, status?) {
    console.log('Hello BaseSql Provider for ', tableName);

    this.tableName = tableName;
    if (fields) {
      this.fields = fields;
      let fieldsStr = this.createFieldStr();

      if ((constrains) && (constrains != '')) {
        console.log(constrains);
        fieldsStr += ',' + constrains;

      }
      if (status)
        this.openDb(fieldsStr, status);
      else this.openDb(fieldsStr);
    }
    else this.openDb();

  }


  /**
   * create strind (delimiter - comma) from an array of fields
   *
   * @returns {string}
   */

  private createFieldStr() {
    let fieldStr = '';
    for (let field of this.fields) {
      if (fieldStr != '') fieldStr += ', ';
      fieldStr += field.name + ' ' + field.type;

    }
    console.log("createFieldStr=", fieldStr);
    return fieldStr;
  }

  /**
   * create string for insert SQL-query (from field containing fields' names)
   *
   * @returns {string}
   */
  private createFieldInsertStr() {
    let fieldStr = '';
    for (let field of this.fields) {
      if (fieldStr != '') fieldStr += ', ';
      fieldStr += field.name;

    }
    console.log("createFieldInsertStr=", fieldStr);
    return fieldStr;
  }

  /**
   * create string containing question marks (e.i. '?,?,') for insert SQL-query
   *
   * @returns {string}
   */
  private createQuestionMarkStr() {
    let fieldStr = '';
    for (let i = 0; i < this.fields.length; i++) {
      if (fieldStr != '') fieldStr += ', ';
      fieldStr += '?';
    }
    console.log("createQuestionMarkStr=", fieldStr);
    return fieldStr;
  }

  /**
   * open of createand then open the database
   * @param fieldStr - fields in the created database
   * @param status - what to do?
   */
  openDb(fieldStr?, status?) {
    this.db = window.sqlitePlugin.openDatabase({name: 'todo.db', location: 'default'});
    if (status) {
      if (status == 'recreate') {
        this.dropTable();
      }
    }
    this.db.transaction(
      (tx) => {
        if (fieldStr != '') {
          tx.executeSql('CREATE TABLE IF NOT EXISTS '
            + this.tableName
            + ' (' + fieldStr + ')'
          );
        }
      }
      ,
      (e) => {
        console.log('Transaction Error ' + this.tableName + ' create', e);
      }, () => {
      }
    )
  }

  /**
   * create array which contains a bunch of values for insert
   * @param item
   * @returns {Array}
   */


  createInsValues(item) {
    console.log("createInsValues(item)=", this.fields);
    console.log("item=", item);
    let insValues = [];
    for (let field of this.fields) {
      console.log("field.name", field.name);
      console.log("item[field.name]=", item[field.name]);
      insValues.push(item[field.name]);
    }
    console.log("insValues=", insValues);
    return insValues;
  }

  addItem(item) {
    console.log("base addItem item=", item);
    return new Promise(resolve => {
      let insertQuery = 'insert or replace into ' + this.tableName + '(' +
        this.createFieldInsertStr() +
        ') values (' + this.createQuestionMarkStr() + ')';
      console.log('insert query=', insertQuery);
      //  console.log('insert values=',  this.createInsValues(item));
      this.db.executeSql(insertQuery, this.createInsValues(item), (r) => {
        console.log('base sql addItem(item) Inserted... Success..', r);
      }, e => {
        console.log('Inserted Error', e);
        resolve(false);
      })
    })
  }

  addItemList(itemList) {
    console.log("base addItem itemList=", itemList);
    return new Promise(resolve => {
      for (let item of itemList) {
        this.addItem(item);
      }
      resolve(true)
    });


  }


  /**
   * select query for this.tableName table
   * @param fieldSort - field or fields (separated by comma) which define(s) order of sorting
   * @returns {Promise<T>}
   */
  select(fieldSort ?: string) {
    return new Promise(res => {
      let orderStr = 'order by ';
      this.arr = [];
      let query = "SELECT * FROM " + this.tableName;
      if (fieldSort) {
        if (fieldSort != '') query += 'order by ' + fieldSort;
      }
      console.log("query=", query);
      this.db.executeSql(query, [], rs => {

        if (rs.rows.length > 0) {
          this.arr = [];

          for (let i = 0; i < rs.rows.length; i++) {
            this.arr.push(<any>rs.rows.item(i));
          }
          res(this.arr);
        }
        else res(false);
      }, (e) => {
        res(false);
        console.log('Sql Query Error', e);
      });
    })

  }

  selectWhere(whereStr ?, fieldSort ?: string) {
    return new Promise(res => {
      let orderStr = 'order by ';
      this.arr = [];
      let query = "SELECT * FROM " + this.tableName;
      if (whereStr != '') {
        if (!whereStr.includes('where')) query += ' where ';
        query += ' ' + whereStr;
      }
      if (fieldSort) {
        if (fieldSort != '') query += ' order by ' + fieldSort;
      }
      console.log("query=", query);
      this.db.executeSql(query, [], rs => {

        if (rs.rows.length > 0) {
          this.arr = [];

          for (let i = 0; i < rs.rows.length; i++) {
            this.arr.push(<any>rs.rows.item(i));
          }
          res(this.arr);
        }
        else res(false);
      }, (e) => {
        res(false);
        console.log('Sql Query Error', e);
      });
    })

  }


  selectDistinct(distinctField, whereStr?, fieldSort?: string) {
    return new Promise(res => {
      let orderStr = 'order by ';
      this.arr = [];
      let query = "SELECT distinct(" + distinctField + ") FROM " + this.tableName;
      if (whereStr) {
        if (whereStr != '') query += ' where ' + whereStr;
      }
      if (fieldSort) {
        if (fieldSort != '') {
          query += ' order by ' + fieldSort;
        }
      }
      console.log("selectDistinct query=", query);
      this.db.executeSql(query, [], rs => {
        console.log("rs=", rs);
        if (rs.rows.length > 0) {
          this.arr = [];

          for (let i = 0; i < rs.rows.length; i++) {
            this.arr.push(<any>rs.rows.item(i));
          }
          res(this.arr);
        }
        else res(false);
      }, (e) => {
        res(false);
        console.log('Sql Query Error', e);
      });
    })

  }

  /**
   * delete all records from the table tableName according to possible whereStr clause
   * @param whereStr
   * @returns {Promise<any>}
   */
  delAll(whereStr?) {
    console.log('try to delete all ' + this.tableName);
    return new Promise(resolve => {
      let query = "DELETE FROM " + this.tableName;
      if (whereStr) {
        query += ' where ' + whereStr;
      }
      console.log('Delete All query', query);
      this.db.executeSql(query, [], (s) => {
        console.log('DeleteAll  Success...', s, whereStr);

      }, (err) => {
        console.log('Deleting Error', err);
      });
    })

  }

  /**
   * drop and anihilate the table tableName
   * @returns {Promise<any>}
   */

  dropTable() {
    console.log('try to drop table ' + this.tableName);
    return new Promise(resolve => {
      let query = "drop table " + this.tableName;
      this.db.executeSql(query, [], (s) => {
        console.log('Drop table Success...', s);

      }, (err) => {
        console.log('Dropping table Error', err);
      });
    })

  }

  /**
   * return certain filed from a table accronind to id
   * @param id
   * @param field
   * @param table
   * @returns {Promise<T>}
   */


  getFieldFromTable(id, field, table) {
    console.log('get ' + field + ' for ' + table
    );
    return new Promise(res => {
      let query = 'select ' + field + ' from ' + table;
      query += ' where id=' + id;
      console.log(query);
      this.db.executeSql(query, [], rs => {
        console.log(rs);
        let list = rs.rows.item(0).thematic;
        console.log(list);
        this.getFieldTableList(list, field).then(rs => {
            console.log("res after getThematicList=", rs);
            res(rs);
          }
        )
      });

    });
  }

  /**
   *
   * @param list - list of values for fieldName
   * @param fieldName - name of field to where clause
   * @returns {Promise<T>}
   */

  getFieldTableList(list: string, fieldName) {
    return new Promise(res => {
      console.log('get ' + this.tableName + ' list=', list);
      let thematic: string[];
      thematic = list.split(',');
      console.log('an array=', thematic);
      let whereStr: string = ' where ';
      for (let i = 0; i < thematic.length; i++) {
        if (i > 0) whereStr += ' or ';
        whereStr += fieldName + '=' + thematic[i];
      }
      console.log("whereStr=", whereStr);
      let query = "SELECT * FROM " + this.tableName;
      query += ' ' + whereStr;
      console.log(query);
      this.arr = [];
      this.db.executeSql(query, [], rs => {
        if (rs.rows.length > 0) {
          this.arr = [];
          for (let i = 0; i < rs.rows.length; i++) {
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
   *  returns number of records in tableName
   * @returns {Promise<T>}
   */
  countTable() {
    return new Promise(res => {
      this.arr = [];
      let query = "SELECT count(*) as count FROM " + this.tableName;
      this.db.executeSql(query, [], rs => {
        console.log("rs=", rs);
        console.log("table " + this.tableName + ". rs.rows.item[0].count=", <any>rs.rows.item[0].count);
        res(<any>rs.rows.item[0].count);
      }, (e) => {
        console.log('Sql Query Error', e);
      });
    })

  }

  delId(id) {
    return new Promise(resolve => {
      let query = "DELETE FROM " + this.tableName + " WHERE id=?";
      this.db.executeSql(query, [id], (s) => {
        console.log('Delete from place Success...', s);

        resolve(true);

      }, (err) => {
        console.log('Deleting Error', err);
        resolve(false);
      });
    })
  }

  /**
   * simple check id record with id is in table
   * @param id
   * @returns {Promise<T>}
   */
  checkForId(id) {
    return new Promise(res => {
      let query = 'SELECT * FROM ' + this.tableName + ' WHERE id=' + id;
      this.db.executeSql(query, [], rs => {
        console.log("checkForId(id)!!! id=", id, query);
        console.log(rs);
        console.log(rs.rows.length);
        return res(rs.rows.length > 0);


      });
    });
  }

  checkForFieldValues(fields) {
    let whereStr = '';
    for (let field of fields) {
      whereStr += ((whereStr != '') ? ' and ' : '') + field.name + '=' + ((field.type == "text") ? '"' : '') + field.value + ((field.type == "text") ? '"' : '');
    }

    console.log("checkForFieldValues whereStr=", whereStr);

    let query = 'SELECT count(*) as count FROM ' + this.tableName;

    query += ((whereStr != '') ? ' where ' + whereStr : '');
    console.log(query);
    return new Promise(res => {
      this.db.executeSql(query, [], rs => {
        console.log("checkForFieldValues(fields)=", fields);
        console.log(rs);
        console.log(rs.rows.length);
        if (rs.rows.length > 0) res(rs.rows.item(0).count);
        else res(0);

      });

    });
  }

  /**
   * return a record from table where field=value
   * @param field
   * @param value
   * @returns {Promise<T>}
   */
  getRecordForFieldValue(field, value) {

    return new Promise(res => {
      this.arr = [];
      let query = "SELECT * FROM " + this.tableName;
      query += ' where ' + field + '=' + value;
      this.db.executeSql(query, [], rs => {
        console.log("rs=", rs);
        console.log("table " + this.tableName + ". rs.rows.item[0]=", <any>rs.rows.item[0]);
        res(<any>rs.rows.item(0));
      }, (e) => {
        console.log('Sql Query Error', e);
      });
    })

  }

  /**
   * select distinct values for field (fieldNane) for table
   * @param list
   * @param fieldName
   * @returns {Promise<T>}
   */
  getTableFieldDistinctList(list, fieldName: string) {
    return new Promise(res => {
      console.log('get thematicConference list=', list);
      let tableList: string[];
      tableList = list.split(',');
      console.log('an array=', tableList);
      let whereStr: string = ' where ';
      for (let i = 0; i < tableList.length; i++) {
        if (i > 0) whereStr += ' or ';
        whereStr += 'id=' + tableList[i];
      }
      console.log("whereStr=", whereStr);
      let query = "SELECT distinct(" + fieldName + ") FROM " + this.tableName;
      query += ' ' + whereStr;
      console.log(query);
      this.arr = [];
      this.db.executeSql(query, [], rs => {
        if (rs.rows.length > 0) {
          this.arr = [];
          for (let i = 0; i < rs.rows.length; i++) {
            this.arr.push(<any>rs.rows.item(i));
          }
        }
        res(this.arr);
      }, (e) => {
        console.log('Sql Query Error', e);
      });
    })
  }

  loadApi(path) {
    let api = new BaseApi(this.http);
    api.getApi(path).subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          console.log("try to insert data[i]=", data[i]);
          this.addItem(data[i]).then(res => {
            console.log('after insert res=', res);
            return res;
          });
        }
      }
    )
  }
}
