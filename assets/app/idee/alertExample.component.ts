import {
    Component, EventEmitter, Input, Output
} from "@angular/core";

import {IdeaService} from "./idea.service";
import {Box} from "../box/box.model";



@Component({
  selector: 'app-alert-example',
  templateUrl: './alertExample.component.html'
})

export class AlertComponentExample  {
    @Input() alert_testo_example: String;
    @Input() box: Box;
    @Output() alertVisibilityExample = new EventEmitter<any>();
    
    constructor(private boxService: IdeaService) {
        this.alertVisibilityExample.emit();
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
        this.alertVisibilityExample.emit();
    }

    noAlert() {
        this.chiudiAlert();
    }

    siAlert() {

        this.boxService.updateBox(this.box, this.box.numero_mappa)
            .subscribe(result => {
                this.chiudiAlert();
            })
        
        
    }
    
}