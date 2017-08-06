import {Component} from '@angular/core';
import {AlertController, Events, NavController, NavParams} from 'ionic-angular';

import {BaseSql} from "../../providers/base-sql";
import {Http} from "@angular/http";
import {BaseLangPageProvider} from "../../providers/base-lang-page/base-lang-page";
import {participant} from "../../providers/participant-sql";
import {MyForumSql} from "../../providers/my-forum-sql";

/**
 * Generated class for the QrScannerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-qr-scanner',
  templateUrl: 'qr-scanner.html',
})
export class QrScannerPage extends BaseLangPageProvider {

  participantId = 1;
  conferenceId = 14;
  badgeId = 22;
  contactId = 23;

  participantStr: string;
  conferenceStr: string;
  contactStr: string;
  inMyForumStr: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              //public qrScanner: QRScanner,
              public http: Http,
              public alertCtrl: AlertController,
              public events: Events) {
    super(navCtrl, events, http);
    //console.log('create QrScannerPage');

  }

  ionViewDidLoad() {
    super.ionViewDidLoad();
    //console.log('ionViewDidLoad QrScannerPage');
    //  this.scan2();

  }

  setRussianStrings() {
    super.setRussianStrings('QR сканер');
    this.participantStr = 'Участник';
    this.conferenceStr = 'Мероприятие';
    this.contactStr = 'Контакт';
    this.inMyForumStr = ' (Мой форум)';


  }

  setEnglishStrings() {
    super.setEnglishStrings('QR scanner');
    this.participantStr = 'Exhibitor';
    this.conferenceStr = 'Event';
    this.contactStr = 'Contact';
    this.inMyForumStr = ' in My Forum';

  }

  /*  status=
      Object

    authorized: true

    canChangeCamera: true

    canEnableLight: true

    canOpenSettings: true

    currentCamera: 0

    denied: false

    lightEnabled: false

    prepared: false

    previewing: true

    restricted: false

    scanning: false

    showing: false

    Прототип Object*/
  scan2() {
    /*this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        //console.log("status=", status);
        if (status.authorized) {
          // camera permission was granted

          //console.log("start scanning");
          // start scanning

          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            //console.log('Scanned something', text);
            //alert(text);
            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
          });

          // show camera preview
          this.qrScanner.show().then(data => //console.log(data),err => //console.log(err));

          // wait for user to scan something, then the observable callback will be called

        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
          alert('denied');
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
          alert('denied slightly');
        }
      })
      .catch((e: any) => //console.log('Error is', e));*/
  }

  scan() {

// Optionally request the permission early
   /* this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted


          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((qrcode: string) => {
            //console.log('Scanned something', qrcode);
            this.qrScanner.show();
            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
//check for qr-code in the base;
            let tableParticipant = new BaseSql(this.http, 'participant');
            tableParticipant.selectWhere('qrcode="' + qrcode).then(res => {
              if (!res) {
                let rec = <any>res[0];
                let tableMyForum = new MyForumSql(this.http);
                tableMyForum.selectWhere('my_block_id=' + this.conferenceId + ' and my_id=' + rec.id).then(rs => {
                  if (!rs) {
                    let alert = this.alertCtrl.create({
                      title: this.participantStr + this.inMyForumStr,
                      subTitle: ((this.lang == 'ru') ? rec.name_ru : rec.name_eng),
                      buttons: ['OK']
                    });
                    alert.present();
                  }
                  else {
                    let confirm = this.alertCtrl.create({
                      title: this.participantStr,
                      message: this.addStr + this.inMyForumStr,
                      buttons: [
                        {
                          text: this.yesStr,
                          handler: () => {
                            //console.log('Yes clicked');
                            tableMyForum.addToMyForumSite(rec.id, this.participantId, this.userId).then(res => {
                              //console.log(rec.name_rus, " added");
                            })
                          }
                        },
                        {
                          text: this.noStr,
                          handler: () => {
                            //console.log('No clicked');
                          }
                        }
                      ]
                    });
                    confirm.present();
                  }

                });
              }
              else {
                let tableConference = new BaseSql(this.http, 'conference');
                tableConference.selectWhere('qrcode="' + qrcode).then(resConference => {
                  if (!resConference) {
                    let rec = <any>resConference[0];
                    let tableMyForum = new MyForumSql(this.http);
                    tableMyForum.selectWhere('my_block_id=' + this.conferenceId +
                      ' and my_id=' + rec.id).then(rsMyForumConference => {
                      if (!rsMyForumConference) {
                        let alert = this.alertCtrl.create({
                          title: this.conferenceStr + this.inMyForumStr,
                          subTitle: ((this.lang == 'ru') ? rec.name_ru : rec.name_eng),
                          buttons: ['OK']
                        });
                        alert.present();
                      }
                      else {
                        let confirm = this.alertCtrl.create({
                          title: this.conferenceStr,
                          message: this.addStr + this.inMyForumStr,
                          buttons: [
                            {
                              text: this.yesStr,
                              handler: () => {
                                //console.log('Yes clicked');
                                tableMyForum.addToMyForumSite(rec.id, this.conferenceId, this.userId).then(res => {
                                  //console.log(rec.name_rus, " added");
                                });
                              }
                            },
                            {
                              text: this.noStr,
                              handler: () => {
                                //console.log('No clicked');
                              }
                            }
                          ]
                        });
                        confirm.present();
                      }

                    });
                  }

                });
              }
            });


          });

          // show camera preview


          // wait for user to scan something, then the observable callback will be called

        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => //console.log('Error is', e));*/

  }

}

//[{"name":"id", "type":"text PRIMARY KEY"},{"name":"name_rus", "type":"text"},{"name":"name_eng", "type":"text"},{"name":"desc_rus", "type":"text"},{"name":"desc_eng", "type":"text"},{"name":"logo", "type":"text"},{"name":"country_rus", "type":"text"},{"name":"country_eng", "type":"text"},{"name":"address_rus", "type":"text"},{"name":"address_eng", "type":"text"},{"name":"phone", "type":"text"},{"name":"email", "type":"text"},{"name":"www", "type":"text"},{"name":"qrcode", "type":"text"},{"name":"place", "type":"text"},{"name":"thematic","type":"text"},{"name":"name_rus_upper", "type":"text"}]
//[{"name":"id", "type":"text PRIMARY KEY"}, {"name":"name_rus", "type":"text"}, {"name":"name_eng", "type":"text"}, {"name":"place_name", "type":"text"}, {"name":"place_name_eng", "type":"text"}, {"name":"place", "type":"text"}, {"name":"format", "type":"text"}, {"name":"format_eng", "type":"text"}, {"name":"contact", "type":"text"}, {"name":"contact_eng", "type":"text"}, {"name":"thematic_conference", "type":"text"}, {"name":"organizer", "type":"text"}, {"name":"organizer_eng", "type":"text"}, {"name":"date_event", "type":"text"}, {"name":"time_beg", "type":"text"}, {"name":"time_end", "type":"text"},{"name":"qrcode", "type":"text"},  {"name":"name_rus_upper", "type":"text"}]
