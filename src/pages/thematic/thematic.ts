import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ThematicApi} from "../shared/thematic/thematic-api-service";
import {ThematicSql} from "../../providers/thematic-sql";
import {ParticipantPage} from "../participant/participant";

/**
 * Generated class for the ThematicPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-thematic',
  templateUrl: 'thematic.html',
})
export class ThematicPage {
  thematic: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public thematicApi: ThematicApi,
              public thematicSql: ThematicSql) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ThematicPage');
    this.thematicSql.select().then(res => {
      console.log("res=", res);
      if (res) {
        this.thematic = <any>res;
        console.log("this.thematic=", this.thematic);
      }
      else {
        this.thematicApi.getThematic().subscribe(res => {
          this.thematic = <any>res;
          this.addItemThematic();
        });

      }
    })


  }


  getThematicApi() {
    console.log('run thematic promise. run!');

    this.thematicApi.getThematic().subscribe(data => {
      console.log("here are the results");
      console.log(data);
      this.thematic = data
    });

  }


  /**
   * add Items from this.thematic property to the table "thematic"
   */
  addItemThematic() {
    for (let thema of this.thematic) {
      console.log('try to insert thematic');
      console.log("thema=", thema);
      this.thematicSql.addItem(thema).then(res => {
          console.log('success insert into thematic');
          console.log(res);
        }
      ).catch(err => {
        console.error('Unable to insert storage tables thametic', err.tx, err.err);
      })

    }
  }

  deleteAllThematic() {
    this.thematicSql.delAll();
  }

  goToParticipantThematicList(thematic: string) {
    this.thematicSql.getParticipantForThematic(thematic).then(res => {
      console.log(res);
      this.navCtrl.push(ParticipantPage, {data: res, select: 'thematic'});
    })

  }

}
