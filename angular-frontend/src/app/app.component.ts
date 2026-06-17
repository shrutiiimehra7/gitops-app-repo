import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

interface Product {
  id: number;
  name: string;
  price?: number;
  category?: string;
  status?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  pythonItems: Product[] = [];
  javaProducts: Product[] = [];
  pythonStatus = ''; javaStatus = '';
  pythonError = ''; javaError = '';

  private pythonUrl = (window as any).__ENV?.PYTHON_API_URL || 'http://python-service:8000';
  private javaUrl   = (window as any).__ENV?.JAVA_API_URL   || 'http://java-service:8080';

  constructor(private http: HttpClient) {}

  ngOnInit() { this.loadPythonData(); this.loadJavaData(); }

  loadPythonData() {
    this.http.get<any>(`${this.pythonUrl}/health`).subscribe({
      next: (res) => { this.pythonStatus = res.status; },
      error: () => { this.pythonStatus = 'error'; this.pythonError = 'Cannot reach Python service'; }
    });
    this.http.get<any>(`${this.pythonUrl}/api/items`).subscribe({
      next: (res) => { this.pythonItems = res.items; },
      error: () => { this.pythonError = 'Failed to load items'; }
    });
  }

  loadJavaData() {
    this.http.get<any>(`${this.javaUrl}/actuator/health`).subscribe({
      next: (res) => { this.javaStatus = res.status; },
      error: () => { this.javaStatus = 'DOWN'; this.javaError = 'Cannot reach Java service'; }
    });
    this.http.get<Product[]>(`${this.javaUrl}/api/products`).subscribe({
      next: (products) => { this.javaProducts = products; },
      error: () => { this.javaError = 'Failed to load products'; }
    });
  }
}
