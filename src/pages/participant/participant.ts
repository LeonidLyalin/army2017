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
import {MyForumSQL} from "../../providers/my-forum-sql";
import {ParticipantDetailPage} from "../participant-detail/participant-detail";
import {MyForumApi} from "../shared/my-forum/my-forum-api";

import {place, PlaceSql} from "../../providers/place-sql/place-sql";
import {map} from "../../providers/map-sql/map-sql";

import {country} from "../../providers/country-sql/country-sql";




import {FilterParticipantProvider} from "../../providers/filter-provider/filter-participant-provider";


@Component({
  selector: 'page-participant',
  templateUrl: 'participant.html',
  providers: [ParticipantSql],
})

export class ParticipantPage {
  partOfName: string = '';
  participants: any;
  userId: any;
  lang: any;
  iblockId: any = 1;


  countryList: country[] = [];



  placeList: place[] = [];


  showFilter: boolean = false;


  //interface strings
  setFilterStr: string;
  cancelFilterStr: string;
  title:string;

  addMyForumStr: string;
  delMyForumStr: string;
  loadStr:string;

  filterStr: string;

  constructor(public navCtrl: NavController,
              public http: Http,
              public participantApi: ParticipantApi,
              public myForumApi: MyForumApi,
              public participantSql: ParticipantSql,
              public sqlMyForum: MyForumSQL,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public placeSql: PlaceSql,

              public modalCtrl: ModalController,
              public filterProvider: FilterParticipantProvider,
              public events: Events) {
//подгружаем список участников выставки
    this.lang = localStorage.getItem('lang');
    if (this.lang == 'ru') {
      this.setRussianStrings();
    }
    else {
      this.setEnglishStrings();
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
  setRussianStrings() {
    console.log('this.setRussianStrings()');


    this.setFilterStr = 'Установить';
    this.cancelFilterStr = 'Отменить';
    this.title='Участники';
    this.addMyForumStr = 'В "Мой форум"';
    this.delMyForumStr = 'Удалить из "Мой форум"';
    this.loadStr='Загрузка';
  }

  setEnglishStrings() {
    console.log('this.setEnglishStrings()');


    this.setFilterStr = 'Set';
    this.cancelFilterStr = 'Cancel';
    this.title='Exhibitors';
    this.addMyForumStr = 'Add in "My Forum"';
    this.delMyForumStr = 'Del from "My Forum"';
    this.loadStr='Loading';
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
        this.selectParticipantRus()}
        else {
          this.selectParticipantEng()}
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


      //create country list
      this.participantSql.getTableFieldDistinctList(this.countryList, 'country_rus')
      console.log("step2");


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
      this.participants = res;
    })

  }


  selectParticipantEng() {
    this.sqlMyForum.getEngParticipant().then(res => {
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
    if (this.lang == 'ru') {
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
    })}
      else {
      this.sqlMyForum.getEngParticipant().then(res => {
        console.log('this.sqlMyForum.getEngParticipant().then( res=', res);
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



  showHideFilter() {
    if (this.showFilter) this.showFilter = false;
    else this.showFilter = true;
  }



  setFilterStrParticipant() {
    this.filterStr = this.filterProvider.filterStr;
    console.log("this.filterStr", this.filterStr);
    if (this.lang == 'ru') {
      this.sqlMyForum.getRusParticipant(this.filterStr).then(res => {
        console.log('our select');
        console.log(res);
        this.participants = res;
        this.showHideFilter();
      });
    }
    else {
      this.sqlMyForum.getEngParticipant(this.filterStr).then(res => {
        console.log('our select');
        console.log(res);
        this.participants = res;
        this.showHideFilter();
      });
    }
  }

  cancelFilterStrParticipant(){
    this.filterProvider.cancelFilter();
    this.showHideFilter();
  }

}
