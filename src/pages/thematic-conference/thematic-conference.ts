import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ThematicApi} from "../../providers/thematic/thematic-api-service";
import {ThematicConferenceSql} from "../../providers/thematic-conference-sql/thematic-conference-sql";


/**
 * Generated class for the ThematicConferencePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@Component({
  selector: 'page-thematic-conference',
  templateUrl: 'thematic-conference.html',
})

export class ThematicConferencePage {

  thematicConference: any;

  tableName:string = 'thematic_conference';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public thematicApi: ThematicApi,
              public thematicConferenceSql: ThematicConferenceSql) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ThematicConferencePage');
  }


  getThematicApi() {
    //console.log('run thematicConference promise. run!');

    this.thematicApi.getThematic().subscribe(data => {
      //console.log("here are the results");
      //console.log(data);
      this.thematicConference = data
    });

  }


  /**
   * add Items from this.thematicConference property to the table "thematicConference"
   */
  addItemThematic() {
    for (let thema of this.thematicConference) {
      //console.log('try to insert thematicConference');
      //console.log(thema);
      this.thematicConferenceSql.addItem(thema).then(res => {
          //console.log('success insert into thematicConference');
          //console.log(res);
        }
      ).catch(err => {
        console.error('Unable to insert storage tables themetic', err.tx, err.err);
      })

    }
  }

  deleteAllThematic() {
    this.thematicConferenceSql.delAll();
  }

/*  goToParticipantThematicList(thematic: string) {
    this.thematicConferenceSql.getParticipantForThematic(thematic).then(res => {
      //console.log(res);
      this.navCtrl.push(ParticipantPage, {data: res, select: 'thematicConference'});
    })

  }*/
}
