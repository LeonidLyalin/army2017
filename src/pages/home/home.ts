import {Component, ViewChild} from '@angular/core';

import {Content, MenuController, NavController, Platform, Slides} from 'ionic-angular';

import {AboutPage} from "../about/about";
import {ForumMapPage} from "../maps/forum-map/forum-map";
import {ParkPatriotPage} from "../park-patriot-all/park-patriot/park-patriot";

import {ParticipantPage} from "../participant/participant";
import {ConferencePage} from "../conference/conference";
import {DemoProgramPage} from "../demo-propgram/demo-program";
import {ConferenceSql} from "../../providers/conference-sql/conference-sql";
import {BaseApi} from "../shared/base-api-service";
import {Http} from "@angular/http";
import {BaseSql} from "../../providers/base-sql";



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  showSkip = true;

  public iconHeight: number;
  public iconWidth: number;

  /**
   * number of times this page was loaded
   */
  public viewCount: number;
  public viewCountStr: string;

  private iconDivHeight: number = 10;//divider for the evaliation of the icon optimal size according to content width

  @ViewChild('slides') slides: Slides;
  @ViewChild(Content) content: Content;

  conferenceSql: ConferenceSql;

  constructor(public navCtrl: NavController,
              public menu: MenuController,
              public platform: Platform,
              public http: Http) {

  }


  onSlideChangeStart(slider: Slides) {
    this.showSkip = !slider.isEnd();
  }

  ionViewWillEnter() {
    this.iconHeight = this.content.contentHeight / this.iconDivHeight;
    this.iconWidth = this.iconHeight;
    console.log("this.iconHeight=" + this.iconHeight);
    this.slides.update();
    this.menu.enable(true);

    this.viewCountStr = localStorage.getItem('viewcount');
    this.viewCount = Number(this.viewCountStr);
    console.log('this.viewCount=', this.viewCount);
    if (this.viewCount == 0) {
      /**
       * init tables of database
       */

      [{"name":"id", "type":"text PRIMARY KEY"}, {"name":"name_rus", "type":"text"},
        {"name":"name_eng", "type":"text"}, {"name":"place_name", "type":"text"},
        {"name":"place_name_eng", "type":"text"}, {"name":"place", "type":"text"},
        {"name":"format", "type":"text"}, {"name":"format_eng", "type":"text"},
        {"name":"contact", "type":"text"}, {"name":"contact_eng", "type":"text"},
        {"name":"thematic_conference", "type":"text"}, {"name":"organizer", "type":"text"},
        {"name":"organizer_eng", "type":"text"}, {"name":"date_event", "type":"text"},
        {"name":"time_beg", "type":"text"}, {"name":"time_end", "type":"text"}, {"name":"name_rus_upper", "type":"text"}]
      let api = new BaseApi(this.http);
      api.getApi('universal_list.php?IBLOCK=21').subscribe(data => {
        console.log(data);
        let mydata = data;
        for (let i = 0; i < mydata.length; i++) {
          console.log("mydata.status", mydata[i]["STATUS"]);
          console.log("mydata.fields", mydata[i]["FIELDS"]);
          let fields = JSON.parse(mydata[i]["FIELDS"]);
          console.log("fields=", fields);
          console.log("fields.length=", fields.length);
          console.log("fields[1]", fields[1]);
          if (!this.platform.is('core')) {
            if (mydata[i]["STATUS"] == 'recreate') {
              console.log('mydata[i]["TABLE_NAME"]=',mydata[i]["TABLE_NAME"]);
              console.log('fields=',fields);
              console.log('mydata[i]["STATUS"]=',mydata[i]["STATUS"]);
             let table = new BaseSql(this.http, mydata[i]["TABLE_NAME"], fields, '', mydata[i]["STATUS"]);
             table.loadApi('conference_list.php');
            }

          }
        }
      });


    }
    this.viewCount++;
    localStorage.setItem('viewcount', String(this.viewCount));
  }

  /*ionViewDidload() {


  }*/

  aboutPage() {
    this.navCtrl.push(AboutPage);
  }

  forumMapPage() {
    this.navCtrl.push(ForumMapPage);
  }

  parkPatriot() {
    this.navCtrl.push(ParkPatriotPage);
  }

  conferencePage() {
    this.navCtrl.push(ConferencePage, {select: 'all'});
  }

  conferencePageJson() {
    this.navCtrl.push(DemoProgramPage, {select: 'all'});
  }

  participantPage() {
    this.navCtrl.push(ParticipantPage, {select: 'all'});
  }


  /*toggleMenu(){
    this.navCtrl.m
  }*/
}


