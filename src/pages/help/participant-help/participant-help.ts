import {Component} from '@angular/core';
import {Events, NavController, NavParams} from 'ionic-angular';
import {BaseLangPageProvider} from "../../../providers/base-lang-page/base-lang-page";
import {Http} from "@angular/http";

/**
 * Generated class for the ParticipantHelpPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-participant-help',
  templateUrl: 'participant-help.html',
})
export class ParticipantHelpPage extends BaseLangPageProvider {
  setOneFilterStr='Set filter of the parameter';
  cancelOneFilterStr='Cancel filter of the parameter';
//lang:string;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public events: Events,
              public http: Http) {
    super(navCtrl, events, http);


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
    //console.log('ionViewDidLoad ParticipantHelpPage');
  }

}
