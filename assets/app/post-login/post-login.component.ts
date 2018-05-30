
import {Component, Input, Output, OnInit} from '@angular/core';


import {PostLoginService} from './post-login.service';
import {Box} from "../box/box.model";


@Component({
    selector: 'app-postlogin',
    templateUrl: './post-login.component.html',
    styleUrls: ['./post-login.component.css']
})
export class PostLoginComponent implements  OnInit {
    constructor(private boxService: PostLoginService) {}

    stato: string;
    naviga: string;
    @Input() box: Box;
    @Input() byfour: Box;
    @Input() numero_mappa: number;
    @Output() out_numero_mappa: number;
   

  /*   alertTesto = 'Vuoi cancellare questa mappa, danne conferma?';

    alert_visibility: Boolean = false;

    alert_Visibility() {
        this.boxService.alert_visibility = !this.boxService.alert_visibility;
        this.alert_visibility = this.boxService.alert_visibility
    } */
    cursor = 'default';

    changeCursorIn() {
        
        this.cursor = 'pointer'
    }

    changeCursorOut() {
       
        this.cursor = 'default'
    }

    ngOnInit() {


        if (localStorage.getItem('userId') ==  this.box.userId) {
            this.boxService.editTitolo(this.box)
        }
        this.box.content = this.box.content.replace(/<(?:.|\n)*?>/gm, '');

       // console.log('post login', this.box)
        if (this.box.stato == 1)
        {
            this.stato = 'idee';
            this.naviga = 'idee'
        }

        if (this.box.stato == 2)
        {
            this.stato = 'mappa';
            this.naviga = 'boxes'
        }

        if (this.box.stato == 3)
        {
            this.stato = 'scaletta'
            this.naviga = 'scaletta'
        }
        if (this.box.stato == 4)
        {
            this.stato = 'testo';
            this.naviga = 'testo'
        }
        //console.log(this.stato)
        
      }

    belongsToUser() {
        return localStorage.getItem('userId') ==  this.box.userId;

    }

    ondeleteMappa(box) {
       
        this.boxService.deleteMappa(box)
        .subscribe(
            result => console.log(result)
        );      
    }

  
    callDeleteMappa() {
        
        this.boxService.numero_mappa = this.box.numero_mappa;

        this.boxService.alert_visibility = true;
        //this.boxService.numero_mappa = this.numero_mappa;

        
        console.log('this.boxService.alert_visibility')

        /* this.boxService.arrayCountMappa(this.box.numero_mappa);
         
        while(this.boxService.indexBoxes.length) {
            let index = this.boxService.indexBoxes.pop();
            
            this.ondeleteMappa(this.boxService.boxes[index]);
            this.boxService.boxes.splice(index, 1);
            
        }    */   
    }

    onSubmit_3() {
      
        
         if (this.box) {
             //edit
             //     this.box.content = form.value.content;
             this.boxService.updateBox(this.box)
                 .subscribe(
                     result => console.log(result)
 
                 );
             //        this.box = null;
 
 
         } else {
          
            let num = this.boxService.get_Boxlength()+1;
            console.log(num);
 
             const box = new Box('Box  Mappa', 'Testo Box', 'Massimo',0, {top: 0, bottom: 0, left: 0, right: 0, height: 80, width: 200}, false, 1);
             box.color = '#B4B4B4';
             //box.order = num.toString();
             box.order = num;
                this.boxService.addBox(box)
                 .subscribe(
                     data => console.log(data),
                     error => console.error(error)
                 );
         }
 
         //       form.resetForm();
     }

    onupdateMappa(box) {
        
         this.boxService.updateBox(box)
         .subscribe(
             result => console.log(result)
         );      
     }
  
}