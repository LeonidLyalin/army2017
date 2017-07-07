import {Component, Injectable, Input} from '@angular/core';
import {ModalController, NavController, NavParams} from 'ionic-angular';
import {FilterPage} from "../filter";
import {BaseSql} from "../../../providers/base-sql";
import {Http} from "@angular/http";
/**
 * Generated class for the FilterParticipantPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Injectable()
@Component({
  selector: 'page-filter-participant',
  templateUrl: 'filter-participant.html',
})
export class FilterParticipantPage {

  public thematicField: string;
  public thematicTitle: string;
  public thematicValue: string;

  public mapField: string;
  public mapTitle: string;
  public mapValue: string;

  public placeField: string;
  public placeTitle: string;
  public placeValue: string;

  public countryField: string;
  public countryTitle: string;
  public countryValue: string;

  userId: string;
  lang: string;

  //interfce strings
  setFilterStr: string;
  cancelFilterStr: string;

  @Input()
  filterStr:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public http: Http) {
    this.thematicTitle = 'Тематика';
    this.mapTitle = 'Павильоны';
    this.placeTitle = 'Стенды';
    this.countryTitle = 'Страны';


    this.setFilterStr = 'Установить';
    this.cancelFilterStr = 'Отменить';

  }

  thematicTitl

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterParticipantPage');

    //  this.thematicTitle='Тематика';
  }

  filterThematic() {
    let filterModal = this.modalCtrl.create(FilterPage, {
      table: 'thematic', field: 'name_rus',
      value: 'number', title: 'Тематика'
    });
    filterModal.onDidDismiss(
      data => {
        console.log(data);
        this.thematicField = data["field"];
        this.thematicValue = data["value"];
      });
    filterModal.present();
  }

  filterMap() {
    let parameters={
      table: 'map', field: 'name_rus',
      value: 'name_map', title: 'Павильон'
    };
    if (this.lang=='en'){
      parameters= {
        table: 'map', field: 'name_eng',
        value: 'name_map', title: 'Hall'
      };
    }
    let filterModal = this.modalCtrl.create(FilterPage, parameters);
    filterModal.onDidDismiss(
      data => {
        console.log(data);
        this.mapField = data["field"];
        this.mapValue = data["value"];
      });
    filterModal.present();
  }

  filterPlace() {
    if (this.mapField != '') {
      let filterModal = this.modalCtrl.create(FilterPage, {
        table: 'place', field: 'name_rus',
        value: 'id', where: ' name_map="' + this.mapValue + '"', title: 'Стенд'
      });
      filterModal.onDidDismiss(
        data => {
          console.log(data);
          this.placeField = data["field"];
          this.placeValue = data["value"];
        });
      filterModal.present();
    }
  }

  filterCountry() {
    let filterModal = this.modalCtrl.create(FilterPage, {
      table: 'participant', field: 'country_rus',
      value: 'country_rus', distinct: 'country_rus', title: 'Страна'
    });
    filterModal.onDidDismiss(
      data => {
        console.log(data);
        this.countryField = data["field"];
        this.countryValue = data["value"];

      }
    );

    filterModal.present();
  }

  filterCreateWhereStr() {
    console.log("this.thematicValue", this.thematicValue);
    console.log("this.countryValue", this.countryValue);
    console.log("this.mapValue=", this.mapValue);
    console.log("(this.placeValue=", this.placeValue);
    let whereStr = '';

    if (this.countryValue != '') whereStr += ((whereStr != '') ? ' and ' : '') + 'a.country_rus="' + this.countryValue + '"';


    if ((this.placeValue == '') && (this.mapValue != '')) {
      let places = new BaseSql(this.http, 'place');
      places.selectDistinct('id', 'name_map="' + this.mapValue + '"').then(res => {
        let placeList = <any>res;
        console.log("place", placeList);
        if (placeList.length() > 0) whereStr += ((whereStr != '') ? ' and (' : ' (');
        for (let i = 0; i < placeList.length(); i++) {
          whereStr += ' place=' + placeList[i].id;
          if (i < placeList.length() - 1) whereStr += ' or ';
        }
        whereStr += ')';
      })
      console.log("((this.placeValue=='') && (this.mapValue!=''))", whereStr);
    }
    whereStr += ((whereStr != '') ? ' and ' : '') + '(a.thematic="' + this.thematicValue + '" or a.thematic like "' + this.thematicValue +
      ',%"' + ' or a.thematic like "%,' + this.thematicValue + '" or  a.thematic like "%,' + this.thematicValue + ',%")';
    console.log("(whereStr after thematic=", whereStr);

    /*if (this.partOfName != '') whereStr += ((whereStr != '') ? ' and ' : '') + ' a.name_rus like ' + '"%' + this.partOfName + '%"';
     */
    if (this.placeValue != '') whereStr += ((whereStr != '') ? ' and ' : '') + '  a.place="' + this.placeValue + '"';
    if (whereStr != '') whereStr = ' where ' + whereStr;
    console.log('so whereStr is =', whereStr);
    return whereStr;
  }

  setFilter() {
    console.log(this.filterCreateWhereStr());
    this.filterStr=this.filterCreateWhereStr();
  }

  cancelFilter() {
    this.thematicField = '';
    this.thematicValue = '';
    this.mapField = '';
    this.mapValue = '';
    this.placeField = '';
    this.placeValue = '';
    this.countryField = '';
    this.countryValue = '';

  }
}
