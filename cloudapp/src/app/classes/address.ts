export interface ValDesc{ //the interface for address.country and address.type[]
    value: string;
    desc?: string;
}

export class Contact{
     preferred: boolean;
    segment_type: string;
    
    constructor(data){
         this.preferred =  true;
        this.segment_type = data.segment_type ? data.segment_type : "External";
    }
}

export class Address extends Contact{ // address class, can be used to set defult values
    line1 : string;
    line2 : string;
    line3 : string;
    line4 : string;
    
    city: string;
    state_province : string;
    postal_code : number;
    
    country: ValDesc;
    
    address_note: string;
    start_date : string;
    end_date : string;
   
    
    address_type: ValDesc[];
 
    constructor(data){
        super(data);
      
      this.line1 = data.line1 ? data.line1 : "";
         this.line2 = data.line2 ? data.line2 : "";
         this.line3 = data.line3 ? data.line3 : "";
         this.line4 =  data.line4 ? data.line4 : "Česká republika";
        
         this.city = data.city ? data.city : "";
         this.state_province = data.state_province ? data.state_province : "";
         this.postal_code = data.postal_code ? data.postal_code : "";
        
       this.country = data.country ? <ValDesc>data.country : {value:"", desc: ""};
        
        this.address_note = data.address_note ? data.address_note : "";
        this.start_date = data.start_date ? data.start_date : this.getDate();
        this.end_date = data.end_date ? data.end_date : "2099-12-31Z";
       
        
        this.address_type = (data.address_type && data.address_note!="User Address Type: Adresa pro korespondenci") ? data.address_type : [{value:"alternative", desc:"Alternative"}];
        
    }
    
    getDate(date: Date = new Date()){
        //let date = new Date();
        let m = date.getMonth().toString().length==2 ? date.getMonth() : "0"+date.getMonth();
        let d = date.getDate().toString().length==2 ? date.getDate() : "0"+date.getDate();
        let str : string = date.getFullYear()+"-"+m+"-"+d+"Z";

        return str;
    }
    
    toHtml(){
        let result = this.line1 + "<br/>" + this.line2 + "</br>" + this.line4 + "<br/>" + this.postal_code;
        return result;
    }
    
}

export class Email extends Contact{
    email_address : string;
    description : string;
    email_type : ValDesc[];
    
    constructor(data){
        super(data);
        this.email_address = data.email_address ? data.email_address : "";
    this.description = data.description ? data.description : "";
    this.email_type = data.email_types ? data.email_types:  [{value:"personal", desc:"Osobní"}];
    }
    
    toHtml(){
        return this.email_address;
    }
}

export class Phone extends Contact{
    phone_number : string;
    phone_type : ValDesc[];
    
    constructor(data){
        super(data);
         this.phone_number = data.phone_number ? data.phone_number : "";
         this.phone_type = data.phone_types ? data.phone_types:  [{value:"mobile", desc:"Mobil"}];
    }
    
       toHtml(){
        return this.phone_number;
    }
    
}