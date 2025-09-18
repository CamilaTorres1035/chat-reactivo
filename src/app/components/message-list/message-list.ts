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
  // Observable de mensajes del chat
  messages$: Observable<ChatMessage[]>;

  // Exponer el observable como trigger para la directiva
  get messagesTrigger$() {
    return this.messages$;
  }

  // Inyecta el ChatService para acceder a los mensajes
  constructor(private chatService: ChatService) {
    // Se suscribe al observable de mensajes
    this.messages$ = this.chatService.messages$;
  }

  // trackBy para *ngFor
  trackById(index: number, message: any) {
    return message.id;
  }
}
