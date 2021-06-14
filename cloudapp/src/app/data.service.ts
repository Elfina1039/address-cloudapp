import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ValDesc } from './classes/address';
import { HttpClient , HttpHeaders } from '@angular/common/http';

@Injectable()
export class DataService {

  private userSource = new BehaviorSubject({});
  currentUser = this.userSource.asObservable();

 countries : any;

  constructor(private http: HttpClient) {
      let ref = this;
      //load the list of countries used in <select>
  this.http.get("/assets/countries.json").subscribe((data)=>{
      ref.countries = data;
  })
  }
    
    // load the currently displayed user data
  switchUser(user: any) {
    this.userSource.next(user)
  }

}
