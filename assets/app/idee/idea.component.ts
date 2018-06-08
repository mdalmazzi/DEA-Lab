import {Component, ElementRef, ViewEncapsulation, EventEmitter, Input, AfterViewInit, OnInit, Output, HostListener} from '@angular/core';
import { ViewChild } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router} from "@angular/router";
import {Observable} from "rxjs/Observable";

import {TruncatePipe} from './truncate';


import {Box} from "../box/box.model";

import {IdeaService} from "./idea.service";
import { ActivatedRoute} from "@angular/router";


@Component({
    selector: 'app-idea',
    templateUrl: './idea.component.html',
    styles: ['./idea.component.css'],
    encapsulation: ViewEncapsulation.None

})
export class IdeaComponent implements  OnInit{
    @Input() box: Box;
    @Input() number_idea: number;
    @Output() onDirection_up = new EventEmitter<[string, Box]>();
    drag_Axis_X: boolean[] = [];
    index_boxesOwn: number = 0;
    flag: boolean = false;
    @Input()flag_move;
    max_right: number = 0;
    max_left: number = 0;
    
    alert_visibility: boolean = false;
    alertTesto = 'Al titolo deve sempre seguire un\'idea, non puoi cancellare questa idea.';

    alert_visibility_example: boolean = false;
    alertTestoExample = 'Per modificare questo esempio devi prima copiarlo nella tua area personale. Vuoi procedere alla copia?';
    
    private focusvalue: boolean = false;

    private exampleIdee: number = 164;
  
    // used for Quill
    public editor;
    public editorContent;
    public editorOptions = {
      theme: 'bubble',
      placeholder: "Scrivi qui l'idea...",
      bounds: '#editor-container' + this.number_idea,
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

  
    direction_move: string;
    public placeholderVar = 'Inserisci il testo qui';

    id_mappa: number;

    constructor(private router: Router, private _fb:FormBuilder, private route: ActivatedRoute, private boxService: IdeaService) {
        //this.livello = 0;
        
        this.route.params.subscribe (
            params => {
                console.log('param: ', +params['id']);
                this.id_mappa = +params['id'];

               
                
            }
        )     
    }
/* 
    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: any) {
        
        console.log(event)
    } */
    alert_Visibility() {
        this.alert_visibility = !this.alert_visibility;
    }

    alert_VisibilityExample() {
        this.alert_visibility_example = !this.alert_visibility_example;
    }

    ngOnInit() {

        console.log('Init IDEE');

        if (this.number_idea == 1) 
        { 
            this.editorOptions.bounds = '#document.body';           
        }
        else
        {
            this.editorOptions.bounds = "#editor-container" + this.number_idea;
        }     
        
        if (this.box.titolo && (this.box.numero_mappa == this.id_mappa)) {
            
            this.boxService.editTitolo(this.box);
            // Nice but inutile
            if (!this.flag) {
                this.boxService.getBoxesOwn(this.id_mappa);
                this.index_boxesOwn = this.boxService.index_boxesOwn;
        
                for (var i=0; i<(this.boxService.boxesOwn.length); i++) {
                 this.drag_Axis_X.push(true);
                 }
                 
                 this.drag_Axis_X[1] = false;
                 this.flag = true;
                 // Nice but inutile
            }             
        }

        this.boxService.get_titolo(this.id_mappa);
        this.direction_move = '';  

        if ((this.number_idea - this.boxService.index_boxesOwn) == 1) {
            this.flag_move = !this.flag_move
        }   


        if (this.box.content != 'Content Box') {
            setTimeout(() => {
                this.editorContent = this.box.content;
          
              }, 50)
    
        }

        // this.editorContent = this.box.content;
            
        if (this.box.stato > 1) {
           
        } else if (!this.box.stato) {
            this.box.stato = 1
        }

        if (this.id_mappa != this.exampleIdee) {
            
            this.boxService.updateBox(this.box, this.box.numero_mappa)
                .subscribe(
                    
                    result => console.log('Update: ',result)
                );
        }
         
     }


    onEdit() {
       
        this.boxService.editBox(this.box);
    }

    onDeleteNO(event) {
        //console.log('Ciao', event )
    }

    onDelete() {

        
        if (this.id_mappa == this.exampleIdee) {

            
           
            this.alert_visibility_example = true;
            return
           
                  
            // procedura per copia esempio 

        } else {
        
        
            if (this.boxService.boxes.indexOf(this.box)== 1 && this.box.livello == 0) {
               
                this.alert_visibility = true;
                return
                }
                this.alertTesto = 'Sei sicuro di voler cancellare questa idea?'
                this.alert_visibility = true;
           

        }
    }

    belongsToUser() {
        if (this.box.numero_mappa == this.exampleIdee) {
        // if (this.id_mappa == this.exampleIdee) {
            return true;
        }
        return localStorage.getItem('userId') ==  this.box.userId;
        

    }

    belongsToMappa() {
        return (this.boxService.get_titolo(this.box.numero_mappa) == this.number_idea);

    }

    onStarted($event) {
    
        if (this.box.content == this.boxService.boxes[1].content) 
        
            {
                this.flag_move = false;
                return
            }
    }

    onDirection(event: any) {
       
       //era 3
        if (event>0 && (this.box.livello)<2) {
            if (this.boxService.boxesOwn[1].boxId == this.box.boxId) {
           
            //          
            } else  {
                
                this.box.livello = this.box.livello + 1;
                
                this.direction_move = 'right';
              //  
            }
        }
        else
         
        if (event<0 && (this.box.livello)>=1) {
            if (this.boxService.boxesOwn[1].boxId == this.box.boxId) {
               //   Sono il primo, ma perchè boxesOwn?
            // 
                
            } else {
                this.box.livello = this.box.livello - 1;
                //this.onDirection_up.emit(['left', this.box]);
                
            }
        };
        // era 3
        if (event>0 && (this.box.livello == 2 && this.max_right != 1))  {
            this.max_right = 1         
        }
        else {
            this.max_right = 0     
        }

        if (event && (this.box.livello == 0 && this.max_left != 1)) {
           
            this.max_left = 1;   
  
        }
        else {
            
            this.max_left = 0;
               
        }
       
            this.onSubmit_3();
       
        
 
    }

    onupdateMappa(box) {
        
  
        this.boxService.updateBox(box, this.id_mappa)
         .subscribe(
             
             result => {
                 console.log(result);
            
             }
             
         );      
     }

    onSubmit_3() {
       
          if (this.box) {
            //edit

            if (this.id_mappa == this.exampleIdee) {
                
                this.editor.blur();
                this.alert_visibility_example = true;
                
                return
            }       

        } else {
           
           let num = this.boxService.get_Boxlength() + 1;
           
            const box = new Box('Box  Mappa', 'Testo Box', 'Massimo',0, {top: 0, bottom: 0, left: 0, right: 0, height: 80, width: 200}, false, 1);
            
            box.color = '#B4B4B4';
            //box.order = num.toString()
            box.order = num;
            
               this.boxService.addBox(box)
                .subscribe(
                    // data => console.log(data),
                    // error => console.error(error)
                );
        }
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
 
      }
    
    //  onContentChanged({ quill, html, text }) {
      onContentChanged(event) {
        
      
          if (event.text.length != 1)
          {
            this.box.content = event.html ;
            
             if (this.id_mappa != this.exampleIdee) {
            // if (this.box.numero_mappa != this.exampleIdee) {
                this.onupdateMappa(this.box);
                }
           
            }
          }
}