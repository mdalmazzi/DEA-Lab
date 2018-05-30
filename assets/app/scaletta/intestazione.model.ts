
export class Intestazione {
    content: string;
    testo: string;
    username: string; 
    numero_mappa?: number;
    boxId?: string;
    userId?: string;    
    intestazione?: boolean;
    

    constructor(content: string, testo: string, username: string, numero_mappa?: number, boxId?: string, userId?: string, intestazione?: boolean) {
        this.content = content;
        this.testo = testo;
        this.username = username;      
        this.numero_mappa = numero_mappa;
        this.boxId = boxId;
        this.userId = userId;
        this.intestazione = intestazione;

    }
}