// Componente que muestra la lista de mensajes del chat en tiempo real
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService, ChatMessage } from '../../services/chat.service';
import { Observable, map } from 'rxjs';
import { ScrollToBottomDirective } from '../../directives/scroll-to-bottom.directive';

@Component({
  selector: 'app-message-list',
  imports: [CommonModule, ScrollToBottomDirective],
  templateUrl: './message-list.html',
  styleUrls: ['./message-list.scss']
})
export class MessageList {
  // Observable que emite los mensajes con separadores de fecha
  messagesWithDateSeparators$: Observable<Array<{ type: 'separator', label: string } | { type: 'message', message: ChatMessage }>>;

  constructor(private chatService: ChatService) {
    // Transforma el observable de mensajes para incluir separadores de fecha
    this.messagesWithDateSeparators$ = this.chatService.messages$.pipe(
      map(messages => {
        const result: Array<{ type: 'separator', label: string } | { type: 'message', message: ChatMessage }> = [];
        let lastDate: string | null = null;
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        for (const msg of messages) {
          // Obtener la fecha del mensaje en zona local (sin hora)
          const dateObj = msg.timestamp?.toDate ? msg.timestamp.toDate() : new Date(msg.timestamp);
          // Convertir a fecha local (año, mes, día)
          const localYear = dateObj.getFullYear();
          const localMonth = dateObj.getMonth();
          const localDay = dateObj.getDate();
          const dateStr = `${localYear}-${localMonth + 1}-${localDay}`;

          if (lastDate !== dateStr) {
            // Determinar el label del separador
            let label = '';
            if (
              localYear === today.getFullYear() &&
              localMonth === today.getMonth() &&
              localDay === today.getDate()
            ) {
              label = 'Hoy';
            } else if (
              localYear === yesterday.getFullYear() &&
              localMonth === yesterday.getMonth() &&
              localDay === yesterday.getDate()
            ) {
              label = 'Ayer';
            } else {
              label = dateObj.toLocaleDateString();
            }
            result.push({ type: 'separator', label });
            lastDate = dateStr;
          }
          result.push({ type: 'message', message: msg });
        }
        return result;
      })
    );
  }

  // El trigger de scroll debe seguir funcionando igual
  get messagesTrigger$() {
    return this.chatService.messages$;
  }

  // Ayuda a Angular a identificar cada mensaje por su id (optimiza el renderizado)
  trackById(index: number, item: any) {
    return item.type === 'message' ? item.message.id : item.label;
  }
}
