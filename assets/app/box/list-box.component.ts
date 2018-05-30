import {
    Component, ElementRef, OnInit, ViewChild, ViewChildren, QueryList, AfterViewInit,HostListener,
    ContentChild, AfterContentChecked, AfterContentInit, AfterViewChecked, Renderer2, ChangeDetectorRef
} from "@angular/core";

import { ActivatedRoute} from "@angular/router";

import {Box} from "./box.model";
import {BoundingRectangle} from "./rectangle.model";
import {BoxService} from "./box.service";
import {BoxComponent} from "./box.component"

class Position {
    constructor(public left: number, public top: number) { }
}

class Dimension {
    constructor(public height: number, public width: number) {}
}

@Component({
  selector: 'app--box-list',
  templateUrl: './list-box.component.html',
  styleUrls: ['./list-box.component.css']
})

export class ListBoxComponent implements OnInit, AfterContentInit, AfterViewInit, AfterContentChecked, AfterViewChecked {
    
      boxes: Box[] = [];
      @ViewChildren(BoxComponent) boxComponent: QueryList<BoxComponent>;
    //  @ViewChild('box0') titolo: ElementRef;
      @ViewChild(BoxComponent) titolo: BoxComponent;
      @ViewChild('svgContainer') svgContainer: ElementRef;
      @ViewChild('Container') Container: ElementRef;
      
      @ViewChildren('line') line: QueryList<ElementRef>;    
      
      public startX= [0];
      public startY= [0];

      public endXNull;
      public endYNull;
      public startXNull;
      public startYNull;
      
      public endX = [0];
      public endY= [0];
      public svgTop;
      public svgLeft;
      public svgHeight: number;
      public svgWidth: number;
      public strokeWidth;
      public startCoord: Position[] = [null];
      public endCoord: Position[] = [null];
      public startElem: Dimension[] = [null];
      public endElem: Dimension[] = [null];
      public box_found;

      public change_made: boolean = true;


  
      private centreSX;
      private centreSY;
      private centreEX;
      private centreEY;
      private orientation = 'auto';
      id_mappa: number;
      private isDown: boolean= false;
      private index_relation: number;
      private offset: number[];
      private max_x_start = 0;
      private max_x_end = 0;
      private max_y_start = 0;
      private max_y_end = 0;
     /*  private first_time_view: boolean; */
      private aleady_checked = 0;

     // private test_collide = false;
     progress = 'progressing';
      
   

  constructor(private route: ActivatedRoute, private boxService: BoxService, private renderer: Renderer2, private cd: ChangeDetectorRef) {

    
    this.change_made = true;
    this.route.params.subscribe (
        params => {
            this.id_mappa = +params['id'];
        }
    );     
  }

/* onResize(event) {
    console.log(event);
    console.log("width:" + event.target.innerWidth);
    console.log("height:" + event.target.innerHeight);
    this.onupdateRelation();
}  */

private mylatesttap;

getRandomArbitrary(min, max) {
    //console.log('Random: ', Math.round(Math.random() * (max - min) + min))
    return Math.round(Math.random() * (max - min) + min);

  }



 doubletap(event: any) {

   var now = new Date().getTime();
   var timesince = now - this.mylatesttap;

   if((timesince < 600) && (timesince > 0)){

    // double tap   
    //console.log('Double Tap');
    this.createBox(event);


   } 

   else
       
   {
            // too much time to be a doubletap
           // console.log(' No Double Tap')
         
    }

   this.mylatesttap = new Date().getTime();

}

@HostListener('document:touchcancel', ['$event'])
onTouchCancel(event: any) {

    this.isDown = false;
    this.index_relation = null;
    this.boxService.changeLevel = 0; 

}

@HostListener('document:touchend', ['$event'])
onTouchEnd(event: any) {


    this.isDown = false;
    //this.index_relation = null;
    //this.boxService.changeLevel = 0; 

    //console.log('touch end', event.changedTouches[0].clientX, this.boxComponent.toArray()[1]);

   let x_found: boolean = false;
   let y_found: boolean = false;
   

    for (var i=0; i<=(this.boxComponent.toArray().length - 1); i++) {

        //console.log('Box Style Left',this.boxComponent.toArray()[i].style[this.boxService.boxes[i].boxId].left);

        //console.log('Box Style Top',this.boxComponent.toArray()[i].style[this.boxService.boxes[i].boxId].top);

       

        if ((event.changedTouches[0].clientX > parseInt(this.boxComponent.toArray()[i].style[this.boxService.boxes[i].boxId].left, 10) && (event.changedTouches[0].clientX < (parseInt(this.boxComponent.toArray()[i].style[this.boxService.boxes[i].boxId].left, 10) + (parseInt(this.boxComponent.toArray()[i].style[this.boxService.boxes[i].boxId].width, 10)))))) 
            {
                
                x_found = true;
                
            }

        if ((event.changedTouches[0].clientY > parseInt(this.boxComponent.toArray()[i].style[this.boxService.boxes[i].boxId].top, 10) && (event.changedTouches[0].clientY < (parseInt(this.boxComponent.toArray()[i].style[this.boxService.boxes[i].boxId].top, 10) + (parseInt(this.boxComponent.toArray()[i].style[this.boxService.boxes[i].boxId].height, 10)))))) 
            {
                y_found = true;
                
            }

        if (x_found && y_found)
            
            {
                //console.log('Torvato il box num: ', i);
                this.box_found = i;
            }

            x_found = false;
            y_found = false;
        }

        if (this.boxComponent.toArray()[this.box_found]) {
        this.boxComponent.toArray()[this.box_found].aumentaLivello();
        this.onupdateRelation();
        // sarebbe meglio aggiornare solo la cambiata ma non va bene
        }

        this.isDown = false;
        this.index_relation = null; 
        this.boxService.changeLevel = 0;
   
}

notouchstart($event) 
    {
        //console.log('SVG: ', event)
    }



@HostListener('touchstart', ['$event'])
onTouchStart(event: any) {

    this.doubletap(event);
    
    console.log('onTouchStart')

    //event.preventDefault();
    //event.stopPropagation();

   // console.log( event.changedTouches[0].target);

    if (event.changedTouches[0].target.id == 'linea1') 
        {
            this.index_relation = 1;
            this.boxService.changeLevel = 1;
      //      console.log('linea1')
        }
    
    if (event.changedTouches[0].target.id == 'linea2') 
        {
            this.index_relation = 2;
            this.boxService.changeLevel = 2;
      //      console.log('linea2')
        }
    
    if (event.changedTouches[0].target.id == 'linea3') 
        {
            this.index_relation = 3;
            this.boxService.changeLevel = 3;
      //      console.log('linea3')
        }
    
    if (event.changedTouches[0].target.id == 'linea4') 
        {
            this.index_relation = 4;
            this.boxService.changeLevel = 4;
     //       console.log('linea4')
        }
    
        

    if (this.index_relation) {
      
        this.isDown = true;



        this.offset = [
          this.line.toArray()[this.index_relation].nativeElement.getBoundingClientRect().left - event.changedTouches[0].clientX,
          this.line.toArray()[this.index_relation].nativeElement.getBoundingClientRect().top - (this.line.toArray()[this.index_relation].nativeElement.getBoundingClientRect().top)/2 - event.changedTouches[0].clientY
      ];
  }
   
}

@HostListener('window:resize', ['$event'])
Resize(event: any) {

    //console.log('Resize Listener');
    //this.onupdateRelation();

    this.boxService.boxes[0].rectangle.left = window.innerWidth/2 - 100;

    let min_x: number = window.innerWidth;
    let max_x: number = 0;


    for (var i=0; i<=(this.boxComponent.toArray().length - 1); i++) 
        {
            this.boxComponent.toArray()[i].positionBox(this.boxComponent.toArray()[i].style[this.boxService.boxes[i].boxId].height, this.boxComponent.toArray()[i].style[this.boxService.boxes[i].boxId].width, false);

            
            min_x = Math.min((min_x), parseInt(this.boxComponent.toArray()[i].style[this.boxService.boxes[i].boxId].left, 10));

            
            max_x = Math.max((max_x), ((parseInt(this.boxComponent.toArray()[i].style[this.boxService.boxes[i].boxId].left, 10) + parseInt(this.boxComponent.toArray()[i].style[this.boxService.boxes[i].boxId].width, 10))));

            
        }

        
     //   console.log('min_x: ', min_x, 'max_x: ',  max_x);

        let diff_x = max_x - min_x;
        let diff_width = (window.innerWidth - diff_x)/2;

  //      console.log('diff_x: ', diff_x, 'diff_width: ', diff_width);

        //  this.boxService.boxes[0].rectangle.left = window.innerWidth/2 - 100 + diff_width;
        
        // this.svgWidth = window.innerWidth;

       

        
        
        
        
        //  for (var i=1; i<=(this.boxComponent.toArray().length - 1); i++) 
        // {
        //     //this.boxService.boxes[i].rectangle.left = this.boxService.boxes[i].rectangle.left - diff_width;
        //     this.boxComponent.toArray()[i].position_box.x = this.boxComponent.toArray()[i].position_box.x - diff_width;
        
        // } 


        /* for (var i=0; i<=(this.boxComponent.toArray().length - 1); i++) 
        {
            this.boxComponent.toArray()[i].positionBox(this.boxComponent.toArray()[i].style[this.boxService.boxes[i].boxId].height, this.boxComponent.toArray()[i].style[this.boxService.boxes[i].boxId].width, false);
            
        } */


        this.onupdateRelation();

    
}

@HostListener('document:touchmove', ['$event'])
onTouchMove(event: any) {
    //event.preventDefault();
    //event.stopPropagation();
    if (this.isDown && this.index_relation) {
        
       
 
          if ((this.boxComponent.toArray()[this.index_relation].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().left) > this.boxComponent.toArray()[this.get_titolo()].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().left) {
 
             this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'x1', (event.changedTouches[0].pageX - this.svgContainer.nativeElement.getBoundingClientRect().left - window.pageXOffset).toString());
 
             this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'y1', (event.changedTouches[0].pageY - this.svgContainer.nativeElement.getBoundingClientRect().top - window.pageYOffset).toString());
 
          } else {
 
             this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'x2', (event.changedTouches[0].pageX - this.svgContainer.nativeElement.getBoundingClientRect().left - window.pageXOffset).toString());
             
             this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'y2', (event.changedTouches[0].pageY - this.svgContainer.nativeElement.getBoundingClientRect().top - window.pageYOffset).toString());
              
          }                          
     }  
   
  
}

@HostListener('document:touchend', ['$event'])
onTouchend(event: any) {
    //event.preventDefault();

    //console.log('end')
    //event.stopPropagation();
    if (this.isDown && this.index_relation) {
         
 
          if ((this.boxComponent.toArray()[this.index_relation].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().left) > this.boxComponent.toArray()[this.get_titolo()].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().left) {
 
             this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'x1', (event.changedTouches[0].pageX - this.svgContainer.nativeElement.getBoundingClientRect().left - window.pageXOffset).toString());
 
             this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'y1', (event.changedTouches[0].pageY - this.svgContainer.nativeElement.getBoundingClientRect().top - window.pageYOffset).toString());
 
          } else {
 
             this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'x2', (event.changedTouches[0].pageX - this.svgContainer.nativeElement.getBoundingClientRect().left - window.pageXOffset).toString());
             
             this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'y2', (event.changedTouches[0].pageY - this.svgContainer.nativeElement.getBoundingClientRect().top - window.pageYOffset).toString());
              
          }                          
     }  
   
  
}
 
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: any) {
      // 1. Se ho cliccato una relazione
      //
    
      if (this.index_relation) {
              

            this.endXNull = this.endX[this.index_relation];
            this.endYNull =  this.endY[this.index_relation];

            this.startXNull = this.startX[this.index_relation];
            this.startYNull =  this.startY[this.index_relation]; 
            
              this.isDown = true;             

              this.offset = [
                this.line.toArray()[this.index_relation].nativeElement.getBoundingClientRect().left - event.clientX,
                this.line.toArray()[this.index_relation].nativeElement.getBoundingClientRect().top - (this.line.toArray()[this.index_relation].nativeElement.getBoundingClientRect().top)/2 - event.clientY
            ];         
        }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
      
        console.log('Mouse UP Listbox, this.index_relation: ', this.index_relation);
         
      //this.onupdateRelation_bis(this.index_relation);
      

      // Se non aggancio su aumentaLivello Box
      if (this.index_relation != null && this.boxService.changeLevel != 0)
      {
        
        

        this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'y1', this.startYNull);
        this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'y2', this.endYNull);

        this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'x1', this.startXNull);
        this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'x2', this.endXNull);

        //this.onupdateRelation_bis(this.index_relation);
    
      }
       // Se non aggancio su aumentaLivello Box

      this.isDown = false;
      
      this.index_relation = null;
      this.boxService.changeLevel = 0;
      
      
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: any) {

    //event.preventDefault();     

    if (this.isDown && this.index_relation) {

        let x = Math.abs((this.line.toArray()[this.index_relation].nativeElement.x1.baseVal.valueInSpecifiedUnits - this.boxComponent.toArray()[this.index_relation].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().left)) > Math.abs((this.line.toArray()[this.index_relation].nativeElement.x2.baseVal.valueInSpecifiedUnits - this.boxComponent.toArray()[this.index_relation].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().left)) ? "x1" : "x2";

        if (this.determineOrientation(this.index_relation) === "vertical") {
                if (x == "x1") {

                    if (this.boxComponent.toArray()[this.index_relation].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().left > this.boxComponent.toArray()[0].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().left)  

                    {
                        this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'x1', (event.pageX - this.svgContainer.nativeElement.getBoundingClientRect().left - window.pageXOffset).toString());

                        this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'y1', (event.pageY - this.svgContainer.nativeElement.getBoundingClientRect().top - window.pageYOffset).toString());
                    }
                    else 
                    {
                        this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'x2', (event.pageX - this.svgContainer.nativeElement.getBoundingClientRect().left - window.pageXOffset).toString());

                        this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'y2', (event.pageY - this.svgContainer.nativeElement.getBoundingClientRect().top - window.pageYOffset).toString());
                    }

                    

                 } else {

                    if (this.boxComponent.toArray()[this.index_relation].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().left < this.boxComponent.toArray()[0].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().left) 

                    {
                        this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'x2', (event.pageX - this.svgContainer.nativeElement.getBoundingClientRect().left - window.pageXOffset).toString());
            
                        this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'y2', (event.pageY - this.svgContainer.nativeElement.getBoundingClientRect().top - window.pageYOffset).toString());
                    }
                    else
                    {
                        this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'x1', (event.pageX - this.svgContainer.nativeElement.getBoundingClientRect().left - window.pageXOffset).toString());
            
                        this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'y1', (event.pageY - this.svgContainer.nativeElement.getBoundingClientRect().top - window.pageYOffset).toString());
                    }
           
                 }
            }
            
            else 

            { 
                let y = Math.abs((this.line.toArray()[this.index_relation].nativeElement.y1.baseVal.valueInSpecifiedUnits - this.boxComponent.toArray()[this.index_relation].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().top)) > Math.abs((this.line.toArray()[this.index_relation].nativeElement.y2.baseVal.valueInSpecifiedUnits - this.boxComponent.toArray()[this.index_relation].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().top)) ? "y1" : "y2";


                 if (y == "y2") {

                    if (this.boxComponent.toArray()[this.index_relation].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().top > this.boxComponent.toArray()[0].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().top) 

                    {
                        this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'x2', (event.pageX - this.svgContainer.nativeElement.getBoundingClientRect().left - window.pageXOffset).toString());
    
                        this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'y2', (event.pageY - this.svgContainer.nativeElement.getBoundingClientRect().top - window.pageYOffset).toString()); 
                    }
                    else 

                    {
                        this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'x1', (event.pageX - this.svgContainer.nativeElement.getBoundingClientRect().left - window.pageXOffset).toString());
    
                        this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'y1', (event.pageY - this.svgContainer.nativeElement.getBoundingClientRect().top - window.pageYOffset).toString()); 
                    }

                    
    
                  } 
                      else 
                  { 
                    
                    if (this.boxComponent.toArray()[this.index_relation].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().top < this.boxComponent.toArray()[0].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().top) 

                   
                        {
                           
                            this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'x2', (event.pageX - this.svgContainer.nativeElement.getBoundingClientRect().left - window.pageXOffset).toString());
                
                            this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'y2', (event.pageY - this.svgContainer.nativeElement.getBoundingClientRect().top - window.pageYOffset).toString());
                        }
                        else 
                        {
                            
                            this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'x1', (event.pageX - this.svgContainer.nativeElement.getBoundingClientRect().left - window.pageXOffset).toString());
                
                            this.renderer.setAttribute(this.line.toArray()[this.index_relation].nativeElement, 'y1', (event.pageY - this.svgContainer.nativeElement.getBoundingClientRect().top - window.pageYOffset).toString());
                        }
    
                    
                    
                    } 
                }   
        }  
    
}

ontouchstartR(event: MouseEvent, i: number) {
    this.boxService.changeLevel = i;
    this.boxService.changeLevelStatus = this.boxes[i].livello;
    this.index_relation = i;
  /*   console.log('Relations', event, ' ', i, this.boxes);
    console.log('Relations',this.boxService.get_levelUp(i,this.id_mappa)); */
}

onmousedownR(event: MouseEvent, i: number) {
    this.boxService.changeLevel = i;
    this.boxService.changeLevelStatus = this.boxes[i].livello;
    this.index_relation = i;
    //console.log('Relations', event, ' ', i, this.boxes);
    //console.log('Relations',this.boxService.get_levelUp(i,this.id_mappa)); 
}

private getPosition(x: number, y: number) {
    return new Position(x, y);
}


ngOnInit(){

    //this.change_made = true;
    //this.first_time_view = false;
    //this.test_collide = false

    this.boxService.cleanStyle();
    //this.boxService.setColor();
    this.boxService.svgTop = this.svgContainer.nativeElement.getBoundingClientRect().top;
    this.boxService.svgLeft = this.svgContainer.nativeElement.getBoundingClientRect().left;

   // console.log(window.innerWidth,'window.innerWidth');


    this.init();
    this.connectSetup();

    setTimeout(() => {
        
      }, 2000);
    
    this.boxService.getBoxes(this.id_mappa).subscribe(
        (boxes: Box[]) => {
            
            this.boxes = boxes;
            console.log(this.boxes, 'list box');
            //this.progress = 'finished';
        }
        
        
    );

    
   // console.log('Stampa boxesown e boxes -- Before',this.boxes, this.boxService.boxesOwn);

   // non so vedere bene, no bisogna inserire il numero corretto prima di questa modifica
   /*  this.boxService.getBoxesOwn(this.id_mappa);
    this.boxes = this.boxService.boxesOwn;
    console.log('Stampa boxesown e boxes -- After',this.boxes, this.boxService.boxesOwn); */
 
}

    get_titolo() {
        
         for (var i=0; i<(this.boxes.length); i++) {
            /* if (this.boxes[i].titolo && (this.boxes[i].numero_mappa == this.id_mappa)) { */
                if (this.boxes[i].titolo) {
                    return i
                }  
              }
        }


    ngAfterViewInit() {    
        //console.log('ngAfterViewInit')
        //this.onupdateRelation();
        
    }

    ngAfterViewChecked() {

      
        if (this.change_made) 
            {
               
            
            //  this.onupdateRelation();
            // da errore
            setTimeout(() => {
                    this.onupdateRelation();
            }, 100); 

            }
            // NO rallenta e non risetta su aumentaLivello, inutile
            //this.onupdateRelation();
        }

    ngOnChanges() {
        
           
       
        }

    onupdateRelation() {
             // if (this.change_made) {

        console.log('Udate relations')
        if ((this.boxes.length>1) ) {
    
            for (var i=0; i<this.boxes.length; i++) {

            // E necessario questo test? SIII
                if (!this.boxes[i].titolo) { 
                           
                    this.startCoord[i]= new Position(0, 0);
                    this.endCoord[i]= new Position(0, 0);
                    this.startElem[i] = new Dimension(0,0);
                    this.endElem[i] = new Dimension(0,0);
                             
                    this.createRelations(i, this.boxes[i].color)}   
                            
                    }
                    this.progress = 'finished';
                    this.change_made = false; 
                } 
    
                
        }

    onupdateRelation_bis(i: number) {
          
            this.boxService.get_levelDown_ric(i);
            this.boxService.get_levelUp_ric(i);
        
                if ((this.boxes.length>1) ) {                      
                                   
                    this.startCoord[i]= new Position(0, 0);
                    this.endCoord[i]= new Position(0, 0);
                    this.startElem[i] = new Dimension(0,0);
                    this.endElem[i] = new Dimension(0,0);
                    if ((this.boxService.index_up == this.boxService.index_down) ) 
                        { 
                        this.createRelations(i, this.boxes[i].color)
                        }  

                    else {
                        for (var i:number = this.boxService.index_up; i <= this.boxService.index_down; i++) 
                        {
                            this.createRelations(i, this.boxes[i].color)
                        }
                    }
                }
                       
            }

    ngAfterContentChecked() {}

    ngAfterContentInit() {} 
    
    init() {
        this.svgHeight = 0;
        this.svgWidth = 0;
        }

    connectSetup() {
    
        this.strokeWidth = 4;
        
        }

    determineOrientation(i: number) {

        // If first element is lower than the second, swap.
        if (this.startCoord[i].top > this.endCoord[i].top) {
            var temp = this.startCoord[i];
            this.startCoord[i] = this.endCoord[i];
            this.endCoord[i] = temp;

        }
        
        var startBottom = this.startCoord[i].top;
        var endTop = this.endCoord[i].top;
        var verticalGap = endTop - startBottom;
        // If first element is more left than the second, swap.
        if (this.startCoord[i].left > this.endCoord[i].left) {
            var temp2 = this.startCoord[i];
            this.startCoord[i] = this.endCoord[i];
            this.endCoord[i] = temp2;
        }
       
        var startRight = this.startCoord[i].left;
        var endLeft = this.endCoord[i].left;
        var horizontalGap = endLeft - startRight;

      
        
        return horizontalGap > verticalGap ? "vertical" : "horizontal";

    }

    set_Start_End(start: any, end: any, i) {

        

        this.startCoord[i] = start;
        
        this.endCoord[i] = end;
        
        this.startElem[i].width = start.width;
        this.startElem[i].height = start.height;
        this.endElem[i].width = end.width;
        this.endElem[i].height = end.height;
    
    }

    swap(first: number, second: number) {
        return first > second;

    }

    init_relations(i) {       

        if (this.boxComponent.toArray()[i].box.livello == 0) {         

            this.set_Start_End(this.boxComponent.toArray()[this.get_titolo()].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect(), this.boxComponent.toArray()[i].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect(), i)

        } 
            else
        {
            
            this.set_Start_End(this.boxComponent.toArray()[this.boxService.get_levelUp(i, this.id_mappa)].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect(), this.boxComponent.toArray()[i].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect(), i)
        }
 
    }

    init_orientation(i, swap) {

        if (this.boxComponent.toArray()[i].box.livello == 0) {
            if (this.orientation === 'vertical') {
                // If first element is more left than the second.
                swap = this.swap(this.boxComponent.toArray()[i].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().left, this.boxComponent.toArray()[this.get_titolo()].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().left)
                
            } else { // Horizontal
                // If first element is lower than the second.
                swap = this.swap(this.boxComponent.toArray()[i].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().top, this.boxComponent.toArray()[this.get_titolo()].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().top);
            }} else {
                if (this.orientation === 'vertical') {
                    // If first element is more left than the second.
                    swap = this.boxComponent.toArray()[i].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().left > this.boxComponent.toArray()[this.get_titolo()].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().left;
                } else { // Horizontal
                    // If first element is lower than the second.
                    swap = this.swap(this.boxComponent.toArray()[i].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().top, this.boxComponent.toArray()[this.get_titolo()].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().top);
                }
    
            }

            return swap;

    }
    
    setSVGWidth() {

        if ((this.svgWidth) < (Math.max((this.max_x_start), (this.max_x_end)) + this.strokeWidth))  {
            

            //this.svgWidth = (Math.max(this.max_x_start), (this.max_x_end)) + this.strokeWidth;
            this.svgWidth = window.innerWidth;
            
            //this.svgWidth = 1026; NOOO

        }
       
    }

    setSVGHeight() {

        if ((this.svgHeight) < (Math.max((this.max_y_start), (this.max_y_end)) + this.strokeWidth))
        { 
             //this.svgHeight = (Math.max((this.max_y_start), (this.max_y_end))) + this.strokeWidth; 
           this.svgHeight = window.innerHeight;
        }

    }

    doElsCollide(el1, el1Object, i) {

        let step = 5;
       
        if (this.change_made) {
        
    
        console.log('Collide')
        for (var y=i+1; y<=(this.boxComponent.toArray().length - 1); y++) {
       //for (var y=0; y<=(this.boxComponent.toArray().length - 1); y++) {

        //for (var y:number = this.boxService.index_up; y <= this.boxService.index_down; y++)  {
            if (y != i)
                {

                    let el1_offsetBottom = parseInt(el1Object.style[this.boxService.get_BoxId(i)].top, 10) + parseInt(el1Object.style[this.boxService.get_BoxId(i)].height, 10);

                    let el1_offsetRight = parseInt(el1Object.style[this.boxService.get_BoxId(i)].left, 10) + parseInt(this.boxComponent.toArray()[i].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().width, 10);
          
                
                    let el2_offsetBottom =  parseInt(this.boxComponent.toArray()[y].style[this.boxService.get_BoxId(y)].top, 10) +  parseInt(this.boxComponent.toArray()[y].style[this.boxService.get_BoxId(y)].height, 10);

                    let el2_offsetRight =  parseInt(this.boxComponent.toArray()[y].style[this.boxService.get_BoxId(y)].left, 10) + parseInt(this.boxComponent.toArray()[y].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect().width, 10);

             
                    if (!((el1_offsetBottom < parseInt(this.boxComponent.toArray()[y].style[this.boxService.get_BoxId(y)].top, 10)) || (parseInt(el1Object.style[this.boxService.get_BoxId(i)].top, 10) > el2_offsetBottom) || (el1_offsetRight < parseInt(this.boxComponent.toArray()[y].style[this.boxService.get_BoxId(y)].left, 10)) || (parseInt(el1Object.style[this.boxService.get_BoxId(i)].left, 10) > el2_offsetRight)) )
                        
                         {
                           
                            //this.test_collide = true;

                            // Quadrante basso sinistra
                            
                             if ((this.boxComponent.toArray()[y].style[this.boxService.get_BoxId(y)].left >= this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].left) && (this.boxComponent.toArray()[y].style[this.boxService.get_BoxId(y)].top >= this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].top) )  

                                 {
                              //  console.log('basso sinistra');

                               /*  if ((this.getRandomArbitrary(1, 2) == 1) && parseInt(this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].top, 10) >= 300)  */

                                    if ((this.getRandomArbitrary(1, 2) == 2 )) 
                                
                                

                                    {
                                    
                                        this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].top = (parseInt(this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].top, 10) - step) + 'px';
                                    
                                    } 
                                    /* else if (parseInt(this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].left, 10) >= 30) */

                                    else 
                                    {
                                        this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].left = (parseInt(this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].left, 10) + step) + 'px';
                                    
                                    } 
                             }

                           

                            if ((this.boxComponent.toArray()[y].style[this.boxService.get_BoxId(y)].left >= this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].left) && (this.boxComponent.toArray()[y].style[this.boxService.get_BoxId(y)].top < this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].top) )  

                       // Quadrante alto sinistra
                               {

                              //  console.log('alto sinistra');

                              /*   if ((this.getRandomArbitrary(1, 2) == 1) && parseInt(this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].top, 10) >= 300)  */

                                if ((this.getRandomArbitrary(1, 2) == 2) )       

                                {
                                    
                                    this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].top = (parseInt(this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].top, 10) + step) + 'px';
                                    
                                } 
                                    /* else if (parseInt(this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].left, 10) >= 30) */

                                    else 
                                {
                                    this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].left = (parseInt(this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].left, 10) + step) + 'px';
                                    
                                }  
                               }


                        if ((this.boxComponent.toArray()[y].style[this.boxService.get_BoxId(y)].left < this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].left) && (this.boxComponent.toArray()[y].style[this.boxService.get_BoxId(y)].top < this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].top) )  

                       // Quadrante alto destra
                           {
                              //  console.log('alto destra');

                                /* if ((this.getRandomArbitrary(1, 2) == 1) && parseInt(this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].top, 10) >= 300)  */ 
                                if ((this.getRandomArbitrary(1, 2) == 2) ) 
                               

                                {
                                
                                    this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].top = (parseInt(this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].top, 10) + step) + 'px';
                                
                                } 
                                /* else if (parseInt(this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].left, 10) >= 30) */

                                else 
                                {
                                    this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].left = (parseInt(this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].left, 10) - step) + 'px';
                                
                                } 
                            

                           }


                        if ((this.boxComponent.toArray()[y].style[this.boxService.get_BoxId(y)].left < this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].left) && (this.boxComponent.toArray()[y].style[this.boxService.get_BoxId(y)].top >= this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].top) )  

                       // Quadrante basso destra 

                           {
                          //      console.log('basso destra');

                             /*    if ((this.getRandomArbitrary(1, 2) == 1) && parseInt(this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].top, 10) >= 300)  */

                                if ((this.getRandomArbitrary(1, 2) == 2)  ) 
                                {
                            
                                    this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].top = (parseInt(this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].top, 10) - step) + 'px';
                            
                                } 
                                /*     else if (parseInt(this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].left, 10) >= 30) */

                                else 

                                {
                                    this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].left = (parseInt(this.boxComponent.toArray()[i].style[this.boxService.get_BoxId(i)].left, 10) + step) + 'px';
                            
                                }   

                           }                          
                            
                           // if (i<= (this.boxComponent.toArray().length - 2)) 
                           // {
                        
                         this.doElsCollide(this.boxComponent.toArray()[i].elementRef.nativeElement.querySelector('.rectangle'), this.boxComponent.toArray()[i], i); 

                    
                           
                        }
                    }     
                }
            }
       // }
    }
    

    createRelations(i, stroke) {

    //console.log('createrelations')

    var swap: boolean;
    //06 marzo
    this.init_relations(i);
    //06 marzo

    // Tolta sembra inutile

      // Orientation not set per path and/or default to global "auto".
      // farlo sempre

    
    //this.doElsCollide(this.boxComponent.toArray()[i].elementRef.nativeElement.querySelector('.rectangle'), this.boxComponent.toArray()[i], i)

       // if (this.orientation != "vertical" && this.orientation != "horizontal") {
    //this.orientation = this.determineOrientation(i);
       // }

    //06 marzo
    this.orientation = this.determineOrientation(i);
    //06 marzo
    swap = this.init_orientation(i, swap)
        
    this.svgTop = this.svgContainer.nativeElement.getBoundingClientRect().top;
    this.svgLeft = this.svgContainer.nativeElement.getBoundingClientRect().left;

        // Get (top, left) coordinates for the two elements.
        //*     var startCoord = $startElem.offset();
        //*     var endCoord = $endElem.offset();
        
        
         
    if (this.boxComponent.toArray()[i].box.livello == 0) {

        if (swap) {
       
            this.startCoord[i] = this.boxComponent.toArray()[this.get_titolo()].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect();

            this.endCoord[i] = this.boxComponent.toArray()[i].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect();      

            this.set_Start_End(this.startCoord[i], this.endCoord[i], i)

            } else
            
            {

            this.startCoord[i] = this.boxComponent.toArray()[i].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect();

            this.endCoord[i] = this.boxComponent.toArray()[this.get_titolo()].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect();         

            this.set_Start_End(this.startCoord[i], this.endCoord[i], i)
                
            }

        } else {
                      
            if (swap) {
                        
                this.startCoord[i] = this.boxComponent.toArray()[this.boxService.get_levelUp(i, this.id_mappa)].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect();

                this.endCoord[i] = this.boxComponent.toArray()[i].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect();
         
                this.set_Start_End(this.startCoord[i], this.endCoord[i], i)
                
            } else {
             
                this.startCoord[i] = this.boxComponent.toArray()[i].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect();

                this.endCoord[i] = this.boxComponent.toArray()[this.boxService.get_levelUp(i, this.id_mappa)].elementRef.nativeElement.querySelector('.rectangle').getBoundingClientRect();
               
                this.set_Start_End(this.startCoord[i], this.endCoord[i], i)
                
            }
        }

        // Centre path above/below or left/right of the (middle, problem witrh resize) element.
        this.centreSX = 0.5;
        this.centreSY = 1;
        this.centreEX = 0.5;
        this.centreEY = 0;
        if (this.orientation == "vertical") {
            this.centreSX = 1;
            this.centreSY = 0.5;
            this.centreEX = 0;
            this.centreEY = 0.5;
        }
       
        // Calculate the path's start/end coordinates.
        // We want to align with the elements' mid point.

        // Non distinguo più tra annidato o non, niente if come sopra ...
            
            //this.set_Start_End(this.startCoord[i], this.endCoord[i], i)
            
            this.max_x_start = this.startCoord[i].left + this.centreSX * this.startElem[i].width - this.svgLeft ; 


            this.max_x_end = this.endCoord[i].left + this.centreEX * this.endElem[i].width - this.svgLeft + this.strokeWidth;
         
            //console.log(i, this.svgWidth, (Math.max((this.max_x_start), (this.max_x_end)) + this.strokeWidth));

            // al momento non funziona bene
            this.setSVGWidth();

           /*  if ((this.svgWidth) < (Math.max((this.max_x_start), (this.max_x_end)) + this.strokeWidth))  {
                

                this.svgWidth = (Math.max(this.max_x_start), (this.max_x_end)) + this.strokeWidth;

            } */

            this.startX[i] = this.max_x_start;
            this.endX[i] = this.max_x_end;
       

            this.max_y_start = this.startCoord[i].top +
            this.centreSY * this.startElem[i].height -
            this.svgTop;
          

            this.max_y_end = this.endCoord[i].top + this.centreEY * this.endElem[i].height- this.svgTop + this.strokeWidth;
       
            // al momento non funziona bene
            this.setSVGHeight();
                   
            /* if ((this.svgHeight) < (Math.max((this.max_y_start), (this.max_y_end)) + this.strokeWidth))
            { this.svgHeight = (Math.max((this.max_y_start), (this.max_y_end))) + this.strokeWidth}; */

          
            this.startY[i] = this.max_y_start;
            this.endY[i] = this.max_y_end;
       
          
               
           
            //this.doElsCollide(this.boxComponent.toArray()[i].elementRef.nativeElement.querySelector('.rectangle'), this.boxComponent.toArray()[i], i)
            
            this.cd.detectChanges();

    }

    

    createBox(event: any) {
        
                

                if (event.type == 'dblclick') {
        
                    

                    let num = this.boxService.get_Boxlength()+1;
                 
                    const box = new Box('Content Box','Testo Box', 'Massimo',0, {top: (event.pageY ),  left: (event.pageX ),  height: 46, width: 115, bottom: 0, right:0 }, false, this.id_mappa);
  

                    box.color = '#B4B4B4';
                    //box.order = num.toString()
                    box.order = num;
                    box.inMap = true;
                    box.stato = 2;

                   
                    this.boxService.addBox(box)
                        .subscribe(
                           // data => console.log(data),
                           // error => console.error(error)
                        );
        
                  
                }
                else {
            //        console.log('sono in double click')
                  //  this.downRelation.emit(event);
                }

                if (event.type == 'touchstart') {

                    let num = this.boxService.get_Boxlength()+1;
                    

                   

                    const box = new Box('Content Box','Testo Box', 'Massimo',0, {top: (event.changedTouches[0].pageY ),  left: (event.changedTouches[0].pageX ),  height: 46, width: 115, bottom: 0, right:0 }, false, this.id_mappa);

                    box.color = '#B4B4B4';
                    //box.order = num.toString()
                    box.order = num;
                    box.inMap = true;
                    box.stato = 2;
                    

                    
                    this.boxService.addBox(box)
                        .subscribe(
                          //  data => console.log(data),
                          //  error => console.error(error)
                        );

                }
               
            }
}
