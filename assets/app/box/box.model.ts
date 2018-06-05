import {BoundingRectangle } from './rectangle.model';

export class Box {
    content: string;
    testo: string;
    username: string;
    livello?: number;
    rectangle?: BoundingRectangle;
    titolo?: boolean;
    numero_mappa?: number;
    boxId?: string;
    userId?: string;
    color?: string;
    //order?: string;
    order?: number;
    inMap?: boolean;
    stato?: number;
    intestazione?: boolean;
    testo_mappa?: string;
    
    

    constructor(content: string, testo: string, username: string, livello?: number, rectangle?: BoundingRectangle, titolo?: boolean, numero_mappa?: number, boxId?: string, userId?: string, color?: string, order?: number, inMap?: boolean,  intestazione?: boolean, testo_mappa?: string, stato?: number) {
        this.content = content;
        this.testo = testo;
        this.username = username;
        this.livello = livello;
        this.rectangle = rectangle;
        this.titolo = titolo;
        this.numero_mappa = numero_mappa;
        this.boxId = boxId;
        this.userId = userId;
        this.color = color;
        this.order = order;
        this.inMap = inMap;
        this.testo_mappa = testo_mappa;
        this.intestazione = intestazione;
        this.stato = stato;

    }
}