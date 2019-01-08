import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import * as Shared from '../../app/shared/shared.module';
import { GoogleAuth } from '../../app/shared/shared.googleAuth';
import { Api } from '../../app/shared/shared.api';
import { LoadingController } from 'ionic-angular';
import { MyGlobalValue } from '../../app/MyGlobalValue';
import * as moment from 'moment';
import { ApplicationRef } from '@angular/core';

@Component({
  selector: 'page-user-info',
  templateUrl: 'userInfo.html',
})

export class UserInfoPage {
  userName: string;

  // 処理中ダイアログ
  loading: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public myGlobalValue: MyGlobalValue, public api: Api) {

    // APIクラスにログイン情報を設定する
    this.api.setGlobalValue(this.myGlobalValue);

    this.userName = myGlobalValue.userInfo.user_name;
  };

  // 保存
  register(obj) {

    // 画面読み込み開始時の処理
    this.loading = Shared.showLoading(this.loadingCtrl);
    this.loading.present();

    // ユーザー更新
    var _self = this;
    this.api.updateUser(this.userName).done(function(response) {

      _self.myGlobalValue.userInfo.user_name = response.results["user_name"];
      _self.userName = _self.myGlobalValue.userInfo.user_name;
      localStorage.setItem('roomInfo.room_id', _self.myGlobalValue.roomInfo.room_id);

    }).always(function() {
      Shared.hideLoading(_self.loading);
    });
  };
}
