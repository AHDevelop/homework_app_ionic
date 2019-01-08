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
  selector: 'page-top',
  templateUrl: 'top.html',
})

export class TopPage {
  // nowDate: string = moment().format('YYYY年MM月DD日');
  homeworkDate: string = moment().format('YYYY-MM-DD');
  // baseTime: string = "0.5";
  // pageName: string = "top";
  lockFlg: string = "0";
  insertTimeObj: any = {};
  roomHomeworkList: any = [];
  roomId: string;
  roomHomeworkId: string;

  // 処理中ダイアログ
  loading: any;

  /*
  * コンストラクタ
  */
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public myGlobalValue: MyGlobalValue, public api: Api) {

    this.api.setGlobalValue(myGlobalValue);
    this.roomId = this.myGlobalValue.roomInfo.room_id;

    this.loading = Shared.showLoading(this.loadingCtrl);
    this.loading.present();

    var _self = this;
    this.api.getHomeWorkListWithRoomId(this.roomId).done(function(response) {

      _self.roomHomeworkList = response.results;

    }).always(function() {
      Shared.hideLoading(_self.loading);
    });

  }

  /*
  * 当日の家事履歴を一括削除
  */
  resetHomeworkTime(index) {

    // 対象の家事を取得
    var roomHomework = this.roomHomeworkList[index];

    var _self = this;
    const confirm = this.alertCtrl.create({
      title: '「' + roomHomework.home_work_name + '」の今日の家事時間を削除しますか？',
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

            // 削除処理
            _self.api.bulkDeleteHomeworkHist(roomHomework.room_home_work_id).done(function(response) {
              _self.api.getHomeWorkListWithRoomId(_self.roomId).done(function(response) {
                _self.roomHomeworkList = response.results;

              }).always(function() {
                Shared.hideLoading(_self.loading);
              });
            });
          }
        }
      ]
    });

    confirm.present();
  }

  // 家事登録
  callInputHomeWork(index) {

    // 家事登録
    var roomHomework = this.roomHomeworkList[index];
    this.roomHomeworkId = roomHomework.room_home_work_id;
    var homeworkTime = roomHomework.home_work_time_hh

    // 画面表示用のリストを加算
    if (homeworkTime == null) {
      this.roomHomeworkList[index].home_work_time_hh = 0.5;
    } else {
      this.roomHomeworkList[index].home_work_time_hh = Shared.zeroPad(parseFloat(roomHomework.home_work_time_hh) + 0.5);
    }

    // bulkInsert用のリストを加算
    // 今回のタップの加算分のみを保持する
    var insertTime = this.insertTimeObj[roomHomework.room_home_work_id];
    if (insertTime == null) {
      this.insertTimeObj[roomHomework.room_home_work_id] = 0.5;
    } else {
      this.insertTimeObj[roomHomework.room_home_work_id] = parseFloat(this.insertTimeObj[roomHomework.room_home_work_id]) + 0.5;
    }

    // bulkInsert用のlockフラグ判定
    if (this.lockFlg == "0") {

      // フラグを設定して、bulkInsert処理を用意
      this.lockFlg = "1"

      // 3秒後にまとめてDB更新するよう処理を設定
      var _self = this;
      setTimeout(function() {
        // 5秒経過時のinsert_timeの値をAPIに渡す、Flg=offにする
        var roomHomeworkId;
        for (roomHomeworkId in _self.insertTimeObj) {
          _self.api.registerHomeworkHist(roomHomeworkId, _self.homeworkDate, _self.insertTimeObj[roomHomeworkId]).done(function(response) {
          });
        }
        _self.lockFlg = "0";
        _self.insertTimeObj = {};
      }, 3000);
    }
  };
}
