import {Http} from 'angular2/http';

let httpService: Http;

export function setHttp(http: Http): void {
  httpService = http;
}

export function http(): Http {
  return httpService;
}
