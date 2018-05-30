import {Component, ViewEncapsulation} from "@angular/core";
import {UserService} from "./user.service";

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html'
})
export class AuthenticationComponent {

    constructor(private userService: UserService) {}

    isLoggedIn() {
        return this.userService.isLoggedIn();

    }

}