import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {AboutPage} from '../pages/about/about';
import {ContactPage} from '../pages/contact/contact';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';
import {SettingsPage} from '../pages/settings/settings';
import {AccountPage} from '../pages/account/account';
import {EventPage} from '../pages/event/event';
import {ParticipantSql} from '../providers/participant-sql';
import {SplashScreen} from '@ionic-native/splash-screen';
import {HttpModule} from "@angular/http";
import {BrowserModule} from "@angular/platform-browser";
import {StatusBar} from "@ionic-native/status-bar";
import {ParticipantPage} from "../pages/participant/participant";

import {ParticipantApi} from "../pages/shared/participant/participant-api.service";

import {SQLite} from '@ionic-native/sqlite'
import {MyForumPage} from "../pages/my-forum/my-forum";
import {MyForumApi} from "../pages/shared/my-forum/my-forum-api";
import {MyForumSql} from "../providers/my-forum-sql";
import {ParticipantDetailPage} from "../pages/participant-detail/participant-detail";
import {UserData} from "../pages/providers/user-data";
import {LoginPage} from "../pages/login/login";
import {IonicStorageModule} from '@ionic/storage';
import {ConferenceData} from "../pages/providers/conference-data";
import {SupportPage} from "../pages/support/support";
import {SignupPage} from "../pages/signup/signup";
import {SchedulePage} from "../pages/schedule/schedule";
import {MapPage} from "../pages/map/map";
import {SpeakerListPage} from "../pages/speaker-list/speaker-list";
import {TutorialPage} from "../pages/tutorial/tutorial";
import {UserApi} from "../pages/shared/user/user-api.service";

import {ParkPatriotPage} from "../pages/park-patriot-all/park-patriot/park-patriot";
import {WarTacticPage} from "../pages/park-patriot-all/war-tactic-page/war-tactic-page";
import {ForumMapPage} from "../pages/maps/forum-map/forum-map";
import {SectorVksPage} from "../pages/park-patriot-all/sektor-vks-page/sector-vks-page";
import {DemoOpkPage} from "../pages/park-patriot-all/demo-opk-page/demo-opk-page";
import {ConferencePageJson} from "../pages/conference-json/conference-json";
import {WaterClusterMapPage} from "../pages/maps/water-cluster-map/water-cluster-map";
import {GroundClusterMapPage} from "../pages/maps/ground-cluster-map/ground-cluster-map";
import {AirClusterMapPage} from "../pages/maps/air-cluster-map/air-cluster-map";
import {ParkPatriotMapPage} from "../pages/maps/park-patriot-map/park-patriot-map";
import {PlaceSql} from '../providers/place-sql/place-sql';
import {ThematicSql} from '../providers/thematic-sql';
import {ThematicPage} from "../pages/thematic/thematic";
import {ThematicApi} from "../pages/shared/thematic/thematic-api-service";
import {PatriotExpoMapPage} from "../pages/maps/patriot-expo-map/patriot-expo-map";
import {PlaceApi} from "../pages/shared/place/place-api-service";
import {HallAMapPage} from "../pages/maps/hall-a-map/hall-a-map";
import {HallBMapPage} from "../pages/maps/hall-b-map/hall-b-map";
import {ForumMap1Page} from "../pages/maps/forum-map1/forum-map1";
import {DrawFunctionProvider} from '../providers/draw-function/draw-function';
import {ConferenceSql} from '../providers/conference-sql/conference-sql';
import {ThematicConferenceSql} from '../providers/thematic-conference-sql/thematic-conference-sql';
import {ConferencePage} from "../pages/conference/conference";
import {ConferenceApi} from "../providers/conference-sql/conference-api-service";

import {MapSql} from "../providers/map-sql/map-sql";

import {ConferenceDetailPage} from "../pages/conference-detail/conference-detail";
import {BaseApi} from "../pages/shared/base-api-service";
import {HallCMapPage} from "../pages/maps/hall-c-map/hall-c-map";
import {HallDMapPage} from "../pages/maps/hall-d-map/hall-d-map";
import { MapBaseProvider } from '../providers/map-base/map-base';
import {LeafletMapPage} from "../pages/maps/leaflet-map/leaflet-map";
import {FilterPage} from "../pages/filter/filter";
import {FilterParticipantPage} from "../pages/filter/filter-participant/filter-participant";
import { FilterParticipantProvider } from '../providers/filter-provider/filter-participant-provider';
import { LanguageProvider } from '../providers/language/language';
import {FilterConferenceProvider} from "../providers/filter-provider/filter-conference-provider";
import {FilterConferencePage} from "../pages/filter/filter-conference/filter-conference";
import {DemoProgramPage} from "../pages/demo-propgram/demo-program";

import {TableActionSql} from "../providers/table-action-sql/thematic-action-sql";
import { BaseLangPageProvider } from '../providers/base-lang-page/base-lang-page';
import {ParticipantHelpPage} from "../pages/help/participant-help/participant-help";
import {ConferenceHelpPage} from "../pages/help/conference-help/conference-help";
import { BaseListPageProvider } from '../providers/base-list-page/base-list-page';




@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    SettingsPage,
    AccountPage,
    EventPage,
    ParticipantPage,
    MyForumPage,
    ParticipantDetailPage,
    LoginPage,
    SupportPage,
    SignupPage,
    SchedulePage,
    SpeakerListPage,
    TutorialPage,
    MapPage,

    ParkPatriotPage,
    WarTacticPage,
    ForumMapPage,
    SectorVksPage,
    DemoOpkPage,
    ConferencePageJson,
    WaterClusterMapPage,
    GroundClusterMapPage,
    AirClusterMapPage,
    ParkPatriotMapPage,
    ThematicPage,
    PatriotExpoMapPage,
    HallAMapPage,
    HallBMapPage,
    ForumMap1Page,
    ConferencePage,
    ConferenceDetailPage,
    HallCMapPage,
    HallDMapPage,
    LeafletMapPage,
    FilterPage,
    FilterParticipantPage,
    FilterConferencePage,
    DemoProgramPage,
    ParticipantHelpPage,
    ConferenceHelpPage



  ],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot(),
    HttpModule,
    IonicModule.forRoot(MyApp,{}, {
      links: [
        { component: TabsPage, name: 'TabsPage', segment: 'tabs-page' },
        { component: SchedulePage, name: 'Schedule', segment: 'schedule' },
        { component: MapPage, name: 'Map', segment: 'map' },
        { component: AboutPage, name: 'About', segment: 'about' },
        { component: TutorialPage, name: 'Tutorial', segment: 'tutorial' },
        { component: SupportPage, name: 'SupportPage', segment: 'support' },
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
        { component: AccountPage, name: 'AccountPage', segment: 'account' },
        { component: SignupPage, name: 'SignupPage', segment: 'signup' }
      ]
    }),

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    SettingsPage,
    AccountPage,
    EventPage,
    ParticipantPage,
    MyForumPage,
    ParticipantDetailPage,
    LoginPage,
    SupportPage,
    SignupPage,
    SchedulePage,
    SpeakerListPage,
    TutorialPage,
    MapPage,

    ParkPatriotPage,
    WarTacticPage,
    ForumMapPage,
    SectorVksPage,
    DemoOpkPage,
    ConferencePageJson,
    WaterClusterMapPage,
    GroundClusterMapPage,
    AirClusterMapPage,
    ParkPatriotMapPage,
    ThematicPage,
    PatriotExpoMapPage,
    HallAMapPage,
    HallBMapPage,
    ForumMap1Page,
    ConferencePage,
    ConferenceDetailPage,
    HallCMapPage,
    HallDMapPage,
    LeafletMapPage,
    FilterPage,
    DemoProgramPage,
    ParticipantHelpPage,
    ConferenceHelpPage




  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
    SplashScreen,
    StatusBar,
    SQLite,
    ParticipantApi,
    MyForumApi,
    UserApi,
    UserData,

    ConferenceData,
    ParticipantSql,
    PlaceApi,
    MyForumSql,
    PlaceSql,
    ThematicSql,
    ThematicApi,
    DrawFunctionProvider,
    ThematicConferenceSql,
    ConferenceSql,
    ThematicConferenceSql,
    ConferenceApi,

    ConferenceApi,
    MapSql,

    BaseApi,
    MapBaseProvider,
    FilterParticipantPage,
    FilterConferencePage,
    FilterParticipantProvider,
    LanguageProvider,
    FilterConferenceProvider,
    TableActionSql,
    BaseLangPageProvider,
    BaseListPageProvider







  ]
})
export class AppModule {
}
