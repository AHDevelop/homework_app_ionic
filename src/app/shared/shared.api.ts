import * as SharedModule from './shared.module';
import { Component } from '@angular/core';
import { MyGlobalValue } from '../MyGlobalValue';
import { Injectable } from '@angular/core';
import * as Shared from '../../app/shared/shared.module';

@Component({
  selector: 'app-shared-api',
  template: ``,
})

/*
API 共通クラス 認証のクラス
*/
@Injectable()
export class Api {

  /*
  * APIの処理種別定数
  */
  API_METHOD_GET: string = 'get';
  API_METHOD_POST: string = "post";
  API_METHOD_PUT: string = "put";
  API_METHOD_DELETE: string = "delete";

  _myGlobalValue: any;
  _userInfo: any;
  _roomInfo: any;
  _inviteInfo: any;

  constructor(myGlobalValue: MyGlobalValue) {

    this._myGlobalValue = myGlobalValue;
    this._userInfo = myGlobalValue.userInfo;
    this._roomInfo = myGlobalValue.roomInfo;
    this._inviteInfo = myGlobalValue.inviteInfo;
  }

  /*
  * APIアクセスURLの基本部分を作成する
  */
  buildBaseApiUrl() {

    // For Local
    //   const protocol = "http";
    //   const domain = "192.168.51.130";

    // For Develop
    const domain = "dev-homework-api.herokuapp.com";

    // For Product
    //   const domain = "homework-api.herokuapp.com";

    const protocol = "https";
    const endpoint = "api";
    const version = "v1";

    return protocol + '://' + domain + '/' + endpoint + '/' + version + '/';
  }

  /*
  * API呼び出し共通クラス
  */
  callApi(type, url, dataObj, googleAuth, serial) {

    // app_tokenをキーとして渡す
    var homeWorkToken = "";
    if (this._userInfo != undefined && this._userInfo.app_token != undefined) {
      homeWorkToken = this._userInfo.app_token;
    }

    var callObj = {
      "type": type,
      "url": url,
      "dataType": 'json',
      "data": dataObj,
      "headers": {
        "X-HomeWorkToken": homeWorkToken,
      }
    };

    // Updateユーザー処理の時にこちらのKeyとトークンを参照している
    if (googleAuth !== undefined) {
      callObj["headers"]["key"] = googleAuth.gmailID;
      callObj["headers"]["authToken"] = googleAuth.accessToken;
    } else if (serial != undefined) {
      // Homeworkユーザー時
      callObj["headers"]["key"] = serial;
      callObj["headers"]["authToken"] = serial;
    }

    var resObj = $.ajax(callObj);

    resObj.done(function(response) {
    });

    resObj.fail(function(jqXHR, textStatus, errorThrown) {

      // 認証エラーで401が返却された際にログイン前の画面に戻す
      if (jqXHR.status == 401) {
        alert('認証に失敗しました。');

        isSingIn = false;
        localStorage.removeItem('roomInfo.room_id');

        var serial = localStorage.getItem('homework_user.serial');
        if (serial !== null) {
          localStorage.removeItem('homework_user.serial');
          Shared.hideLoading();
          myNavigator.replacePage('login.html');
          return false;
        } else {
          if (localStorage.getItem('googleAuth.access_token') !== null) {
            googleAuth.disconnectUser().done(function(data) {
              localStorage.removeItem('googleAuth.access_token');
            });
          }
          Shared.hideLoading();
          myNavigator.replacePage('login.html');
          return false;
        }
      } else {
        alert('接続に失敗しました。時間を空けて再度実施してください。');
        Shared.hideLoading();
        // alert('接続に失敗しました。URL:' +  url);
      }
    });

    resObj.always(function() {
    });

    resObj.complete(function() {
    });

    return resObj;
  }

  /*
  * 家事一覧&家事別時間取得
  * /homework/{roomId}
  */
  getHomeWorkListWithRoomId(roomId) {

    var url = this.buildBaseApiUrl() + "homework" + '/' + roomId;
    var dataObj = {};
    var resultObj = this.callApi(this.API_METHOD_GET, url, dataObj);
    return resultObj;
  }

  /*
  * 家事履歴一覧取得
  * /homeworkhist/room_id=1
  */
  etHomeworkHist(roomId) {

    var url = this.buildBaseApiUrl() + "homeworkhist" + '/room_id=' + roomId;
    var dataObj = {};
    var resultObj = this.callApi(this.API_METHOD_GET, url, dataObj);
    return resultObj;
  }

  /*
  * 家事登録
  * /api/v1/homeworkhist/update.json
  */
  registerHomeworkHist(roomHomeworkId, homeworkDate, homeworkTime) {

    var userId = this._userInfo.user_id;
    var roomId = this._roomInfo.room_id;

    var url = this.buildBaseApiUrl() + 'homeworkhist' + '/' + 'update.json';

    var homeworkResult = {};
    homeworkResult["room_home_work_id"] = roomHomeworkId;
    homeworkResult["user_id"] = userId;
    homeworkResult["home_work_date"] = homeworkDate;
    homeworkResult["home_work_time"] = homeworkTime;

    var dataObj = {};
    dataObj['user_id'] = userId;
    dataObj['room_id'] = roomId;
    dataObj['record'] = [homeworkResult];

    return this.callApi(this.API_METHOD_POST, url, dataObj);
  }

  /*
  * 家事履歴更新
  * /api/v1/homeworkhist/update.json
  */
  updateHomeworkHist(homeworkHistId, homeworkTimeHH) {

    var url = bthis.uildBaseApiUrl() + "homeworkhist" + '/update.json';

    var homeworkHist = {};
    homeworkHist["home_work_hist_id"] = homeworkHistId;
    homeworkHist["home_work_time_hh"] = homeworkTimeHH;

    var dataObj = {};
    dataObj['user_id'] = this._userInfo.user_id;;
    dataObj['room_id'] = this._roomInfo.room_id;
    dataObj['record'] = [homeworkHist];

    return this.callApi(this.API_METHOD_PUT, url, dataObj);
  }

  /*
  * 家事履歴削除
  * /homeworkhist/update.json
  */
  deleteHomeworkHist(homeworkHistId) {

    var url = bthis.uildBaseApiUrl() + "homeworkhist" + '/update.json';

    var homeworkHist = {};
    homeworkHist["home_work_hist_id"] = homeworkHistId;

    var dataObj = {};
    dataObj['user_id'] = this._userInfo.user_id;;
    dataObj['room_id'] = this._roomInfo.room_id;
    dataObj['record'] = [homeworkHist];

    return this.callApi(this.API_METHOD_DELETE, url, dataObj);
  }

  /*
  * 家事履歴一括削除
  * /homeworkhist/bulk/update.json
  */
  bulkDeleteHomeworkHist(homeworkHistId) {

    var url = this.buildBaseApiUrl() + "homeworkhist/bulk" + '/update.json';

    var dataObj = {};
    dataObj['user_id'] = this._userInfo.user_id;;
    dataObj['room_id'] = this._roomInfo.room_id;
    dataObj['room_home_work_id'] = homeworkHistId;
    dataObj['delete_date'] = moment().format('YYYY-MM-DD');

    return this.callApi(this.API_METHOD_DELETE, url, dataObj);
  }

  /*
  * 部屋別家事登録・更新
  * /room/homework/update.json
  */
  updateRoomHomework(userId, roomId, record) {

    var url = this.buildBaseApiUrl() + "room" + '/' + 'homework' + '/' + 'update.json';

    var dataObj = {};

    dataObj['user_id'] = userId;
    dataObj['room_id'] = roomId;
    dataObj['record'] = record;

    if (record[0]["room_home_work_id"] == "") {
      return this.callApi(this.API_METHOD_POST, url, dataObj);
    } else {
      return this.callApi(this.API_METHOD_PUT, url, dataObj);
    }
  }

  /*
  * 部屋家事削除
  * /room/homework/update.json
  */
  deleteRoomHomework(record) {

    var url = this.buildBaseApiUrl() + "room" + '/' + 'homework' + '/' + 'update.json';

    var dataObj = {};

    dataObj['user_id'] = this._userInfo.user_id;
    dataObj['room_id'] = this._roomInfo.room_id;
    dataObj['record'] = record;

    return this.callApi(this.API_METHOD_DELETE, url, dataObj);
  }

  /*
  * 家事一覧取得
  * /homework/{roomId}
  */
  getRoomHomework(roomId) {

    var url = this.buildBaseApiUrl() + "homework" + '/' + roomId;

    var dataObj = {};

    return this.callApi(this.API_METHOD_GET, url, dataObj);
  }

  /*
  * ユーザーの存在チェック
  * /users/key=1234567890&authToken=hogehogehoge
  */
  getUserInfo(googleAuth) {

    var url = this.buildBaseApiUrl() + "users" + '/key=' + googleAuth.gmailID + '&authToken=' + googleAuth.accessToken;
    var dataObj = {};

    return this.callApi(this.API_METHOD_GET, url, dataObj, googleAuth);
  }

  /*
  * UUIDに紐づくユーザー存在チェック
  * /users/key=1234567890
  */
  getUserInfoBySerial(serial) {

    var url = this.buildBaseApiUrl() + "users" + '/key=' + serial;
    var dataObj = {};

    return this.callApi(this.API_METHOD_GET, url, dataObj, undefined, serial);
  }

  /*
  * 新規ユーザー登録
  * /users/update.json
  */
  insertNewUser(googleAuth) {

    var url = this.buildBaseApiUrl() + "users" + '/' + 'update.json';

    var dataObj = {};

    if (googleAuth.gmailLogin) {
      dataObj['email'] = googleAuth.gmailEmail;
      dataObj['auth_type'] = '1';
      dataObj['auth_id'] = googleAuth.gmailID;
      dataObj['user_name'] = googleAuth.gmailLastName + ' ' + googleAuth.gmailFirstName;
      dataObj['auth_token'] = googleAuth.accessToken;
    }
    return this.callApi(this.API_METHOD_POST, url, dataObj);
  }

  /*
  * ほーむわーくユーザーの新規登録
  * /api/v1/users/original/update.json
  */
  insertOriginalUser(serial, userName) {

    var url = this.buildBaseApiUrl() + "users/original" + '/' + 'update.json';

    var dataObj = {};

    dataObj['auth_id'] = serial;
    dataObj['auth_type'] = '3';
    dataObj['user_name'] = userName;

    return this.callApi(this.API_METHOD_POST, url, dataObj);
  }

  /*
  * 部屋一覧取得
  * /rooms/user_id=1
  */
  getRoomsWithUser() {

    var url = this.buildBaseApiUrl() + "rooms" + '/' + 'user_id=' + this._userInfo.user_id;
    var dataObj = {};

    return this.callApi(this.API_METHOD_GET, url, dataObj);
  }

  /*
  * 部屋ユーザー一覧取得
  * /api/v1/users/room_id=1
  */
  getRoomUserIncludeOwner() {

    var url = this.buildBaseApiUrl() + "users" + '/' + 'room_id=' + this._roomInfo.room_id;
    var dataObj = {};

    return this.callApi(this.API_METHOD_GET, url, dataObj);
  }

  /*
  * 部屋追加
  * /api/v1/room/users/update.json
  */
  addRoom(roomName, roomNo) {

    var url = this.buildBaseApiUrl() + "room/users" + '/' + 'update.json';

    var dataObj = {};

    dataObj['room_name'] = roomName;
    dataObj['room_no'] = roomNo;
    dataObj['user_id'] = this._userInfo.user_id;

    return this.callApi(this.API_METHOD_POST, url, dataObj);
  }

  /*
  * 招待_部屋ユーザー追加
  * /api/v1/room/users/invite/update.json
  */
  addInviteRoom() {

    var url = this.buildBaseApiUrl() + "room/users/invite" + '/' + 'update.json';

    var dataObj = {};

    dataObj['invite_room_id'] = this._inviteInfo.invite_room_id;
    dataObj['invite_from_user_id'] = this._inviteInfo.invite_from_user_id;
    dataObj['invite_to_user_id'] = this._userInfo.user_id;
    dataObj['invite_param'] = this._inviteInfo.param;

    return this.callApi(this.API_METHOD_POST, url, dataObj);
  }

  /*
  * 部屋ユーザー削除
  * /api/v1/room/users/update.json
  */
  removeMember(removeUserId) {

    var url = this.buildBaseApiUrl() + "room/users" + '/' + 'update.json';

    var dataObj = {};

    dataObj['remove_user_id'] = removeUserId;
    dataObj['room_id'] = this._roomInfo.room_id;
    dataObj['user_id'] = this._userInfo.user_id;

    return this.callApi(this.API_METHOD_DELETE, url, dataObj);
  }

  /*
  * ユーザー別家事集計取得
  * /api/v1/homeworkhist/summary?group_by=user&room_id=11&from=20180101&to=20180131
  */
  getHistSummaryByUser(fromDate, toDate) {

    if (fromDate == '') {
      fromDate = "20000101";
    }
    if (toDate == '') {
      toDate = "21001231";
    }

    var url = this.buildBaseApiUrl() + "homeworkhist/summary?group_by=user&room_id=" + this._roomInfo.room_id + "&from=" + fromDate + "&to=" + toDate;
    dataObj = {};

    return this.callApi(this.API_METHOD_GET, url, dataObj);
  }

  /*
  * 家事別家事集計取得
  * /api/v1/homeworkhist/summary?group_by=homework&room_id=11&from=20180101&to=20180131
  */
  getHistSummaryByHomework(fromDate, toDate) {

    if (fromDate == '') {
      fromDate = "20000101";
    }
    if (toDate == '') {
      toDate = "21001231";
    }

    var url = this.buildBaseApiUrl() + "homeworkhist/summary?group_by=homework&room_id=" + this._roomInfo.room_id + "&from=" + fromDate + "&to=" + toDate;
    dataObj = {};

    return this.callApi(this.API_METHOD_GET, url, dataObj);
  }

  /*
  * 部屋設定更新
  * /room/update.json
  */
  updateRoom(roomName, roomNumber) {

    var url = this.buildBaseApiUrl() + "room/" + 'update.json';

    var dataObj = {};

    dataObj['room_name'] = roomName;
    dataObj['room_number'] = roomNumber;
    dataObj['room_id'] = this._roomInfo.room_id;
    dataObj['user_id'] = this._userInfo.user_id;

    return this.callApi(this.API_METHOD_PUT, url, dataObj);

  }

  /*
  * ユーザー更新
  * /users/update.json
  */
  updateUser(userName) {

    var url = this.buildBaseApiUrl() + "users/" + 'update.json';

    var dataObj = {};

    dataObj['user_id'] = this._userInfo.user_id;
    dataObj['user_name'] = userName;

    return this.callApi(this.API_METHOD_PUT, url, dataObj);
  }

  /*
  * 部屋情報一件取得
  * /rooms/room_id
  */
  getOneRoom(roomId) {

    var url = this.buildBaseApiUrl() + "rooms" + '/' + roomId;
    var dataObj = {};

    return this.callApi(this.API_METHOD_GET, url, dataObj);
  }

  /*
  *  招待URL取得
  *  /room/invite/invite_room_id={room_id}&invite_user_id={user_id}
  */
  getInviteUrl(roomId, userId) {

    var url = this.buildBaseApiUrl() + "room/invite/invite_room_id=" + roomId + "&invite_user_id=" + userId;
    var dataObj = {};

    return cathis.llApi(this.API_METHOD_GET, url, dataObj);
  }

}
