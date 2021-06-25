import { Observable  } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';

import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from "../data.service";
import { Subscription } from 'rxjs';

import { Address, ValDesc, Email, Phone } from '../classes/address';

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
 emails : any = [];
     phones : any = [];
    
  subscription: Subscription;
    
    instSubscription : Subscription;
    instCode : any;

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
     this.instSubscription = this.data.currentInst.subscribe(inst => this.instCode = inst);
  }

  ngOnDestroy(){
       this.subscription.unsubscribe();
  }

  loadUserData(link : string) { // call ALma API 
    this.loading = true;
    this.restService.call<any>(link)
    .pipe(finalize(()=>this.loading=false))
    .subscribe(
      result => this.loadData(result),
      error => this.alert.error('Failed to retrieve entity: ' + error.message)
    );
  }
    
    
    loadData(data){
          this.userData = data;
        this.data.switchUser(data);
        if(data.expiry_date && new Date(data.expiry_date)<=new Date()){
           this.router.navigate(["renew",btoa(this.userLink)]);
           }else{
           this.extractAddresses(data);
           }
        
    }
    
    extractAddresses(userData){
        console.log(userData);
        let ref = this;
        
        userData.contact_info.address.forEach((a, ai)=>{
            a.preferred = false;
           if(ref.isEditable(a.address_type, ref.data.config.allowedAddressTypes, a.address_note)){
               ref.addresses.push({index: ai, address: new Address(a)});
           }
            
        });
        
         userData.contact_info.email.forEach((a, ai)=>{
            a.preferred = false;
           if(ref.isEditable(a.email_type, ref.data.config.allowedEmailTypes, "")){
               ref.emails.push({index: ai, address: new Email(a)});
           }
            
        });
        
          userData.contact_info.phone.forEach((a, ai)=>{
            a.preferred = false;
           if(ref.isEditable(a.phone_type, ref.data.config.allowedPhoneTypes, "")){
               ref.phones.push({index: ai, address: new Phone(a)});
           }
            
        });
        
        if(this.addresses.length==0){
            this.addresses.push({index:-1, address: new Address({line1:""})});
        }
        
          if(this.emails.length==0){
            this.emails.push({index:-1, address: new Email({data:""})});
        }
          if(this.phones.length==0){
            this.phones.push({index:-1, address: new Phone({data:""})});
        }
        
    }
    
    

    redirectToEdit(i, form){ // router redirect to the address-form component
        let link = this.userLink;
        this.router.navigate(["form",form,btoa(link),i]);
    }

  
    

  clear() { // clear userData
    this.userData = null;
  }


    isEditable(types, allowed, note:string = ""):boolean{ // the function determining whether to allow address editing
        let allow = false;
        types.forEach((t)=>{
           if(allowed.indexOf(t.value)!=-1 || (t.value=="home" && note =="User Address Type: Adresa pro korespondenci")){
             allow = true;  
           } 
        });
        
        return allow;
    }
    



}