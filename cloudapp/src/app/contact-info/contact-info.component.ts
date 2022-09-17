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

    //testers allowed to access the "exception function"
    testers = ["APPCLOUD", "ADMIN", "UKN_DROBIKOVA", "UKN_SIVAKOVA"];
    
  loading = false;
  userData: any; 
  userLink : string;
    
  addresses : any = [];
 emails : any = [];
     phones : any = [];
    
    note : any;
    suggestedGroups : any = [];
    
    suggestedNoteRemovals : any = [];
    selectedException : string = "";
    
    
  subscription: Subscription;
    
    instSubscription : Subscription;
    instCode : any;

  constructor(
    private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService,
    private alert: AlertService,
    private route: ActivatedRoute, 
    private router : Router,
    public data : DataService
  ) { }

  ngOnInit() { // read user link from URL and call loadUserData
      let ref = this;
      
console.log("contact info init");

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
    
    // redirect to /renew/ if account has expired
    loadData(data){
          this.userData = data;
    
        this.data.switchUser(data);
        if(data.expiry_date && new Date(data.expiry_date)<=new Date()){
           this.router.navigate(["renew",btoa(this.userLink)]);
           }else{
           this.extractAddresses(data);
               
                  this.eventsService.getInitData()
      .subscribe(initData =>{ 
             
              console.log(initData);
                            });
               
               console.log(this.data.user);
               if(this.testers.indexOf(this.data.user.toUpperCase())!=-1){
                   
               if(this.data.currentlyAtLibCode.match("PF")){
               
                   this.checkNotes(data.user_note);
                   console.log("checking notes");
               }else{
                console.log("NOT PF");
               }
                   
               }else{
                console.log("you are not a tester");
               }
        
           }
        
    }
    
    //check Notes to see if to offer a change of user type
    
    findNote(){
        
        let ref = this;
        
         let rgx = new RegExp("^(Generováno)|(Aktualizováno)|(E-souhlas)");
       this.userData.user_note.forEach((n)=>{
           if(!rgx.test(n.note_text)){
               console.log(n);
               ref.note = n;
       
       }});
        
     
    }
    
    
    checkNotes(notes){
        let parsed : any = [];
        let rgx = new RegExp("^(Generováno)|(Aktualizováno)|(E-souhlas)");
        let selected = notes.filter((n)=>!rgx.test(n.note_text));
        
        if(selected.length>1){
            this.note = 
            console.log("Nelze načíst poznámky");
        }else if(selected.length==1){
           this.findNote();
            parsed = this.parseNote(selected[0]);
        }
        
        
        let units = ["-"];
        let exceptions = parsed.map((p)=>p.type);
        
        console.log(exceptions);
        
        parsed.forEach((p)=>{
            console.log(p.units);
           units =  units.concat(p.units);
            console.log(units);
        });
       
        console.log(units);
       
        
        if(units.indexOf("PF")!=-1){
            
            let exception : string = this.findException(exceptions);
            
            console.log(exception);
         
            if(!exception){
                this.suggestExceptions();
                
            }else{
                this.suggestExcRemoval(exception);
            }
        
      
        }
        
        
      
        
    }
    
    suggestExceptions(){
        
        for(let n in this.data.groupChanges){
            let group = this.data.groupChanges[n];
            this.suggestedGroups.push({exception:n, group:group});
        }
        
    }
    
     suggestExcRemoval(exception : string){
    
         this.suggestedNoteRemovals.push(exception); 
    }
    
    findException(exceptions : any){
        let exception = "";
        exceptions.forEach((e)=>{
            console.log(e);
            if(this.data.groupChanges[e.trim()]){
                console.log("sending " +e);
               exception  = e;
            }
        });
     
        return exception;
    }
    
  
    
    addException(e){
        let ref = this;
        console.log(e);
       this.note.note_text = this.note.note_text+"; "+e.exception;
        
        if(this.userData.user_group != e.group){
                this.userData.user_group = e.group;
        }
     
        
       this.save();
        
    }
    
    
    removeException(r){
        let ref = this;
        let rgx = new RegExp("; ?"+r);
        this.note.note_text=this.note.note_text.replace(rgx,""); 
      
        this.save();
    }
    
  parseNote(note:any){
      
      let dateRgx = /\([0-9]{1,2}\. ?[0-9]{1,2}\. ?[0-9]{4}\)/g;
      
      let list = note.note_text.split(";");
      
      let parsed = list.map((i)=>{
        
          let parts = i.split(":");
          
          let type, date, units;
          
          type = parts[0].trim();
          
          if(parts[1]){
            date = parts[1].match(dateRgx);
        let  unit = parts[1].replace(dateRgx, "").trim();
          units = unit.split(",").map((u)=>u.trim());  
          }
          
          
          return {type:type, units:units, date:date};
          
      });
      
      console.log(parsed);
      return parsed;
      
    }
    
    
    // filter contacts to be shown
    extractAddresses(userData){

      console.log(userData);
 
        let ref = this;
                  let line5:string = "";
        
        userData.contact_info.address.forEach((a, ai)=>{
           //extract line 5 if if exists
               

            if(a.line5 && a.line5!=""){
              
                line5=a.line5;
            }
            
            this.data.line5 = line5;
    
           if(ref.isAddressEditable(a.address_type, ref.data.config.allowedAddressTypes, a.address_note)){
               //copy line 5
               a.line5=line5;
           
               ref.addresses.push({index: ai, address: new Address(a)});
           }
            
        });
        
         userData.contact_info.email.forEach((a, ai)=>{
         
           if(ref.isEditable(a.email_type, ref.data.config.allowedEmailTypes, a.preferred)){
               ref.emails.push({index: ai, address: new Email(a)});
           }
            
        });
        
          userData.contact_info.phone.forEach((a, ai)=>{
      
           if(ref.isEditable(a.phone_type, ref.data.config.allowedPhoneTypes, a.preferred)){
               ref.phones.push({index: ai, address: new Phone(a)});
           }
            
        });
        
        if(this.addresses.length==0){
            let newAddress = new Address({line5:line5});
            this.addresses.unshift({index:-1, address: newAddress});
           
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


    isEditable(types, allowed, preferred:boolean):boolean{ // the function determining whether to allow address editing
        let allow = false;
        types.forEach((t)=>{
           
           if(allowed.indexOf(t.value)!=-1 && preferred==true){
             allow = true;  
           } 
        });
        
        return allow;
    }
    
       isAddressEditable(types, allowed, note:string = ""):boolean{ // the function determining whether to allow address editing
        let allow = false;
        types.forEach((t)=>{
           
           if(allowed.indexOf(t.value)!=-1 || (t.value=="home" && note =="User Address Type: Adresa pro korespondenci") ){
             allow = true;  
           } 
        });
        
        return allow;
    }

    
     save() { // sent the PUT request to Alma API
    const requestBody = this.userData;
         let ref = this;
  console.log(requestBody);
    this.loading = true;
    let request: Request = {
      url: this.userLink+"?override=user_group", 
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
        
          ref.suggestedNoteRemovals = [];
        ref.suggestedGroups = [];
      },
      error: (e: RestErrorResponse) => {
        this.alert.error('Failed to update data: ' + e.message);
        console.error(e);
          
      }
    });    
  }


}