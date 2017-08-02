import {Component, ViewChild} from '@angular/core';
import {Content, Events, NavController, NavParams, Platform, Scroll, ToastController} from 'ionic-angular';
import {place, PlaceSql} from "../../../providers/place-sql/place-sql";
import {PatriotExpoMapPage} from "../patriot-expo-map/patriot-expo-map";
import {DrawFunctionProvider} from "../../../providers/draw-function/draw-function";
import * as L from 'leaflet';
import {MapSql} from "../../../providers/map-sql/map-sql";
import {Http} from "@angular/http";
import {ParticipantDetailPage} from "../../participant-detail/participant-detail";
import {MyForumSql} from "../../../providers/my-forum-sql";
import {BaseListPageProvider} from "../../../providers/base-list-page/base-list-page";


@Component({
  selector: 'leaflet-map',
  templateUrl: 'leaflet-map.html',
})
export class LeafletMapPage extends BaseListPageProvider {

  @ViewChild(Content) content: Content;
  @ViewChild(Scroll) scroll: Scroll;
  @ViewChild('drawingCanvas') drawingCanvas;

  name_map: string = "forum_map.jpg";
  width_map: number = 724;
  height_map: number = 359;
  widthMinus: number = -this.width_map;


  places: place[] = [];

  imageMap = new Image;


  map: any;
  bounds: any;

  popupElement: any;
  place: any;
  //mapParam: any;
  typeOfMap: string;

  mapList: any;

  fullMapList: any;//all maps from Table map

  currentMapNumber: number;


  mapTitle: string;
  showArrow: boolean;
  /**
   * list of popupList for the current map
   */
  popupList: any;

  /**
   * define show or not arrow buttons, depending on the description of the map
   */
  showLeftArrow: boolean;
  showRightArrow: boolean;
  showUpArrow: boolean;
  showDownArrow: boolean;
  showPreviousArrow: boolean;

  /**
   * define show or not popupList on the map
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
  //lang: string;

  //interface strings

  // titleStr: string;


  currentMap: any;
  leftArrow: any;
  rightArrow: any;
  upArrow: any;
  downArrow: any;
  previousArrow: any;

  leftArrowIcon: L.Icon;
  rightArrowIcon: L.Icon;
  upArrowIcon: L.Icon;
  downArrowIcon: L.Icon;
  previousArrowIcon: L.Icon;
  greenIcon: L.Icon;

  iconArrowSize: number = 20;

  // popupLayer:any;

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
    super(navCtrl, navParams, events, http);//, placeSql, mapSql);
    this.popupElement = navParams.get('popupElement');
    this.place = navParams.get('place');
    this.currentMap = navParams.get('map');
    console.log("popupElement=", this.popupElement);
    console.log("place=", this.place);
    console.log("currentMap=", this.currentMap);
    this.initIcons();

//set a bunch of arrows

  }

  initIcons(){
    this.leftArrowIcon = L.icon({
      iconUrl: 'assets/img/icons/leaf-orange.png',
      shadowUrl: 'assets/img/icons/leaf-shadow.png',
      //  iconSize: [this.iconArrowSize, this.iconArrowSize], // size of the icon
      iconSize: [38, 95], // size of the icon
      shadowSize: [50, 64], // size of the shadow
      iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    this.rightArrowIcon = L.icon({
      iconUrl: 'assets/img/icons/leaf-red.png',
      shadowUrl: 'assets/img/icons/leaf-shadow.png',
      //  iconSize: [this.iconArrowSize, this.iconArrowSize], // size of the icon
      iconSize: [38, 95], // size of the icon
      shadowSize: [50, 64], // size of the shadow
      iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    this.upArrowIcon = L.icon({
      iconUrl: 'assets/img/icons/arrow-up.svg',
      shadowUrl: 'assets/img/icons/leaf-shadow.png',
      //  iconSize: [this.iconArrowSize, this.iconArrowSize], // size of the icon
      iconSize: [38, 95], // size of the icon
      shadowSize: [50, 64], // size of the shadow
      iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    this.downArrowIcon = L.icon({
      iconUrl: 'assets/img/icons/arrow-down.svg',
      shadowUrl: 'assets/img/icons/leaf-shadow.png',
      //  iconSize: [this.iconArrowSize, this.iconArrowSize], // size of the icon
      iconSize: [38, 95], // size of the icon
      shadowSize: [50, 64], // size of the shadow
      iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    this.previousArrowIcon = L.icon({
      iconUrl: 'assets/img/icons/level-up.svg',
      shadowUrl: 'assets/img/icons/leaf-shadow.png',
      // iconSize: [this.iconArrowSize, this.iconArrowSize], // size of the icon
      iconSize: [38, 95], // size of the icon
      shadowSize: [50, 64], // size of the shadow
      iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    console.log("L.Icon.Default.imagePath=", L.Icon.Default.imagePath);
    //L.Icon.Default.imagePath = "/assets/img/icons";
    this.greenIcon = L.icon({
      iconUrl: 'assets/img/icons/leaf-green.png',
      shadowUrl: 'assets/img/icons/leaf-shadow.png',

      iconSize: [38, 95], // size of the icon
      shadowSize: [50, 64], // size of the shadow
      iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
  }

  setRussianStrings() {
    super.setRussianStrings('Карта форума');
  }

  setEnglishStrings() {
    super.setRussianStrings('Forum map');
  }

  showHideHelp() {
    super.showHideHelp();
    console.log(this.lang);
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


  /**
   * create map
   */
  initMap() {
    this.popupList = [];
    this.placeListForMap = [];
    //  this.p
    if (!this.map) {
      this.map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: (this.currentMap.min_zoom ? this.currentMap.min_zoom : -2),
        maxZoom: (this.currentMap.max_zoom ? this.currentMap.max_zoom : 5),
        zoom: (this.currentMap.begin_zoom ? this.currentMap.begin_zoom : 0),
      });
      this.map.tap = true;
      this.map.on('click', (e) => {
        this.mapClick(e)
      });

      this.map.on('zoom', (e) => {
        this.mapOnZoom(e)
      });

    }
    else (this.deleteLayers());
    this.bounds = [[0, 0], [this.currentMap.height, this.currentMap.width]];//new L.LatLngBounds(this.southWest, this.northEast);
    L.imageOverlay('assets/img/maps/' + this.currentMap.name_map, this.bounds).addTo(this.map);
    this.map.fitBounds(this.bounds);

    //  this.createPlaceListForMap();

    this.placeSql.selectWhere('name_map="' + this.currentMap.name_map + '"').then((res: any) => {
      this.placeListForMap = res;
      console.log("this.placeListForMap=", this.placeListForMap);
      this.setSignsForMap();
    });

    this.titleStr = this.currentMap['name_' + (this.lang == 'ru' ? 'rus' : 'eng')];
    //  this.map.dragging.disable();

    //set arrows on the sides


    // this.showRightArrow = !!this.currentMap.map_right;
    // this.showUpArrow = !!this.currentMap.map_up;
    // this.showDownArrow = !!this.currentMap.map_down;
   // L.marker([300, 300], {icon: this.leftArrowIcon}).addTo(this.map);
   // if (this.currentMap.map_left) {
      this.leftArrow = L.marker([200, 200], {icon: this.rightArrowIcon});
    this.leftArrow.addTo(this.map);
    this.leftArrow.on('click', (e) => {
          console.log(e);
       //   this.mapDirection('left')
        });
  //  }
    if (this.currentMap.map_right) {
      this.rightArrow = L.marker([this.currentMap.heght / 2, this.currentMap.width], {icon: this.rightArrowIcon});
      this.rightArrow.addTo(this.map);
      this.rightArrow.on('click', () => {
        this.mapDirection('right')
      });
    }
    if (this.currentMap.map_up) {
      this.upArrow = L.marker([this.currentMap.heght / 2, this.currentMap.width], {icon: this.upArrowIcon});
      this.upArrow.addTo(this.map);
      this.upArrow.on('click', (e) => {
        this.mapDirection('up')
      });
    }
    if (this.currentMap.map_down) {
      this.downArrow = L.marker([0, this.currentMap.width / 2], {icon: this.downArrowIcon});
      this.downArrow.addTo(this.map);
      this.downArrow.on('click', () => {
        this.mapDirection('down')
      });
    }
    if (this.currentMap.place_previous) {
      this.previousArrow = L.marker([this.currentMap.height, this.currentMap.width / 2], {icon: this.previousArrowIcon});
      this.previousArrow.addTo(this.map);
      this.previousArrow.on('click', () => {
        this.mapPrevious()
      });
    }

    L.marker([50, 50], {icon: this.greenIcon}).addTo(this.map);
    //  L.popup([50, 50], {icon: this.greenIcon}).addTo(this.map);

    let popup = L.popup({
      closeOnClick: false,
      autoClose: false,

    });
   //    let mCoords = this.setCoords(coords);
  //  popup.setLatLng([100, 100]);
   // let content = "<img src='assets/img/icons/leaf-orange.png'/>"
  //  popup.setContent(content);
  //  popup.openOn(this.map);
  }


  /**
   *   set a new map on a screen (deleting all layer before this)
   */

  /*  setMap() {

      this.deleteLayers();
      this.bounds = [[0, 0], [this.currentMap.height, this.currentMap.width]];//new L.LatLngBounds(this.southWest, this.northEast);
      L.imageOverlay('assets/img/maps/' + this.currentMap.name_map, this.bounds).addTo(this.map);
      this.map.fitBounds(this.bounds);


      this.createPlaceListForMap();
      this.titleStr = this.currentMap['name_' + (this.lang == 'ru' ? 'rus' : 'eng')];
      //   this.map.dragging.disable();
    }*/

  /*
    createPlaceListForMap() {
      // this.placeSql.selectWhere('name_map="'+this.currentMapName+'"').then(res=>{



    }*/

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
    if (this.typeOfMap != 'OpenStreetMap') {
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
    else {
      console.log("isInsideRect coords=", coords);
      console.log("isInsideRect x=", x);
      console.log("isInsideRect y=", y);
      let coordsList = coords.split(',');
      console.log("isInsideRect coordsList=", coordsList);
      let bounds = [[coordsList[1], coordsList[0]], [coordsList[3], coordsList[2]]];
      console.log("bounds before ", place_name, bounds);
      console.log("coordsList[1] before ", coordsList[1]);
      console.log("height -coordsList[1] before ", this.currentMap.height - coordsList[1]);
      console.log("coordsList[3] before ", coordsList[3]);
      if ((Number(coordsList[1])) > ( Number(coordsList[3]))) {
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
      bounds = [[coordsList[1], coordsList[0]], [coordsList[3], coordsList[2]]];
      console.log("bounds after", place_name, bounds);
      //L.rectangle(this.bounds, {color: "red", weight: 1}).addTo(this.map);
      console.log((((x >= (coordsList[1]))
        && (x <= (coordsList[3]))) && ((y >= (coordsList[0])) && (y <= (coordsList[2])))))
      return (((x >= (coordsList[1]))
        && (x <= (coordsList[3]))) && ((y >= (coordsList[0])) && (y <= (coordsList[2]))));
    }
  }

  isInsidePoly(x, y, coords) {

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


  private setCoords(coords: string) {

    let mCoordsTmp = coords.split(',');
    let mCoords: number[] = [];
    console.log('mCoordsTmp= ', mCoordsTmp);
    for (let mCoordsSingle of mCoordsTmp) {
      if (mCoordsSingle) {
        console.log("mCoordsSingle=", mCoordsSingle);
        mCoords.push(Number(mCoordsSingle));
      }


    }
    return mCoords;
  }

  /**
   * Show and place popupList on the currentmap
   * @param content - what will be shown on the popup
   * @param coords - where to place pop up (actualy, firtst two numbers from the coords)
   */

  private showPopup(content, coords) {

    //check if already on the map
    console.log("content=", content);
    let popup = L.popup({
      closeOnClick: false,
      autoClose: false,

    });
    let mCoords = this.setCoords(coords);
    popup.setLatLng([this.currentMap.height - mCoords[1], mCoords[0]]);
    popup.setContent(content);
    popup.openOn(this.map);

    this.popupList.push({name_map: this.currentMap.name_map, popup: popup, coords: coords});
  }


  private showTooltip(content, coords) {
    let mCoords = this.setCoords(coords);
    let tooltip = L.tooltip([this.currentMap.height - mCoords[1], mCoords[0]]);
    tooltip.bindPopup(content);
    tooltip.addTo(this.map);
  }

  private showMarker(content, coords) {
    let mCoords = this.setCoords(coords);
    let marker = L.marker([this.currentMap.height - mCoords[1], mCoords[0]]);
    marker.bindPopup(content);
    marker.addTo(this.map);


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
      if (goDetail) {
        console.log("this.placeListForMap[i]=", this.placeListForMap[numFind]);
        if (this.placeListForMap[numFind].goto) {
          //goto to the new map
          for (let i = 0; i < this.fullMapList.length; i++) {
            if (this.fullMapList[i].name_map == this.placeListForMap[numFind].goto) {
              this.currentMap = this.fullMapList[i];

              console.log("currentMap=", this.currentMap.name_map);
              this.currentMapNumber = i;
              break;
            }
          }
          this.initMap();
          //  this.setButtonsEnable();
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

  /*  mapBounds() {
      for (let popup of this.popupList) {
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
      this.showPopup(content, place.coords);

    });


  }

  /**
   * show popups/tooltips/pins for currentMap;
   */
  setSigns() {
    if (!this.popupElement) return;
    this.popupList = [];
    for (let m = 0; m < this.placeList.length; m++) {
      let content: string = '';
      for (let i = 0; i < this.popupElement.length; i++) {
        if ((this.popupElement[i].coords)
          && (this.popupElement[i].name_map == this.currentMap.name_map) && (this.popupElement[i].place_name_place == this.placeList[m])) {
          content += '<b>' + this.placeList[m] + '</b>' + '<br>';
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
    }
  }

  /**
   * show signs for current map which MUST be shown
   */
  setSignsForMap() {
    this.popupList = [];
    if (this.placeListForMap) {
      this.placeListForMap.forEach(placeSign => {
        console.log("placeSign=", placeSign);
        let zoom: number = this.map.getZoom();
        let marker = (placeSign.marker ? placeSign.marker : this.map.getMaxZoom() + 1);
        if (marker = 'min') marker = this.map.getMinZoom();
        let tooltip = (placeSign.tooltip ? placeSign.tooltip : this.map.getMaxZoom() + 1);
        if (tooltip = 'min') tooltip = this.map.getMinZoom();
        let popup = (placeSign.popup ? placeSign.popup : this.map.getMaxZoom() + 1);
        if (popup = 'min') popup = this.map.getMinZoom();

        if ((zoom >= marker) && ( zoom < tooltip) && (zoom < popup)) {
          let content = placeSign["name_" + (this.lang == 'ru' ? 'rus' : 'eng')];
          this.showMarker(content, placeSign.coords);
        }
        if ((zoom >= tooltip) && (popup > zoom)) {
          let content = placeSign["name_" + (this.lang == 'ru' ? 'rus' : 'eng')];
          this.showTooltip(content, placeSign.coords);
        }
        if (zoom >= popup) {
          let content = placeSign["name_" + (this.lang == 'ru' ? 'rus' : 'eng')];
          this.showPopup(content, placeSign.coords);
        }

      });
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

    if (this.typeOfMap == 'OpenStreetMap') {
      this.showArrow = false;


      this.popupList = [];
      let center: L.PointTuple = [55.57066, 36.83169]; //Park Patriot

      //setup leaflet map


      this.map = L.map('map', {
        center: center,
        zoom: 13
      });

      //Add OSM Layer
      L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
        .addTo(this.map);

      this.map.tap = true;
      this.map.on('click', (e) => {
        this.mapClick(e)
      });

      this.mapSql.select().then(res => {
        this.fullMapList = <any>res;
        console.log('this.fullMapList=', res);
      });


      this.titleStr = this.currentMap['name_' + (this.lang == 'ru' ? 'rus' : 'eng')];
    }
    if (this.typeOfMap == 'participantDetail') {
      //this.showArrow = false;
      this.initMap();
      this.showArrow = false;
      let content: string;
      content = this.place[0]["name_" + ((this.lang == 'ru') ? 'rus' : 'eng')] + '<br>' + this.popupElement.name;
      this.showPopup(content, this.place[0].coords);
    }


    if (this.typeOfMap == 'conference') {
      this.createMapList();
      this.currentMapNumber = 0;
      this.mapSql.select().then(res => {
        this.fullMapList = <any>res;
        console.log('this.fullMapList=', res);
        //    this.setButtonsEnable();
        this.initMap();
        this.setSigns();
      });
    }
    if (this.typeOfMap == 'participant') {
      this.createMapList();
      /*this.currentMapName = this.mapList[0];*/
      this.currentMapNumber = 0;
      this.mapSql.select().then(res => {
        this.fullMapList = <any>res;
        console.log('this.fullMapList=', res);
        // this.setButtonsEnable();
        this.initMap();

        this.setSigns();
      });
    }
    if (this.typeOfMap == 'simple') {
      this.currentMapNumber = 0;
      this.mapSql.select().then((res: any) => {
        this.fullMapList = res;
        console.log('this.fullMapList=', res);
        // this.setButtonsEnable();
        this.initMap();
        this.setSignsForMap();

      });
    }
  }


  drawFigure(placeSingle: place, event) {
    this.drawFunction.drawFigure(placeSingle, this.drawingCanvas, this.imageMap, event);

  }


  /**
   * set buttons for the current map according to the fields map_right, map_left, map_up, map_down
   */

  /*
    setButtonsEnable() {
      console.log("setButtonsEnable() this.currentMap=", this.currentMap);
      this.showLeftArrow = !!this.currentMap.map_left;

      this.showRightArrow = !!this.currentMap.map_right;
      this.showUpArrow = !!this.currentMap.map_up;
      this.showDownArrow = !!this.currentMap.map_down;
      this.showPreviousArrow = !!this.currentMap.place_previous;
      this.showArrow = false;//this.showLeftArrow || this.showRightArrow      || this.showUpArrow || this.showDownArrow || this.showPreviousArrow;
    }
  */

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
    this.initMap();
    // this.setButtonsEnable();
    if (this.showPopups) this.setSigns();

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
    //this.setMap();
    this.initMap();
    // this.setButtonsEnable();
    console.log("old_map_name=", old_map_name);
    if (this.showPopups) this.setMapAsPlace(old_map_name);
  }

  updatePopups() {
    console.log('updatePopups=', this.showPopups);
    if (this.showPopups) {
      for (let popup of this.popupList) {
        if (popup.name_map == this.currentMap.name_map)
          popup.popup.openOn(this.map);
      }
    } //this.setPopups();
    else {
      for (let popup of this.popupList) {
        if (popup.name_map == this.currentMap.name_map)
          this.map.closePopup(popup.popup);
      }
    }
  }

  mapOnZoom(e) {
    console.log(e);
    console.log("this.map.getCenter()=", this.map.getCenter());
    //Returns the geographical center of the map view
    console.log("this.map.getZoom()=", this.map.getZoom());
    this.setSignsForMap();
    //Returns the current zoom level of the map view
    //  console.log("this.map.getBounds()=",this.map.getBounds());
    //  this.showPopup('Привет!', this.map.getCenter().lat + ',' + this.map.getCenter().lng);

    //reset signs

  }


  /*  onSwipe(event) {
      /!* console.log(event);
       if (event.offsetDirection) {
         console.log("event.offseDirection=", event.offsetDirection);
         switch (event.offsetDirection) {
           case 4:
             if (this.showLeftArrow) {
               this.mapDirection('left');

             }
             break;
           case 2:
             if (this.showRightArrow) {
               this.mapDirection('right');

             }
             break;
         }

       }*!/
    }*/

}

// 790 strings before refactoring

/*
direction of swipe
left =1
right=
up
down




offset direction
left 4
right 2
 */

