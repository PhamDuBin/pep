import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DownloadFormat } from '../../models/chat.model';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-shared-download-format-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './download-format-modal.component.html',
  styleUrl: './download-format-modal.component.scss'
})
export class SharedDownloadFormatModalComponent {
  @Input() isOpen = false;
  @Input() isLoading = false;

  @Output() download = new EventEmitter<DownloadFormat>();
  @Output() close = new EventEmitter<void>();

  selectedFormat: DownloadFormat = 'pdf';

  onDownload(): void {
    this.download.emit(this.selectedFormat);
  }

  onClose(): void {
    this.close.emit();
  }
}
