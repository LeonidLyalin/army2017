import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {UserData} from "../../providers/user-data";

/*
 Generated class for the MyForumApi provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class MyForumApi {
  private baseUrlApi = 'http://army2017.ru/api';
  private baseUrlAjax = 'http://army2017.ru/ajax';
  private myForum: any = {};


  constructor(public http: Http) {
    console.log('Hello MyForumApi Provider');

  }

  getMyForum(userID) {


    console.log('**about to make HTTP call for all');
    return this.http.get(`${this.baseUrlApi}/my_forum/my_forum_list.php?USER=` + userID + `&LOWERCASE=1`)
      .map(response => {
        this.myForum = response.json();
        console.log(this.myForum);
        return this.myForum;
      });


  }

  /**
   * $idBlock = $_REQUEST["ID_BLOCK"];
   $id = $_REQUEST["ID"];
   $idUser = $_REQUEST["USER_ID"];
   * @param userID
   */

  /**
   *
   * @param user_id
   * @param id_block
   * @param id
   * @returns {Observable<R>}
   */
  addToMyForumSite(id_block, id) {
    let user_id=localStorage.getItem('userid');
    if (!(user_id=>0) )
    console.log('**about to add to MyForum');
    return this.http.get(`${this.baseUrlAjax}/add_my_forum.php?USER_ID=` + user_id + `&ID_BLOCK=` + id_block + '&ID=' + id)
      .map(data => {
        let res=data.json();
        console.log("added to MyForum");
        console.log(res);
        return res;
      });
  }

  /**
   *
   * @param id
   * @returns {Observable<R>}
   */
  delFromMyForum(id) {
    console.log('**about to delete from MyForum');
    console.log(id);
    return this.http.get(`${this.baseUrlAjax}/del_my_forum.php?DEL_ID=` + id)
      .map(data => {
        let res=data.json;
        console.log("deleted from MyForum");
        console.log(res);
        return res;
      });
  }

}
