import {RouterModule, Routes} from "@angular/router";
import {BoxesComponent} from "./box/boxes.component";
import {AuthenticationComponent} from "./user/authentication.component";
import {USER_ROUTES} from "./user/user.routes";
import {IdeeComponent} from "./idee/idee.component";
import {ListScalettaComponent} from "./scaletta/list-scaletta.component";
import {HomeComponent} from "./post-login/home.component";
import {TestoComponent} from "./testo/testo.component";

const APP_ROUTES: Routes = [
    {path: '', redirectTo: '/auth', pathMatch: 'full'},
    //{path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home/:userId', component: HomeComponent},
    {path: 'boxes/:id', component: BoxesComponent},
    {path: 'auth', component: AuthenticationComponent, children: USER_ROUTES},
    {path: 'scaletta/:id', component: ListScalettaComponent},
    {path: 'idee/:id', component: IdeeComponent},
    
    {path: 'testo/:id', component: TestoComponent}

];

export const routing = RouterModule.forRoot(APP_ROUTES);