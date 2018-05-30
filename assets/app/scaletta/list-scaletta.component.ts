import {Component, OnInit} from "@angular/core";
import { ActivatedRoute} from "@angular/router";

//import {ArraySortPipe} from "./scaletta.pipe";

import {Box} from "../box/box.model";
import {ScalettaService} from "./scaletta.service";


@Component({
    selector: 'app-scaletta-list',
    templateUrl: './list-scaletta.component.html',
    

})
export class ListScalettaComponent implements OnInit {
    boxes: Box[] = [];
    number_boxes: number;
    id_mappa: number;
    visibility: boolean[] = [];
   

    constructor(private route: ActivatedRoute, private boxService: ScalettaService) {
        this.route.params.subscribe (
            params => {
                console.log( params);
                this.id_mappa = +params['id'];
            }
        )

    }

    open_scaletta(event) {
        console.log('visibility', event)
        this.visibility[event[1]] = event[0];
        //return event
        
    }


    ngOnInit(){
        this.boxService.getBoxes(this.id_mappa)
            .subscribe(
                (boxes: Box[]) => {
                    this.boxes = boxes;
                    this.number_boxes = this.boxes.length;
                    this.boxService.editTitolo(this.boxes[0]);
                    result => console.log(result, 'Scaletta')
                }
            );

           for (var _i: any = 1; _i < this.boxService.boxes.length; _i++)
           {
                this.visibility[_i] = false;
           }
         }

    onSubmit_4() {
        
         let num = this.boxService.get_Boxlength()+1;
         
         const box = new Box('Content Box', 'Testo Box', 'Carlo', 0, {top: 0, bottom: 0, left: 0, right: 0, height: 80, width: 200}, false, this.id_mappa);

         box.color = '#B4B4B4';
         //box.order = num.toString()
         box.order = num;
        
         this.boxService.addBox(box)
                 .subscribe(
                     data => console.log(data),
                     error => console.error(error)
                 );
                 this.number_boxes = this.boxes.length;
        
         //       form.resetForm();
     }


}
