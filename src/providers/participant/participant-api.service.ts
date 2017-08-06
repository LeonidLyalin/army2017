import {Injectable} from '@angular/core';
import {Http /*, Response*/} from '@angular/http';

import 'rxjs';
import {Observable} from 'rxjs/Observable';
import {BaseApi} from "../base-api-service";

@Injectable()
export class ParticipantApi extends BaseApi{
//  private baseUrl = '/baseapi';//http://army2017.ru/api';
  currentParticipant: any = {};
  private participants: any = {};
  private participantData = {};

  constructor(public http: Http) {
    super(http);
    //console.log('conferenceSingle api is created');
  }

  public userId:any;

  getParticipant() {
    //console.log('**about to make HTTP call for all');
    return this.http.get(this.baseUrlApi+'/participant_list_app.php')
      .map(response => {
        this.participants = response.json();
        //console.log(this.participants);
        return this.participants;
      });
  }



  getParticipantData(iblockId, forceRefresh: boolean = false): Observable<any> {
    if (!forceRefresh && this.participantData[iblockId]) {
      this.currentParticipant = this.participantData[iblockId];
      //console.log('**no need to make HTTP call, just return the data');
      return Observable.of(this.currentParticipant);
    }

    // don't have data yet

    //@TODO make api/conferenceSingle.php to getOneParticipantRus single conferenceSingle
    //console.log('**about to make HTTP call');
    return this.http.get(`${this.baseUrlApi}/participant.php?ID={iblockId}`)
      .map(response => {
        this.participantData[iblockId] = response.json();
        this.currentParticipant = this.participantData[iblockId];
        return this.currentParticipant;
      });
  }

  getCurrentParticipant() {
    return this.currentParticipant;
  }

  refreshCurrentParticipant() {
    return this.getParticipantData(this.currentParticipant.tournament.id, true);
  }
}
