export interface ValDesc{ //the interface for address.country and address.type[]
    value: string;
    desc: string;
}

export class Address{ // address class, can be used to set defult values
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
    preferred: boolean;
    segment_type: string;
    
    address_type: ValDesc[];
 
    constructor(data){
      
      this.line1 = data.line1 ? data.line1 : "";
         this.line2 = data.line2 ? data.line2 : "";
         this.line3 = data.line3 ? data.line3 : "";
         this.line4 =  "Česká republika";
        
         this.city = data.city ? data.city : "";
         this.state_province = data.state_province ? data.state_province : "";
         this.postal_code = data.postal_code ? data.postal_code : "";
        
       this.country = data.country ? <ValDesc>data.country : {value:"", desc: ""};
        
        this.address_note = data.address_note ? data.address_note : "";
        this.start_date = data.start_date ? data.start_date : this.getDate();
        this.end_date = data.end_date ? data.end_date : "2099-12-31Z";
        this.preferred =  true;
        this.segment_type = data.segment_type ? data.segment_type : "External";
        
        this.address_type = [{value:"home", desc:"Home"}];
        
    }
    
    getDate(){
        let date = new Date();
        let m = date.getMonth().toString().length==2 ? date.getMonth() : "0"+date.getMonth();
        let d = date.getDate().toString().length==2 ? date.getDate() : "0"+date.getDate();
        let str : string = date.getFullYear()+"-"+m+"-"+d+"Z";

        return str;
    }
    
}