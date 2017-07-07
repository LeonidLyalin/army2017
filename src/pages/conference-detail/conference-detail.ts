import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular';
import {ThematicConferenceSql} from "../../providers/thematic-conference-sql/thematic-conference-sql";
import {MyForumSQL} from "../../providers/my-forum-sql";
import {ConferenceSql} from "../../providers/conference-sql/conference-sql";


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
              public thematicConferenceSql: ThematicConferenceSql,
              public conferenceDetailSql: ConferenceSql,
              public sqlMyForum: MyForumSQL) {
    console.log("now in Participant detail");
    console.log(navParams);
    this.thematic = [];
    if (navParams.data.conferenceSingle)
      this.conferenceSingle = navParams.data.conferenceSingle
    else if (navParams.data.res) this.conferenceSingle = navParams.data.res;

    this.thematicConferenceSql.getThematicOfConference(this.conferenceSingle.id).then(
      res => {
        console.log("res in thematicConference page=", res)
        this.thematic = res;
        //@TODO why participant SQL? Change for a conference
        this.conferenceDetailSql.getFieldFromTable(this.conferenceSingle.id,'id','myforum').then(
          //getMyForumForId(this.conferenceSingle.id).then(
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
