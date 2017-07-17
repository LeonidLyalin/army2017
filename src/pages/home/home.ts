import {Component, ViewChild} from '@angular/core';

import {Content, MenuController, NavController, Slides} from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";
import {AboutPage} from "../about/about";
import {ForumMapPage} from "../maps/forum-map/forum-map";
import {ParkPatriotPage} from "../park-patriot-all/park-patriot/park-patriot";
import {ConferencePageJson} from "../conference-json/conference-json";
import {ParticipantPage} from "../participant/participant";
import {ConferencePage} from "../conference/conference";
import {DemoProgramPage} from "../demo-propgram/demo-program";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  showSkip = true;

  public iconHeight:number;
  public iconWidth:number;

  private iconDivHeight:number=10;//divider for the evaliation of the icon optimal size according to content width

  @ViewChild('slides') slides: Slides;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
              public menu: MenuController
              ) {

  }



  onSlideChangeStart(slider: Slides) {
    this.showSkip = !slider.isEnd();
  }

  ionViewWillEnter() {
    this.iconHeight=this.content.contentHeight/this.iconDivHeight;
    this.iconWidth=this.iconHeight;
    console.log("this.iconHeight="+this.iconHeight);
    this.slides.update();
    this.menu.enable(true);
  }


  aboutPage(){
    this.navCtrl.push(AboutPage);
  }

  forumMapPage(){
    this.navCtrl.push(ForumMapPage);
  }

  parkPatriot(){
    this.navCtrl.push(ParkPatriotPage);
  }

  conferencePage(){
    this.navCtrl.push(ConferencePage,{select:'all'});
  }

  conferencePageJson(){
    this.navCtrl.push(DemoProgramPage,{select:'all'});
  }
  participantPage(){
    this.navCtrl.push(ParticipantPage,{select:'all'});
  }


  /*toggleMenu(){
    this.navCtrl.m
  }*/
}


