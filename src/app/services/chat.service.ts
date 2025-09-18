// Servicio central que gestiona toda la lógica del chat y la conexión con Firebase
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Firestore, collectionData, collection, addDoc, query, orderBy, doc, setDoc, deleteDoc, getDoc } from '@angular/fire/firestore';
import { Database, objectVal, ref, set, remove, onDisconnect, getDatabase, listVal } from '@angular/fire/database';

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
    // Observable: lista de usuarios activos en tiempo real (ahora desde RTDB)
    users$: Observable<string[]>;

    private db: Database;

    constructor(private firestore: Firestore) {
        this.db = inject(Database);
        // Prepara la consulta para obtener los mensajes ordenados por fecha
        const messagesRef = collection(this.firestore, 'messages');
        const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
        // Escucha los mensajes en tiempo real y los expone como observable
        this.messages$ = collectionData(messagesQuery, { idField: 'id' }).pipe(
            map(arr => Array.isArray(arr) ? arr as ChatMessage[] : []),
            startWith([])
        ) as Observable<ChatMessage[]>;

        // Escucha la lista de usuarios activos en tiempo real desde RTDB
        const presenceRef = ref(this.db, 'presence');
        this.users$ = objectVal<{[key: string]: {name: string}}>(presenceRef).pipe(
            map(obj => obj ? Object.keys(obj) : [])
        );
    }

    // Permite a un usuario unirse al chat
    async joinChat(name: string): Promise<boolean> {
        // Verifica si ya hay alguien con ese nombre en RTDB
        const presenceRef = ref(this.db, `presence/${name}`);
        const snapshot = await (await import('firebase/database')).get(presenceRef);
        if (snapshot.exists()) {
            return false;
        }
        this.currentUser = name;
        // Marca presencia en RTDB
        await set(presenceRef, { name });
        // Configura onDisconnect para eliminar al usuario si se desconecta
        onDisconnect(presenceRef).remove();
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
