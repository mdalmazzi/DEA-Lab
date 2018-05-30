import {Component} from '@angular/core';
import {PostLoginService} from "./post-login.service";

import {Box} from "../box/box.model";

@Component({
    selector: 'app-listmappe',
    templateUrl: './list-mappe.component.html',
    styleUrls: ['./list-mappe.component.css']
})
export class ListMappeComponent {
    constructor(private boxService: PostLoginService) {
        
    }
    progress = 'progressing';

    boxes: Box[] = [];
    
    
    ngOnInit(){
        this.boxService.getBoxes()
            .subscribe(
                (boxes: Box[]) => {
                    this.progress = 'finished';
                    this.boxes = boxes.reverse();
                    
                }
            );   
              
    }
}