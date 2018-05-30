import {Box} from "../box/box.model";
import {Intestazione} from "./intestazione.model";

import {Http, Response, Headers} from "@angular/http";
import {EventEmitter, Injectable} from "@angular/core";
import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";

@Injectable()
export class ScalettaService {


    titoloisedit = new EventEmitter<Box>();
    private intestazione: Intestazione[];
    public boxes: Box[] = [];
    public boxes_intro: Box[] = [];
    private flag: boolean = false;
    boxesOwn: Box[] = [];   
    index_boxesOwn: number; 
    public indexBoxes = [];
    public index_up;
    public index_down;
    public control_down;
    public control_down_bis;
    public control_up

    //private path_to_server: string = 'http://dealab-env.cpr43rbhcm.us-west-2.elasticbeanstalk.com'; 

    //private path_to_server: string = 'http://localhost:3000';

    private path_to_server: string = 'http://localhost:3000'; 
    
    boxisedit = new EventEmitter<Box>();
    //nameChange: Subject<string> = new Subject<string>();

    constructor(private http: Http) {}

    editTitolo(box: Box) {
        //console.log('editTitolo', box)
        this.titoloisedit.emit(box);
     }

    getBoxes(id_mappa: number) {

        return this.http.get(this.path_to_server + '/mappa_scaletta/' + id_mappa)
            .map((response: Response) => {
                const boxes = response.json().obj;
                //console.log(boxes, 'scaletta service')
                let transformedBoxes: Box[] = [];
                for (let box of boxes) {
                 if (!box.intestazione) {
                        transformedBoxes.push(new Box(box.content, box.testo,  box.user.firstName, box.livello, box.rectangle, box.titolo, box.numero_mappa, box._id, box.user._id, box.color, box.order, box.inMap, box.intestazione, box.stato
                    ));
                    let lung = transformedBoxes.length;
                        transformedBoxes[lung -1].stato = box.stato
                }
          }
                this.boxes = transformedBoxes;

                /* for (var _i: any = 0; _i < boxes.length; _i++) {
                    this.boxes[_i].stato = boxes[_i].stato;} */

                //this.getBoxesOwn(id_mappa);
                //this.boxes = this.boxesOwn;
               // console.log(this.boxes, 'trasformed')
                return this.boxes;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getBoxesIntestazione(id_mappa: number) {
        
                return this.http.get(this.path_to_server + '/mappa_scaletta/' + id_mappa)
                    .map((response: Response) => {
                        const boxes = response.json().obj;
                        //console.log('Intestazione boxes', boxes)
                        let transformedBoxes: Box[] = [];
                        for (let box of boxes) {
                            if (box.intestazione) {
                                transformedBoxes.push(new Box(box.content, box.testo,  box.user.firstName, box.livello, box.rectangle, box.titolo, box.numero_mappa, box._id, box.user._id, box.color, box.order, box.inMap, box.intestazione, box.stato 
                            ))
                            let lung = transformedBoxes.length;
                            transformedBoxes[lung -1].stato = box.stato
                        }
                        }
                        this.boxes_intro = transformedBoxes;

                        //console.log('transformedBoxes', transformedBoxes)
                        //this.getBoxesOwn(id_mappa);
                        //this.boxes = this.boxesOwn;
                       /*  if (transformedBoxes.length > 0) {
                            for (var _i: any = 0; _i < boxes.length; _i++) {
                            this.boxes_intro[_i].stato = boxes[_i].stato;}
                            //return transformedBoxes;
                            
                        } */
                        //console.log('Box Intestazione this.boxes_intro', this.boxes_intro);
                        return  this.boxes_intro;
                    })
                    .catch((error: Response) => Observable.throw(error.json()));
            }


    move(old_index, new_index) {
        while (old_index < 0) {
            old_index += this.boxes.length;
        }
        while (new_index < 0) {
            new_index += this.boxes.length;
        }
        if (new_index >= this.boxes.length) {
            var k = new_index - this.boxes.length;
            while ((k--) + 1) {
                this.boxes.push(undefined);
            }
        }
        this.boxes.splice(new_index, 0, this.boxes.splice(old_index, 1)[0]);
        return this; // for testing purposes
    };

    getBoxesOwn(id_mappa: number) {
        
      this.boxesOwn = [];
      for (var i=0; i<(this.boxes.length); i++) {
          if ((this.boxes[i].numero_mappa == id_mappa)) {
            
              if (!this.flag) {
                this.flag = true;
                this.index_boxesOwn = i;                   
              }
              this.boxesOwn.push(this.boxes[i]);
    
          }
          }
         // console.log(this.boxes, this.boxesOwn)
          
  }

  get_Boxlength() {
    return this.boxes.length
}

  reorderBoxes(from: number, to: number) {
        //this.boxes.splice(to, 0, this.boxes.splice(from, 1)[0]);

        console.log('reorderBoxes: ',from, to )
        
        this.boxes.splice(to, 0, this.boxes.splice(from, 1)[0]);
        
        console.log('Reorder: ',this.boxes)
    }

    editBox(box: Box) {
        this.boxisedit.emit(box);

    }

    get_level(numberBox: string) {
        for (var i=0; i<(this.boxes.length); i++) {
            if (numberBox==this.boxes[i].boxId) {
                return this.boxes[i].livello
            }
        }
    }

    get_levelUp(num: number, num_mappa: number) {
        
                for (var i=num-1; i!=0; i--) {
                
                    if ((this.boxes[num].livello > this.boxes[i].livello) && (this.boxes[i].numero_mappa == num_mappa)) {
        
                        return i;
                    }
        
                }
            }
    
    get_levelDown_ric_intermedia(index: number, livello: number): number {
           
        
        if (livello == 2) 
            {
                if ((index +1) == (this.boxes.length)) {
                    // this.index_down = index - 1;
                        console.log('index: ', index)
                        this.control_down = index ;
                        return
                     }
        
                    if ((this.boxes[index+1].livello != livello)  )
                        {
                    
                            this.control_down = index;
                            console.log('index: ', index)
                            return ;
                    
                        } 
                        else this.get_levelDown_ric_intermedia(index + 1, livello);

            }
            else
            {

        
                if ((index +1) == (this.boxes.length)) {
                // this.index_down = index - 1;
                    console.log('index: ', index)
                    this.control_down = index ;
                    return
                 }

                if ((this.boxes[index+1].livello <= livello)  )
                    {
            
                        this.control_down = index;
                        console.log('index: ', index)
                        return ;
            
                    } else this.get_levelDown_ric_intermedia(index + 1, livello);
            
            }
       
        }   

    get_levelUp_ric_intermedia(index: number, livello: number): number {
                
            
                    
                    if ((this.boxes[index-1].livello != livello))
                    {
                        
                        this.control_up = index;
                        
                        console.log(this.control_up);
                        return ;
                        
                    } else this.get_levelUp_ric_intermedia(index - 1, livello);
            
                   
                    }   

    get_levelDown_ric_intermedia_bis(index: number, livello: number): number {
                
            /*         if ((this.boxes[index+1].livello == this.boxes[index].livello)|| (index +1) == (this.boxes.length) || (this.boxes[index+1].livello == 0)) */
                    //console.log('index: ', index, this.boxes[index].livello)

                    

                    if ((index +1 ) == (this.boxes.length)) {
                        // this.index_down = index - 1;
                        this.control_down_bis = index;
                        console.log('FINE this.control_down_bis: ', this.control_down_bis)
                         return
                     }
              
                     if (this.boxes[index+1].livello == 0) {
                         this.control_down_bis = index;
                         console.log('Livello 0 this.control_down_bis: ', this.control_down_bis)
                         return
                     }
                    
                    if ((livello ==
                        this.boxes[index+1].livello))
                        {    
                            

                            this.control_down_bis = index;
                            console.log('Ricorsione this.control_down_bis: ', this.control_down_bis, livello)
                            return;
                            
                        } 
                        else 
                        {
                            
                            this.get_levelDown_ric_intermedia_bis(index + 1, livello)
                        }
                    
            
                   
                    }   

    get_levelDown_ric(index: number) {
                
               
               if ((index +1) == (this.boxes.length)) {
                  // this.index_down = index - 1;
                  this.index_down = index ;
                   return
               }
        
               if (this.boxes[index+1].livello == 0) {
                   this.index_down = index;
                   return
               }
        
        
               if (((this.boxes[index].livello <=
                    this.boxes[index+1].livello) || this.boxes[index+1].livello != 0) && (this.boxes[index+1].livello != 0) && ((index+1) != this.boxes.length )) 
                    {
                       this.get_levelDown_ric(index + 1);
                   } else if ((index+1) == (this.boxes.length)) {
                       this.index_down = index;
                   } else {
                       this.index_down = index
                   }      
                          
                   //console.log(this.index_down,'this.index_down')
               }   
               
  
        get_levelUp_ric(num: number) {
            
    
             if (this.boxes[num].livello == 0){
                
                 this.index_up = num;
                 return;
             };
    
             if ((this.boxes[num].livello >= this.boxes[num-1].livello) && (this.boxes[num-1].livello != 0)) 
             {
                 this.get_levelUp_ric(num-1); 
             } 
                 else if (this.boxes[num-1].livello == 0)
             {
                                            
                 this.index_up= num-1;
                 return
             }    
              else {
                 
              }
        
     }

    // old upric in scaletta aggiornata con quella di box

   /*  get_levelUp_ric(num: number) {
                       
                   

                        if ((num + 1) == (this.boxes.length)) {
                            this.index_up = num - 1;
                            return;
                        }

                        if (this.boxes[num].livello == 0){
                            //return (num)
                            this.index_up = num;
                            return;
                        };

                        if ((this.boxes[num].livello >= this.boxes[num-1].livello) && (this.boxes[num-1].livello != 0)) 
                        {
                            this.get_levelUp_ric(num-1); 
                        } 
                            else if (this.boxes[num-1].livello == 0)
                        {
                                                       
                            this.index_up= num-1;
                            return
                        }    
                         else {
                           
                         }
                  
                } */

    // old upric in scaletta aggiornata con quella di box
        

    updateBox(box: Box) {

      /*   if (box.stato > 3) {
           
        } else if (!box.stato) {
            box.stato = 3
        } */

        /* if (box.stato > 3) {
           
        } else if (!box.stato) {
            box.stato = 3
        } */

        const body = JSON.stringify(box);
        const headers = new Headers({'Content-Type': 'application/json'});
        /* const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : ''; */

            const token = localStorage.getItem('userId')
            ? '?token=' + localStorage.getItem('userId')
            : '';
        return this.http.patch(this.path_to_server + '/mappa_scaletta/' + box.boxId + token, body, {headers: headers})
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
        return this.http.delete(this.path_to_server + '/mappa_scaletta/' + box.boxId + token)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));


    }

    addBox(box: Box) {
        
                const body = JSON.stringify(box);
               // console.log(body);
                const headers = new Headers({'Content-Type': 'application/json'});
                /* const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : ''; */

            const token = localStorage.getItem('userId')
            ? '?token=' + localStorage.getItem('userId')
            : '';
                return this.http.post(this.path_to_server + '/mappa_scaletta' + token, body, {headers: headers})
                    .map((response: Response) => {
                        const result = response.json();
                        const box = new Box(result.obj.content, result.obj.testo, result.obj.user.firstName, result.obj.livello, result.obj.rectangle, result.obj.titolo, result.obj.numero_mappa, result.obj._id, result.obj.user._id, result.obj.color, result.obj.order, result.obj.inMap, result.obj.stato,result.obj.intestazione);
                        if (result.obj.intestazione) 
                        {
                            this.boxes_intro.push(box);
                        } else 
                        {
                            this.boxes.push(box);
                        }
                            
                        return box;
                    })
                    .catch((error: Response) => Observable.throw(error.json()));
            }

            arrayCountMappa(num_mappa: number) {
                for (var i=0; i<(this.boxes.length); i++) {
                    if (this.boxes[i].numero_mappa == num_mappa) {
                        this.indexBoxes.push(i);
                    }
                  //  console.log(this.indexBoxes);
                }
            }

            get_Boxbyindex(index: number) {
                
                return this.boxes[index]     
                
            }



}