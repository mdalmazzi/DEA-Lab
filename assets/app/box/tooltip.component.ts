import {
    Component, Input
} from "@angular/core";
import {Box} from "./box.model";
import {BoxService} from "./box.service";
import {BoxComponent} from "./box.component"


@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html'
})

export class TooltipComponent  {
    @Input() box: Box;
    @Input() index_box_tooltip

    alert_visibility: boolean = false;
    alertTesto = 'Vuoi davvero cancellare questo box?';

 

    constructor(public boxService: BoxService) {
        this.boxService.alert_visibilityTooltip[this.index_box_tooltip] = false
        
    }

    cursor = 'default';

    changeCursorIn() {
        
        this.cursor = 'pointer'
    }

    changeCursorOut() {
       
        this.cursor = 'default'
    }

    alert_Visibility_Tooltip() {
        //this.alert_visibility = !this.alert_visibility;
      
        this.boxService.alert_visibilityTooltip[this.index_box_tooltip] = !this.boxService.alert_visibilityTooltip[this.index_box_tooltip];
        this.alert_visibility = this.boxService.alert_visibilityTooltip[this.index_box_tooltip]
    }

    settaColor(color: string) {
        
        this.box.color = '#' + color;

        this.boxService.updateBox(this.box, this.box.numero_mappa)
        .subscribe(
            result => console.log(result)

        )     
    }

    updateBoxAfter(box: Box) {
    
        this.boxService.updateBox(box, this.box.numero_mappa)
        .subscribe(
          //  result => console.log(result)
        )
      
    }

    onDelete() {

        /* var index = this.boxService.get_Box(this.box.boxId);
        var level = this.boxService.get_Box(this.box.boxId);
        var flag = true; */

       /// Questo tolto
        this.alert_Visibility_Tooltip();


        //console.log('alert_visibility: ', this.alert_visibility)
        
        /* this.boxService.deleteBox(this.box)
            .subscribe(
              
                result => {
                              
                    if (this.boxService.get_Boxlength()>1) {
                        let Update = this.boxService.updateLevelBox(index, level);
    
                        for (var i=Update[0]; i<=Update[1]; i++) {
                            this.updateBoxAfter(this.boxService.get_Boxbyindex(i))
                          
                            }
                        }
                    }
                );  */    
        } 
    }