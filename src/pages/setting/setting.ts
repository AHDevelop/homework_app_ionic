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
  selector: 'page-setting',
  templateUrl: 'setting.html',
})

export class SettingPage {
  userName: string;
  roomName: string;
  roomNo: string;
  is_owned: number;
  room_id: string;
  selectRoom: any;
  roomList: any;

  // 処理中ダイアログ
  loading: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public myGlobalValue: MyGlobalValue, public api: Api) {

    // APIクラスにログイン情報を設定する
    this.api.setGlobalValue(this.myGlobalValue);

    this.userName = this.myGlobalValue.userInfo.user_name;
    this.roomName = this.myGlobalValue.roomInfo.room_name;
    this.roomNo = this.myGlobalValue.roomInfo.room_number;
    this.is_owned = this.myGlobalValue.roomInfo.is_owned;
    this.room_id = this.myGlobalValue.roomInfo.room_id;
    this.selectRoom = {};

    // 部屋一覧取得
    var _self = this;
    this.api.getRoomsWithUser().done(function(response) {

      _self.roomList = response.results;

      // 現在の部屋を設定する
      response.results.forEach(function(roomObj) {
        if (roomObj["room_id"] == _self.myGlobalValue.roomInfo.room_id) {
          _self.selectRoom = roomObj;
        }
      });
    }).always(function() {
      Shared.hideLoading(_self.loading);
    });
  };

  // 保存
  register(obj) {

    // 画面読み込み開始時の処理
    this.loading = Shared.showLoading(this.loadingCtrl);
    this.loading.present();

    if (this.is_owned != 1) {

      // 部屋オーナー以外は対象の部屋を切り替えて処理終了
      this.myGlobalValue.roomInfo.roomName = this.roomName;
      this.myGlobalValue.roomInfo.roomNo = this.roomNo;
      this.myGlobalValue.roomInfo.room_id = this.room_id;
      this.myGlobalValue.roomInfo.is_owned = this.is_owned;
      localStorage.setItem('roomInfo.room_id', this.myGlobalValue.roomInfo.room_id);

      // // TODO:
      // ons.notification.alert({
      //   title: "",
      //   messageHTML: "部屋を切り替えました。",
      // });

      Shared.hideLoading(_self.loading);
      return;
    }

    // オーナーの場合のみ部屋の更新処理に進む

    // 部屋設定更新
    this.myGlobalValue.roomInfo.room_id = this.room_id;
    this.myGlobalValue.roomInfo.is_owned = this.is_owned;
    localStorage.setItem('roomInfo.room_id', this.myGlobalValue.roomInfo.room_id);

    var _self = this;
    this.api.updateRoom(this.roomName, this.roomNo).done(function(response) {

      _self.myGlobalValue.roomInfo.room_name = response.results.room_name;
      _self.myGlobalValue.roomInfo.room_number = response.results.room_number;
      _self.myGlobalValue.roomInfo.room_id = response.results.room_id;

      _self.roomName = _self.myGlobalValue.roomInfo.room_name;
      _self.roomNo = _self.myGlobalValue.roomInfo.room_number;

      // 部屋一覧取得
      _self.api.getRoomsWithUser().done(function(response) {

        _self.roomList = response.results;

        // 現在の部屋を設定する
        response.results.forEach(function(roomObj) {
          if (roomObj["room_id"] == _self.myGlobalValue.roomInfo.room_id) {
            _self.selectRoom = roomObj;
          }
        });

      }).always(function() {
        Shared.hideLoading(_self.loading);
      });
    });
  };

  // 部屋切替
  // changeRoom(obj) {
  //
  //   // 現在の部屋を設定する
  //   this.roomName = this.selectRoom.room_name;
  //   this.roomNo = this.selectRoom.room_number;
  //   this.room_id = this.selectRoom.room_id;
  //   this.is_owned = this.selectRoom.is_owned;
  //
  //   localStorage.setItem('roomInfo.room_id', this.room_id);
  //
  // };

  // LINEで招待
  callInvite(obj) {

    this.loading = Shared.showLoading(this.loadingCtrl);
    this.loading.present();

    // 招待URL取得処理を呼び出し
    var _self = this;
    _self.api.getInviteUrl(_self.myGlobalValue.roomInfo.room_id, _self.myGlobalValue.userInfo.user_id).done(function(response) {

      // パラメータ渡しLINEを起動
      var msg = "line://msg/text/" + encodeURIComponent('\
《ほーむわーくアプリへ招待》\r\n\
家事を記録してシェアする「ほーむわーく」アプリの招待です。\r\n\
部屋への参加\r\n');

      msg = msg + response.results.invite_url;
      window.open(msg, '_system', 'location=yes');

      return false;

    }).always(function() {
      Shared.hideLoading(_self.loading);
    });
  };

}
