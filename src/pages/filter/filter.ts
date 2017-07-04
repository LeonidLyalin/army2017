import {Component} from '@angular/core';
import { NavController, NavParams, ViewController} from 'ionic-angular';

import {BaseSql} from "../../providers/base-sql";
import {Http} from "@angular/http";
import {thematic} from "../../providers/thematic-sql";

/**
 * Generated class for the FilterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
interface filter {
  field: string;
  value: string;
}
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage {

  filterList: filter[];
  filterTable: string;//f.i. thematic
  filterField: string;
  filterValue: string;

  userId: string;
  lang: string;

  filterSql: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public viewCtrl:ViewController) {
    this.filterTable = navParams.get('table');
    this.filterField = navParams.get('field');
    this.filterValue = navParams.get('value');
    console.log("this.filterTable=", this.filterTable);
    console.log("this.filterField=", this.filterField);
    console.log("this.filterValue=", this.filterValue);
    this.filterSql = new BaseSql(http, this.filterTable);
  }

  ionViewDidLoad() {
    this.userId = localStorage.getItem('userid');
    this.lang = localStorage.getItem('lang');
    console.log('ionViewDidLoad FilterPage');
    this.filterList = [];
    this.filterSql.select().then(res => {
        console.log("res=", res);
        for (let i = 0; i < res.length; i++) {
          let tmpFilter: filter={field:'',value:''};
          console.log("res[i]=",res[i]);
          console.log("res[i].name_rus=",res[i].name_rus);
          let tmpRes=<thematic>res[i];
          console.log("tmpRes=",tmpRes);
          console.log("tmpRes['name_rus']=",tmpRes['name_rus']);
          tmpFilter.field =tmpRes['name_rus'];
           // tmpFilter.field = (<any>res[i])["name_rus"];
          tmpFilter.value = tmpRes["number"];
          console.log("tmpFilter=",tmpFilter);
          this.filterList.push(tmpFilter);
        }
      }
    )
  }
  dismiss(value) {
    let data = { 'selected': value };
    this.viewCtrl.dismiss(data);
  }


}
