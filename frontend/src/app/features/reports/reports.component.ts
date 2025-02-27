import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  template: `
    <div class="container">
      <mat-card class="reports-card">
        <mat-card-header>
          <mat-card-title>Reports</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-tab-group>
            <mat-tab label="Sales Reports">
              <div class="placeholder">
                <mat-icon>bar_chart</mat-icon>
                <p>Sales Reports</p>
                <p>Detailed sales analysis and trends will be available here.</p>
                <button mat-raised-button color="primary" routerLink="/reports/sales">View Sales Reports</button>
              </div>
            </mat-tab>
            <mat-tab label="Inventory Reports">
              <div class="placeholder">
                <mat-icon>inventory</mat-icon>
                <p>Inventory Reports Coming Soon</p>
              </div>
            </mat-tab>
            <mat-tab label="Financial Reports">
              <div class="placeholder">
                <mat-icon>attach_money</mat-icon>
                <p>Financial Reports Coming Soon</p>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .container {
      padding: 20px;
    }
    
    .reports-card {
      margin-bottom: 20px;
    }
    
    .placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
      color: rgba(0, 0, 0, 0.54);
    }
    
    .placeholder mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }
  `
})
export class ReportsComponent {
}
