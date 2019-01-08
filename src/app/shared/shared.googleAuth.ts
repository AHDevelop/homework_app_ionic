import * as SharedModule from './shared.module';
import { Component } from '@angular/core';

@Component({
  selector: 'app-shared-google-auth',
  template: ``,　
})

/*
Google Auth 認証のクラス
*/
export class GoogleAuth {

  constructor() {
  }

  /*
  アプリ認証情報
  */
  clientId:string = '530549571921-k8utmfk322am2hrb6m9pjhl3msbrdntd.apps.googleusercontent.com';
  ClientSecret:string = '-bgqDaygcCiS4F_gbzZ9ZRuR';

  /*
  取得データ
  */
  accessToken : string;
  gmailLogin : string;
  gmailID : string;
  gmailEmail : string;
  gmailFirstName : string;
  gmailLastName : string;
  gmailPicture : string;

  /*
  URL定義
  */
  scope: string = 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email';
  redirectUri: string = 'http://localhost';
  baseUrl :string = 'https://accounts.google.com/o/oauth2/';
  revokeUrl: string = `${this.baseUrl}revoke?token=${this.accessToken}`;

    /*
    認証メイン処理
    */
    authorize() {

// TODO: Google認証
        var deferred = $.Deferred();
        //
        // var authUrlWithParam = this.baseUrl + 'auth?' + $.param({
        //     client_id: this.clientId,
        //     redirect_uri: this.redirectUri,
        //     response_type: 'code',
        //     scope: this.scope
        // });
        //
        // var authWindow = window.open(authUrlWithParam, '_blank', 'location=no,toolbar=no');
        //
        // var _self = this;
        // $(authWindow).on('loadstart', function(e) {
        //     var url = e.originalEvent.url;
        //     var code = /\?code=(.+)$/.exec(url);
        //     var error = /\?error=(.+)$/.exec(url);
        //
        //     if (code || error) {
        //         authWindow.close();
        //     }
        //
        //     if (code) {
        //         $.post(_self.baseUrl + 'token', {
        //             code: code[1],
        //             client_id: _self.clientId,
        //             client_secret: _self.ClientSecret,
        //             redirect_uri: _self.redirectUri,
        //             grant_type: 'authorization_code'
        //         }).done(function(data) {
        //             deferred.resolve(data);
        //         }).fail(function(response) {
        //             deferred.reject(response.responseJSON);
        //         });
        //
        //     } else if(error) {
        //         deferred.reject({
        //             error: error[1]
        //         });
        //     }
        // });
        //
        return deferred.promise();
    }

  /*
  ユーザー認証を解除する
  */
  disconnectUser() {

      var deferred = $.Deferred();

      $.ajax({
          type: 'GET',
          url: this.baseUrl + 'revoke?token=' + this.accessToken,
          success: function(nullResponse) {
              deferred.resolve();
              this.accessToken = null;
          },
          error: function(e) {
            deferred.resolve();
            this.accessToken = null;
            alert("予期せぬエラーが発生しました。");
          }
      });

      return deferred.promise();
  }

  /*
  ユーザー情報取得
  */
  getDataProfile(accessToken) {

    if(accessToken !== undefined){
        this.accessToken = accessToken;
    }

    var deferred = $.Deferred();

    $.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + this.accessToken)
        .done(function(data) {
            this.gmailLogin = "true";
            this.gmailID = data.id;
            this.gmailEmail = data.email;
            this.gmailFirstName = data.given_name;
            this.gmailLastName = data.family_name;
            this.gmailPicture = data.picture;
            deferred.resolve(data);
        }).fail(function(response) {
            deferred.reject(response.responseJSON);
    });

    return deferred.promise();
  }

  /*
  Google認証を呼び出す
  */
  callGoogle() {

      var deferred = $.Deferred();

      this.authorize().done(function(data) {

          this.accessToken = data.access_token;
          localStorage.setItem('this.access_token', this.accessToken);
          this.getDataProfile().done(function(data) {
            deferred.resolve(data);
          });
      });

      return deferred.promise();
  }

};
