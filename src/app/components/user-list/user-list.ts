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
  // Observable de usuarios activos
  users$: Observable<string[]>;
  // Usuario actual
  currentUser: string | null;

  // Inyecta el ChatService para acceder a los usuarios
  constructor(private chatService: ChatService) {
    // Se suscribe al observable de usuarios
    this.users$ = this.chatService.users$;
    // Obtiene el usuario actual
    this.currentUser = this.chatService.getCurrentUser();
  }
}
