import {Component, ViewChild} from '@angular/core';

import {
  Content, MenuController, NavController, Platform, Slides, LoadingController, Events,
  AlertController
} from 'ionic-angular';

import {AboutPage} from "../about/about";
import {ForumMapPage} from "../maps/forum-map/forum-map";
import {ParkPatriotPage} from "../park-patriot-all/park-patriot/park-patriot";
import {ParticipantPage} from "../participant/participant";
import {ConferencePage} from "../conference/conference";
import {BaseApi} from "../shared/base-api-service";
import {Http} from "@angular/http";
import {BaseSql} from "../../providers/base-sql";
import {TableActionSql} from "../../providers/table-action-sql/thematic-action-sql";
import {BaseLangPageProvider} from "../../providers/base-lang-page/base-lang-page";
import {CustomIconsModule} from 'ionic2-custom-icons';
import {map} from "../../providers/map-sql/map-sql";
import {LeafletMapPage} from "../maps/leaflet-map/leaflet-map";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage extends BaseLangPageProvider {
  showSkip = true;

  public iconHeight: number;
  public iconWidth: number;

  /**
   * number of times this page was loaded
   */
  public viewCount: number;
  public viewCountStr: string;
  // lang: string;
  private iconDivHeight: number = 10;//divider for the evaliation of the icon optimal size according to content width

  @ViewChild('slides') slides: Slides;
  @ViewChild(Content) content: Content;


  //interface strings
  //title: string;
  /*onMapStr: string;
  myForumStr: string;
  thematicStr: string;*/

  aboutForumStr: string;
  mapStr: string;
  participantsStr: string;
  conferenceStr: string;
  demoProgramStr: string;
  howDoYouGetStr: string;
  onTheForumStr: string;
  parkPatriotStr: string;
  answersAndQuestionsStr: string;
  entrancesExitsStr: string;
  restaurantsCafe: string;
  wcStr: string;
  infoStr: string;
  myForumStr: string;
  qrScannerStr: string;
  waitLoadStr: string;

  constructor(public navCtrl: NavController,
              public menu: MenuController,
              public platform: Platform,
              public http: Http,
              public loadingCtrl: LoadingController,
              public events: Events,
              public alertCtrl: AlertController) {
    super(navCtrl, events, http);

  }

  setRussianStrings() {
    super.setRussianStrings('Армия 2017');
    //  this.title = 'Армия 2017';
    this.aboutForumStr = 'О Форуме';
    this.mapStr = 'Карта форума';
    this.participantsStr = 'Участники';
    this.conferenceStr = 'Конференция';
    this.demoProgramStr = 'Демо программа';
    this.howDoYouGetStr = 'Как добраться';
    this.onTheForumStr = 'О Форуме "Армия-2017"';
    this.parkPatriotStr = 'Парк "Патриот"';
    this.answersAndQuestionsStr = 'Вопросы и ответы';
    this.entrancesExitsStr = 'Входы-выходы';
    this.restaurantsCafe = 'Рестораны/кафе';
    this.wcStr = 'Туалеты';
    this.infoStr = 'Справочная информация';
    this.myForumStr = 'Мой форум';
    this.qrScannerStr = 'QR сканнер';
    this.waitLoadStr = 'Загрузка...';
  }

  setEnglishStrings() {
    super.setEnglishStrings('Army 2017');
    //this.title = 'Army 2017';
    this.aboutForumStr = 'About';
    this.mapStr = 'Map';
    this.participantsStr = 'Exhibitors';
    this.conferenceStr = 'Conference';
    this.demoProgramStr = 'Demo program';
    this.howDoYouGetStr = 'How to get to';
    this.onTheForumStr = 'Forum "Army-2017"';
    this.parkPatriotStr = 'Park "Patriot"';
    this.answersAndQuestionsStr = 'Answers & Questions';
    this.entrancesExitsStr = 'Entrances & Exits';
    this.restaurantsCafe = 'Restaurant & Cafe';
    this.wcStr = 'WC';
    this.infoStr = 'Info';
    this.myForumStr = 'My Forum';
    this.qrScannerStr = 'QR scanner';
    this.waitLoadStr = 'Loading...';
  }

  onSlideChangeStart(slider: Slides) {
    this.showSkip = !slider.isEnd();
  }

  ionViewWillEnter() {
    this.iconHeight = this.content.contentHeight / this.iconDivHeight;
    this.iconWidth = this.iconHeight;//must be th same
    console.log("this.iconHeight=" + this.iconHeight);
    this.slides.update();
    this.menu.enable(true);

    this.viewCountStr = localStorage.getItem('viewcount');
    this.viewCount = Number(this.viewCountStr);
    console.log('this.viewCount=', this.viewCount);

    if (this.viewCount == 0) {
      /**
       * init tables of database
       */
      let loader = this.loadingCtrl.create({
        content: this.waitLoadStr,
        duration: 100000,
      });


      let api = new BaseApi(this.http);
      api.getApi('universal_list.php?IBLOCK=21').subscribe(data => {
          console.log("in home.ts after getApi=", data);

          let tableAction = new TableActionSql(this.http);
          for (let i = 0; i < data.length; i++) {

            console.log("data.id", data[i]["ID"]);
            tableAction.checkForId(data[i]["ID"]).then(res => {
              console.log("tableAction.checkForId res=", res);
              if (!res) {
                console.log("data.status", data[i]["STATUS"]);
                console.log("data.fields", data[i]["FIELDS"]);
                let fields = JSON.parse(data[i]["FIELDS"]);
                console.log("fields=", fields);
                console.log("fields.length=", fields.length);
                console.log("fields[1]", fields[1]);
                if (!this.platform.is('core')) {
                  loader.present().then(() => {
                    if (data[i]["STATUS"] == 'recreate') {

                      console.log('mydata[i]["TABLE_NAME"]=', data[i]["TABLE_NAME"]);
                      console.log('fields=', fields);
                      console.log('mydata[i]["STATUS"]=', data[i]["STATUS"]);
                      console.log('constrains=', data[i]["CONSTRAINS"]);
                      let table = new BaseSql(this.http, data[i]["TABLE_NAME"], fields, data[i]["CONSTRAINS"], data[i]["STATUS"]);
                      table.loadApi(data[i]["API_PATH"]);
                    }
                    tableAction.addItem({id: data[i]["ID"]}).then(res => {
                      console.log("tableAction.addItem res=", res);
                      //loader.dismiss();
                    });
                    loader.dismiss();
                  });
                }
              }

            })
            //if this action was never make


          }

        }
      );


    }

    this.viewCount++;
    localStorage.setItem('viewcount', String(this.viewCount));
  }

  /*ionViewDidload() {


  }*/

  aboutPage() {
    this.navCtrl.push(AboutPage);
  }

  forumMapPage() {
    let mapSql = new BaseSql(this.http, 'map');
    mapSql.selectWhere('name_map="forum_map.jpg"').then(res => {

      console.log("res=", res);
      let map = <any>res[0];
      this.navCtrl.push(LeafletMapPage, {
        typeOfMap: 'simple',

        map: map
      });
    });
  };


  // this.navCtrl.push(ForumMapPage);


  parkPatriot() {
    this.navCtrl.push(ParkPatriotPage);
  }

  conferencePage() {
    this.navCtrl.push(ConferencePage, {select: 'all'});
  }


  participantPage() {
    this.navCtrl.push(ParticipantPage, {select: 'all'});
  }


  /*toggleMenu(){
    this.navCtrl.m
  }*/
}


