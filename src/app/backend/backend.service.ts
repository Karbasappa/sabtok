import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RemoteCallService {
  baseurl: string = environment.appBaseurl;

  constructor(private httpClient: HttpClient) {}

  postData(endpoint: string, formData: FormData): Observable<any> {
    return this.httpClient
      .post(this.baseurl + endpoint, formData)
      .pipe(map((response) => response));
  }

  postFromData(endpoint: string, formData: FormData): Observable<any> {
    return this.httpClient
      .post(this.baseurl + endpoint, formData, this.getHeaderOptions1())
      .pipe(map((response) => response));
  }

  postDataReponseText(endpoint: string, formData: FormData): Observable<any> {
    return this.httpClient
      .post(this.baseurl + endpoint, formData, { responseType: 'text' })
      .pipe(map((response) => response));
  }

  getData(endpoint: string): Observable<any> {
    return this.httpClient.get<any>(this.baseurl + endpoint,this.getHeaderOptions());
  }

  postStringData(endpoint: string, requestBody: string): Observable<any> {
    return this.httpClient
      .post(this.baseurl + endpoint, requestBody, this.getHeaderOptions())
      .pipe(map((response) => response));
  }

  putStringData(endpoint: string, requestBody: string): Observable<any> {
    return this.httpClient
      .put(this.baseurl + endpoint, requestBody, this.getHeaderOptions())
      .pipe(map((response) => response));
  }

  getTextData(endpoint: string): Observable<any> {
    return this.httpClient.get(environment.appBaseurl + endpoint, {
      headers: this.getHeader(),
      responseType: 'text',
    });
  }

  postStringDataResponseText(
    endpoint: string,
    requestBody: any
  ): Observable<any> {
    console.log(endpoint);
    // const headers = new HttpHeaders()
    // .set('content-type', 'application/json')
    //  .set('Access-Control-Allow-Origin', '*');
    // tslint:disable-next-line:max-line-length
    return this.httpClient
      .post(environment.appBaseurl + endpoint, requestBody, {
        headers: this.getHeader(),
        responseType: 'text',
      })
      .pipe(map((response) => response));
  }
  private getHeaderOptions(): any {
    let authorizationData =
      'Basic ' + btoa(environment.username + ':' + environment.password);
    const headerOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST',
        'Content-Type': 'application/json', //this will not work for formdata
        'Access-Control-Allow-Headers': 'application/json',
        Accept: 'application/json',
        Authorization: authorizationData,
      }),
      '': '',
    };
    return headerOptions;
  }

  private getHeaderOptions1(): any {
    let authorizationData =
      'Basic ' + btoa(environment.username + ':' + environment.password);
    const headerOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST',
       // 'Content-Type': 'application/json', //this will not work for formdata
        'Access-Control-Allow-Headers': 'application/json',
        Accept: 'application/json',
        Authorization: authorizationData,
      }),
      '': '',
    };
    var proxy = '//cors-anywhere.herokuapp.com';
    return headerOptions;
  }

  private getHeader(): HttpHeaders {
    let authorizationData =
      'Basic ' + btoa(environment.username + ':' + environment.password);
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      // 'Content-Type':  'application/json',
      'Access-Control-Allow-Headers': 'application/json',
      Accept: 'application/json',
      Authorization: authorizationData,
    });
    return headers;
  }
}