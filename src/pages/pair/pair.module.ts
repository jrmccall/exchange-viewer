import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PairPage } from './pair';

@NgModule({
  declarations: [
    PairPage,
  ],
  imports: [
    IonicPageModule.forChild(PairPage),
  ],
})
export class PairPageModule {}
