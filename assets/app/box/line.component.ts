import {
    Component, Input
} from "@angular/core";


@Component({
  selector: 'app--line',
  templateUrl: './line.component.html'
})

export class LineBoxComponent  {

    @Input() x1;
    @Input() y1;
    @Input() x2;
    @Input() y2;
    @Input() stroke;
   // @Input() stroke-width;

 }