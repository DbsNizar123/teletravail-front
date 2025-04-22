import { Component, OnInit } from '@angular/core';
import { ChatbotService } from '../services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  questions: any[] = [];
  selectedQuestion: string = '';
  answer: string = '';
  showChatbot: boolean = false;

  constructor(private chatbotService: ChatbotService) { }

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.chatbotService.getQuestions().subscribe(
      (data) => {
        this.questions = data;
      },
      (error) => {
        console.error('Error loading questions:', error);
      }
    );
  }

  selectQuestion(question: string): void {
    this.selectedQuestion = question;
    this.getAnswer();
  }

  getAnswer(): void {
    if (!this.selectedQuestion) return;
    
    this.answer = ''; // Reset answer for animation
    this.chatbotService.getAnswer(this.selectedQuestion).subscribe(
      (response) => {
        this.answer = response.answer;
      },
      (error) => {
        console.error('Error getting answer:', error);
        this.answer = 'Désolé, une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  toggleChatbot(): void {
    this.showChatbot = !this.showChatbot;
    if (this.showChatbot) {
      this.loadQuestions();
      this.selectedQuestion = '';
      this.answer = '';
    }
  }
}