import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {WarTacticPage} from "../war-tactic-page/war-tactic-page";
import {SectorVksPage} from "../sektor-vks-page/sector-vks-page";
import {DemoOpkPage} from "../demo-opk-page/demo-opk-page";

/**
 * Generated class for the ParkPatriotPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-park-patriot',
  templateUrl: 'park-patriot.html',
})
export class ParkPatriotPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }



  warTacticPage(){
  this.navCtrl.push(WarTacticPage);
}
  sectorVksPage(){
    this.navCtrl.push(SectorVksPage);
  }

  demoOpkPage(){
    this.navCtrl.push(DemoOpkPage);
  }
}
