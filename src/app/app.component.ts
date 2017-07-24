import {Component, ViewChild} from '@angular/core';
import {Events, MenuController, Nav, Platform} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {TabsPage} from '../pages/tabs/tabs';

import {SettingsPage} from '../pages/settings/settings';
import {AccountPage} from '../pages/account/account';
import {EventPage} from '../pages/event/event';
import {MyForumPage} from '../pages/my-forum/my-forum';
import {ParticipantPage} from "../pages/participant/participant";
import {LoginPage} from "../pages/login/login";
import {SupportPage} from "../pages/support/support";
import {SignupPage} from "../pages/signup/signup";
import {SchedulePage} from "../pages/schedule/schedule";
import {MapPage} from "../pages/map/map";
import {AboutPage} from "../pages/about/about";
import {SpeakerListPage} from "../pages/speaker-list/speaker-list";
import {ConferenceData} from "../pages/providers/conference-data";
import {UserData} from "../pages/providers/user-data";
import {TutorialPage} from "../pages/tutorial/tutorial";


import {Storage} from '@ionic/storage';
import {HomePage} from "../pages/home/home";

import {ParkPatriotPage} from "../pages/park-patriot-all/park-patriot/park-patriot";
import {WarTacticPage} from "../pages/park-patriot-all/war-tactic-page/war-tactic-page";
import {Http} from "@angular/http";


export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}


@Component({
  templateUrl: 'app.html'
})
export class MyApp {


  @ViewChild(Nav) nav: Nav;
  rootPage: any;

  lang: string;
  language: string;
  langVal: boolean;

  //interface stings
  menuStr: string;
  signUpStr: string;
  infoStr: string;
  aboutForumStr: string;
  pages: PageInterface[] = [

    {title: 'Homepage', name: 'HomePage', component: HomePage, icon: 'home'},
    {title: 'Settings', name: 'SettingsPage', component: SettingsPage, icon: 'settings'},
    {title: 'Account', name: 'AccountPage', component: AccountPage, icon: 'person'},
    {title: 'Программа', name: 'EventPage', component: EventPage, icon: 'calendar'},
    {title: 'Участники', name: 'ParticipantPage', component: ParticipantPage, icon: 'list'},
    {title: 'Мой форум', name: 'MyForumPage', component: MyForumPage, icon: 'bookmark'},
    {title: 'Карта', name: 'MapPage', component: MapPage, icon: 'map'},

    {title: 'О Форуме', name: 'AboutPage', component: AboutPage, icon: 'information-circle'},
    {title: 'Парк Патриот', name: 'ParkPatrionPage', component: ParkPatriotPage, icon: 'information-circle'},
    {title: 'Центр военно-тактических игр', name: 'WarTacticPage', component: WarTacticPage, icon: 'information-circle'}

  ];

  loggedInPages: PageInterface[] = [
    {title: 'Профиль', name: 'AccountPage', component: AccountPage, icon: 'person'},
    {title: 'Обратная связь', name: 'SupportPage', component: SupportPage, icon: 'help'},
    {title: 'Выйти', name: 'TabsPage', component: TabsPage, icon: 'log-out', logsOut: true}

  ];
  loggedOutPages: PageInterface[] = [
    {title: 'Войти', name: 'LoginPage', component: LoginPage, icon: 'log-in'},
    {title: 'Обратная связь', name: 'SupportPage', component: SupportPage, icon: 'help'},
    {title: 'Зарегистрироваться', name: 'SignupPage', component: SignupPage, icon: 'person-add'}];


  appPages: PageInterface[] = [
    {title: 'Программа', name: 'TabsPage', component: TabsPage, tabComponent: SchedulePage, index: 0, icon: 'calendar'},
    {
      title: 'Контакты',
      name: 'TabsPage',
      component: TabsPage,
      tabComponent: SpeakerListPage,
      index: 1,
      icon: 'contacts'
    },
    {title: 'Карта', name: 'TabsPage', component: TabsPage, tabComponent: MapPage, index: 2, icon: 'map'},
    {
      title: 'О форуме',
      name: 'TabsPage',
      component: TabsPage,
      tabComponent: AboutPage,
      index: 3,
      icon: 'information-circle'
    }];


  constructor(public platform: Platform,
              public splashScreen: SplashScreen,
              public statusBar: StatusBar,
              public menu: MenuController,
              public events: Events,
              public userData: UserData,
              public confData: ConferenceData,
              public storage: Storage,
              public http: Http) {

    console.log("hi!");
    this.lang = localStorage.getItem('lang');

    console.log("lang init value=", this.lang);
    if (!this.lang) this.lang = 'ru';

    console.log("lang init after check value=", this.lang);
    this.langVal = !(this.lang == 'ru');
    if (this.lang == 'ru') {
      this.setRussianStrings();
    }
    else {
      this.setEnglishStrings();
    }

    this.events.subscribe('language:change', () => {


      this.lang = localStorage.getItem('lang');
      if (this.lang == 'ru') {
        console.log('this.events.subscribe(language:change) ru= ', this.lang);
        this.setRussianStrings();
      }
      else {
        console.log('this.events.subscribe(language:change) en= ', this.lang);
        this.setEnglishStrings();
      }
    });
    // localStorage.setItem('lang', 'ru');

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.backgroundColorByName("red");
      this.splashScreen.hide();
    });
    // used for an example of ngFor and navigation


    localStorage.setItem('viewcount', '0');
    this.storage.get('hasSeenTutorial').then((hasSeenTutorial) => {
      if (hasSeenTutorial) {
        this.rootPage = TabsPage;
      } else {
        this.rootPage = TutorialPage;
      }
      this.platformReady()
    });
    confData.load();

    // decide which menu items should be hidden by current login status stored in local storage
    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      this.enableMenu(hasLoggedIn === true);
    });
    this.enableMenu(true);

    this.listenToLoginEvents();

  }
  openPage(page: PageInterface) {
    let params = {};

    // the nav component was found using @ViewChild(Nav)
    // setRoot on the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      params = { tabIndex: page.index };
    }

    // If we are already on tabs just change the selected tab
    // don't setRoot again, this maintains the history stack of the
    // tabs even if changing them from the menu
    if (this.nav.getActiveChildNavs().length && page.index != undefined) {
      this.nav.getActiveChildNavs()[0].select(page.index);
      // Set the root of the nav with params if it's a tab index
    } else {
      this.nav.setRoot(page.name, params).catch((err: any) => {
        console.log(`Didn't set nav root: ${err}`);
      });
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      this.userData.logout();
    }
  }

  openTutorial() {
    this.nav.setRoot(TutorialPage);
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNavs()[0];

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return;
  }

  /* openPage(page) {
   // Reset the content nav to have just this page
   // we wouldn't want the back button to show in this scenario
   console.log(page.title);
   this.nav.setRoot(page.component);
   }
   */
  initializeApp() {
    /**
     * create all tables
     */

  }

  setRussianStrings() {
    this.menuStr = 'Меню';
    this.signUpStr = 'Регистрация';
    this.infoStr = 'Справочная информация';
    this.aboutForumStr = 'Информация о форуме';
    this.loggedInPages = [
      {title: 'Профиль', name: 'AccountPage', component: AccountPage, icon: 'person'},
      {title: 'Обратная связь', name: 'SupportPage', component: SupportPage, icon: 'help'},
      {title: 'Выйти', name: 'TabsPage', component: TabsPage, icon: 'log-out', logsOut: true}

    ];
    this.loggedOutPages = [
      {title: 'Войти', name: 'LoginPage', component: LoginPage, icon: 'log-in'},
      {title: 'Обратная связь', name: 'SupportPage', component: SupportPage, icon: 'help'},
      {title: 'Зарегистрироваться', name: 'SignupPage', component: SignupPage, icon: 'person-add'}];


    this.appPages = [
      {
        title: 'Программа',
        name: 'TabsPage',
        component: TabsPage,
        tabComponent: SchedulePage,
        index: 0,
        icon: 'calendar'
      },
      {
        title: 'Контакты',
        name: 'TabsPage',
        component: TabsPage,
        tabComponent: SpeakerListPage,
        index: 1,
        icon: 'contacts'
      },
      {title: 'Карта', name: 'TabsPage', component: TabsPage, tabComponent: MapPage, index: 2, icon: 'map'},
      {
        title: 'О форуме',
        name: 'TabsPage',
        component: TabsPage,
        tabComponent: AboutPage,
        index: 3,
        icon: 'information-circle'
      }];

  }

  setEnglishStrings() {
    this.menuStr = 'Menu';
    this.signUpStr = 'Sign Up';
    this.infoStr = 'Info';
    this.aboutForumStr = 'About Forum';

    this.loggedInPages = [
      {title: 'Profile', name: 'AccountPage', component: AccountPage, icon: 'person'},
      {title: 'Help', name: 'SupportPage', component: SupportPage, icon: 'help'},
      {title: 'Log out', name: 'TabsPage', component: TabsPage, icon: 'log-out', logsOut: true}

    ];
    this.loggedOutPages = [
      {title: 'Log in', name: 'LoginPage', component: LoginPage, icon: 'log-in'},
      {title: 'Help', name: 'SupportPage', component: SupportPage, icon: 'help'},
      {title: 'Sign up', name: 'SignupPage', component: SignupPage, icon: 'person-add'}];


    this.appPages = [
      {
        title: 'Programm',
        name: 'TabsPage',
        component: TabsPage,
        tabComponent: SchedulePage,
        index: 0,
        icon: 'calendar'
      },
      {
        title: 'Contacts',
        name: 'TabsPage',
        component: TabsPage,
        tabComponent: SpeakerListPage,
        index: 1,
        icon: 'contacts'
      },
      {title: 'Map', name: 'TabsPage', component: TabsPage, tabComponent: MapPage, index: 2, icon: 'map'},
      {
        title: 'About',
        name: 'TabsPage',
        component: TabsPage,
        tabComponent: AboutPage,
        index: 3,
        icon: 'information-circle'
      }];

  }

  /*openPage(page: PageInterface) {
    let params = {};

    console.log(page, name);

    // the nav component was found using @ViewChild(Nav)
    // setRoot on the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      params = {tabIndex: page.index};
    }

    // If we are already on tabs just change the selected tab
    // don't setRoot again, this maintains the history stack of the
    // tabs even if changing them from the menu
    if (this.nav.getActiveChildNav() && page.index != undefined) {
      this.rootPage=page.component;
      this.nav.getActiveChildNav().select(page.index);
      // Set the root of the nav with params if it's a tab index
    } else {
      this.nav.setRoot(page.component, params).catch((err: any) => {
        console.log(`Didn't set nav root: ${err}`);
      });
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      this.userData.logout();
    }
  }*/


/*  openTutorial() {
    this.nav.setRoot(TutorialPage);
  }*/

/*  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      console.log(" this.enableMenu(true); user:login");
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      console.log(" this.enableMenu(true); 'user:signup");
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      console.log(" this.enableMenu(false); user:logout");
      this.enableMenu(false);
    });
  }*/

/*  enableMenu(loggedIn: boolean) {
    console.log("from enable menu loggedIn=", loggedIn);
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }*/

/*
  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
  }
*/

/*  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNav();

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      //  console.log("childNav",page.name );
      if (childNav.getSelected() && childNav.getSelected().root === page.tabName) {
        console.log("page.tabName=" + page.tabName);
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      console.log("this.nav.getActive() return primary");
      return 'primary';
    }
    return;
  }*/

  setLangRuEn() {
    console.log('setLangRuEn ru before=', this.lang);
    if (this.lang == 'ru') {
      this.lang = 'en';

      this.language = 'English';
      localStorage.setItem('lang', 'en');
      console.log('set language=', 'en');
      this.events.publish('language:change');

    }
    else {
      this.lang = 'ru';
      this.language = 'Русский';
      localStorage.setItem('lang', 'ru');
      console.log('set language=', 'ru');
      this.events.publish('language:change');
    }

  }
}
