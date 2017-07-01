import {Component} from '@angular/core';

import {NavParams} from 'ionic-angular';
import {ThematicSql} from "../../providers/thematic-sql";
import {ParticipantSQL} from "../../providers/participant-sql";
import {ThematicConferenceSql} from "../../providers/thematic-conference-sql/thematic-conference-sql";
import {MyForumSQL} from "../../providers/my-forum-sql";


@Component({
  selector: 'page-conference-detail',
  templateUrl: 'conference-detail.html'
})
export class ConferenceDetailPage {
  conferenceSingle: any;
  thematic: any;
  myForum: any;
  userId: any;
  iblockId: any = 14;

  constructor(public navParams: NavParams,
              public thematicSql: ThematicConferenceSql,
              public participantSql: ParticipantSQL,
              public sqlMyForum: MyForumSQL) {
    console.log("now in Participant detail");
    console.log(navParams);
    this.thematic = [];
    if (navParams.data.conferenceSingle)
      this.conferenceSingle = navParams.data.conferenceSingle
    else if (navParams.data.res) this.conferenceSingle = navParams.data.res;

    this.thematicSql.getThematicOfConference(this.conferenceSingle.id).then(
      res => {
        console.log("res in thematicConference page=", res)
        this.thematic = res;
        this.participantSql.getMyForumForId(this.conferenceSingle.id).then(
          res => {
            console.log("res in conferenceSingle myForumParticipant", res);
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


}
