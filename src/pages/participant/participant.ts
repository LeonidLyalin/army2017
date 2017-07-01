/**
 * Created by lsl-info on 14.04.17.
 * list of participants
 */
import {Component} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {ParticipantApi} from '../shared/participant/participant-api.service';


import {participant, ParticipantSQL} from "../../providers/participant-sql";
import {MyForumSQL} from "../../providers/my-forum-sql";
import {ParticipantDetailPage} from "../participant-detail/participant-detail";
import {MyForumApi} from "../shared/my-forum/my-forum-api";
import {UserData} from "../providers/user-data";
import {place, PlaceSql} from "../providers/place-sql";
import {map, MapSql} from "../../providers/map-sql/map-sql";
import {LeafletMapPage} from "../maps/leaflet-map/leaflet-map";

//@TODO for an empty navParams (where no participants for the thematicConference) the full list is seen now. Instead of an empty list. Must be changed
//@TODO the Title for thematicConference list must be from the thematicConference
@Component({
  selector: 'page-participant',
  templateUrl: 'participant.html'
})

export class ParticipantPage {
  partOfName = '';
  participants: any;
  userId: any;
  iblockId: any = 1;


  constructor(public navCtrl: NavController,
              public http: Http,
              public participantApi: ParticipantApi,
              public myForumApi: MyForumApi,
              public sqlParticipant: ParticipantSQL,
              public sqlMyForum: MyForumSQL,
              public userData: UserData,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public placeSql: PlaceSql,
              public mapSql: MapSql) {
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
  refreshParticipant() {
    let tmpParticipant: any = [];
    console.log('run refresh run!');
    this.participantApi.getParticipant().subscribe(data => {
      console.log("here are the results for refresh");
      console.log(data);
      tmpParticipant = data;
      console.log("refresh for just began");
      for (let participant of tmpParticipant) {
        console.log("participant.id");
        console.log(participant.id);
        console.log(participant.name_rus);
        console.log("this.checkParticipantForId(participant.id)");
        // console.log(this.checkParticipantForId(participant.id));

        this.sqlParticipant.checkParticipantForId(participant.id).then(res => {
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
    });

    this.sqlMyForum.getRusParticipant().then(res => {

      console.log('our select in refresh participant');
      console.log(res);
      this.participants = res;
    });
  }


  /**
   * open the current database
   */
  openDataBase() {
    this.sqlParticipant.openDb();
  }

  /**
   * check whether the record with id = "id" parameter is in "participant" table
   * @param id
   */
  checkParticipantForId(id) {
    this.sqlParticipant.checkParticipantForId(id).then(res => {
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
    this.sqlParticipant.addItemParticipant(participant
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
      this.sqlParticipant.addItemParticipant(participant)
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
    this.sqlParticipant.selectParticipant().then(res => {
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
    this.sqlMyForum.getRusParticipant(' where a.name_rus like' + '"%' + this.partOfName + '%"').then(res => {
      console.log('our select');
      console.log(res);
      this.participants = res;
    })
  }

  selectRus() {
    this.sqlParticipant.selectRusParticipant().then(res => {
      console.log('our select');
      console.log(res);
    })
  }

  /**
   * delete All records from the table "participant"
   */
  deleteAll() {
    this.sqlParticipant.delAllParticipant().then(res => {
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
      this.sqlParticipant.delParticipant(id).then(res => {
          console.log('deleteOneParticipant()', id);
          console.log(res);
          return res;
        }
      );
    })
  }

  deleteParticipantAll() {
    this.sqlParticipant.delAllParticipant();
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

}
