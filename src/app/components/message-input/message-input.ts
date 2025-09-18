import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-message-input',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './message-input.html',
  styleUrl: './message-input.scss'
})
export class MessageInput {
  // Formulario reactivo para el mensaje
  messageForm: FormGroup;

  // Inyecta FormBuilder para crear el formulario y ChatService para enviar mensajes
  constructor(private fb: FormBuilder, private chatService: ChatService) {
    // Inicializa el formulario con un campo 'text' requerido
    this.messageForm = this.fb.group({
      text: ['', Validators.required]
    });
  }

  // Método que se llama al enviar el formulario
  onSubmit() {
    if (this.messageForm.valid) {
      const text = this.messageForm.value.text;
      this.chatService.sendMessage(text); // Llama al servicio para enviar el mensaje
      this.messageForm.reset(); // Limpia el campo después de enviar
    }
  }
}
