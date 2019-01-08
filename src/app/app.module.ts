import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { TopPage } from '../pages/top/top';
import { GraphPage } from '../pages/graph/graph';
import { UserChartPage } from '../pages/userChart/userChart';
import { HomeworkChartPage } from '../pages/homeworkChart/homeworkChart';
import { AddHomeworkPage } from '../pages/addHomework/addHomework';
import { EditPage } from '../pages/editPage/editPage';
import { SettingPage } from '../pages/setting/setting';
import { MemberPage } from '../pages/member/member';
import { UserInfoPage } from '../pages/userInfo/userInfo';

import { Api } from './shared/shared.api';
import { GoogleAuth } from './shared/shared.googleAuth';

// import * as Shared from '../app/shared/shared.module';
// import { ChartModule } from 'angular2-chartjs';
import { ChartsModule } from 'ng2-charts';
import { MyGlobalValue } from './MyGlobalValue';


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    TopPage,
    GraphPage,
    UserChartPage,
    HomeworkChartPage,
    AddHomeworkPage,
    EditPage,
    SettingPage,
    MemberPage,
    UserInfoPage,
    Api,
    GoogleAuth
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    TopPage,
    GraphPage,
    UserChartPage,
    HomeworkChartPage,
    AddHomeworkPage,
    EditPage,
    SettingPage,
    MemberPage,
    UserInfoPage,
    Api,
    GoogleAuth
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MyGlobalValue,
    Api,
  ]
})
export class AppModule {

  // constructor() {
    /*
    * タイムゾーンの設定 // TODO:
    */
    // moment.tz.add("Asia/Tokyo|JST JDT|-90 -a0|010101010|-QJJ0 Rb0 1ld0 14n0 1zd0 On0 1zd0 On0|38e6");
    // moment.tz.add("Asia/Ho_Chi_Minh|LMT PLMT +07 +08 +09|-76.E -76.u -70 -80 -90|0123423232|-2yC76.E bK00.a 1h7b6.u 5lz0 18o0 3Oq0 k5b0 aW00 BAM0|90e5");
    // moment.tz.link('Asia/Ho_Chi_Minh|Asia/Saigon');
    // moment.tz.setDefault("Asia/Tokyo");
  // }

}
