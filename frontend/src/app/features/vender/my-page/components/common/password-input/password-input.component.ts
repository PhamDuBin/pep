import { Component, EventEmitter, Input, Output, signal, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-password-input',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './password-input.component.html',
    styleUrl: './password-input.component.scss'
})
export class PasswordInputComponent implements OnInit, OnChanges {
    @Input() label: string = '';
    @Input() placeholder: string = '';
    @Input() value: string = '';
    @Output() valueChange = new EventEmitter<string>();

    showPassword = signal(false);
    displayValue = ''; // What's shown in the input (bullets or actual text)
    actualValue = ''; // The real password value

    ngOnInit() {
        // Initialize actualValue from input value
        this.actualValue = this.value || '';
        this.updateDisplayValue();
    }

    ngOnChanges(changes: SimpleChanges) {
        // Sync actualValue when input value changes from parent
        if (changes['value'] && !changes['value'].firstChange) {
            this.actualValue = this.value || '';
            this.updateDisplayValue();
        }
    }

    togglePasswordVisibility() {
        this.showPassword.update(show => !show);
        this.updateDisplayValue();
    }

    onValueChange(newValue: string) {
        if (this.showPassword()) {
            // When password is visible, update both actual and display
            this.actualValue = newValue;
            this.displayValue = newValue;
        } else {
            // When password is hidden, calculate the change
            const oldLength = this.actualValue.length;
            const newLength = newValue.replace(/●/g, '').length + (newValue.match(/●/g) || []).length;

            if (newLength > oldLength) {
                // Characters were added
                const addedChars = newValue.slice(oldLength).replace(/●/g, '');
                this.actualValue += addedChars;
            } else if (newLength < oldLength) {
                // Characters were removed
                this.actualValue = this.actualValue.slice(0, newLength);
            }

            // Update display with bullets
            this.displayValue = '●'.repeat(this.actualValue.length);
        }

        this.value = this.actualValue;
        this.valueChange.emit(this.actualValue);
    }

    private updateDisplayValue() {
        if (this.showPassword()) {
            this.displayValue = this.actualValue;
        } else {
            this.displayValue = '●'.repeat(this.actualValue.length);
        }
    }
}
