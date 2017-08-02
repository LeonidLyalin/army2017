import {Component} from '@angular/core';

import { NavController} from 'ionic-angular';
import {FilterParticipantProvider} from "../../providers/filter-provider/filter-participant-provider";



@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  filterStr: string;

  constructor(public navCtrl: NavController,
              public filterProvider: FilterParticipantProvider,
              ) {
    console.log("about ts");

  }

  onSwipeUp($event){
    console.log($event);
  }


}
