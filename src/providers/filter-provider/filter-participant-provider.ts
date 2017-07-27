import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

/*
 Generated class for the FilterParticipantProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class FilterParticipantProvider {
  public thematicField: string;


  filterStr: string;
  public thematicTitle: string;
  public thematicValue: string;

  public mapField: string;
  public mapTitle: string;
  public mapValue: string;

  public placeField: string;
  public placeTitle: string;
  public placeValue: string;

  public countryField: string;
  public countryTitle: string;
  public countryValue: string;

  public partOfName: string;

  setFilterStr: string;
  cancelFilterStr: string;
  findName: string;

  constructor(public http: Http) {
    console.log('Hello FilterParticipantProvider Provider');
  }

  setFilterValue(filterStr) {
    this.filterStr = filterStr;
    console.log("provider this.filterStr",this.filterStr)
  }




  cancelFilter() {
    this.thematicField = '';
    this.thematicValue = '';
    this.mapField = '';
    this.mapValue = '';
    this.placeField = '';
    this.placeValue = '';
    this.countryField = '';
    this.countryValue = '';
    this.findName='';

  }
}
