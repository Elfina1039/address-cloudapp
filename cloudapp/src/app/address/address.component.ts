
import { Component, OnInit, Input} from '@angular/core';

import { Address, ValDesc } from '../classes/address';


@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit{

@Input("address") address : Address;
    
  constructor() { }

  ngOnInit() {
  
  }



}