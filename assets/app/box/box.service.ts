import {Box} from "./box.model";
import {BoxPosition} from "./circle.model";
import {Http, Response, Headers} from "@angular/http";
import {EventEmitter, Injectable} from "@angular/core";
import { Router} from "@angular/router";

import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";



@Injectable()
export class BoxService {
    public boxes: Box[] = [];
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
    public index_down_inside;
    public secondaryRadiusX: number;
    public secondaryRadiusY: number;

    public style: BoxPosition[] = [];

    public colorArray: string[] = ['228ae6','a3daff','fa5252','ffa8a8','f08c00','ffd43b','a9e34b', '20c997', 'F5DA81', '13c6f0', 'F781BE', '228ae6','a3daff','fa5252','ffa8a8','f08c00','ffd43b','a9e34b', '20c997', 'F5DA81', '13c6f0', 'F781BE', '228ae6','a3daff','fa5252','ffa8a8','f08c00','ffd43b','a9e34b', '20c997', 'F5DA81', '13c6f0', 'F781BE', '228ae6','a3daff','fa5252','ffa8a8','f08c00','ffd43b','a9e34b', '20c997', 'F5DA81', '13c6f0', 'F781BE', '228ae6','a3daff','fa5252','ffa8a8','f08c00','ffd43b','a9e34b', '20c997', 'F5DA81', '13c6f0', 'F781BE', '228ae6','a3daff','fa5252','ffa8a8','f08c00','ffd43b','a9e34b', '20c997', 'F5DA81', '13c6f0', 'F781BE' ];

    alert_visibilityTooltip: boolean[] = [];

    
     //private path_to_server: string = 'http://dealab-env.cpr43rbhcm.us-west-2.elasticbeanstalk.com'; 


    //private path_to_server: string = 'https://labscrittura-labscrittura-staging.eu-central-1.elasticbeanstalk.com'

    // private path_to_server: string = 'http://localhost:3000'; 
    private path_to_server: string = 'http://192.168.1.41:3000'; 

    constructor(private router: Router, private http: Http) {
        this.style = [];         
    }

    // getBaricentro() {
        
    //     let bar_x : number = 0;
    //     let bar_y : number = 0;

    //     for (var i=0; i<(this.boxes.length); i++) { 
    //         if (this.boxes[i].livello == 0 && !this.boxes[i].titolo)
    //         {
    //             bar_x = bar_x + this.boxes[i].rectangle.left;
    //             bar_y = bar_y + this.boxes[i].rectangle.top;
    //             console.log(this.boxes[i].rectangle.left, this.boxes[i].rectangle.top);
    //         }   
    //     }
       
    //     return (bar_x/(this.boxes.length-1), bar_y/(this.boxes.length-1));

    // }

    cleanStyle() {
        this.style =  [];
    }

  

    addStyle(posizione: BoxPosition)
    {
        let flag: boolean = false;
        for (var i=0; i<(this.style.length); i++) { 
            if (this.style[i].numero == posizione.numero)
            {
                flag = true;
            }   
        }
        if (!flag) {
            this.style.push(posizione);
        }
        
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
        return this.http.post(this.path_to_server + '/mappa_box' + token, body, {headers: headers})
            .map((response: Response) => {
                const result = response.json();
                const box = new Box(result.obj.content, result.obj.testo, result.obj.user.firstName, result.obj.livello, result.obj.rectangle, result.obj.titolo, result.obj.numero_mappa, result.obj._id, result.obj.user._id, 
                result.obj.color,
                result.obj.order,
                result.obj.inMap,
                result.obj.stato,
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

    test_Box_level0() {
        let flag = 0;
        for (var i=0; i<(this.boxes.length); i++) {
            if (this.boxes[i].livello == 0) {
                //return i
                flag = flag + 1
            }
        }
        //console.log('testl livello 0', flag)
        return flag;
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

    updateLevelMapTree_bis(level: number, index_start: number, delta: number) 
        {
            
            //console.log('level: ', level, 'index_start: ', index_start, 'delta: ', delta)
            this.boxes[index_start].livello = level + delta;
         
         
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
        return this.http.get(this.path_to_server + '/mappa_box/' + id_mappa)
            .map((response: Response) => {
                const boxes = response.json().obj;
                //console.log(boxes)
                let transformedBoxes: Box[] = [];
                for (let box of boxes) {
                    if (!box.intestazione) {
                        transformedBoxes.push(new Box(box.content, box.testo, box.user.firstName, box.livello, box.rectangle, box.titolo, box.numero_mappa, box._id, box.user._id, box.color, box.order, box.inMap, box.stato));
                        let lung = transformedBoxes.length;
                        transformedBoxes[lung -1].stato = box.stato
                    }
                }
                this.boxes = transformedBoxes;
                
               /*  for (var _i: any = 0; _i < boxes.length; _i++) {
                    this.boxes[_i].stato = boxes[_i].stato;} */

                //console.log(this.boxes)
                //return transformedBoxes;
                for (var i=0; i<(this.boxes.length); i++) 
                    {
                        this.alert_visibilityTooltip.push(false)
                    }
                //console.log(this.alert_visibilityTooltip)
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

   getLastMapNumberCrea() {

       
    return this.http.get(this.path_to_server + '/mappa_home' )
        
        .map((response: Response) => {
            const boxes = response.json().obj;
            
            let transformedBoxes: Box[] = [];
           

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
           
        })
         .catch((error: Response) => Observable.throw(error.json()));

}

   onCreaMappa(boxes, box) {

    console.log('CreaMappa');

    let userId = localStorage.getItem('userId');
   
    this.getLastMapNumberCrea()
        .subscribe(
      
        (last_numero_mappa: any) => {
    
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
                        data => console.log(data),
                        error => console.error(error)
                        ); 
              }); 

              this.getBoxes(last_numero_mappa + 1)
              .subscribe(
                  (boxes: Box[]) => {
                      this.boxes = boxes;
              
                      
                      this.router.navigate(['boxes/'+ (last_numero_mappa + 1)]);

                      }
                  );

                  box.numero_mappa = last_numero_mappa + 1;
                  box.userId = userId;
                  return box

        }
    );               
 }

    updateBox(box: Box) {
       
        console.log('box', box)
        // Inserire controllo per copia e check stato lettura oggetti esempio
        if ((box.numero_mappa == 141) ) {
            alert('Per modificare devi copiare l\'esempio nella tua area di lavoro');
            this.onCreaMappa(this.boxes, box); 
        } else {

            if (box.stato > 2) {
           
            } else if (!box.stato) {
                box.stato = 2
            }
    
            const body = JSON.stringify(box);
            
            const headers = new Headers({'Content-Type': 'application/json'});
            /* const token = localStorage.getItem('token')
                ? '?token=' + localStorage.getItem('token')
                : ''; */
    
            const token = localStorage.getItem('userId')
                ? '?token=' + localStorage.getItem('userId')
                : '';
              
            return this.http.patch(this.path_to_server + '/mappa_box/' + box.boxId + token, body, {headers: headers})
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
        return this.http.delete(this.path_to_server + '/mappa_box/' + box.boxId + token)
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

 get_levelDown_Inside_ric(index: number, test: number) {
        
       
     if ((index +1) == (this.boxes.length)) {
        // this.index_down = index - 1;
        this.index_down_inside = index ;
         return
     }

     if (this.boxes[index+1].livello == 0) {
         this.index_down_inside = index;
         return
     }
  

    if (((this.boxes[index+1].livello !=
         this.boxes[test].livello) && ((index+1) <= this.boxes.length ))) 
         {
            this.get_levelDown_Inside_ric(index + 1, test);
        } else  {
            this.index_down_inside = index
        }      
               
        //console.log(this.index_down,'this.index_down')
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
             // Riscriverla  
                if (!this.boxes[i].inMap) {  

                   
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

                  
                }
                 
            } while(i < this.boxes.length)
            //console.log(step_angle, 'step_angle')
            return step_angle;
       }

       //Countstep esclude inMap - Corretto?
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

    countlevel(index_box: number)
    
    {
        let count = 0;
        for (var i=0; i<(this.boxes.length); i++) {
            if (this.boxes[i].livello == this.boxes[index_box].livello) {
         
                count = count + 1;
                
            }
        }
        return count
    }

    countlevel_before(index_box: number, quadrante: number): number
    
    {
        let count = 0;
        let circle_sup;
        
        if (index_box == 2) {return 0}

        for (var _i: any = 0; _i < this.style.length; _i++) {
            if (this.style[_i].numero == index_box) 
            {
                circle_sup = _i
            }
        }

        //for (var i=0; i<(index_box); i++) {
        for (var i=0; i<(circle_sup); i++) {

            if (quadrante == 1) { 
                if ((this.style[0].left >= this.style[i].left) && (this.style[0].top >= this.style[i].top) )  
                {
                    count = count + 1;
                }
            //    console.log('this.style: ', this.style, 'index_box: ', index_box, 'count: ', count, 'quadrante 1')
            }

            if ( quadrante == 2) {
                if ((this.style[0].left >= this.style[i].left) && (this.style[0].top < this.style[i].top) ) 
                {
                    count = count + 1;
                }
            //    console.log('this.style: ', this.style, 'index_box: ', index_box, 'count: ', count, 'quadrante 2')
            }
            if (quadrante == 3) {
                if ((this.style[0].left < this.style[i].left) && (this.style[0].top < this.style[i].top) ) 
                {
                    count = count + 1;
                }
           //     console.log('this.style: ', this.style, 'index_box: ', index_box, 'count: ', count, 'quadrante 3')
            }
            if (quadrante == 4) {
                if ((this.style[0].left < this.style[i].left) && (this.style[0].top >= this.style[i].top) ) 
                {
                   count = count + 1;
                }
             //   console.log('this.style: ', this.style, 'index_box: ', index_box, 'count: ', count, 'quadrante 1')
            }     
        }
        
        return count
    }
}

    

       

