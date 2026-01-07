import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-password-input',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './password-input.component.html',
    styleUrl: './password-input.component.scss'
})
export class PasswordInputComponent {
    @Input() label: string = '';
    @Input() placeholder: string = '';
    @Input() value: string = '';
    @Output() valueChange = new EventEmitter<string>();

    showPassword = signal(false);

    togglePasswordVisibility() {
        this.showPassword.update(show => !show);
    }

    onValueChange(newValue: string) {
        this.value = newValue;
        this.valueChange.emit(newValue);
    }
}
