import {Component, ViewChild} from '@angular/core';
import {Content, NavController, NavParams, Platform, Scroll, ToastController} from 'ionic-angular';


import {WaterClusterMapPage} from "../water-cluster-map/water-cluster-map";
import {GroundClusterMapPage} from "../ground-cluster-map/ground-cluster-map";
import {AirClusterMapPage} from "../air-cluster-map/air-cluster-map";
import {ParkPatriotMapPage} from "../park-patriot-map/park-patriot-map";
import {PlaceApi} from "../../shared/place/place-api-service";
import {place} from "../../../providers/place-sql/place-sql";
import {PatriotExpoMapPage} from "../patriot-expo-map/patriot-expo-map";
import {DrawFunctionProvider} from "../../../providers/draw-function/draw-function";
import * as L from 'leaflet';

/**
 * Generated class for the ForumMapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
/*
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
}*/
@Component({
  selector: 'page-forum-map1',
  templateUrl: 'forum-map1.html',
})
export class ForumMap1Page {

  @ViewChild(Content) content: Content;
  @ViewChild(Scroll) scroll: Scroll;
  @ViewChild('drawingCanvas') drawingCanvas;

  name_map: string = "forum_map.jpg";
  width_map: number = 724;
  height_map: number = 359;
  widthMinus: number = -this.width_map;

  //canvasStyle: string = 'border: 1px black solid;position:relative;top:0px;left:-' + this.width_map.toString() + 'px;z-index:-1';

  places: place[] = [];
  //hdc: any;
  imageMap = new Image;
  //map_id="forum-map";
  //map_id_img="#forum-map";



  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              public placeApi: PlaceApi,
              public toastCtrl: ToastController,
              public drawFunction: DrawFunctionProvider
              /*public placeSql: PlaceSql*/) {


  }

  width=1178;
  height=741;
  map:any;
  bounds:any;
  southWest:any;
  northEast:any;

 // bounds = [(0, 0), (this.height, this.width)];





  ionViewDidLoad() {
    this.map = L.map('map', {
      crs: L.CRS.Simple
      //  minZoom: -5
    });
    this.southWest = this.map.unproject([0, this.height], this.map.getMaxZoom()-1);
     this.northEast = this.map.unproject([this.width, 0], this.map.getMaxZoom()-1);
    this.bounds = [[0,0],[this.height,this.width]];//new L.LatLngBounds(this.southWest, this.northEast);
      let image = L.imageOverlay('assets/img/maps/hallA.jpg', this.bounds).addTo(this.map);
      this.map.fitBounds(this.bounds);
      /*L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.streets-basic/{z}/{x}/{y}.png?access_token={accessToken}', {
       attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
       maxZoom: 18,
       accessToken: 'xxx'
       }).addTo(this.map);*/

    }




/*
  drawRect(placeSingle: place) {
    let mCoordsStr: string = placeSingle.coords.toString();
    console.log("mCoordsStr=", mCoordsStr);
    let mCoords = mCoordsStr.split(',');
    console.log(mCoords);
    console.log("placeSingle.coords=", placeSingle.coords);
    console.log("placeSingle.coords[0]=", placeSingle.coords[0]);
    let top, left, bot, right: number;
    left = Number(mCoords[0]);
    top = Number(mCoords[1]);
    right = Number(mCoords[2]);
    bot = Number(mCoords[3]);
    console.log("left=", left);
    console.log("top=", top);
    console.log("right=", right);
    console.log("bot=", bot);
    // set the 'default' values for the colour/width of fill/stroke operations
    this.hdc = this.drawingCanvas.nativeElement.getContext('2d');
    this.hdc.drawImage(this.imageMap, 0, 0);
    this.hdc.fillStyle = 'red';
    this.hdc.strokeStyle = 'red';
    this.hdc.lineWidth = 2;
    this.hdc.strokeRect(left, top, right - left, bot - top);

  }*/

/*  drawPoly(placeSingle: place) {
    console.log("placeSingle.coords=", placeSingle.coords);

    let mCoordsStr = placeSingle.coords.toString();
    let mCoordsTmp = mCoordsStr.split(',');
    console.log("mCoordsTmp=", mCoordsTmp);
    let mCoords: number[] = [];

    for (let mCoordsSingle of mCoordsTmp) {
      console.log("mCoordsSingle=", mCoordsSingle);
      mCoords.push(Number(mCoordsSingle));

    }
    let i, n;
    n = mCoords.length;
    console.log("mCoords=", mCoords);
    // set the 'default' values for the colour/width of fill/stroke operations
    this.hdc = this.drawingCanvas.nativeElement.getContext('2d');
    this.hdc.drawImage(this.imageMap, 0, 0);
    this.hdc.fillStyle = 'red';
    this.hdc.strokeStyle = 'red';
    this.hdc.lineWidth = 2;
    // this.hdc.strokeRect(0, 0, 100, 100);
    this.hdc.beginPath();
    this.hdc.moveTo(mCoords[0], mCoords[1]);
    for (i = 2; i < n; i += 2) {
      this.hdc.lineTo(mCoords[i], mCoords[i + 1]);
    }
    this.hdc.lineTo(mCoords[0], mCoords[1]);
    this.hdc.stroke();
  }*/

  drawFigure(placeSingle: place, event) {
    this.drawFunction.drawFigure(placeSingle, this.drawingCanvas, this.imageMap, event);
    /* let element=event.target;
     console.log("element=",element);
     console.log("element.shape=",element.shape);
     if (element.shape=='poly'){
     this.drawFunction.drawPoly(placeSingle, this.drawingCanvas, this.imageMap);
     return true;
     }
     if (element.shape=='rect'){
     this.drawFunction.drawRect(placeSingle, this.drawingCanvas, this.imageMap);
     return true;
     }
     //define drawRect or DrawPoly
     if (placeSingle.shape == 'poly') {
     this.drawFunction.drawPoly(placeSingle, this.drawingCanvas, this.imageMap);
     return true;
     }
     if (placeSingle.shape == 'rect') {
     this.drawFunction.drawRect(placeSingle, this.drawingCanvas, this.imageMap);
     return true;
     }
     let mCoords: string = placeSingle.coords.toString();
     let tmpCoords = mCoords.split(',');
     if (tmpCoords.length > 4) {
     this.drawFunction.drawPoly(placeSingle, this.drawingCanvas, this.imageMap);
     return true;
     }
     else {
     this.drawFunction.drawRect(placeSingle, this.drawingCanvas, this.imageMap);
     return true;
     }
     */
  }


  waterClusterMap() {

    this.navCtrl.push(WaterClusterMapPage);

  }

  groundClusterMap() {

    this.navCtrl.push(GroundClusterMapPage);

  }

  airClusterMap() {

    this.navCtrl.push(AirClusterMapPage);

  }

  parkPatriotMap() {
    this.navCtrl.push(ParkPatriotMapPage);
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

  deletePlaceAll() {
    //this.placeSql.delAllPlace(this.name_map);
  }

  getPlaceApi() {

    let toast = this.toastCtrl.create({
      message: 'Загрузка из API ',
      duration: 5000
    });
    toast.present();
    return this.placeApi.getPlace(this.name_map).subscribe(res => {
      this.places = [];
      console.log("getPlaceApi res=", res);
      for (let item of res) {
        console.log("item of res=", item);
        this.places.push(<place>item);

      }

      //console.log("this.places=", this.places);
      // return res(this.places);
    });

  }

  addItemPlace() {
    /* let toast = this.toastCtrl.create({
     message: 'Запись в базу',
     duration: 5000
     });
     toast.present();
     this.placeSql.addAllItemPlace(this.places);*/

  }

  getPlaceApiInsertBase() {

    /* let toast = this.toastCtrl.create({
     message: 'Загрузка из API ',
     duration: 5000
     });
     toast.present();
     return this.placeApi.getPlace(this.name_map).subscribe(res => {
     this.places = [];
     console.log("getPlaceApi res=", res);
     for (let item of res) {
     console.log("item of res=", item);
     this.places.push(<place>item);
     this.placeSql.addItemPlace(<place>item);
     }


     });
     */
  }
}




