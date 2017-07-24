import {Component, ViewChild} from '@angular/core';
import {AlertController, NavController, NavParams, ToastController} from 'ionic-angular';
import {PlaceApi} from "../../shared/place/place-api-service";
import {place, PlaceSql} from "../../../providers/place-sql/place-sql";
import {ParticipantDetailPage} from "../../participant-detail/participant-detail";
import {DrawFunctionProvider} from "../../../providers/draw-function/draw-function";
import {MapBaseProvider} from "../../../providers/map-base/map-base";


/**
 * Generated class for the HallAMapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@Component({
  selector: 'page-hall-b-map',
  templateUrl: 'hall-b-map.html',
})
export class HallBMapPage extends MapBaseProvider{
  @ViewChild('drawingCanvas') drawingCanvas;

/*  places: place[] = [];

  width_map: number = 1178;
  height_map: number = 748;
  name_map: any = 'hallB.jpg';
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
              public alertCtrl: AlertController) {
    super(navCtrl,
      navParams,
      placeApi,
      toastCtrl,
      placeSql,
      drawFunction,
      alertCtrl,
      1178,
      748,
      'hallB.jpg');

  }

/*
  ionViewDidLoad() {
    console.log('ionViewDidLoad HallAMapPage');
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
            /!*this.getPlaceApi();
             this.addItemPlace();*!/
          }
        });
    }
  }


  /!* getPlaceApi() {
   console.log('run thematicConference promise. run!');

   this.placeApi.getPlace(this.name_map).subscribe(data => {
   console.log("here are the results");
   console.log(data);
   //  this.place = data
   });

   }*!/

  addItemPlace() {
    for (let placeSingle of this.places) {
      console.log('try to insert place');
      console.log(placeSingle);
      this.placeSql.addItemPlace(placeSingle).then(res => {
          console.log('success insert into thematicConference');
          console.log(res);
        }
      ).catch(err => {
        console.error('Unable to insert storage tables thametic', err.tx, err.err);
      })

    }
  }

  deletePlaceAll() {
    //  this.placeSql.delAllPlace(this.name_map);
  }


  areaClick(id: string, name_rus: string) {
    alert(id + "  " + name_rus);

    if (id) {
      this.placeSql.getPlaceParticipant(id).then(res => {
        console.log(res);
        if (res) {
          this.navCtrl.push(ParticipantDetailPage, {
            res
          });
        }

      })
    }


  }

  drawFigure(placeSingle: place, event) {
    console.log("placeSingle=", placeSingle);
    //  alert(placeSingle.name_rus);
    this.drawFunction.drawFigure(placeSingle, this.drawingCanvas, this.imageMap, event);
    this.participant_name = '';
    console.log("placeSingle.id=",placeSingle.id);
    if (placeSingle.id) {
      this.placeSql.getPlaceParticipant(placeSingle.id).then(res => {
        console.log(res);
        if (res) {
          this.participant_name = (<any>res).name_rus;
          console.log("res in draw figure=", res);
          console.log("(<any>res).name_rus=", (<any>res).name_rus);
          console.log("participant_name=", this.participant_name);
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
    console.log("participant_name near alert1=", this.participant_name);
    // alert(this.participant_name);

    console.log("participant_name near alert=", this.participant_name);
    //  alert1.setMessage(participant_name1);


  }

  getPlaceApi() {
    this.placeApi.getPlace(this.name_map).subscribe(res => {

      console.log(res);
      for (let item of res) {
        console.log("item of res=", item);
        let tmpCoord: place;
        let tmpShape: string = '';
        console.log(item.coords);
        if (item.coords) {
          /!* if (item.coords.length > 4) tmpShape = "poly"
           else tmpShape = "rect";*!/
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
          console.log("tmpCoord=", tmpCoord);
          this.places.push(tmpCoord);
        }

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
  ionViewDidLoad() {
    console.log('ionViewDidLoad HallAMapPage');
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
            /!*this.getPlaceApi();
             this.addItemPlace();*!/
          }
        });
    }
  }


  /!* getPlaceApi() {
   console.log('run thematicConference promise. run!');

   this.placeApi.getPlace(this.name_map).subscribe(data => {
   console.log("here are the results");
   console.log(data);
   //  this.place = data
   });

   }*!/

  addItemPlace() {
    for (let placeSingle of this.places) {
      console.log('try to insert place');
      console.log(placeSingle);
      this.placeSql.addItemPlace(placeSingle).then(res => {
          console.log('success insert into thematicConference');
          console.log(res);
        }
      ).catch(err => {
        console.error('Unable to insert storage tables thametic', err.tx, err.err);
      })

    }
  }

  deletePlaceAll() {
    //  this.placeSql.delAllPlace(this.name_map);
  }


  areaClick(id: string, name_rus: string) {
    alert(id + "  " + name_rus);

    if (id) {
      this.placeSql.getPlaceParticipant(id).then(res => {
        console.log(res);
        if (res) {
          this.navCtrl.push(ParticipantDetailPage, {
            res
          });
        }

      })
    }


  }

  drawFigure(placeSingle: place, event) {
    console.log("placeSingle=", placeSingle);
    //  alert(placeSingle.name_rus);
    this.drawFunction.drawFigure(placeSingle, this.drawingCanvas, this.imageMap, event);
    this.participant_name = '';
    console.log("placeSingle.id=",placeSingle.id);
    if (placeSingle.id) {
      this.placeSql.getPlaceParticipant(placeSingle.id).then(res => {
        console.log(res);
        if (res) {
          this.participant_name = (<any>res).name_rus;
          console.log("res in draw figure=", res);
          console.log("(<any>res).name_rus=", (<any>res).name_rus);
          console.log("participant_name=", this.participant_name);
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
    console.log("participant_name near alert1=", this.participant_name);
    // alert(this.participant_name);

    console.log("participant_name near alert=", this.participant_name);
    //  alert1.setMessage(participant_name1);


  }

  getPlaceApi() {
    this.placeApi.getPlace(this.name_map).subscribe(res => {

      console.log(res);
      for (let item of res) {
        console.log("item of res=", item);
        let tmpCoord: place;
        let tmpShape: string = '';
        console.log(item.coords);
        if (item.coords) {
          /!* if (item.coords.length > 4) tmpShape = "poly"
           else tmpShape = "rect";*!/
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
          console.log("tmpCoord=", tmpCoord);
          this.places.push(tmpCoord);
        }

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
*/



}
