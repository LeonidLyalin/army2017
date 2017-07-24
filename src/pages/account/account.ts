import {Component} from '@angular/core';

import {AlertController, Events, NavController} from 'ionic-angular';

import {UserData} from '../providers/user-data';
import {TabsPage} from "../tabs/tabs";


@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  username: string;
  lastname: string;


  //interface strings

  profileStr: string;
  changeUserNameStr: string;
  updatePictureStr: string;
  changePasswordStr: string;
  supportStr:string;
  logOutStr:string;
  exitStr:string;

  lang: string;

  constructor(public alertCtrl: AlertController, public nav: NavController, public userData: UserData,
              public events: Events) {
    this.events.subscribe('language:change', () => {


      this.lang = localStorage.getItem('lang');
      if (this.lang == 'ru') {
        console.log('this.events.subscribe(language:change)', this.lang);
        this.setRussianStrings();
      }
      else {
        this.setEnglishStrings();
      }
    });
  }


  setRussianStrings() {
    this.updatePictureStr = 'Изменить фото';
    this.changeUserNameStr = 'Сменить пользователя';
    this.changePasswordStr = 'Изменить пароль';
    this.supportStr='Поддержка';
    this.logOutStr='Выйти';
    this.exitStr='Закрыть';
    this.profileStr='Профиль';
  }

  setEnglishStrings() {
    this.changeUserNameStr = 'Change Username';
    this.updatePictureStr = 'Update Picture';
    this.changePasswordStr = 'Change Password';
    this.supportStr='Support';
    this.logOutStr='Logout';
    this.exitStr='Close';
    this.profileStr='Profile';

  }

  ngAfterViewInit() {
    this.getUsername();
    this.getLastName();
  }

  updatePicture() {
    console.log('Clicked to update picture');
  }

  ionViewDidLoad(){
    this.lang = localStorage.getItem('lang');
    if (this.lang == 'ru') this.setRussianStrings();
    else this.setEnglishStrings();
  }
  // Present an alert with the current username populated
  // clicking OK will update the username and display it
  // clicking Cancel will close the alert and do nothing
  changeUsername() {
    let alert = this.alertCtrl.create({
      title: 'Change Username',
      buttons: [
        'Cancel'
      ]
    });
    alert.addInput({
      name: 'username',
      value: this.username,
      placeholder: 'username'
    });
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        this.userData.setUsername(data.username);
        this.getUsername();
      }
    });

    alert.present();
  }

  getUsername() {
    this.userData.getUsername().then((username) => {
      this.username = username;
    });
  }

  getLastName() {
    this.userData.getLastName().then((lastname) => {
      this.lastname = lastname;
    });
  }

  changePassword() {
    console.log('Clicked to change password');
  }

  logout() {
    this.userData.logout();
    this.nav.setRoot('LoginPage');
  }

  support() {
    this.nav.push('SupportPage');
  }

  exitProfile(){
    this.nav.push(TabsPage);
  }
}
