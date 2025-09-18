import { Component, signal } from '@angular/core';
import { JoinChatForm } from './components/join-chat-form/join-chat-form';
import { MessageInput } from './components/message-input/message-input';
import { MessageList } from './components/message-list/message-list';
import { UserList } from './components/user-list/user-list';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  imports: [
    JoinChatForm,
    MessageInput,
    MessageList,
    UserList
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('chat-reactivo');

  // Inyecta el servicio de chat
  constructor(public chatService: ChatService) {}

  // Devuelve el usuario actual
  get currentUser() {
    return this.chatService.getCurrentUser();
  }
}
