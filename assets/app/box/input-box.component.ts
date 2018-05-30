import {Component, OnInit} from "@angular/core";
import { NgForm } from "@angular/forms";
import {BoxService} from "./box.service";
import {Box} from "./box.model";

import { ActivatedRoute} from "@angular/router";


@Component({
    selector: 'app-input-box',
    templateUrl: './input-box.component.html',

})
export class InputBoxComponent implements OnInit {
    box: Box;
    id_mappa: number;


    constructor(private route: ActivatedRoute, private boxService: BoxService) {
        this.route.params.subscribe (
            params => {
                //console.log(params);
                this.id_mappa = +params['id'];
            }
        )
    }

    onSubmit(form: NgForm) {

        if (this.box) {
            //edit
            this.box.content = form.value.content;
            this.boxService.updateBox(this.box)
                .subscribe(
                   // result => console.log(result)

                );
            this.box = null;


        } else {
            // create
            let num = this.boxService.get_Boxlength()+1;
           // console.log(num);
            const box = new Box(form.value.content, 'Testo Box',  'Massimo', 0, {top: 0, bottom: 0, left: 0, right: 0, height: 80, width: 200}, false, this.id_mappa );

            box.color = '#B4B4B4';
            //box.order = num.toString()
            box.order = num;

            this.boxService.addBox(box)
                .subscribe(
                    //data => console.log(data),
                    //error => console.error(error)
                );
        }

        form.resetForm();
    }

    onClear(form: NgForm) {
        this.box = null;
        form.resetForm();
    }

    ngOnInit() {
       this.boxService.boxisedit.subscribe(
           (box: Box) => this.box = box
       )
        //console.log(this.box);
        
    }
}