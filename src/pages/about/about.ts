import {Component} from '@angular/core';

import {NavController} from 'ionic-angular';
import {FilterProvider} from "../../providers/filter-provider/filter-provider";


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  filterStr: string;

  constructor(public navCtrl: NavController, public filterProvider: FilterProvider) {
    console.log("about ts");
  }
 setFilterStrAbout(){
    console.log("this.filterProvider.filterStr=",this.filterProvider.filterStr);
    this.filterStr=this.filterProvider.filterStr;
 }

 menuToggle1(){

 }
}
