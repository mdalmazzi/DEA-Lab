import {
    AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2,HostListener,ViewEncapsulation,
    ViewChild
} from '@angular/core';


import { ActivatedRoute, Router} from "@angular/router";
import {Box} from "./box.model";
import {BoxPosition} from "./circle.model";
import {BoxService} from "./box.service";
import {ResizeEvent} from 'angular-resizable-element';


@Component({
    selector: 'app-box',
    templateUrl: './box.component.html',
    styleUrls: ['./box.component.css'],
    encapsulation: ViewEncapsulation.Emulated
})



export class BoxComponent implements AfterViewInit, AfterContentInit, OnInit{
    @Input() box: Box;
    @Input() number_box: number;
    @Input() index_box: number;

    rect_4_angle: boolean;

    @Output() updateRelation = new EventEmitter<any>();
   // @Output() downRelation = new EventEmitter<MouseEvent>();
    //@Output() aggiornaRelation = new EventEmitter<any>();
    @Output() aggiornaRelation = new EventEmitter<number>();

    alertTesto = 'Troppi livelli. Oltre al titolo è possibile inserire due livelli.';
    
    //private x_start;
    //private y_start;
  
    public draggable_On_Off: boolean;
    num: number;
    boxes_move: number[] = [];
    widthEditor;
    public isDown : boolean = false;
    public isMove : boolean = false;

    //private left_start;
    //private right_start;
    //private top_start;
    //private bottom_start;

    
    public style: [{}]= [{}];
    //private boxId_indexUp;
    position_box: {x:number, y:number};


    panel_color: string = '#000000';
    @ViewChild('svgContainer') svgContainer: ElementRef;
    
    alert_visibility: boolean = false;
    
    private init_resize: boolean

    private init_width: boolean;

    private angle1_counter: 0;
    
    // used for Quill Editor
    public editor;
    public editorContent;
    public editorOptions = {
      theme: 'bubble',
      bounds: "#editor-container-mappa" + this.number_box,
      placeholder: "Scrivi qui...",
      
     
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
        //  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
       //     [ { 'background': [] }],
          ['clean'],
          
        ]
      }
    };
    // used for Quill 

    //commentato in IDE//

    cursor = 'default';

    changeCursorIn() {
        this.cursor = 'move'
    }

    changeCursorOut() {
       
        this.cursor = 'default'
    }
 
    @Output() box_created = new EventEmitter<Box>();
    id_mappa: number;
 
    constructor(private route: ActivatedRoute, private router: Router, private boxService: BoxService, public elementRef: ElementRef, private renderer: Renderer2)  {

        //this.updateRelation.emit();
        
        this.route.params.subscribe (
            params => {
                 this.id_mappa = +params['id'];
            }
        )
    }

   
   
    
    longtap(event: any) {
        
           setTimeout(() => {
            if (this.rect_4_angle && this.isDown) {
                this.rect_4_angle = false;   
             
            } 
        }, 2000); 
         
    }

    alert_Visibility() {
        this.alert_visibility = !this.alert_visibility;
    }

    getRandomArbitrary(min, max) {
        return Math.round(Math.random() * (max - min) + min);

      }

    onEdit() {
        if (!this.box.titolo) {this.boxService.editBox(this.box);}
        else {
            this.boxService.editTitolo(this.box)
        }

    }

    onEditTitolo() {
         this.boxService.editTitolo(this.box);
    }

    updateBoxAfter(box: Box) {
    

        this.boxService.updateBox(box)
        .subscribe(
           // result => console.log(result)
        )
      
    }

    onDelete() {

        var index = this.boxService.get_Box(this.box.boxId);
     //   var boxAfter = this.boxService.get_Box_after(this.box.boxId);
        var level = this.boxService.get_Box(this.box.boxId);
        var flag = true;
        
        this.boxService.deleteBox(this.box)
            .subscribe(
                //result => console.log(result)
                result => {
                    
                    // dovrei gestire errore
                    //console.log('Delete result:',result);
                    if (this.boxService.get_Boxlength()>1) {
                        let Update = this.boxService.updateLevelBox(index, level);
    
                        //console.log(Update);
    
                        for (var i=Update[0]; i<=Update[1]; i++) {
                            this.updateBoxAfter(this.boxService.get_Boxbyindex(i))
                            //console.log(Update, i)
                            }
                        }
                        
                    //window.location.reload();
                   //this.router.navigate(['boxes/'+ this.box.numero_mappa]);
                }
            );
            //this.router.navigate(['boxes/'+ this.box.numero_mappa]);          
         //   this.boxService.get_levelDown(index, this.box.numero_mappa)
    }

    settaColor(color: string) {
        
        this.box.color = '#' + color;

        this.boxService.updateBox(this.box)
        .subscribe(
            result => console.log(result)

        )
      
    }

    // Esclusa
    /* belongsToUser() {
    
        //return localStorage.getItem('userId') ==  this.box.userId;
 
    } */

    circle(number_box: number, index_box: number) {
    
     this.boxService.get_levelDown_ric(index_box);
     this.boxService.get_levelUp_ric(index_box);

    
         // Cerchio Primario -non è un box con livelli annidati _ Non più cerchio unico 

        //if ((this.boxService.index_up == this.boxService.index_down) ) {
            if ((this.boxService.index_up == index_box) ) {           
                
                let radius = 250;
                // radius of the circle
         
                //window.innerWidth
                let width = 500;
                
                //let width = window.innerWidth/2
                
                let height = 500;
                //let height = window.innerHeight/2;
                
                let angle = (Math.PI)/3 + Math.PI;
                //let angle = (Math.PI)/9 + Math.PI;
                //let    step = (2*Math.PI) / (number_box-1);
                let  step = (2*Math.PI) / (this.boxService.countAngle()- 1);
                            
                //angle = angle + step * (index_box -1)  
                angle = angle + step * this.boxService.countStep(index_box);                

                let x = Math.round(width/2 + radius * Math.cos(angle) );
                let y = Math.round(height/2 + radius * Math.sin(angle) );
                
                this.box.color = '#' + this.boxService.colorArray[index_box];
                
                //x = x + width/3;
                x = x + 300;
                // Modifica serale
                this.boxService.secondaryRadiusX = x;
               // Modifica serale
                y = y + 400;  
                // Modifica serale
                this.boxService.secondaryRadiusY = y;     
                // Modifica serale
                return {x,y}

        } else if (this.boxService.index_up != index_box) {

       
            this.box.color = this.boxService.boxes[this.boxService.index_up].color; 
        
            let radius = 280; 
        
     
            // countMin = conteggia il numero box livello 0
            let countMin = this.boxService.countlevel(this.boxService.index_up);

       
            // step = (angolo giro/numero livello 0)/ (numero di box al secondo livello//
        
            let  step = (2*(Math.PI)/(countMin)) / (this.boxService.index_down - this.boxService.index_up);
     
            // trovo il mio index_up
            let index_count = 0;
            for (var _i: any = 0; _i < this.boxService.style.length; _i++) 
            {
                if (this.boxService.style[_i].numero == this.boxService.index_up) 
                    {
                        index_count = _i;     
                    }
            }

            let x;
            let y;

            let angle = (Math.PI)/3 + Math.PI;
            //let angle = (Math.PI)/9 + Math.PI;
            let step_sup = (2*Math.PI) / (this.boxService.countAngle()- 1);
                            
            //angle = angle + step * (index_box -1)  
            angle = angle + step_sup * this.boxService.countStep(index_box); 
          
            let angle1 = angle + (step) * (index_box - this.boxService.index_up - 2);
                   
            x = Math.round(this.boxService.secondaryRadiusX/2 + radius * Math.cos(angle1));

            y = Math.round(this.boxService.secondaryRadiusY/2 + radius * Math.sin(angle1));   
                          
            let width = window.innerWidth/2
        
            //x = x + width/2;
            x = x + 300;

            y = y + 300;  
           
            return {x,y}

            // siamo in un nodo annidato
            // Questo viene escluso//

            } 
                else 
            { 
                // Cerchio secondario Per annidati

                let radius = 150; // radius of the circle
                
                // Questo è cerchio con sotto BOX
                
               // let randomColor = this.getRandomArbitrary(0, 5);
                              
                this.box.color = '#' + this.boxService.colorArray[index_box];
                
                let width = window.innerWidth/2  
            
                let height = 500;
                //let height = window.innerHeight/2;                            
                
                let angle = -(Math.PI)/6 - Math.PI;
                //let angle = (Math.PI)/9 + Math.PI;
                
                let step = (2*Math.PI) / (this.boxService.countAngle() - 1);
                            
                let x_destra = 0;
                let x_sinistra = 0;

                angle = angle + step * this.boxService.countStep(index_box);                            
                let x = Math.round(width/2 + radius * Math.cos(angle));
                let y = Math.round(height/2 + radius * Math.sin(angle));
      
                x = x + width/3;                

                this.boxService.secondaryRadiusX = x;
  
                y = y + 380; 
                //y = y + height;

                this.boxService.secondaryRadiusY = y;
                        
                   
                return {x,y}

        }

    }

    redrawMap() {
        
    }

    ngOnInit() {

        this.editorOptions.bounds = "#editor-container-mappa" + this.index_box;
        
        this.boxService.changeLevel = 0;
        this.rect_4_angle = true;
        this.boxService.index_box = this.index_box;
        
        if (this.box.stato < 2) {
            this.box.stato = 2;
        }
       
        this.init_resize = true;
        if (this.box.titolo && (this.box.numero_mappa == this.id_mappa)) {
                 
            // this.box.rectangle.left = window.innerWidth/2 - 100;

            this.box.rectangle.left = 500;
        
            // let baricentro = this.boxService.getBaricentro();
            // console.log('Baricentro: ', this.style);

            // this.box.rectangle.left = baricentro[0];
            
            this.boxService.editTitolo(this.box)
        }
        
         this.draggable_On_Off = true;
         this.init_width = false;
         // Mi sembra inutile
         if (this.box.content.length != 0) {
             if (this.box.content.length < 30)
             {this.positionBox(46, 115, this.init_width);} else
             {this.positionBox(46, 115, this.init_width);}
             
          /*    {this.positionBox(60, 120, this.init_width);} else
             {this.positionBox(60, 200, this.init_width);} */
             
         } 
             
        if ((this.box.content != 'Content Box')  && (this.box.content != '<p>Inserisci il titolo ...</p>')) {
          //  setTimeout(() => {
             

                this.editorContent = this.box.content;
               
               
                // this.editor.disable();
        //      }, 50) 
            } else {

                if (this.box.titolo) 
                {
                    this.editorOptions.placeholder = "Scrivi qui il titolo..."
                  }
                else
                { this.editorOptions.placeholder = "Scrivi qui ..." }
                
            }


            if (this.box.color == undefined) 
            { this.box.color = '#B4B4B4'}  
        
        // proprio necessario aggiornare? tolgo e vediamo
            this.boxService.updateBox(this.box)
            .subscribe(
                //result => console.log(result)

            )
        // proprio necessario aggiornare? tolgo e vediamo
        
    }

    ngAfterViewInit() {

        //console.log('ngAfterViewInit');

        this.box_created.emit(this.box);
        
    }

    ngAfterViewChecked() {
        //console.log('ngAfterViewChecked');
       
    }

    ngAfterContentInit() {
        //console.log('ngAfterContentInit');
    }


    validate(event: ResizeEvent): boolean {
        const MIN_DIMENSIONS_PX: number = 40;
        if (event.rectangle.width < MIN_DIMENSIONS_PX || event.rectangle.height < MIN_DIMENSIONS_PX) {
            return false;
        }
        return true;
    }

  on_off_Drag(event: MouseEvent) {
   }
  
  
  onResizeStart(event: ResizeEvent): void {
      
        this.draggable_On_Off = false;     
 }

  onResizeEnd(event: ResizeEvent): void {
        
    
    console.log('resize')
        
      if (event.edges.left) {
         if (this.init_resize) {
            this.box.rectangle.left = Number(event.rectangle.left);
            this.init_resize = !this.init_resize;
     
        } else {
            this.box.rectangle.left = Number(event.rectangle.left);
     
        }
        
      }
       if (event.edges.bottom) {
        
        //  this.box.rectangle.left = event.rectangle.left + this.left_start;
        //this.box.rectangle.bottom = event.rectangle.bottom ;
       
        if (this.init_resize) {
            this.box.rectangle.bottom = Number(event.rectangle.bottom);
            this.init_resize = !this.init_resize;
     
        } else {
            this.box.rectangle.bottom = Number(event.rectangle.bottom);
      
        }
      }
       if (event.edges.right) {
        
        //  this.box.rectangle.left = event.rectangle.left + this.left_start;
        //this.box.rectangle.right = event.rectangle.right ;
        
       
        if (this.init_resize) {
            this.box.rectangle.right = Number(event.rectangle.right);
            this.init_resize = !this.init_resize;
        
        } else {
            this.box.rectangle.right = Number(event.rectangle.right);
        
        }
        
      }
      if (event.edges.top) {
       
        if (this.init_resize) {
            this.box.rectangle.top = Number(event.rectangle.top);
            this.init_resize = !this.init_resize;
          
        } else {
            this.box.rectangle.top = Number(event.rectangle.top);
            
        }
        
      }
      this.init_resize = false;
      this.box.inMap = true;
        

        this.box.rectangle.width = event.rectangle.width;
        this.box.rectangle.height = event.rectangle.height;
       

        this.style[this.number_box] = {
       //     position: 'relative',
        // 21 12 2017 prima niente
        position: 'absolute',
            left: `${this.box.rectangle.left }px`,
            top: `${this.box.rectangle.top}px`,
          
          
            bottom: `${this.box.rectangle.bottom}px`,
            right: `${this.box.rectangle.right}px`,
            
            width: `${this.box.rectangle.width }px`,
            height: `${this.box.rectangle.height}px`
        };

        this.boxService.updateBox(this.box)
            .subscribe(
                result => console.log(result)

            )
         this.draggable_On_Off = true;
    


    }


    onstarted(event) {
     
     this.isDown = true;
     this.longtap(event);
     this.widthEditor = this.editor.container.clientWidth;
    
    
     
     //Tolto 2103
     //this.updateRelation.emit();
    
     //Tolto 2103

     
     
    }

    onMove(event: MouseEvent)
    {   

          
            /* setTimeout(() => {
                if (!this.rect_4_angle ) {
                    this.rect_4_angle = !this.rect_4_angle;
                }
            }, 2000);  */
            
           // this.isMove = true;
         
           if (!this.box.titolo )    
               {                 
                this.aggiornaRelation.emit(this.index_box)       
                }
               else 
               {
                
                this.updateRelation.emit()
                   
                }
          }



    onstopped_view(event) {
        //this.isMove = false;
        this.isDown = false;
       
        if (!this.box.titolo) 
            {
                this.aggiornaRelation.emit(this.index_box)
            }
            else 
            {
                this.updateRelation.emit()
            }
        //Attenzione qui problema
        this.box.rectangle.left = event.x;
        this.box.rectangle.top = event.y;  

     
        if (this.editor) {
            //modifica Max 2202
           
            this.box.rectangle.height = this.editor.container.clientHeight;
            ;
            //this.box.rectangle.width = this.editor.container.clientWidth;
            
            //modifica Max 2202
        }
          
         this.style[this.number_box] = {
             // 21 12 2017 prima niente
               position: 'absolute',
               left: `${this.box.rectangle.left}px`,
               top: `${this.box.rectangle.top}px`,
               // cambiato dopo modifica al changecontent quill
               //modifica 2202 max
          
               //modifica 2202 max
               height: `${this.box.rectangle.height}px`,

               //modifica Max altrimenti risetta in end
               //width: `${this.widthEditor}px`
               
               //modifica Max 
               
          }; 
 
        this.boxService.updateBox(this.box)
             .subscribe(
              //   result => console.log(result)

             );
             //this.updateRelation.emit(this.number_box);
             
    }

    aumentaLivelloTouch(event: TouchEvent) {

       // console.log(event);
        this.aumentaLivello();
       /*  this.isDown = false;
        this.index_relation = null; */
        //this.boxService.changeLevel = 0;
        
    } 

    
    aumentaLivello() {   
        
           console.log('aumentaLivello');
           

            if (this.boxService.boxes[this.boxService.changeLevel].livello == 0 && (this.boxService.test_Box_level0() == 2))
            {
               // Almeno un livello deve essere agganciato al titolo');
               console.log('colore 2');
                this.updateRelation.emit();
                this.boxService.changeLevel = 0;
                return
            }

            if ((this.boxService.changeLevel) == 0) {
                console.log('colore 3');
                this.aggiornaRelation.emit(this.index_box)
                //this.updateRelation.emit();
                return
            }              
  
            this.boxService.index_up = this.boxService.changeLevel;
      
            this.boxService.get_levelDown_ric(this.boxService.changeLevel);

                // Aggancio a Titolo se lo metto dopo titolo e sono indexdown NON HO SOTTOLIVELLI//

                if (((this.boxService.get_Box(this.box.boxId)) == 0) && ((this.boxService.changeLevel == this.boxService.index_down))) {
                    console.log('colore 1');
                    // ok 
                    this.boxService.boxes[this.boxService.changeLevel].color = '#' + this.boxService.colorArray[this.boxService.changeLevel];

                     this.boxService.boxes[this.boxService.changeLevel].livello = 0;

                    // ok 

                 for (var _i: any = 0; _i < this.boxService.boxes.length; _i++) {
                    this.boxService.boxes[_i].order = _i.toString();
                    this.boxService.updateBox(this.boxService.boxes[_i])
                    .subscribe(
                        //result => console.log(result)
        
                    );         
                };
                
                    //this.onupdateMap();   
                    this.aggiornaRelation.emit(this.index_box)
                    this.updateRelation.emit();          
                    this.boxService.changeLevel = 0;
                    return
                }

                // FINE Se lo metto dopo titolo e sono indexdown//
                

                // sposto annidato con indexdown stesso livello sotto /// ci sono Problemi --- Se ho annidati seguiti da livello uguale a quello che sposto


                    if (((this.boxService.get_Box(this.box.boxId)) == 0) &&(this.boxService.boxes[this.boxService.changeLevel].livello == this.boxService.boxes[this.boxService.changeLevel + 1].livello)) { 
                   
                        console.log('colore 4');
                        this.boxService.boxes[this.boxService.changeLevel].livello = 0;

                        this.boxService.boxes[this.boxService.changeLevel].color = '#' + this.boxService.colorArray[this.boxService.changeLevel]

                        this.boxService.move(this.boxService.changeLevel, 1);

                        for (var _i: any = 0; _i < this.boxService.boxes.length; _i++) {
                            this.boxService.boxes[_i].order = _i.toString();
                            this.boxService.updateBox(this.boxService.boxes[_i])
                                .subscribe(
                            //result => console.log(result)
            
                                    );         
                                };
                    
               
                        this.aggiornaRelation.emit(this.index_box)
                        this.updateRelation.emit();           
                        this.boxService.changeLevel = 0;
                        return
                    


                }

                // sposto annidato con indexdown stesso livello sotto
               
            
                // se lo metto dopo titolo e non sono indexdown
                    
                if (((this.boxService.get_Box(this.box.boxId)) == 0) &&  (this.boxService.changeLevel != this.boxService.index_down)) {

                    // Start aggangio a Titolo con annidato
                    console.log('colore 5');
                    
                    this.boxService.get_levelDown_Inside_ric(this.boxService.changeLevel, this.boxService.changeLevel);


                    if (this.boxService.boxes[this.boxService.index_down_inside + 1]) 
                        {
                        if (this.boxService.boxes[this.boxService.changeLevel].livello == this.boxService.boxes[this.boxService.index_down_inside + 1].livello) 
                            {
                                
                                this.boxService.index_down = this.boxService.index_down_inside;
                               
                            }
                        }

                    this.boxes_move.push(0);
                    for (var _i = this.boxService.index_up; _i < this.boxService.index_down; _i++) {
                        this.boxes_move.push((this.boxService.boxes[_i+1].livello)- this.boxService.boxes[_i].livello);
                    }
                    let livello_cambio = 0;
                    for (var i= 0; i < this.boxes_move.length; i++) {
                
                    if (this.boxes_move[i]>0) {
                        livello_cambio = this.boxes_move[i] + livello_cambio
                        }
                    }
                    // NON Fatto per titolo era gia conteggio non esatto del tutto ANCHE SE QUI SGANCIO E DOVREBBE ESSERE GIUSTO
                    // era 4
                    if (livello_cambio >= 3) {
                        
                        console.log('colore 6');
                        //console.log('livello_cambio: ', livello_cambio)

                        //alert('Troppi livelli, non aggiungere oltre i ...');
                        this.alert_visibility = true;
                        this.updateRelation.emit();
                        this.boxService.changeLevel = 0;
                
                
                    } else {

                        console.log('colore 7');

                    let array_push = 0;               

                    for (var _i = this.boxService.index_up; _i <= this.boxService.index_down; _i++) {          
                    
                    //OK
                    this.boxService.boxes[_i].color = '#' + this.boxService.colorArray[this.boxService.get_Box(this.box.boxId)];
                    //OK


                   this.boxService.updateLevelMapTree(this.boxService.boxes[this.boxService.get_Box(this.box.boxId) + array_push].livello, this.boxService.index_up + array_push, this.boxes_move.shift());
              
                    if (this.boxService.changeLevel != this.boxService.get_Box(this.box.boxId) + 1) {
                    this.boxService.move(this.boxService.changeLevel + array_push, this.boxService.get_Box(this.box.boxId) + 1 + array_push );
                    } 

                    array_push = array_push + 1;
                
                    }
            
                    for (var _i: any = 0; _i < this.boxService.boxes.length; _i++) {
                            this.boxService.boxes[_i].order = _i.toString();
                            this.boxService.updateBox(this.boxService.boxes[_i])
                                    .subscribe(
                                   // result => console.log(result)
            
                                    );         
                            };

                            /* this.boxService.boxes[this.boxService.changeLevel].color = '#' + this.boxService.colorArray[this.boxService.index_up]; */

                            this.boxService.boxes[this.boxService.changeLevel].color = this.boxService.boxes[this.boxService.index_up].color;
            
                            //this.onupdateMap(); 
                            this.aggiornaRelation.emit(this.index_box)
                            this.updateRelation.emit(); 
                            this.boxService.changeLevel = 0;

                            array_push = 0;
                            }
            
                    return     


                    // Fine Titolo con annidato

                }
            

                // AGGANCIO SOPRA - Sposto box che sta sotto rispetto a nuova posizione e NON ha livello agganciati

                if (this.boxService.changeLevel > this.boxService.get_Box(this.box.boxId) && (this.boxService.changeLevel == this.boxService.index_down)) {

              // NON sono con sotto livelli//

                    //console.log('Questo', this.boxService.boxes[this.boxService.get_Box(this.box.boxId)].livello + 1)
                //OK
                /* this.boxService.boxes[this.boxService.changeLevel].color = '#' + this.boxService.colorArray[this.boxService.get_Box(this.box.boxId)]; */

                

                //OK
                
                if ((this.boxService.boxes[this.boxService.get_Box(this.box.boxId)].livello) + 1 >= 3)
                {
                    this.updateRelation.emit();
                    //this.aggiornaRelation.emit(this.index_box)
                    this.alert_visibility = true;
                    //alert('Troppi livelli, non aggiungere oltre i ...');
                    this.updateRelation.emit(); 
                    this.boxService.changeLevel = 0;
                    return
                } else 
                {
                    this.boxService.boxes[this.boxService.changeLevel].color = this.boxService.boxes[this.boxService.get_Box(this.box.boxId)].color;

                    this.boxService.updateLevelMap(this.boxService.boxes[this.boxService.get_Box(this.box.boxId)].livello);

                    this.boxService.move(this.boxService.changeLevel, this.boxService.get_Box(this.box.boxId) + 1);

                

                    for (var _i: any = 0; _i < this.boxService.boxes.length; _i++) {
                        this.boxService.boxes[_i].order = _i.toString();
                        this.boxService.updateBox(this.boxService.boxes[_i])
                        .subscribe(
                          //  result => console.log(result)
            
                        );         
                    };
   
            
                //this.onupdateMap(); 
                this.updateRelation.emit(); 
                this.boxService.changeLevel = 0;

                return

                }
            }
  

            // AGGANGIO SOTTO MA senza livelli annidati

            else if (this.boxService.changeLevel < this.boxService.get_Box(this.box.boxId) && (this.boxService.changeLevel == this.boxService.index_down)) 
            {
            
                //console.log('questo caso')
            //OK
          /*   this.boxService.boxes[this.boxService.changeLevel].color = '#' + this.boxService.colorArray[this.boxService.get_Box(this.box.boxId)]; */

            this.boxService.boxes[this.boxService.changeLevel].color = this.boxService.boxes[this.boxService.get_Box(this.box.boxId)].color;

            //OK
                    
            this.boxService.updateLevelMap(this.boxService.boxes[this.boxService.get_Box(this.box.boxId)].livello);

            this.boxService.move(this.boxService.changeLevel, this.boxService.get_Box(this.box.boxId));

            //console.log('this.boxService.boxes', this.boxService.boxes)

            for (var _i: any = 0; _i < this.boxService.boxes.length; _i++) {
                this.boxService.boxes[_i].order = _i.toString();
                this.boxService.updateBox(this.boxService.boxes[_i])
                    .subscribe(
                            result => 
                            {
                                //console.log('result', result);
                                this.updateRelation.emit(); 
                    
                                this.boxService.changeLevel = 0;

                                return
                            
                            }
            
                        );         
                    };

                 
     
                    //this.onupdateMap(); 
                   /*  this.updateRelation.emit(); 
                    
                    this.boxService.changeLevel = 0;

                    return
 */
                }

                 // FINE AGGANGIO SOTTO MA senza livelli annidati
           

      // AGGANCIO SOPRA gestione annidato CON SOTTOLIVELLI - IN AGGANCIO NO SOTTOLIVELLI****** SOTTO CASO IN CUI NEL NIDO HO GRUPPI DI STESSO LIVELLO

      //QUI

 

      if (this.boxService.changeLevel > this.boxService.get_Box(this.box.boxId) && (this.boxService.boxes[this.boxService.changeLevel].livello == this.boxService.boxes[this.boxService.changeLevel + 1].livello)) {
      
        
       

        this.boxes_move.push(1);
        for (var _i = this.boxService.index_up; _i < (this.boxService.changeLevel); _i++) {
            this.boxes_move.push((this.boxService.boxes[_i+1].livello)- this.boxService.boxes[_i].livello);
        }
        let livello_cambio = 0;
        for (var i= 0; i < this.boxes_move.length; i++) {
            
            if (this.boxes_move[i]>0) {
            livello_cambio = this.boxes_move[i] + livello_cambio
            }
        }
        // conteggio non esatto del tutto
        // era 4 
        if (livello_cambio >= 3) {

            //console.log('livello_cambio: ', livello_cambio)

            this.alert_visibility = true;
            //alert('Troppi livelli, non aggiungere oltre i ...');
            this.updateRelation.emit();
            this.boxService.changeLevel = 0;
            
            
        } else {

            let array_push = 0;               

            for (var _i = this.boxService.index_up; _i <= (this.boxService.changeLevel); _i++) {          
                
                //OK

              this.boxService.boxes[_i].color =  this.boxService.boxes[this.boxService.get_Box(this.box.boxId)].color;
                //OK

                                 
               this.boxService.updateLevelMapTree(this.boxService.boxes[this.boxService.get_Box(this.box.boxId) + array_push].livello, this.boxService.index_up + array_push, this.boxes_move.shift());
          
                if (this.boxService.changeLevel != this.boxService.get_Box(this.box.boxId) + 1) {
                this.boxService.move(this.boxService.changeLevel + array_push, this.boxService.get_Box(this.box.boxId) + 1 + array_push );
                } 

                array_push = array_push + 1;
            
                }
        
            for (var _i: any = 0; _i < this.boxService.boxes.length; _i++) {
            this.boxService.boxes[_i].order = _i.toString();
            this.boxService.updateBox(this.boxService.boxes[_i])
                .subscribe(
               // result => console.log(result)
        
                    );         
                    };
        
            //this.onupdateMap(); 
            this.updateRelation.emit(); 
            this.boxService.changeLevel = 0;

            array_push = 0;
            }
        
        return        

    }


      
 // AGGANCIO SOPRA gestione annidato CON SOTTOLIVELLI - IN AGGANCIO NO SOTTOLIVELLI******

        if (this.boxService.changeLevel > this.boxService.get_Box(this.box.boxId) && (this.boxService.changeLevel != this.boxService.index_down)) {
      
           
           // console.log
            this.boxService.get_levelDown_Inside_ric(this.boxService.changeLevel, this.boxService.changeLevel);


                    if (this.boxService.boxes[this.boxService.index_down_inside + 1]) 
                        {
                        if (this.boxService.boxes[this.boxService.changeLevel].livello == this.boxService.boxes[this.boxService.index_down_inside + 1].livello) 
                            {
                                
                                this.boxService.index_down = this.boxService.index_down_inside;

                               
                            }
                        }

            this.boxes_move.push(1);


            for (var _i = this.boxService.index_up; _i < this.boxService.index_down; _i++) {
                this.boxes_move.push((this.boxService.boxes[_i+1].livello)- this.boxService.boxes[_i].livello);
            }
            let livello_cambio = 0;
            for (var i= 0; i < this.boxes_move.length; i++) {
                
                if (this.boxes_move[i]>0) {
                livello_cambio = this.boxes_move[i] + livello_cambio
                }
            }

            // conteggio non esatto del tutto
            // Era 4
            if (livello_cambio >= 3) {
                //console.log('livello_cambio: ', livello_cambio)

                this.alert_visibility = true;
                //alert('Troppi livelli, non aggiungere oltre i ...');
                this.updateRelation.emit();
                this.boxService.changeLevel = 0;
                
                
            } else {

                let array_push = 0;               

                for (var _i = this.boxService.index_up; _i <= this.boxService.index_down; _i++) {          
                    
                    //OK

                  this.boxService.boxes[_i].color =  this.boxService.boxes[this.boxService.get_Box(this.box.boxId)].color;
                    //OK

                                     
                   this.boxService.updateLevelMapTree(this.boxService.boxes[this.boxService.get_Box(this.box.boxId) + array_push].livello, this.boxService.index_up + array_push, this.boxes_move.shift());
              
                    if (this.boxService.changeLevel != this.boxService.get_Box(this.box.boxId) + 1) {
                    this.boxService.move(this.boxService.changeLevel + array_push, this.boxService.get_Box(this.box.boxId) + 1 + array_push );
                    } 

                    array_push = array_push + 1;
                
                    }
            
                for (var _i: any = 0; _i < this.boxService.boxes.length; _i++) {
                this.boxService.boxes[_i].order = _i.toString();
                this.boxService.updateBox(this.boxService.boxes[_i])
                    .subscribe(
                  //  result => console.log(result)
            
                        );         
                        };
            
                //this.onupdateMap(); 
                this.updateRelation.emit(); 
                this.boxService.changeLevel = 0;

                array_push = 0;
                }
            
            return        

        }

        //QUI

        // GESTIONE annidato con spostamento aggancio sotto !!!! 
        //Caso particolare in cui ho più nidi con box a stesso livello


         if (this.boxService.changeLevel < this.boxService.get_Box(this.box.boxId) && (this.boxService.boxes[this.boxService.changeLevel].livello == this.boxService.boxes[this.boxService.changeLevel + 1].livello)) { 
                
             
            
            this.boxes_move.push(1);
          

            let livello_cambio = 0;
            for (var i= 0; i < this.boxes_move.length; i++) {
                if (this.boxes_move[i]>0) {
                livello_cambio = this.boxes_move[i] + livello_cambio
                }
            }
            // conteggio non esatto del tutto
            //Era 4
            if (livello_cambio >= 3) {
                
                //console.log('livello_cambio: ', livello_cambio)

                this.alert_visibility = true;
                //alert('Troppi livelli, non aggiungere oltre i ...');
                this.updateRelation.emit();
                this.boxService.changeLevel = 0;
                
                
            } else {

            
                    // OK
                    this.boxService.boxes[this.boxService.changeLevel].color =  this.boxService.boxes[this.boxService.get_Box(this.box.boxId)].color;

                    // OK

                    let delta = this.boxes_move.shift();
                    
                    if (delta == 0) {delta = 1} 
                   

                    this.boxService.updateLevelMapTree_bis(this.boxService.boxes[this.boxService.get_Box(this.box.boxId)].livello , this.boxService.index_up , delta );
                 
     
                    this.boxService.move(this.boxService.changeLevel, this.boxService.get_Box(this.box.boxId))
          
             

                    for (var _i: any = 0; _i < this.boxService.boxes.length; _i++)
                        {
                            this.boxService.boxes[_i].order = _i.toString();
                            this.boxService.updateBox(this.boxService.boxes[_i])
                                .subscribe(
                                    result => 
                                    {
                                        //console.log(result);
                                        this.updateRelation.emit();   
                                        this.boxService.changeLevel = 0;
                                        return    
                                    }
                
                                );         
                        };
                
                    //this.onupdateMap();  
                  /*   this.updateRelation.emit();   
                    this.boxService.changeLevel = 0;
             */
                }              
               /*  return        */
     
                }          
        //QUI   

        // GESTIONE annidato con spostamento aggancio sotto !!!! 

        if (this.boxService.changeLevel < this.boxService.get_Box(this.box.boxId) && (this.boxService.changeLevel != this.boxService.index_down)) { 

           // console.log('sviluppo');


            this.boxService.get_levelDown_Inside_ric(this.boxService.changeLevel, this.boxService.changeLevel);

                    //let change_index_down = false;
                    if (this.boxService.boxes[this.boxService.index_down_inside + 1]) 

                      
                        {
                        if (this.boxService.boxes[this.boxService.changeLevel].livello == this.boxService.boxes[this.boxService.index_down_inside + 1].livello) 
                            {
                                //change_index_down = true;
                               // console.log('this.boxService.index_down',this.boxService.index_down);
                                this.boxService.index_down = this.boxService.index_down_inside;
                              //  console.log('this.boxService.index_down',this.boxService.index_down);
                              
                            }
                        }


            let start_level = this.boxService.boxes[this.boxService.get_Box(this.box.boxId)].livello;

            this.boxes_move.push(0);
            for (var _i = this.boxService.index_up; _i < this.boxService.index_down; _i++) {
                this.boxes_move.push((this.boxService.boxes[_i+1].livello)- this.boxService.boxes[_i].livello);
            }     
           // console.log(this.boxes_move, 'this.boxes_move')
            
            let livello_cambio = 0;
            for (var i= 0; i < this.boxes_move.length; i++) {
                if (this.boxes_move[i]>0) {
                livello_cambio = this.boxes_move[i] + livello_cambio
                }
            }
            // conteggio non esatto del tutto
            // Era 4
            if (livello_cambio >= 3) {
                
                //console.log('livello_cambio: ', livello_cambio)

                this.alert_visibility = true;
                //alert('Troppi livelli, non aggiungere oltre i ...');
                this.updateRelation.emit();
                this.boxService.changeLevel = 0;
                
                
            } else {

      
            let array_push = 0;
            
            let delta = 0;
             for (var _i = this.boxService.index_up; _i <= this.boxService.index_down; _i++) 
                {          

                    // OK
                    this.boxService.boxes[_i].color =  this.boxService.boxes[this.boxService.get_Box(this.box.boxId)].color;

                    // OK

                    //console.log('this.boxes_move', this.boxes_move);
                        
                   
                    delta = delta + this.boxes_move.shift();
                    
                   /*  if (delta == 0) {delta = 1} 
                    if (delta < 0) {delta = 1}

 */
                    
                    /* if (this.boxService.index_down_inside) {
                        if (this.boxService.index_down_inside == this.boxService.index_down) {delta = 0} 
                    } */

                    /* if (change_index_down) {
                        console.log('ccc')
                        delta = 0
                    } */
                   
                    

                    /* this.boxService.updateLevelMapTree_bis(this.boxService.boxes[this.boxService.index_up + array_push].livello , this.boxService.index_up + array_push, delta + start_level); */

                    this.boxService.updateLevelMapTree_bis(start_level, this.boxService.index_up + array_push, delta +1);

                    /* this.boxService.updateLevelMapTree_bis(1 , this.boxService.changeLevel + array_push, delta + start_level); */
                    
                 
                    array_push = array_push + 1;
                    
            }
                    
            
            this.boxService.get_levelDown_ric(this.boxService.get_Box(this.box.boxId));

           this.boxService.get_levelUp_ric(this.boxService.get_Box(this.box.boxId)); 

            if (this.boxService.index_up == this.boxService.index_down) 
               {
                    this.boxService.move(this.boxService.get_Box(this.box.boxId), this.boxService.changeLevel)
             } else {
                
               let second_index = 0;
               for (var _i = this.boxService.index_up; _i <= this.boxService.index_down; _i++)  {


                // E QUI PROBLEMA


                // corretta se singola
                     this.boxService.move(_i, this.boxService.changeLevel + second_index) 
                     second_index =+ 1;
                    //this.boxService.move(-i, this.boxService.changeLevel - 1)
               }
                
             }
             

            for (var _i: any = 0; _i < this.boxService.boxes.length; _i++)
                {
                    this.boxService.boxes[_i].order = _i.toString();
                    this.boxService.updateBox(this.boxService.boxes[_i])
                        .subscribe(
                            result => 
                            {
                               // console.log(result);
                                this.updateRelation.emit();      
                                this.boxService.changeLevel = 0;
                                array_push = 0;
                                return
                            }
                        );         
                };
                
            //this.onupdateMap();  
           /*  this.updateRelation.emit();      
            this.boxService.changeLevel = 0;
    
            array_push = 0; */
            }              
        /*     return     */   
        }          
    }

    onSubmit_2() {
        if (this.box) {
            //edit
     
            this.boxService.updateBox(this.box)
                .subscribe(
                   // result => console.log(result)

                );
    //        this.box = null;


        } else {
            // create
        //    const box = new Box(form.value.content, 'Massimo')
        //    this.boxService.addBox(box)
         //       .subscribe(
            //            data => console.log(data),
            //           error => console.error(error)
            //       );
        }

 //       form.resetForm();
    }



    mousedownContainer(event: MouseEvent) {
     //   console.log('ciaone');
        //this.downRelation.emit(event);
    }
  


    createBox(event: MouseEvent) {
   
        if (event.type == 'dblclick') {

            this.num = this.boxService.get_Boxlength() + 1;
           // console.log(this.num);
      
            const box = new Box('Content Box','Testo Box', 'Massimo',0, {top: (event.screenY),  left: (event.screenX),  height: 80, width: 200, bottom: 0, right:0 }, false);

            box.color = '#f0f0f0';
            //box.order = this.num.toString()
            box.order = this.num;
            box.stato = 2;

        
            this.boxService.addBox(box)
                .subscribe(
                  //  data => console.log(data),
                  //  error => console.error(error)
                );

        
        }
        else {
    //        console.log('sono in double click')
          //  this.downRelation.emit(event);
        }
       
    }

    createNOBox() {
        //this.rect_right_bottom = ! this.rect_right_bottom;       
        event.stopPropagation();       
    }

    //Aggiunti for Quill
    onEditorBlured(quill) {
       
        if (!this.alert_visibility) 
        {
            if (!this.rect_4_angle ) {
                this.rect_4_angle = !this.rect_4_angle;
            }  
        }
        setTimeout(() => {
            this.updateRelation.emit();
        }, 100); 
       
    
      }
    

    onEditorFocused(quill) {
        /* if (this.rect_4_angle ) {
            this.rect_4_angle = !this.rect_4_angle;
        }  */
       // this.rect_right_bottom = ! this.rect_right_bottom;
    //    console.log('editor focus!', quill);
      }
    
    onEditorCreated(quill) 
        {
            this.editor = quill
            console.log('this.editor ', this.editor);
         }

      

    positionBox(new_height, new_width, flag_width) {    

        let change_width;
        let change_height;

        // Inserito per fissare larghezza max
        if (new_width > 200) {
            change_width = 200;
        }

         // Inserito per fissare larghezza max

        const posizione = new BoxPosition (this.boxService.boxes[0].rectangle.top, this.boxService.boxes[0].rectangle.left, 0);
        
         this.boxService.addStyle(posizione);

        // è stato posizionato (resize) a mano e quindi non va sul cerchio
        if (this.box.inMap) 
            {
                change_height = this.box.rectangle.height;
                // altrimenti va capo con min-width

                //change_width = this.box.rectangle.width
            } 

        if (flag_width && this.box.inMap)
            {
                
                change_height = new_height;
                change_width = new_width;
                this.init_width = false;
    
            
            } 
            else 
            {
                
                change_height = new_height;     
               
            }

        if (this.box.rectangle.left != 999) {
     

            this.style[this.number_box] = {

             position: 'absolute',
        
             left: `${this.box.rectangle.left }px`,
             top: `${this.box.rectangle.top}px`,
             
             width: `${change_width}px`,
             height: `${change_height}px`
             
            }
            //Mah
            this.boxService.secondaryRadiusX = this.box.rectangle.left 
            this.boxService.secondaryRadiusY = this.box.rectangle.top;
            //Mah
            } 
            else 
            {
       
            // a che serve questa istruzione muhhh
            this.num = this.boxService.get_Boxlength() + 1;    
        
           if (!this.box.titolo) {
   
            this.position_box = this.circle(this.boxService.get_Boxlength(), this.index_box);

            //INIZIO
            let x_destra = 0;
            let x_sinistra = 0;

            //'Alto Sinistra'
            if ((this.boxService.style[0].left >= this.position_box.x) && (this.boxService.style[0].top >= this.position_box.y) )  {
                   //oggi// x_destra = x_destra - 100;
                   this.position_box.x = this.position_box.x + x_destra
            //   console.log('Alto Sinistra');
               }
            
            //'Basso Sinistra'
            if ((this.boxService.style[0].left >= this.position_box.x) && (this.boxService.style[0].top < this.position_box.y) ) {
                  //  console.log('Basso Sinistra');
                }
       
           //'Basso Destra'
            if ((this.boxService.style[0].left < this.position_box.x) && (this.boxService.style[0].top >= this.position_box.y) ) {
           
               // console.log('Basso Destra');
            }

           //'Alto Destra'
             if ((this.boxService.style[0].left < this.position_box.x) && (this.boxService.style[0].top < this.position_box.y) ) {
                //oggi//  x_destra = x_destra + 100;
                this.position_box.x = this.position_box.x + x_destra
           // console.log('Alto Destra');
             }

         //Fine
       
            this.style[this.number_box] = {
                position: 'absolute',
                left: `${this.position_box.x}px`,
                top: `${this.position_box.y}px`,
                
                // cambiamo per fissare larghezza max a 200?
                //width: `${200}px`,
                width: `${change_width}px`,
               
                //height: `${change_height}px`,
                // cambiamo per fissare larghezza max a 200?

                ////height: `${new_height + 20}px`
                   
              }    
              const posizione = new BoxPosition (this.position_box.y, this.position_box.x, this.index_box);
             
              this.boxService.addStyle(posizione);
        
              
            } else if (this.box.titolo) {
                let baricentro = this.boxService.getBaricentro();
                console.log('Baricentro: ', baricentro);
                
                this.style[this.number_box] = {
                    position: 'absolute',
                    // left: `${this.box.rectangle.left}px`,
                    // top: `${this.box.rectangle.top}px`,


                    left: `${baricentro[0]}px`,
                    top: `${baricentro[1]}px`,


                    //width: `${new_width + 20}px`,
                   // width: `${this.box.rectangle.width}px`,
                    //height: `${80}px`
                   // height: `${new_height + 20}px`
                   height: `${change_height}px`,
                   width: `${change_width}px`
                  }  
                  const posizione = new BoxPosition (this.box.rectangle.top, this.box.rectangle.left, this.index_box);
                  
                  this.boxService.addStyle(posizione);
             }
         }

         

     }
    
      //onContentChanged({ quill, html, text }) {
        onContentChanged(event) {
       
        if (event.text.length != 1)
        {
 
          this.box.content = event.html; 

          this.positionBox(event.editor.container.clientHeight, event.editor.container.clientWidth, false);
        
          this.init_width = true;
     
          this.onupdateMappa(this.box);
         // this.updateRelation.emit(); // è inutile
        }
      }


      onupdateMappa(box) {
        
         this.boxService.updateBox(box)
         .subscribe(
             //result => console.log(result)
         );      
     }


     onupdateMap() {

    
    }    
}