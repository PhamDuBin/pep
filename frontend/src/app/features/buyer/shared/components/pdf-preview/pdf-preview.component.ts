import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfPage } from '../../models/chat.model';

@Component({
  selector: 'app-shared-pdf-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdf-preview.component.html',
  styleUrl: './pdf-preview.component.scss'
})
export class SharedPdfPreviewComponent {
  @Input() pages: PdfPage[] = [];
  @Input() completedCount = 5;
  @Input() totalCount = 5;

  @Output() download = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onDownload(): void {
    this.download.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
  }
}
