import {Component, Injectable} from '@angular/core';
import {ModalController, NavController, NavParams, Events} from 'ionic-angular';
import {FilterPage} from "../filter";
import {BaseSql} from "../../../providers/base-sql";
import {Http} from "@angular/http";
import {FilterProvider} from "../../../providers/filter-provider/filter-provider";
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
  /*
   public thematicField: string;
   public filterProvider.thematicTitle: string;
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

   public partOfName: string;*/

  userId: string;
  lang: string;

  //interface strings
  /* setFilterStr: string;
   cancelFilterStr: string;
   findName: string;*/


  /* @Input()
   filterStr: string;*/

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public http: Http,
              public filterProvider: FilterProvider,
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
    this.filterProvider.thematicTitle = 'Тематика';
    this.filterProvider.mapTitle = 'Павильоны';
    this.filterProvider.placeTitle = 'Стенды';
    this.filterProvider.countryTitle = 'Страны';

    //interface strings
    this.filterProvider.setStr = 'Установить';
    this.filterProvider.cancelFilterStr = 'Отменить';
    this.filterProvider.findName = 'Наименование';

  }

  setEnglishStrings() {
    console.log('this.setEnglishStrings()');
    this.filterProvider.thematicTitle = 'Thema';
    this.filterProvider.mapTitle = 'Hall';
    this.filterProvider.placeTitle = 'Stand';
    this.filterProvider.countryTitle = 'Country';

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
      table: 'thematic', field: 'name_rus',
      value: 'number', title: 'Тематика'
    }
    if (this.lang == 'en') {
      parameters = {
        table: 'thematic', field: 'name_eng',
        value: 'number', title: 'Thema'
      }
    }
    let filterModal = this.modalCtrl.create(FilterPage, parameters);
    filterModal.onDidDismiss(
      data => {
        console.log(data);
        this.filterProvider.thematicField = data["field"];
        this.filterProvider.thematicValue = data["value"];
        /* this.filterProvider.filterStr=this.filterCreateWhereStr();*/
        this.filterProvider.setFilterStr(this.filterCreateWhereStr());
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
        this.filterProvider.setFilterStr(this.filterCreateWhereStr());
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
          this.filterProvider.setFilterStr(this.filterCreateWhereStr());
        });
      filterModal.present();
    }
  }

  filterCountry() {
    let parameters = {
      table: 'participant', field: 'country_rus',
      value: 'country_rus', distinct: 'country_rus', title: 'Страна'
    };
    if (this.lang == 'en') {
      parameters =
        {
          table: 'participant', field: 'country_eng',
          value: 'country_eng', distinct: 'country_eng', title: 'Country'
        }
    }
    let filterModal = this.modalCtrl.create(FilterPage, parameters);
    filterModal.onDidDismiss(
      data => {
        console.log(data);
        this.filterProvider.countryField = data["field"];
        this.filterProvider.countryValue = data["value"];
        //this.filterStr=this.filterCreateWhereStr();
        this.filterProvider.setFilterStr(this.filterCreateWhereStr());
      }
    );

    filterModal.present();
  }

  filterCreateWhereStr() {
    console.log("this.thematicValue", this.filterProvider.thematicValue);
    console.log("this.countryValue", this.filterProvider.countryValue);
    console.log("this.mapValue=", this.filterProvider.mapValue);
    console.log("(this.placeValue=", this.filterProvider.placeValue);
    let whereStr = '';

    if ((this.filterProvider.partOfName) && (this.filterProvider.partOfName != '')) {
      if (this.lang == 'ru') {
        whereStr += ((whereStr != '') ? ' and ' : '') + ' a.name_rus_upper like' + '"%' + this.filterProvider.partOfName.toUpperCase() + '%"';
      }
      else {
        whereStr += ((whereStr != '') ? ' and ' : '') + 'a.name_eng like' + '"%' + this.filterProvider.partOfName.toUpperCase() + '%"'
      }

    }

    if ((this.filterProvider.countryValue) && (this.filterProvider.countryValue != '')) {
      if (this.lang == 'ru') {
        whereStr += ((whereStr != '') ? ' and ' : '') + 'a.country_rus="' + this.filterProvider.countryValue + '"';
      }
      else {
        whereStr += ((whereStr != '') ? ' and ' : '') + 'a.country_eng="' + this.filterProvider.countryValue + '"';
      }
    }
    if ((this.filterProvider.mapValue) && ((this.filterProvider.placeValue == '') && (this.filterProvider.mapValue != ''))) {
      let places = new BaseSql(this.http, 'place');
      places.selectDistinct('id', 'name_map="' + this.filterProvider.mapValue + '"').then(res => {
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

    if (this.filterProvider.thematicValue) {

      whereStr += ((whereStr != '') ? ' and ' : '') + '(a.thematic="' + this.filterProvider.thematicValue + '" or a.thematic like "' + this.filterProvider.thematicValue +
        ',%"' + ' or a.thematic like "%,' + this.filterProvider.thematicValue + '" or  a.thematic like "%,' + this.filterProvider.thematicValue + ',%")';
    }
    console.log("(whereStr after thematic=", whereStr);

    /*if (this.partOfName != '') whereStr += ((whereStr != '') ? ' and ' : '') + ' a.name_rus like ' + '"%' + this.partOfName + '%"';
     */
    if (this.filterProvider.placeValue && (this.filterProvider.placeValue != ''))
      whereStr += ((whereStr != '') ? ' and ' : '') + '  a.place="' + this.filterProvider.placeValue + '"';
    if (whereStr != '') whereStr = ' where ' + whereStr;
    console.log('so whereStr is =', whereStr);
    return whereStr;
  }

  setFilter() {
    console.log(this.filterCreateWhereStr());
    //this.filterStr = this.filterCreateWhereStr();

    this.filterProvider.setFilterStr(this.filterCreateWhereStr());
  }

  selectParticipantSearch() {
    //  this.filterStr=this.filterCreateWhereStr();
    this.filterProvider.setFilterStr(this.filterCreateWhereStr());
  }

  /*  cancelFilter() {
   this.filterProvider.thematicField = '';
   this.filterProvider.thematicValue = '';
   this.filterProvider.mapField = '';
   this.filterProvider.mapValue = '';
   this.filterProvider.placeField = '';
   this.filterProvider.placeValue = '';
   this.filterProvider.countryField = '';
   this.filterProvider.countryValue = '';
   this.filterProvider.findName='';

   }*/

  cancelFilterCountry() {
    this.filterProvider.countryField = '';
    this.filterProvider.countryValue = '';

  }

  cancelFilterMap() {
    this.filterProvider.mapField = '';
    this.filterProvider.mapValue = '';

  }

  cancelFilterPlace() {
    this.filterProvider.placeField = '';
    this.filterProvider.placeValue = '';

  }

  cancelFilterThematic() {
    this.filterProvider.thematicField = '';
    this.filterProvider.thematicValue = '';

  }

  cancelFilterName() {
    this.filterProvider.partOfName = '';


  }
}
