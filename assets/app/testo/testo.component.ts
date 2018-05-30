import {Component, ElementRef, EventEmitter, Input, AfterViewInit, OnInit, Output, AfterContentInit} from '@angular/core';
import { ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

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

    constructor( private route: ActivatedRoute,  private boxService: TestoService) {
        
        this.route.params.subscribe (
            params => {
               
                this.id_mappa = +params['id'];
            }
        )     
    }


    ngOnInit() {
     
        
        this.editorContent = '';
        this.boxService.getBoxes(this.id_mappa).subscribe(
            (boxes: Box[]) => {
                this.boxes = boxes;
                console.log('Testo: ', this.boxes)
                //per Titolo header
                this.boxService.editTitolo(this.boxService.boxes[this.boxService.get_titolo()]);
                //per Titolo header

               /*  for (var i=0; i<(this.boxes.length); i++) {
                    if (this.boxService.boxes[i].titolo) {
                        this.index_titolo = i;
                        //this.boxService.editTitolo(boxes[i])
                    }
                    
                } */

                 this.index_titolo = this.boxService.get_titolo();
                
                 if (this.boxes[this.index_titolo].stato < 4) {
                    this.boxes[this.index_titolo].stato = 4;
                    this.boxService.updateBox(this.boxes[this.index_titolo])
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

    onupdateMappa(box) {
        
         this.boxService.updateBox(box)
         .subscribe(
             result => console.log(result)
         );      
     }

    //Aggiunti for Quill
        onEditorBlured(quill) {
   //     console.log('editor blur!', quill);
      }
    
      onEditorFocused(quill) {
  //      console.log('editor focus!', quill);
      }
    
      onEditorCreated(quill) {
      
        quill.focus();
   
      }
    
    //  onContentChanged({ quill, html, text }) {
      onContentChanged(event) {
          if (this.first_Time) {
            if (event.text.length != 1)
                  {
                //this.box.content = event.html ;
                        console.log('this.first_Time', this.first_Time, this.index_titolo);
                        this.boxes[this.index_titolo].stato = 4;
                        this.boxes[this.index_titolo].testo_mappa = event.html;
                        this.onupdateMappa(this.boxes[this.index_titolo]);
                    }
                
                } 
                else { 
                    this.first_Time = !this.first_Time
                }
                console.log('this.first_Time', this.first_Time); 
            }
            


}