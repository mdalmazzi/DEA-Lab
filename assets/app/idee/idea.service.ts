import {Box} from "../box/box.model";
import {Http, Response, Headers} from "@angular/http";
import {EventEmitter, Injectable} from "@angular/core";
import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";
import { Router} from "@angular/router";

@Injectable()
export class IdeaService {
    public boxes: Box[] = [];
    private flag: boolean = false;
    boxesOwn: Box[] = [];
    index_boxesOwn: number;
    last_numero_mappa: number;
  
    //private path_to_server: string = 'http://dealab-env.cpr43rbhcm.us-west-2.elasticbeanstalk.com'; 

    // private path_to_server: string = 'http://localhost:3000'; 
    private path_to_server: string = 'http://192.168.1.54:3000'; 

    private exampleIdee: number = 164;

    boxisedit = new EventEmitter<Box>();
    titoloisedit = new EventEmitter<Box>();

    get_titolo(numero_mappa: number) {

        for (var i=0; i<(this.boxes.length); i++) {
            if (this.boxes[i].titolo && (numero_mappa == this.boxes[i].numero_mappa)) {
               return i;
            }
        }
    }
    constructor(private router: Router, private http: Http) {}

    get_Boxlength() {
        return this.boxes.length
    }


    getLastMapNumber() {
       
        return this.http.get(this.path_to_server + '/mappa_home' )
            
            .map((response: Response) => {
                const boxes = response.json().obj;
                
                let transformedBoxes: Box[] = [];              

                this.boxes = boxes;
                
                if (this.boxes.length != 0) {
                    this.last_numero_mappa = 1;
                    for (let box of this.boxes) {
                        
                        if ((box.titolo) && (box.numero_mappa > this.last_numero_mappa)) 
                        { 
                            this.last_numero_mappa = box.numero_mappa;
                        }
                    }     

                    } else {
                        this.last_numero_mappa = 0;  
                    }
                return this.last_numero_mappa
               
            })
             .catch((error: Response) => Observable.throw(error.json()));

    }


    onCreaMappa(boxes: Box[], box: Box) {

        let userId = localStorage.getItem('userId');
       
        this.getLastMapNumber()
            .subscribe(
          
            (last_numero_mappa: number) => {

                this.last_numero_mappa = last_numero_mappa;
                
                  boxes.forEach((box) => {
                   
                      const box_copy = new Box(' ', ' ',  ' ', 0, box.rectangle, true, last_numero_mappa + 1); 

                      box_copy.numero_mappa = last_numero_mappa + 1;
                      box_copy.userId = userId;
                  
                      box_copy.color = box.color;
                      box_copy.order = box.order;
     
                      box_copy.stato = box.stato;
                      box_copy.content = box.content;
                      box_copy.testo = box.testo;
                      box_copy.username = box.username;
                      box_copy.livello = box.livello;
                      box_copy.titolo = box.titolo ;
            
                      box_copy.inMap = false;

                      this.addBox(box_copy)
                           .subscribe(
                                // data => console.log(data),
                                // error => console.error(error)
                            );             
                  });         
            });               
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

    copiaExample(box: Box, id_mappa) {
       
        let userId = localStorage.getItem('userId');

        // alert('Per modificare devi copiare l\'esempio nella tua area di lavoro');

        this.getLastMapNumber()
                .subscribe(
                    (example) => {
                                      
                        this.last_numero_mappa = example;

                        this.getBoxes(box.numero_mappa)
                            .subscribe(
                                (boxes: Box[]) => {
                                    boxes.forEach((box, indice) => {
                   
                                        const box_copy = new Box(' ', ' ',  ' ', 0, box.rectangle, true, example + 1); 
                  
                                        box_copy.numero_mappa = example + 1;
                                        box_copy.userId = userId;
                                    
                                        box_copy.color = box.color;
                                        box_copy.order = box.order;
                       
                                        box_copy.stato = box.stato;
                                        box_copy.content = box.content;
                                        box_copy.testo = box.testo;
                                        box_copy.username = box.username;
                                        box_copy.livello = box.livello;
                                        box_copy.titolo = box.titolo ;
                              
                                        box_copy.inMap = false;
                                        
                                        this.addBox(box_copy)
                                             .subscribe(
                                                  data => 
                                                  {                               if (indice == (boxes.length-1)) {
                                                    this.router.navigate(['idee/'+ (example + 1)]);
                                                    //return data
                                                  }
                                                    
                                                          
                                                },
                                                  error => console.error(error)
                                              );      
                                    }); 
                                })    
                            }
                            
            )
          
        // procedura per copia esempio 
    }

    updateBox(box: Box, id_mappa) {
   
        // let userId = localStorage.getItem('userId');

        // procedura per copia esempio
        if (id_mappa == this.exampleIdee)  {
            
           this.copiaExample(box, id_mappa);

           const body = JSON.stringify(box);
           const headers = new Headers({'Content-Type': 'application/json'});      

            const token = localStorage.getItem('userId')
                ? '?token=' + localStorage.getItem('userId')
                : '';
        
            return this.http.patch(this.path_to_server + '/mappa_idee/' + box.boxId + token, body, {headers: headers})
                .map((response: Response) => response.json())
                .catch((error: Response) => Observable.throw(error.json()));
    
        } else {

            /// Procedura normale///

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