import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ValDesc } from './classes/address';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { CloudAppRestService } from '@exlibris/exl-cloudapp-angular-lib';
import { map } from 'rxjs/operators';

@Injectable()
export class DataService {

  private userSource = new BehaviorSubject({});
  currentUser = this.userSource.asObservable();

 countries : any;
 addressTypes = [];

  constructor(private http: HttpClient, private restService: CloudAppRestService) {
      let ref = this;
      //load the list of countries used in <select>
  this.http.get("/assets/countries.json").subscribe((data)=>{
      ref.countries = data;
  })
      this.restService.call('/conf/code-tables/UserAddressTypes').pipe(
        map(result => result.row ),
      )
      .subscribe(result => ref.addressTypes = result );
  }
    
    // load the currently displayed user data
  switchUser(user: any) {
    this.userSource.next(user)
  }

}
