import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {place} from "../../pages/providers/place-sql";

/*
  Generated class for the DrawFunctionProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class DrawFunctionProvider {

  constructor(public http: Http) {
    console.log('Hello DrawFunctionProvider Provider');



  }


  /**
   * http://stackoverflow.com/questions/2212604/javascript-check-mouse-clicked-inside-the-circle-or-polygon
   * @param nvert Number of vertices in the polygon. Whether to repeat the first vertex at the end is discussed below.
   * @param vertx Arrays containing the x-coordinates of the polygon's vertices.
   * @param verty Arrays containing the  y-coordinates of the polygon's vertices.
   * @param testx X coordinate of the test point.
   * @param testy Y-coordinate of the test point.
   * @returns {boolean}
   */
  /*  pnpoly(nvert, vertx, verty, testx, testy) {
   var i, j, c = false;
   for (i = 0, j = nvert - 1; i < nvert; j = i++) {
   if (( ( verty[i] > testy ) != ( verty[j] > testy ) ) &&
   ( testx < ( vertx[j] - vertx[i] ) * ( testy - verty[i] ) / ( verty[j] - verty[i] ) + vertx[i] )) {
   c = !c;
   }
   }
   return c;
   }*/

  /* logXY(event: MouseEvent): void {
   //alert( event.clientX);
   // alert( event.clientY);
   console.log('Width: ' + this.platform.width());
   console.log('Height: ' + this.platform.height());
   console.log("scrollTop=" + this.content.scrollTop);
   console.log("scrollToTop=" + this.content.scrollToTop);
   console.log("contentTop=" + this.content.contentTop);
   console.log("contentBottom=" + this.content.contentBottom);
   console.log("diretionX=" + this.content.directionX);
   console.log("diretionY=" + this.content.directionY);
   console.log("content height=" + this.content.contentHeight);
   console.log("content width=" + this.content.contentWidth);
   console.log("getContentDimensions().contentTop=" + this.content.getContentDimensions().contentTop);
   console.log("getContentDimensions().scrollTop=" + this.content.getContentDimensions().scrollTop);
   console.log("getContentDimensions().contentLeft=" + this.content.getContentDimensions().contentLeft);
   console.log("getContentDimensions().contentWidth=" + this.content.getContentDimensions().contentWidth);

   console.log("getContentDimensions().scrollLeft=" + this.content.getContentDimensions().scrollLeft);
   console.log("getContentDimensions().scrollHeight=" + this.content.getContentDimensions().scrollHeight);
   console.log("scrollLeft=" + this.content.scrollLeft);


   let posX = event.clientX + this.content.getContentDimensions().scrollLeft;

   if (this.forumMap.x > this.platform.width()) posX = posX * this.forumMap.x / this.platform.width();

   let posY = event.clientY + this.content.getContentDimensions().scrollTop;
   console.log("X=" + event.clientX + "; Y=" + event.clientY);
   console.log("posX=" + posX + "; posY=" + posY);
   for (let point of this.coords) {
   if (((point.x1 < posX) && (point.x2 > posX)) && ((point.y1 < posY) && (point.y2 > posY))) {
   this.navCtrl.push(point.page);
   }

   }


   }*/

  /*  checkClick(event: MouseEvent) {
   // alert( event.clientY);
   let X: number;
   let Y: number;
   console.log('Width: ' + this.platform.width());
   console.log('Height: ' + this.platform.height());
   console.log("scrollTop=" + this.content.scrollTop);
   console.log("scrollToTop=" + this.content.scrollToTop);
   console.log("contentTop=" + this.content.contentTop);
   console.log("contentBottom=" + this.content.contentBottom);
   console.log("diretionX=" + this.content.directionX);
   console.log("diretionY=" + this.content.directionY);
   console.log("content height=" + this.content.contentHeight);
   console.log("content width=" + this.content.contentWidth);
   console.log("getContentDimensions().contentTop=" + this.content.getContentDimensions().contentTop);
   console.log("getContentDimensions().scrollTop=" + this.content.getContentDimensions().scrollTop);
   console.log("getContentDimensions().contentLeft=" + this.content.getContentDimensions().contentLeft);
   console.log("getContentDimensions().contentWidth=" + this.content.getContentDimensions().contentWidth);
   console.log("getContentDimensions().scrollLeft=" + this.content.getContentDimensions().scrollLeft);
   console.log("getContentDimensions().scrollHeight=" + this.content.getContentDimensions().scrollHeight);
   console.log("scrollLeft=" + this.content.scrollLeft);
   console.log("event.clientX=", event.clientX);
   console.log("event.clientY=", event.clientY);
   console.log("this.scroll.scrollX=", this.scroll.scrollX);
   console.log("this.scroll.scrollY=", this.scroll.scrollY)
   console.log("getContentDimensions().contentHeight" + this.content.getContentDimensions().contentHeight);
   console.log("getContentDimensions().contentBottom" + this.content.getContentDimensions().contentBottom);
   console.log("getContentDimensions().scrollHeight" + this.content.getContentDimensions().scrollHeight);
   console.log("getContentDimensions().scrollWidth" + this.content.getContentDimensions().scrollWidth);


   //Prepare our X and Y
   X = event.clientX;
   Y = event.clientY;

   Y = Y - this.content.contentTop;
   //form of variables needed
   /!*for (let point of this.coordsRaw) {
   let nvert: number = 0;
   let vertx: number[];
   let verty: number[];
   vertx = [];
   verty = [];
   for (let i = 0; i < point.coords.length; i++) {

   if ((i % 2) == 0) {
   nvert++;
   console.log(point.coords[i]);
   vertx.push(point.coords[i]);
   }
   else {
   console.log(point.coords[i]);
   verty.push(point.coords[i]);
   }

   }
   console.log(nvert);
   console.log(vertx);
   console.log(verty);
   console.log("X=", X);
   console.log("Y=", Y);
   if (this.pnpoly(nvert, vertx, verty, X, Y)) {
   alert(point.name_rus)
   }
   }*!/

   }*/

  drawPoly(placeSingle: place, canvas, imageMap:any) {
    console.log("placeSingle.coords=", placeSingle.coords);

    let mCoordsStr = placeSingle.coords.toString();
    let mCoordsTmp = mCoordsStr.split(',');
    console.log("mCoordsTmp=", mCoordsTmp);
    let mCoords: number[]=[];

    for (let mCoordsSingle of mCoordsTmp) {
      console.log("mCoordsSingle=", mCoordsSingle);
      mCoords.push(Number(mCoordsSingle));

    }
    let i, n;
    n = mCoords.length;
    console.log("mCoords=", mCoords);
    // set the 'default' values for the colour/width of fill/stroke operations
    let hdc = canvas.nativeElement.getContext('2d');
    hdc.drawImage(imageMap, 0, 0);
    hdc.fillStyle = 'red';
    hdc.strokeStyle = 'red';
    hdc.lineWidth = 2;
    // this.hdc.strokeRect(0, 0, 100, 100);
    hdc.beginPath();
    hdc.moveTo(mCoords[0], mCoords[1]);
    for (i = 2; i < n; i += 2) {
      hdc.lineTo(mCoords[i], mCoords[i + 1]);
    }
    hdc.lineTo(mCoords[0], mCoords[1]);
    hdc.stroke();
  }

  drawRect(placeSingle: place, canvas, imageMap:any) {
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
    let hdc = canvas.nativeElement.getContext('2d');
    hdc.drawImage(imageMap, 0, 0);
    hdc.fillStyle = 'red';
    hdc.strokeStyle = 'red';
    hdc.lineWidth = 2;
    hdc.strokeRect(left, top, right - left, bot - top);

  }

  drawFigure(placeSingle: place,canvas, imageMap:any, event) {

    let element=event.target;
    console.log("element=",element);
    console.log("element.shape=",element.shape);
    if (element.shape=='poly'){
      this.drawPoly(placeSingle, canvas, imageMap);
      return true;
    }
    if (element.shape=='rect'){
      this.drawRect(placeSingle, canvas, imageMap);
      return true;
    }
    //define drawRect or DrawPoly
    if (placeSingle.shape == 'poly') {
      this.drawPoly(placeSingle, canvas, imageMap);
      return true;
    }
    if (placeSingle.shape == 'rect') {
      this.drawRect(placeSingle, canvas, imageMap);
      return true;
    }
    let mCoords: string = placeSingle.coords.toString();
    let tmpCoords = mCoords.split(',');
    if (tmpCoords.length > 4) {
      this.drawPoly(placeSingle, canvas, imageMap);
      return true;
    }
    else {
      this.drawRect(placeSingle, canvas, imageMap);
      return true;
    }

  }

}
