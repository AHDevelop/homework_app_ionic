import { Component } from '@angular/core';
import { NavController, AlertController, ModalController } from 'ionic-angular';
import * as Shared from '../../app/shared/shared.module';
import { GoogleAuth } from '../../app/shared/shared.googleAuth';
import { Api } from '../../app/shared/shared.api';
import { LoadingController } from 'ionic-angular';
import { MyGlobalValue } from '../../app/MyGlobalValue';
import * as moment from 'moment';
import { ApplicationRef } from '@angular/core';

import { EditPage } from '../editPage/editPage';

@Component({
  selector: 'page-add-homework',
  templateUrl: 'addHomework.html',
})

export class AddHomeworkPage {
  roomHomeworkList: any;

  // 処理中ダイアログ
  loading: any;


  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public myGlobalValue: MyGlobalValue, public api: Api) {

    this.loading = Shared.showLoading(this.loadingCtrl);
    this.loading.present();

    // APIクラスにログイン情報を設定する
    this.api.setGlobalValue(this.myGlobalValue);

    // 部屋家事の取得
    var _self = this;
    this.api.getRoomHomework(myGlobalValue.roomInfo.room_id).done(function(response) {

      _self.roomHomeworkList = response.results;

    }).always(function() {
      Shared.hideLoading(_self.loading);
    });
  };


  // 新規追加ボタンから呼ばれる処理
  callEditPage(index) {
    const modal = this.modalCtrl.create(EditPage, { index: index, roomHomeworkList: this.roomHomeworkList });

    var _self = this;

    modal.onDidDismiss(data => {

      _self.loading = Shared.showLoading(_self.loadingCtrl);
      _self.loading.present();

      // 部屋家事の取得
      this.api.getRoomHomework(_self.myGlobalValue.roomInfo.room_id).done(function(response) {

        _self.roomHomeworkList = response.results;

      }).always(function() {
        Shared.hideLoading(_self.loading);
      });
    });
    modal.present();
  };
}
