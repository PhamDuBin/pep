import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-project-plan-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './project-plan-modal.component.html',
  styleUrl: './project-plan-modal.component.scss',
})
export class ProjectPlanModalComponent {
  @Input() isOpen: boolean = false;
  @Input() isLoading: boolean = false;

  @Output() close = new EventEmitter<void>();

  previewImages: string[] = ['pictures/pic1.jpg', 'pictures/pic2.jpg'];

  onClose(): void {
    this.close.emit();
  }
}
