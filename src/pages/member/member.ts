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
  selector: 'page-member',
  templateUrl: 'member.html',
})

export class MemberPage {
  roomMemberList: any;

  // 処理中ダイアログ
  loading: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public myGlobalValue: MyGlobalValue, public api: Api) {

    // APIクラスにログイン情報を設定する
    this.api.setGlobalValue(this.myGlobalValue);

    // メンバー一覧取得
    var _self = this;
    this.api.getRoomUserIncludeOwner().done(function(response) {
      _self.roomMemberList = response.results;
    }).always(function() {
      Shared.hideLoading(_self.loading);
    });
  };

  // 部屋ユーザー削除
  removeMember = function(index) {

    // IDから該当するユーザー情報を特定する
    var memberObj = this.roomMemberList[index];

    var _self = this;
    const confirm = this.alertCtrl.create({
      title: memberObj.user_name + 'さんを部屋から除外してよろしいですか？',
      buttons: [
        {
          text: 'いいえ',
        },
        {
          text: 'はい',
          handler: () => {
            // 画面読み込み開始時の処理
            _self.loading = Shared.showLoading(_self.loadingCtrl);
            _self.loading.present();

            this.api.removeMember(memberObj.user_id).done(function(response) {
              // メンバー一覧取得
              _self.api.getRoomUserIncludeOwner().done(function(response) {
                _self.roomMemberList = response.results;
              }).always(function() {
                Shared.hideLoading(_self.loading);
              });
            });
          }
        }
      ]
    });

    confirm.present();
  };

}
