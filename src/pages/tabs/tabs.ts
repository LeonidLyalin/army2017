import {Component} from '@angular/core';

import {HomePage} from '../home/home';
import {AboutPage} from '../about/about';
import {MyForumPage} from "../my-forum/my-forum";
import {ThematicPage} from "../thematic/thematic";
import {PatriotExpoMapPage} from "../maps/patriot-expo-map/patriot-expo-map";
import {HallAMapPage} from "../maps/hall-a-map/hall-a-map";
import {ForumMap1Page} from "../maps/forum-map1/forum-map1";


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
  tab6Root: any = HallAMapPage;

  constructor() {

  }
}
