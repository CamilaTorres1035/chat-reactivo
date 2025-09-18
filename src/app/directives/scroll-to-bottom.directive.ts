import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

/**
 * Directiva para hacer scroll automático al fondo de un contenedor cuando cambia el contenido.
 * Se debe aplicar al contenedor de la lista de mensajes.
 */
@Directive({
  selector: '[appScrollToBottom]',
  standalone: true
})
export class ScrollToBottomDirective implements OnChanges {
  // Se puede usar para forzar el scroll cuando cambia el array de mensajes
  @Input() triggerScroll: any;

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Cuando cambia el triggerScroll, se hace scroll al fondo
    if (changes['triggerScroll']) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom() {
    const element = this.el.nativeElement;
    element.scrollTop = element.scrollHeight;
  }
}
