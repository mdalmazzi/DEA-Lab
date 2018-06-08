import {
    Component, EventEmitter, Input, Output
} from "@angular/core";

import {BoxService} from "./box.service";
import {Box} from "../box/box.model";



@Component({
  selector: 'app-alert-example-box',
  templateUrl: './alertExampleBox.component.html'
})

export class AlertComponentExampleBox  {

    @Input() alert_testo_example: String;
    @Input() box: Box;
    @Output() alertVisibilityExampleBox = new EventEmitter<any>();
    
    constructor(private boxService: BoxService) {
        this.alertVisibilityExampleBox.emit();
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
        this.alertVisibilityExampleBox.emit();
    }

    noAlert() {
        this.chiudiAlert();
    }

    siAlert() {

        this.boxService.updateBox(this.box, this.box.numero_mappa)
            .subscribe(()=> {
                this.chiudiAlert();
            })
        
        
    }
    
}