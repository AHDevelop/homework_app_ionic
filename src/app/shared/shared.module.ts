import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';

  /*
  * 家事登録ダイアログで家事時間を加算する
  */
  export function plusHour(hour){

      var hour =  Number(hour);

      if(hour < 24){
          hour += 0.5;
      }

      var hourStr = hour.toString();
      if(!hourStr.match(/\./)){
          hourStr += ".0";
      }

      return hourStr;
  }

  /*
  * 家事登録ダイアログで家事時間を減算する
  */
  export function minusHour(hour){

      var hour =  Number(hour);

      if(0.5 < hour){
          hour -= 0.5;
      }

      var hourStr = hour.toString();

      if(!hourStr.match(/\./)){
          hourStr += ".0";
      }

      return hourStr;
  }

  /*
  * 整数値に.0を追加する
  */
  export function zeroPad(hour){

      var hourStr = hour.toString();

      if(!hourStr.match(/\./)){
          hourStr += ".0";
      }

      return hourStr;
  }

  /**
   * Get the URL parameter value
   *
   * @param  name {string} パラメータのキー文字列
   * @return  url {url} 対象のURL文字列
   */
  export function getParam(name, url) {
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  /*
  * ローディング中画面を表示
  */
  export function showLoading(loadingCtrl){

      const loader = loadingCtrl.create({
        content: "Please wait...",
        duration: 3000
      });
      loader.present();

    // current_scrollY = $("ons-page#top .page__content").scrollTop();
    // $('ons-modal').css("top", current_scrollY);
    // $('ons-modal').show();
  }

  /*
  * ローディング中画面を非表示
  */
  export function hideLoading(){
      $('ons-modal').hide();
  }
