import {Component} from '@angular/core';

import {HomePage} from '../home/home';
import {AboutPage} from '../about/about';
import {MyForumPage} from "../my-forum/my-forum";

import {Events, NavController} from "ionic-angular";
import {BaseLangPageProvider} from "../../providers/base-lang-page/base-lang-page";
import {Http} from "@angular/http";
import {BarScannerPage} from "../bar-scanner/bar-scanner";


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage extends BaseLangPageProvider {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = AboutPage;
  tab3Root: any = MyForumPage;
  tab4Root: any = BarScannerPage;

//interface strings
  homeStr: string = 'Home';
  aboutStr: string = 'About';
  myForumStr: string = 'Мой форум';
  mapStr: string = 'Карты';
  thematicStr: string = 'Тематика';
  qrScannerStr: string = 'QR сканер';
  lang: string;

  constructor(public navCtrl: NavController,
              public events: Events,
              public http: Http) {
    super(navCtrl, events, http);


  }

  setRussianStrings() {
    super.setRussianStrings();
    this.homeStr = 'Главная';
    this.aboutStr = 'О Форуме';
    this.myForumStr = 'Мой форум';
    this.mapStr = 'Карты';
    this.thematicStr = 'Тематика';
    this.qrScannerStr= 'QR сканер';
  }

  setEnglishStrings() {
    super.setEnglishStrings();
    this.homeStr = 'Home';
    this.aboutStr = 'About';
    this.myForumStr = 'My Forum';
    this.mapStr = 'Map';
    this.thematicStr = 'Thematic';
    this.qrScannerStr= 'QR scanner';

  }

  ionViewDidLoad() {
    super.ionViewDidLoad();

  }
}
