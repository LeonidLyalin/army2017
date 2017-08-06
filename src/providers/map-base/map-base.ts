import {Injectable, ViewChild} from '@angular/core';
import 'rxjs/add/operator/map';
import {place, PlaceSql} from "../place-sql/place-sql";
import {AlertController, NavController, NavParams, ToastController} from "ionic-angular";
import {PlaceApi} from "../place/place-api-service";
import {DrawFunctionProvider} from "../draw-function/draw-function";
import {ParticipantDetailPage} from "../../pages/participant-detail/participant-detail";

/*
 Generated class for the MapBaseProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class MapBaseProvider {

  @ViewChild('drawingCanvas') drawingCanvas;


  places: place[] = [];

  width_map: number;
  height_map: number;
  name_map: string;
  widthMinus: number;
  hdc: any;
  imageMap = new Image;
  participant_name: string = '';


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public placeApi: PlaceApi,
              public toastCtrl: ToastController,
              public placeSql: PlaceSql,
              public drawFunction: DrawFunctionProvider,
              public alertCtrl: AlertController,
              width:number,
              height:number,
              name_map:string) {
    //console.log('Hello MapBaseProvider Provider');
    this.width_map = width;
    this.height_map = height;
    this.name_map = name_map;
    this.widthMinus = -this.width_map;
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad HallAMapPage');
    //check if there are data in the base
    //console.log("this.places.length=", this.places.length);
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
          //console.log("res=", res);
          let length = (<place[]>res).length;
          //console.log("length=", length);
          if ((<place[]>res).length) {
            //if there are records in database
            //console.log("res=", res);
            this.places = <place[]>res;
            //console.log("this.places=", this.places);
          }
          else {
            //if not - go to api
            let toast = this.toastCtrl.create({
              message: 'В базе нет записей. Запрос API',
              duration: 2000
            });
            //console.log('В базе нет записей. Запрос API и запись базы');
            toast.present();
            this.getPlaceApiInsertBase();

          }
        });
    }
  }


  addItemPlace() {
    for (let placeSingle of this.places) {
      //console.log('try to insert place');
      //console.log(<place>placeSingle);
      this.placeSql.addItemPlace(placeSingle
      ).then(res => {
          //console.log('success insert into thematic');
          //console.log(res);
        }
      ).catch(err => {
        console.error('Unable to insert storage tables thametic', err.tx, err.err);
      })

    }
  }

  deletePlaceAll() {
    this.placeSql.delAll('name_map="'+this.name_map+'"');
  }


  areaClick(placeSingle: place) {




    //alert(placeSingle.id + "  " + placeSingle.name_rus);
    //console.log("placeSingle in areaClick=", placeSingle);
    if (placeSingle.id) {
      this.placeSql.getPlaceParticipant(placeSingle.id).then(res => {
        //console.log(res);
        if (res) {

          this.navCtrl.push(ParticipantDetailPage, {
            res
          });
        }

      })
    }


  }


  getPlaceApi() {
    this.placeApi.getPlace(this.name_map).subscribe(res => {

      //console.log(res);
      for (let item of res) {
        //console.log("item of res=", item);
        let tmpCoord: place;
        let tmpShape: string = '';
        //console.log(item.coords);
        if (item.coords) {
          /* if (item.coords.length > 4) tmpShape = "poly"
           else tmpShape = "rect";*/
          tmpShape = "rect";
          tmpCoord = {
            coords: item.coords,
            name_map: item.name_map,
            name_rus: item.name_rus,
            name_eng: item.name_eng,
            number_on_map: item.number_on_map,
            goto: item.goto,
            id: item.id,
            shape: tmpShape

          };
          //console.log("tmpCoord=", tmpCoord);
          this.places.push(tmpCoord);
        }

      }
      //console.log("this.places=", this.places);
    });

  }

  drawFigure(placeSingle: place, event) {
    //console.log("placeSingle=", placeSingle);
    //  alert(placeSingle.name_rus);
    this.drawFunction.drawFigure(placeSingle, this.drawingCanvas, this.imageMap, event);
    this.participant_name = '';
    //console.log("placeSingle.id=", placeSingle.id);
    if (placeSingle.id) {
      this.placeSql.getPlaceParticipant(placeSingle.id).then(res => {
        //console.log(res);
        if (res) {
          this.participant_name = (<any>res).name_rus;
          //console.log("res in draw figure=", res);
          //console.log("(<any>res).name_rus=", (<any>res).name_rus);
          //console.log("participant_name=", this.participant_name);
          let alert = this.alertCtrl.create({
            title: placeSingle.name_rus,
            message: this.participant_name,
            buttons: ['OK']

          });
          alert.present();
        }
        else {
          let alert = this.alertCtrl.create({
            title: placeSingle.name_rus,
            buttons: ['OK']
          });

          alert.present();
        }

      })
    }
    //console.log("participant_name near alert1=", this.participant_name);
    // alert(this.participant_name);

    //console.log("participant_name near alert=", this.participant_name);
    //  alert1.setMessage(participant_name1);


  }

  getPlaceApiInsertBase() {
    let toast = this.toastCtrl.create({
      message: 'Загрузка из API ',
      duration: 5000
    });
    toast.present();
    return this.placeApi.getPlace(this.name_map).subscribe(res => {
      this.places = [];
      //console.log("getPlaceApi res=", res);
      for (let item of res) {
        //console.log("item of res=", item);
        this.places.push(<place>item);
        this.placeSql.addItemPlace(<place>item);
      }
    });
  }


}
