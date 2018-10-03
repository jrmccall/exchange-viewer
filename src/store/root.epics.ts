import { Injectable } from '@angular/core';
import { combineEpics } from 'redux-observable';
import {LibraryEpics} from '../library/library.epics';
import {LibraryActions} from '../library/library.actions';

@Injectable()
export class RootEpics {
  constructor(
    private _libraryEpics: LibraryEpics
  ) {}

  public combineEpics() {
    return combineEpics(
      this._libraryEpics.loadAll(LibraryActions.LOAD_ALL),
      this._libraryEpics.getAllCoins(LibraryActions.GET_ALL_COINS)

    );
  }
}
