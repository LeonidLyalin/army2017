/**
 * Created by lsl-info on 14.04.17.
 * list of participants
 */
import {Component} from '@angular/core';
import {Events, ModalController, NavController, NavParams, ToastController} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {ParticipantApi} from '../shared/participant/participant-api.service';
import {participant, ParticipantSql} from "../../providers/participant-sql";
import {MyForumSql} from "../../providers/my-forum-sql";
import {ParticipantDetailPage} from "../participant-detail/participant-detail";
import {MyForumApi} from "../shared/my-forum/my-forum-api";
import {PlaceSql} from "../../providers/place-sql/place-sql";
import {MapSql} from "../../providers/map-sql/map-sql";
import {FilterParticipantProvider} from "../../providers/filter-provider/filter-participant-provider";
import {BaseListPageProvider} from "../../providers/base-list-page/base-list-page";


@Component({
  selector: 'page-participant',
  templateUrl: 'participant.html',
  providers: [ParticipantSql],
})

export class ParticipantPage extends BaseListPageProvider {







  constructor(public navCtrl: NavController,
              public http: Http,
              public participantApi: ParticipantApi,
              public myForumApi: MyForumApi,
              public participantSql: ParticipantSql,
              public sqlMyForum: MyForumSql,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public placeSql: PlaceSql,
              public mapSql: MapSql,
              public modalCtrl: ModalController,
              public filterProvider: FilterParticipantProvider,
              public events: Events) {
//подгружаем список участников выставки
    super(navCtrl, navParams, events, http, placeSql, mapSql);

    console.log("navParams in constructor", navParams);
    console.log("navParams==null", this.navParams == null);
    console.log("navParams.data.length", navParams.data.length);
    let param = navParams.get('select');
    console.log("navParams.get('select')", param);
    if (param == 'thematic') {
      let toast = this.toastCtrl.create({
        message: this.loadStr,
        duration: 5000
      });
      toast.present();
      console.log("navParams.data", navParams.data.data);
      this.listOut = navParams.data.data;
    }
    this.iblockId  = 1;//for my_forum
  }

  setRussianStrings() {
    super.setRussianStrings('Участники');
  }

  setEnglishStrings() {
    super.setEnglishStrings('Exhibitors');
  }


  ionViewDidLoad() {
    super.ionViewDidLoad();
    console.log('ionViewDidLoad MyForumPage');
    console.log("this.navParams=", this.navParams);
    console.log("this.navParams.data=", this.navParams.data);
    console.log("navParams==null", this.navParams == null);
    let param = this.navParams.get('select');
    if (param == 'thematic') {
      console.log("this.navParams in ioViewDidLoad =", this.navParams);
      this.listOut = this.navParams.data.data;
    }
    else {
      console.log("this.selectParticipantAll()");
      let toast = this.toastCtrl.create({
        message: this.loadStr,
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
        if (this.lang == 'ru') {
          this.selectParticipantRus()
        }
        else {
          this.selectParticipantEng()
        }
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
    if (this.lang == 'ru') {
      this.sqlMyForum.getRusParticipantFull('where a.id=' + participant.id).then(res => {
        let participantDetail = <any>res;
        console.log("participantDetail=", participantDetail);
        this.navCtrl.push(ParticipantDetailPage, {
          participant: participantDetail
        });
      });
    } else
      this.sqlMyForum.getEngParticipantFull('where a.id=' + participant.id).then(res => {
        let participant = <any>res;
        this.navCtrl.push(ParticipantDetailPage, {participant});
      });

  }


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
      this.listOut = res;
    })

  }


  selectParticipantEng() {
    this.sqlMyForum.getEngParticipant().then(res => {
      console.log('our select');
      console.log(res);
      this.listOut = res;
    })

  }


  selectParticipantAll() {
    if (this.lang == 'ru') {
      this.sqlMyForum.getRusParticipant().then(res => {
        console.log('this.sqlMyForum.getRusParticipant().then( res=', res);
        console.log('(<participant[]>res).length=', (<participant[]>res).length);
        this.listOut = res;
        /*if ((<participant[]>res).length) {
          console.log('our select');
          console.log(res);
          this.listOut = res;


        }
        else {
          let toast = this.toastCtrl.create({
            message: 'API запрос и запись в базу',
            duration: 5000
          });
          toast.present();
          console.log(' this.getPlaceApiInsertBase()');
          this.getParticipantApiInsertBase();
        }*/
      })
    }
    else {
      this.sqlMyForum.getEngParticipant().then(res => {
        console.log('this.sqlMyForum.getEngParticipant().then( res=', res);
        console.log('(<participant[]>res).length=', (<participant[]>res).length);
        this.listOut = res;
        /*if ((<participant[]>res).length) {
          console.log('our select');
          console.log(res);
          this.listOut = res;


        }
        else {
          let toast = this.toastCtrl.create({
            message: 'API запрос и запись в базу',
            duration: 5000
          });
          toast.present();
          console.log(' this.getPlaceApiInsertBase()');
          this.getParticipantApiInsertBase();
        }*/
      })
    }
  }


  deleteFromMyForum(id) {
    this.sqlMyForum.delFromMyForum(id).then(res => {
        //  this.selectParticipantAll();
        this.getListOut();
      }
    );
  }

  addToMyForumSite(id) {
    this.sqlMyForum.addToMyForumSite(id, this.iblockId, this.userId, this.listOut).then(res => {
        //this.selectParticipantAll();
     /* for (let participant of this.listOut){
        if (participant.id==id){
          participant.my_forum_id=1;
          break;
        }
      }*/
     // this.getListOut();

      }
    );
  }


  getListOut() {
    this.filterStr = this.filterProvider.filterStr;
    console.log("this.filterStr", this.filterStr);
    if (this.lang == 'ru') {
      this.sqlMyForum.getRusParticipant(this.filterStr).then(res => {
        console.log('our select');
        console.log(res);
        this.listOut = res;
        //  this.showHideFilter();
      });
    }
    else {
      this.sqlMyForum.getEngParticipant(this.filterStr).then(res => {
        console.log('our select');
        console.log(res);
        this.listOut = res;

      });
    }
  }

  setFilterStrParticipant() {

    this.getListOut();
    /*  if (this.lang == 'ru') {
        this.sqlMyForum.getRusParticipant(this.filterStr).then(res => {
          console.log('our select');
          console.log(res);
          this.listOut = res;
        //  this.showHideFilter();
        });
      }
      else {
        this.sqlMyForum.getEngParticipant(this.filterStr).then(res => {
          console.log('our select');
          console.log(res);
          this.listOut = res;

        });
      }*/
    this.showHideFilter();
  }

  cancelFilterStrParticipant() {
    this.filterProvider.cancelFilter();
    this.showHideFilter();
  }

}
