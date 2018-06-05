import {Component, Input, OnInit, ElementRef,Renderer2, ViewEncapsulation,ViewChild, Output, EventEmitter, HostListener} from '@angular/core';
import { ActivatedRoute} from "@angular/router";

import {Box} from "../box/box.model";
import {ScalettaService} from "./scaletta.service";

@Component({
    selector: 'app-scaletta',
    templateUrl: './scaletta.component.html',
    styles: ['./scaletta.component.css'],
    //encapsulation: ViewEncapsulation.None --- ma non va bene, funzionava bene
    encapsulation: ViewEncapsulation.Emulated // è default

})

export class ScalettaComponent implements OnInit{
    @Input() box: Box;
    @Input() index_box: number;
    @Output() scaletta_open = new EventEmitter<[boolean, number]>();

    visible_status: boolean;
    id_mappa: number;
    max_right: number = 0;
    max_left: number = 0;

    drag_x: boolean = false;
    drag_y: boolean = true;
    border = "none";
    border_bottom = "2px solid #dbdbdb";

    // used for Quill Testo
    public editor;
    public editorContent;
    public editorOptions = {
      placeholder: "Scrivi qui il testo della scaletta...",
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['clean']
        ]
      }
    };
    // used for Quill Testo

    // used for Quill Titolo
    public editorTitolo;
    public editorContentTitolo;
    public editorOptionsTitolo = {
      theme: 'bubble',
      placeholder: "Scrivi qui la scaletta...",
      bounds: '#editor-container_scaletta',
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

    constructor(private renderer: Renderer2, private route: ActivatedRoute, private boxService: ScalettaService) {

        this.scaletta_open.emit([this.visible_status, this.index_box])

        this.route.params.subscribe (
            params => {
                //console.log(params);
                this.id_mappa = +params['id'];
            }
        )
    }

    @ViewChild('scaletta') scaletta: ElementRef;    

    cursor = 'default';


    /* @HostListener('touchstart', ['$event'])
    onTouchStart(event: any) {
        // max 7 marzo
        event.preventDefault();
        //event.stopPropagation();
        
        
    } */

    changeCursorIn() {
        this.cursor = 'move'
    }

    changeCursorOut() {
       
        this.cursor = 'default'
    }

    count_step(event) {
        
       // poi vedremo come farlo meglio senza vincolo posizione//
      
       //return Math.abs(Math.floor(event/83));
       //return Math.abs(Math.round(event/83));
       return Math.abs(Math.round(event/62));
        //return 1;
    }

    onStartedDrag(event: any) {
        //console.log(event, 'started drag')
        this.border = "dotted";
        this.border_bottom = "dotted #000000"
    }

    onDirection_x(event: any) {

    
        console.log('muovo x')
         //this.drag_y = false;

         if (this.index_box == 1) {return}
        
         if (event>0 && (this.box.livello)<3) {
              
            this.box.livello = this.box.livello + 1;  
         }
         else

       
         if (event<0 && (this.box.livello)>=1) {
       
                 this.box.livello = this.box.livello - 1;
       
         };
         if (event>0 && (this.box.livello == 3 && this.max_right != 1))  {
             this.max_right = 1         
         }
         else {
             this.max_right = 0     
         }
 
         if (event<0 && (this.box.livello == 0 && this.max_left != 1)) {
            
             this.max_left = 1    
         }
         else {
             
             this.max_left = 0     
         }
        
         //this.drag_y = false;
         this.onSubmit_3(); 

      
         
     }
// considerare se farla
    


    onDirection_y(event) {

        //this.drag_x = false;
        
        this.border = "none";
        this.border_bottom = "2px solid #dbdbdb";
        //console.log(this.count_step(event), 'this.count_step(event)');

        if (this.count_step(event) == 0) {
            return
        }

       // posizionamento e trascinamento per ASSE YYYY//

        this.boxService.get_levelUp_ric(this.index_box);
        this.boxService.get_levelDown_ric(this.index_box);

        
        let index = this.boxService.boxes.indexOf(this.box);

        if (event>0) {     

            // Sposto all'altima posizione livello 0//    
            if ((this.boxService.index_up == this.boxService.index_down) && (index + this.count_step(event) ) == (this.boxService.boxes.length-1)) {
               
                this.boxService.reorderBoxes(index, index+ this.count_step(event));
                this.aggiorna_move();
                return
            }
           // Sposto all'altima posizione livello 0, conclusione//

            // Sposto primo livello non annidato//
            if ((this.boxService.index_up == this.boxService.index_down) && (this.boxService.boxes[index + this.count_step(event) + 1].livello == 0)) {

                this.boxService.get_levelUp_ric(index + this.count_step(event) + 1);
                this.boxService.get_levelDown_ric(index + this.count_step(event) + 1);

                if (this.boxService.index_up == this.boxService.index_down) {
                console.log('Caso incui qualche livello è multiplo')
                this.boxService.reorderBoxes(index, index+ this.count_step(event));
                this.aggiorna_move();
                }
                
                else if (this.boxService.index_up == this.boxService.index_down)
                {
                    for (var _i = this.boxService.index_up; _i <= this.boxService.index_down; _i++)    
                        {
                            this.boxService.reorderBoxes(_i, _i+ this.count_step(event));
                            this.aggiorna_move();
                        }
                }
                return
            }

            // Sposto primo livello non annidato conclusione//

            if ((this.count_step(event) == 1) && (this.boxService.index_up == this.boxService.index_down) && (this.boxService.boxes[index + this.count_step(event) + 1].livello == 0))
            {
                
                console.log('AAA')
                this.boxService.reorderBoxes(index, index+ this.count_step(event));
                this.aggiorna_move();
                return
            } 
            else 
            {
                /// Sono annidati 
                

                // Gestisce eccezione per ultimo in giu 
                 if ((this.boxService.index_up == this.index_box ) && ((this.index_box +  this.count_step(event) ) < this.boxService.boxes.length)) { 

                    //sposto male all\'interno di un blocco - INIZIO
                    if ((this.boxService.boxes[index].livello != (this.boxService.boxes[index + this.count_step(event)].livello) + 1) && ((index + this.count_step(event))<= this.boxService.index_down))
                        {
                            console.log('sposto male all\'interno di un blocco', this.boxService.index_down);
                            return
                        }
                     //sposto male all\'interno di un blocco - FINE

                    
                    console.log('AA')
                    let alto = this.boxService.index_down;
                    let basso = this.boxService.index_up;

                    this.boxService.get_levelUp_ric((this.index_box + this.count_step(event) ));
                    this.boxService.get_levelDown_ric((this.index_box + this.count_step(event) ));

                    if ((alto - basso) == (this.boxService.index_down - this.boxService.index_up)) 
                        {
                        
                        this.boxService.get_levelUp_ric(this.index_box);
                        this.boxService.get_levelDown_ric(this.index_box); 

                        for (var _i = this.boxService.index_up; _i <= this.boxService.index_down; _i++) {
                   
                        // Questo serve
                         this.boxService.move(this.boxService.index_up, this.boxService.index_down + this.count_step(event)); 


                            }

                        this.aggiorna_move();
                            
                        return
                        }
                }
                 // Fine - Gestisce eccezione per ultimo in giu 

                 // Gestione annidati multiplo
                // Trascino dal Top Nido

                this.boxService.get_levelUp_ric(this.index_box);
                this.boxService.get_levelDown_ric(this.index_box);  

                if ((this.boxService.index_up == this.index_box ) && ((this.index_box +  this.count_step(event) + 1 + (this.boxService.index_down - this.boxService.index_up)) < this.boxService.boxes.length)) {               
        
                        console.log('Somma distanza ', this.index_box +  this.count_step(event) )

                        // Gestisce eccezione se blocco trascinato a lunghezza diversa dal ricevente

                        let alto = this.boxService.index_down;
                        let basso = this.boxService.index_up;

                        this.boxService.get_levelUp_ric((this.index_box + this.count_step(event) ));
                        this.boxService.get_levelDown_ric((this.index_box + this.count_step(event) ));

                        console.log('alto - basso: ', alto - basso, 'this.boxService.index_down - this.boxService.index_up: ', this.boxService.index_down - this.boxService.index_up, 'this.count_step(event):', this.count_step(event))
                        
                       if ((alto - basso) != (this.boxService.index_down - this.boxService.index_up)) 
                        {
                            /* if ((alto - basso) < (this.boxService.index_down - this.boxService.index_up)) 
                            { */
                             /* for (var _i = this.boxService.index_up; _i <= this.boxService.index_down; _i++) { */
                            for (var _i = basso; _i <= alto; _i++) {

                          
                                
                                 /* this.boxService.reorderBoxes(this.boxService.index_up, this.boxService.index_up - this.count_step(event)); */
                                 this.boxService.move(basso, this.boxService.index_down);
                                 //console.log(this.boxService.boxes);
                                 //
                                 //this.aggiorna_move();
                                
                              }
                            
                            this.aggiorna_move();
                            console.log('dopo somma');
                            return

                             
                        //    }
                       } else
                       {
                            console.log('dopo somma altro caso');
                           

                       }
                       // else alto - basso !=

                        this.boxService.get_levelUp_ric(this.index_box);
                        this.boxService.get_levelDown_ric(this.index_box);  

                        // Gestisce eccezione se blocco trascinato a lunghezza diversa dal ricevente

                        if (((this.boxService.get_Boxbyindex(this.index_box +  this.count_step(event) + (this.boxService.index_down - this.boxService.index_up)).livello == 0))) /* || ((this.index_box +  this.count_step(event) + (this.boxService.index_down - this.boxService.index_up) )) == this.boxService.boxes.length) */ 
                        {
                            console.log('aa');

                            for (var _i = this.boxService.index_up; _i <= this.boxService.index_down; _i++) {
                                
                                console.log('move')
                             /*   this.boxService.reorderBoxes(this.boxService.index_up, this.boxService.index_down + this.count_step(event)); */

                                 this.boxService.reorderBoxes(this.index_box, this.boxService.index_down + this.count_step(event));
                            }
                            this.aggiorna_move();
                        }
                        console.log('esco')
                        return
                    }
                    else
                    {
                        /// caso lavoro
                        //console.log('sono annidati maggiore di 0')
                        console.log('b')
                        
                        if ((index + this.count_step(event) <= this.boxService.index_down) && (this.boxService.boxes[index].livello == this.boxService.boxes[index+ this.count_step(event)].livello)) {
                            
                              console.log('c');
                                
                              

                              this.boxService.get_levelDown_ric_intermedia(index, this.boxService.boxes[index].livello);

                              if((index + this.count_step(event) >this.boxService.control_down) && this.boxService.boxes[index].livello != 2) 
                                  { 
                                      

                                      this.boxService.get_levelDown_ric_intermedia_bis(this.boxService.control_down + this.count_step(event), this.boxService.boxes[this.index_box].livello);

                                      console.log('Primo blocco grande', index, this.count_step(event),this.boxService.control_down, this.boxService.control_down_bis);

                                      for (var i:any = index; i <= this.boxService.control_down; i++)
                                        {
                                            /* this.boxService.reorderBoxes(this.index_box, this.boxService.control_down_bis); */

                                            this.boxService.reorderBoxes(index, this.boxService.control_down_bis);
                                            
                                            this.aggiorna_move();
                                        }

                                
                                      return
                                  }
                        
                            this.boxService.get_levelDown_ric_intermedia(index, this.boxService.boxes[index].livello);

                              if ((this.boxService.control_down + this.count_step(event) < this.boxService.boxes.length) )
                                  {
                                    console.log('muovo in sottolivello')
                                    //gestisce aggancio non fuori livello
                                      if ((this.index_box + this.count_step(event) > this.boxService.control_down)) {
                                        console.log('muovo bis', this.index_box, this.boxService.control_down )  
                                        return}
                                      //gestisce aggancio non fuoiri livello

                                    this.boxService.get_levelDown_ric_intermedia_bis(this.boxService.control_down + this.count_step(event), this.boxService.boxes[this.index_box].livello);
                            
                                    console.log('d', this.boxService.control_down, this.count_step(event))

                                    if (this.count_step(event) == 1) 
                                    
                                        {
                                            this.boxService.reorderBoxes(this.index_box, this.index_box + this.count_step(event));
                                            
                                            this.aggiorna_move();
                                            return
                                        }
                            
                                    for (var i:any = this.index_box; i <= this.boxService.control_down; i++)
                                        {
                                            /* this.boxService.reorderBoxes(this.index_box, this.boxService.control_down_bis); */

                                            this.boxService.reorderBoxes(this.index_box, this.index_box + this.count_step(event));
                                            console.log('bb')
                                            this.aggiorna_move();
                                        }
                                    return

                              } 
                              else 
                              {
                             // ...
                                console.log('Caso maggiore')
                                //Attenzione

                                this.boxService.get_levelDown_ric_intermedia(index, this.boxService.boxes[index].livello);

                               

                                //for (var i:any = this.index_box; i <= this.boxService.control_down; i++)
                               // {
                               
                               
                                    this.boxService.get_levelDown_ric_intermedia_bis(this.boxService.control_down + this.count_step(event), this.boxService.boxes[this.index_box].livello);

                                    // muh tolto ma sto gestendo sotto riordine all'interno di livello 2//

                                    /* this.boxService.reorderBoxes(this.boxService.control_down, this.boxService.control_down_bis ); */

                                        // muh tolto ma sto gestendo sotto riordine all'interno di livello 2//


                                    
                                    this.boxService.reorderBoxes(this.index_box, this.index_box + this.count_step(event))


                                    console.log('bbb')
                                    this.aggiorna_move();
                           // }
                                    return                        
                              }
                            
                            }
                    }
                                
           }                       
                      
        } else if (event<0) {

                console.log('Scendo')
                if ((this.boxService.index_up == this.boxService.index_down) &&this.boxService.boxes[index - this.count_step(event) ].livello == 0)  {
                   
                    console.log('1')
                    if ((index - this.count_step(event)) < 0) {
                        console.log('2')
                        this.boxService.reorderBoxes(index, 1);
                        this.aggiorna_move();
                        return
                    } else if (this.boxService.boxes[index - this.count_step(event) ].livello == 0) {
                        console.log('3')
                    this.boxService.reorderBoxes(index, index - this.count_step(event));
                    this.aggiorna_move();
                    return
                    }
                }
            

            if ((this.count_step(event) == 1) && (this.boxService.index_up == this.boxService.index_down) && (this.boxService.boxes[index - this.count_step(event) ].livello == 0))
                {
                    console.log('4')
                    this.boxService.reorderBoxes(index, index - this.count_step(event));
                    this.aggiorna_move();
                    return
                } else 
                {
                    
                    if (index == 0) {return}

                    if ((this.boxService.index_up == this.index_box )) {
                         if ((index - this.count_step(event) > 0) && (this.boxService.boxes[index - this.count_step(event) ].livello) == 0) {
                            console.log('5')
                                for (var _i = this.boxService.index_up; _i <= this.boxService.index_down; _i++) {
                        
                                   this.boxService.move(this.boxService.index_down, this.boxService.index_up - this.count_step(event));
                                  }
                                }
                                else
                                {
                                   console.log('Mai stato qui')
                                }
                        
                    }
                    else
                    {
                        //console.log('sono annidati minore di 0', this.count_step(event), index, this.boxService.index_up +1)
                        
                        /* if ((index - this.count_step(event) <= (this.boxService.index_up +1)) && (this.boxService.boxes[index].livello == this.boxService.boxes[index - this.count_step(event)].livello)) 
                        { */
                        console.log('Scendo bis')

                        if ((index - this.count_step(event) > (this.boxService.index_up)) && (this.boxService.boxes[index].livello == this.boxService.boxes[index - this.count_step(event)].livello) &&  this.boxService.boxes[index].livello != 2) 
                            {

                            console.log('6: ', index, this.boxService.index_up, this.count_step(event));

                            this.boxService.get_levelUp_ric_intermedia(index, this.boxService.boxes[index].livello)

                           /*  if (index == this.boxService.control_up) {return}

                            if ((index - this.count_step(event) > (this.boxService.control_up))) 
                            {
                                return
                            } */

                            for (var _i:any = index; _i <= this.boxService.index_down; _i++) 
                                {
                                    this.boxService.move(this.boxService.index_down, index - this.count_step(event));
                                }
                            
                            this.aggiorna_move();
                            return
                        }
                        else 
                        {
                            console.log('QUI');
                            if (index - this.count_step(event) <= this.boxService.index_up) 
                                {
                                    return
                                } else 
                                {
                                for (var _i:any = index; _i <= this.boxService.index_down; _i++) 
                                {
                                    this.boxService.move(this.boxService.index_down, index - this.count_step(event));
                                }
                            
                                this.aggiorna_move();
                                return
                            }
                        }
                    }
            }      
        }
   
    //    this.callUpdateMappa(); // ma serve?
    console.log('Siamo in uscita')
    this.aggiorna_move();

   // this.drag_x = true;
             
    }

    aggiorna_move() {
        for (var _i: any = 0; _i < this.boxService.boxes.length; _i++) {
            this.boxService.boxes[_i].order = _i.toString();
            this.boxService.updateBox(this.boxService.boxes[_i])
            .subscribe(
                result => console.log(result)

            );         
        } 
    }

    

    onDirection_stop() {
        event.stopPropagation();
        // do nothing Write
                //this.boxService.reorderBoxes(0,1, this.boxService.boxes
    }

    belongsToUser() {
        
            return localStorage.getItem('userId') ==  this.box.userId;
     
        }

    ngOnInit() {
        this.visible_status = false;
        

        
        if (this.box.testo != 'Testo Box') {
        setTimeout(() => {
            this.editorContent = this.box.testo;
            this.editorContentTitolo = this.box.content;
          //  console.log('you can use the quill instance object to do something', this.editor);
            // this.editor.disable();
          }, 500)

        }

        //this.box.stato = 3

        if (this.boxService.boxes[0].stato < 3) {
            
            this.box.stato = 3;
        } 
        //this.box.stato = 3;
        

        /*  if (this.boxService.boxes[0].stato < 3) {
            
             this.box.stato = 3;
         } */

     /*    if (this.box.stato < 2) {
            this.box.stato = 2;
        } */

       /*  if (this.box.stato > 3) {
           
        } else if (!this.box.stato) {
        
            this.box.stato = 3
        } */

        if (!this.box.intestazione) 
        {
            if (this.box.numero_mappa != 145) {
                this.boxService.updateBox(this.box)
                .subscribe(
                   // result => console.log(result)
    
                )
            }
            
        }

        
    }

    change_Visible_Status() {
        //console.log('visible')
        this.visible_status = !this.visible_status;
        this.scaletta_open.emit([this.visible_status, this.index_box])
       
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
            // create
            let num = this.boxService.get_Boxlength()+1;

            const box = new Box('Content Box', 'Testo Box', 'Carlo', 0, {top: 0, bottom: 0, left: 0, right: 0, height: 80, width: 200}, false, this.id_mappa);

            box.color = '#B4B4B4';
            //box.order = num.toString()
            box.order = num;
            box.inMap = false;

            this.boxService.addBox(box)
                .subscribe(
                    data => console.log(data),
                    error => console.error(error)
                );
        }

        //       form.resetForm();
    }

    onupdateMappa(box) {
            
         this.box.stato = 3
         this.boxService.updateBox(box)
         .subscribe(
             //result => console.log(result)
         );      
     }

     ondeleteBox(box) {
        
         this.boxService.deleteBox(box)
         .subscribe(
             result => console.log(result)
         );      
     }

    // callUpdateMappa() {
        
    //             this.boxService.arrayCountMappa(this.box.numero_mappa);
                 
    //             while(this.boxService.indexBoxes.length) {
    //                 let index = this.boxService.indexBoxes.pop();
                    
    //                 /* this.onupdateMappa(this.boxService.boxes[index]);
    //                 this.boxService.addBox(this.box);
    //                 this.ondeleteBox(this.boxService.boxes[index]);
    //                 this.boxService.boxes.splice(index, 1); */
                     
    //             }      
    //         }

            //Aggiunti for Quill
            onEditorBlured(quill) {
                //console.log('editor blur!', quill);
              }
            
            onEditorFocused(quill) {
                //console.log('editor focus!', quill);
              }
            
            onEditorCreated(quill) {
                this.editor = quill;
                //console.log('quill is ready! this is current quill instance object', quill);
              }
            
            onContentChanged({ quill, html, text }) {
                // console.log(html)
                this.box.testo = this.editorContent;

                if (this.box.numero_mappa != 145) {
                    this.onupdateMappa(this.box);
                }
                
                //console.log('quill content is changed!', quill, html, text);
              }

              onEditorBluredTitolo(quill) {
                //console.log('editor blur!', quill);
              }
            
              onEditorFocusedTitolo(quill) {
                //console.log('editor focus!', quill);
              }
            
              onEditorCreatedTitolo(quill) {

                this.editorTitolo = quill;
                quill.focus();

                //this.editorTitolo = quill;
                //console.log('quill is ready! this is current quill instance object', quill);
              }
            
              onContentChangedTitolo(event) {
                //this.box.content = this.editorContentTitolo ;
                if (event.text.length != 1)
                      {
                            this.box.content = event.html;
                            if (this.box.numero_mappa != 145) {
                               this.onupdateMappa(this.box);
                            }
                            
                      }
                //console.log('quill content is changed!', quill, html, text);
              }
            
              

}