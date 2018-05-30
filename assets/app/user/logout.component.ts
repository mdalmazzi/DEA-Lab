import {Component} from "@angular/core";
import {UserService} from "./user.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html'


})
export class LogoutComponent {
    constructor(private userService: UserService, private router: Router) {}
    onLogout()  {
        this.userService.logout();
        this.router.navigate(['/auth', 'signin']);

    }
}