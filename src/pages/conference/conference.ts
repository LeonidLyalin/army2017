import {Component} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {MyForumSQL} from "../../providers/my-forum-sql";
import {conferenceRusMyForum, ConferenceSql} from "../../providers/conference-sql/conference-sql";
import {ConferenceApi} from "../shared/conference/conference-api-service";
import {Http} from "@angular/http";
import {MyForumApi} from "../shared/my-forum/my-forum-api";
import {UserData} from "../providers/user-data";
import {ConferenceDetailPage} from "../conference-detail/conference-detail";
import {map, MapSql} from "../../providers/map-sql/map-sql";
import {place, PlaceSql} from "../providers/place-sql";
import {
  thematicConference,
  ThematicConferenceSql
} from "../../providers/thematic-conference-sql/thematic-conference-sql";
import {MapApi} from "../shared/map/map-api-service";

import {ThematicConferenceApi} from "../shared/tehematic-conference/thematic-conference-api-service";
import {LeafletMapPage} from "../maps/leaflet-map/leaflet-map";


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
  thematicList: thematicConference[] = [];

  mapList: map[] = [];
  mapSearch: string = '';

  placeList: place[] = [];
  placeSearch: string = '';

  dates: string[] = ["23.08.2017", "24.08.2017", "25.08.2017", "26.08.2017"];

  dateSegment: string = "23.08.2017";

  showFilter: boolean = false;

  constructor(public navCtrl: NavController,
              public http: Http,
              public conferencetApi: ConferenceApi,
              public myForumApi: MyForumApi,
              public conferenceSql: ConferenceSql,
              public sqlMyForum: MyForumSQL,
              public userData: UserData,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public thematicConferenceSql: ThematicConferenceSql,
              public mapSql: MapSql,
              public placeSql: PlaceSql,
              public mapApi: MapApi,
              public thematicApi: ThematicConferenceApi) {


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
  }

  changeDateSegment(dateNew) {
    this.dateSegment = dateNew;
  }

  showHideFilter() {
    if (this.showFilter) this.showFilter = false;
    else this.showFilter = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConferencePageJson');

    this.userId = localStorage.getItem('userid');

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
      message: 'Загрузка из базы ',
      duration: 5000
    });
    toast.present();
    this.selectConferenceAll();
    console.log("step 1");
    this.thematicConferenceSql.select('name_rus').then(res => {
      console.log("after thematic select");
      console.log(res);
      if (res) {
        this.thematicList = <any>res;
        console.log("this.thematicList=", this.thematicList);
      }
      else {
        this.thematicApi.getThematic().subscribe(res => {
          this.thematicList = <any>res;
          this.thematicConferenceSql.addItemList(this.thematicList);
        });

      }
    })
    console.log("step2");

    this.mapSql.select('name_rus').then(res => {
      console.log("this.mapSql.select().then");
      console.log("res=", res);
      if (res) {
        this.mapList = <any>res;
        console.log("this.mapList=", this.mapList);
      }
      else {
        this.mapApi.getMap().subscribe(res => {
          this.mapList = <any>res;
          this.mapSql.addItemList(this.mapList);
        });

      }
    })


  }

  formWhereStr() {
    console.log("this.thematicSearch", this.thematicSearch);
    console.log("this.partOfName=", this.partOfName);
    console.log("(this.placeSearch=", this.placeSearch);
    let whereStr = '';
    if (this.thematicSearch != '') whereStr += ((whereStr != '') ? ' and ' : '') + 'a.thematic_conference="' + this.thematicSearch + '"';
    if (this.partOfName != '') whereStr += ((whereStr != '') ? ' and ' : '') + ' a.name_rus like ' + '"%' + this.partOfName + '%"';
    if (this.placeSearch != '') whereStr += ((whereStr != '') ? ' and ' : '') + '  a.place="' + this.placeSearch + '"';
    if (whereStr != '') whereStr = ' where ' + whereStr;
    return whereStr;
  }

  onThematicChange() {
    console.log("thematicSearch=", this.thematicSearch);

    this.selectConferenceAll(this.formWhereStr());
  }

  onMapChange() {
//form new placeList
    this.placeSql.selectPlaceMap(this.mapSearch).then(res => {
      console.log("<place[]>res=",<place[]>res)
      this.placeList = <place[]>res;
    })
  }

  onPlaceChange() {
    console.log("placeSearch=", this.placeSearch);
    this.selectConferenceAll(this.formWhereStr());
  }

  getConferenceApi() {
    console.log('run promise. run!');

    this.conferencetApi.getConference().subscribe(data => {
      console.log("here are the results");
      console.log(data);
      this.conferenceList = data
    });

  }


  /*console.log('add', id);
   this.myForumApi.addToMyForumSite(this.iblockId, id).subscribe(data => {
   console.log("here are the results of adding through api");
   console.log(data);
   //@TODO make an api and prepare all parameters for insert
   //  this.sqlMyForum.addItemAndSelect(data, this.userId, this.iblockId, id).then(res => {
   this.sqlMyForum.addItem( {id:data, user:this.userId, my_idblock_id:this.iblockId,my_id:id}).then(res => {
   //  {id:data, user:this.userId, my_iblock_id:this.iblockId,my_id:id}
   console.log('added', id);
   console.log(res);
   this.selectConferenceRus()
   });
   });*/


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
  refreshCoference() {
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

        this.conferenceSql.checkConferenceForId(conference.id).then(res => {
          if (res) {
            console.log("there was true")
            this.conferenceSql.delTableId(conference.id, 'conference').then(
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
  }

  /**
   * check whether the record with id = "id" parameter is in "conferenceList" table
   * @param id
   */
  checkParticipantForId(id) {
    this.conferenceSql.checkTableForId(id, 'conference').then(res => {
        console.log("check for conferenceList")
        console.log(res)
        return res;
      }
    );
  }

  selectConferenceRus() {
    this.sqlMyForum.getRusConference().then(res => {
      console.log('our select');
      console.log(res);
      this.conferenceList = res;
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


  selectParticipant() {
    this.conferenceSql.selectConference().then(res => {
      console.log('our select');
      console.log(res);
      this.conferenceList = res;
    })
  }

  selectConferenceAll(whereStr = '') {
    console.log("selectConferenceAll() where=", whereStr);
    this.sqlMyForum.getRusConference(whereStr).then(res => {
      console.log('this.sqlMyForum.getRusConference().then( res=', res);
      console.log('(<conferenceRusMyForum[]>res).length=', (<conferenceRusMyForum[]>res).length);
      if ((<conferenceRusMyForum[]>res).length) {
        console.log('selectConferenceAll() after  select res');
        console.log(res);
        this.conferenceList = <conferenceRusMyForum[]>res;
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
    /*    this.sqlMyForum.getRusConferenceReturn().subscribe(data => {
     console.log("here are the results of getRusConferenceReturn()");
     console.log(data);
     this.conferenceList = data


     });*/
  }


  selectConferenceSearch() {
    this.sqlMyForum.getRusConference(this.formWhereStr()).then(res => {
      console.log('our select');
      console.log(res);
      this.conferenceList = res;
    })
  }

  /*  selectRus() {
   this.conferenceSql.selectRusConference().then(res => {
   console.log('our select');
   console.log(res);
   })
   }*/

  /**
   * delete All records from the table "conferenceList"
   */
  /*deleteAll() {
   this.conferenceSql.delAllConference().then(res => {
   console.log('our select');
   console.log(res);
   })
   }*/

  deleteConferenceAll() {
    this.conferenceSql.delAllConference();
  }

  deleteConferenceOne(id) {
    this.conferenceSql.delTableId(id, 'conference').then(

    );
  }


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
    this.sqlMyForum.addToMyForumSite(id, this.iblockId, this.userId,this.conferenceList).then(res => {

        console.log("and refresh now");
        console.log("res=", res);
       /* if (res) {
          for (let conference of this.conferenceList) {
            if (conference.id == id) conference.my_forum_id = res;
            console.log("conferenceList after inserting=", this.conferenceList);

          }
        }*/
        // this.conferenceRefresh();
      }
    );

    // console.log("and refresh now2");
    // this.conferenceRefresh();
  }

  removeSelection(){
    this.thematicSearch='';
  }


  showMapConference(){
    this.placeSql.selectPlace().then(res => {
      let place: place[] = (<place[]>res);
      this.mapSql.getRecordForFieldValue('name_map', "'" + place[0].name_map + "'").then(res => {
        console.log("res=", res);
        let map = <map[]>res;
        this.navCtrl.push(LeafletMapPage, {typeOfMap:'conference', popupElement: this.conferenceList, place: place, map: map});
      });
    });
  }
}
