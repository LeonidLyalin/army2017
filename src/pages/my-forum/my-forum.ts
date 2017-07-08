import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';


import {MyForumSQL} from "../../providers/my-forum-sql";
import {UserData} from "../providers/user-data";
import {ParticipantDetailPage} from "../participant-detail/participant-detail";
import {ConferenceDetailPage} from "../conference-detail/conference-detail";
import {PlaceSql, place} from "../providers/place-sql";
import {LeafletMapPage} from "../maps/leaflet-map/leaflet-map";
import {map, MapSql} from "../../providers/map-sql/map-sql";
/**
 * Generated class for the MyForumPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-my-forum',
  templateUrl: 'my-forum.html',
})
export class MyForumPage {
  userId: any = 1;
  public myForumParticipant: any;
  public myForumApi: any;

  public myForumConference: any;

  public forumSegment: string = 'conferenceItems';


  constructor(public navCtrl: NavController,
              public http: Http,
              public sqlMyForum: MyForumSQL,
              public userData: UserData,
              public placeSql: PlaceSql,
              public mapSql:MapSql) {


    /* this.myForumApi.getMyForum(this.myUser).subscribe(data => {
     console.log("here are the results");
     console.log(data);
     this.myForumParticipant = data
     });*/
  }


  getApi() {
    //get My Forum for the User
    if (!this.userId) alert("Незарегистрированный пользователь");
    console.log('run promise for myForumParticipant. run!');
    this.http.get('http://army2017.ru/api/my_forum/my_forum_list.php?USER=' + this.userId + '&LOWERCASE=1').map(res => res.json()).subscribe(data => {
      this.myForumApi = data;
      console.log(this.myForumApi);
      console.log('delete all');
      this.sqlMyForum.delAll();
      console.log('insert new elements for myforum');
      this.sqlMyForum.addItemList(this.myForumApi);
      this.selectParticipantRus();
      this.selectConferenceRus();
    });

  }

  ionViewDidLoad() {
//    this.openDataBase();
    console.log('ionViewDidLoad MyForumPage');
    console.log('getIP');
    console.log('try to get userID');
    try {
      this.userId = localStorage.getItem('userid');//this.userData.getUserId();
    }
    catch (err) {
      console.log(err);
      this.userId = 0;
    }
    console.log('userid=', this.userId);

    this.refreshMyForum();

  }

  ionViewWillEnter() {
    this.refreshMyForum();
  }

  refreshMyForum() {
    console.log("refreshMyForum");
    this.getApi();
//this.selectParticipantRus();
//this.selectConferenceRus();

  }

  selectParticipantRus() {
    console.log('selectParticipantRus');
    this.sqlMyForum.getRusParticipantMyForum(this.userId).then(res => {
      console.log('our select');
      console.log(res);
      this.myForumParticipant = res;
    })

  }


  selectConferenceRus() {
    console.log('selectConferenceRus');
    this.sqlMyForum.getRusConferenceMyForum(this.userId).then(res => {
      console.log('our select');
      console.log(res);
      this.myForumConference = res;
    })

  }

  changeForumSegment(itemSegment) {
    this.forumSegment = itemSegment;

  }

  selectItems() {
    //console.log("this.myForumParticipant");
    // this.myForumParticipant=this.sqlMyForum.getRows2();

    //console.log(this.myForumParticipant);
    this.sqlMyForum.select().then(res => {
      console.log('our select');
      console.log(res);
      this.myForumParticipant = res;
    })
  }

  goToParticipantDetail(participant) {
    console.log("goToParticipantDetail()");
    console.log(participant);
    // go to the session detail page
    // and pass in the session data
    this.navCtrl.push(ParticipantDetailPage, {
      participant
    });
  }

  delFromMyForum(id) {
    this.sqlMyForum.delFromMyForum(id).then(res => {
      if (res) this.refreshMyForum();
    });
  }


  goToConferenceDetail(conferenceSingle) {
    console.log("goToParticipantDetail()");
    console.log(conferenceSingle);
    // go to the session detail page
    // and pass in the session data
    this.navCtrl.push(ConferenceDetailPage, {
      conferenceSingle
    });
  }

  showMapMyForum() {
    if (this.forumSegment == 'conferenceItems') {

      this.placeSql.selectPlace().then(res => {
        let place: place[] = (<place[]>res);
        this.mapSql.getRecordForFieldValue('name_map', "'" + place[0].name_map + "'").then(res => {
          console.log("res=", res);
          let map = <map[]>res;
          this.navCtrl.push(LeafletMapPage, {typeOfMap:'conference', popupElement: this.myForumConference, place: place, map: map});
        });
      });
    }
    if (this.forumSegment == 'participantItems') {

      this.placeSql.selectPlace().then(res => {
        let place: place[] = (<place[]>res);
        this.mapSql.getRecordForFieldValue('name_map', "'" + place[0].name_map + "'").then(res => {
          console.log("res=", res);
          let map = <map[]>res;
          this.navCtrl.push(LeafletMapPage, {typeOfMap:'participant', popupElement: this.myForumParticipant, place: place, map: map});
        });
      });
    }
  }


}

