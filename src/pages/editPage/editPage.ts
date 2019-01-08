import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, ViewController } from 'ionic-angular';
import * as Shared from '../../app/shared/shared.module';
import { GoogleAuth } from '../../app/shared/shared.googleAuth';
import { Api } from '../../app/shared/shared.api';
import { LoadingController } from 'ionic-angular';
import { MyGlobalValue } from '../../app/MyGlobalValue';
import * as moment from 'moment';
import { ApplicationRef } from '@angular/core';

@Component({
  selector: 'page-edit-homework',
  templateUrl: 'editPage.html',
})

export class EditPage {
  workname: string;
  isvisible: boolean = true;
  roomHomeworkId: string;

  // 処理中ダイアログ
  loading: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public myGlobalValue: MyGlobalValue, public api: Api, public params: NavParams, public viewCtrl: ViewController) {

    // APIクラスにログイン情報を設定する
    this.api.setGlobalValue(this.myGlobalValue);

    var index = params.get('index');
    var roomHomeworkList = params.get('roomHomeworkList');

    // 編集前の値を設定
    if (index !== undefined) {
      this.workname = roomHomeworkList[index].home_work_name;
      this.isvisible = roomHomeworkList[index].is_visible;
      this.roomHomeworkId = roomHomeworkList[index].room_home_work_id;
    }
  };

  // 登録・更新処理
  insertRoomHomework() {

    if (this.workname == undefined || this.workname == "") {
      let alert = this.alertCtrl.create({
        subTitle: '家事名は必須です。',
        buttons: ['OK']
      });
      alert.present();
      return;
    }

    var record = [];
    var homework = {};
    homework['home_work_name'] = this.workname;
    homework['base_home_work_time'] = Number("0.5");
    homework['room_home_work_id'] = this.roomHomeworkId;
    homework['is_visible'] = this.isvisible;
    record.push(homework);

    // 画面読み込み開始時の処理
    this.loading = Shared.showLoading(this.loadingCtrl);
    this.loading.present();

    // 更新処理
    var _self = this;
    this.api.updateRoomHomework(this.myGlobalValue.userInfo.user_id, this.myGlobalValue.roomInfo.room_id, record).done(function(response) {

    }).always(function() {
      Shared.hideLoading(_self.loading);
      _self.viewCtrl.dismiss();
    });
  };

  // 部屋家事の削除
  deleteRoomHomework() {

    var _self = this;
    const confirm = this.alertCtrl.create({
      title: '削除してよろしいですか？',
      buttons: [
        {
          text: 'いいえ',
        },
        {
          text: 'はい',
          handler: () => {
            var homework = {};
            homework['room_home_work_id'] = this.roomHomeworkId;
            var record = [];
            record.push(homework);

            // 画面読み込み開始時の処理
            _self.loading = Shared.showLoading(_self.loadingCtrl);
            _self.loading.present();

            _self.api.deleteRoomHomework(record).done(function(response) {
            }).always(function() {
              Shared.hideLoading(_self.loading);
              _self.viewCtrl.dismiss();
            });
          }
        }
      ]
    });

    confirm.present();
  };

  // キャンセル
  back() {
    this.viewCtrl.dismiss();
  };
}
