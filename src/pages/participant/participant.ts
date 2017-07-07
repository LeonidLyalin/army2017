/**
 * Created by lsl-info on 14.04.17.
 * list of participants
 */
import {Component} from '@angular/core';
import {ModalController, NavController, NavParams, ToastController} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {ParticipantApi} from '../shared/participant/participant-api.service';


import {participant, ParticipantSql} from "../../providers/participant-sql";
import {MyForumSQL} from "../../providers/my-forum-sql";
import {ParticipantDetailPage} from "../participant-detail/participant-detail";
import {MyForumApi} from "../shared/my-forum/my-forum-api";

import {place, PlaceSql} from "../providers/place-sql";
import {map, MapSql} from "../../providers/map-sql/map-sql";
import {LeafletMapPage} from "../maps/leaflet-map/leaflet-map";
import {country} from "../../providers/country-sql/country-sql";
import {ThematicSql} from "../../providers/thematic-sql";
import {ThematicApi} from "../shared/thematic/thematic-api-service";
import {MapApi} from "../shared/map/map-api-service";
import {FilterPage} from "../filter/filter";


@Component({
  selector: 'page-participant',
  templateUrl: 'participant.html',
  providers:[ParticipantSql],
})

export class ParticipantPage {
  partOfName: string = '';
  participants: any;
  userId: any;
  lang:any;
  iblockId: any = 1;

  countrySearch = '';
  countryList: country[] = [];

  mapList: map[] = [];
  mapSearch: string = '';

  placeList: place[] = [];
  placeSearch: string = '';

  thematicList: map[] = [];
  thematicSearch: string = '';

  showFilter: boolean = false;

  constructor(public navCtrl: NavController,
              public http: Http,
              public participantApi: ParticipantApi,
              public myForumApi: MyForumApi,
              public participantSql: ParticipantSql,
              public sqlMyForum: MyForumSQL,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public placeSql: PlaceSql,
              public mapSql: MapSql,
              public thematicSql: ThematicSql,
              public thematicApi: ThematicApi,
              public mapApi: MapApi,
              public modalCtrl: ModalController) {
//подгружаем список участников выставки
    this.participants = [];
    console.log("navParams in constructor", navParams);
    console.log("navParams==null", this.navParams == null);
    console.log("navParams.data.length", navParams.data.length);
    let param = navParams.get('select');
    console.log("navParams.get('select')", param);
    if (param == 'thematic') {
      let toast = this.toastCtrl.create({
        message: 'Загрузка из API ',
        duration: 5000
      });
      toast.present();
      console.log("navParams.data", navParams.data.data);
      this.participants = navParams.data.data;
    }
  }

  getParticipantApi() {
    console.log('run promise. run!');

    this.participantApi.getParticipant().subscribe(data => {
      console.log("here are the results");
      console.log(data);
      this.participants = data
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyForumPage');
    this.userId = localStorage.getItem('userid');

    console.log("this.navParams=", this.navParams);
    console.log("this.navParams.data=", this.navParams.data);
    console.log("navParams==null", this.navParams == null);
    let param = this.navParams.get('select');
    if (param == 'thematic') {
      console.log("this.navParams in ioViewDidLoad =", this.navParams);
      this.participants = this.navParams.data;
    }
    else {
      console.log("this.selectParticipantAll()");
      let toast = this.toastCtrl.create({
        message: 'Загрузка из базы ',
        duration: 2000
      });
      toast.present();
      this.selectParticipantAll()


    }

  }


  /**
   * add a record in to the myforum table and in site infoblock "myforum" for current Participant element
   * @param id
   */
  addToMyForum(id) {
    console.log('add', id);
    this.myForumApi.addToMyForumSite(this.iblockId, id).subscribe(data => {
      console.log("here are the results of adding through api");
      console.log(data);
      //@TODO make an api and prepare all parameters for insert
      //  this.sqlMyForum.addItemAndSelect(data, this.userId, this.iblockId, id).then(res => {
      this.sqlMyForum.addItem({id: data, user: this.userId, my_iblock_id: this.iblockId, my_id: id}).then(res => {
        console.log('added', id);
        console.log(res);
        this.selectParticipantRus()
      });
    });
  }

  /**
   * Show the detail view of the Participant
   * @param participant - record in the json format for current Participant element
   */
  goToParticipantDetail(participant) {
    console.log("goToParticipantDetail()");
    console.log(participant);
    // go to the session detail page
    // and pass in the session data
    this.navCtrl.push(ParticipantDetailPage, {
      participant
    });
  }

  /**
   * get records from Participant infoblock on site and change records in the table "participant"
   */
  participantRefresh() {
    let tmpParticipant: any = [];
    console.log('participantRefresh');
    this.participantApi.getParticipant().subscribe(data => {
      console.log("here are the results for participantRefresh");
      console.log(data);
      tmpParticipant = data;
      console.log("refresh for just began");
      for (let participant of tmpParticipant) {
        console.log("participant.id");
        console.log(participant.id);
        console.log(participant.name_rus);
        console.log("this.checkParticipantForId(participant.id)");
        // console.log(this.checkParticipantForId(participant.id));

        this.participantSql.checkForId(participant.id).then(res => {
          if (res) {
            console.log("there was true")
            this.deleteOneParticipant(participant.id).then(res => {
              console.log("try to add new Participant after delete")
              this.addOneItemParticipant(participant);
            });
          }
          else {
            console.log("there was false")
            console.log("try to add new Participant without delete")
            this.addOneItemParticipant(participant);
          }
        });
      }
      this.sqlMyForum.getRusParticipant().then(res => {

        console.log('our select in refresh participant');
        console.log(res);
        this.participants = res;
      });
      this.thematicSql.select('name_rus').then(res => {
        console.log("after thematic select");
        console.log(res);
        if (res) {
          this.thematicList = <any>res;
          console.log("this.thematicList=", this.thematicList);
        }
        else {
          this.thematicApi.getThematic().subscribe(res => {
            this.thematicList = <any>res;
            this.thematicSql.addItemList(this.thematicList);
          });

        }
      });

      //create country list
      this.participantSql.getTableFieldDistinctList(this.countryList, 'country_rus')
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
      });
    });


  }


  /**
   * open the current database
   */
  /*  openDataBase() {
   this.participantSql.openDb();
   }*/

  /**
   * check whether the record with id = "id" parameter is in "participant" table
   * @param id
   */
  checkParticipantForId(id) {
    this.participantSql.checkForId(id).then(res => {
        console.log("check for participant")
        console.log(res)
        return res;
      }
    );
  }

  selectParticipantRus() {
    this.sqlMyForum.getRusParticipant().then(res => {
      console.log('our select');
      console.log(res);
      this.participants = res;
    })

  }


  addOneItemParticipant(participant) {

    console.log('try to insert');
    console.log(participant);
    this.participantSql.addItemParticipant(participant
    ).then(res => {
        console.log('success');
        console.log(res);
      }
    ).catch(err => {
      console.error('Unable to insert storage tables', err.tx, err.err);
    })


  }

  /**
   * add Items from this.participant property to the table "participant"
   */
  addItemParticipant() {
    for (let participant of this.participants) {


      console.log('try to insert');
      console.log("participant=", participant);
      this.participantSql.addItemParticipant(participant)
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
    this.participantSql.select().then(res => {
      console.log('our select');
      console.log(res);
      this.participants = res;
    })
  }

  selectParticipantAll() {
    this.sqlMyForum.getRusParticipant().then(res => {
      console.log('this.sqlMyForum.getRusParticipant().then( res=', res);
      console.log('(<participant[]>res).length=', (<participant[]>res).length);
      if ((<participant[]>res).length) {
        console.log('our select');
        console.log(res);
        this.participants = res;

        this.sqlMyForum.getRusParticipant().then(res => {

          console.log('our select in refresh participant');
          console.log(res);
          this.participants = res;
        });
        this.thematicSql.select('name_rus').then(res => {
          console.log("after thematic select");
          console.log(res);
          if (res) {
            this.thematicList = <any>res;
            console.log("this.thematicList=", this.thematicList);
          }
          else {
            this.thematicApi.getThematic().subscribe(res => {
              this.thematicList = <any>res;
              this.thematicSql.addItemList(this.thematicList);
            });

          }
        });

        //create country list
        this.participantSql.getTableFieldDistinctList(this.countryList, 'country_rus')
        console.log("selectParticipantAll() step2");


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
        });
      }
      else {
        let toast = this.toastCtrl.create({
          message: 'API запрос и запись в базу',
          duration: 5000
        });
        toast.present();
        console.log(' this.getPlaceApiInsertBase()');
        this.getParticipantApiInsertBase();
      }
    })
  }

  selectParticipantSearch() {
    this.sqlMyForum.getRusParticipant(' where a.name_rus_upper like' + '"%' + this.partOfName.toUpperCase() + '%"').then(res => {
      console.log('our select');
      console.log(res);
      this.participants = res;
    })
  }

  /*
   selectRus() {
   this.participantSql.selectRusParticipant().then(res => {
   console.log('our select');
   console.log(res);
   })
   }*/

  /**
   * delete All records from the table "participant"
   */
  deleteAll() {
    this.participantSql.delAll().then(res => {
      console.log('our select');
      console.log(res);
    })
  }

  /**
   * delete ONE record (with id = "id" from the table "participant"
   * @param id - id of the deleted record
   */
  deleteOneParticipant(id) {
    return new Promise(res => {
      this.participantSql.delId(id).then(res => {
          console.log('deleteOneParticipant()', id);
          console.log(res);
          return res;
        }
      );
    })
  }

  deleteParticipantAll() {
    this.participantSql.delAll();
  }

  getParticipantApiInsertBase() {
    this.participantApi.getParticipant().subscribe(data => {
      console.log("here are the results");
      console.log(data);

      this.participants = data;
      this.addItemParticipant();
    });
  }

  deleteFromMyForum(id) {
    this.sqlMyForum.delFromMyForum(id).then(res => {
        this.selectParticipantAll();
      }
    );
  }

  addToMyForumSite(id) {
    this.sqlMyForum.addToMyForumSite(id, this.iblockId, this.userId).then(res => {
        this.selectParticipantAll();
      }
    );
  }

  showMapParticipant() {
    this.placeSql.selectPlace().then(res => {
      let place: place[] = (<place[]>res);
      this.mapSql.getRecordForFieldValue('name_map', "'" + place[0].name_map + "'").then(res => {
        console.log("res=", res);
        let map = <map[]>res;
        this.navCtrl.push(LeafletMapPage, {
          typeOfMap: 'participant',
          popupElement: this.participants,
          place: place,
          map: map
        });
      });
    });
  }

  onMapChange() {
//form new placeList
    this.placeSql.selectPlaceMap(this.mapSearch).then(res => {
      console.log("<place[]>res=", <place[]>res)
      this.placeList = <place[]>res;
    })
  }

  onPlaceChange() {
    console.log("placeSearch=", this.placeSearch);
    this.sqlMyForum.getRusParticipant(this.formWhereStr());
  }

  formWhereStr() {
    console.log("this.thematicSearch", this.thematicSearch);
    console.log("this.countrySearch", this.countrySearch);
    console.log("this.partOfName=", this.partOfName);
    console.log("(this.placeSearch=", this.placeSearch);
    let whereStr = '';

    if (this.countrySearch != '') whereStr += ((whereStr != '') ? ' and ' : '') + 'a.country_rus="' + this.countrySearch + '"';
    /*  if (this.thematicSearch != '') {
     this.thematicSql.getThematicList(this.thematicSearch).then(res => {
     let thematicStr = <any>res;
     for (let i = 0; i < thematicStr.length(); i++) {

     }

     });



     }*/
    whereStr += ((whereStr != '') ? ' and ' : '') + '(a.thematic="' + this.thematicSearch + '" or a.thematic like "' + this.thematicSearch +
      ',%"' + ' or a.thematic like "%,' + this.thematicSearch + '" or  a.thematic like "%,' + this.thematicSearch + ',%")';
    console.log("(whereStr after thematic=", whereStr);
    if (this.partOfName != '') whereStr += ((whereStr != '') ? ' and ' : '') + ' a.name_rus like ' + '"%' + this.partOfName + '%"';
    if (this.placeSearch != '') whereStr += ((whereStr != '') ? ' and ' : '') + '  a.place="' + this.placeSearch + '"';
    if (whereStr != '') whereStr = ' where ' + whereStr;
    return whereStr;
  }

  onCountryChange() {
    console.log("countrySearch=", this.countrySearch);

    this.sqlMyForum.getRusParticipant(this.formWhereStr());
  }

  removeSelectionThematic() {
    this.thematicSearch = '';
  }

  removeSelectionCountry() {
    this.countrySearch = '';
  }

  showHideFilter() {
    if (this.showFilter) this.showFilter = false;
    else this.showFilter = true;
  }

  onThematicChange() {
    console.log("thematicSearch=", this.thematicSearch);

    this.sqlMyForum.getRusParticipant(this.formWhereStr());
  }

  showModalFilter() {
    let filterModal = this.modalCtrl.create(FilterPage, {table: 'thematic', field: 'name_rus', value: 'number'});
    filterModal.onDidDismiss(
      data => {
        console.log(data);
      });

    filterModal.present();
  }


}
