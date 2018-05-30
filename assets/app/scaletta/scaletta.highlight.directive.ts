import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
 selector: '[appHighlight]'
})
export class HighlightDirective {
 constructor(private el: ElementRef) { }

 @HostListener('mousedown') onMouseEnter() {
   //this.border('dotted');
   this.opacity('0.5');
   
 }

 @HostListener('mouseleave') onMouseLeave() {
   /* this.border('initial');
   this.bordertopleftradius('3px');
   this.bordertoprightradius('3px');
   this.borderbottom('1px solid transparent');
   this.borderColor('#ddd'); */
   this.opacity('1');
   
 }

 

 private border(value: string) {
   this.el.nativeElement.style.border = value; 
 }

 private bordertopleftradius(value: string) {
    this.el.nativeElement.style.borderTopLeftRadius = value; 
  }

  private bordertoprightradius(value: string) {
    this.el.nativeElement.style.borderTopRightRadius = value; 
  }

  private borderbottom(value: string) {
    this.el.nativeElement.style.borderBottom = value; 
  }
  
  private borderColor(value: string) {
    this.el.nativeElement.style.borderColor = value;  
  }

  private opacity(value: string) {
    this.el.nativeElement.style.opacity = value;  
  }
  
}