interface ITransit {
  fromJSON(text: string): any;
  toJSON(obj: any): string;
  withRecords(recordCalsses: Array<any>): ITransit;
  withFilter(cb: Function): ITransit;
}

declare var transit: ITransit;

declare module 'transit-immutable-js' {
  export = transit;
}
