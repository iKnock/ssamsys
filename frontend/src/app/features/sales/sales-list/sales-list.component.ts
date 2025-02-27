import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';

interface Sale {
  id: string;
  date: Date;
  customer: string;
  items: number;
  total: number;
  paymentMethod: string;
  status: string;
}

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    RouterModule
  ],
  template: `
    <div class="container">
      <div class="header-actions">
        <h1 class="page-title">Sales Transactions</h1>
        <button mat-raised-button color="primary" routerLink="/sales/new">
          <mat-icon>add</mat-icon> New Sale
        </button>
      </div>
      
      <div class="filter-row">
        <mat-card class="filter-card">
          <mat-card-content>
            <div class="filter-container">
              <mat-form-field appearance="outline">
                <mat-label>Search Sales</mat-label>
                <input matInput placeholder="Search by ID, customer, etc.">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Date Range</mat-label>
                <mat-select>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="custom">Custom Range</option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Payment Method</mat-label>
                <mat-select>
                  <option value="">All Methods</option>
                  <option value="cash">Cash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="mobile">Mobile Payment</option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Status</mat-label>
                <mat-select>
                  <option value="">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="returned">Returned</option>
                </mat-select>
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      
      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="sales" class="sales-table">
            <!-- ID Column -->
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let sale">{{sale.id}}</td>
            </ng-container>
            
            <!-- Date Column -->
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let sale">{{sale.date | date:'medium'}}</td>
            </ng-container>
            
            <!-- Customer Column -->
            <ng-container matColumnDef="customer">
              <th mat-header-cell *matHeaderCellDef>Customer</th>
              <td mat-cell *matCellDef="let sale">{{sale.customer}}</td>
            </ng-container>
            
            <!-- Items Column -->
            <ng-container matColumnDef="items">
              <th mat-header-cell *matHeaderCellDef>Items</th>
              <td mat-cell *matCellDef="let sale">{{sale.items}}</td>
            </ng-container>
            
            <!-- Total Column -->
            <ng-container matColumnDef="total">
              <th mat-header-cell *matHeaderCellDef>Total</th>
              <td mat-cell *matCellDef="let sale" class="total-column">{{'$' + sale.total.toFixed(2)}}</td>
            </ng-container>
            
            <!-- Payment Method Column -->
            <ng-container matColumnDef="paymentMethod">
              <th mat-header-cell *matHeaderCellDef>Payment</th>
              <td mat-cell *matCellDef="let sale">{{sale.paymentMethod}}</td>
            </ng-container>
            
            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let sale">
                <mat-chip [ngClass]="{
                  'status-completed': sale.status === 'Completed',
                  'status-pending': sale.status === 'Pending',
                  'status-returned': sale.status === 'Returned'
                }">
                  {{sale.status}}
                </mat-chip>
              </td>
            </ng-container>
            
            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let sale">
                <button mat-icon-button color="primary" title="View Details">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button color="accent" title="Print Receipt">
                  <mat-icon>receipt</mat-icon>
                </button>
                <button mat-icon-button color="warn" title="Return Sale" *ngIf="sale.status === 'Completed'">
                  <mat-icon>assignment_return</mat-icon>
                </button>
              </td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          
          <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" showFirstLastButtons></mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    
    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .page-title {
      margin: 0;
      font-size: 24px;
    }
    
    .filter-row {
      margin-bottom: 20px;
    }
    
    .filter-card {
      background-color: #f9f9f9;
    }
    
    .filter-container {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .filter-container mat-form-field {
      flex: 1;
      min-width: 200px;
    }
    
    .sales-table {
      width: 100%;
    }
    
    .total-column {
      font-weight: 500;
    }
    
    mat-chip {
      font-size: 12px;
      min-height: 24px;
      padding: 0 12px;
    }
    
    .status-completed {
      background-color: #4caf50 !important;
      color: white !important;
    }
    
    .status-pending {
      background-color: #ff9800 !important;
      color: white !important;
    }
    
    .status-returned {
      background-color: #f44336 !important;
      color: white !important;
    }
  `]
})
export class SalesListComponent implements OnInit {
  sales: Sale[] = [
    { id: 'S001', date: new Date('2025-02-26T10:30:00'), customer: 'John Smith', items: 3, total: 44.97, paymentMethod: 'Cash', status: 'Completed' },
    { id: 'S002', date: new Date('2025-02-26T11:45:00'), customer: 'Sarah Johnson', items: 5, total: 87.95, paymentMethod: 'Credit Card', status: 'Completed' },
    { id: 'S003', date: new Date('2025-02-25T14:20:00'), customer: 'Michael Brown', items: 2, total: 34.98, paymentMethod: 'Mobile Payment', status: 'Completed' },
    { id: 'S004', date: new Date('2025-02-25T16:15:00'), customer: 'Emily Davis', items: 4, total: 62.96, paymentMethod: 'Credit Card', status: 'Returned' },
    { id: 'S005', date: new Date('2025-02-24T09:10:00'), customer: 'David Wilson', items: 1, total: 24.99, paymentMethod: 'Cash', status: 'Completed' },
    { id: 'S006', date: new Date('2025-02-24T13:30:00'), customer: 'Walk-in Customer', items: 6, total: 109.94, paymentMethod: 'Credit Card', status: 'Completed' },
    { id: 'S007', date: new Date('2025-02-23T15:45:00'), customer: 'Jennifer Taylor', items: 3, total: 52.97, paymentMethod: 'Mobile Payment', status: 'Pending' }
  ];
  
  displayedColumns: string[] = ['id', 'date', 'customer', 'items', 'total', 'paymentMethod', 'status', 'actions'];
  
  constructor() {}
  
  ngOnInit(): void {}
}
