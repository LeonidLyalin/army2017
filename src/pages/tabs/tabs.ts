import {Component} from '@angular/core';

import {HomePage} from '../home/home';
import {AboutPage} from '../about/about';
import {MyForumPage} from "../my-forum/my-forum";
import {ThematicPage} from "../thematic/thematic";
import {HallAMapPage} from "../maps/hall-a-map/hall-a-map";
import {ForumMap1Page} from "../maps/forum-map1/forum-map1";
import {Events} from "ionic-angular";


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = AboutPage;
  tab3Root: any = MyForumPage;
  tab4Root: any = ForumMap1Page;
  tab5Root: any = ThematicPage;

//interface strings
  homeStr: string='Home';
  aboutStr: string='About';
  myForumStr:string='Мой форум';
  mapStr:string='Карты';
  thematicStr:string='Тематика';

  lang: string;

  constructor(public events: Events) {
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
    this.homeStr = 'Главная';
    this.aboutStr = 'О Форуме';
    this.myForumStr = 'Мой форум';
    this.mapStr='Карты';
    this.thematicStr='Тематика';
  }

  setEnglishStrings() {
    this.homeStr = 'Home';
    this.aboutStr = 'About';
    this.myForumStr = 'My Forum';
    this.mapStr='Map';
    this.thematicStr='Thematic';

  }

  ionViewDidLoad(){
    this.lang = localStorage.getItem('lang');
    if (this.lang == 'ru') {
      this.setRussianStrings();
    }
    else {
      this.setEnglishStrings();
    }
  }
}
