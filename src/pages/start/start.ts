import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Observable} from "rxjs/Rx";
import {Coin} from "../../library/coin.model";
import {PoloniexService} from "../../services/exchange-services/poloniex-service";
import {LibraryActions} from "../../library/library.actions";
import {select} from "@angular-redux/store";
import {AggregatePage} from "../aggregate/aggregate";

/**
 * Generated class for the StartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {

  @select(['library', 'isLoading']) isLoading$: Observable<any>;

  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public poloniexService: PoloniexService, private _libraryActions: LibraryActions,
              public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartPage');
    this.isLoading$.distinctUntilChanged().subscribe(isLoading => {
      if(isLoading){
        if(!this.loading){
          this.loading = this.loadingCtrl.create({content: 'Please wait...'});
        }
        //this.loading.present();
      } else {
        if(this.loading){
          //this.loading.dismiss();
          this.loading = null;
          this.setAggregateToRoot();
        }
      }
    });
  }

  ionViewDidLeave(){
    let coins: Coin[] = [];
    this.poloniexCoins$.subscribe(data => coins = data);
    console.log(coins);
    this._libraryActions.setPoloniexCoins(coins);
  }

  poloniexCoins$: Observable<Coin[]> = this.poloniexService.formatDataForLibrary();

  setAggregateToRoot(){
    this.navCtrl.setRoot(AggregatePage);
  }

}
