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
  // Formulario reactivo para el nombre de usuario
  joinForm: FormGroup;
  // Controla si el nombre ya está en uso
  nameTaken = false;

  // Inyecta FormBuilder para crear el formulario y ChatService para unirse al chat
  constructor(private fb: FormBuilder, private chatService: ChatService) {
    // Inicializa el formulario con un campo 'name' requerido
    this.joinForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  // Método que se llama al enviar el formulario
  async onSubmit() {
    this.nameTaken = false;
    if (this.joinForm.valid) {
      const name = this.joinForm.value.name;
      const success = await this.chatService.joinChat(name);
      if (!success) {
        this.nameTaken = true;
        this.joinForm.get('name')?.setErrors({ taken: true });
        return;
      }
      // Aquí podrías navegar al chat o mostrar el siguiente componente
    }
  }
}
