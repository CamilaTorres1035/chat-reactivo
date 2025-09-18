// Componente que muestra la lista de usuarios activos en el chat
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.scss']
})
export class UserList {
  users$: Observable<string[]>;
  currentUser: string | null;

  // Para el modal
  showAll: boolean = false;
  allUsers: string[] = [];

  constructor(private chatService: ChatService) {
    this.users$ = this.chatService.users$;
    this.currentUser = this.chatService.getCurrentUser();
    // Suscribirse para tener la lista completa en memoria
    this.users$.subscribe(users => {
      this.allUsers = users;
    });
  }

  openAllUsers() {
    this.showAll = true;
  }
  closeAllUsers() {
    this.showAll = false;
  }
}
