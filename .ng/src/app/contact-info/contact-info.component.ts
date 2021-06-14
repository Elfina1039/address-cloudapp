import { Observable  } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';

import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from "../data.service";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit, OnDestroy {

  loading = false;
  userData: any; 
  userLink : string;
  addresses : any = [];
  subscription: Subscription;

  constructor(
    private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService,
    private alert: AlertService,
    private route: ActivatedRoute, 
    private router : Router,
    private data : DataService
  ) { }

  ngOnInit() { // read user link from URL and call loadUserData
      let ref = this;
      this.route.paramMap.subscribe(function(p){
        let user : string=p.get('user');       
        ref.userLink = user; 
        ref.loadUserData(user);
      });  
    
      //subscribe to he observable from the data.service which allows to share userData between components
     this.subscription = this.data.currentUser.subscribe(user => this.userData = user);
  }

  ngOnDestroy(){
       this.subscription.unsubscribe();
  }

  loadUserData(link : string) { // call ALma API 
    this.loading = true;
    this.restService.call<any>(link)
    .pipe(finalize(()=>this.loading=false))
    .subscribe(
      result => this.extractAddresses(result),
      error => this.alert.error('Failed to retrieve entity: ' + error.message)
    );
  }
    
    extractAddresses(userData){
        console.log(userData);
        let addresses = this.addresses;
        this.userData = userData;
        this.data.switchUser(userData);
        
        userData.contact_info.address.forEach((a)=>{
            a.preferred = false;
            console.log(a);
            addresses.push(a);
        });
    }
    
    redirectToEdit(i){ // router redirect to the address-form component
        let link = this.userLink;
        this.router.navigate(["form","edit",btoa(link),i]);
    }

     redirectToAdd(){ //router redirect to the address-form component
        let link = this.userLink;
        this.router.navigate(["form","add",btoa(link)]);
    }
    

  clear() { // clear userData
    this.userData = null;
  }


    allowEdit(address):boolean{ // the function determining whether to allow address editing
        let disable = true;
        address.address_type.forEach((t)=>{
           if(t.value=="alternative" || (t.value=="home" && address.address_note=="User Address Type: Adresa pro korespondenci")){
             disable = false;  
           } 
        });
        
        return disable;
    }
    
      allowAdding():boolean{ // the function determining whether to allow address addition
          let ref = this;
        let disable : boolean = true;
        let result : boolean = false;
        this.userData.contact_info.address.forEach((a)=>{
           disable = ref.allowEdit(a);
            if(disable==false){
                result = true;
            }
        });
        return result;
    }


}