import {Component, ViewChild} from '@angular/core';
import {AlertController, NavController, NavParams, ToastController} from 'ionic-angular';
import {PlaceApi} from "../../shared/place/place-api-service";
import {PlaceSql} from "../../providers/place-sql";
import {ParticipantDetailPage} from "../../participant-detail/participant-detail";
import {DrawFunctionProvider} from "../../../providers/draw-function/draw-function";
import {MapBaseProvider} from "../../../providers/map-base/map-base";

/**
 * Generated class for the HallAMapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
/*export interface place {
 id: number;
 coords: number[];
 name_rus: string;
 name_eng: string;
 number_on_map: string;
 name_map: string;
 goto: string;
 shape: string;
 }*/


@Component({
  selector: 'page-hall-a-map',
  templateUrl: 'hall-a-map.html',
})
export class HallAMapPage extends MapBaseProvider {

  /* @ViewChild('drawingCanvas') drawingCanvas;


   places: place[] = [];

   width_map: number = 1178;
   height_map: number = 741;
   name_map: any = 'hallA.jpg';
   widthMinus: number = -this.width_map;
   hdc: any;
   imageMap = new Image;
   participant_name: string = '';*/

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public placeApi: PlaceApi,
              public toastCtrl: ToastController,
              public placeSql: PlaceSql,
              public drawFunction: DrawFunctionProvider,
              public alertCtrl: AlertController,) {

    super(navCtrl,
      navParams,
      placeApi,
      toastCtrl,
      placeSql,
      drawFunction,
      alertCtrl,
      1178,
      741,
      'hallA.jpg');
  }


}
