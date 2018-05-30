import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {User} from "./user.model";
import {UserService} from "./user.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html'
})
export class SigninComponent {
    myForm: FormGroup;

    constructor(private userService: UserService, private router: Router) {}

    onSubmit() {
        const user = new User(this.myForm.value.email, this.myForm.value.password);
        this.userService.signin(user)
            .subscribe(
                data => {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.userId);
                    this.router.navigateByUrl('/');
                    //console.log('Logging avvenuto', data);
                    //this.userService.dataUId = data.userId;
                    this.router.navigate(['/home/' + data.userId]);
                  //  alert('Login avvenuto')

                },
                error => console.error(error)
            );

        this.myForm.reset();
    }

    ngOnInit() {
        this.myForm = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
            ]),
            password: new FormControl(null, Validators.required)
        });
    }
}