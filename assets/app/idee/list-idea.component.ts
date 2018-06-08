import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import { ActivatedRoute, Router} from "@angular/router";


import {Box} from "../box/box.model";
import {BoundingRectangle} from "../box/rectangle.model";
import {IdeaService} from "./idea.service";

@Component({
    selector: 'app--idee-list',
    templateUrl: './list-idea.component.html',
    styles: ['./list-idea.component.css']

})
export class ListIdeeComponent implements OnInit {
    public boxes: Box[] = [];
  
    direction_move: string;
    id_mappa: number;
    number_boxes: number;
    sign_boxes = [0,0,0,0,0];
    num: number;
    private box = <Box>{};
    private rectangle =<BoundingRectangle>{}; 

    private exampleIdee: number = 164;

    alert_visibility_example: boolean = false;
    alertTestoExample = 'Per modificare questo esempio devi prima copiarlo nella tua area personale. Vuoi procedere alla copia?';
    

    //@Output() editClicked = new EventEmitter<string>();

    constructor(public router: Router, private route: ActivatedRoute, private boxService: IdeaService) {

        this.route.params.subscribe (
            params => {
               // console.log( params);
                this.id_mappa = +params['id'];

                // Toglierlo da onInit

                this.boxService.getBoxes(this.id_mappa)
                    .subscribe(
                    (boxes: Box[]) => {
                        this.boxes = boxes;                   
                        this.number_boxes = this.boxes.length; 
                     });
               }
            )
        } 

 
    // Inutile
    settaLivello(event) {
        
        if (event[0] == 'left') {
            // console.log(event)
        } else {
            // console.log(event) 
        }
    }

   

    ngOnInit(){

        this.direction_move = '';
        
        // Toglierlo è già su constructor dopo modifiche per Example

        // this.boxService.getBoxes(this.id_mappa)
        //     .subscribe(
        //         (boxes: Box[]) => {
        //             this.boxes = boxes;
                    
        //             this.number_boxes = this.boxes.length;
        //             result => console.log(result, 'Idea');              
        //         }
        //     );
    }

    onNavigate_Boxes() {
        
        this.router.navigate(['boxes/'+ this.id_mappa]);
        
    }

    alert_VisibilityExample() {
        this.alert_visibility_example = !this.alert_visibility_example;
    }

    onSubmit_4() { 

        
        if ((this.id_mappa == this.exampleIdee)) {
            // alert('Per modificare devi copiare l\'esempio nella tua area di lavoro');
            // this.boxService.onCreaMappa(this.boxService.boxes, this.box); 
            this.alert_visibility_example = true;
            return
            // this.boxService.updateBox(this.boxes[0], this.id_mappa);    

            // procedura per copia esempio 

        } else { 

            this.num = this.boxService.get_Boxlength() + 1;
   
            this.box.content = 'Content Box';
            this.box.testo = 'Testo Box';
            this.box.username = 'Massimo';
            this.box.livello = 0;
            this.box.titolo = false;
            this.box.numero_mappa = this.id_mappa;
      
            this.rectangle.left = 999;
            this.rectangle.top = 999;
            this.rectangle.bottom = 0;
            this.rectangle.right = 0;
            this.rectangle.height = 46;
            this.rectangle.width = 115; 
            this.box.rectangle = this.rectangle;
        
            this.box.color = '#B4B4B4';
            //this.box.order = this.num.toString();
            this.box.order = this.num;
            this.box.inMap = false;
            this.box.stato = 1;
            this.box.intestazione = false

             this.boxService.addBox(this.box)
                .subscribe(
                    // data => console.log(data),
                    // error => console.error(error)
                );
                this.number_boxes = this.boxes.length;
       
            }
    }
       
        
}
