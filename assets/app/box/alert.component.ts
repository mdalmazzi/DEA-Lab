import {
    Component, EventEmitter, Input, Output
} from "@angular/core";
import {Box} from "./box.model";
import {BoxService} from "./box.service";


@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html'
})

export class AlertComponent  {
    @Input() box: Box;
    @Output() alertVisibility = new EventEmitter<any>();
    
    @Input() alert_testo: String;


    constructor(private boxService: BoxService) {
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

    updateBoxAfter(box: Box) {
    
        this.boxService.updateBox(box)
        .subscribe(
          //  result => console.log(result)
        )
      
    }

    siAlert() {

        var index = this.boxService.get_Box(this.box.boxId);
        var level = this.boxService.get_Box(this.box.boxId);
        var flag = true;
        
        this.boxService.deleteBox(this.box)
            .subscribe(
              
                result => {
                              
                    if (this.boxService.get_Boxlength()>1) {
                        let Update = this.boxService.updateLevelBox(index, level);
    
                        for (var i=Update[0]; i<=Update[1]; i++) {
                            this.updateBoxAfter(this.boxService.get_Boxbyindex(i))
                          
                            }
                        }
                    }
                );
                //this.boxService.alert_visibilityTooltip[this.index_box_tooltip] = false;
    }
   
    
}