import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {BaseLangPageProvider} from "../base-lang-page/base-lang-page";
import {Events, NavController} from "ionic-angular";


@Injectable()
export class FilterExhibitProvider extends BaseLangPageProvider {
  public thematicField: string;


  filterStr: string;
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

  public partOfName: string;

/*  setFilterStr: string;
  cancelFilterStr: string;*/
  findName: string;

  constructor(public navCtrl: NavController,
              public http: Http,
              public events: Events) {
    super(navCtrl, events, http)
    //console.log('Hello FilterExhibitProvider Provider');

  }

  setFilterValue(filterStr) {
    this.filterStr = filterStr;
    //console.log("exhibit this.filterStr", this.filterStr)
  }

  setRussianStrings() {
    super.setRussianStrings();
    this.thematicTitle = 'Тематика';
    this.mapTitle = 'Павильоны';
    this.placeTitle = 'Стенды';
    this.countryTitle = 'Страны';

    //interface strings
    this.setFilterStr = 'Установить';
    this.cancelFilterStr = 'Отменить';
    this.findName = 'Наименование';

  }

  setEnglishStrings(){
    super.setEnglishStrings();
    this.thematicTitle = 'Thema';
    this.mapTitle = 'Hall';
    this.placeTitle = 'Stand';
    this.countryTitle = 'Country';

    //interface strings
    this.setFilterStr = 'Set';
    this.cancelFilterStr = 'Cancel';
    this.findName = 'Name';
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
    this.findName = '';

  }
}
