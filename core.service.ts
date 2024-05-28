
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { catchError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CoreService {
url:any='http://localhost:3000'
API:any=`http://localhost:8000`
  constructor(private httpclient:HttpClient) { }
  postUserquote(data:any){
    return this.httpclient.post(`${this.url}/Userquote`,data)
  }
  postsignupdata(data:any){
    return this.httpclient.post(`${this.API}/Signupdata`,data)
  }
  getsignupdata(){
    return this.httpclient.get(`${this.API}/Signupdata`)
  }
  deletesignupdata(id:any){
    return this.httpclient.delete(`${this.API}/Signupdata/${id}`)
  }
  getUserquote(){
    return this.httpclient.get(`${this.url}/Userquote`)
  }
  deleteitem(id:any){
    return this.httpclient.delete(`${this.API}/Tableitems/${id}`)
  }
  postitems(items:any){
    return this.httpclient.post(`${this.API}/Tableitems`,items)
  }
  postlogindata(data:any){
    return this.httpclient.post(`${this.API}/Logindata`,data)
  }
  getitems(){
    return this.httpclient.get(`${this.API}/Tableitems`)
  }
  updateitem(id:any,data:any){
    return this.httpclient.put(`${this.API}/Tableitems/${id}`,data)
  }
  updateoredrs(id:any,data:any){
    return this.httpclient.put(`${this.API}/Carditems/${id}`,{"status":data})
  }
  updateusername(id:any,data:any){
    return this.httpclient.put(`${this.API}/Signupdata/${id}`,{"status":data})
  }
  updateone(id:any,data:any,table:any){
    return this.httpclient.put(`${this.API}/${table}/${id}`,{"status":data})
  }
  admindataget(){
    return this.httpclient.get(`${this.API}/Mainadmindata`)
  }
  admindatapost(data:any){
    return this.httpclient.post(`${this.API}/Mainadmindata`,data)
  }
  getcarditems(){
    return this.httpclient.get(`${this.API}/Carditems`)
  }
  postcarditems(data:any){
    return this.httpclient.post(`${this.API}/Carditems`,data)
  }
  deletecarditems(id:any){
    return this.httpclient.delete(`${this.API}/Carditems/${id}`)
  }
  getgraphdata(id:any){
    return this.httpclient.get(`${this.API}/CarditemsAmount/${id}`)
  }
  
  getCardItems(): Observable<any> {
    return this.httpclient.get(`${this.API}/Carditems`);
  }
  getCardItemssave(): Observable<any> {
    return this.httpclient.get(`${this.API}/SaveCard`);
  }
  getCardItemsFilteredByDate(date: string): Observable<any[]> {
    return this.getCardItems().pipe(
      map((orders: any[]) => orders.filter(order => order['0'][0]['date'] === date))
    );
  }
  getCardItemsFilteredByinvoice(serchcterm: string): Observable<any[]> {
    return this.getCardItems().pipe(
      map((orders: any[]) => orders?.filter(order => order['0'][0]['invoiceno']?.toLowerCase().includes(serchcterm?.toLowerCase())))
    );
  }
  getCardItemsFilteredByDatesave(date: string): Observable<any[]> {
    return this.getCardItemssave().pipe(
      map((orders: any[]) => orders.filter(order => order['0'][0]['date'] === date))
    );
  }
  getCardItemsFilteredByinvoicesave(serchcterm: string): Observable<any[]> {
    return this.getCardItemssave().pipe(
      map((orders: any[]) => orders?.filter(order => order['0'][0]['invoiceno']?.toLowerCase().includes(serchcterm?.toLowerCase())))
    );
  }
  getsuperadmindata(){
    return this.httpclient.get(`${this.API}/superadmindatas`)
  }
  getlocation(lat:any,lng:any){
    return this.httpclient.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
  }
  get(table:string){
    return this.httpclient.get(`${this.API}/${table}`)
  }
  post(data:any,table:string){
    return this.httpclient.post(`${this.API}/${table}`,data)
  }
  delete(id:any,table:string){
    return this.httpclient.delete(`${this.API}/${table}/${id}`,)
  }
  getbyid(id:any,table:string){
    return this.httpclient.get(`${this.API}/${table}/${id}`,)
  }
  update(id:any,data:any,table:any){
    return this.httpclient.put(`${this.API}/${table}/${id}`,data)
  }
  checkNetworkStatus() {
    return  this.httpclient.get(`${this.API}/Signupdata`)
  }
}
