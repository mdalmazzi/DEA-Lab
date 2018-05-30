import {Directive, ElementRef, Input, Output, OnInit, ViewChild, AfterViewInit, EventEmitter} from '@angular/core';

@Directive({
    selector: '[relation]'
})
export class Relations implements OnInit, AfterViewInit{

    constructor(private elementRef: ElementRef) {
    }

    // @ViewChild('box1') elementRef: ElementRef;
    @ViewChild('box0') titolo: ElementRef;
    @ViewChild('svgContainer') svgContainer: ElementRef;
    @Output() relationStart: EventEmitter<ElementRef> = new EventEmitter();

    public startX = [0];
    public startY = [0];
    public endX = [0];
    public endY = [0];
    public svgTop;
    public svgLeft;
    public startCoord = [];
    public endCoord;

    private centreSX;
    private centreSY;
    private centreEX;
    private centreEY;
    private orientation = 'horizontal';

    createRelations(i) {

        // Orientation not set per path and/or defaulted to global "auto".
        if (this.orientation != "vertical" && this.orientation != "horizontal") {
            //this.orientation = this.determineOrientation(i);
        }
        var swap = false;
        if (this.orientation === 'vertical') {
            // If first element is more left than the second.
            swap = this.elementRef.nativeElement.getBoundingClientRect().left > this.titolo.nativeElement.getBoundingClientRect().left;
        } else { // Horizontal
            // If first element is lower than the second.
            swap = this.elementRef.nativeElement.getBoundingClientRect().top > this.titolo.nativeElement.getBoundingClientRect().top;
        }


        ///////
        this.svgTop = this.svgContainer.nativeElement.getBoundingClientRect().top;
        this.svgLeft = this.svgContainer.nativeElement.getBoundingClientRect().left;


        // Get (top, left) coordinates for the two elements.
        //*     var startCoord = $startElem.offset();
        //*     var endCoord = $endElem.offset();

        if (swap) {
            this.startCoord[i] = this.titolo.nativeElement.getBoundingClientRect();
            this.endCoord = this.elementRef.nativeElement.getBoundingClientRect();
        } else {
            this.startCoord[i] = this.elementRef.nativeElement.getBoundingClientRect();
            this.endCoord = this.titolo.nativeElement.getBoundingClientRect();
        }


        // Centre path above/below or left/right of element.
        this.centreSX = 0.5;
        this.centreSY = 1;
        this.centreEX = 0.5;
        this.centreEY = 0;
        if (this.orientation === "vertical") {
            this.centreSX = 1;
            this.centreSY = 0.5;
            this.centreEX = 0;
            this.centreEY = 0.5;
        }


        // Calculate the path's start/end coordinates.
        // We want to align with the elements' mid point.
        this.startX[i] = this.startCoord[i].left +
            this.centreSX * this.elementRef.nativeElement.offsetWidth -
            this.svgLeft;
        this.startY[i] = this.startCoord[i].top +
            this.centreSY * this.elementRef.nativeElement.offsetHeight -
            this.svgTop;
        this.endX[i] = this.endCoord.left + this.centreEX * this.titolo.nativeElement.offsetWidth - this.svgLeft;
        this.endY[i] = this.endCoord.top + this.centreEY * this.titolo.nativeElement.offsetHeight - this.svgTop;

    }

    ngOnInit() {

    }

    ngAfterViewInit(): void {
       //this.createRelations(0)
        this.relationStart.emit(this.elementRef);
    }





}