/**
 * Created by lsl-info on 16.04.17.
 */
/**
 * Created by lsl-info on 14.04.17.
 * list of events
 */
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-event',
  templateUrl: 'event.html'
})
export class EventPage {

  events: any;

  constructor(public navCtrl: NavController, public http: Http) {
//events list from bitirix
    console.log('список событий');
    this.http.get('http://army2017.ru/api/event_list.php').map(res => res.json()).subscribe(data => {
      console.log(data.data);
      this.events = data.data.company;
      console.log(this.events)
    });

  }
}
