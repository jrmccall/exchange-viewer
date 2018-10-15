import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LiquidityProvidedPage } from '../pages/liquidity-provided/liquidity-provided';
import { AggregatePage } from '../pages/aggregate/aggregate';
import {LibraryActions} from "../library/library.actions";
import {dispatch} from "@angular-redux/store";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = AggregatePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private _libraryActions: LibraryActions) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Aggregate', component: AggregatePage },
      { title: 'Liquidity Provided', component: LiquidityProvidedPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this._libraryActions.loadAll();
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }


}
