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
 language : any;
    
langData : any = {};

  constructor(private http: HttpClient, private restService: CloudAppRestService) {
      let ref = this;
      //load the list of countries used in <select>
 // this.http.get("/assets/countries.json").subscribe((data)=>{
//      ref.countries = data;
//  });
      
      this.langData["english"]={
"language": "English",
"postal_code_pattern" : "[0-9]{5}",
    "select_user" : "Select user"
};
      
      this.langData["czech"]={
"language": "Czech",
"postal_code_pattern" : "[0-9]{3}\\s[0-9]{2}",
"select_user" : "Vyberte uživatele"
};
      
    
      this.restService.call('/conf/code-tables/UserAddressTypes').pipe(
        map(result => result.row ),
      )
      .subscribe(result => ref.addressTypes = result );
      
      let language = localStorage.getItem("address_manager_lang") ? localStorage.getItem("address_manager_lang") : "english";
      
      this.switchLanguage(language);
  }
    
    // load the currently displayed user data
  switchUser(user: any) {
    this.userSource.next(user)
  }
    
    switchLanguage(lang : string){
        let ref = this;
      
      ref.language = this.langData[lang];
        
 
     localStorage.setItem("address_manager_lang", lang)  
    }
    
    
    switchLanguageJson(lang : string){ // old version
        let ref = this;
         this.http.get("/assets/"+lang+".json").subscribe((data)=>{
      ref.language = data;
        
  });
     localStorage.setItem("address_manager_lang", lang)  
    }

}
