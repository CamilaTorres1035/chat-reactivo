// Servicio central que gestiona toda la lógica del chat y la conexión con Firebase
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Firestore, collectionData, collection, addDoc, query, orderBy, doc, setDoc, deleteDoc, getDoc } from '@angular/fire/firestore';

// Define cómo es un mensaje de chat
export interface ChatMessage {
    user: string;      // Quién envió el mensaje
    text: string;      // El texto del mensaje
    timestamp: any;    // Cuándo se envió (fecha/hora)
}

@Injectable({ providedIn: 'root' })
export class ChatService {
    // Guarda el nombre del usuario actual (solo en memoria, no en la nube)
    private currentUser: string | null = null;

    // Observable: lista de mensajes en tiempo real
    messages$: Observable<ChatMessage[]>;
    // Observable: lista de usuarios activos en tiempo real
    users$: Observable<string[]>;

    constructor(private firestore: Firestore) {
        // Prepara la consulta para obtener los mensajes ordenados por fecha
        const messagesRef = collection(this.firestore, 'messages');
        const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
        // Escucha los mensajes en tiempo real y los expone como observable
        this.messages$ = collectionData(messagesQuery, { idField: 'id' }).pipe(
            map(arr => Array.isArray(arr) ? arr as ChatMessage[] : []),
            startWith([])
        ) as Observable<ChatMessage[]>;

        // Escucha la lista de usuarios activos en tiempo real
        const usersRef = collection(this.firestore, 'users');
        this.users$ = collectionData(usersRef, { idField: 'id' }).pipe(
            map((users: any[]) => users.map(u => u.name))
        );
    }

    // Permite a un usuario unirse al chat
    async joinChat(name: string): Promise<boolean> {
        // Verifica si ya hay alguien con ese nombre
        const userRef = doc(this.firestore, 'users', name);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            // Si ya existe, no deja entrar
            return false;
        }
        // Si no existe, lo guarda como usuario actual y lo agrega a la base de datos
        this.currentUser = name;
        await setDoc(userRef, { name });

        // Cuando el usuario cierra la pestaña, lo elimina de la lista de usuarios activos
        window.addEventListener('unload', () => {
            deleteDoc(userRef);
        });
        return true;
    }

    // Permite enviar un mensaje al chat
    async sendMessage(text: string) {
        if (!this.currentUser) return;
        const messagesRef = collection(this.firestore, 'messages');
        await addDoc(messagesRef, {
            user: this.currentUser,
            text,
            timestamp: new Date()
        });
    }

    // Devuelve el nombre del usuario actual
    getCurrentUser(): string | null {
        return this.currentUser;
    }
}
