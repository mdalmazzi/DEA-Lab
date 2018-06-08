import {
    Component, EventEmitter, Input, Output
} from "@angular/core";

import {TestoService} from "./testo.service";
import {Box} from "../box/box.model";



@Component({
  selector: 'app-alert-example-testo',
  templateUrl: './alertExampleTesto.component.html'
})

export class AlertComponentExampleTesto  {
    @Input() alert_testo_example: String;
    @Input() box: Box;
    @Output() alertVisibilityExampleTesto = new EventEmitter<any>();
    
    constructor(private boxService: TestoService) {
        this.alertVisibilityExampleTesto.emit();
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
        this.alertVisibilityExampleTesto.emit();
    }

    noAlert() {
        this.chiudiAlert();
    }

    siAlert() {

        this.boxService.updateBox(this.box, this.box.numero_mappa)
            .subscribe((result)=> {
                this.chiudiAlert();
            })
        
        
    }
    
}