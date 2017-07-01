import {Injectable} from '@angular/core';
import {Http /*, Response*/} from '@angular/http';

import 'rxjs';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class UserApi {
  private baseUrl = 'http://army2017.ru/api';


  constructor(public http: Http) {
    console.log('conferenceSingle api is created');
  }

  public userId: any;

  getUser(login, password) {
    try {
      console.log("I'm inside try");
      console.log(login);
      console.log(password);
      console.log(`${this.baseUrl}/check_user.php?LOGIN=` + login + `&PASSWORD=` + password);
      return this.http.get(`${this.baseUrl}/check_user.php?LOGIN=` + login + `&PASSWORD=` + password).map(response => {
        console.log("response");
        let res = response.json();
        console.log(res);
        this.userId=res.result.ID;
        console.log(this.userId);
        localStorage.setItem('userId', this.userId);
        return res;
      })

    }
    catch (err) {
      console.log("error");
      console.log(err);
      return err;
    }

  }

}
