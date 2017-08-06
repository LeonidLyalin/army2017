import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {BaseLangPageProvider} from "../base-lang-page/base-lang-page";
import {Events, NavController, NavParams} from "ionic-angular";
import {place, PlaceSql} from "../place-sql/place-sql";
import {map, MapSql} from "../map-sql/map-sql";
import {LeafletMapPage} from "../../pages/maps/leaflet-map/leaflet-map";
import {BaseSql} from "../base-sql";

/*
  Generated class for the BaseListPageProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class BaseListPageProvider extends BaseLangPageProvider {

  iblockId: any;

  filterStr: string;

  addMyForumStr: string;
  delMyForumStr: string;
  /*loadStr: string;*/
  listOut: any;


  showFilter: boolean = false;
  colorFilter: string = "white";

  showHelp: boolean = false;
  colorHelp: string = "white";

  showMainList: boolean = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public events: Events,
              public http: Http
        ) {
    super(navCtrl, events, http);
    //console.log('Hello BaseListPageProvider Provider');
    this.listOut = [];

  }

  ionViewDidLoad() {
    super.ionViewDidLoad();

  }

  setRussianStrings(titleStr?) {
    super.setRussianStrings(titleStr);
    this.addMyForumStr = 'В "Мой форум"';
    this.delMyForumStr = 'Удалить из "Мой форум"';
    this.loadStr = 'Загрузка';
  }

  setEnglishStrings(titleStr?) {
    super.setEnglishStrings(titleStr);
    this.addMyForumStr = 'Add in "My Forum"';
    this.delMyForumStr = 'Del from "My Forum"';
    this.loadStr = 'Loading';
  }

  showHideFilter() {
    if (!this.showHelp) {
      if (this.showFilter) {
        this.colorFilter = "white";
        this.showFilter = false;
      }
      else {
        this.colorFilter = "red";
        this.showFilter = true;
      }
    }
    this.showMainList = !(this.showHelp || this.showFilter);

  }

  showHideHelp() {
    if (!this.showFilter) {
      if (this.showHelp) {
        this.colorHelp = "white";
        this.showHelp = false;
      }
      else {
        this.colorHelp = "red";
        this.showHelp = true;
      }
    }
    this.showMainList = !(this.showHelp || this.showFilter);
    //console.log(this.lang);
  }

  showMapList(typeOfMap_in) {
    let placeSql=new PlaceSql(this.http);
    let mapSql=new MapSql(this.http);
    placeSql.selectWhere('id='+this.listOut[0].place).then(res => {
      let place: place[] = (<place[]>res);
      mapSql.getRecordForFieldValue('name_map', "'" + place[0].name_map + "'").then(res => {
        //console.log("res=", res);
        let map = <map[]>res;
        this.navCtrl.push(LeafletMapPage, {
          typeOfMap: typeOfMap_in,
          popupElement: this.listOut,
          place: place,
          map: map
        });
      });
    });
  }

}
