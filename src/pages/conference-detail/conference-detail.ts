import {Component} from '@angular/core';
import {Events, NavController, NavParams} from 'ionic-angular';
import {ThematicConferenceSql} from "../../providers/thematic-conference-sql/thematic-conference-sql";
import {MyForumSql} from "../../providers/my-forum-sql";
import {ConferenceSql} from "../../providers/conference-sql/conference-sql";
import {BaseLangPageProvider} from "../../providers/base-lang-page/base-lang-page";
import {Http} from "@angular/http";


@Component({
  selector: 'page-conference-detail',
  templateUrl: 'conference-detail.html'
})
export class ConferenceDetailPage extends BaseLangPageProvider {
  conferenceSingle: any;
  thematic: any;
  myForum: any;

  iblockId: any = 14;


  //interface strings
  title: string;
  onMapStr: string;
  myForumStr: string;
  thematicStr: string;

  constructor(public NavCtrl: NavController,
              public navParams: NavParams,
              public thematicConferenceSql: ThematicConferenceSql,
              public conferenceDetailSql: ConferenceSql,
              public sqlMyForum: MyForumSql,
              public events: Events,
              public http: Http) {
    super(NavCtrl, events, http);
    //console.log("now in conference detail");
    //console.log(navParams);
    this.thematic = [];
    if (navParams.data.conferenceSingle)
      this.conferenceSingle = navParams.data.conferenceSingle;
    else if (navParams.data.res) this.conferenceSingle = navParams.data.res;
    /*this.lang = localStorage.getItem('lang');
    if (this.lang == 'ru') {
      this.setRussianStrings();
    }
    else {
      this.setEnglishStrings();
    }*/

    /* this.events.subscribe('language:change', () => {


       this.lang = localStorage.getItem('lang');
       if (this.lang == 'ru') {
         //console.log('this.events.subscribe(language:change)', this.lang);
         this.setRussianStrings();
       }
       else {
         this.setEnglishStrings();
       }
     });*/


  }

  setRussianStrings() {
    super.setRussianStrings('Мероприятие');

    this.onMapStr = 'На карте';
    this.myForumStr = 'Мой форум';
    this.thematicStr = 'Тематика:'
  }

  setEnglishStrings() {
    super.setEnglishStrings('Event');
    this.onMapStr = 'Map';
    this.myForumStr = 'My Forum';
    this.thematicStr = 'Thematic Section:'
  }


  ionViewDidLoad() {
    super.ionViewDidLoad();
    // this.userId = localStorage.getItem('userid');
    this.thematicConferenceSql.getThematicOfConference(this.conferenceSingle.id).then(
      res => {
        if (res) {
          //console.log("res in thematicConference page=", res);
          this.thematic = <any>res;

        /*  this.conferenceDetailSql.getFieldFromTable(this.conferenceSingle.id, 'id', 'myforum').then(
            //getMyForumForId(this.conferenceSingle.id).then(
            rs => {
              if (rs) {
                //console.log("res in conferenceSingle myForumParticipant", rs);
                this.myForum = <any>rs;
              }

            }
          );*/
        }
      }
    );

  }

  /**
   * delete event of the conference from MyForum
   * @param id
   */
  deleteFromMyForum(id) {
    this.sqlMyForum.delFromMyForum(id);
  }

  /**
   * add event to MyForum on the site and the mobile app
   * @param id
   */
  addToMyForumSite(id) {
    this.sqlMyForum.addToMyForumSite(id, this.iblockId, this.userId)
  }


}
