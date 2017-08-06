import {Component} from '@angular/core';

import {Events, NavController, NavParams} from 'ionic-angular';
import {ThematicSql} from "../../providers/thematic-sql";
import {ParticipantSql} from "../../providers/participant-sql";
import {MyForumSql} from "../../providers/my-forum-sql";
import {place, PlaceSql} from "../../providers/place-sql/place-sql";
import {LeafletMapPage} from "../maps/leaflet-map/leaflet-map";
import {map, MapSql} from "../../providers/map-sql/map-sql";
import {BaseLangPageProvider} from "../../providers/base-lang-page/base-lang-page";
import {Http} from "@angular/http";


@Component({
  selector: 'page-participant-detail',
  templateUrl: 'participant-detail.html'
})
export class ParticipantDetailPage extends BaseLangPageProvider {
  participant: any;
  thematic: any;
  myForum: any;
  iblockId: any = 1;
  showMap: boolean;



  //interface strings
  title: string;
  onMapStr: string;
  myForumStr: string;
  thematicStr: string;

  constructor(public navParams: NavParams,
              public navCtrl: NavController,
              public thematicSql: ThematicSql,
              public participantSql: ParticipantSql,
              public sqlMyForum: MyForumSql,
              public placeSql: PlaceSql,
              public mapSql: MapSql,
              public events: Events,
              http: Http) {
    super(navCtrl, events, http);
    //this.lang = localStorage.getItem('lang');
    //console.log("now in Participant detail");
    //console.log(navParams);
    this.thematic = [];
   /* if (this.navParams.data.map) this.showMap = this.navParams.data.map;
    else this.showMap = true;*/
    if (this.navParams.data.map!=null)
    this.showMap = this.navParams.data.map;
    else this.showMap=true;
    if (navParams.data.participant) {
      if (navParams.data.participant.length)
        this.participant = navParams.data.participant[0];
      else this.participant = navParams.data.participant;
    }
    else {
      if (navParams.data.res) this.participant = navParams.data.res;
    }

    if (this.showMap) this.showMap=!!this.participant.place_name;

    //console.log('this.participant=', this.participant);
    this.thematicSql.getThematicOfParticipant(this.participant.id).then(
      res => {
        //console.log("res in thematic page=", res);
        this.thematic = res;
        this.participantSql.getFieldFromTable(this.participant.id, 'id', 'myforum').then(//getMyForumForId(this.participant.id).then(
          res => {
            //console.log("res in participant myForumParticipant", res);
            this.myForum = res;
          }
        )
      }
    );


  }

  setRussianStrings() {
    super.setRussianStrings('Участник');

    this.onMapStr = 'На карте';
    this.myForumStr = 'Мой форум';
    this.thematicStr = 'Тематика:'
  }

  setEnglishStrings() {
    super.setEnglishStrings('Exhibitor');

    this.onMapStr = 'Map';
    this.myForumStr = 'My Forum';
    this.thematicStr = 'Thematic Section:'
  }

  ionViewDidLoad() {
    super.ionViewDidLoad();

  }

  deleteFromMyForum(id) {
    this.sqlMyForum.delFromMyForum(id);
  }

  addToMyForumSite(id) {
    this.sqlMyForum.addToMyForumSite(id, this.iblockId, this.userId)
  }

  showLeafLetMap(participant) {
    //console.log("participant=", participant);


    this.placeSql.selectWhere('id=' + participant.place).then(res => {
      //console.log('showLeafLetMap res=', res);
      let place: place[] = (<place[]>res);
      this.mapSql.getRecordForFieldValue('name_map', "'" + place[0].name_map + "'").then(res => {
        //console.log("res=", res);
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
