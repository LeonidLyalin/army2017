import {Component} from '@angular/core';

import {Events, NavController, NavParams} from 'ionic-angular';
import {ThematicSql} from "../../providers/thematic-sql";
import {ParticipantSql} from "../../providers/participant-sql";
import {MyForumSQL} from "../../providers/my-forum-sql";
import {place, PlaceSql} from "../../providers/place-sql/place-sql";
import {LeafletMapPage} from "../maps/leaflet-map/leaflet-map";
import {map, MapSql} from "../../providers/map-sql/map-sql";


@Component({
  selector: 'page-participant-detail',
  templateUrl: 'participant-detail.html'
})
export class ParticipantDetailPage {
  participant: any;
  thematic: any;
  myForum: any;
  userId: any;
  iblockId: any = 1;
  lang: string;
//@todo add icons insteed of words in html]


  //interface strings
  title:string;
  onMapStr:string;
  myForumStr:string;
  thematicStr:string;

  constructor(public navParams: NavParams,
              public navCtrl: NavController,
              public thematicSql: ThematicSql,
              public participantSql: ParticipantSql,
              public sqlMyForum: MyForumSQL,
              public placeSql: PlaceSql,
              public mapSql: MapSql,
              public events:Events) {
    this.lang = localStorage.getItem('lang');
    console.log("now in Participant detail");
    console.log(navParams);
    this.thematic = [];
    if (navParams.data.participant)
      this.participant = navParams.data.participant
    else if (navParams.data.res) this.participant = navParams.data.res;

    this.thematicSql.getThematicOfParticipant(this.participant.id).then(
      res => {
        console.log("res in thematic page=", res)
        this.thematic = res;
        this.participantSql.getFieldFromTable(this.participant.id, 'id', 'myforum').then(//getMyForumForId(this.participant.id).then(
          res => {
            console.log("res in participant myForumParticipant", res);
            this.myForum = res;
          }
        )
      }
    );
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


  }

  setRussianStrings(){
    this.title='Участник';
    this.onMapStr='На карте';
    this.myForumStr='Мой форум';
    this.thematicStr='Тематика:'
  }
  setEnglishStrings(){
    this.title='Exhibitor';
    this.onMapStr='Map';
    this.myForumStr='My Forum';
    this.thematicStr='Thematic Section:'
  }
  ionViewDidLoad() {
    this.userId = localStorage.getItem('userid');
    this.lang = localStorage.getItem('lang');
  }

  deleteFromMyForum(id) {
    this.sqlMyForum.delFromMyForum(id);
  }

  addToMyForumSite(id) {
    this.sqlMyForum.addToMyForumSite(id, this.iblockId, this.userId)
  }

  showLeafLetMap(participant) {
    console.log("participant=", participant);


    this.placeSql.selectWhere('id='+participant.place).then(res => {
      console.log('showLeafLetMap res=',res);
      let place: place[] = (<place[]>res);
      this.mapSql.getRecordForFieldValue('name_map', "'" + place[0].name_map + "'").then(res => {
        console.log("res=", res);
        let map = <map[]>res;
        this.navCtrl.push(LeafletMapPage, {
          typeOfMap: 'participantDetail',
          popupElement: participant,
          place: place,
          map: map
        });
      });
    });
  }


}
