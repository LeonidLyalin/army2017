import {Component, ViewChild} from '@angular/core';
import {Content, NavController, NavParams, Platform, Scroll, ToastController} from 'ionic-angular';
import {PlaceApi} from "../../shared/place/place-api-service";
import {place} from "../../providers/place-sql";
import {PatriotExpoMapPage} from "../patriot-expo-map/patriot-expo-map";
import {DrawFunctionProvider} from "../../../providers/draw-function/draw-function";
import * as L from 'leaflet';
import {MapSql} from "../../../providers/map-sql/map-sql";

/**
 * Base class for show any leaflet map
 */

export interface mapSize {
  x: number;
  y: number;
}
export interface coord {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  page: any;
}
@Component({
  selector: 'leaflet-map',
  templateUrl: 'leaflet-map.html',
})
export class LeafletMapPage {

  @ViewChild(Content) content: Content;
  @ViewChild(Scroll) scroll: Scroll;
  @ViewChild('drawingCanvas') drawingCanvas;

  name_map: string = "forum_map.jpg";
  width_map: number = 724;
  height_map: number = 359;
  widthMinus: number = -this.width_map;

  canvasStyle: string = 'border: 1px black solid;position:relative;top:0px;left:-' + this.width_map.toString() + 'px;z-index:-1';

  places: place[] = [];

  imageMap = new Image;


  width = 1178;
  height = 741;
  map: any;
  bounds: any;

  popupElement: any;
  place: any;
  mapParam: any;
  typeOfMap: string;

  mapList: any;
  currentMapName: any;//
  fullMapList: any;//all maps from Table map

  currentMapNumber: number;

  showArrow: number = 0;

  popups: any;

  /**
   * @placeList for conference - several event can use the same place in differenct time
   */
  placeList: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              public placeApi: PlaceApi,
              public toastCtrl: ToastController,
              public drawFunction: DrawFunctionProvider,
              public mapSql: MapSql
              /*public placeSql: PlaceSql*/) {

    this.popupElement = navParams.get('popupElement');
    this.place = navParams.get('place');
    this.mapParam = navParams.get('map');
    console.log("popupElement=", this.popupElement);
    console.log("place=", this.place);
    console.log("mapParam=", this.mapParam);

    // this.nameMap = this.place.name_map;
  }


  // bounds = [(0, 0), (this.height, this.width)];

  private createMapList() {

    this.mapList = [];

    console.log("createMapList(popupElement=", this.popupElement);

    var flags = [], l = (this.popupElement.length);
    for (let i = 0; i < l; i++) {
      if (this.popupElement[i].name_map) {
        if (flags[this.popupElement[i].name_map]) continue;
        flags[this.popupElement[i].name_map] = true;
        this.mapList.push(this.popupElement[i].name_map);
      }


    }
    console.log("mapList=", this.mapList);
    if (this.mapList.length > 1) {
      this.showArrow = 1;
    }
    else {
      this.showArrow = 0;
    }
  }


  createPlaceList() {
    this.placeList = [];

    console.log("createPlaceList(popupElement=", this.popupElement);

    var flags = [], l = (this.popupElement.length);
    for (let i = 0; i < l; i++) {
      if (this.popupElement[i].place_name_place) {
        if (flags[this.popupElement[i].place_name_place]) continue;
        flags[this.popupElement[i].place_name_place] = true;
        this.placeList.push(this.popupElement[i].place_name_place);
      }


    }
    console.log("placeList=", this.placeList);
  }

  /**
   * get parameters of the current map from fullMapList on name_map
   */
  getMapFromFullList() {
    for (let i = 0; i < this.fullMapList.length; i++) {
      if (this.currentMapName == this.fullMapList[i].name_map) {
        this.width = this.fullMapList[i].width;
        this.height = this.fullMapList[i].height;
      }
    }
  }


  /**
   * create map
   */
  initMap() {
    this.map = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: -1
    });
    this.bounds = [[0, 0], [this.height, this.width]];//new L.LatLngBounds(this.southWest, this.northEast);
    L.imageOverlay('assets/img/maps/' + this.currentMapName, this.bounds).addTo(this.map);
    this.map.fitBounds(this.bounds);
  }

  mapBounds() {

    /*  this.map.eachLayer.then(layer => {
     this.map.removeLayer(layer);
     });
     */
    for (let popup of this.popups) {
      this.map.closePopup(popup);
    }


    this.bounds = [[0, 0], [this.height, this.width]];//new L.LatLngBounds(this.southWest, this.northEast);
    L.imageOverlay('assets/img/maps/' + this.currentMapName, this.bounds).addTo(this.map);
    this.map.fitBounds(this.bounds);

  }

  setPopups() {
    this.popups = [];
    for (let m = 0; m < this.placeList.length; m++) {
      let content = '';
      let popup = L.popup({
        closeOnClick: false,
        autoClose: false
      })
      let mCoords: number[] = [];
      content += '<b>' + this.placeList[m] + '</b>' + '<br>';
      for (let i = 0; i < this.popupElement.length; i++) {
        if ((this.popupElement[i].coords)
          && (this.popupElement[i].name_map == this.currentMapName) && (this.popupElement[i].place_name_place == this.placeList[m])) {
          console.log("this.popupElement[i].name_map ", this.popupElement[i].name_map);
          console.log("this.currentMapName=", this.currentMapName);
          console.log("this.popupElement[i].place_name_place=", this.popupElement[i].place_name_place);
          console.log("this.placeList[m]=", this.placeList[m]);
          let mCoordsTmp = this.popupElement[i].coords.split(',');


          for (let mCoordsSingle of mCoordsTmp) {
            console.log("setPopups mCoordsSingle=", mCoordsSingle);
            mCoords.push(Number(mCoordsSingle));

          }


          if (this.typeOfMap == 'conference') {
            content += this.popupElement[i].date_event + '. '
              + this.popupElement[i].time_beg + ':' +
              this.popupElement[i].time_end + '<br>';
          }
          content += this.popupElement[i].name_rus + '<br>';
          console.log("content=", content);
        }

      }
      console.log("mCoords=", mCoords);
      console.log("mCoords[0]=", mCoords[0]);
      console.log("mCoords[1]=", mCoords[1]);
      if ((mCoords[1]) && (mCoords[0])) {
        popup.setLatLng([this.height - mCoords[1], mCoords[0]]);
        popup.setContent(content);
        popup.openOn(this.map);
        this.popups.push(popup);
      }

    }
  }

  ionViewDidLoad() {

    this.typeOfMap = this.navParams.get('typeOfMap');
    this.popupElement = this.navParams.get('popupElement');
    this.place = this.navParams.get('place');
    this.mapParam = this.navParams.get('map');

    if (this.typeOfMap == 'participantDetail') {
      this.showArrow = 0;
      console.log("popupElement=", this.popupElement);
      console.log("place=", this.place);
      console.log("mapParam=", this.mapParam);
      this.map = L.map('map', {
        crs: L.CRS.Simple,
        //    minZoom: -5
      });
      this.height = this.mapParam.height;
      this.width = this.mapParam.width;
      /*this.southWest = this.map.unproject([0, this.height], this.map.getMaxZoom() - 1);
       this.northEast = this.map.unproject([this.width, 0], this.map.getMaxZoom() - 1);*/
      this.bounds = [[0, 0], [this.height, this.width]];//new L.LatLngBounds(this.southWest, this.northEast);
      L.imageOverlay('assets/img/maps/' + this.mapParam.name_map, this.bounds).addTo(this.map);
      this.map.fitBounds(this.bounds);
      let popup = L.popup({
        closeOnClick: false,
        autoClose: false
      })
      let mCoordsTmp = this.place[0].coords.split(',');
      let mCoords: number[] = [];
      console.log('mCoordsTmp= ', mCoordsTmp);
      for (let mCoordsSingle of mCoordsTmp) {
        if (mCoordsSingle) {
          console.log("mCoordsSingle=", mCoordsSingle);
          mCoords.push(Number(mCoordsSingle));
        }

      }
      console.log("mCoords[1]=", mCoords[1]);
      console.log("mCoords[0]=", mCoords[0]);
      popup.setLatLng([this.height - mCoords[1], mCoords[0]]);
      let content = this.place[0].name_rus + '<br>' + this.popupElement.name_rus;
      popup.setContent(content);
      popup.openOn(this.map);
    }

    if (this.typeOfMap == 'conference') {
      this.createMapList();
      this.currentMapName = this.mapList[0];
      this.currentMapNumber = 0;
      this.mapSql.select().then(res => {
        this.fullMapList = <any>res;
        console.log('this.fullMapList=', res);
        this.getMapFromFullList();
        this.createPlaceList();
        this.initMap();
        this.setPopups();

      });
    }

      if (this.typeOfMap == 'participant') {
        this.createMapList();
        this.currentMapName = this.mapList[0];
        this.currentMapNumber = 0;
        this.mapSql.select().then(res => {
          this.fullMapList = <any>res;
          console.log('this.fullMapList=', res);
          this.getMapFromFullList();
          this.createPlaceList();
          this.initMap();
          this.setPopups();

        });
    }


  }


  drawFigure(placeSingle: place, event) {
    this.drawFunction.drawFigure(placeSingle, this.drawingCanvas, this.imageMap, event);

  }


  areaClick(num: string, goto: string) {
    alert(num);
    console.log("goto in the begining=", goto);
    if (goto) {
      if (goto.endsWith(".jpg")) {
        goto = goto.substr(0, goto.length - 4);
        console.log("goto in the end=", goto);
      }
      if (goto = 'patriot-expo-map')
        this.navCtrl.push(PatriotExpoMapPage);
    }


  }

  mapRight() {
    console.log("mapRight this.mapList=", this.mapList);
    if (this.currentMapNumber < (this.mapList.length - 1)) {
      this.currentMapNumber++;
      this.currentMapName = this.mapList[this.currentMapNumber];
      console.log(" this.currentMapName=", this.currentMapName);
      //flayer L.imageOverlay('assets/img/maps/' + this.currentMapName, this.bounds).remove();
      this.mapBounds();
      this.setPopups();
    }
  }


  mapLeft() {
    console.log("mapLeft this.mapList=", this.mapList);
    if (this.currentMapNumber > 0) {
      this.currentMapNumber--;
      this.currentMapName = this.mapList[this.currentMapNumber];

      this.mapBounds();
      this.setPopups();
    }
  }


}




