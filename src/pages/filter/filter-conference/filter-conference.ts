import {Component, Injectable} from '@angular/core';
import {ModalController, NavController, NavParams, Events} from 'ionic-angular';
import {FilterPage} from "../filter";
import {BaseSql} from "../../../providers/base-sql";
import {Http} from "@angular/http";

import {FilterConferenceProvider} from "../../../providers/filter-provider/filter-conference-provider";

@Injectable()
@Component({
  selector: 'page-filter-conference',
  templateUrl: 'filter-conference.html',
})
export class FilterConferencePage {


  userId: string;
  lang: string;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public http: Http,
              public filterProvider: FilterConferenceProvider,
              public events: Events) {
    this.lang = localStorage.getItem('lang');
    if (this.lang == 'ru') {
      this.setRussianStrings();
    }
    else {
      this.setEnglishStrings();
    }

    this.events.subscribe('language:change', () => {


      this.lang = localStorage.getItem('lang');
      if (this.lang == 'ru') {
        console.log('this.events.subscribe(language:change)', this.lang);
        this.setRussianStrings();
      }
      else {
        this.setEnglishStrings();
      }
    });

  }

  setRussianStrings() {
    console.log('this.setRussianStrings()');
    this.filterProvider.thematicConferenceTitle = 'Тематика';
    this.filterProvider.mapTitle = 'Павильоны';
    this.filterProvider.placeTitle = 'Стенды';
    this.filterProvider.dateTitle = 'Дата';

    //interface strings
    this.filterProvider.setStr = 'Установить';
    this.filterProvider.cancelFilterStr = 'Отменить';
    this.filterProvider.findName = 'Наименование';

  }

  setEnglishStrings() {
    console.log('this.setEnglishStrings()');
    this.filterProvider.thematicConferenceTitle = 'Thema';
    this.filterProvider.mapTitle = 'Hall';
    this.filterProvider.placeTitle = 'Stand';
    this.filterProvider.dateTitle = 'Date of event';

    //interface strings
    this.filterProvider.setStr = 'Set';
    this.filterProvider.cancelFilterStr = 'Cancel';
    this.filterProvider.findName = 'Name';
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterParticipantPage');

    //  this.filterProvider.thematicTitle='Тематика';
  }

  filterThematic() {
    let parameters = {
      table: 'thematic_conference', field: 'name_rus',
      value: 'id', title: 'Тематика'
    }
    if (this.lang == 'en') {
      parameters = {
        table: 'thematic_conference', field: 'name_eng',
        value: 'id', title: 'Thema'
      }
    }
    let filterModal = this.modalCtrl.create(FilterPage, parameters);
    filterModal.onDidDismiss(
      data => {
        console.log(data);
        this.filterProvider.thematicConferenceField = data["field"];
        this.filterProvider.thematicConferenceValue = data["value"];
        /* this.filterProvider.filterStr=this.filterCreateWhereStr();*/
        if ((this.filterProvider.mapValue) && ( (!this.filterProvider.placeValue) || (this.filterProvider.placeValue == '')))
          this.filterCreateWhereStrMap().then(res => {
            console.log(' filterMap()1 res=',<any>res);
            this.filterProvider.setFilterStr(<string>res);
          });
        else
          this.filterCreateWhereStr().then(res => {
            console.log(' filterMap() res=',<any>res);
            this.filterProvider.setFilterStr(<string>res);
          });
        console.log('this.filterProvider.filterStr=', this.filterProvider.filterStr);
      });
    filterModal.present();
  }

  filterMap() {
    let parameters = {
      table: 'map', field: 'name_rus',
      value: 'name_map', title: 'Павильон'
    };
    if (this.lang == 'en') {
      parameters = {
        table: 'map', field: 'name_eng',
        value: 'name_map', title: 'Hall'
      };
    }
    let filterModal = this.modalCtrl.create(FilterPage, parameters);
    filterModal.onDidDismiss(
      data => {
        console.log(data);
        this.filterProvider.mapField = data["field"];
        this.filterProvider.mapValue = data["value"];
        // this.filterStr=this.filterCreateWhereStr();
        if ((this.filterProvider.mapValue) && ( (!this.filterProvider.placeValue) || (this.filterProvider.placeValue == '')))
          this.filterCreateWhereStrMap().then(res => {
            console.log(' filterMap()1 res=',<any>res);
            this.filterProvider.setFilterStr(<string>res);
          });
        else
          this.filterCreateWhereStr().then(res => {
            console.log(' filterMap() res=',<any>res);
            this.filterProvider.setFilterStr(<string>res);
          });
        console.log('this.filterProvider.filterStr=', this.filterProvider.filterStr);
      });
    filterModal.present();
  }

  filterPlace() {
    let parameters = {
      table: 'place', field: 'name_rus',
      value: 'id', where: ' name_map="' + this.filterProvider.mapValue + '"', title: 'Стенд'
    }
    if (this.lang == 'en') {
      parameters =
        {
          table: 'place', field: 'name_eng',
          value: 'id', where: ' name_map="' + this.filterProvider.mapValue + '"', title: 'Stand'
        }
    }
    if (this.filterProvider.mapField != '') {
      let filterModal = this.modalCtrl.create(FilterPage, parameters);
      filterModal.onDidDismiss(
        data => {
          console.log(data);
          this.filterProvider.placeField = data["field"];
          this.filterProvider.placeValue = data["value"];
          //this.filterProvider.filterStr=
          if ((this.filterProvider.mapValue) && ( (!this.filterProvider.placeValue) || (this.filterProvider.placeValue == '')))
            this.filterCreateWhereStrMap().then(res => {
              console.log(' filterMap()1 res=',<any>res);
              this.filterProvider.setFilterStr(<string>res);
            });
          else
            this.filterCreateWhereStr().then(res => {
              console.log(' filterMap() res=',<any>res);
              this.filterProvider.setFilterStr(<string>res);
            });
          console.log('this.filterProvider.filterStr=', this.filterProvider.filterStr);
        });
      filterModal.present();
    }
  }

  filterDate() {
    let parameters = {
      table: 'conference', field: 'date_event',
      value: 'date_event', distinct: 'date_event',
      title: 'Дата',  order:'date_event'
    };
    if (this.lang == 'en') {
      parameters =
        {
          table: 'conference', field: 'date_event',
          value: 'date_event', distinct: 'date_event',
          title: 'Date', order:'date_event'
        }
    }
    let filterModal = this.modalCtrl.create(FilterPage, parameters);
    filterModal.onDidDismiss(
      data => {
        console.log(data);
        this.filterProvider.dateField = data["field"];
        this.filterProvider.dateValue = data["value"];
        //this.filterStr=this.filterCreateWhereStr();
        if ((this.filterProvider.mapValue) && ( (!this.filterProvider.placeValue) || (this.filterProvider.placeValue == '')))
          this.filterCreateWhereStrMap().then(res => {
            console.log(' filterMap() res=',<any>res);
            this.filterProvider.setFilterStr(<string>res);
          });
        else
          this.filterCreateWhereStr().then(res => {
            console.log(' filterMap() res=',<any>res);
            this.filterProvider.setFilterStr(<string>res);
          });
        console.log('this.filterProvider.filterStr=', this.filterProvider.filterStr);
      }
    );

    filterModal.present();
  }

  filterCreateWhereStr() {
    console.log("this.thematicValue", this.filterProvider.thematicConferenceValue);
    console.log("this.dateValue", this.filterProvider.dateValue);
    console.log("this.mapValue=", this.filterProvider.mapValue);
    console.log("this.placeValue=", this.filterProvider.placeValue);
    return new Promise(res => {
      let whereStr = '';

      if ((this.filterProvider.partOfName) && (this.filterProvider.partOfName != '')) {
        if (this.lang == 'ru') {
          whereStr += ((whereStr != '') ? ' and ' : '') + ' a.name_rus_upper like' + '"%' + this.filterProvider.partOfName.toUpperCase() + '%"';
        }
        else {
          whereStr += ((whereStr != '') ? ' and ' : '') + 'a.name_eng like' + '"%' + this.filterProvider.partOfName.toUpperCase() + '%"'
        }

      }

      if ((this.filterProvider.dateValue) && (this.filterProvider.dateValue != '')) {

        whereStr += ((whereStr != '') ? ' and ' : '') + 'a.date_event="' + this.filterProvider.dateValue + '"';

      }


      if (this.filterProvider.thematicConferenceValue) {


        whereStr += ((whereStr != '') ? ' and ' : '') + '(a.thematic_conference="' + this.filterProvider.thematicConferenceValue + '")';
      }
      console.log("(whereStr after thematic=", whereStr);


      if (this.filterProvider.placeValue && (this.filterProvider.placeValue != ''))
        whereStr += ((whereStr != '') ? ' and ' : '') + '  a.place="' + this.filterProvider.placeValue + '"';

      if ((this.filterProvider.mapValue) && ( (!this.filterProvider.placeValue) || (this.filterProvider.placeValue == ''))) {
        let places = new BaseSql(this.http, 'place');
        places.selectDistinct('id', 'name_map="' + this.filterProvider.mapValue + '"').then(rs => {
          let placeList = <any>rs;
          console.log("place", placeList);
          if (placeList.length > 0) whereStr += ((whereStr != '') ? ' and (' : ' (');
          for (let i = 0; i < placeList.length; i++) {
            whereStr += ' place=' + placeList[i].id;
            if (i < placeList.length - 1) whereStr += ' or ';
          }
          whereStr += ')';
          console.log("((this.placeValue=='') && (this.mapValue!=''))", whereStr);
          if (whereStr != '') whereStr = ' where ' + whereStr;
          console.log('so whereStr is =', whereStr);
          /*return res(whereStr);*/
        })

      }

      if (whereStr != '') whereStr = ' where ' + whereStr;
      this.filterProvider.setFilterStr(whereStr);
      console.log('so whereStr is =', whereStr);
      return res(whereStr);
    });
  }


  filterCreateWhereStrMap() {
    console.log("filterCreateWhereStrMap this.thematicValue", this.filterProvider.thematicConferenceValue);
    console.log("filterCreateWhereStrMap this.dateValue", this.filterProvider.dateValue);
    console.log("filterCreateWhereStrMap this.mapValue=", this.filterProvider.mapValue);
    console.log("filterCreateWhereStrMap this.placeValue=", this.filterProvider.placeValue);
    return new Promise(res => {
      let whereStr = '';


      /*    if (this.filterProvider.placeValue && (this.filterProvider.placeValue != ''))
            whereStr += ((whereStr != '') ? ' and ' : '') + '  a.place="' + this.filterProvider.placeValue + '"';*/

      if ((this.filterProvider.mapValue) && ( (!this.filterProvider.placeValue) || (this.filterProvider.placeValue == ''))) {
        let places = new BaseSql(this.http, 'place');
        places.selectDistinct('id', 'name_map="' + this.filterProvider.mapValue + '"').then(rs => {
          let placeList = <any>rs;
          console.log("place", placeList);
          if (placeList.length > 0) whereStr += ((whereStr != '') ? ' and (' : ' (');
          for (let i = 0; i < placeList.length; i++) {
            whereStr += ' place=' + placeList[i].id;
            if (i < placeList.length - 1) whereStr += ' or ';
          }
          whereStr += ')';
          console.log("((this.placeValue=='') && (this.mapValue!=''))", whereStr);
          if ((this.filterProvider.partOfName) && (this.filterProvider.partOfName != '')) {
            if (this.lang == 'ru') {
              whereStr += ((whereStr != '') ? ' and ' : '') + ' a.name_rus_upper like' + '"%' + this.filterProvider.partOfName.toUpperCase() + '%"';
            }
            else {
              whereStr += ((whereStr != '') ? ' and ' : '') + 'a.name_eng like' + '"%' + this.filterProvider.partOfName.toUpperCase() + '%"'
            }

          }

          if ((this.filterProvider.dateValue) && (this.filterProvider.dateValue != '')) {

            whereStr += ((whereStr != '') ? ' and ' : '') + 'a.date_event="' + this.filterProvider.dateValue + '"';

          }


          if (this.filterProvider.thematicConferenceValue) {


            whereStr += ((whereStr != '') ? ' and ' : '') + '(a.thematic_conference="' + this.filterProvider.thematicConferenceValue + '")';
          }
          console.log("(whereStr after thematic=", whereStr);


          if (whereStr != '') whereStr = ' where ' + whereStr;
          console.log('so whereStr is =', whereStr);
          this.filterProvider.setFilterStr(whereStr);
          console.log('so whereStr is =', whereStr);

        })

      }
      return res(whereStr);
    })
    /* if (whereStr != '') whereStr = ' where ' + whereStr;
     console.log('so whereStr is =', whereStr);
     return whereStr;*/
  }

  setFilter() {
    console.log(this.filterCreateWhereStr());
    //this.filterStr = this.filterCreateWhereStr();

    if ((this.filterProvider.mapValue) && ( (!this.filterProvider.placeValue) || (this.filterProvider.placeValue == '')))
      this.filterCreateWhereStrMap().then(res => {
        console.log(' filterMap()1 res=',<any>res);
        this.filterProvider.setFilterStr(<string>res);
      });
    else
      this.filterCreateWhereStr().then(res => {
        console.log(' filterMap() res=',<any>res);
        this.filterProvider.setFilterStr(<string>res);
      });
    console.log('this.filterProvider.filterStr=', this.filterProvider.filterStr);
  }

  selectConferenceSearch() {
    //  this.filterStr=this.filterCreateWhereStr();
   // this.filterProvider.setFilterStr(this.filterCreateWhereStr());
    if ((this.filterProvider.mapValue) && ( (!this.filterProvider.placeValue) || (this.filterProvider.placeValue == '')))
      this.filterCreateWhereStrMap().then(res => {
        console.log(' filterMap()1 res=',<any>res);
        this.filterProvider.setFilterStr(<string>res);
      });
    else
      this.filterCreateWhereStr().then(res => {
        console.log(' filterMap() res=',<any>res);
        this.filterProvider.setFilterStr(<string>res);
      });
    console.log('this.filterProvider.filterStr=', this.filterProvider.filterStr);
  }

  cancelFilterDate() {
    this.filterProvider.dateField = '';
    this.filterProvider.dateValue = '';
    if ((this.filterProvider.mapValue) && ( (!this.filterProvider.placeValue) || (this.filterProvider.placeValue == '')))
      this.filterCreateWhereStrMap().then(res => {
        console.log(' filterMap()1 res=',<any>res);
        this.filterProvider.setFilterStr(<string>res);
      });
    else
      this.filterCreateWhereStr().then(res => {
        console.log(' filterMap() res=',<any>res);
        this.filterProvider.setFilterStr(<string>res);
      });
    console.log('this.filterProvider.filterStr=', this.filterProvider.filterStr);

  }

  cancelFilterMap() {
    this.filterProvider.mapField = '';
    this.filterProvider.mapValue = '';
    if ((this.filterProvider.mapValue) && ( (!this.filterProvider.placeValue) || (this.filterProvider.placeValue == '')))
      this.filterCreateWhereStrMap().then(res => {
        console.log(' filterMap()1 res=',<any>res);
        this.filterProvider.setFilterStr(<string>res);
      });
    else
      this.filterCreateWhereStr().then(res => {
        console.log(' filterMap() res=',<any>res);
        this.filterProvider.setFilterStr(<string>res);
      });
    console.log('this.filterProvider.filterStr=', this.filterProvider.filterStr);

  }

  cancelFilterPlace() {
    this.filterProvider.placeField = '';
    this.filterProvider.placeValue = '';
    if ((this.filterProvider.mapValue) && ( (!this.filterProvider.placeValue) || (this.filterProvider.placeValue == '')))
      this.filterCreateWhereStrMap().then(res => {
        console.log(' filterMap()1 res=',<any>res);
        this.filterProvider.setFilterStr(<string>res);
      });
    else
      this.filterCreateWhereStr().then(res => {
        console.log(' filterMap() res=',<any>res);
        this.filterProvider.setFilterStr(<string>res);
      });
    console.log('this.filterProvider.filterStr=', this.filterProvider.filterStr);

  }

  cancelFilterThematic() {
    this.filterProvider.thematicConferenceField = '';
    this.filterProvider.thematicConferenceValue = '';
    if ((this.filterProvider.mapValue) && ( (!this.filterProvider.placeValue) || (this.filterProvider.placeValue == '')))
      this.filterCreateWhereStrMap().then(res => {
        console.log(' filterMap()1 res=',<any>res);
        this.filterProvider.setFilterStr(<string>res);
      });
    else
      this.filterCreateWhereStr().then(res => {
        console.log(' filterMap() res=',<any>res);
        this.filterProvider.setFilterStr(<string>res);
      });
    console.log('this.filterProvider.filterStr=', this.filterProvider.filterStr);

  }

  cancelFilterName() {
    this.filterProvider.partOfName = '';

    if ((this.filterProvider.mapValue) && ( (!this.filterProvider.placeValue) || (this.filterProvider.placeValue == '')))
      this.filterCreateWhereStrMap().then(res => {
        console.log(' filterMap()1 res=',<any>res);
        this.filterProvider.setFilterStr(<string>res);
      });
    else
      this.filterCreateWhereStr().then(res => {
        console.log(' filterMap() res=',<any>res);
        this.filterProvider.setFilterStr(<string>res);
      });
    console.log('this.filterProvider.filterStr=', this.filterProvider.filterStr);
  }
}
