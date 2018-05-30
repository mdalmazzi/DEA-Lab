import {Component, ElementRef, EventEmitter, Input, AfterViewInit, OnInit, Output} from '@angular/core';
import { ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';


import {Box} from "../box/box.model";

import {TestoService} from "./testo.service";
import { ActivatedRoute} from "@angular/router";


@Component({
    selector: 'app-quill',
    templateUrl: './quill.component.html',
    styles: ['./quill.component.css'],
    encapsulation: ViewEncapsulation.None

})
export class QuillComponent implements  OnInit{
    @Input() box: Box;
      
    boxes: Box[];
    private focusvalue: boolean = false;
  
    // used for Quill
    public editor;
    public editorContent;
    public editorOptions = {
      //theme: 'bubble',
      placeholder: "Scrivi qui l'idea...",
      modules: {
        toolbar: [
        //  ['bold', 'italic', 'underline', 'strike'],
          ['bold', 'italic', 'underline'],
       //   [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['clean']
        ]
      }
    };
    // used for Quill

    public placeholderVar = 'Inserisci il testo qui';

    id_mappa: number;

    constructor(private _fb:FormBuilder, private route: ActivatedRoute, private boxService: TestoService) {
        //this.livello = 0;
        
        this.route.params.subscribe (
            params => {
                //console.log(params);
                this.id_mappa = +params['id'];
            }
        )     
    }

     ngAfterViewInit() {
        
       
        if (this.box.content != 'Content Box') {
            setTimeout(() => {
                this.editorContent = this.box.content + this.box.testo;
            
                // this.editor.disable();
              }, 50)  
        }
        
      } 

    ngOnInit() {
       
     
     }

    onEdit() {
        // this.editClicked.emit('Un nuovo Box');
        this.boxService.editBox(this.box);
    }

    onDelete() {
        this.boxService.deleteBox(this.box)
            .subscribe(
                result => console.log(result)
            );
    }

    belongsToUser() {
        return localStorage.getItem('userId') ==  this.box.userId;

    }

   

    
        
    

   

    //Aggiunti for Quill
    onEditorBlured(quill) {
   //     console.log('editor blur!', quill);
      }
    
      onEditorFocused(quill) {
  //      console.log('editor focus!', quill);
      }
    
      onEditorCreated(quill) {
        this.editor = quill;
        quill.focus();
      //  this.focusvalue = true;
  //      console.log('quill is ready! this is current quill instance object', quill);
      }
    
    //  onContentChanged({ quill, html, text }) {
      onContentChanged(event) {
          console.log(event.text.length, 'event.text.length')
          if (event.text.length != 1)
          {
            this.boxService.boxes[1].content = event.html ;
        
     
        }
    
      }

}