import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';

import {BaseSql} from "../../providers/base-sql";
import {Http} from "@angular/http";


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
  filterWhere: string;
  filterTitle: string;
  filterDistinct: string;
  filterOrder:string;
  userId: string;
  lang: string;

  filterSql: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public viewCtrl: ViewController) {
    this.filterTable = navParams.get('table');
    this.filterField = navParams.get('field');
    this.filterValue = navParams.get('value');
    this.filterWhere = navParams.get('where');
    this.filterTitle = navParams.get('title');
    this.filterDistinct = navParams.get('distinct');
    this.filterOrder = navParams.get('order');


    //console.log("this.filterTable=", this.filterTable);
    //console.log("this.filterField=", this.filterField);
    //console.log("this.filterValue=", this.filterValue);
    //console.log("this.filterWhere=", this.filterWhere);
    //console.log("this.filteTitle=", this.filterTitle);
    //console.log("this.filteOrder=", this.filterOrder);

    this.filterSql = new BaseSql(http, this.filterTable);
    this.filterSql.tableName = this.filterTable;
  }

  ionViewDidLoad() {
    this.userId = localStorage.getItem('userid');
    this.lang = localStorage.getItem('lang');
    //console.log('ionViewDidLoad FilterPage');
    this.filterList = [];
    if (this.filterDistinct) {
      this.filterSql.selectDistinct(this.filterDistinct,this.filterWhere,this.filterOrder).then(res => {
        //console.log(" distinct res=", res);
        for (let i = 0; i < res.length; i++) {
          let tmpFilter: filter = {field: '', value: ''};
          //console.log("res[i]=", res[i]);
          let tmpRes = <any>res[i];
          tmpFilter.field = tmpRes[this.filterField];
          tmpFilter.value = tmpRes[this.filterValue];
          //console.log("tmpFilter=", tmpFilter);
          this.filterList.push(tmpFilter);
        }
      })
    }
    else {
      if (this.filterWhere) {

        this.filterSql.selectWhere(this.filterWhere,this.filterOrder).then(res => {
          //console.log("res=", res);
          for (let i = 0; i < res.length; i++) {
            let tmpFilter: filter = {field: '', value: ''};
            //console.log("res[i]=", res[i]);
            let tmpRes = <any>res[i];
            tmpFilter.field = tmpRes[this.filterField];
            tmpFilter.value = tmpRes[this.filterValue];
            //console.log("tmpFilter=", tmpFilter);
            this.filterList.push(tmpFilter);
          }
        })
      }
      else {
        this.filterSql.select(this.filterOrder).then(res => {
          //console.log("res=", res);
          for (let i = 0; i < res.length; i++) {
            let tmpFilter: filter = {field: '', value: ''};
            //console.log("res[i]=", res[i]);
            let tmpRes = <any>res[i];
            //console.log("tmpRes=", tmpRes);
            tmpFilter.field = tmpRes[this.filterField];
            tmpFilter.value = tmpRes[this.filterValue];
            //console.log("tmpFilter=", tmpFilter);
            this.filterList.push(tmpFilter);
          }
        })

      }
    }
  }

  dismiss(value, field) {
    let data = {'value': value, 'field': field};
    this.viewCtrl.dismiss(data);
  }



}
