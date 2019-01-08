import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import * as Shared from '../../app/shared/shared.module';
import { GoogleAuth } from '../../app/shared/shared.googleAuth';
import { Api } from '../../app/shared/shared.api';
import { LoadingController } from 'ionic-angular';
import { MyGlobalValue } from '../../app/MyGlobalValue';
import * as moment from 'moment';
import { UserChartPage } from '../userChart/userChart';
import { HomeworkChartPage } from '../homeworkChart/homeworkChart';

@Component({
  selector: 'page-graph',
  templateUrl: 'graph.html',
})

export class GraphPage {
  userChartPage: any = UserChartPage;
  homeworkChartPage: any = HomeworkChartPage;

  // 処理中ダイアログ
  loading: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public myGlobalValue: MyGlobalValue, public api: Api) {
  }
}
