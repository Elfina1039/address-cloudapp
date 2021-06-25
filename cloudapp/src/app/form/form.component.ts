import { Observable  } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService, CloudAppConfigService } from '@exlibris/exl-cloudapp-angular-lib';
import { MatRadioChange } from '@angular/material/radio';

import { ActivatedRoute, Router } from '@angular/router';
import { Address, ValDesc } from '../classes/address';

import { DataService } from "../data.service";
import { Subscription } from 'rxjs';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog'; 
import { DialogComponent } from '../dialog/dialog.component';
import { MatSelectChange } from '@angular/material/select'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})




export class FormComponent implements OnDestroy{

    loading = false;
    action : string = "Edit"; // current form action
    form: any;
  //  address: Address;
    itemIndex : number;
   // countries : ValDesc[];
    
    userData : any;
    userLink : string;
    subscription: Subscription;
    
    newExpiry : Date;
    
  constructor(
    protected restService: CloudAppRestService,
    protected eventsService: CloudAppEventsService,
    protected alert: AlertService,
      protected config: CloudAppConfigService,
    protected route: ActivatedRoute, 
    protected router : Router,
     public data : DataService,
     public dialog: MatDialog
  ) {
  
    }

  ngOnInit() {
      let ref = this;
     //this.config.set("test data").subscribe((response)=>console.log(response));
     this.route.paramMap.subscribe(function(p){ //extract URL parametres
         let user : string = atob(p.get('user'));
      
            ref.userLink = user;});
      
      this.subscription = this.data.currentUser.subscribe(user => {ref.userData = user;
                                                                    ref.calcRenewal();
                                                                  }); //get access to current user
      
  }
    
 

  ngOnDestroy() {
       this.subscription.unsubscribe();
  }
    
 

    
 matchAddressType(item1, item2){
     return item1 && item2 ? item1.value===item2.value : false;
    }
    

confirm(data){ // open dialog asking for confirmation
    let address = data;
    let userId = this.userData.primary_id;
    let dialogRef = this.dialog.open(DialogComponent, {data:{address:data, userId:userId}});
     this.config.get().subscribe((result)=>console.log(result));
    return dialogRef;
}
    
    calcRenewal(){
         let today = new Date;
        let renewIn = 1;
        
        this.newExpiry = new Date("2022-01-01");
    }

    renewAccount(){
        this.userData.expiry_date = this.newExpiry;
         this.userData.purge_date = this.newExpiry;
        
        this.save();
    }

    
  save() { // sent the PUT request to Alma API
    const requestBody = this.userData;
      console.log(JSON.stringify(requestBody));
      console.log(this.userLink);
    this.loading = true;
    let request: Request = {
      url: this.userLink, 
   // queryParams:{override:"contact_info.address.preferred"},
      method: HttpMethod.PUT,
      requestBody
    };

    this.restService.call(request)
    .pipe(finalize(()=>this.loading=false))
    .subscribe({
      next: result => {
         this.eventsService.refreshPage().subscribe(
          ()=>this.alert.success('Record ' + result.primary_id + "updated.")
        );
      },
      error: (e: RestErrorResponse) => {
        this.alert.error('Failed to update data: ' + e.message);
        console.error(e);
      }
    });    
  }

    
      private tryParseJson(value: any) {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error(e);
    }
    return undefined;
  }




}