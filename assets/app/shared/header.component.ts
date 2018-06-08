
import {Component, OnInit, ViewEncapsulation, Renderer2, ChangeDetectorRef} from "@angular/core";
import { NgForm } from "@angular/forms";
import {BoxService} from "../box/box.service";
import {IdeaService} from "../idee/idea.service";
import {PostLoginService} from "../post-login/post-login.service";
import {ScalettaService} from "../scaletta/scaletta.service";
import {TestoService} from "../testo/testo.service";
import {Box} from "../box/box.model";
import { ActivatedRoute, Router} from "@angular/router";
import { Tree } from "@angular/router/src/utils/tree";
import {UserService} from "../user/user.service";



@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']

})
export class HeaderComponent implements OnInit{

    box: Box = null;
    boxes: Box[] = [null];
    public number_titolo;
    id_mappa: number;
    active_idee = true;
    pass_idee = false;
    active_mappe= false;
    pass_mappe = false;
    active_scaletta = false;
    pass_scaletta = false;
    active_testo = false;
    pass_testo = false;
    home_state;
    body_class: string = 'DeA-font';
    body_font: string = 'size-regular';
    cursor = 'default';
    
    esci_status: Boolean = false;

    alert_visibility: boolean = false;
    alertTesto = 'Sei sicuro di voler cancellare questo documento?';

    alert_visibility_example: boolean = false;
    alert_visibility_example_box: boolean = false;
    alert_visibility_example_scaletta: boolean = false;
    alert_visibility_example_testo: boolean = false;
    
    alertTestoExample = 'Per modificare questo esempio devi prima copiarlo nella tua area personale. Vuoi procedere alla copia?';
    
   
    header_home = false;
  
    //private placeholderVar;
    
    // used for Quill Editor
    public editor;
    public editorContent;
    public editorOptions = {
      theme: 'bubble',
      placeholderVar: 'Inserisci il titolo qui...',
      bounds: '#editor-container_header',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],          
          ['clean'],
        ]
      }
     
    };
    // used for Quill TestoService
    
        constructor(public route: ActivatedRoute, public router: Router, private boxService: BoxService, private ideaService: IdeaService, private postLoginService: PostLoginService, private scalettaLoginService: ScalettaService, private testoLoginService: TestoService, private postService: PostLoginService, private renderer: Renderer2, private cd: ChangeDetectorRef, private userService: UserService) {

            router.events.subscribe((url:any) => 
            {});  
            
            this.route.params.subscribe (
                params => {                
                     this.id_mappa = +params['id'];
                     console.log('this.id_mappa', this.id_mappa,  params)       }
            )         
    }

    onLogout()  {
        this.userService.logout();
        this.router.navigate(['/auth', 'signin']);

    }

    alert_Visibility() {
        this.alert_visibility = !this.alert_visibility;
    }

    alert_VisibilityExampleBox() {
        this.alert_visibility_example_box = !this.alert_visibility_example_box;
    }

    alert_VisibilityExampleScaletta() {
        this.alert_visibility_example_scaletta = !this.alert_visibility_example_scaletta;
    }

    alert_VisibilityExampleTesto() {
        this.alert_visibility_example_testo = !this.alert_visibility_example_testo;
    }

    alert_VisibilityExample() {
        this.alert_visibility_example = !this.alert_visibility_example;
    }

    enterEsciStatus() {
        
        this.esci_status = !this.esci_status
    }

    leaveEsciStatus() {
        
        this.esci_status = !this.esci_status
    }

    changeCursorIn() {
        
        this.cursor = 'pointer'
    }

    changeCursorOut() {
       
        this.cursor = 'default'
    }

    changeFontSize() {

        
        if (this.body_font == 'size-regular') 
        {
            //console.log('this.body_font: ', this.body_font)
            this.renderer.removeClass(document.body, this.body_font);
            //this.renderer.removeClass(this.editor, this.body_class);
            this.body_font = 'size-big';
            this.renderer.addClass(document.body, this.body_font);

        } 
        else
        {
            //console.log('this.body_font: ', this.body_font)
            this.renderer.removeClass(document.body, this.body_font);
            this.body_font = 'size-regular';
            //this.renderer.addClass(this.editor, this.body_class);
            this.renderer.addClass(document.body, this.body_font);
        }
    }

    changeFont() {
        if (this.body_class == 'DeA-font') 
        {
            
            this.renderer.removeClass(document.body, this.body_class);
            //this.renderer.removeClass(this.editor, this.body_class);
            this.body_class = 'PT-font';
            this.renderer.addClass(document.body, this.body_class);

        } else
        {
            this.renderer.removeClass(document.body, this.body_class);
            this.body_class = 'DeA-font';
            //this.renderer.addClass(this.editor, this.body_class);
            this.renderer.addClass(document.body, this.body_class);
        }
    }

    get_titolo(box) {
        //console.log(box, 'get titolo')
        this.box = box
    }

    onCreaMappa() {
        // let last_mappa =  this.boxService.getLastMapNumber();

        if (this.router.url == '/home/' + this.box.userId) 
        {
            this.onNavigate_Home();
            this.postLoginService.getLastMapNumber()
            .subscribe(
                (boxes: Box[]) => {
                this.boxes = boxes;
              
         
                const box = new Box(' ', 'inserisci il testo...',  'Massimo', 0, {top: 500, bottom: 0, left: window.innerWidth/2 - 100, right: 0, height: 80, width: 200}, true, this.boxService.last_numero_mappa + 1); 
               
             
               box.order = 0;
              
               box.testo = 'inserisci il testo...';
               box.username = 'Massimo';
               box.livello = 0;
               box.titolo = true;
               box.numero_mappa = this.postLoginService.last_numero_mappa + 1;
       
               
               box.color = '#B4B4B4';
               box.inMap = false;
           
       
               this.postLoginService.addBox(box)
                   .subscribe(
                       data => 
                       {
                           
                           this.box = box;
                           
                           this.router.navigate(['idee/'+ this.box.numero_mappa]);
                       },
                       error => console.error(error)
                   );
                
            }
        );

        } else if (this.router.url != '/auth' && this.router.url != '/auth/signup' && this.router.url != '/auth/logout' && this.router.url != '/auth/signin') 

        {
            //this.boxService.getLastMapNumber();
        this.alertTesto = 'Sei sicuro di voler creare un nuovo documento?'
        this.alert_visibility = true;

        /*  */
        }   
    }


    onSubmit_titolo() {
        //console.log('Salvataggio titolo edit',this.boxService.titolo_true())

        
        if (this.box) {
            //console.log('Salvataggio titolo edit',this.boxService.titolo_true())
            //edit
            //this.box.content = form.value.titolo;
            this.box.testo = this.box.testo;
            this.box.livello = this.box.livello;
            //this.boxService.updateBox(this.box)
            this.postLoginService.updateBox(this.box)
                .subscribe(
                    result => console.log(result)

                );
            //this.box = null;

        } else if (!this.boxService.titolo_true()) {

          this.boxService.titolo_true()
            // create
            let num = this.boxService.get_Boxlength();
            //console.log(num);
            
            const box = new Box(this.box.testo, 'Attenzione Creazione errata', localStorage.getItem('userId'), 0, {top: 0, bottom: 0, left: 0, right: 0, height: 80, width: 200}, true, 1, '#B4B4B4');

            this.boxService.addBox(box)
                .subscribe(
                    data => console.log(data),
                    error => console.error(error)
                );

        }

        //form.resetForm();
    }

    onNavigate_Idee() {

       
        
        if ((this.box.numero_mappa == 164) || (this.box.numero_mappa == 141) || (this.box.numero_mappa == 167) || (this.box.numero_mappa == 170)){
            
            // alert('Per modificare devi copiare l\'esempio nella tua area di lavoro in navigazione');

            //provengo da Idee
            if (this.box.stato === 1)
                {
                    //this.ideaService.updateBox(this.ideaService.boxes[0], this.box.numero_mappa);     
                    this.alert_visibility_example = true;
                    return
                } 
            if (this.box.stato === 2)
                {
                    //this.ideaService.updateBox(this.ideaService.boxes[0], this.box.numero_mappa);     
                    this.alert_visibility_example_box = true;
                    return
                } 
            if (this.box.stato === 3)
                {
                    //this.ideaService.updateBox(this.ideaService.boxes[0], this.box.numero_mappa);     
                    this.alert_visibility_example_scaletta = true;
                    return
                }
            if (this.box.stato === 4)
                {
                    //this.ideaService.updateBox(this.ideaService.boxes[0], this.box.numero_mappa);     
                    this.alert_visibility_example_testo = true;
                    return
                } 
            // procedura per copia esempio 
        
        } else {

            this.active_idee = true;
            this.router.navigate(['idee/'+ this.box.numero_mappa]);
        }
          
    }

    onNavigate_Auth() {
         
        this.router.navigate(['auth/']);
       
     }

    onNavigate_Testo() {

        if ((this.box.numero_mappa == 164) || (this.box.numero_mappa == 141) || (this.box.numero_mappa == 167) || (this.box.numero_mappa == 170)){
            
            // alert('Per modificare devi copiare l\'esempio nella tua area di lavoro in navigazione');
            if (this.box.stato === 1)
                {
                    //this.ideaService.updateBox(this.ideaService.boxes[0], this.box.numero_mappa);     
                    this.alert_visibility_example = true;
                    return
                } 
            if (this.box.stato === 2)
                {
                    //this.ideaService.updateBox(this.ideaService.boxes[0], this.box.numero_mappa);     
                    this.alert_visibility_example_box = true;
                    return
                } 
            if (this.box.stato === 3)
                {
                    //this.ideaService.updateBox(this.ideaService.boxes[0], this.box.numero_mappa);     
                    this.alert_visibility_example_scaletta = true;
                    return
                }
            if (this.box.stato === 4)
                {
                    //this.ideaService.updateBox(this.ideaService.boxes[0], this.box.numero_mappa);     
                    this.alert_visibility_example_testo = true;
                    return
                } 
            // procedura per copia esempio 
      
        } else {
            this.active_testo = true;
            this.router.navigate(['testo/'+ this.box.numero_mappa]);
        }
 
     }

    onNavigate_Boxes() {

        console.log(this.router);
        
        if ((this.box.numero_mappa == 164) || (this.box.numero_mappa == 141) || (this.box.numero_mappa == 167) || (this.box.numero_mappa == 170)){
            
            // alert('Per modificare devi copiare l\'esempio nella tua area di lavoro in navigazione');

            //provengo da Idee
            if (this.box.stato === 1)
                {
                    //this.ideaService.updateBox(this.ideaService.boxes[0], this.box.numero_mappa);     
                    this.alert_visibility_example = true;
                    return
                } 
            if (this.box.stato === 2)
                {
                    //this.ideaService.updateBox(this.ideaService.boxes[0], this.box.numero_mappa);     
                    this.alert_visibility_example_box = true;
                    return
                }
            if (this.box.stato === 3)
                {
                    //this.ideaService.updateBox(this.ideaService.boxes[0], this.box.numero_mappa);     
                    this.alert_visibility_example_scaletta = true;
                    return
                }
            if (this.box.stato === 4)
                {
                    //this.ideaService.updateBox(this.ideaService.boxes[0], this.box.numero_mappa);     
                    this.alert_visibility_example_testo = true;
                    return
                }  
            // procedura per copia esempio 
        
        } else {
        
            this.active_mappe =  true;
            this.router.navigate(['boxes/'+ this.box.numero_mappa]); 
        } 
      
}

     onNavigate_Scaletta() {

        if ((this.box.numero_mappa == 164) || (this.box.numero_mappa == 141) || (this.box.numero_mappa == 167) || (this.box.numero_mappa == 170)){
            
      
            if ((this.box.stato === 1) )
                {
                        
                    this.alert_visibility_example = true;
                    return
                } 
            
            if ((this.box.stato === 2) )
                {
                        
                    this.alert_visibility_example_box = true;
                    return
                }
            if (this.box.stato === 3)
                {
                    //this.ideaService.updateBox(this.ideaService.boxes[0], this.box.numero_mappa);     
                    this.alert_visibility_example_scaletta = true;
                    return
                }
            if (this.box.stato === 4)
                {
                    //this.ideaService.updateBox(this.ideaService.boxes[0], this.box.numero_mappa);     
                    this.alert_visibility_example_testo = true;
                    return
                } 
            // procedura per copia esempio 
            // return
            } else {
        
            this.active_scaletta = true;
            this.router.navigate(['scaletta/'+ this.box.numero_mappa]);
        }
        
     }
     
     onNavigate_Home() {

        
        $("#sidebar .closed").fadeOut();
        $("#sidebar .open").fadeIn();
        this.router.navigate(['home/' + this.box.userId]);
       
     }

    ngOnInit() {
      
        this.editorOptions.placeholderVar = 'Titolo';
        
        this.testoLoginService.titoloisedit.subscribe(
            (box: Box) => 

            {     
                console.log('testo login: ', box)
                if (box.content == 'Inserisci il titolo ...') {
               
                   this.box = box;
                   this.editorContent = "";
                
                } else {
                    
                    this.box = box;
                    this.editorContent = this.box.content; 
                }
                this.home_state = false;
               
                if (box.stato == 4 )
                {
                    
                    this.active_mappe = false;
                    this.active_idee = false;
                    this.active_scaletta = false;
                    this.active_testo = true;
                    this.pass_idee = true;
                    this.pass_mappe = true;
                    this.pass_scaletta = true;
                    
            
                }

                if (box.stato == 3 )
                {
                    
                    this.active_mappe = false;
                    this.active_idee = false;
                    this.active_scaletta = false;
                    this.active_testo = true;
                    this.pass_idee = true;
                    this.pass_mappe = true;
                    this.pass_scaletta = true;
                    
            
                }

                if (box.stato == 2 )
                {
                    
                    this.active_mappe = false;
                    this.active_idee = false;
                    this.active_scaletta = false;
                    this.active_testo = true;
                    this.pass_idee = true;
                    this.pass_mappe = true;
                    this.pass_scaletta = false;
                    
            
                }

                if (box.stato == 1 )
                {
                    
                    this.active_mappe = false;
                    this.active_idee = false;
                    this.active_scaletta = false;
                    this.active_testo = true;
                    this.pass_idee = true;
                    this.pass_mappe = false;
                    this.pass_scaletta = false;
                    
            
                }

                this.box = this.testoLoginService.boxes[ this.testoLoginService.get_titolo()];
                this.editorContent = this.box.content;
                
               
                     
           }
        )

        
        this.boxService.titoloisedit.subscribe(
            (box: Box) => 

            {    
                
                
                if (box.content == 'Inserisci il titolo ...') {
                    
                    this.box = this.boxService.boxes[0];
                    this.editorContent = "";
                
                } else {
               
                    this.box = this.boxService.boxes[0];
                    this.editorContent = this.box.content; 
                }

                this.home_state = false;

                if (box.stato == 2 )
                {
                    
                    this.active_mappe = true;
                    this.active_idee = false;
                    this.active_scaletta = false;
                    this.active_testo = false;
                    this.pass_idee = true;
                    
                    this.pass_scaletta = false;
                    this.pass_testo = false
                }

                if (box.stato == 1 )
                {
                    
                    this.active_mappe = true;
                    this.active_idee = false;
                    this.active_scaletta = false;
                    this.active_testo = false;
                    this.pass_idee = true;
                    
                    this.pass_scaletta = false;
                    this.pass_testo = false
                }

                if (box.stato == 3 )
                {
                    
                    this.active_mappe = true;
                    this.active_idee = false;
                    this.active_scaletta = false;
                    this.active_testo = false;
                    this.pass_idee = true;
                    
                    this.pass_scaletta = true;
                    this.pass_testo = false
                }

                if (box.stato == 4 )
                {
                    
                    this.active_mappe = true;
                    this.active_idee = false;
                    this.active_scaletta = false;
                    this.active_testo = false;
                    this.pass_idee = true;
                    
                    this.pass_scaletta = true;
                    this.pass_testo = true
                }
             
                this.box = this.boxService.boxes[0];
                this.editorContent = this.box.content; 
                
                     
           }
        )

        this.scalettaLoginService.titoloisedit.subscribe(
            (box: Box) => 

            {   
                

                if (box.content == 'Inserisci il titolo ...') {
                    
                    this.box = this.scalettaLoginService.boxes[0];
                    this.editorContent = "";
                
                } else {
            
                    this.box = this.scalettaLoginService.boxes[0];
                    this.editorContent = this.box.content; 
                }

                this.home_state = false;
                   
                if (box.stato == 3 )
                {
                    this.active_scaletta = true;
                    this.active_mappe = false;
                    this.active_idee = false;
                    this.active_testo = false;
                    this.pass_idee = true;
                    this.pass_mappe = true;
                    this.pass_testo = false;
                    
                }

                if (box.stato == 4 )
                {
                    this.active_scaletta = true;
                    this.active_mappe = false;
                    this.active_idee = false;
                    this.active_testo = false;
                    this.pass_idee = true;
                    this.pass_mappe = true;
                    this.pass_testo = true;
                    
                }

                if (box.stato == 2 )
                {
                    this.active_scaletta = true;
                    this.active_mappe = false;
                    this.active_idee = false;
                    this.active_testo = false;
                    this.pass_idee = true;
                    this.pass_mappe = true;
                    this.pass_testo = false;
                    
                }

                if (box.stato == 1 )
                {
                    this.active_scaletta = true;
                    this.active_mappe = false;
                    this.active_idee = false;
                    this.active_testo = false;
                    this.pass_idee = true;
                    this.pass_mappe = false;
                    this.pass_testo = false;
                    
                }
        
                    
                this.box = this.scalettaLoginService.boxes[0];
                this.editorContent = this.box.content; 
                     
           }
        )
        
        this.postLoginService.titoloisedit.subscribe(
            (box: Box) => 
            
            {
                
            this.home_state = true;
              this.box = this.postLoginService.boxes[0];
              this.editorContent = this.box.content;
                   
                    } 
                       
                )

        this.ideaService.titoloisedit.subscribe(
            (box: Box) =>
            {    
    
                
                if (box.content == 'Inserisci il titolo ...') {
                    
                    this.box = this.ideaService.boxes[0];
                    this.editorContent = "";
                
                } else {
         
                    this.box = this.ideaService.boxes[0];
                    this.editorContent = this.box.content; 
                    
                }

                this.home_state = false;

                if (box.stato == 4) {
                    this.active_idee = true;
                    this.active_mappe = false;
                    this.active_scaletta = false;
                    this.active_testo = false
                    this.pass_mappe = true;
                    this.pass_scaletta = true;
                    this.pass_testo = true
        
                 }

                 if (box.stato == 3) {
                    this.active_idee = true;
                    this.active_mappe = false;
                    this.active_scaletta = false;
                    this.active_testo = false
                    this.pass_mappe = true;
                    this.pass_scaletta = true;
                    this.pass_testo = false
        
                 }

                 if (box.stato == 2) {
                    this.active_idee = true;
                    this.active_mappe = false;
                    this.active_scaletta = false;
                    this.active_testo = false
                    this.pass_mappe = true;
                    this.pass_scaletta = false;
                    this.pass_testo = false
        
                 }
                    
                if (box.stato == 1 )
                    {
                        
                    this.active_idee = true;
                    this.active_mappe = false;
                    this.active_scaletta = false;
                    this.active_testo = false;
                    this.pass_mappe = false;
                    this.pass_scaletta = false;
                    this.pass_testo = false
                    }
                    
                    this.box = this.ideaService.boxes[0];
                    this.editorContent = this.box.content; 
          
            }
            
        ) 
    
        if (this.box == null) {
            this.editorContent = "   ";
          
            this.box = new Box('  ', '  ', '  ', 0);
            this.editorContent = this.box.content;
            this.home_state = true
        } 

      
       // pensare se a senso //
       
        this.cd.detectChanges();      
    }


    /* onEditorBlured(quill) {
        
    //    console.log('editor blur!', quill);
      } */
    

    /*   onEditorFocused(quill) {
       
       // this.rect_right_bottom = ! this.rect_right_bottom;
    //    console.log('editor focus!', quill);
      } */
    
      onEditorCreated(quill) {
        this.editor = quill;
        quill.focus();
        
      //  console.log('quill is ready! this is current quill instance object', quill);
         
      }


      onContentChanged(event) {
        // onContentChanged( quill, html, text ) {
            
            if (event.text.length != 1)
            {
               this.box.content = event.html;
               this.onSubmit_titolo();
            }
       

       }

    callDeleteMappa() {

        this.alertTesto = 'Sei sicuro di voler cancellare questo documento?'
        this.alert_visibility = true;

        /* this.postService.arrayCountMappa(this.box.numero_mappa);
         
        while(this.postService.indexBoxes.length) {
            let index = this.postService.indexBoxes.pop();
            
            this.ondeleteMappa(this.postService.boxes[index]);
            this.postService.boxes.splice(index, 1);
            
        }  */ 
        
        
    }

    ondeleteMappa(box) {
       
        this.postService.deleteMappa(box)
        .subscribe(
            
            result => 
            {
                console.log(result, 'delete box');
                
                this.onNavigate_Home()    
                
            }
        );   
        
           
    }


}