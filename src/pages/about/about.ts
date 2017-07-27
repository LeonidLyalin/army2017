import {Component, ViewChild} from '@angular/core';

import {Content, NavController} from 'ionic-angular';
import {FilterParticipantProvider} from "../../providers/filter-provider/filter-participant-provider";

import {ConferenceHelpPage} from "../help/conference-help/conference-help";


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



}
