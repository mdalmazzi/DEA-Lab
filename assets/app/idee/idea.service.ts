import {Box} from "../box/box.model";
import {Http, Response, Headers} from "@angular/http";
import {EventEmitter, Injectable} from "@angular/core";
import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";

@Injectable()
export class IdeaService {
    public boxes: Box[] = [];
    private flag: boolean = false;
    boxesOwn: Box[] = [];
    index_boxesOwn: number;

    
       //private path_to_server: string = 'http://dealab-env.cpr43rbhcm.us-west-2.elasticbeanstalk.com'; 

       //private path_to_server: string = 'http://localhost:3000';

       private path_to_server: string = 'http://192.168.1.6:3000'; 
 

    boxisedit = new EventEmitter<Box>();
    titoloisedit = new EventEmitter<Box>();

    get_titolo(numero_mappa: number) {

        for (var i=0; i<(this.boxes.length); i++) {
            if (this.boxes[i].titolo && (numero_mappa == this.boxes[i].numero_mappa)) {
               return i;
            }
        }
    }
    constructor(private http: Http) {}

    get_Boxlength() {
        return this.boxes.length
    }

    addBox(box: Box) {

        const body = JSON.stringify(box);
        
        const headers = new Headers({'Content-Type': 'application/json'});
        /* const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : ''; */

        const token = localStorage.getItem('userId')
            ? '?token=' + localStorage.getItem('userId')
            : '';
        //console.log(this.path_to_server + '/mappa_idee' + token, body, {headers: headers})
        return this.http.post(this.path_to_server + '/mappa_idee' + token, body, {headers: headers})
            .map((response: Response) => {
                const result = response.json();
                const box = new Box(result.obj.content, result.obj.testo, result.obj.user.firstName, result.obj.livello, result.obj.rectangle, result.obj.titolo, result.obj.numero_mappa, result.obj._id, result.obj.user._id, result.obj.color, result.obj.order, result.obj.inMap);
                this.boxes.push(box);
                return box;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getBoxesOwn(id_mappa: number) {
            
        /*   this.boxesOwn = [];
          for (var i=0; i<(this.boxes.length); i++) {
              if ((this.boxes[i].numero_mappa == id_mappa)) {
                
                  if (!this.flag) {
                    this.flag = true;
                    this.index_boxesOwn = i;                   
                  }
                  this.boxesOwn.push(this.boxes[i]);
        
              }
              } */
              
      }

    getBoxes(id_mappa: number) {

        return this.http.get(this.path_to_server + '/mappa_idee/' + id_mappa)
            .map((response: Response) => {
                const boxes = response.json().obj;
                //console.log(boxes, 'This is boxes obj')
                let transformedBoxes: Box[] = [];
                for (let box of boxes) {
                    if (!box.intestazione) {
                        transformedBoxes.push(new Box(box.content, box.testo, box.user.firstName, box.livello, box.rectangle, box.titolo, box.numero_mappa, box._id, box.user._id, box.color, box.order, box.inMap, box.stato,  box.intestazione ));
                        let lung = transformedBoxes.length;
                        transformedBoxes[lung -1].stato = box.stato
                    }
                }
                this.boxes = transformedBoxes;
                this.boxesOwn = transformedBoxes;

                 /* for (var _i: any = 0; _i < boxes.length; _i++) {
                    this.boxes[_i].stato = boxes[_i].stato;}  */

                //console.log(this.boxes, 'this is this.boxes')
                return this.boxes;
            })
            .catch((error: Response) => Observable.throw(error.json()));
 }

    editTitolo(box: Box) {
        
        this.titoloisedit.emit(box);
        
        }

    editBox(box: Box) {
        this.boxisedit.emit(box);

    }

    updateBox(box: Box) {

        if (box.stato > 1) {
           
        } else if (!box.stato) {
            box.stato = 1
        }
        
        const body = JSON.stringify(box);
        const headers = new Headers({'Content-Type': 'application/json'});
        /* const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : ''; */

            const token = localStorage.getItem('userId')
            ? '?token=' + localStorage.getItem('userId')
            : '';
        return this.http.patch(this.path_to_server + '/mappa_idee/' + box.boxId + token, body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));

    }

    deleteBox(box: Box) {
        
        this.boxes.splice(this.boxes.indexOf(box), 1);
        /* const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : ''; */

            const token = localStorage.getItem('userId')
            ? '?token=' + localStorage.getItem('userId')
            : '';
        return this.http.delete(this.path_to_server + '/mappa_idee/' + box.boxId + token)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));


    }


}