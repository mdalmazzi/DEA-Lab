import {
    Component, EventEmitter, Input, Output
} from "@angular/core";
import {Box} from "../box/box.model";
import {PostLoginService} from "./post-login.service";


@Component({
  selector: 'app-alert4',
  templateUrl: './alert4.component.html'
})

export class AlertComponent4  {
    //@Input() box: Box;
    @Input() numero_mappa;
    @Output() alertVisibility = new EventEmitter<any>();
    
    @Input() alert_testo: String;


    constructor(public boxService: PostLoginService) {
        this.alertVisibility.emit();
    }


    cursor = 'default';

    changeCursorIn() {
        
        this.cursor = 'pointer'
    }

    changeCursorOut() {
       
        this.cursor = 'default'
    }

    chiudiAlert() 
    {
        this.alertVisibility.emit();
    }

    noAlert() {
        this.chiudiAlert();
    }

    /* updateBoxAfter(box: Box) {
    
        this.boxService.updateBox(box)
        .subscribe(
          //  result => console.log(result)
        )
      
    } */

    siAlert() 
    {       
       // this.boxService.arrayCountMappa(this.box.numero_mappa);
       this.boxService.arrayCountMappa(this.boxService.numero_mappa);
        console.log('alert4', this.boxService.arrayCountMappa(this.boxService.numero_mappa))
         
        while(this.boxService.indexBoxes.length) {
            let index = this.boxService.indexBoxes.pop();
            
            this.ondeleteMappa(this.boxService.boxes[index]);
            this.boxService.boxes.splice(index, 1);
            
        } 
        this.chiudiAlert();
        //this.boxService.alert_visibility = false;
    }


    ondeleteMappa(box) {
       
        this.boxService.deleteMappa(box)
        .subscribe(
            result => console.log(result)
        );      
    }

}