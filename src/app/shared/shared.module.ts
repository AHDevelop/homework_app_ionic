import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';

/*
* 整数値に.0を追加する
*/
export function zeroPad(hour) {

  var hourStr = hour.toString();

  if (!hourStr.match(/\./)) {
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
export function showLoading(loadingCtrl) {
  console.log("show");
  return loadingCtrl.create({
    spinner: "bubbles",
    content: '処理中です...',
    duration: 3000,
    // dismissOnPageChange: true,
  });
}

/*
* ローディング中画面を非表示
*/
export function hideLoading(loader) {
  if (loader == undefined) {
    return;
  }
console.log(loader);
  loader.dismiss();
}
