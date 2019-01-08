import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { TopPage } from '../pages/top/top';
import { GraphPage } from '../pages/graph/graph';
import { AddHomeworkPage } from '../pages/addHomework/addHomework';
import { MemberPage } from '../pages/member/member';
import { SettingPage } from '../pages/setting/setting';
import { UserInfoPage } from '../pages/userInfo/userInfo';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = LoginPage;


  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: '家事入力', component: TopPage },
      { title: '家事グラフ', component: GraphPage },
      { title: '家事設定', component: AddHomeworkPage },
      { title: 'メンバー管理', component: MemberPage },
      { title: '設定', component: SettingPage },
      { title: 'ユーザー情報', component: UserInfoPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  // ページ表示処理
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  // // TODO: サインアウト処理 -> ユーザー情報画面で実施する？
  signOut() {

    // isSingIn = false;
    // var serial = localStorage.getItem('homework_user.serial');
    //
    // if (serial !== null) {
    //     localStorage.removeItem('roomInfo.room_id');
    //     localStorage.removeItem('homework_user.serial');
    //     this.nav.setRoot(LoginPage);
    // } else {
    //     googleAuth.disconnectUser().done(function (data) {
    //         localStorage.removeItem('roomInfo.room_id');
    //         localStorage.removeItem('googleAuth.access_token');
    //
    //         myNavigator.replacePage('login.html');
    //     });
    // }
  }
}
