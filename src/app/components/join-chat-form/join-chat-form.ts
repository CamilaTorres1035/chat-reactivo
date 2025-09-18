// Importa las herramientas necesarias de Angular y el servicio de chat
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-join-chat-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './join-chat-form.html',
  styleUrl: './join-chat-form.scss'
})
export class JoinChatForm {
  // Formulario donde el usuario escribe su nombre para entrar al chat
  joinForm: FormGroup;
  // Indica si el nombre ya está en uso (para mostrar un mensaje de error)
  nameTaken = false;

  // El constructor prepara el formulario y conecta el servicio de chat
  constructor(private fb: FormBuilder, private chatService: ChatService) {
    // Crea el formulario con un campo obligatorio llamado 'name'
    this.joinForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  // Este método se ejecuta cuando el usuario envía el formulario
  async onSubmit() {
    // Reinicia el error de nombre en uso
    this.nameTaken = false;
    // Si el formulario es válido (el campo no está vacío)
    if (this.joinForm.valid) {
      // Obtiene el nombre escrito por el usuario
      const name = this.joinForm.value.name;
      // Intenta unir al usuario al chat usando el servicio
      const success = await this.chatService.joinChat(name);
      if (!success) {
        // Si el nombre ya está en uso, muestra el error
        this.nameTaken = true;
        this.joinForm.get('name')?.setErrors({ taken: true });
        return;
      }
      // Si el nombre es válido y no está en uso, el usuario entra al chat
      // Aquí podrías navegar al chat o mostrar el siguiente componente
    }
  }
}
