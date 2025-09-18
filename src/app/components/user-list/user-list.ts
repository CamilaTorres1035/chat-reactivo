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
  // Observable con la lista de usuarios activos
  users$: Observable<string[]>;
  // Guarda el nombre del usuario actual
  currentUser: string | null;

  // El constructor conecta el componente con el servicio de chat
  constructor(private chatService: ChatService) {
    // Se conecta al observable de usuarios activos
    this.users$ = this.chatService.users$;
    // Obtiene el nombre del usuario actual
    this.currentUser = this.chatService.getCurrentUser();
  }
}
