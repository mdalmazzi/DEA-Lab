import { Component } from '@angular/core';
import {BoxService} from "./box/box.service";
import {IdeaService} from "./idee/idea.service";
import {ScalettaService} from "./scaletta/scaletta.service";
import {PostLoginService} from "./post-login/post-login.service";
import {TestoService} from "./testo/testo.service";

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [BoxService, IdeaService, ScalettaService, PostLoginService, TestoService]
})
export class AppComponent {

}