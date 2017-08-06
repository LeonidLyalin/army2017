import { Component } from '@angular/core';
import {Events, NavController, NavParams} from 'ionic-angular';
import {BaseLangPageProvider} from "../../../providers/base-lang-page/base-lang-page";
import {Http} from "@angular/http";

/**
 * Generated class for the MapHelpPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-map-help',
  templateUrl: 'map-help.html',
})
export class MapHelpPage extends BaseLangPageProvider{

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public events:Events,
              public http:Http) {
    super(navCtrl,events,http)
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad MapHelpPage');
  }

}
