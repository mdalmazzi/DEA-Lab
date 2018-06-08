import {Component, Input, AfterViewInit, AfterViewChecked,OnInit, ElementRef,Renderer2, ViewChild} from '@angular/core';
import { ActivatedRoute} from "@angular/router";

import {Box} from "../box/box.model";
import {ScalettaService} from "./scaletta.service";



@Component({
    selector: 'app-intestazione',
    templateUrl: './intestazione.component.html'
   
})

export class IntestazioneComponent implements OnInit{
    
    id_mappa: number;
    @Input() content: string;
    box: Box;
    boxes: Box[];
    
    visible_status: boolean;

    alert_visibility_example_scaletta: boolean = false;
    alertTestoExample = 'Per modificare questo esempio devi prima copiarlo nella tua area personale. Vuoi procedere alla copia?';

    // used for Quill
    public editor;
    public editorContent;
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

    constructor(private renderer: Renderer2, private route: ActivatedRoute, private boxService: ScalettaService) {

        this.route.params.subscribe (
            params => {
                  this.id_mappa = +params['id'];
                  
                  this.boxService.getBoxesIntestazione(this.id_mappa)
                    .subscribe(
                        (boxes: Box[]) => {
                            this.boxes = boxes;
                
                        for (var i=0; i<(this.boxes.length); i++) {
                        if ((this.boxes[i].intestazione) && (this.boxes[i].content == this.content))
                        {
                            this.box = this.boxes[i]
                            this.editorContent = this.box.testo;                  
                        }

                    } 
                }     
                );
            }
        )
    }

    // used for Quill Titolo
    public editorTitolo;
    public editorContentTitolo;
    public editorOptionsTitolo = {
      theme: 'bubble',
      placeholder: "Scrivi qui la scaletta...",
      bounds: '#editor-container',
      modules: {
        toolbar: [
        //  ['bold', 'italic', 'underline', 'strike'],
          ['bold', 'italic', 'underline'],
       //   [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['clean']
        ]
      }
    };
    // used for Quill Titolo
    
    

    ngOnInit() {

       
     // spostato in constructor per copia esempio

        // this.boxService.getBoxesIntestazione(this.id_mappa)
        // .subscribe(
        //     (boxes: Box[]) => {
        //         this.boxes = boxes;
                
        //         for (var i=0; i<(this.boxes.length); i++) {
        //             if ((this.boxes[i].intestazione) && (this.boxes[i].content == this.content))
        //             {
        //                 this.box = this.boxes[i]
        //                 this.editorContent = this.box.testo;                  
        //             }
                   
        //             } 
        //         }     
        // );

  
        this.visible_status = false;
        
        ///////gestisce apertura Intestazione
        if (this.content == 'Introduzione')
            {
                this.visible_status = true
            }
            else
            {
                this.visible_status = false
            }
        }
    
    change_Visible_Status() {
            this.visible_status = !this.visible_status;
        }
   
    
    onSubmit_3() {
        
      
        if (this.box) {
            //edit
              this.box.testo = this.editorContent

              if (this.id_mappa == 167) {
                
                this.editor.blur();
                this.alert_visibility_example_scaletta = true;
                
                return
                } 


              this.boxService.updateBox(this.box, this.id_mappa)
                .subscribe(
                    result => console.log(result)
                    )
                } 
                else 
                {
                    const box = new Box('Introduzione','', 'Massimo',0, {top: 0,  left: 0,  height: 0, width: 0, bottom: 0, right:0 }, false, this.id_mappa);
                    
               
                        box.testo = this.editorContent;
                        box.content = this.content;
                        box.color = '#B4B4B4';
                        box.order = 0;                   
                        box.inMap = false;
                        box.stato = 3;
                        box.intestazione = true;
                  
                
              
                this.boxService.addBox(box)
                    .subscribe(
                        data => {
                            console.log(data),
                            this.box = data
                           
                        },
                        error => console.error(error)
                        
                       
                        
                    ); 
        }
    }

    onupdateMappa(box) {

        if (this.id_mappa == 167) {
            console.log('Update Intestazione')
            this.editor.blur();
            this.alert_visibility_example_scaletta = true;
            
            return
        }
        
         this.boxService.updateBox(box, this.id_mappa)
         .subscribe(
             result => console.log(result)
         );      
     }

     ondeleteBox(box) {
        
         this.boxService.deleteBox(box)
         .subscribe(
             result => console.log(result)
         );      
     }

     alert_VisibilityExampleScaletta() {
        this.alert_visibility_example_scaletta = !this.alert_visibility_example_scaletta;
}

     onEditorBluredTitolo(quill) {
        //console.log('editor blur!', quill);
        }
            
    onEditorFocusedTitolo(quill) {
                console.log('editor focus!', quill);
                if (this.id_mappa == 167) {
  
                
                    this.editorTitolo.blur();
                    this.alert_visibility_example_scaletta = true;
                    
                    return
                    
                }
    }

            //Aggiunti for Quill
    onEditorBlured(quill) {
        //console.log('editor blur!', quill);
            this.onSubmit_3()
        }
            
    onEditorFocused(quill) {
                //console.log('editor focus!', quill);
                if (this.id_mappa == 167) {
            
                    this.editor.blur();
                    this.alert_visibility_example_scaletta = true;
                    
                    return
                    
                }
    }
            
    onEditorCreated(quill) {
        this.editor = quill;
                //console.log('quill is ready! this is current quill instance object', quill);
    }

    onEditorCreatedTitolo(quill) {
        this.editorTitolo = quill;
                //console.log('quill is ready! this is current quill instance object', quill);
    }
            
    onContentChanged({ quill, html, text }) {
        //this.box.testo = this.editorContent ;
        //this.box.intestazione = this.content;
        //
        //this.onupdateMappa(this.box);
        //this.onSubmit_3();
        //console.log('quill content is changed!', quill, html, text);
    }
          

}