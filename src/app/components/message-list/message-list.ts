// Componente que muestra la lista de mensajes del chat en tiempo real
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService, ChatMessage } from '../../services/chat.service';
import { Observable } from 'rxjs';
import { ScrollToBottomDirective } from '../../directives/scroll-to-bottom.directive';

@Component({
  selector: 'app-message-list',
  imports: [CommonModule, ScrollToBottomDirective],
  templateUrl: './message-list.html',
  styleUrls: ['./message-list.scss']
})
export class MessageList {
  // Observable con la lista de mensajes
  messages$: Observable<ChatMessage[]>;

  // Se usa para activar el scroll automático al fondo
  get messagesTrigger$() {
    return this.messages$;
  }

  // El constructor conecta el componente con el servicio de chat
  constructor(private chatService: ChatService) {
    // Se conecta al observable de mensajes del servicio
    this.messages$ = this.chatService.messages$;
  }

  // Ayuda a Angular a identificar cada mensaje por su id (optimiza el renderizado)
  trackById(index: number, message: any) {
    return message.id;
  }
}
