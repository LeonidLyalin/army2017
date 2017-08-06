import {Component} from '@angular/core';
import {AlertController, Events, NavController, NavParams, Platform} from 'ionic-angular';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {BaseLangPageProvider} from "../../providers/base-lang-page/base-lang-page";
import {Http} from "@angular/http";
import {BaseSql} from "../../providers/base-sql";
import {MyForumSql} from "../../providers/my-forum-sql";


/**
 * Generated class for the BarScannerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-bar-scanner',
  templateUrl: 'bar-scanner.html',
})
export class BarScannerPage extends BaseLangPageProvider {
  participantId = 1;
  conferenceId = 14;
  badgeId = 22;
  contactId = 23;

  participantStr: string;
  conferenceStr: string;
  contactStr: string;
  inMyForumStr: string;
  inContactStr:string;
  addedStr:string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public barcodeScanner: BarcodeScanner, public events: Events,
              public http: Http, public platform: Platform, public alertCtrl: AlertController) {
    super(navCtrl, events, http);
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
    this.contactStr='Контакт';
    this.inContactStr='уже сохранен';
    this.addedStr='добавлен в контакты';


  }

  setEnglishStrings() {
    super.setEnglishStrings('QR scanner');
    this.participantStr = 'Exhibitor';
    this.conferenceStr = 'Event';
    this.contactStr = 'Contact';
    this.inMyForumStr = ' in My Forum';
    this.contactStr='Contact';
    this.inContactStr='is saved';
    this.addedStr='added in contact';

  }


  scanBarCode() {
    //console.log('scannig product barcode');
    this.platform.ready().then(() => {
      this.barcodeScanner.scan().then((result) => {
        if (!result.cancelled) {
          //console.log(result.text);
          //console.log(result.format);
          let qrcode = result.text;
          let tableParticipant = new BaseSql(this.http, 'participant');
          tableParticipant.selectWhere('qrcode="' + qrcode+'"').then(res => {
            //console.log("res",<any>res);
            if (res) {

              let rec = <any>res[0];
              //console.log(rec);
              let tableMyForum = new MyForumSql(this.http);
              tableMyForum.selectWhere('my_iblock_id=' + this.participantId + ' and my_id=' + rec.id+' and user='+this.userId).then(rs => {
                //console.log("rs=",rs);
                if (rs) {
                  let alert = this.alertCtrl.create({
                    title: this.participantStr + this.inMyForumStr,
                    subTitle: ((this.lang == 'ru') ? rec.name_rus : rec.name_eng),
                    buttons: ['OK']
                  });
                  alert.present();
                }
                else {
                  let confirm = this.alertCtrl.create({
                    title: this.participantStr,
                    message: this.addStr+' '+((this.lang == 'ru') ? rec.name_rus : rec.name_eng)+' ' + this.inMyForumStr,
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
              tableConference.selectWhere('qrcode="' + qrcode+'"').then(resConference => {
                if (resConference) {
                  let rec = <any>resConference[0];
                  //console.log(rec);
                  let tableMyForum = new MyForumSql(this.http);
                  tableMyForum.selectWhere('my_iblock_id=' + this.conferenceId +
                    ' and my_id=' + rec.id+' and user='+this.userId).then(rsMyForumConference => {
                    //console.log("rsMyForumConference=",rsMyForumConference);
                    if (rsMyForumConference) {
                      let alert = this.alertCtrl.create({
                        title: this.conferenceStr + this.inMyForumStr,
                        subTitle: ((this.lang == 'ru') ? rec.name_rus : rec.name_eng),
                        buttons: ['OK']
                      });
                      alert.present();
                    }
                    else {
                      let confirm = this.alertCtrl.create({
                        title: this.conferenceStr,
                        message: this.addStr+' '+((this.lang == 'ru') ? rec.name_rus : rec.name_eng)+' ' + this.inMyForumStr,
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
                else {
                  let tableContact = new BaseSql(this.http, 'contact');
                  tableContact.selectWhere('qrcode="' + qrcode+'"').then(resContact => {
                    if (resContact) {
                      let rec = <any>resContact[0];
                      let alert = this.alertCtrl.create({
                        title: this.contactStr + this.inContactStr,
                        subTitle: ((this.lang == 'ru') ? rec.name_rus : rec.name_eng),
                        buttons: ['OK']
                      });
                      alert.present();
                    }
                    else {//if (!resContact) {
                      let myApi=new BaseSql(this.http,'contact');
                      myApi.loadApi('api/contact/get_contact.php');
                      let alert = this.alertCtrl.create({
                        title: this.addedStr ,
                        subTitle: qrcode,
                        buttons: ['OK']
                      });
                      alert.present();
                    }
                  });

                }

              });
            }
          });

        }
      }, (error) => {
        //console.log('error when scanning product barcode', error);
      });
    });


  }
}
