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
    
     private instSource = new BehaviorSubject({});
  currentInst = this.instSource.asObservable();

    line5 : string = "";
    
 countries : any;
 addressTypes = [];
 language : any;
instCode : any;
  currentlyAtLibCode : string;  
    
groupChanges : any = {
  "rigo" : {value:"12", desc:"Spolupracovník UK"},
  "kurz LLM" : {value:"01", desc:"Student UK"},
    "0. ročník" : {value:"01", desc:"Student UK"}
};    
    
langData : any = {};
      configData : any = {"420CKIS_INST" : {allowedAddressTypes:["none"],
                                            allowedEmailTypes:["personal"],
                                            allowedPhoneTypes:["home"],
                                            fields : {line4:true,
                                                            preferred: true,
                                                            type : true}
                                           }};
      
      defaultConfig : any = {
          allowedAddressTypes: ["home","alternative", "office", "work"],
           allowedEmailTypes:[true, false],
        allowedPhoneTypes:[true, false],
fields : {line4:false,
            preferred: false,
            type : false}
      }
      
      config : any;
      

  constructor(private http: HttpClient, private restService: CloudAppRestService) {
      let ref = this;
      //load the list of countries used in <select>
 // this.http.get("/assets/countries.json").subscribe((data)=>{
//      ref.countries = data;
//  });
      
      this.langData["english"]={
"language": "English",
"postal_code_pattern" : "[0-9]{3}\\s[0-9]{2}",
    "navigateToUsers" : "Please navigate to user records.",
    "select_user" : "Select user",
    "renewal" : "Registration has expired",
          new_expiry: "Please renew the registration in Alma before proceeding. ",
          home: "Home",
          back: "Back",
          save : "Save",
          Edit: "Edit contact info",
          Add:"Add contact info",
          errors:{required:"This field is required.",
                 email: "Email address is invalid.",
                 phone: "Phone number is invalid.",
                  street: "This field is invalid.",
                  postalCode: "Please enter a valid postal code."
                },
          degree: "Degree",
          phone: "Phone number",
          street: "Street and house number",
          city: "City",
          country: "Country",
          postalCode: "Postal code",
          preferred: "Preferred",
          type: "Type",
          addresses : "Addresses",
          emails : "Emails",
          phones : "Phones",
        dialog:{ verify : "Verify with user primary id.",
          primaryId : "Primary identifier",
          confirm : "Confirm",
          cancel : "Cancel",
          idsNotMatch : "User IDs do not match."}
};
      
      this.langData["czech"]={
"language": "Czech",
"postal_code_pattern" : "[0-9]{3}\\s[0-9]{2}",
"navigateToUsers" : "Prosím načtěte záznamy uživatelů.",
"select_user" : "Vyberte uživatele",
           "renewal" : "Registrace vypršela",
          new_expiry: "Obnovte, prosím, registraci v prosředí Almy.",
          home: "Domů",
          back: "Zpět",
          save: "Uložit",
          Edit:"Upravit údaje",
          Add: "Přidat kontaktní údaje",
          errors:{required:"Toto pole je povinné.",
                 email: "Neplatný email.",
                 phone:"Neplatné číslo.",
                street: "Pole je neplatné.",
                  postalCode: "PSČ je neplatné"
                 },
        degree: "Titul:",
          phone: "Telefonní číslo",
          street : "Ulice a číslo popisné",
          city: "Město",
                country: "Stát",
          postalCode : "PSČ",
          preferred : "Preferováno",
          type: "Typ",
          addresses : "Adresy",
          emails : "Emailové adresy",
          phones : "Telefonní čísla",
        dialog:{verify : "Pro potvrzení zadejte identifikátor uživatele.",
          primaryId : "Primární identifikátor",
            confirm : "Potvrdit",
          cancel : "Zrušit",
          idsNotMatch : "Identifikátory se neshodují."}
};
      
    
    
      this.restService.call('/conf/code-tables/UserAddressTypes').pipe(
        map(result => result.row ),
      )
      .subscribe(result => ref.addressTypes = result );
      
     
      
      
  }
    
    // load the currently displayed user data
  switchUser(user: any) {
    this.userSource.next(user)
  }
    
    
     switchInstCode(initData: any) {
    this.instSource.next(initData.instCode);
         if(this.configData[initData.instCode]){
             this.config = this.configData[initData.instCode];
         }else{
             this.config = this.defaultConfig;
         }
      // replace with currentlyAtLibCode
         
         console.log("CAL code: " + initData.user.currentlyAtLibCode);
         
         this.currentlyAtLibCode = initData.user.currentlyAtLibCode;
         
         
         if(initData.lang=="en"){
             this.switchLanguage("english");
         }else{
              this.switchLanguage("czech");
         }
  }
    
    
    switchLanguage(lang : string){
        let ref = this;
      
      ref.language = this.langData[lang];
        
    }
    
    
    switchLanguageJson(lang : string){ // old version
        let ref = this;
         this.http.get("/assets/"+lang+".json").subscribe((data)=>{
      ref.language = data;
        
  });
     localStorage.setItem("address_manager_lang", lang)  
    }

}
