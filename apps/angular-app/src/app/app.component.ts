import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div style="max-width:900px;margin:40px auto;padding:20px">
      <h1 style="color:#1a73e8;margin-bottom:8px">🚀 GitOps Dashboard</h1>
      <p style="color:#666;margin-bottom:30px">
        Deployed via Tekton CI + ArgoCD GitOps on Minikube
      </p>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">

        <!-- Python API Card -->
        <div style="background:white;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
          <h2 style="color:#1a73e8;margin-bottom:16px">🐍 Python API</h2>
          <div *ngIf="pythonStatus" style="margin-bottom:16px">
            <span style="background:#e8f5e9;color:#2e7d32;padding:4px 12px;border-radius:20px;font-size:14px">
              ✅ {{ pythonStatus.status }}
            </span>
          </div>
          <h3 style="margin-bottom:8px;font-size:14px;color:#666">ITEMS</h3>
          <div *ngFor="let item of pythonItems"
               style="background:#f8f9fa;padding:10px;border-radius:8px;margin-bottom:8px;display:flex;justify-content:space-between">
            <span>{{ item.name }}</span>
            <strong style="color:#1a73e8">\${{ item.price }}</strong>
          </div>
        </div>

        <!-- Java API Card -->
        <div style="background:white;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
          <h2 style="color:#e65100;margin-bottom:16px">☕ Java API</h2>
          <div *ngIf="javaStatus" style="margin-bottom:16px">
            <span style="background:#e8f5e9;color:#2e7d32;padding:4px 12px;border-radius:20px;font-size:14px">
              ✅ {{ javaStatus.status }}
            </span>
          </div>
          <h3 style="margin-bottom:8px;font-size:14px;color:#666">PRODUCTS</h3>
          <div *ngFor="let product of javaProducts"
               style="background:#f8f9fa;padding:10px;border-radius:8px;margin-bottom:8px;display:flex;justify-content:space-between">
            <span>{{ product.name }}</span>
            <strong style="color:#e65100">\${{ product.price }}</strong>
          </div>
        </div>

      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  pythonStatus: any;
  pythonItems: any[] = [];
  javaStatus: any;
  javaProducts: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('/api/python/').subscribe({
      next: (data: any) => this.pythonStatus = data,
      error: () => this.pythonStatus = { status: 'unavailable' }
    });
    this.http.get('/api/python/items').subscribe({
      next: (data: any) => this.pythonItems = data.items,
      error: () => {}
    });
    this.http.get('/api/java/').subscribe({
      next: (data: any) => this.javaStatus = data,
      error: () => this.javaStatus = { status: 'unavailable' }
    });
    this.http.get('/api/java/products').subscribe({
      next: (data: any) => this.javaProducts = data.products,
      error: () => {}
    });
  }
}
