import {Component} from '@angular/core';
import {Events, NavController, NavParams, ToastController} from 'ionic-angular';
import {Http} from "@angular/http";
import {BaseListPageProvider} from "../../providers/base-list-page/base-list-page";
import {BaseApi} from "../../providers/base-api-service";
import {ConferenceSql} from "../../providers/conference-sql/conference-sql";
import {MyForumSql} from "../../providers/my-forum-sql";

import {PlaceSql} from "../../providers/place-sql/place-sql";
import {FilterConferenceProvider} from "../../providers/filter-provider/filter-conference-provider";
import {ConferenceDetailPage} from "../conference-detail/conference-detail";

/**
 * Generated class for the ContactListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-contact-list',
  templateUrl: 'contact-list.html',
})
export class ContactListPage extends BaseListPageProvider {

  constructor(public navCtrl: NavController,
              public http: Http,
              public conferencetApi: BaseApi,
              public conferenceSql: ConferenceSql,
              public sqlMyForum: MyForumSql,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public placeSql: PlaceSql,
              public filterProvider: FilterConferenceProvider,
              public events: Events) {

    super(navCtrl, navParams, events, http);//, placeSql, mapSql);
    // this.listOut = [];
    //console.log("navParams in constructor", navParams);
    //console.log("navParams==null", this.navParams == null);
    //console.log("navParams.data.length", navParams.data.length);
    let param = navParams.get('select');
    //console.log("navParams.get('select')", param);
    if (param == 'thematicConference') {
      let toast = this.toastCtrl.create({
        message: 'Загрузка из API ',
        duration: 5000
      });
      toast.present();
      //console.log("navParams.data", navParams.data.data);
      this.listOut = navParams.data.data;
    }
    this.iblockId = 23;//number of the infoblock in bitrix
  }


  ionViewDidLoad() {
    super.ionViewDidLoad();

    //console.log('ionViewDidLoad ConferencePage');
    //console.log("this.navParams=", this.navParams);
    //console.log("this.navParams.data=", this.navParams.data);
    //console.log("navParams==null", this.navParams == null);
    let param = this.navParams.get('select');
    if (param == 'thematicConference') {
      //console.log("this.navParams in ioViewDidLoad =", this.navParams);
      this.listOut = this.navParams.data;
    }
    else {
      this.conferenceRefresh();
    }
  }

  conferenceRefresh() {
    //console.log("this.selectConferenceAll()");
    let toast = this.toastCtrl.create({
      message: this.loadStr,
      duration: 5000
    });
    toast.present();
    this.selectConferenceAll();
  }

  /**
   *
   * @param conferenceSingle
   */
  goToConferenceDetail(conferenceSingle) {
    //console.log("goToParticipantDetail()");
    //console.log(conferenceSingle);
    // go to the session detail page
    // and pass in the session data
    this.navCtrl.push(ConferenceDetailPage, {
      conferenceSingle
    });
  }


  /**
   * add Items from this.listOut property to the table "listOut"
   */
  addItemConference() {
    for (let conferenceSingle of this.listOut) {
      //console.log('try to insert');
      //console.log("conferenceSingle=", conferenceSingle);
      this.conferenceSql.addItemConference(conferenceSingle)
        .then(res => {
            //console.log('success');
            //console.log(res);
          }
        ).catch(err => {
        console.error('Unable to insert storage tables', err.tx, err.err);

      })

    }
  }


  selectConferenceAll(whereStr = '') {
    //console.log("selectConferenceAll() where=", whereStr);
    //console.log("selectConferenceAll() lang", this.lang);
    if (this.lang == 'ru') {
      this.sqlMyForum.getRusConference(whereStr).then(res => {
        //console.log('this.sqlMyForum.getRusConference().then( res=', res);
        //console.log('(<conferenceRusMyForum[]>res).length=', (<any[]>res).length);
        if ((<any[]>res).length) {
          //console.log('selectConferenceAll() after  select res');
          //console.log(res);
          this.listOut = <any[]>res;
          //console.log("this.listOut");
          //console.log(this.listOut);
        }
        else {
          let toast = this.toastCtrl.create({
            message: 'API запрос и запись в базу',
            duration: 5000
          });
          toast.present();
          //console.log(' this.getPlaceApiInsertBase()');
          this.getConferenceApiInsertBase();
        }
      })
    }
    else {
      this.sqlMyForum.getEngConference(whereStr).then(res => {
        //console.log('this.sqlMyForum.getEngConference().then( res=', res);
        //console.log('(<any[]>res).length=', (<any[]>res).length);
        if ((<any[]>res).length) {
          //console.log('selectConferenceAll() after  select res');
          //console.log(res);
          this.listOut = <any[]>res;
          //console.log("this.listOut");
          //console.log(this.listOut);
        }
        else {
          let toast = this.toastCtrl.create({
            message: 'API запрос и запись в базу',
            duration: 5000
          });
          toast.present();
          //console.log(' this.getPlaceApiInsertBase()');
          this.getConferenceApiInsertBase();
        }
      })
    }
  }


  getConferenceApiInsertBase() {
    /*   this.conferencetApi.getConference().subscribe(data => {
         //console.log("here are the results");
         //console.log(data);

         this.listOut = data;
         this.addItemConference();
       });*/
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
    this.sqlMyForum.addToMyForumSite(id, this.iblockId, this.userId, this.listOut).then(res => {
        //console.log("and refresh now");
        //console.log("res=", res);
      }
    );

  }

  setRussianStrings() {
    super.setRussianStrings('Конференция')

  }

  setEnglishStrings() {
    super.setEnglishStrings('Conference');

  }

  setFilterStrConference() {
    this.filterStr = this.filterProvider.filterStr;
    //console.log("this.filterStr", this.filterStr);
    if (this.lang == 'ru') {
      this.sqlMyForum.getRusConference(this.filterStr).then(res => {
        //console.log('our select');
        //console.log(res);
        this.listOut = res;
        this.showHideFilter();
      });
    } else {
      this.sqlMyForum.getEngConference(this.filterStr).then(res => {
        //console.log('our select');
        //console.log(res);
        this.listOut = res;
        this.showHideFilter();
      });
    }
  }

  cancelFilterStrConference() {
    this.filterProvider.cancelFilter();
    this.showHideFilter();
  }
}



