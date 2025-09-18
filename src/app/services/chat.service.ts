import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Firestore, collectionData, collection, addDoc, query, orderBy, doc, setDoc, deleteDoc, getDoc } from '@angular/fire/firestore';

// Interfaz que representa la estructura de un mensaje de chat
export interface ChatMessage {
    user: string;      // Nombre del usuario que envía el mensaje
    text: string;      // Contenido del mensaje
    timestamp: any;    // Marca de tiempo del mensaje (Firestore Timestamp o Date)
}

@Injectable({ providedIn: 'root' })
export class ChatService {
    // Almacena el nombre del usuario actual solo en memoria
    private currentUser: string | null = null;

    // Observable de mensajes en tiempo real desde Firestore, ordenados por timestamp
    messages$: Observable<ChatMessage[]>;
    // Observable de usuarios activos en tiempo real desde Firestore
    users$: Observable<string[]>;

    constructor(private firestore: Firestore) {
        // Colección de mensajes, ordenados por timestamp ascendente
        const messagesRef = collection(this.firestore, 'messages');
        const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
        this.messages$ = collectionData(messagesQuery, { idField: 'id' }).pipe(
            map(arr => Array.isArray(arr) ? arr as ChatMessage[] : []),
            startWith([])
        ) as Observable<ChatMessage[]>;

        // Colección de usuarios activos
        const usersRef = collection(this.firestore, 'users');
        this.users$ = collectionData(usersRef, { idField: 'id' }).pipe(
            map((users: any[]) => users.map(u => u.name))
        );
    }

    // Método para que un usuario se una al chat (lo agrega a la colección 'users')
    async joinChat(name: string): Promise<boolean> {
        // Verifica si ya existe un usuario con ese nombre
        const userRef = doc(this.firestore, 'users', name);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            // Ya existe un usuario con ese nombre
            return false;
        }
        this.currentUser = name;
        await setDoc(userRef, { name });

        // Eliminar usuario al cerrar la pestaña o recargar (mejor con 'unload' y sin await)
        window.addEventListener('unload', () => {
            deleteDoc(userRef);
        });
        return true;
    }

    // Método para enviar un mensaje al chat (lo agrega a la colección 'messages')
    async sendMessage(text: string) {
        if (!this.currentUser) return;
        const messagesRef = collection(this.firestore, 'messages');
        await addDoc(messagesRef, {
            user: this.currentUser,
            text,
            timestamp: new Date()
        });
    }

    // Devuelve el usuario actual (o null si no hay ninguno)
    getCurrentUser(): string | null {
        return this.currentUser;
    }
}
