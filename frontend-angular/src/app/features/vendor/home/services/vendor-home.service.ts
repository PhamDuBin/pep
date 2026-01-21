import { Injectable, signal } from '@angular/core';
import { Company, Message } from '../models/message.model';
import { MOCK_COMPANIES, MOCK_MESSAGES } from '../constants/messages.constant';

@Injectable({
    providedIn: 'root'
})
export class VendorHomeService {
    private companies = signal<Company[]>(MOCK_COMPANIES);
    private messages = signal<Message[]>(MOCK_MESSAGES);
    private selectedCompanyId = signal<string | null>(MOCK_COMPANIES[0]?.id || null);
    private selectedMessageId = signal<string | null>(null);

    // Getters
    getCompanies() {
        return this.companies.asReadonly();
    }

    getMessages() {
        return this.messages.asReadonly();
    }

    getSelectedCompanyId() {
        return this.selectedCompanyId.asReadonly();
    }

    getSelectedMessageId() {
        return this.selectedMessageId.asReadonly();
    }

    // Get filtered messages by company
    getMessagesByCompany(companyId: string) {
        return this.messages().filter(msg => msg.companyId === companyId);
    }

    // Actions
    selectCompany(companyId: string) {
        this.selectedCompanyId.set(companyId);
        this.companies.update(companies =>
            companies.map(c => ({
                ...c,
                isSelected: c.id === companyId
            }))
        );
        // Clear message selection when switching companies
        this.selectedMessageId.set(null);
    }

    selectMessage(messageId: string) {
        this.selectedMessageId.set(messageId);
        this.messages.update(messages =>
            messages.map(m => ({
                ...m,
                isSelected: m.id === messageId
            }))
        );
    }

    // Search companies
    searchCompanies(query: string) {
        if (!query.trim()) {
            this.companies.set(MOCK_COMPANIES);
            return;
        }
        const filtered = MOCK_COMPANIES.filter(c =>
            c.name.toLowerCase().includes(query.toLowerCase())
        );
        this.companies.set(filtered);
    }

    // Search messages
    searchMessages(query: string) {
        if (!query.trim()) {
            this.messages.set(MOCK_MESSAGES);
            return;
        }
        const filtered = MOCK_MESSAGES.filter(m =>
            m.companyName.toLowerCase().includes(query.toLowerCase()) ||
            m.projectName?.toLowerCase().includes(query.toLowerCase()) ||
            m.preview.toLowerCase().includes(query.toLowerCase())
        );
        this.messages.set(filtered);
    }
}
