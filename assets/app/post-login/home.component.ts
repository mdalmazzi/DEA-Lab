import {Component} from '@angular/core';

import {PostLoginService} from "./post-login.service";

import {Box} from "../box/box.model";


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})


export class HomeComponent {
    constructor(public boxService: PostLoginService) {}
    
    alertTesto = 'Vuoi cancellare questa mappa, danne conferma?';

    alert_visibility: Boolean = false;

    alert_Visibility() {
        this.boxService.alert_visibility = !this.boxService.alert_visibility;
        this.alert_visibility = this.boxService.alert_visibility
    }
    

    }

    