import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

/*
 Generated class for the FilterParticipantProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class FilterConferenceProvider {
  filterStr: string;


  public thematicConferenceField: string;
  public thematicConferenceTitle: string;
  public thematicConferenceValue: string;

  public mapField: string;
  public mapTitle: string;
  public mapValue: string;

  public placeField: string;
  public placeTitle: string;
  public placeValue: string;

 /* public countryField: string;
  public countryTitle: string;
  public countryValue: string;*/

  public dateField: string;
  public dateTitle: string;
  public dateValue: string;

  public partOfName: string;

  setStr: string;
  cancelFilterStr: string;
  findName: string;

  constructor(public http: Http) {
    console.log('Hello FilterParticipantProvider Provider');
  }

  setFilterStr(filterStr) {
    this.filterStr = filterStr;
    console.log("provider this.filterStr",this.filterStr)
  }

/*  filterCreateWhereStr() {
    console.log("this.thematicConferenceValue", this.thematicConferenceValue);
    console.log("this.countryValue", this.countryValue);
    console.log("this.mapValue=", this.mapValue);
    console.log("(this.placeValue=", this.placeValue);
    let whereStr = '';

    if ((this.partOfName) && (this.partOfName != '')) {
      if (this.lang == 'ru') {
        whereStr += ((whereStr != '') ? ' and ' : '') + ' a.name_rus_upper like' + '"%' + this.partOfName.toUpperCase() + '%"';
      }
      else {
        whereStr += ((whereStr != '') ? ' and ' : '') + 'a.name_eng like' + '"%' + this.partOfName.toUpperCase() + '%"'
      }

    }

    if ((this.countryValue) && (this.countryValue != '')) {
      if (this.lang == 'ru') {
        whereStr += ((whereStr != '') ? ' and ' : '') + 'a.country_rus="' + this.countryValue + '"';
      }
      else {
        whereStr += ((whereStr != '') ? ' and ' : '') + 'a.country_eng="' + this.countryValue + '"';
      }
    }
    if ((this.mapValue) && ((this.placeValue == '') && (this.mapValue != ''))) {
      let places = new BaseSql(this.http, 'place');
      places.selectDistinct('id', 'name_map="' + this.mapValue + '"').then(res => {
        let placeList = <any>res;
        console.log("place", placeList);
        if (placeList.length() > 0) whereStr += ((whereStr != '') ? ' and (' : ' (');
        for (let i = 0; i < placeList.length(); i++) {
          whereStr += ' place=' + placeList[i].id;
          if (i < placeList.length() - 1) whereStr += ' or ';
        }
        whereStr += ')';
      })
      console.log("((this.placeValue=='') && (this.mapValue!=''))", whereStr);
    }

    if (this.thematicConferenceValue) {

      whereStr += ((whereStr != '') ? ' and ' : '') + '(a.thematic="' + this.thematicConferenceValue + '" or a.thematic like "' + this.thematicConferenceValue +
        ',%"' + ' or a.thematic like "%,' + this.thematicConferenceValue + '" or  a.thematic like "%,' + this.thematicConferenceValue + ',%")';
    }
    console.log("(whereStr after thematic=", whereStr);

    /!*if (this.partOfName != '') whereStr += ((whereStr != '') ? ' and ' : '') + ' a.name_rus like ' + '"%' + this.partOfName + '%"';
     *!/
    if (this.placeValue && (this.placeValue != ''))
      whereStr += ((whereStr != '') ? ' and ' : '') + '  a.place="' + this.placeValue + '"';
    if (whereStr != '') whereStr = ' where ' + whereStr;
    console.log('so whereStr is =', whereStr);
    return whereStr;
  }*/


  cancelFilter() {
    this.thematicConferenceField = '';
    this.thematicConferenceValue = '';
    this.mapField = '';
    this.mapValue = '';
    this.placeField = '';
    this.placeValue = '';
    this.dateField = '';
    this.dateValue = '';
   /* this.countryField = '';
    this.countryValue = '';*/
    this.findName='';

  }
}
