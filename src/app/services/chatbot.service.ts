import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://localhost:8000/api/chatbot';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getQuestions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/questions`, { headers: this.getHeaders() });
  }

  getAnswer(question: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/answer`, { question }, { headers: this.getHeaders() });
  }
}