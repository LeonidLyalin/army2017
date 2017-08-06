import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';

import {Events, NavController} from 'ionic-angular';

import {UserData} from '../../providers/user-data';

import {TabsPage} from '../tabs/tabs';
import {SignupPage} from '../signup/signup';


@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: { username?: string, password?: string } = {};
  submitted = false;
  lang: string;

  //interface strings

  loginStr: string;
  userNameStr: string;
  needUserNameStr: string;
  passwordStr:string;
  needPasswordStr:string;
signUpStr:string;

  constructor(public navCtrl: NavController, public userData: UserData, public events: Events) {
    this.events.subscribe('language:change', () => {


      this.lang = localStorage.getItem('lang');
      if (this.lang == 'ru') {
        //console.log('this.events.subscribe(language:change)', this.lang);
        this.setRussianStrings();
      }
      else {
        this.setEnglishStrings();
      }
    });
  }

  ionViewDidLoad() {
    this.lang = localStorage.getItem('lang');
    if (this.lang == 'ru') this.setRussianStrings();
    else this.setEnglishStrings();
  }

  setRussianStrings() {
    this.loginStr = 'Войти';
    this.userNameStr = 'Логин';
    this.needUserNameStr='Требуется имя пользователя';
    this.passwordStr='Пароль';
    this.needPasswordStr='Требуется пароль';
    this.signUpStr='Регистрация';
  }

  setEnglishStrings() {
    this.loginStr = 'Login';
    this.userNameStr = 'Username';
    this.needUserNameStr='Need a username';
    this.passwordStr='Password';
    this.needPasswordStr='Need a password';
    this.signUpStr='Sign Up';
  }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.userData.login(this.login.username, this.login.password);
      this.navCtrl.push(TabsPage);
    }
  }

  onSignup() {
    this.navCtrl.push(SignupPage);
  }
}
