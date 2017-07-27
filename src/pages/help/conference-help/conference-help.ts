import {Component, ViewChild} from '@angular/core';
import {Content, Events, NavController, NavParams, Platform} from 'ionic-angular';
import {BaseLangPageProvider} from "../../../providers/base-lang-page/base-lang-page";
import {Http} from "@angular/http";

/**
 * Generated class for the ParticipantHelpPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-conference-help',
  templateUrl: 'conference-help.html',
})
export class ConferenceHelpPage extends BaseLangPageProvider {

  setOneFilterStr='Set filter of the parameter';
  cancelOneFilterStr='Cancel filter of the parameter';


  widthScroll:any;
  heightScroll:any;
//lang:string;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public events: Events,
              public http: Http,
              public platform:Platform) {
    super(navCtrl, navParams, events, http);

    this.widthScroll="100%";
   // this.heightScroll="500px";


  }

  setRussianStrings() {
    super.setRussianStrings();

    this.titleStr = 'Работа со списком участников';
    this.setOneFilterStr='Установить фильтр для параметра';
    this.cancelOneFilterStr='Сбросить фильтр для параметра';
    this.setFilterStr='Установить фильтр для параметра';
    this.cancelFilterStr='Сбросить фильтр для параметра';
  }

  setEnglishStrings(){
    super.setEnglishStrings();

    this.titleStr='Operations whith the exhibitors list';
    this.setOneFilterStr='Set filter of the parameter';
    this.cancelOneFilterStr='Cancel filter of the parameter';
    this.setFilterStr='Set filter of the parameter';
    this.cancelFilterStr='Cancel filter of the parameter';
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ParticipantHelpPage');
  }

}
