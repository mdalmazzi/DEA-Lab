import {Box} from "../box/box.model";
import {Http, Response, Headers} from "@angular/http";
import {EventEmitter, Injectable} from "@angular/core";

import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";

@Injectable()
export class TestoService {
    public boxes: Box[] = [];
    public boxes_intro: Box[] = [];
    private Update: number[] = [] ;
    boxisedit = new EventEmitter<Box>();
    titoloisedit = new EventEmitter<Box>();
    last_numero_mappa: number;
    private flag: boolean = false;
    boxesOwn: Box[] = [];
    index_boxesOwn: number;
    changeLevel: number = 0;
    changeLevelStatus: number = 0;
    svgTop;
    svgLeft;
    index_box;
    public index_up;
    public index_down;
    public secondaryRadiusX: number;
    public secondaryRadiusY: number;

    
    //private path_to_server: string = 'http://dealab-env.cpr43rbhcm.us-west-2.elasticbeanstalk.com'; 

    //private path_to_server: string = 'http://localhost:3000';

    private path_to_server: string = 'http://192.168.1.6:3000'; 
 

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
        return this.http.post(this.path_to_server + '/mappa_testo' + token, body, {headers: headers})
            .map((response: Response) => {
                const result = response.json();
                const box = new Box(result.obj.content, result.obj.testo, result.obj.user.firstName, result.obj.livello, result.obj.rectangle, result.obj.titolo, result.obj.numero_mappa, result.obj._id, result.obj.user._id, 
                result.obj.color,
                result.obj.order,
                result.obj.inMap
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

    get_Box(idBox: string) {
        for (var i=0; i<(this.boxes.length); i++) {
            if (idBox==this.boxes[i].boxId) {
                return i
            }
        }
    }

    get_Boxbyindex(index: number) {
        
        return this.boxes[index]     
        
    }

    get_BoxId(index: number) {
        
        return this.boxes[index].boxId;    
        
    }


    get_level(numberBox: string) {
        for (var i=0; i<(this.boxes.length); i++) {
            if (numberBox==this.boxes[i].boxId) {
                return this.boxes[i].livello
            }
        }
    }

    get_Boxlength() {
        return this.boxes.length
    }

  /*   get_Box_after_number(numberBox: string) {
        for (var i=0; i<(this.boxes.length); i++) {
            if (numberBox==this.boxes[i].boxId) {
                if (i!=this.boxes.length) {
                    return i+1
                }
            }
        }
    }

    get_Box_after(numberBox: string) {
        for (var i=0; i<(this.boxes.length); i++) {
            if (numberBox==this.boxes[i].boxId) {
                if (i!=this.boxes.length) {
                    
                return this.boxes[i+1]}
                else
                {return null}
            }
        }
    }

    get_Box_before(numberBox: string) {
        for (var i=0; i<(this.boxes.length); i++) {
            if (numberBox==this.boxes[i].boxId) {
                return this.boxes[i+1]
            }
        }
    } */

    get_titolo() {

        for (var i=0; i<(this.boxes.length); i++) {
            if (this.boxes[i].titolo ) {
                return i;}

            }
        }

    updateLevelMap(level: number) 
        {
          //  this.boxes[this.changeLevel].livello = this.changeLevelStatus + 1;
          this.boxes[this.changeLevel].livello = level + 1;
        }

    updateLevelMapTree(level: number, index_start: number, delta:number) 
        {
          
         
            // this.boxes[index_start].livello = level + 1 + delta;
           
            this.boxes[index_start].livello = level + delta 
         
         
     
        }

        updateLevelMapTree_bis(level: number, index_start: number, delta:number) 
        {
            
            //console.log(level, index_start, delta, 'level, index_start, delta')
            //this.boxes[index_start].livello = level + delta;
            this.boxes[index_start].livello = level + 1;
         
         
     
        }

    updateLevelBox(index: number, level: number) {
    
    if (this.Update) {this.Update.splice(0,2)}

    this.Update.push(index);

       while ((level <= this.boxes[index].livello)) {
        this.boxes[index].livello = this.boxes[index].livello -1;
        if (index < this.boxes.length-1) {
            index = index+1
        } else {
            this.Update.push(index) 
            return this.Update
            }
        }
        this.Update.push(this.Update[0]) 
        return this.Update
    
    }

    get_levelUp(num: number, num_mappa: number) {

        //console.log(this.boxes, 'num: ', num, 'this.boxes[num].livello :', this.boxes[num].livello);

        for (var i=num-1; i!=0; i--) {
          //console.log(this.boxes[num].livello > this.boxes[i].livello);
            if ((this.boxes[num].livello > this.boxes[i].livello) && (this.boxes[i].numero_mappa == num_mappa)) {

                return i;
            }

        }
    }
    

/* 
    get_levelDown(index: number, num_mappa: number) {
    
            for (var i=index+1; i=this.boxes.length-1; i++) {
   
                if ((this.boxes[index].livello < this.boxes[i].livello) && (this.boxes[i].numero_mappa == num_mappa)) {
                    this.update_level(i, num_mappa)                 
                }
                return 
            }
        } */

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

    getBoxes(id_mappa: number) {
        return this.http.get(this.path_to_server + '/mappa_testo/' + id_mappa)
            .map((response: Response) => {
                
                const boxes = response.json().obj;

                console.log(boxes);

                let transformedBoxes: Box[] = [];
                for (let box of boxes) {
                    transformedBoxes.push(new Box(box.content, box.testo, box.user.firstName, box.livello, box.rectangle, box.titolo, box.numero_mappa, box._id, box.user._id, box.color, box.order, box.inMap,   box.intestazione, box.testo_mappa, box.stato))
                }
                this.boxes = transformedBoxes;
                console.log(this.boxes)

                for (var _i: any = 0; _i < boxes.length; _i++) {
                    this.boxes[_i].stato = boxes[_i].stato;}
                //console.log(this.boxes)
                return this.boxes;
            })
             .catch((error: Response) => Observable.throw(error.json()));

    }

    getLastMapNumber() {
        for (let box of this.boxes) {

            this.last_numero_mappa = box.numero_mappa;
        }
        return this.last_numero_mappa;
    }


    editBox(box: Box) {
        this.boxisedit.emit(box);
    }

    editTitolo(box: Box) {
          this.titoloisedit.emit(box);
   }

    updateBox(box: Box) {

        if (box.stato == 4) {
           
        } else if (!box.stato) {
            box.stato = 4
        }
       
        //console.log('siamo in service testo', this.boxes[0].testo_mappa)
        const body = JSON.stringify(box);
        
        const headers = new Headers({'Content-Type': 'application/json'});
        /* const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : ''; */

            const token = localStorage.getItem('userId')
            ? '?token=' + localStorage.getItem('userId')
            : '';
          
        return this.http.patch(this.path_to_server + '/mappa_testo/' + box.boxId + token, body, {headers: headers})
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
        return this.http.delete(this.path_to_server + '/mappa_testo/' + box.boxId + token)
            .map((response: Response) => response.json())
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

    reorderBoxes(from: number, to: number) {
        //this.boxes.splice(to, 0, this.boxes.splice(from, 1)[0]);
        this.boxes.splice(to, 0, this.boxes.splice(from, 1)[0]);
        //console.log(this.boxes)
    }

    get_levelUp_ric(num: number) {
        
        /* if ((num) == (this.boxes.length -1)) {
            this.index_up = num;
            return;
        } */

        // modifica sembra correta per mappe inserire in idee e scaletta?
       /*     if ((num + 1) == (this.boxes.length)) {
             this.index_up = num - 1;
             return;
         }  */
 

         if (this.boxes[num].livello == 0){
             //return (num)
             this.index_up = num;
             return;
         };

         if ((this.boxes[num].livello >= this.boxes[num-1].livello) && (this.boxes[num-1].livello != 0)) 
       //  if ((this.boxes[num].livello >= this.boxes[num-1].livello) ) 
         {
             this.get_levelUp_ric(num-1); 
         } 
             else if (this.boxes[num-1].livello == 0)
         {
                                        
             this.index_up= num-1;
             return
         }    
          else {
             //return (num)
          }
    //      console.log(this.index_up,'this.index_up')
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

       countAngle() {
           let i = 1;
           let step_angle = 1;
            do {
                
                this.get_levelDown_ric(i);
                this.get_levelUp_ric(i);
                if (!this.boxes[i].inMap) {  
                   // console.log(this.boxes[i].inMap, 'this.boxes[i].inMap')
                    if (this.index_up == this.index_down) {     
                         i += 1
                    } else 
                    {
                        i = this.index_down + 1
                    }
                    step_angle += 1
                } else if (this.boxes[i].inMap) {
                    if (this.index_up == this.index_down) {     
                        i += 1
                   } else 
                   {
                       i = this.index_down + 1
                   }

                  // console.log('cavolaccio')
                }
                 
            } while(i < this.boxes.length)
            //console.log(step_angle, 'step_angle')
            return step_angle;
       }

       countStep(index_box:number) {
        let i = 1;
        let number_step = 0;
         do {
             this.get_levelDown_ric(i);
             this.get_levelUp_ric(i);
             if (!this.boxes[i].inMap) {
                 if (this.index_up == this.index_down) {                        
                      i += 1     
                 } else 
                 {
                     i = this.index_down + 1
                 }
                 number_step += 1;
                } else 
                {
                    if (this.index_up == this.index_down) {                        
                        i += 1     
                   } else 
                   {
                       i = this.index_down + 1
                   }
                }
         } while(i <= index_box)
         return number_step;
    }

       

}