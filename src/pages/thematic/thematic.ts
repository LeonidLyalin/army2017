import {Component} from '@angular/core';
import {Events, NavController, NavParams} from 'ionic-angular';
import {ThematicApi} from "../../providers/thematic/thematic-api-service";
import {ThematicSql} from "../../providers/thematic-sql";
import {ParticipantPage} from "../participant/participant";
import {BaseApi} from "../../providers/base-api-service";
import {BaseLangPageProvider} from "../../providers/base-lang-page/base-lang-page";
import {Http} from "@angular/http";
import {MyForumSql} from "../../providers/my-forum-sql";

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
export class ThematicPage extends BaseLangPageProvider {
  thematic: any;

  apiUrl: string = 'thematic_list.php';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public thematicApi: ThematicApi,
              public BaseApi: BaseApi,
              public thematicSql: ThematicSql,
              public http: Http,
              public events: Events,
              public myForumSql: MyForumSql) {
    super(navCtrl,  events, http);

  }

  setRussianStrings() {
    super.setRussianStrings();
    this.titleStr = 'Тематика участника';
  }

  setEnglishStrings() {
    super.setEnglishStrings();
    this.titleStr = 'Thematic';
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ThematicPage');
    this.thematicSql.select().then(res => {
      //console.log("res=", res);
      if (res) {
        this.thematic = <any>res;
        //console.log("this.thematic=", this.thematic);
      }
      else {
        this.BaseApi.getApi(this.apiUrl).subscribe(res => {
          this.thematic = <any>res;
          this.addItemThematic();
        });

      }
    })


  }


  /*  getThematicApi() {
      //console.log('run thematic promise. run!');
  //this.baseApi.
      this.thematicApi.getThematic().subscribe(data => {
        //console.log("here are the results");
        //console.log(data);
        this.thematic = data
      });

    }*/


  /**
   * add Items from this.thematic property to the table "thematic"
   */
  addItemThematic() {
    for (let thema of this.thematic) {
      //console.log('try to insert thematic');
      //console.log("thema=", thema);
      this.thematicSql.addItem(thema).then(res => {
          //console.log('success insert into thematic');
          //console.log(res);
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
    let whereStr =
      ' where a.thematic like "' + thematic + ',%" or a.thematic like "%,'
      + thematic + ',%" or a.thematic like "%,' + thematic + '" or a.thematic="' + thematic + '"';
    if (this.lang == 'ru') {
      this.myForumSql.getRusParticipant(whereStr).then(res => {
        //console.log(res);
        this.navCtrl.push(ParticipantPage, {data: res, select: 'thematic'}
        );
      });
    }
    else {
      this.myForumSql.getEngParticipant(whereStr).then(res => {
          //console.log(res);
          this.navCtrl.push(ParticipantPage, {data: res, select: 'thematic'}
          );
        }
      )


    }

    /* this.thematicSql.getParticipantForThematic(thematic).then(res => {
       //console.log(res);
       this.navCtrl.push(ParticipantPage, {data: res, select: 'thematic'});
     })*/

  }

}
