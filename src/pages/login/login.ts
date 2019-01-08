import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import * as Shared from '../../app/shared/shared.module';
import { GoogleAuth } from '../../app/shared/shared.googleAuth';
import { Api } from '../../app/shared/shared.api';
import { LoadingController } from 'ionic-angular';
import { MyGlobalValue } from '../../app/MyGlobalValue';
import { TopPage } from '../../pages/top/top';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
  userName: string = "";
  googleAuth: any;

  // 処理中ダイアログ
  loading: any;


  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public myGlobalValue: MyGlobalValue, public api: Api) {

    // Googleのアクセストークン
    var access_token = localStorage.getItem('googleAuth.access_token');
    var homework_serial = localStorage.getItem('homework_user.serial');

    // 過去のログイン履歴をチェック
    if (access_token === null && homework_serial === null) {
      // 過去のログイン履歴が無いとログイン方法を特定できないので自動ログインはしない
      return;
    };

    // 以下、自動ログインの流れ
    // 過去のログイン履歴を取得する
    var _self = this;
    this.googleAuth = new GoogleAuth();
    if (access_token !== null) {
      this.googleAuth.getDataProfile(access_token).done(function(data) {
        _self.secondLoginWithGoogle();
      });
    } else if (homework_serial !== null) {
      setTimeout(function() {
        // 画面が描画されるまで一瞬待つ
        // _self.loading = Shared.showLoading(_self.loadingCtrl);
        // _self.loading.present();

        _self.secondLoginWithHomework(homework_serial);
      }, 500);
    }
  }

  /*
  * Googleログイン処理
  */
  callGoogleLoginBtn(event) {
    this.firstLoginWithGoogle();
  };

  /*
  * ほーむわーくユーザーログイン処理
  */
  callHomeworkLoginBtn(event) {

    if (this.userName == "") {

      const alert = this.alertCtrl.create({
        title: 'title',
        subTitle: 'ニックネームを入力してください。',
        buttons: ['OK']
      });
      alert.present();
      return false;
    }

    this.firstLoginWithHomework();
  };

  /*
  * 二回目以降のログイン　Googleユーザー
  */
  secondLoginWithGoogle() {

    this.loading = Shared.showLoading(this.loadingCtrl);
    this.loading.present();

    if (this.googleAuth.gmailID === "") {
      alert("Google認証情報を取得できません");
      return false;
    }

    // ユーザーの存在チェック&Token更新
    var _self = this;
    this.api.getUserInfo(_self.googleAuth).done(function(response) {

      // 既存ユーザー情報あり
      _self.myGlobalValue.userInfo = response.results[0];
      _self.api.setUserInfo(_self.myGlobalValue.userInfo);
      _self.myGlobalValue.isSingIn = true;

      if (_self.myGlobalValue.inviteInfo.invite_room_id != undefined) {
        // 招待された部屋を追加
        _self.setInviteRoom();
      } else {
        // 部屋を設定してTOP画面を表示する
        _self.setDefaultRoom();
      }
    });

  }

  /*
  * 二回目以降のログイン　Homeworkユーザー
  */
  secondLoginWithHomework(homework_serial) {

    this.loading = Shared.showLoading(this.loadingCtrl);
    this.loading.present();

    // ユーザーの存在チェック　トークン更新
    var _self = this;
    this.api.getUserInfoBySerial(homework_serial).done(function(response) {

      // 既存ユーザー情報あり
      _self.myGlobalValue.userInfo = response.results[0];
      _self.api.setUserInfo(_self.myGlobalValue.userInfo);
      _self.myGlobalValue.isSingIn = true;

      if (_self.myGlobalValue.inviteInfo.invite_room_id != undefined) {
        // 招待された部屋を追加
        _self.setInviteRoom();
      } else {
        // 部屋を設定してTOP画面を表示する
        _self.setDefaultRoom();
      }
    });
  }

  /*
  * Google認証での初回ログイン処理
  */
  firstLoginWithGoogle() {

    this.loading = Shared.showLoading(this.loadingCtrl);
    this.loading.present();

    // GoogleのIDを取得
    this.googleAuth = new GoogleAuth();
    var _self = this;
    _self.googleAuth.callGoogle().done(function(data) {

      if (_self.googleAuth.gmailID !== "") {

        // ユーザーの存在チェック&Token更新
        _self.api.getUserInfo(_self.googleAuth).done(function(response) {

          _self.myGlobalValue.userInfo = response.results[0];
          _self.api.setUserInfo(_self.myGlobalValue.userInfo);

          if (_self.myGlobalValue.userInfo === undefined) {
            // 新規ユーザー登録
            _self.api.insertNewUser(_self.googleAuth).done(function(response) {

              // 登録したユーザーと部屋情報が返却される
              var registerInfo = response.results;

              _self.myGlobalValue.roomInfo.room_id = registerInfo["room_id"];
              _self.myGlobalValue.roomInfo.room_name = registerInfo["room_name"];
              _self.myGlobalValue.roomInfo.room_number = registerInfo["room_number"];
              _self.myGlobalValue.roomInfo.user_id = registerInfo["user_id"];
              _self.myGlobalValue.roomInfo.is_owned = true;
              localStorage.setItem('roomInfo.room_id', _self.myGlobalValue.roomInfo.room_id);
              _self.api.setRoomInfo(_self.myGlobalValue.roomInfo);

              _self.myGlobalValue.userInfo = {};
              _self.myGlobalValue.userInfo.user_id = registerInfo["user_id"];
              _self.myGlobalValue.userInfo.email = registerInfo["email"];
              _self.myGlobalValue.userInfo.user_name = registerInfo["user_name"];
              _self.myGlobalValue.userInfo.auth_type = registerInfo["auth_type"];
              _self.myGlobalValue.userInfo.auth_id = registerInfo["auth_id"];
              _self.myGlobalValue.userInfo.app_token = registerInfo["app_token"];
              _self.api.setUserInfo(_self.myGlobalValue.userInfo);

              _self.myGlobalValue.isSingIn = true;

              if (_self.myGlobalValue.inviteInfo.invite_room_id != undefined) {
                // 招待された部屋を追加
                _self.setInviteRoom();
              } else {
                // 部屋を設定してTOP画面を表示する
                _self.setDefaultRoom();
              }
            });

          } else {
            // 既存ユーザー情報あり
            _self.myGlobalValue.isSingIn = true;

            if (_self.myGlobalValue.inviteInfo.invite_room_id != undefined) {
              // 招待された部屋を追加
              _self.setInviteRoom();
            } else {
              // 部屋を設定してTOP画面を表示する
              _self.setDefaultRoom();
            }
          }
        });

      } else {
        alert("Google認証情報を取得できていません");
      }
    });
  }

  /*
  * ほーむわーくユーザーでの初回ログイン処理
  */
  firstLoginWithHomework() {

    this.loading = Shared.showLoading(this.loadingCtrl);
    this.loading.present();

    // TODO: 端末のUUIDを取得
    // var serial = device.serial;
    var serial = "1234567893";

    // ユーザーの存在チェック&Token更新
    var _self = this;
    this.api.getUserInfoBySerial(serial).done(function(response) {

      _self.myGlobalValue.userInfo = response.results[0];
      _self.api.setUserInfo(_self.myGlobalValue.userInfo);

      if (_self.myGlobalValue.userInfo === undefined) {
        // 新規ユーザー登録
        _self.api.insertOriginalUser(serial, _self.userName).done(function(response) {

          // 登録したユーザーと部屋情報が返却される
          var registerInfo = response.results;

          _self.myGlobalValue.roomInfo.room_id = registerInfo["room_id"];
          _self.myGlobalValue.roomInfo.room_name = registerInfo["room_name"];
          _self.myGlobalValue.roomInfo.room_number = registerInfo["room_number"];
          _self.myGlobalValue.roomInfo.user_id = registerInfo["user_id"];
          _self.myGlobalValue.roomInfo.is_owned = true;
          localStorage.setItem('roomInfo.room_id', _self.myGlobalValue.roomInfo.room_id);
          _self.api.setRoomInfo(_self.myGlobalValue.roomInfo);

          _self.myGlobalValue.userInfo = {};
          _self.myGlobalValue.userInfo.user_id = registerInfo["user_id"];
          _self.myGlobalValue.userInfo.email = registerInfo["email"];
          _self.myGlobalValue.userInfo.user_name = registerInfo["user_name"];
          _self.myGlobalValue.userInfo.auth_type = registerInfo["auth_type"];
          _self.myGlobalValue.userInfo.auth_id = registerInfo["auth_id"];
          _self.myGlobalValue.userInfo.app_token = registerInfo["app_token"];
          _self.api.setUserInfo(_self.myGlobalValue.userInfo);

          _self.myGlobalValue.isSingIn = true;

          localStorage.setItem('homework_user.serial', serial);

          if (_self.myGlobalValue.inviteInfo.invite_room_id != undefined) {
            // 招待された部屋を追加
            _self.setInviteRoom();
          } else {
            // 部屋を設定してTOP画面を表示する
            _self.setDefaultRoom();
          }
        });

      } else {
        // 既存ユーザー情報あり
        _self.myGlobalValue.isSingIn = true;
        localStorage.setItem('homework_user.serial', serial);

        if (_self.myGlobalValue.inviteInfo.invite_room_id != undefined) {
          // 招待された部屋を追加
          _self.setInviteRoom();
        } else {
          // 部屋を設定してTOP画面を表示する
          _self.setDefaultRoom();
        }
      }
    });
  }

  /*
  * 招待された部屋に設定しTOP画面に遷移する
  */
  setInviteRoom() {

    var _self = this;
    this.api.addInviteRoom().done(function(response) {

      // エラーが返却されたそのままの部屋情報でログイン
      // 問題なければ初期設定の部屋情報を更新する
      if (response.message !== undefined) {
//// TODO:
        // ons.notification.alert({
        //   title: "",
        //   messageHTML: response.message,
        // }
        // );
        _self.setDefaultRoom();
        return false;
      }

      if (response.results !== null) {
        _self.myGlobalValue.roomInfo = response.results[0];
        _self.myGlobalValue.roomInfo.is_owned = false;
        localStorage.setItem('roomInfo.room_id', _self.myGlobalValue.roomInfo.room_id);
        _self.api.setRoomInfo(_self.myGlobalValue.roomInfo);

        // ログインしたら招待情報はリセット
        _self.myGlobalValue.inviteInfo = {};
      }

      // TOP画面を表示する
      Shared.hideLoading(_self.loading);
      _self.navCtrl.setRoot(TopPage);
    });
  }

  /*
  * ログイン時の部屋を設定する
  */
  setDefaultRoom() {

    // 部屋情報取得
    var _self = this;
    this.api.getRoomsWithUser().done(function(response) {

      // 前回の部屋情報があれば引き継ぎ
      var room_id = localStorage.getItem("roomInfo.room_id");

      if (room_id === null) {
        _self.myGlobalValue.roomInfo = response.results[0];
        _self.api.setRoomInfo(_self.myGlobalValue.roomInfo);
        localStorage.setItem('roomInfo.room_id', _self.myGlobalValue.roomInfo.room_id);
      } else {
        // 前回情報がある場合は初期設定の部屋を設定する
        if (0 < response.results.length) {
          response.results.forEach(function(roomObj) {
            if (roomObj.room_id == room_id) {
              _self.myGlobalValue.roomInfo = roomObj;
              _self.api.setRoomInfo(_self.myGlobalValue.roomInfo);
            }
          });
        } else {
          _self.myGlobalValue.roomInfo = response.results[0];
          _self.api.setRoomInfo(_self.myGlobalValue.roomInfo);
        }
      }

      _self.navCtrl.setRoot(TopPage);

    }).always(function() {
      Shared.hideLoading(_self.loading);
    });
  }
}
