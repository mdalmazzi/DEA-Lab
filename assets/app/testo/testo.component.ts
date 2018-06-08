import {Component, ElementRef, EventEmitter, Input, AfterViewInit, OnInit, Output, AfterContentInit} from '@angular/core';
import { ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router} from "@angular/router";
import {Box} from "../box/box.model";

import {TestoService} from "./testo.service";

import { ActivatedRoute} from "@angular/router";


@Component({
    selector: 'app-testo',
    templateUrl: './testo.component.html',
    styles: ['./testo.component.css'],
    
})
export class TestoComponent implements  OnInit, AfterContentInit{
    
    boxes: Box[] = [];
    index_titolo;

    first_Time: boolean = false;

    alert_visibility_example_testo: boolean = false;
    alertTestoExample = 'Per modificare questo esempio devi prima copiarlo nella tua area personale. Vuoi procedere alla copia?';

    // used for Quill
    public editor;
    public editorContent = '';
    public editorOptions = {
      placeholder: "Scrivi qui...",
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['clean']
        ]
      }
    };
    // used for Quill
   
    
    id_mappa: number;

    constructor( private router: Router, private route: ActivatedRoute,  private boxService: TestoService) {
        
        this.route.params.subscribe (
            params => {
               
                this.id_mappa = +params['id'];

                this.boxService.getBoxes(this.id_mappa)
                    .subscribe(
                    (boxes: Box[]) => {
                        this.boxes = boxes;
                        
                        result => console.log(result, 'testo');
                        console.log(this.id_mappa, this.boxes[0].numero_mappa);
                    }
                );

                
            }
        )     
    }


    ngOnInit() {
     
        // Forse un po' ridondante lettura boxes messa anche su constructor per copia esempi

        this.editorContent = '';
        this.boxService.getBoxes(this.id_mappa).subscribe(
            (boxes: Box[]) => {
                this.boxes = boxes;
             
                //per Titolo header
                this.boxService.editTitolo(this.boxService.boxes[this.boxService.get_titolo()]);
              

                 this.index_titolo = this.boxService.get_titolo();
                
                 if (this.boxes[this.index_titolo].stato < 4) {
                    this.boxes[this.index_titolo].stato = 4;
                    this.boxService.updateBox(this.boxes[this.index_titolo], this.id_mappa)
                    .subscribe(
                        //result => console.log(result)

                    )
                }
                // Ormai inutile ma vediamo un attimo
                if (this.boxes[this.index_titolo].testo_mappa) {
                        this.editorContent = this.boxes[this.index_titolo].testo_mappa;
                    
                    if (this.boxes[this.index_titolo].stato < 4) {
                        this.boxes[this.index_titolo].stato = 4;
                    }
                }
                else
                {
                    
                    this.editorContent =  this.boxes[this.index_titolo].content;
 
                    for (var i=0; i<(this.boxes.length); i++) 
                        {
                            if ((this.boxes[i].content == 'Intestazione') || (this.boxes[i].content == '<p>Intestazione</p>')){

                                if (this.boxes[i].testo != 'Testo Box' && this.boxes[i].testo)  {

                                    this.editorContent = this.editorContent + this.boxes[i].content + this.boxes[i].testo;

                                } else if (this.boxes[i].content) {
                                    this.editorContent = this.editorContent + this.boxes[i].content;
                                }
                            }
                        }
                   
                    for (var i=0; i<(this.boxes.length); i++) 
                        {
                      
                       if ((this.boxes[i].content != 'Intestazione') && (this.boxes[i].content != '<p>Intestazione</p>') &&(this.boxes[i].content != 'Conclusione') && (this.boxes[i].content != '<p>Conclusione</p>') && (!this.boxes[i].titolo)) 
                            {

                                if (this.boxes[i].testo != 'Testo Box' && this.boxes[i].testo) {
                                
                                this.editorContent = this.editorContent + this.boxes[i].content + this.boxes[i].testo;
                                }
                                else  if (this.boxes[i].content)
                                {
                                    this.editorContent = this.editorContent + this.boxes[i].content;
                                }
                            }
                        }
                       
                    }


                    for (var i=0; i<(this.boxes.length); i++) 
                        {
                            if ((this.boxes[i].content == 'Conclusione') || (this.boxes[i].content == '<p>Conclusione</p>')){

                                if (this.boxes[i].testo != 'Testo Box' && this.boxes[i].testo) {
                                this.editorContent = this.editorContent + this.boxes[i].content + this.boxes[i].testo;
                                } else if (this.boxes[i].content) {
                                    this.editorContent = this.editorContent + this.boxes[i].content;
                                }
                            }
                        }           
                    }
                );                    
     }

     ngAfterContentInit() {

     }
    
     alert_VisibilityExampleTesto() {
        this.alert_visibility_example_testo = !this.alert_visibility_example_testo;
}

    onupdateMappa(box) {
        
        if (this.boxes[this.index_titolo].numero_mappa != 170) {
            this.boxService.updateBox(box, this.id_mappa)
             .subscribe(
                 result => console.log(result)
         );   
        } else {
           
               
                this.editor.blur();
                this.alert_visibility_example_testo = true;
                
                return
           
        }
            
     }

     onCreaMappa(boxes, box) {

       
        let userId = localStorage.getItem('userId');
       
        this.boxService.getLastMapNumberCopia()
            .subscribe(
          
            (last_numero_mappa: any) => {
                //let box_example = boxes.concat(this.boxes_intro);
               
                this.boxes.forEach((box) => {
                   
                const box_copy = new Box('','',''); 
                      
                if (!box.intestazione) {
                        
                    box_copy.content = box.content;                
                    box_copy.testo = box.testo;    
                    box_copy.username = box.username;                 
                    box_copy.livello = box.livello;
                    box_copy.rectangle = box.rectangle;
                    box_copy.titolo = box.titolo ;
                    box_copy.numero_mappa = last_numero_mappa + 1;
                    box_copy.userId = userId;
                    box_copy.color = box.color;
                    box_copy.order = box.order;
                    box_copy.inMap = false;
                    box_copy.stato = box.stato;               
                    box_copy.intestazione = box.intestazione
                    box_copy.testo_mappa = box.testo_mappa
                    }
                      else 
                    {
                        box_copy.content = box.content;
                        box_copy.testo = box.testo;
                        box_copy.username = box.username;      
                        box_copy.numero_mappa = box.numero_mappa;
                        // this.boxId = boxId;
                        box_copy.userId = userId;
                        box_copy.intestazione = box.intestazione;
                      }

     
                      this.boxService.addBox(box_copy)
                           .subscribe(
                            data => console.log(data),
                            error => console.error(error)
                            ); 
   
                          });
                          this.boxService.getBoxes(last_numero_mappa + 1)
                          .subscribe(
                              (boxes: Box[]) => {
                                  this.boxes = boxes;
                                  
                                  this.router.navigate(['testo/'+ (last_numero_mappa + 1)]);
                                  }
                              );
                              
                      box.numero_mappa = last_numero_mappa + 1;
                      box.userId = userId;
                      
                      return box
            });            
     }

    //Aggiunti for Quill
        onEditorBlured(quill) {
   //     console.log('editor blur!', quill);
      }
    
      onEditorFocused(quill) {
  //      console.log('editor focus!', quill);
      if (this.id_mappa == 170) {

          this.editor.blur();
          this.alert_visibility_example_testo = true;
  
          return
      }

      }
    
      onEditorCreated(quill) {
          
        this.editor = quill;
        // quill.focus();
   
      }
    
    //  onContentChanged({ quill, html, text }) {
      onContentChanged(event) {
          if (this.first_Time) {
            if (event.text.length != 1)
                  {
                //this.box.content = event.html ;
                        // console.log('this.first_Time', this.first_Time, this.index_titolo);
                       
                        this.boxes[this.index_titolo].stato = 4;
                        this.boxes[this.index_titolo].testo_mappa = event.html;
                        this.onupdateMappa(this.boxes[this.index_titolo]);
                        
                        
                    }
                
                } 
                else { 
                    this.first_Time = !this.first_Time
                }
                // console.log('this.first_Time', this.first_Time); 
            }
            


}