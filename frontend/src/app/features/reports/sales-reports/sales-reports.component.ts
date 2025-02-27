import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

interface SalesSummary {
  period: string;
  sales: number;
  revenue: number;
  growth: number;
}

interface TopProduct {
  id: string;
  name: string;
  category: string;
  quantity: number;
  revenue: number;
}

interface SalesByCategory {
  category: string;
  sales: number;
  percentage: number;
}

@Component({
  selector: 'app-sales-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    FormsModule
  ],
  template: `
    <div class="container">
      <div class="header-actions">
        <h1 class="page-title">Sales Reports</h1>
        <div class="actions">
          <button mat-raised-button color="primary">
            <mat-icon>print</mat-icon> Print Report
          </button>
          <button mat-raised-button color="accent">
            <mat-icon>download</mat-icon> Export
          </button>
        </div>
      </div>
      
      <div class="filters-card">
        <mat-card>
          <mat-card-content>
            <div class="filters-container">
              <mat-form-field appearance="outline">
                <mat-label>Date Range</mat-label>
                <mat-select [(value)]="selectedDateRange">
                  <mat-option value="today">Today</mat-option>
                  <mat-option value="yesterday">Yesterday</mat-option>
                  <mat-option value="thisWeek">This Week</mat-option>
                  <mat-option value="lastWeek">Last Week</mat-option>
                  <mat-option value="thisMonth">This Month</mat-option>
                  <mat-option value="lastMonth">Last Month</mat-option>
                  <mat-option value="thisYear">This Year</mat-option>
                  <mat-option value="custom">Custom Range</mat-option>
                </mat-select>
              </mat-form-field>
              
              <div class="date-range" *ngIf="selectedDateRange === 'custom'">
                <mat-form-field appearance="outline">
                  <mat-label>Start Date</mat-label>
                  <input matInput [matDatepicker]="startPicker">
                  <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                  <mat-datepicker #startPicker></mat-datepicker>
                </mat-form-field>
                
                <mat-form-field appearance="outline">
                  <mat-label>End Date</mat-label>
                  <input matInput [matDatepicker]="endPicker">
                  <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                  <mat-datepicker #endPicker></mat-datepicker>
                </mat-form-field>
              </div>
              
              <mat-form-field appearance="outline">
                <mat-label>Category</mat-label>
                <mat-select>
                  <mat-option value="all">All Categories</mat-option>
                  <mat-option value="clothing">Clothing</mat-option>
                  <mat-option value="accessories">Accessories</mat-option>
                  <mat-option value="toys">Toys</mat-option>
                  <mat-option value="essentials">Essentials</mat-option>
                </mat-select>
              </mat-form-field>
              
              <button mat-raised-button color="primary">
                <mat-icon>filter_list</mat-icon> Apply Filters
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      
      <div class="summary-cards">
        <mat-card class="summary-card">
          <mat-card-content>
            <div class="summary-icon sales-icon">
              <mat-icon>shopping_cart</mat-icon>
            </div>
            <div class="summary-details">
              <div class="summary-label">Total Sales</div>
              <div class="summary-value">{{totalSales}}</div>
              <div class="summary-change positive">
                <mat-icon>arrow_upward</mat-icon> 12.5%
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="summary-card">
          <mat-card-content>
            <div class="summary-icon revenue-icon">
              <mat-icon>attach_money</mat-icon>
            </div>
            <div class="summary-details">
              <div class="summary-label">Total Revenue</div>
              <div class="summary-value">{{totalRevenue | currency}}</div>
              <div class="summary-change positive">
                <mat-icon>arrow_upward</mat-icon> 8.3%
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="summary-card">
          <mat-card-content>
            <div class="summary-icon avg-icon">
              <mat-icon>receipt</mat-icon>
            </div>
            <div class="summary-details">
              <div class="summary-label">Average Sale</div>
              <div class="summary-value">{{avgOrderValue | currency}}</div>
              <div class="summary-change negative">
                <mat-icon>arrow_downward</mat-icon> 2.1%
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="summary-card">
          <mat-card-content>
            <div class="summary-icon items-icon">
              <mat-icon>inventory_2</mat-icon>
            </div>
            <div class="summary-details">
              <div class="summary-label">Items Sold</div>
              <div class="summary-value">{{itemsSold}}</div>
              <div class="summary-change positive">
                <mat-icon>arrow_upward</mat-icon> 15.2%
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      
      <div class="report-content">
        <mat-tab-group>
          <mat-tab label="Sales Trends">
            <div class="tab-content">
              <div class="chart-container">
                <div class="chart-placeholder">
                  <mat-icon>bar_chart</mat-icon>
                  <p>Sales Trend Chart</p>
                  <p class="placeholder-note">(Charts will be implemented with ApexCharts)</p>
                </div>
              </div>
              
              <div class="table-container">
                <h3>Sales Summary</h3>
                <table mat-table [dataSource]="salesSummary" class="mat-elevation-z2">
                  <!-- Period Column -->
                  <ng-container matColumnDef="period">
                    <th mat-header-cell *matHeaderCellDef>Period</th>
                    <td mat-cell *matCellDef="let item">{{item.period}}</td>
                  </ng-container>
                  
                  <!-- Sales Column -->
                  <ng-container matColumnDef="sales">
                    <th mat-header-cell *matHeaderCellDef>Sales</th>
                    <td mat-cell *matCellDef="let item">{{item.sales}}</td>
                  </ng-container>
                  
                  <!-- Revenue Column -->
                  <ng-container matColumnDef="revenue">
                    <th mat-header-cell *matHeaderCellDef>Revenue</th>
                    <td mat-cell *matCellDef="let item">{{item.revenue | currency}}</td>
                  </ng-container>
                  
                  <!-- Growth Column -->
                  <ng-container matColumnDef="growth">
                    <th mat-header-cell *matHeaderCellDef>Growth</th>
                    <td mat-cell *matCellDef="let item" [class.positive-growth]="item.growth > 0" [class.negative-growth]="item.growth < 0">
                      {{item.growth > 0 ? '+' : ''}}{{item.growth}}%
                    </td>
                  </ng-container>
                  
                  <tr mat-header-row *matHeaderRowDef="salesSummaryColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: salesSummaryColumns;"></tr>
                </table>
              </div>
            </div>
          </mat-tab>
          
          <mat-tab label="Top Products">
            <div class="tab-content">
              <div class="table-container">
                <h3>Best Selling Products</h3>
                <table mat-table [dataSource]="topProducts" class="mat-elevation-z2">
                  <!-- Name Column -->
                  <ng-container matColumnDef="name">
                    <th mat-header-cell *matHeaderCellDef>Product</th>
                    <td mat-cell *matCellDef="let product">{{product.name}}</td>
                  </ng-container>
                  
                  <!-- Category Column -->
                  <ng-container matColumnDef="category">
                    <th mat-header-cell *matHeaderCellDef>Category</th>
                    <td mat-cell *matCellDef="let product">{{product.category}}</td>
                  </ng-container>
                  
                  <!-- Quantity Column -->
                  <ng-container matColumnDef="quantity">
                    <th mat-header-cell *matHeaderCellDef>Quantity Sold</th>
                    <td mat-cell *matCellDef="let product">{{product.quantity}}</td>
                  </ng-container>
                  
                  <!-- Revenue Column -->
                  <ng-container matColumnDef="revenue">
                    <th mat-header-cell *matHeaderCellDef>Revenue</th>
                    <td mat-cell *matCellDef="let product">{{product.revenue | currency}}</td>
                  </ng-container>
                  
                  <tr mat-header-row *matHeaderRowDef="topProductsColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: topProductsColumns;"></tr>
                </table>
              </div>
              
              <div class="chart-container">
                <div class="chart-placeholder">
                  <mat-icon>pie_chart</mat-icon>
                  <p>Top Products Chart</p>
                  <p class="placeholder-note">(Charts will be implemented with ApexCharts)</p>
                </div>
              </div>
            </div>
          </mat-tab>
          
          <mat-tab label="Category Analysis">
            <div class="tab-content">
              <div class="chart-container">
                <div class="chart-placeholder">
                  <mat-icon>donut_large</mat-icon>
                  <p>Category Sales Chart</p>
                  <p class="placeholder-note">(Charts will be implemented with ApexCharts)</p>
                </div>
              </div>
              
              <div class="table-container">
                <h3>Sales by Category</h3>
                <table mat-table [dataSource]="salesByCategory" class="mat-elevation-z2">
                  <!-- Category Column -->
                  <ng-container matColumnDef="category">
                    <th mat-header-cell *matHeaderCellDef>Category</th>
                    <td mat-cell *matCellDef="let item">{{item.category}}</td>
                  </ng-container>
                  
                  <!-- Sales Column -->
                  <ng-container matColumnDef="sales">
                    <th mat-header-cell *matHeaderCellDef>Sales</th>
                    <td mat-cell *matCellDef="let item">{{item.sales}}</td>
                  </ng-container>
                  
                  <!-- Percentage Column -->
                  <ng-container matColumnDef="percentage">
                    <th mat-header-cell *matHeaderCellDef>Percentage</th>
                    <td mat-cell *matCellDef="let item">{{item.percentage}}%</td>
                  </ng-container>
                  
                  <tr mat-header-row *matHeaderRowDef="salesByCategoryColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: salesByCategoryColumns;"></tr>
                </table>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
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
    
    .actions {
      display: flex;
      gap: 10px;
    }
    
    .filters-card {
      margin-bottom: 20px;
    }
    
    .filters-container {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;
    }
    
    .date-range {
      display: flex;
      gap: 16px;
    }
    
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .summary-card {
      height: 100%;
    }
    
    .summary-card mat-card-content {
      display: flex;
      align-items: center;
      padding: 16px;
    }
    
    .summary-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin-right: 16px;
    }
    
    .summary-icon mat-icon {
      color: white;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    
    .sales-icon {
      background-color: #2196f3;
    }
    
    .revenue-icon {
      background-color: #4caf50;
    }
    
    .avg-icon {
      background-color: #ff9800;
    }
    
    .items-icon {
      background-color: #9c27b0;
    }
    
    .summary-details {
      flex: 1;
    }
    
    .summary-label {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.54);
      margin-bottom: 4px;
    }
    
    .summary-value {
      font-size: 24px;
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .summary-change {
      display: flex;
      align-items: center;
      font-size: 12px;
    }
    
    .summary-change mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }
    
    .positive {
      color: #4caf50;
    }
    
    .negative {
      color: #f44336;
    }
    
    .report-content {
      background-color: white;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .tab-content {
      padding: 20px;
    }
    
    .chart-container {
      height: 300px;
      margin-bottom: 20px;
      background-color: #f5f5f5;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .chart-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: rgba(0, 0, 0, 0.54);
    }
    
    .chart-placeholder mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }
    
    .chart-placeholder p {
      margin: 0 0 8px 0;
      font-size: 16px;
    }
    
    .placeholder-note {
      font-size: 12px !important;
      font-style: italic;
    }
    
    .table-container {
      margin-bottom: 20px;
    }
    
    .table-container h3 {
      margin-top: 0;
      margin-bottom: 16px;
    }
    
    table {
      width: 100%;
    }
    
    .positive-growth {
      color: #4caf50;
    }
    
    .negative-growth {
      color: #f44336;
    }
    
    @media (max-width: 960px) {
      .summary-cards {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 600px) {
      .summary-cards {
        grid-template-columns: 1fr;
      }
      
      .filters-container {
        flex-direction: column;
        align-items: stretch;
      }
      
      .date-range {
        flex-direction: column;
      }
    }
  `]
})
export class SalesReportsComponent implements OnInit {
  selectedDateRange = 'thisMonth';
  
  salesSummary: SalesSummary[] = [
    { period: 'Jan 2025', sales: 156, revenue: 5234.67, growth: 8.2 },
    { period: 'Feb 2025', sales: 245, revenue: 8945.75, growth: 12.5 },
    { period: 'Mar 2025', sales: 198, revenue: 7456.32, growth: -5.8 },
    { period: 'Apr 2025', sales: 210, revenue: 7890.45, growth: 6.1 },
    { period: 'May 2025', sales: 232, revenue: 8567.23, growth: 10.5 }
  ];
  
  topProducts: TopProduct[] = [
    { id: 'P001', name: 'Baby Onesie', category: 'Clothing', quantity: 87, revenue: 1304.13 },
    { id: 'P004', name: 'Baby Blanket', category: 'Essentials', quantity: 62, revenue: 1549.38 },
    { id: 'P002', name: 'Toddler T-Shirt', category: 'Clothing', quantity: 54, revenue: 809.46 },
    { id: 'P008', name: 'Baby Bibs (5 pack)', category: 'Accessories', quantity: 48, revenue: 863.52 },
    { id: 'P010', name: 'Stuffed Animal', category: 'Toys', quantity: 42, revenue: 629.58 }
  ];
  
  salesByCategory: SalesByCategory[] = [
    { category: 'Clothing', sales: 187, percentage: 42 },
    { category: 'Essentials', sales: 124, percentage: 28 },
    { category: 'Accessories', sales: 76, percentage: 17 },
    { category: 'Toys', sales: 58, percentage: 13 }
  ];
  
  totalSales: number = 245;
  totalRevenue: number = 8945.75;
  avgOrderValue: number = 36.51;
  itemsSold: number = 682;
  
  salesSummaryColumns: string[] = ['period', 'sales', 'revenue', 'growth'];
  topProductsColumns: string[] = ['name', 'category', 'quantity', 'revenue'];
  salesByCategoryColumns: string[] = ['category', 'sales', 'percentage'];
  
  constructor() {}
  
  ngOnInit(): void {
    // Charts will be implemented when ApexCharts is available
    console.log('Reports component initialized');
  }
  
  initCharts(): void {
    // This is a placeholder for future chart implementation
    console.log('Charts will be implemented with ApexCharts in the future');
  }
}
