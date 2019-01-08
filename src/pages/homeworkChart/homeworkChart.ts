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
  selector: 'page-homework-chart',
  templateUrl: 'homeworkChart.html',
})

export class HomeworkChartPage {
  fromDate: any;
  toDate: any;
  hasHomeworkChartData: boolean = false;
  termId: string = "1";

  homeworkChartType: string = "pie";
  homeworkChartData: any = [];
  homeworkChartLabels: any = [];

  // 処理中ダイアログ
  loading: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public myGlobalValue: MyGlobalValue, public api: Api) {

    this.fromDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
    this.toDate = moment().format('YYYY-MM-DD');
    this.updateGraph(this.fromDate, this.toDate);

  }

  // 集計期間変更
  changeTerm($event) {

    // グラフを一度非表示にする
    this.hasHomeworkChartData = false;

    var selectedVal = $event;

    if (selectedVal == 1) {
      // 期間の更新
      this.fromDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
      this.toDate = moment().format('YYYY-MM-DD');
      // グラフの再取得処理
      this.updateGraph(this.fromDate, this.toDate);

    } else if (selectedVal == 2) {
      // 期間の更新
      var yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
      this.fromDate = yesterday;
      this.toDate = yesterday;
      // グラフの再取得処理
      this.updateGraph(this.fromDate, this.toDate);

    } else if (selectedVal == 3) {
      // 期間の更新
      var today = moment().format('YYYY-MM-DD');
      this.fromDate = today;
      this.toDate = today;
      // グラフの再取得処理
      this.updateGraph(this.fromDate, this.toDate);
    }
  }

  /*
  * グラフの再取得処理
  */
  updateGraph(fromDate, toDate) {

    // 家事別時間集計取得
    var _self = this;
    this.api.getHistSummaryByHomework(fromDate, toDate).done(function(response) {

      //API返却値をグラフモジュール用に整形
      var data = [];
      var label = [];
      response.results.forEach(function(histObj) {
        data.push(parseFloat(histObj["home_work_time_sum"]));
        label.push(histObj["home_work_name"]);
      });

      if (0 < data.length) {
        _self.homeworkChartData = data;
        _self.homeworkChartLabels = label;
        _self.hasHomeworkChartData = true;
      } else {
        _self.hasHomeworkChartData = false;
      }

    }).always(function() {
      Shared.hideLoading(_self.loading);
    });
  };
}
