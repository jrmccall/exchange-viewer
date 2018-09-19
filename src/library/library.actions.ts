import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '../store/root.reducer';
import {AjaxTrio} from '../shared/ajaxTrio.class';


@Injectable()
export class LibraryActions {

  static readonly LOAD_ALL = new AjaxTrio(
    'LOAD_ALL',
    'Loading library...',
    'Failed to load library'
  );

  constructor(private _ngRedux: NgRedux<IAppState>) {
  }

  loadAll() {
    AjaxTrio.dispatchRequestAction(
      this._ngRedux, LibraryActions.LOAD_ALL, {});
  }



}
