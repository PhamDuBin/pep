import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  ChatMessage,
  ChatConversation,
  SendMessageRequest,
  SendMessageResponse,
  GetConversationRequest,
  GetConversationResponse
} from '../models/chat-message.model';
import { ChatMode } from '../models/chat-mode.model';
import {
  MOCK_CHAT_MESSAGES,
  MOCK_CONVERSATION,
  AI_RESPONSES
} from '../constants/chat-messages.constant';
import { CHAT_MODES, DEFAULT_CHAT_MODE } from '../constants/chat-modes.constant';
import {
  PROJECT_PLAN_AI_RESPONSE,
  PROJECT_PLAN_COST_RESPONSE
} from '../constants/project-plan.constant';

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  private messagesSignal = signal<ChatMessage[]>(MOCK_CHAT_MESSAGES);
  private currentModeSignal = signal<ChatMode>(DEFAULT_CHAT_MODE);
  private isLoadingSignal = signal<boolean>(false);
  private conversationIdSignal = signal<string>(MOCK_CONVERSATION.id);

  // Public readonly signals
  messages = this.messagesSignal.asReadonly();
  currentMode = this.currentModeSignal.asReadonly();
  isLoading = this.isLoadingSignal.asReadonly();
  conversationId = this.conversationIdSignal.asReadonly();

  // Available modes
  availableModes = computed(() => CHAT_MODES);

  /**
   * Send a message to the AI chat
   * @param content The message content
   * @returns Observable with the response
   */
  sendMessage(content: string): Observable<SendMessageResponse> {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      sender: 'user',
      isNew: true
    };

    // Mark all existing messages as not new
    this.messagesSignal.update(messages =>
      messages.map(m => ({ ...m, isNew: false }))
    );

    // Add user message immediately
    this.messagesSignal.update(messages => [...messages, userMessage]);
    this.isLoadingSignal.set(true);

    // Simulate API call with mock response
    return this.simulateApiCall(content);
  }

  /**
   * Get conversation history
   * @param request The request parameters
   * @returns Observable with conversation data
   */
  getConversation(request: GetConversationRequest): Observable<GetConversationResponse> {
    // Mock API response
    return of({
      success: true,
      conversation: MOCK_CONVERSATION
    }).pipe(delay(300));
  }

  /**
   * Set the current chat mode
   * @param mode The chat mode to set
   */
  setMode(mode: ChatMode): void {
    this.currentModeSignal.set(mode);
  }

  /**
   * Clear all messages
   */
  clearMessages(): void {
    this.messagesSignal.set([]);
  }

  /**
   * Reset to initial mock data
   */
  resetToMockData(): void {
    this.messagesSignal.set(MOCK_CHAT_MESSAGES);
    this.conversationIdSignal.set(MOCK_CONVERSATION.id);
  }

  /**
   * Simulate API call with mock response
   */
  private simulateApiCall(userContent: string): Observable<SendMessageResponse> {
    const aiResponse = this.generateAiResponse(userContent);

    return new Observable(observer => {
      setTimeout(() => {
        // Mark user message as not new before adding AI response
        this.messagesSignal.update(messages =>
          messages.map(m => ({ ...m, isNew: false }))
        );

        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          timestamp: new Date(),
          sender: 'ai',
          isNew: true
        };

        this.messagesSignal.update(messages => [...messages, aiMessage]);
        this.isLoadingSignal.set(false);

        observer.next({
          success: true,
          message: aiMessage,
          conversationId: this.conversationIdSignal()
        });
        observer.complete();
      }, 1000);
    });
  }

  /**
   * Generate AI response based on user input
   */
  private generateAiResponse(userContent: string): string {
    const lowerContent = userContent.toLowerCase();
    const currentMode = this.currentModeSignal();

    // Check if in project plan mode
    if (currentMode.id === 'project-plan') {
      // Return project plan response for any input in this mode
      return PROJECT_PLAN_AI_RESPONSE + '\n\n' + PROJECT_PLAN_COST_RESPONSE;
    }

    if (lowerContent.includes('こんにちは') || lowerContent.includes('hello')) {
      return AI_RESPONSES['greeting'];
    }

    if (lowerContent.includes('rfp') || lowerContent.includes('提案依頼')) {
      return AI_RESPONSES['rfp'];
    }

    if (lowerContent.includes('プロジェクト') || lowerContent.includes('project')) {
      return AI_RESPONSES['project'];
    }

    if (lowerContent.includes('ヘルプ') || lowerContent.includes('help') || lowerContent.includes('助けて')) {
      return AI_RESPONSES['help'];
    }

    return AI_RESPONSES['default'];
  }
}
