import {
    Component, EventEmitter, Input, Output
} from "@angular/core";

import {ScalettaService} from "./scaletta.service";
import {Box} from "../box/box.model";



@Component({
  selector: 'app-alert-example-scaletta',
  templateUrl: './alertExampleScaletta.component.html'
})

export class AlertComponentExampleScaletta  {
    @Input() alert_testo_example: String;
    @Input() box: Box;
    @Output() alertVisibilityExampleScaletta = new EventEmitter<any>();
    
    constructor(private boxService: ScalettaService) {
        this.alertVisibilityExampleScaletta.emit();
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
        this.alertVisibilityExampleScaletta.emit();
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