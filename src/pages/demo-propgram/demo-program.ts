import {Component} from '@angular/core';
import {Events, NavController, NavParams, ToastController} from 'ionic-angular';
import {MyForumSql} from "../../providers/my-forum-sql";
import {conferenceRusMyForum, ConferenceSql} from "../../providers/conference-sql/conference-sql";
import {Http} from "@angular/http";
import {ConferenceDetailPage} from "../conference-detail/conference-detail";
import {MapSql} from "../../providers/map-sql/map-sql";
import {place, PlaceSql} from "../../providers/place-sql/place-sql";
import {FilterConferenceProvider} from "../../providers/filter-provider/filter-conference-provider";
import {BaseApi} from "../shared/base-api-service";


@Component({
  selector: 'page-demo-program',
  templateUrl: 'demo-program.html',
})
export class DemoProgramPage {

  partOfName = '';
  demoProgramList: any = {};
  userId: any;
  iblockId: any = 14;
  thematicSearch = '';



  lang:string;



  placeList: place[] = [];




  showFilter: boolean = false;


  //interface strings
  setFilterStr: string;
  cancelFilterStr: string;
  title: string;

  filterStr: string;
  /**
   * @TODO change ConferenceApi for Base api for ConferenceSql
   */
  constructor(public navCtrl: NavController,
              public http: Http,
              public demoProgramApi: BaseApi,


              public conferenceSql: ConferenceSql,
              public sqlMyForum: MyForumSql,

              public navParams: NavParams,
              public toastCtrl: ToastController,

              public mapSql: MapSql,
              public placeSql: PlaceSql,

              public filterProvider: FilterConferenceProvider,
              public events: Events) {


    this.demoProgramList = [];
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
      this.demoProgramList = navParams.data.data;
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


  showHideFilter() {
    this.showFilter = !this.showFilter;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ');

    this.userId = localStorage.getItem('userid');

    console.log("this.navParams=", this.navParams);
    console.log("this.navParams.data=", this.navParams.data);
    console.log("navParams==null", this.navParams == null);
    let param = this.navParams.get('select');
    if (param == 'thematicConference') {
      console.log("this.navParams in ioViewDidLoad =", this.navParams);
      this.demoProgramList = this.navParams.data;
    }
    else {
      this.conferenceRefresh();

    }

  }

  conferenceRefresh() {
    console.log("this.selectConferenceAll()");
    let toast = this.toastCtrl.create({
      message: 'Загрузка из базы ',
      duration: 5000
    });
    toast.present();
    this.selectConferenceAll();
    console.log("step 1");





  }


  /*getConferenceApi() {
    console.log('run promise. run!');

    this.demoProgramApi.getApi(`http://army2017.ru/api/conference_list.php`).subscribe(data => {
      console.log("here are the results");
      console.log(data);
      this.demoProgramList = data
    });

  }*/


  /**
   *
   * @param conferenceSingle
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
   * get records from demoProgramList infoblock on site and change records in the table "demoProgramList"
   */
  /*refreshCoference() {
    //let tmpParticipant: any = [];
    console.log('run refresh run!');
    this.demoProgramApi.getApi(`http://army2017.ru/api/conference_list.php`).subscribe(data => {
      console.log("here are the results for refresh");
      console.log(data);
      ///   tmpConference = data;
      console.log("refresh for just began");
      for (let conference of data) {
        console.log("demoProgramList.id");
        console.log(conference.id);
        console.log(conference.name_rus);
        console.log("this.checkConferenceForId(demoProgramList.id)");
        // console.log(this.checkParticipantForId(demoProgramList.id));

        this.conferenceSql.checkForId(conference.id).then(res => {
          if (res) {
            console.log("there was true")
            this.conferenceSql.delId(conference.id).then(
              res => {
                console.log("try to add new demoProgramList after delete")
                this.addOneItemConference(conference);
              });
          }
          else {
            console.log("there was false")
            console.log("try to add new demoProgramList without delete")
            this.addOneItemConference(conference);
          }
        });
      }
    });

    this.sqlMyForum.getRusConference().then(res => {

      console.log('our select in refresh demoProgramList');
      console.log(res);
      this.demoProgramList = res;
    });
  }*/



  selectConferenceRus() {
    this.sqlMyForum.getRusConference().then(res => {
      console.log('our select');
      console.log(res);
      this.demoProgramList = res;
    })

  }

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
   * add Items from this.demoProgramList property to the table "demoProgramList"
   */
  addItemConference() {
    for (let conferenceSingle of this.demoProgramList) {


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
    this.sqlMyForum.getRusConference(whereStr).then(res => {
      console.log('this.sqlMyForum.getRusConference().then( res=', res);
      console.log('(<conferenceRusMyForum[]>res).length=', (<conferenceRusMyForum[]>res).length);
      if ((<conferenceRusMyForum[]>res).length) {
        console.log('selectConferenceAll() after  select res');
        console.log(res);
        this.demoProgramList = <conferenceRusMyForum[]>res;
        console.log("this.demoProgramList");
        console.log(this.demoProgramList);
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
    /*    this.sqlMyForum.getRusConferenceReturn().subscribe(data => {
     console.log("here are the results of getRusConferenceReturn()");
     console.log(data);
     this.demoProgramList = data


     });*/
  }



  deleteConferenceAll() {
    this.conferenceSql.delAll();
  }

  deleteConferenceOne(id) {
    this.conferenceSql.delId(id).then(

    );
  }


  getConferenceApiInsertBase() {
    this.demoProgramApi.getApi(`http://army2017.ru/api/conference_list.php`).subscribe(data => {
      console.log("here are the results");
      console.log(data);

      this.demoProgramList = data;
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
    this.sqlMyForum.addToMyForumSite(id, this.iblockId, this.userId, this.demoProgramList).then(res => {

        console.log("and refresh now");
        console.log("res=", res);
        /* if (res) {
         for (let conference of this.demoProgramList) {
         if (conference.id == id) conference.my_forum_id = res;
         console.log("demoProgramList after inserting=", this.demoProgramList);

         }
         }*/
        // this.conferenceRefresh();
      }
    );

    // console.log("and refresh now2");
    // this.conferenceRefresh();
  }

  removeSelection() {
    this.thematicSearch = '';
  }

/*

  showMapConference() {
    this.placeSql.select().then(res => {
      let place: place[] = (<place[]>res);
      this.mapSql.getRecordForFieldValue('name_map', "'" + place[0].name_map + "'").then(res => {
        console.log("res=", res);
        let map = <map[]>res;
        this.navCtrl.push(LeafletMapPage, {
          typeOfMap: 'conference',
          popupElement: this.demoProgramList,
          place: place,
          map: map
        });
      });
    });
  }
*/

  setRussianStrings() {
    console.log('this.setRussianStrings()');


    this.setFilterStr = 'Установить';
    this.cancelFilterStr = 'Отменить';
    this.title = 'Конференция';
  }

  setEnglishStrings() {
    console.log('this.setEnglishStrings()');


    this.setFilterStr = 'Set';
    this.cancelFilterStr = 'Cancel';
    this.title = 'Conference';
  }

  setFilterStrConference() {
    this.filterStr = this.filterProvider.filterStr;
    console.log("this.filterStr", this.filterStr);
    this.sqlMyForum.getRusConference(this.filterStr).then(res => {
      console.log('our select');
      console.log(res);
      this.demoProgramList = res;
      this.showHideFilter();
    });
  }

  cancelFilterStrConference() {
    this.filterProvider.cancelFilter();
    this.showHideFilter();
  }
}
