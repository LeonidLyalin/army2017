import {Component, ViewChild} from '@angular/core';
import {AlertController, Content, NavController, NavParams, Platform, Scroll, ToastController} from 'ionic-angular';


import {WaterClusterMapPage} from "../water-cluster-map/water-cluster-map";
import {GroundClusterMapPage} from "../ground-cluster-map/ground-cluster-map";
import {AirClusterMapPage} from "../air-cluster-map/air-cluster-map";
import {ParkPatriotMapPage} from "../park-patriot-map/park-patriot-map";
import {PlaceApi} from "../../shared/place/place-api-service";
import {place, PlaceSql} from "../../../providers/place-sql/place-sql";
import {PatriotExpoMapPage} from "../patriot-expo-map/patriot-expo-map";
import {DrawFunctionProvider} from "../../../providers/draw-function/draw-function";

/**
 * Generated class for the ForumMapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

/*export interface mapSize {
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
  selector: 'page-forum-map',
  templateUrl: 'forum-map.html',
})
export class ForumMapPage {

  @ViewChild(Content) content: Content;
  @ViewChild(Scroll) scroll: Scroll;
  @ViewChild('drawingCanvas') drawingCanvas;

  name_map: string = "forum_map.jpg";
  width_map: number = 724;
  height_map: number = 359;

  places: place[] = [];

  widthMinus: number = -this.width_map;
  hdc: any;
  imageMap = new Image;

  /*coordsRaw: place[] = [
   {
   id: 1,
   coords: [23, 79, 157, 19, 191, 92, 57, 153],
   name_rus: "место 1",
   name_eng: "place 1",
   number_on_map: "1",
   name_map: "forum_map.jpg",
   goto: ""
   },

   {
   id: 2,
   coords: [295, 151, 442, 144, 453, 235, 295, 239],
   name_rus: "место 2",
   name_eng: "place 2",
   number_on_map: "2",
   name_map: "forum_map.jpg",
   goto: ""
   },
   {
   id: 3,
   coords: [513, 221, 666, 218, 668, 310, 514, 308],
   name_rus: "место 3",
   name_eng: "place 3",
   number_on_map: "3",
   name_map: "forum_map.jpg",
   goto: ""
   },];*/

  /*  private coords: coord[] = [{x1: 8, y1: 1644, x2: 251, y2: 1916, page: AirClusterMapPage},
   {x1: 488, y1: 88, x2: 666, y2: 583, page: GroundClusterMapPage},
   {x1: 66, y1: 701, x2: 404, y2: 1174, page: ParkPatriotMapPage},
   {x1: 315, y1: 224, x2: 482, y2: 518, page: WaterClusterMapPage}];*/

  /*  private forumMap: mapSize = {x: 670, y: 1920}*/


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              public placeApi: PlaceApi,
              public toastCtrl: ToastController,
              public placeSql: PlaceSql,
              public drawFunction: DrawFunctionProvider,
              public alertCtrl: AlertController) {


  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ForumMapPage');
    console.log("content height=" + this.content.contentHeight);
    console.log("content width=" + this.content.contentWidth);
    //check if there are data in the base
    console.log("this.places.length=", this.places.length);
    if (!this.places.length) {
      let toast = this.toastCtrl.create({
        message: 'Чтение из базы',
        duration: 2000
      });
      this.hdc = this.drawingCanvas.nativeElement.getContext('2d');
      this.hdc.fillStyle = 'red';
      this.hdc.strokeStyle = 'red';
      this.hdc.lineWidth = 2;
      this.imageMap.src = "assets/img/maps/" + this.name_map;
      this.imageMap.onload = () => {
        this.hdc.drawImage(this.imageMap, 0, 0);

      };
      toast.present();
      this.placeSql.selectWhere('map='+'"'+this.name_map+'"').then(
        res => {
          console.log("res=", res);
          let length = (<place[]>res).length;
          console.log("length=", length);
          if ((<place[]>res).length) {
            //if there are records in database
            console.log("res=", res);
            this.places = <place[]>res;

            console.log("this.places=", this.places);

          }
          else {
            //if not - go to api
            let toast = this.toastCtrl.create({
              message: 'В базе нет записей. Запрос API',
              duration: 2000
            });
            console.log('В базе нет записей. Запрос API и запись базы');
            toast.present();
            this.getPlaceApiInsertBase();
            /*this.getPlaceApi();
             this.addItemPlace();*/
          }
        });
    }

  }

  drawFigure(placeSingle: place, event) {


    this.drawFunction.drawFigure(placeSingle, this.drawingCanvas, this.imageMap, event);
    let alert = this.alertCtrl.create({
      title: placeSingle.number_on_map,
      subTitle: placeSingle.name_rus,
      buttons: ['OK']
    });
    alert.present();
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



  areaClick(placeSingle:place) {
    //alert(num);
    console.log("goto in the begining=", placeSingle.goto);
    if (placeSingle.goto) {
      if (placeSingle.goto.endsWith(".jpg")) {
        placeSingle.goto = placeSingle.goto.substr(0, placeSingle.goto.length - 4);
        console.log("goto in the end=", placeSingle.goto);
      }
      if (placeSingle.goto = 'patriot-expo-map')
        this.navCtrl.push(PatriotExpoMapPage);
    }


  }

  deletePlaceAll() {
    this.placeSql.delAll('name_map="'+this.name_map+'"');
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
      console.log("this.places=", this.places);
      return res(this.places);
    });

  }

  addItemPlace() {
    let toast = this.toastCtrl.create({
      message: 'Запись в базу',
      duration: 5000
    });
    toast.present();
    this.placeSql.addAllItemPlace(this.places);

  }

  getPlaceApiInsertBase() {

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
        this.placeSql.addItemPlace(<place>item);
      }


    });

  }
}




