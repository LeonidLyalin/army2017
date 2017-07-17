import {Component, ViewChild} from '@angular/core';
import {
  AlertController,

  NavController, NavParams, ToastController
}
  from
    'ionic-angular';
import {PlaceApi} from "../../shared/place/place-api-service";
import {place, PlaceSql} from "../../providers/place-sql";
import {HallAMapPage} from "../hall-a-map/hall-a-map";
import {HallBMapPage} from "../hall-b-map/hall-b-map";
import {DrawFunctionProvider} from "../../../providers/draw-function/draw-function";
import {HallCMapPage} from "../hall-c-map/hall-c-map";
import {HallDMapPage} from "../hall-d-map/hall-d-map";

/**
 * Generated class for the PatriotExpoMapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@Component({
  selector: 'page-patriot-expo-map',
  templateUrl: 'patriot-expo-map.html',
})
export class PatriotExpoMapPage {
  @ViewChild('drawingCanvas') drawingCanvas;
  width_map:number=2835;//2048;
  height_map:number=1594;//1497;
  widthMinus: number = -this.width_map;
  hdc: any;
  imageMap = new Image;

  places: place[] = [];
  //place: any;
  name_map: any = 'patriot-expo-map.jpg';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public placeApi: PlaceApi,
              public toastCtrl: ToastController,
              public placeSql: PlaceSql,
              public drawFunction: DrawFunctionProvider,
              public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PatriotExpoMapPage');

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

      }
      toast.present();
      this.placeSql.selectPlaceMap(this.name_map).then(
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

  /* getPlaceApi() {
   console.log('run thematic promise. run!');

   this.placeApi.getPlace(this.name_map).subscribe(data => {
   console.log("here are the results");
   console.log(data);
   //  this.place = data
   });

   }*/

  drawFigure(placeSingle: place, event) {
    console.log("placeSingle=",placeSingle);

    this.drawFunction.drawFigure(placeSingle, this.drawingCanvas, this.imageMap, event);
    let alert = this.alertCtrl.create({
      title: placeSingle.number_on_map,
      subTitle: placeSingle.name_rus,
      buttons: ['OK']
    });
    alert.present();
  }


  addItemPlace() {
    for (let placeSingle of this.places) {
      console.log('try to insert thematic');
      console.log("placeSingle=",placeSingle);

      this.placeSql.addItemPlace(placeSingle
      ).then(res => {
          console.log('success insert into thematic');
          console.log(res);
        }
      ).catch(err => {
        console.error('Unable to insert storage tables thametic', err.tx, err.err);
      })

    }

  }

  deletePlaceAll() {

      this.placeSql.delAllPlace(this.name_map);
  }


  areaClick(placeSingle:place) {
/*
    alert(num);
    if (num == '1') {
      this.navCtrl.push(HallAMapPage)
    }
    if (num == '2') {
      this.navCtrl.push(HallBMapPage)
    }
*/

    console.log("goto in the begining=", placeSingle.goto);
    if (placeSingle.goto) {
      if (placeSingle.goto.endsWith(".jpg")) {
        placeSingle.goto = placeSingle.goto.substr(0, placeSingle.goto.length - 4);
        console.log("goto in the end=", placeSingle.goto);
      }
      if (placeSingle.goto == 'hallA')
        this.navCtrl.push(HallAMapPage);
      if (placeSingle.goto =='hallB')
        this.navCtrl.push(HallBMapPage);
      if (placeSingle.goto == 'hallC')
        this.navCtrl.push(HallCMapPage);
      if (placeSingle.goto =='hallD')
        this.navCtrl.push(HallDMapPage);
    }

  }


  getPlaceApi() {
    this.placeApi.getPlace(this.name_map).subscribe(res => {

      console.log(res);
      for (let item of res) {
        console.log("item of res=", item);
        let tmpCoord: place;
        tmpCoord = {
          coords: item.coords,
          name_map: item.name_map,
          name_rus: item.name_rus,
          name_eng: item.name_eng,
          number_on_map: item.number_on_map,
          goto: item.goto,
          id: item.id,
          shape:item.shape
        };
        console.log("tmpCoord=", tmpCoord);
        this.places.push(tmpCoord);

      }
      console.log("this.places=", this.places);
    });

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
