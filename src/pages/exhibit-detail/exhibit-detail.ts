import {Component} from '@angular/core';
import {Events, NavController, NavParams} from 'ionic-angular';
import {ThematicConferenceSql} from "../../providers/thematic-conference-sql/thematic-conference-sql";
import {MyForumSql} from "../../providers/my-forum-sql";
import {ConferenceSql} from "../../providers/conference-sql/conference-sql";
import {BaseLangPageProvider} from "../../providers/base-lang-page/base-lang-page";
import {Http} from "@angular/http";
import {ExhibitSql} from "../../providers/exhibit/exhibit-sql";


@Component({
  selector: 'page-exhibit-detail',
  templateUrl: 'exhibit-detail.html'
})
export class ExhibitDetailPage extends BaseLangPageProvider {
  element: any;
  thematic: any;
  myForum: any;

  iblockId: any = 10;


  //interface strings
  title: string;
  onMapStr: string;
  myForumStr: string;
  thematicStr: string;
  charactersStr:string;
  characters = [];

 // characteristicsHtml: string;

  constructor(public NavCtrl: NavController,
              public navParams: NavParams,
              public exhibitDetailSql: ExhibitSql,
              public sqlMyForum: MyForumSql,
              public events: Events,
              public http: Http) {
    super(NavCtrl, events, http);
    //console.log("now in exhibit detail");
    //console.log(navParams);
    this.thematic = [];
    if (navParams.data.element)
      if (navParams.data.element.length)
        this.element = navParams.data.element[0];
      else this.element = navParams.data.element;
    else if (navParams.data.res) this.element = navParams.data.res;


  }

  setRussianStrings() {
    super.setRussianStrings('Экспонат');
    this.charactersStr='ТТХ';
    this.onMapStr = 'На карте';
    this.myForumStr = 'Мой форум';
    this.thematicStr = 'Тематика:'
  }

  setEnglishStrings() {
    super.setEnglishStrings('Exhibit');
    this.charactersStr='Technical characteristics';
    this.onMapStr = 'Map';
    this.myForumStr = 'My Forum';
    this.thematicStr = 'Thematic Section:'
  }

  /*
  Время развертывания, мин::
  первой очереди (без палаток):
  10; полное:30-45 мин;;
  Вместимость предперевязочной и эвакуационной палаток, чел:: на носилках: 18; сидя (дополнительно) - 10;;
   */
  prepareCharacteristics() {

    this.characters = [];
    // let tmpHtml = '';
    if (!this.element.characteristics) return;
    let doubleSemiColon = this.element.characteristics.split(';;');
    //  if (doubleSemiColon.length > 1) {
    //    let i = 0;
    for (let i = 0; i < doubleSemiColon.length; i++) {


      let doubleColon = doubleSemiColon[i].split('::');

      for (let j = 0; j < doubleColon.length; j++) {

        let singleComma = doubleColon[j].split(';');
        singleComma.forEach(singleCommaStr => {
          let tmpStr: string;
          let size: number = 0;

          tmpStr = singleCommaStr;
          if (i == 0 && j == 0) {
            tmpStr += ':';
            size = 2
          }

          this.characters.push({size: size, text: tmpStr});
          /*let singleColon=singleCommaStr.split(':');
          singleColon.forEach(singleColonStr=>{
            this.characters.push(singleColonStr);
          })*/
        });
      }
    }
  }

    /*   let singleSemiColon = doubleSemiColonStr.split(';');
       if (singleSemiColon.length > 1) {
         singleSemiColon.forEach(singleStr1 => {
           let str = singleStr1.split(':');
           this.characters.push(str[0] + ':');
           this.characters.push(str[1].split(';'));
         });
       }
       else {
         let singleStr = singleSemiColon[0].split(':');
         let str = singleStr.split(';');
         this.characters.push(str[0] + ':');
         this.characters.push(str[1].split(';'));
       }
     });
   }
   else {
     let singleSemiColon = doubleSemiColon[0].split(';');
     if (singleSemiColon.length > 1) {
       singleSemiColon.forEach(singleStr => {
         let str = singleStr.split(':');
         this.characters.push(str[0] + ':');
         this.characters.push(str[1].split(';'));
       });
     }
     else {
       let singleStr = singleSemiColon.split(':');
       let str = singleStr.split(':');
       this.characters.push(str[0] + ':');
       this.characters.push(str[1].split(';'));
     }
   }*/



  /*    else
      <? if (count($arDesc) > 1): ?>
      <? foreach ($arDesc as $desc): ?>
      <? $i++; ?>
      <? if ($i % 2): ?>
      <h4 style="text-align: left"><?= $desc . ":" ?></h4>
      <? else : ?>
      <pre><? var_dump($desc) ?></pre><? ?>

      <? $arPartDesc = explode(';;', $desc); ?>
      <? if (count($arPartDesc) > 1): ?>
      <? $m = 0 ?>
      <? foreach ($arPartDesc as $partDesc): ?>
      <? $m++ ?>
      <? if ($m == 1) : ?>
      <h5 style="text-align: left"><?= $partDesc . ':' ?></h5>
      <? else: ?>
      <? $arPropertyDesc = explode(';', $partDesc); ?>
      <? foreach ($arPropertyDesc as $propertyDesc): ?>
      <h5 style="text-align: left"><?= $propertyDesc . ';' ?></h5>
      <? endforeach; ?>
      <? endif; ?>
      <? endforeach; ?>


      <? else: ?>
      <? $arPropertyDesc = explode(';', $arPartDesc[0]); ?>
      <? foreach ($arPropertyDesc as $propertyDesc): ?>
      <h5 style="text-align: left"><?= str_replace(' :', ': ', $propertyDesc) . ';'; ?></h5>
      <? endforeach; ?>
      <? endif; ?>

      <? endif; ?>


      <? endforeach; ?>
      <? else: ?>
      <? $arPropertyDesc = explode(';;', $arDesc[0]); ?>
      <? if (count($arPropertyDesc) > 1): ?>
      <? foreach ($arPropertyDesc as $propertyDesc): ?>
      <? $arSinglePropertyDesc = explode(';', $propertyDesc); ?>
      <? foreach ($arSinglePropertyDesc as $propertySingleDesc): ?>
      <h5 style="text-align: left"><?= str_replace(' :', ': ', $propertySingleDesc) . ';'; ?></h5>
      <? endforeach; ?>

      <? endforeach; ?>
      <? else: ?>
      <? $arPropertyDesc = explode(';', $arPropertyDesc[0]); ?>
      <? foreach ($arPropertyDesc as $propertyDesc): ?>
      <h5 style="text-align: left"><?= str_replace(' :', ': ', $propertyDesc) . ';'; ?></h5>
      <? endforeach; ?>
      <? endif; ?>

      <? endif ?>*/


  ionViewDidLoad() {
    super.ionViewDidLoad();
    // this.userId = localStorage.getItem('userid');

    this.prepareCharacteristics();
    this.exhibitDetailSql.getFieldFromTable(this.element.id, 'id', 'myforum').then(
      //getMyForumForId(this.conferenceSingle.id).then(
      rs => {
        if (rs) {
          //console.log("res in conferenceSingle myForumParticipant", rs);
          this.myForum = <any>rs;
        }

      }
    );


  }

  /**
   * delete event of the conference from MyForum
   * @param id
   */
  deleteFromMyForum(id) {
    this.sqlMyForum.delFromMyForum(id);
  }

  /**
   * add event to MyForum on the site and the mobile app
   * @param id
   */
  addToMyForumSite(id) {
    this.sqlMyForum.addToMyForumSite(id, this.iblockId, this.userId)
  }


}
