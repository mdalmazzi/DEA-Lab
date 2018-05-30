import { Directive, ElementRef, Renderer, Input, Output, OnInit, HostListener, EventEmitter } from '@angular/core';

class Position {
    constructor(public x: number, public y: number) { }
}

export type DragAxis = {x: boolean, y: boolean};
export type SnapGrid = {x?: number, y?: number};


@Directive({
    selector: '[ngDrag]'
})

export class AngularDragDirective implements OnInit {
    private allowDrag: boolean = true;
    private moving: boolean = false;
    
    private orignal: Position = null;
    
    private oldTrans: Position = new Position(0, 0);
    private oldTransbis: Position = new Position(0, 0);
    private tempTrans: Position = new Position(0, 0);
    private oldZIndex: string = '';
    private oldPosition: string = '';
    private oldLeft: string = '';
    private oldTop: string = '';

    @Output() started = new EventEmitter<any>();
    @Output() moveBox = new EventEmitter<any>();
    @Output() stopped = new EventEmitter<any>();
    @Output() stopped_view = new EventEmitter<any>();

    @Output() direction_step = new EventEmitter<any>();
    @Output() direction_step_reorder = new EventEmitter<any>();

    @Input() handle: HTMLElement;

    @Input() dragAxis: DragAxis = {x: true, y: true};
    @Input() dragSnapGrid: SnapGrid = {x: 1, y: 1};

    @Input() ghostDragEnabled: boolean = true;

    @Input()
    set ngDrag(setting: any) {
        if (setting !== undefined && setting !== null && setting !== '') {
            this.allowDrag = !!setting;
            
            let element = this.handle ? this.handle : this.el.nativeElement;

            if (this.allowDrag) {
                this.renderer.setElementClass(element, 'ng-draggable', true);
            }
            else {
                this.renderer.setElementClass(element, 'ng-draggable', false);
            }
        }
    }

    constructor(private el: ElementRef, private renderer: Renderer) { }

    ngOnInit() {

        //document.addEventListener("touchmove", ontouchmove, {passive: true} );

        if (this.allowDrag) {
            let element = this.handle ? this.handle : this.el.nativeElement;
            this.renderer.setElementClass(element, 'ng-draggable', true);
        }
    }

    private getPosition(x: number, y: number) {
        return new Position(x, y);
    }

    private moveTo(x: number, y: number) {
        if (this.orignal) {
            this.tempTrans.x = x - this.orignal.x;

            if (!this.dragAxis.y) {this.tempTrans.x = Math.floor(this.tempTrans.x / this.dragSnapGrid.x) * this.dragSnapGrid.x};

           //Modifiche per griglie e assi
            this.tempTrans.y = y - this.orignal.y;

            if (!this.dragAxis.x) {this.tempTrans.y = Math.floor(this.tempTrans.y / this.dragSnapGrid.y) * this.dragSnapGrid.y};

            if (!this.dragAxis.y) {this.tempTrans.y = 0};
            if (!this.dragAxis.x) {this.tempTrans.x = 0};
            //Modifiche per griglie e assi


            let value = `translate(${this.tempTrans.x + this.oldTrans.x}px, ${this.tempTrans.y + this.oldTrans.y}px)`;


            // inserito 28 09 da Massimo
            this.renderer.setElementStyle(this.el.nativeElement, 'left',`${this.tempTrans.x + this.oldTrans.x + parseInt(this.oldLeft, 10)}px`);

            this.renderer.setElementStyle(this.el.nativeElement, 'top',`${this.tempTrans.y + this.oldTrans.y + parseInt(this.oldTop, 10)}px`);

            

            // inserito 28 09 da Massimo

            /* this.renderer.setElementStyle(this.el.nativeElement, 'transform', value);
            this.renderer.setElementStyle(this.el.nativeElement, '-webkit-transform', value);
            this.renderer.setElementStyle(this.el.nativeElement, '-ms-transform', value);
            this.renderer.setElementStyle(this.el.nativeElement, '-moz-transform', value);
            this.renderer.setElementStyle(this.el.nativeElement, '-o-transform', value); */
        }
    }

    private pickUp() {
        // get old z-index and position:
        this.oldZIndex = this.el.nativeElement.style.zIndex ? this.el.nativeElement.style.zIndex : '';
        this.oldPosition = this.el.nativeElement.style.position ? this.el.nativeElement.style.position : '';

        if (window) {
            this.oldZIndex = window.getComputedStyle(this.el.nativeElement, null).getPropertyValue("z-index");
            this.oldPosition = window.getComputedStyle(this.el.nativeElement, null).getPropertyValue("position");
            this.oldLeft = window.getComputedStyle(this.el.nativeElement, null).getPropertyValue("left");
            this.oldTop = window.getComputedStyle(this.el.nativeElement, null).getPropertyValue("top");

            //console.log('oldLeft', this.oldLeft, 'oldTop', this.oldTop)
        }

        // setup default position:
        let position = 'relative';

        // check if old position is draggable:
        if (this.oldPosition && (
                this.oldPosition === 'absolute' ||
                this.oldPosition === 'fixed' ||
                this.oldPosition === 'relative')) {
            position = this.oldPosition;
        }

        this.renderer.setElementStyle(this.el.nativeElement, 'position', position);
        this.renderer.setElementStyle(this.el.nativeElement, 'z-index', '99999');

        if (!this.moving) {
            
            this.started.emit(this.el.nativeElement);
            this.moving = true;        
        }
    }

    private putBack() {
        if (this.oldZIndex) {
            this.renderer.setElementStyle(this.el.nativeElement, 'z-index', this.oldZIndex);
        } else {
            this.el.nativeElement.style.removeProperty('z-index');
        }

        if (this.moving) {

            this.stopped.emit(this.el.nativeElement);
            this.moving = false;
            this.oldTrans.x += this.tempTrans.x;
            this.oldTransbis.x += this.tempTrans.x;
            this.oldTransbis.x +=  parseInt(this.oldLeft, 10);
            

            //Utile per gestire cambio livello
            this.direction_step.emit(this.tempTrans.x);

            this.oldTrans.y += this.tempTrans.y;

            this.oldTransbis.y += this.tempTrans.y;
            this.oldTransbis.y +=  parseInt(this.oldTop, 10);
            
           // this.oldTransbis.y =  + parseInt(this.oldTop, 10);
            //Utile per gestire reorder scaletta
            this.direction_step_reorder.emit(this.tempTrans.y);

            //this.stopped_view.emit(this.oldTrans);
            this.stopped_view.emit(this.oldTransbis);
            
            // Massimo per riposizionamento panel
            this.renderer.setElementStyle(this.el.nativeElement, 'top',`${-this.tempTrans.y + this.oldTrans.y + parseInt(this.oldTop, 10)}px`);
            // Massimo per riposizionamento panel

            this.oldTransbis = new Position(0, 0);
            this.oldTrans = new Position(0, 0);
            this.tempTrans = new Position(0, 0);

          

        }
    }

    // Support Mouse Events:
    @HostListener('mousedown', ['$event'])
    onMouseDown(event: any) {
        // 1. skip right click;
        // 2. if handle is set, the element can only be moved by handle

        
      
        if (event.button == 2 || (this.handle !== undefined && event.target !== this.handle)) {
            return;
        }

        this.orignal = this.getPosition(event.clientX, event.clientY);
        
       /*  setTimeout(() => {
            this.pickUp();
            
        }, 1500); */
      
        this.pickUp();
    }

    @HostListener('document:mouseup')
    onMouseUp() {
        this.putBack();
    }

    @HostListener('document:mouseleave')
    onMouseLeave() {
        this.putBack();
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: any) {

        
        //this.moveBox.emit(event);
        if (this.moving && this.allowDrag) {
            this.moveBox.emit(event);
           
            this.moveTo(event.clientX, event.clientY);
        }
    }

    // Support Touch Events:
    @HostListener('document:touchend')
    onTouchEnd() {
        this.putBack();
    }

    

    @HostListener('touchstart', ['$event'])
    onTouchStart(event: any) {
        // max 7 marzo
        //event.preventDefault();
        //event.stopPropagation();
        // max 7 marzo
        this.orignal = this.getPosition(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
       /*  setTimeout(() => {
            this.pickUp();
            
        }, 1500); */
        this.pickUp();
        
    }

    @HostListener('document:touchmove', ['$event'])
    onTouchMove(event: any) {
        
        // Aggiunto Massimo //
        //event.AddEventListenerOptions(false); 
        //event.preventDefault();
        // Aggiunto Massimo //
        //event.stopPropagation();
       
        //this.moveBox.emit();
        if (this.moving && this.allowDrag) {
            this.moveTo(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
            this.moveBox.emit();
        }
    }
}