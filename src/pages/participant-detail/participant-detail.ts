import {Component} from '@angular/core';

import {NavController, NavParams} from 'ionic-angular';
import {ThematicSql} from "../../providers/thematic-sql";
import {ParticipantSql} from "../../providers/participant-sql";
import {MyForumSQL} from "../../providers/my-forum-sql";
import {place, PlaceSql} from "../providers/place-sql";
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

//@todo add icons insteed of words in html

  constructor(public navParams: NavParams,
              public navCtrl:NavController,
              public thematicSql: ThematicSql,
              public participantSql: ParticipantSql,
              public sqlMyForum: MyForumSQL,
              public placeSql: PlaceSql,
  public mapSql:MapSql) {
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
        this.participantSql.getFieldFromTable(this.participant.id,'id','myforum').then(//getMyForumForId(this.participant.id).then(
          res => {
            console.log("res in participant myForumParticipant", res);
            this.myForum = res;
          }
        )
      }
    );


  }

  ionViewDidLoad() {
    this.userId = localStorage.getItem('userid');
  }

  deleteFromMyForum(id) {
    this.sqlMyForum.delFromMyForum(id);
  }

  addToMyForumSite(id) {
    this.sqlMyForum.addToMyForumSite(id, this.iblockId, this.userId)
  }

  showLeafLetMap(participant) {
    console.log("participant=", participant);


    this.placeSql.selectPlace(participant.place).then(res=>{
      let place:place[]=(<place[]>res);
      this.mapSql.getRecordForFieldValue('name_map',"'"+place[0].name_map+"'").then(res=> {
        console.log("res=", res);
        let map=<map[]>res;
        this.navCtrl.push(LeafletMapPage, {typeOfMap: 'participantDetail', popupElement: participant, place: place, map: map});
      });
    });
  }


}
