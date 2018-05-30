import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import 'rxjs/Rx';
import { Observable } from 'rxjs';

import {User} from "./user.model";


@Injectable()
export class UserService {

      //private path_to_server: string = 'http://dealab-env.cpr43rbhcm.us-west-2.elasticbeanstalk.com'; 

      //private path_to_server: string = 'http://localhost:3000';

      private path_to_server: string = 'http://localhost:3000'; 

    constructor(private http: Http) {}

    signup(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(this.path_to_server + '/user', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));;
    }

    signin(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(this.path_to_server + '/user/signin', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));;
    }

    logout() {
        localStorage.clear();
    }

    isLoggedIn() {
        return localStorage.getItem('token') !== null;
    }

}