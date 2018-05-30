import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

import { AppComponent } from "./app.component";
import {BoxComponent} from "./box/box.component";

import {ListBoxComponent} from "./box/list-box.component";
import {InputBoxComponent} from "./box/input-box.component";
import {BoxesComponent} from "./box/boxes.component";
import {AuthenticationComponent} from "./user/authentication.component";
import {HeaderComponent} from "./shared/header.component";
import {routing} from "./app-routing";
import {LogoutComponent} from "./user/logout.component"
import {SignupComponent} from "./user/signup.component";
import {SigninComponent} from "./user/signin.component";

//import { AngularDraggableModule } from 'angular2-draggable';
import {ResizableModule} from 'angular-resizable-element';
import {UserService} from "./user/user.service";
import {IdeaComponent} from "./idee/idea.component";
import {ListIdeeComponent} from "./idee/list-idea.component";
import {IdeeComponent} from "./idee/idee.component";
import {AngularDragDirective} from "./shared/dragme.directive";
//import {FocusDirective} from "./shared/focus.directive";
import {Resizable} from "./shared/resize.directive";
import {ResizeHandle} from "./shared/resizeHandle.directive";
import { MediumEditorDirective } from 'angular2-medium-editor/medium-editor.directive';
import {Relations} from "./box/relations.directive";

import {ListScalettaComponent} from "./scaletta/list-scaletta.component";
import {ScalettaComponent} from "./scaletta/scaletta.component";

import {PostLoginComponent} from "./post-login/post-login.component";
import {ListMappeComponent} from "./post-login/list-mappe.component";
import {HomeComponent} from "./post-login/home.component";
import {InputMappaComponent} from "./post-login/input-mappa.component";
import {QuillEditorModule } from 'ngx-quill-editor';

import {TooltipModule} from "./shared/TooltipModule";
import {CommonModule} from "@angular/common";
import { SidebarModule } from 'ng-sidebar';
import { HighlightDirective, } from "./scaletta/scaletta.highlight.directive";

import {TestoComponent} from "./testo/testo.component";
import {QuillComponent} from "./testo/quill.component";
import {IntestazioneComponent} from "./scaletta/intestazione.component";
import {TruncatePipe} from "./idee/truncate";
import {LineBoxComponent} from "./box/line.component";
import {TooltipComponent} from "./box/tooltip.component";
import {AlertComponent} from "./box/alert.component";
import {AlertComponent2} from "./idee/alert2.component";
import {AlertComponent3} from "./shared/alert3.component";
import {AlertComponent4} from "./post-login/alert4.component";



/* import {TruncatePipePost} from "./post-login/truncate";
 */
import {ArraySortPipe} from "./scaletta/scaletta.pipe";
import {FocusDirective} from "./shared/focus.directive";





//import './idee/idee.component.scss';




@NgModule({
    declarations: [
        AppComponent,
        BoxComponent,
        ListBoxComponent,
        InputBoxComponent,
        BoxesComponent,
        TestoComponent,
        QuillComponent,
        IntestazioneComponent,
        AuthenticationComponent,
        HeaderComponent,
        LogoutComponent,
        SignupComponent,
        SigninComponent,
        IdeaComponent,
        ListIdeeComponent,
        IdeeComponent,
        AngularDragDirective,
       // FocusDirective,
        Resizable,
        ResizeHandle,
        MediumEditorDirective,
        Relations,
       
        ListScalettaComponent,
        ScalettaComponent, 
        PostLoginComponent,
        ListMappeComponent,
        HomeComponent,
        InputMappaComponent,
        HighlightDirective,

        TruncatePipe,
        LineBoxComponent,
        /* TruncatePipePost, */
        ArraySortPipe,
        FocusDirective,
        TooltipComponent,
        AlertComponent,
        AlertComponent2,
        AlertComponent3,
        AlertComponent4

    ],
    imports:
    [BrowserModule,
        FormsModule,
        routing,
        ReactiveFormsModule,
        TooltipModule,
        
        HttpModule,
        CommonModule,
        QuillEditorModule,
       
        SidebarModule.forRoot()
    ],
    
    providers: [UserService],
    bootstrap: [AppComponent]
})
export class AppModule {

}