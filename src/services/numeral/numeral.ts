declare var require: any;
const numeral = require('numeral');

export class Numeral {

  numeral = numeral;

  constructor(){

  }

  formatNumToLetter(num: any){
    return this.numeral(num).format('($0.00a)');
  }

  formatNumToLetterPlain(num: any){
    return this.numeral(num).format('(0.00a)');
  }
}
