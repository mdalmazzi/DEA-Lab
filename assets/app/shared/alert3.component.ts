import {
    Component, EventEmitter, Input, Output
} from "@angular/core";
import {Box} from "../box/box.model";
import {BoxService} from "../box//box.service";

import {PostLoginService} from "../post-login/post-login.service";
import { ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-alert3',
  templateUrl: './alert3.component.html'
})

export class AlertComponent3  {
    @Input() box: Box;
    @Output() alertVisibility = new EventEmitter<any>();
    
    @Input() alert_testo: String;
    boxes: Box[] = [null];

    constructor(public router: Router, private boxService: BoxService, private postService: PostLoginService) {
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

        if (this.alert_testo == 'Sei sicuro di voler creare un nuovo documento?') 
        { 
            
            this.onNavigate_Home();
            this.postService.getLastMapNumber()
            .subscribe(
            (boxes: Box[]) => {
                this.boxes = boxes;
              
         
                const box = new Box(' ', 'inserisci il testo...',  'Massimo', 0, {top: 500, bottom: 0, left: window.innerWidth/2 - 100, right: 0, height: 80, width: 200}, true, this.boxService.last_numero_mappa + 1); 
               
             
               box.order = 0;
              
               box.testo = 'inserisci il testo...';
               box.username = 'Massimo';
               box.livello = 0;
               box.titolo = true;
               box.numero_mappa = this.postService.last_numero_mappa + 1;
       
               
               box.color = '#B4B4B4';
               box.inMap = false;
           
       
               this.postService.addBox(box)
                   .subscribe(
                       data => 
                       {
                           
                           this.box = box;
                           
                           this.router.navigate(['idee/'+ this.box.numero_mappa]);
                       },
                       error => console.error(error)
                   );
                
            }
        ); 
        } 
        else
        {
            this.postService.getBoxes()
            .subscribe(
                (boxes: Box[]) => {
                 this.onNavigate_Home()    
                 this.postService.boxes = boxes.reverse();

                 this.postService.arrayCountMappa(this.box.numero_mappa);
            
                console.log('Lunghezza Boxes: ', this.postService.indexBoxes.length, this.postService.indexBoxes.length);
            
                while(this.postService.indexBoxes.length) {
           
                    let index = this.postService.indexBoxes.pop();
            
                    this.ondeleteMappa(this.postService.boxes[index]);
                    this.postService.boxes.splice(index, 1);
            
                } 
                    
                }
            ); 

            
        }
        //this.chiudiAlert();
    }
    
    ondeleteMappa(box) {
       
        this.postService.deleteMappa(box)
        .subscribe(
            
            result => 
            {
                console.log(result, 'delete box');
                this.chiudiAlert();
                
                
            }
        );           
    }

    onNavigate_Home() {

       
         this.router.navigate(['home/' + this.box.userId]);
     }
    
    
}