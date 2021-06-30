import { Observable  } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { MatRadioChange } from '@angular/material/radio';
import {  Router } from '@angular/router';

import { DataService } from "../data.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  loading = false;
  selectedEntity: Entity;
  apiResult: any;
    authToken : any; // create interface

  entities$: Observable<Entity[]> = this.eventsService.entities$;
    noentities : Entity[]=[];

  constructor(
    private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService,
    private alert: AlertService,
    private router : Router,
    public data : DataService,
  ) { }

  ngOnInit() { //subscribe to the Entities observable to access data on the main page
      this.entities$.subscribe((ents)=>{
          let users = ents.filter((e)=>e.type=="USER"); // restrict entities to USERs
          if(users.length==1){ // if there is only 1 USER, automatically redirect to contact-info
              this.router.navigate(["contactinfo",users[0].link]);
          }
      });
      
          this.eventsService.getInitData()
      .subscribe(initData =>{ 
                              this.data.switchInstCode(initData)});
  }


  

  ngOnDestroy(): void {
  }


}