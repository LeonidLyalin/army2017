import {Component, ViewChild} from '@angular/core';
import {Content, Events, NavController, NavParams, Platform, Scroll, ToastController} from 'ionic-angular';
import {place, PlaceSql} from "../../../providers/place-sql/place-sql";
import {PatriotExpoMapPage} from "../patriot-expo-map/patriot-expo-map";
import {DrawFunctionProvider} from "../../../providers/draw-function/draw-function";
import * as L from 'leaflet';
import {MapSql} from "../../../providers/map-sql/map-sql";
import {Http} from "@angular/http";
import {BaseLangPageProvider} from "../../../providers/base-lang-page/base-lang-page";
import {ParticipantDetailPage} from "../../participant-detail/participant-detail";
import {MyForumSql} from "../../../providers/my-forum-sql";

/**
 * Base class for show any leaflet map
 */

/*export interface mapSize {
  x: number;
  y: number;
}*/

/*export interface coord {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  page: any;
}*/

@Component({
  selector: 'leaflet-map',
  templateUrl: 'leaflet-map.html',
})
export class LeafletMapPage extends BaseLangPageProvider {

  @ViewChild(Content) content: Content;
  @ViewChild(Scroll) scroll: Scroll;
  @ViewChild('drawingCanvas') drawingCanvas;

  name_map: string = "forum_map.jpg";
  width_map: number = 724;
  height_map: number = 359;
  widthMinus: number = -this.width_map;

  //canvasStyle: string = 'border: 1px black solid;position:relative;top:0px;left:-' + this.width_map.toString() + 'px;z-index:-1';

  places: place[] = [];

  imageMap = new Image;


  // width = 1178;
  // height = 741;
  map: any;
  bounds: any;

  popupElement: any;
  place: any;
  //mapParam: any;
  typeOfMap: string;

  mapList: any;
  //currentMapName: any;//
  fullMapList: any;//all maps from Table map

  currentMapNumber: number;


  mapTitle: string;
  showArrow: boolean;

  popups: any;

  /**
   * define show or not arrow buttons, depending on the description of the map
   */
  showLeftArrow: boolean;
  showRightArrow: boolean;
  showUpArrow: boolean;
  showDownArrow: boolean;
  showPreviousArrow: boolean;

  /**
   * define show or not popups on the map
   */
  showPopups: boolean = true;

  /**
   * @placeList for conference - several event can use the same place in differenct time
   */
  placeList: any;
  /**
   *  @list of places for the currentMap
   */
  placeListForMap: any;
  lang: string;

  //interface strings

  titleStr: string;


  currentMap: any;

  constructor(public http: Http,
              public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              /*public placeApi: PlaceApi,*/
              public toastCtrl: ToastController,
              public drawFunction: DrawFunctionProvider,
              public mapSql: MapSql,
              public events: Events,
              public placeSql: PlaceSql) {
    super(navCtrl, events, http);
    this.popupElement = navParams.get('popupElement');
    this.place = navParams.get('place');
    this.currentMap = navParams.get('map');
    console.log("popupElement=", this.popupElement);
    console.log("place=", this.place);
    console.log("currentMap=", this.currentMap);


  }


  setRussianStrings() {
    super.setRussianStrings('Карта форума');

  }

  setEnglishStrings() {
    super.setRussianStrings('Forum map');

  }


  /**
   * create map list for all USING maps
   */
  private createMapList() {

    this.mapList = [];

    console.log("createMapList(popupElement=", this.popupElement);
    if (this.popupElement && this.popupElement.length) {

      let flags = [], l = (this.popupElement.length);
      for (let i = 0; i < l; i++) {
        if (this.popupElement[i].name_map) {
          if (flags[this.popupElement[i].name_map]) continue;
          flags[this.popupElement[i].name_map] = true;
          this.mapList.push(this.popupElement[i].name_map);
        }


      }
      console.log("mapList=", this.mapList);
      this.showArrow = (this.mapList.length > 1);

    }

  }

  /**
   * create place list from popupElement from navParams
   */
  createPlaceList() {
    this.placeList = [];
    if (this.popupElement) {
      console.log("createPlaceList(popupElement=", this.popupElement);

      let flags = [], l = (this.popupElement.length);
      for (let i = 0; i < l; i++) {
        if (this.popupElement[i].place_name_place) {
          if (flags[this.popupElement[i].place_name_place]) continue;
          flags[this.popupElement[i].place_name_place] = true;
          this.placeList.push(this.popupElement[i].place_name_place);
        }


      }
      console.log("placeList=", this.placeList);
    }
  }

  /*  /!**
     * get parameters of the current map from fullMapList on name_map
     *!/
    getMapFromFullList() {
      for (let i = 0; i < this.fullMapList.length; i++) {
        //if (this.currentMapName == this.fullMapList[i].name_map) {
        if (this.currentMap.name_map == this.fullMapList[i].name_map) {
          /!*this.width = this.fullMapList[i].width;
          this.height = this.fullMapList[i].height;*!/
          this.currentMap = this.fullMapList[i];
          //  this.currentMap.height = this.fullMapList[i].height;
          this.titleStr = this.fullMapList[i]['name_' + (this.lang == 'ru' ? 'rus' : 'eng')];

        }

      }
    }*/


  /**
   * create map
   */
  initMap() {
    if (!this.map) {
      this.map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 5,
        zoom: 1,
      });
    }

    this.bounds = [[0, 0], [this.currentMap.height, this.currentMap.width]];//new L.LatLngBounds(this.southWest, this.northEast);
    // L.imageOverlay('assets/img/maps/' + this.currentMapName, this.bounds).addTo(this.map);
    L.imageOverlay('assets/img/maps/' + this.currentMap.name_map, this.bounds).addTo(this.map);
    this.map.fitBounds(this.bounds);
    this.map.tap = true;
    this.map.on('click', (e) => {
      this.mapClick(e)
    });

    this.map.on('zoom', (e) => {
      this.mapOnZoom(e)
    });

    this.createPlaceListForMap();

  }


  createPlaceListForMap() {
    // this.placeSql.selectWhere('name_map="'+this.currentMapName+'"').then(res=>{
    this.placeSql.selectWhere('name_map="' + this.currentMap.name_map + '"').then(res => {
      this.placeListForMap = <any>res;
      console.log("this.placeListForMap=", this.placeListForMap);
    });


  }

  static pnpoly(nvert, vertx, verty, testx, testy) {
    let i, j, c = false;
    for (i = 0, j = nvert - 1; i < nvert; j = i++) {
      if (( ( verty[i] > testy ) !== ( verty[j] > testy ) ) &&
        ( testx < ( vertx[j] - vertx[i] ) * ( testy - verty[i] ) / ( verty[j] - verty[i] ) + vertx[i] )) {
        c = !c;
      }
    }
    return c;
  }

  isInsideRect(x, y, coords, place_name) {
    console.log("isInsideRect coords=", coords);
    console.log("isInsideRect x=", x);
    console.log("isInsideRect y=", y);
    let coordsList = coords.split(',');
    console.log("isInsideRect coordsList=", coordsList);
    let bounds = [[this.currentMap.height - coordsList[1], coordsList[0]], [this.currentMap.height - coordsList[3], coordsList[2]]];
    console.log("bounds before ", place_name, bounds);
    console.log("coordsList[1] before ", coordsList[1]);
    console.log("height -coordsList[1] before ", this.currentMap.height - coordsList[1]);
    console.log("coordsList[3] before ", coordsList[3]);
    if ((this.currentMap.height - Number(coordsList[1])) > (this.currentMap.height - Number(coordsList[3]))) {
      let tmp = coordsList[1];
      coordsList[1] = coordsList[3];
      coordsList[3] = tmp;
    }
    if (Number(coordsList[0]) > Number(coordsList[2])) {
      let tmp = coordsList[0];
      coordsList[0] = coordsList[2];
      coordsList[2] = tmp;
    }
    console.log("coordsList[1] after ", coordsList[1]);
    bounds = [[this.currentMap.height - coordsList[1], coordsList[0]], [this.currentMap.height - coordsList[3], coordsList[2]]];
    console.log("bounds after", place_name, bounds);
    //L.rectangle(this.bounds, {color: "red", weight: 1}).addTo(this.map);

    return (((y >= (this.currentMap.height - coordsList[1]))
      && (y <= (this.currentMap.height - coordsList[3]))) && ((x >= (coordsList[0])) && (x <= (coordsList[2]))));


  }

  isInsidePoly(x, y, coords) {
    /*    for (var i = 0; i < placeList.length; i++) {
            if (placeList[i].shape == 'poly') {
                var tmpCoords = placeList[i].coords.split(',');
                console.log("tmpCoords=", tmpCoords);
                var tmpBounds = [];
                for (var m = 0; m < tmpCoords.length; m = m + 2) {
                    tmpBounds.push([height-tmpCoords[m + 1],tmpCoords[m]]);


                }
                console.log("tmpBounds=", tmpBounds);
                L.polygon(tmpBounds, {color: 'green', weight: 2}).addTo(map);
            }*/


    //prepare for check;
    let tmpBounds = [];
    console.log("isInsidePoly coords=", coords);
    let coordsList = coords.split(',');
    console.log("isInsidePoly coordsList=", coordsList);
    let vertx = [];
    let verty = [];
    let nvert = 0;


    for (let i = 0; i < coordsList.length; i = i + 2) {
      nvert++;
      verty.push(this.currentMap.height - coordsList[i + 1]);
      vertx.push(coordsList[i] * 1);
      tmpBounds.push([this.currentMap.height - coordsList[i + 1], coordsList[i]]);

    }
    console.log("isInsidePoly nvert=", nvert);
    console.log("isInsidePoly vertx=", vertx);
    console.log("isInsidePoly verty=", verty);

    console.log("isInsidePoly tmpBounds=", tmpBounds);
    // L.polygon(tmpBounds, {color: 'blue', weight: 2}).addTo(this.map);
    return LeafletMapPage.pnpoly(nvert, vertx, verty, x, y);
  }


  /**
   * Show and place popups on the currentmap
   * @param content - what will be shown on the popup
   * @param coords - where to place pop up (actualy, firtst two numbers from the coords)
   */

  showPopup(content, coords) {
    /*console.log("x=", x);
    console.log("y=", y);*/
    console.log("content=", content);
    if (coords) {


      let mCoordsTmp = coords.split(',');
      let mCoords: number[] = [];
      console.log('mCoordsTmp= ', mCoordsTmp);
      for (let mCoordsSingle of mCoordsTmp) {
        if (mCoordsSingle) {
          console.log("mCoordsSingle=", mCoordsSingle);
          mCoords.push(Number(mCoordsSingle));
        }


      }
      L.popup({
        closeOnClick: false,
        autoClose: false
      })
        .setLatLng([this.currentMap.height - mCoords[1], mCoords[0]])
        .setContent(content)
        .openOn(this.map);
    }


  }

  /*  checkPlaceOnMap(x, y) {

      for (let i = 0; i < this.placeListForMap.length; i++) {
        console.log("placeList=", this.placeListForMap[i].coords);
        if (this.placeListForMap[i].shape == 'poly') {
          if (this.isInsidePoly(x, y, this.placeListForMap[i].coords)) {
            let content = '<b>' + this.placeListForMap[i].name_place_rus + "</b><br>" +
              '<a href="' + this.placeListForMap[i].ref + '">' + this.placeListForMap[i].name_rus + '</a>';
            this.showPopup(x, this.currentMap.height - y, content);
            break;
          }
        }

        else {
          if (this.isInsideRect(x, y, this.placeListForMap[i].coords, this.placeListForMap[i].name_place_rus)) {
            let content = '<b>' + this.placeListForMap[i].name_place_rus + "</b><br>" +
              '<a href="' + this.placeListForMap[i].ref + '">' + this.placeListForMap[i].name_rus + '</a>';
            this.showPopup(x, this.currentMap.height - y, content);
            break;
          }
        }

      }


    }*/


  mapClick(e) {
    console.log(e);

    console.log(e.latlng.lng, e.latlng.lat, '');
    console.log("this.placeListForMap", this.placeListForMap);
    if (this.placeListForMap.length) {
      let goDetail: boolean = false;
      let numFind: number;
      for (let i = 0; i < this.placeListForMap.length; i++) {
        console.log("mapClick(e) this.placeListForMap[i]=", this.placeListForMap[i]);

        if (this.placeListForMap[i].shape == 'rect' || !this.placeListForMap[i].shape) {
          if (this.isInsideRect(e.latlng.lng, e.latlng.lat, this.placeListForMap[i].coords, this.placeListForMap[i].place_name)) {

            numFind = i;
            goDetail = true;
            break;
          }
        }
        else {
          console.log('check for poly');
          if (this.placeListForMap[i].shape == 'poly') {
            if (this.isInsidePoly(e.latlng.lng, e.latlng.lat, this.placeListForMap[i].coords)) {

              numFind = i;
              goDetail = true;
              break;
            }
          }
        }
      }
      /* ((this.placeListForMap[i].shape=='poly ') &&
         (this.isInsidePoly(e.latlng.lng, e.latlng.lat, this.placeListForMap[i].coords)))){*/
      //an example how to use coordinates with leaflet (look at height!!!)
      //   this.showPopup(e.latlng.lng, this.currentMap.height - e.latlng.lat, this.placeListForMap[i].name_rus);
      if (goDetail) {
        console.log("this.placeListForMap[i]=", this.placeListForMap[numFind]);
        if (this.placeListForMap[numFind].goto) {
          //goto to the new map

          for (let i = 0; i < this.fullMapList.length; i++) {
            if (this.fullMapList[i].name_map == this.placeListForMap[numFind].goto) {
              this.currentMap = this.fullMapList[i];
              // setMap();
              console.log("currentMap=", this.currentMap.name_map);
              this.currentMapNumber = i;
              break;
            }

          }
          //this.getMapFromFullList();
          this.setMap();
          this.setButtonsEnable();
          //if (this.showPopups) this.setPopups();
        }
        else {
          let tmpSql = new MyForumSql(this.http);

          tmpSql.getRusParticipantFull('where a.place=' + this.placeListForMap[numFind].id).then(res => {


            if ((<any>res).length) {
              let participant = <any>res;
              console.log("participant=", participant);
              this.navCtrl.push(ParticipantDetailPage, {participant: participant, map: false})
            }
          });
        }

      }
    }
  }


  deleteLayers() {
    this.map.eachLayer(rs => {
      this.map.removeLayer(rs);
    });
  }

  /**
   *   set a new map on a screen (deleting all layer before this)
   */
  setMap() {

    this.deleteLayers();
    this.bounds = [[0, 0], [this.currentMap.height, this.currentMap.width]];//new L.LatLngBounds(this.southWest, this.northEast);
    L.imageOverlay('assets/img/maps/' + this.currentMap.name_map, this.bounds).addTo(this.map);
    this.map.fitBounds(this.bounds);

    this.titleStr = this.currentMap['name_' + (this.lang == 'ru' ? 'rus' : 'eng')];
    this.createPlaceListForMap();
  }

  /*  mapBounds() {
      for (let popup of this.popups) {
        this.map.closePopup(popup);
      }
      this.bounds = [[0, 0], [this.currentMap.height, this.currentMap.width]];//new L.LatLngBounds(this.southWest, this.northEast);
      L.imageOverlay('assets/img/maps/' + this.currentMap.map_name, this.bounds).addTo(this.map);
      this.map.fitBounds(this.bounds);

    }*/

  /**
   * set popup for the map on the previous level
   * @param mapAsPlace
   */
  setMapAsPlace(mapAsPlace) {
    //first, find the place which was our map
    console.log("mapAsPlace=", mapAsPlace);
    let placeSql = new PlaceSql(this.http);
    placeSql.selectWhere(' goto="' + mapAsPlace + '"').then(res => {
      let place = <any>res[0];
      let content = place["name_" + ((this.lang == 'ru') ? 'rus' : 'eng')];// + '<br>' + this.popupElement.name;
      /* let mCoordsTmp = place.coords.split(',');
       let mCoords: number[] = [];
       for (let mCoordsSingle of mCoordsTmp) {
         console.log("setPopups mCoordsSingle=", mCoordsSingle);
         mCoords.push(Number(mCoordsSingle));

       }*/
      //this.showPopup(mCoords[0], mCoords[1], content);
      this.showPopup(content, place.coords);

    });


  }

  setPopups() {
    if (!this.popupElement) return;
    this.popups = [];
    for (let m = 0; m < this.placeList.length; m++) {
      let content = '';
      let popup = L.popup({
        closeOnClick: false,
        autoClose: false
      });
      let mCoords: number[] = [];
      content += '<b>' + this.placeList[m] + '</b>' + '<br>';
      for (let i = 0; i < this.popupElement.length; i++) {
        if ((this.popupElement[i].coords)
          && (this.popupElement[i].name_map == this.currentMap.name_map) && (this.popupElement[i].place_name_place == this.placeList[m])) {
          console.log("this.popupElement[i].name_map ", this.popupElement[i].name_map);
          console.log("this.currentMap.name_map=", this.currentMap.name_map);
          console.log("this.popupElement[i].place_name_place=", this.popupElement[i].place_name_place);
          console.log("this.placeList[m]=", this.placeList[m]);

          if (this.typeOfMap == 'conference') {
            content += this.popupElement[i].date_event + '. '
              + this.popupElement[i].time_beg + ':' +
              this.popupElement[i].time_end + '<br>';
          }
          content += this.popupElement[i].name.trim() + '<br>';
          console.log("content=", content);
          this.showPopup(content, this.popupElement[i].coords);
        }


      }
      /*    let mCoordsTmp = this.popupElement[i].coords.split(',');
          for (let mCoordsSingle of mCoordsTmp) {
            console.log("setPopups mCoordsSingle=", mCoordsSingle);
            mCoords.push(Number(mCoordsSingle));
          }
          console.log("mCoords=", mCoords);
          console.log("mCoords[0]=", mCoords[0]);
          console.log("mCoords[1]=", mCoords[1]);
          if ((mCoords[1]) && (mCoords[0])) {
            popup.setLatLng([this.currentMap.height - mCoords[1], mCoords[0]]);
            //  popup.setLatLng([mCoords[1], mCoords[0]]);
            popup.setContent(content);
            popup.openOn(this.map);
            this.popups.push(popup);
          }*/

    }
  }

  ionViewDidLoad() {
    super.ionViewDidLoad();
    this.typeOfMap = this.navParams.get('typeOfMap');
    this.popupElement = this.navParams.get('popupElement');
    this.place = this.navParams.get('place');
    this.currentMap = this.navParams.get('map');
    console.log("popupElement=", this.popupElement);
    console.log("place=", this.place);
    console.log("currentMap=", this.currentMap);
    if (this.typeOfMap == 'participantDetail') {
      this.showArrow = false;

      /*      this.map = L.map('map', {
              crs: L.CRS.Simple,
              //    minZoom: -5
            });


            this.bounds = [[0, 0], [this.currentMap.height, this.currentMap.width]];//new L.LatLngBounds(this.southWest, this.northEast);
            L.imageOverlay('assets/img/maps/' + this.currentMap.name_map, this.bounds).addTo(this.map);
            this.map.fitBounds(this.bounds);*/

      this.initMap();
      /*let popup = */
      /* L.popup({
         closeOnClick: false,
         autoClose: false
       });*/
      /*   let mCoordsTmp = this.place[0].coords.split(',');
         let mCoords: number[] = [];
         console.log('mCoordsTmp= ', mCoordsTmp);
         for (let mCoordsSingle of mCoordsTmp) {
           if (mCoordsSingle) {
             console.log("mCoordsSingle=", mCoordsSingle);
             mCoords.push(Number(mCoordsSingle));
           }


         }*/
      let content: string;
      content = this.place[0]["name_" + ((this.lang == 'ru') ? 'rus' : 'eng')] + '<br>' + this.popupElement.name;
      /*console.log("mCoords[1]=", mCoords[1]);
      console.log("mCoords[0]=", mCoords[0]);
      popup.setLatLng([this.currentMap.height - mCoords[1], mCoords[0]]);


      /!*if (this.lang == 'ru') {
        content = this.place[0].name_rus
      }
      else {
        content = this.place[0].name_eng + '<br>' + this.popupElement.name;
      }*!/
      popup.setContent(content);
      popup.openOn(this.map);*/

      // this.showPopup(mCoords[0], mCoords[1], content);
      this.showPopup(content, this.place[0].coords);
    }

    if (this.typeOfMap == 'conference') {
      this.createMapList();
      //this.currentMapName = this.mapList[0];
      this.currentMapNumber = 0;
      this.mapSql.select().then(res => {
        this.fullMapList = <any>res;
        console.log('this.fullMapList=', res);
        this.createPlaceList();
        this.initMap();
        this.setButtonsEnable();
        this.setPopups();
      });
    }

    if (this.typeOfMap == 'participant') {
      this.createMapList();
      /*this.currentMapName = this.mapList[0];*/
      this.currentMapNumber = 0;
      this.mapSql.select().then(res => {
        this.fullMapList = <any>res;
        console.log('this.fullMapList=', res);
        // this.getMapFromFullList();
        this.createPlaceList();
        this.initMap();
        this.setButtonsEnable();
        this.setPopups();

      });
    }

    if (this.typeOfMap == 'simple') {
      //this.createMapList();
      /*this.currentMapName = this.mapList[0];*/
      this.currentMapNumber = 0;
      this.mapSql.select().then(res => {
        this.fullMapList = <any>res;
        console.log('this.fullMapList=', res);
        this.initMap();
        this.setButtonsEnable();
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


  /**
   * set buttons for the current map according to the fields map_right, map_left, map_up, map_down
   */
  setButtonsEnable() {

    console.log("setButtonsEnable() this.currentMap=", this.currentMap);


    /*   this.showLeftArrow = !!this.fullMapList[this.currentMapNumber].map_left;

       this.showRightArrow = !!this.fullMapList[this.currentMapNumber].map_right;
       this.showUpArrow = !!this.fullMapList[this.currentMapNumber].map_up;
       this.showDownArrow = !!this.fullMapList[this.currentMapNumber].map_down;
       this.showPreviousArrow = !!this.fullMapList[this.currentMapNumber].place_previous;*/
    this.showLeftArrow = !!this.currentMap.map_left;
    this.showRightArrow = !!this.currentMap.map_right;
    this.showUpArrow = !!this.currentMap.map_up;
    this.showDownArrow = !!this.currentMap.map_down;
    this.showPreviousArrow = !!this.currentMap.place_previous;
    this.showArrow = this.showLeftArrow || this.showRightArrow
      || this.showUpArrow || this.showDownArrow || this.showPreviousArrow;
  }

  /**
   * moving through the maps according to direction (up/down, left/right)
   * @param direction
   */
  mapDirection(direction) {
    direction = 'map_' + direction;
    console.log("currentMapNumber=", this.currentMapNumber);
    console.log("direction=", direction);
    console.log("fullMapList[currentMapNumber]=", this.fullMapList[this.currentMapNumber]);
    console.log("fullMapList[currentMapNumber]=", this.fullMapList[this.currentMapNumber][direction]);
    if (this.fullMapList[this.currentMapNumber][direction]) {
      for (let i = 0; i < this.fullMapList.length; i++) {
        if (this.fullMapList[i].name_map == this.fullMapList[this.currentMapNumber][direction]) {
          this.currentMap = this.fullMapList[i];
          // setMap();
          console.log("currentMap=", this.currentMap.name_map);
          this.currentMapNumber = i;
          break;
        }
      }
    }
    //this.getMapFromFullList();
    this.setMap();
    this.setButtonsEnable();
    if (this.showPopups) this.setPopups();

  }

  /**
   * get previos (i.e. map from the previous level) map for the current map
   */
  mapPrevious() {
    let direction = "place_previous";
    let old_map_name = this.currentMap.name_map;
    console.log("currentMapNumber=", this.currentMapNumber);
    console.log("direction=", direction);
    console.log("fullMapList[currentMapNumber]=", this.fullMapList[this.currentMapNumber]);
    console.log("fullMapList[currentMapNumber]=", this.fullMapList[this.currentMapNumber][direction]);
    if (this.fullMapList[this.currentMapNumber][direction]) {
      for (let i = 0; i < this.fullMapList.length; i++) {
        if (this.fullMapList[i].name_map == this.fullMapList[this.currentMapNumber][direction]) {
          this.currentMap = this.fullMapList[i];
          // setMap();
          console.log("currentMap=", this.currentMap.name_map);
          this.currentMapNumber = i;
          break;
        }
      }
    }
    //  this.getMapFromFullList();
    this.setMap();
    this.setButtonsEnable();
    console.log("old_map_name=", old_map_name);
    if (this.showPopups) this.setMapAsPlace(old_map_name);
  }

  updatePopups() {
    console.log('updatePopups=', this.showPopups);
    if (this.showPopups) this.setPopups();
    else {
      for (let popup of this.popups) {
        this.map.closePopup(popup);
      }
    }
  }

  mapOnZoom(e) {
    console.log(e);
    console.log("this.map.getCenter()=", this.map.getCenter());
    //Returns the geographical center of the map view
    console.log("this.map.getZoom()=", this.map.getZoom());
    //Returns the current zoom level of the map view
    //  console.log("this.map.getBounds()=",this.map.getBounds());
    this.showPopup('Привет!', this.map.getCenter().lat + ',' + this.map.getCenter().lng);
  }
}


// 790 strings before refactoring

