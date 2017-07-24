import {Component} from '@angular/core';
import {Events, NavController, NavParams, ToastController} from 'ionic-angular';
import {MyForumSQL} from "../../providers/my-forum-sql";
import {ConferenceSql} from "../../providers/conference-sql/conference-sql";
import {ConferenceApi} from "../../providers/conference-sql/conference-api-service";
import {Http} from "@angular/http";
import {ConferenceDetailPage} from "../conference-detail/conference-detail";
import {map, MapSql} from "../../providers/map-sql/map-sql";
import {place, PlaceSql} from "../../providers/place-sql/place-sql";


import {LeafletMapPage} from "../maps/leaflet-map/leaflet-map";
import {FilterConferenceProvider} from "../../providers/filter-provider/filter-conference-provider";


/**
 * Generated class for the ConferencePageJson page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-conference',
  templateUrl: 'conference.html',
})
export class ConferencePage {

  partOfName = '';
  conferenceList: any = {};
  userId: any;
  iblockId: any = 14;
  thematicSearch = '';


  lang: string;

  showFilter: boolean = false;


  //interface strings
  setFilterStr: string;
  cancelFilterStr: string;
  title: string;
  addMyForumStr: string;
  delMyForumStr: string;
  loadStr: string;
  filterStr: string;

  constructor(public navCtrl: NavController,
              public http: Http,
              public conferencetApi: ConferenceApi,
              public conferenceSql: ConferenceSql,
              public sqlMyForum: MyForumSQL,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public mapSql: MapSql,
              public placeSql: PlaceSql,
              public filterProvider: FilterConferenceProvider,
              public events: Events) {


    this.conferenceList = [];
    console.log("navParams in constructor", navParams);
    console.log("navParams==null", this.navParams == null);
    console.log("navParams.data.length", navParams.data.length);
    let param = navParams.get('select');
    console.log("navParams.get('select')", param);
    if (param == 'thematicConference') {
      let toast = this.toastCtrl.create({
        message: 'Загрузка из API ',
        duration: 5000
      });
      toast.present();
      console.log("navParams.data", navParams.data.data);
      this.conferenceList = navParams.data.data;
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

  /* changeDateSegment(dateNew) {
     this.dateSegment = dateNew;
   }*/

  showHideFilter() {
    if (this.showFilter) this.showFilter = false;
    else this.showFilter = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConferencePage');

    this.userId = localStorage.getItem('userid');
    this.lang = localStorage.getItem('lang');
    if (this.lang == 'ru') this.setRussianStrings();
    else this.setEnglishStrings();
    console.log("this.navParams=", this.navParams);
    console.log("this.navParams.data=", this.navParams.data);
    console.log("navParams==null", this.navParams == null);
    let param = this.navParams.get('select');
    if (param == 'thematicConference') {
      console.log("this.navParams in ioViewDidLoad =", this.navParams);
      this.conferenceList = this.navParams.data;
    }
    else {
      this.conferenceRefresh();

    }

  }

  conferenceRefresh() {
    console.log("this.selectConferenceAll()");
    let toast = this.toastCtrl.create({
      message: this.loadStr,
      duration: 5000
    });
    toast.present();
    this.selectConferenceAll();


  }


  getConferenceApi() {
    console.log('run promise. run!');

    this.conferencetApi.getConference().subscribe(data => {
      console.log("here are the results");
      console.log(data);
      this.conferenceList = data
    });

  }


  /**
   * Show the detail view of the conferenceList
   * @param conferenceList - record in the json format for current conferenceList element
   */
  goToConferenceDetail(conferenceSingle) {
    console.log("goToParticipantDetail()");
    console.log(conferenceSingle);
    // go to the session detail page
    // and pass in the session data
    this.navCtrl.push(ConferenceDetailPage, {
      conferenceSingle
    });
  }


  /**
   * get records from conferenceList infoblock on site and change records in the table "conferenceList"
   */
  /*refreshCoference() {
    //let tmpParticipant: any = [];
    console.log('run refresh run!');
    this.conferencetApi.getConference().subscribe(data => {
      console.log("here are the results for refresh");
      console.log(data);
      ///   tmpConference = data;
      console.log("refresh for just began");
      for (let conference of data) {
        console.log("conferenceList.id");
        console.log(conference.id);
        console.log(conference.name_rus);
        console.log("this.checkConferenceForId(conferenceList.id)");
        // console.log(this.checkParticipantForId(conferenceList.id));

        this.conferenceSql.checkForId(conference.id).then(res => {
          if (res) {
            console.log("there was true")
            this.conferenceSql.delId(conference.id).then(
              res => {
                console.log("try to add new conferenceList after delete")
                this.addOneItemConference(conference);
              });
          }
          else {
            console.log("there was false")
            console.log("try to add new conferenceList without delete")
            this.addOneItemConference(conference);
          }
        });
      }
    });

    this.sqlMyForum.getRusConference().then(res => {

      console.log('our select in refresh conferenceList');
      console.log(res);
      this.conferenceList = res;
    });
  }*/


  addOneItemConference(conferenceSingle) {

    console.log('try to insert');
    console.log(conferenceSingle);
    this.conferenceSql.addItemConference(conferenceSingle
    ).then(res => {
        console.log('success');
        console.log(res);
      }
    ).catch(err => {
      console.error('Unable to insert storage tables', err.tx, err.err);
    })


  }


  /**
   * add Items from this.conferenceList property to the table "conferenceList"
   */
  addItemConference() {
    for (let conferenceSingle of this.conferenceList) {


      console.log('try to insert');
      console.log("conferenceSingle=", conferenceSingle);
      this.conferenceSql.addItemConference(conferenceSingle)
        .then(res => {
            console.log('success');
            console.log(res);

          }
        ).catch(err => {
        console.error('Unable to insert storage tables', err.tx, err.err);

      })

    }
  }


  selectConferenceAll(whereStr = '') {
    console.log("selectConferenceAll() where=", whereStr);
    console.log("selectConferenceAll() lang", this.lang);
    if (this.lang == 'ru') {
      this.sqlMyForum.getRusConference(whereStr).then(res => {
        console.log('this.sqlMyForum.getRusConference().then( res=', res);
        console.log('(<conferenceRusMyForum[]>res).length=', (<any[]>res).length);
        if ((<any[]>res).length) {
          console.log('selectConferenceAll() after  select res');
          console.log(res);
          this.conferenceList = <any[]>res;
          console.log("this.conferenceList");
          console.log(this.conferenceList);
        }
        else {
          let toast = this.toastCtrl.create({
            message: 'API запрос и запись в базу',
            duration: 5000
          });
          toast.present();
          console.log(' this.getPlaceApiInsertBase()');
          this.getConferenceApiInsertBase();
        }
      })
    }
    else {
      this.sqlMyForum.getEngConference(whereStr).then(res => {
        console.log('this.sqlMyForum.getEngConference().then( res=', res);
        console.log('(<any[]>res).length=', (<any[]>res).length);
        if ((<any[]>res).length) {
          console.log('selectConferenceAll() after  select res');
          console.log(res);
          this.conferenceList = <any[]>res;
          console.log("this.conferenceList");
          console.log(this.conferenceList);
        }
        else {
          let toast = this.toastCtrl.create({
            message: 'API запрос и запись в базу',
            duration: 5000
          });
          toast.present();
          console.log(' this.getPlaceApiInsertBase()');
          this.getConferenceApiInsertBase();
        }
      })
    }
  }


/*  deleteConferenceAll() {
    this.conferenceSql.delAll();
  }*/

/*
  deleteConferenceOne(id) {
    this.conferenceSql.delId(id).then(

    );
  }
*/


  getConferenceApiInsertBase() {
    this.conferencetApi.getConference().subscribe(data => {
      console.log("here are the results");
      console.log(data);

      this.conferenceList = data;
      this.addItemConference();
    });
  }

  deleteFromMyForum(id) {
    this.sqlMyForum.delFromMyForum(id).then(res => {
      this.conferenceRefresh();
    });

  }

  /**
   * add a record in to the myforum table and in site infoblock "myforum" for current Conference element
   * @param id
   */
  addToMyForumSite(id) {
    this.sqlMyForum.addToMyForumSite(id, this.iblockId, this.userId, this.conferenceList).then(res => {

        console.log("and refresh now");
        console.log("res=", res);

      }
    );

  }

  removeSelection() {
    this.thematicSearch = '';
  }


  showMapConference() {
    this.placeSql.select().then(res => {
      let place: place[] = (<place[]>res);
      this.mapSql.getRecordForFieldValue('name_map', "'" + place[0].name_map + "'").then(res => {
        console.log("res=", res);
        let map = <map[]>res;
        this.navCtrl.push(LeafletMapPage, {
          typeOfMap: 'conference',
          popupElement: this.conferenceList,
          place: place,
          map: map
        });
      });
    });
  }

  setRussianStrings() {
    console.log('this.setRussianStrings()');
    this.setFilterStr = 'Установить';
    this.cancelFilterStr = 'Отменить';
    this.title = 'Конференция';
    this.addMyForumStr = 'В "Мой форум"';
    this.delMyForumStr = 'Удалить из "Мой форум"';
    this.loadStr='Загрузка...';
  }

  setEnglishStrings() {
    console.log('this.setEnglishStrings()');
    this.setFilterStr = 'Set';
    this.cancelFilterStr = 'Cancel';
    this.title = 'Conference';
    this.addMyForumStr = 'Add in "My Forum"';
    this.delMyForumStr = 'Del from "My Forum"';
    this.loadStr='Loading...';
  }

  setFilterStrConference() {
    this.filterStr = this.filterProvider.filterStr;
    console.log("this.filterStr", this.filterStr);
    if (this.lang == 'ru') {
      this.sqlMyForum.getRusConference(this.filterStr).then(res => {
        console.log('our select');
        console.log(res);
        this.conferenceList = res;
        this.showHideFilter();
      });
    } else {
      this.sqlMyForum.getEngConference(this.filterStr).then(res => {
        console.log('our select');
        console.log(res);
        this.conferenceList = res;
        this.showHideFilter();
      });
    }
  }

  cancelFilterStrConference() {
    this.filterProvider.cancelFilter();
    this.showHideFilter();
  }
}
