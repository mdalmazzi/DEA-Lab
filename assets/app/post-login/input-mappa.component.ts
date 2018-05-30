import {Component, OnInit} from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router} from "@angular/router";

import {PostLoginService} from "./post-login.service";
import {Box} from "../box/box.model";
import { last } from "@angular/router/src/utils/collection";


@Component({
    selector: 'app-input-mappa',
    templateUrl: './input-mappa.component.html',
    styleUrls: ['./input-mappa.component.css']

})
export class InputMappaComponent implements OnInit {
    box: Box;
    boxes;// mah vediamo
    last_numero_mappa:number;

    constructor(private router: Router, private boxService: PostLoginService) {}

    cursor = 'default';

    changeCursorIn() {
        
        this.cursor = 'pointer'
    }

    changeCursorOut() {
       
        this.cursor = 'default'
    }

    onCreaMappa() {
       // let last_mappa =  this.boxService.getLastMapNumber();
       
       //this.boxService.getLastMapNumber();
       //console.log('CreaMappa 1')

       this.boxService.getLastMapNumber()
       .subscribe(
          // (boxes: Box[]) => {
            (last_numero_mappa: any) => {
          //  (number_map: Number) => {
             //  this.boxes = boxes;
             //  console.log('Crea next mappa', number_map);
              // console.log(this.boxService.last_numero_mappa, 'last_mappa')

           /*   const box = new Box(' ', ' ',  ' ', 0, {top: 500, bottom: 0, left: window.innerWidth/2 - 100, right: 0, height: 80, width: 200}, true, this.boxService.last_numero_mappa + 1);  */
             const box = new Box(' ', ' ',  ' ', 0, {top: 550, bottom: 0, left: window.innerWidth/3, right: 0, height: 80, width: 200}, true, last_numero_mappa + 1); 
        
               /* const box = new Box('Inserisci il titolo ...', 'inserisci il testo...',  'Massimo', 0, {top: 500, bottom: 0, left: window.innerWidth/2 - 100, right: 0, height: 80, width: 200}, true, this.boxService.last_numero_mappa + 1);  */
              
             box.color = '#f0f0f0';
              box.order = 0;
              //box.boxId = localStorage.getItem('userId')
              //box.numero_mappa = last_mappa + 1;
      
              box.stato = 1
              box.content = ' ';
              box.testo = ' ';
              box.username = ' ';
              box.livello = 0;
              box.titolo = true;
              //box.numero_mappa = this.boxService.last_numero_mappa + 1;
              box.numero_mappa = last_numero_mappa + 1;
              //box.intestazione = false
              
      
             /*  this.box.rectangle.left = array_pos[(2*this.num)-2];
              this.box.rectangle.top = array_pos[(2*this.num)-1]; */
             
              
        /*       box.color = '#f0f0f0'; */
              box.inMap = false;
              //box.stato = 1
              
              //this.box.order = this.num.toString();
             // this.box.order = this.num;
              //console.log('Crea Mappa 2')
              this.boxService.addBox(box)
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

    onSubmit(form: NgForm) {
        let last_mappa =  this.boxService.getLastMapNumber();

        if (this.box) {
            //edit
            this.box.content = form.value.content;
            this.boxService.updateBox(this.box)
                .subscribe(
                    result => console.log(result)

                );
            this.box = null;


        } else {
            // create
            

           /*  const box = new Box(form.value.content, 'Testo Box',  'Massimo', 0, {top: 0, bottom: 0, left: 0, right: 0, height: 80, width: 200}, true, last_mappa + 1, '#B4B4B4', '0');
            this.boxService.addBox(box)
                .subscribe(
                    data => console.log(data),
                    error => console.error(error)
                ); */
        }

        form.resetForm();
    }

    onClear(form: NgForm) {
        this.box = null;
        form.resetForm();
    }

    ngOnInit() {

    // Meglio su titolo? Capire se serve
      // this.boxService.boxisedit.subscribe(
        this.boxService.titoloisedit.subscribe(
           (box: Box) => this.box = box
       )
       // console.log(this.box);
    }
}