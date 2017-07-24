import {Injectable} from '@angular/core';

import {Events, ToastController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {UserApi} from "../shared/user/user-api.service";


@Injectable()
export class UserData {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';


  authSuccessStr:string;
  wrongLogStr:string;
  lang:string;

  constructor(public events: Events,
              public storage: Storage,
              public userApi: UserApi,
              public toastCtrl: ToastController) {
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

  setRussianStrings(){
    this.authSuccessStr='Вы успешно авторизовались';
    this.wrongLogStr='Неправильный логин или пароль';
  }
  setEnglishStrings(){
    this.authSuccessStr='Successful login';
    this.wrongLogStr='Login or password is wrong';
  }

  hasFavorite(sessionName: string): boolean {
    return (this._favorites.indexOf(sessionName) > -1);
  };

  addFavorite(sessionName: string): void {
    this._favorites.push(sessionName);
  };

  removeFavorite(sessionName: string): void {
    let index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  };

  login(username, password: string): void {
    this.userApi.getUser(username, password).subscribe(
      res => {
        console.log("res after login");
        console.log(res);
        console.log(res.result.ID);
        try{
        if (res.result.ID>0){
          console.log("successful auth");
          localStorage.setItem('userid', res.result.ID);
          this.storage.set(this.HAS_LOGGED_IN, true);

          //this.storage.set("userId", res);
          console.log("username");
          console.log(username);
          this.setUsername(username);
          console.log("lastname");
          console.log(res.result.LAST_NAME);
          this.setLastName(res.result.LAST_NAME);
          console.log("userID");
          console.log(res.result.ID);
          this.setUserId(res.result.ID);
          this.events.publish('user:login');
          let toast = this.toastCtrl.create({
            message: this.authSuccessStr,
            duration: 3000
          });
          toast.present();
        }
        else{
          let toast = this.toastCtrl.create({
            message: this.wrongLogStr,
            duration: 3000
          });
          toast.present();
        }
      }catch (err) {
          console.log("error");
          console.log(err);
          return err;
        }
      }
    );

  };

  signup(username: string): void {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUsername(username);
    this.events.publish('user:signup');
  };

  logout(): void {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('username');
    this.events.publish('user:logout');
  };

  setUsername(username: string): void {
    this.storage.set('username', username);
  };

  setLastName(lastname: string): void {
    this.storage.set('lastname', lastname);
  };


  setUserId(userId: string): void {
    this.storage.set('userid', userId);
  };

  getUsername(): Promise<string> {
    return this.storage.get('username').then((value) => {
      return value;
    });
  };


  getLastName(): Promise<string> {
    return this.storage.get('lastname').then((value) => {
      return value;
    });
  };


  getUserId(): Promise<string> {
    return this.storage.get('userid').then((value) => {
      return value;
    });
  };

  hasLoggedIn(): Promise<boolean> {
    console.log(this.storage.get(this.HAS_LOGGED_IN));
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  };
}
