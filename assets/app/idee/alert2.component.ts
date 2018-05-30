import {
    Component, EventEmitter, Input, Output
} from "@angular/core";

import {IdeaService} from "./idea.service";
import {Box} from "../box/box.model";



@Component({
  selector: 'app-alert2',
  templateUrl: './alert2.component.html'
})

export class AlertComponent2  {
    @Input() alert_testo: String;
    @Input() box: Box;
    @Output() alertVisibility = new EventEmitter<any>();
    
    constructor(private boxService: IdeaService) {
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

    siAlert() {
        
        this.boxService.deleteBox(this.box)
            
            .subscribe(
                result => 
                {
                    console.log(result);
                    this.chiudiAlert();
                }
            );
        
    }
    
}