import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ai-chat',
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.css'],
})
export class AiChatComponent implements OnInit {
  private apiUrl = 'http://localhost:11434/api/generate';
  prompt: string = '';
  response: string = '';
  conversationHistory: string[] = [];
  loading: boolean = false; // Loading state

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  constructor(private http: HttpClient) {}

  ngOnInit() {
    console.log('AI Chat component initialized');
  }

  sendPrompt() {
    if (this.prompt.trim() === '') return;
    this.loading = true; // Show progress bar

    this.generateResponse(this.prompt, this.conversationHistory).subscribe(
      (data) => {
        const actualResponse = data.response;
        this.conversationHistory.push(actualResponse);
        this.response = actualResponse;
        this.loading = false; // Hide progress bar
      },
      (error) => {
        this.response = `Error: ${error.message}`;
        this.loading = false; // Hide progress bar
      }
    );
  }

  generateResponse(
    prompt: string,
    conversationHistory: string[]
  ): Observable<any> {
    conversationHistory.push(prompt);
    const fullPrompt = conversationHistory.join('\n');
    const body = {
      model: 'llama3',
      stream: false,
      prompt: fullPrompt,
    };

    return this.http.post(this.apiUrl, body, { headers: this.headers });
  }
}
