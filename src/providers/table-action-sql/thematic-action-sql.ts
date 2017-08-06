import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {BaseSql} from "../base-sql";

/*
  Generated class for the TableActionSql provider.

this table contains information about action which were done with tables
*/
declare let window: any;


@Injectable()
export class TableActionSql extends BaseSql{


  constructor(public http: Http) {
    super(http,'table_action',[
      {name:"id", type:"text PRIMARY KEY"    },
      {name:"table_name", type:"text"    },
      {name:"action", type:"text"    },
      {name:"date_change", type:"text"    },
      {name:"time_change", type:"text"    }
      ]
    );
    //console.log('Hello table_action constructor');
    //this.openDb();
  }






}


