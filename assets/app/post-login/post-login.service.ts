import {Box} from "../box//box.model";
import {Http, Response, Headers} from "@angular/http";
import {EventEmitter, Injectable} from "@angular/core";
import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";

@Injectable()
export class PostLoginService {
    public boxes: Box[] = [];
    boxisedit = new EventEmitter<Box>();
    titoloisedit = new EventEmitter<Box>();
    public last_numero_mappa: number;
    public indexBoxes = [];
    alert_visibility: Boolean = false;
    alert_testo = 'Vuoi cancellare questa mappa? Danne conferma.';
   
    alertTesto = 'Vuoi cancellare questa mappa, danne conferma?';
    numero_mappa
    
       //private path_to_server: string = 'http://dealab-env.cpr43rbhcm.us-west-2.elasticbeanstalk.com'; 

   
    // private path_to_server: string = 'http://localhost:3000'; 
    private path_to_server: string = 'http://192.168.1.41:3000'; 


    constructor(private http: Http) {}

    addBox(box: Box) {

        const body = JSON.stringify(box);
        const headers = new Headers({'Content-Type': 'application/json'});
        /* const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : ''; */

        const token = localStorage.getItem('userId')
            ? '?token=' + localStorage.getItem('userId')
            : '';
         return this.http.post(this.path_to_server + '/mappa_home' + token, body, {headers: headers})
        
            .map((response: Response) => {
                const result = response.json();
                const box = new Box(result.obj.content, result.obj.testo, result.obj.user.firstName, result.obj.livello, result.obj.rectangle, result.obj.titolo, result.obj.numero_mappa, result.obj._id, result.obj.user._id, result.obj.color,
                result.obj.order,
                result.obj.inMap,
                result.obj.stato,
                result.obj.intestazione
            );
                this.boxes.push(box);
                
                return box;
           })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    titolo_true() {
        //var titolo_true = false;
        if (this.boxes.length==0) {
            return false
        }

        for (var i=0; i<(this.boxes.length); i++) {
            if (this.boxes[i].titolo) {
         //       titolo_true = true;
                return true
            }
        }

    }

    get_Boxlength() {
        return this.boxes.length
    }

    get_titolo() {

        for (var i=0; i<(this.boxes.length); i++) {
            if (this.boxes[i].titolo) {
                return i;}

            }
        }

    get_levelUp(num:number) {

        

        for (var i=num-1; i!=0; i--) {
          
            if (this.boxes[num].livello > this.boxes[i].livello) {

                return i;
            }

        }
    }

    getBoxes() {
       

        let userId = localStorage.getItem('userId')
        
       
        return this.http.get(this.path_to_server + '/mappa_home/' + userId)
            
            .map((response: Response) => {
                const boxes = response.json().obj;
                
                let transformedBoxes: Box[] = [];
                let mappas = boxes.mappa;
               
                
                for (let mappa of mappas) {
                    transformedBoxes.push(new Box(mappa.content, mappa.testo, boxes.firstName, mappa.livello, mappa.rectangle, mappa.titolo, mappa.numero_mappa, mappa._id, boxes._id, mappa.color, mappa.order, mappa.inMap, mappa.stato))
                }
                this.boxes = transformedBoxes;

              
               for (var _i: any = 0; _i < mappas.length; _i++) {
                this.boxes[_i].stato = mappas[_i].stato;}

               
                //return transformedBoxes;
                return this.boxes
            })
             .catch((error: Response) => Observable.throw(error.json()));

    }

   

    getLastMapNumber() {

       
        return this.http.get(this.path_to_server + '/mappa_home' )
            
            .map((response: Response) => {
                const boxes = response.json().obj;
                
                let transformedBoxes: Box[] = [];
               
               // this.boxes = transformedBoxes; */

                this.boxes = boxes;
                
                if (this.boxes.length != 0) {
                    this.last_numero_mappa = 1;
                    for (let box of this.boxes) {
                        
                        if ((box.titolo) && (box.numero_mappa > this.last_numero_mappa)) {
                            
                        this.last_numero_mappa = box.numero_mappa;}
                    }
                    
                   
                    } else {
                        this.last_numero_mappa = 0;  
                    }
                return this.last_numero_mappa
               // return transformedBoxes;
            })
             .catch((error: Response) => Observable.throw(error.json()));

    

    }

    editBox(box: Box) {
        this.boxisedit.emit(box);
    }

    editTitolo(box: Box) {
         this.titoloisedit.emit(box);
         }

    updateBox(box: Box) {
        const body = JSON.stringify(box);
        const headers = new Headers({'Content-Type': 'application/json'});
        /* const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : ''; */

            const token = localStorage.getItem('userId')
            ? '?token=' + localStorage.getItem('userId')
            : '';
        return this.http.patch(this.path_to_server + '/mappa_home/' + box.boxId + token, body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));

    }

    deleteBox(box: Box) {
        
        /* const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : ''; */

            const token = localStorage.getItem('userId')
            ? '?token=' + localStorage.getItem('userId')
            : '';
        return this.http.delete(this.path_to_server + '/mappa_home/' + box.boxId + token)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));


    }

    arrayCountMappa(num_mappa: number) {
        for (var i=0; i<(this.boxes.length); i++) {
            if (this.boxes[i].numero_mappa == num_mappa) {
                this.indexBoxes.push(i);
            }
            //console.log(this.indexBoxes);
        }
    }

    deleteMappa(box: Box) {

        
       //this.boxes.splice(this.boxes.indexOf(box), 1);
        
        /* const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : ''; */

            const token = localStorage.getItem('userId')
            ? '?token=' + localStorage.getItem('userId')
            : '';
        return this.http.delete(this.path_to_server + '/mappa_home/' + box.boxId + token)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));


    }

    

}