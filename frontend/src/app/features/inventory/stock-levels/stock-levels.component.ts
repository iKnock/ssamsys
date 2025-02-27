import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';

interface StockItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  status: string;
  price: number;
}

@Component({
  selector: 'app-stock-levels',
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
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule
  ],
  template: `
    <div class="container">
      <div class="header-actions">
        <h1 class="page-title">Stock Levels</h1>
        <div>
          <button mat-raised-button color="primary" class="action-button">
            <mat-icon>add</mat-icon> Add Stock
          </button>
          <button mat-raised-button color="accent" class="action-button">
            <mat-icon>print</mat-icon> Print Report
          </button>
        </div>
      </div>
      
      <div class="filter-row">
        <mat-card class="filter-card">
          <mat-card-content>
            <div class="filter-container">
              <mat-form-field appearance="outline">
                <mat-label>Search Products</mat-label>
                <input matInput placeholder="Search by product name, ID, etc.">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Category</mat-label>
                <mat-select>
                  <option value="">All Categories</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Bedding">Bedding</option>
                  <option value="Toys">Toys</option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Stock Status</mat-label>
                <mat-select>
                  <option value="">All</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Overstocked">Overstocked</option>
                </mat-select>
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      
      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="stockItems" class="stock-table">
            <!-- ID Column -->
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let item">{{item.id}}</td>
            </ng-container>
            
            <!-- Name Column -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Product</th>
              <td mat-cell *matCellDef="let item">{{item.name}}</td>
            </ng-container>
            
            <!-- Category Column -->
            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Category</th>
              <td mat-cell *matCellDef="let item">{{item.category}}</td>
            </ng-container>
            
            <!-- Price Column -->
            <ng-container matColumnDef="price">
              <th mat-header-cell *matHeaderCellDef>Price</th>
              <td mat-cell *matCellDef="let item">{{'$' + item.price.toFixed(2)}}</td>
            </ng-container>
            
            <!-- Stock Level Column -->
            <ng-container matColumnDef="stockLevel">
              <th mat-header-cell *matHeaderCellDef>Stock Level</th>
              <td mat-cell *matCellDef="let item">
                <div class="stock-level">
                  <div class="stock-info">
                    <span>{{item.currentStock}} / {{item.maxStock}}</span>
                    <span class="stock-status" [ngClass]="{
                      'status-out': item.currentStock === 0,
                      'status-low': item.currentStock > 0 && item.currentStock < item.minStock,
                      'status-ok': item.currentStock >= item.minStock && item.currentStock <= item.maxStock,
                      'status-high': item.currentStock > item.maxStock
                    }">{{item.status}}</span>
                  </div>
                  <mat-progress-bar 
                    [value]="(item.currentStock / item.maxStock) * 100"
                    [ngClass]="{
                      'progress-out': item.currentStock === 0,
                      'progress-low': item.currentStock > 0 && item.currentStock < item.minStock,
                      'progress-ok': item.currentStock >= item.minStock && item.currentStock <= item.maxStock,
                      'progress-high': item.currentStock > item.maxStock
                    }">
                  </mat-progress-bar>
                </div>
              </td>
            </ng-container>
            
            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let item">
                <button mat-icon-button color="primary" title="Add Stock">
                  <mat-icon>add_circle</mat-icon>
                </button>
                <button mat-icon-button color="warn" title="Remove Stock">
                  <mat-icon>remove_circle</mat-icon>
                </button>
                <button mat-icon-button title="History">
                  <mat-icon>history</mat-icon>
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
    
    .action-button {
      margin-left: 10px;
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
    
    .stock-table {
      width: 100%;
    }
    
    .stock-level {
      width: 100%;
    }
    
    .stock-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
    
    .stock-status {
      font-weight: 500;
    }
    
    .status-out {
      color: #f44336;
    }
    
    .status-low {
      color: #ff9800;
    }
    
    .status-ok {
      color: #4caf50;
    }
    
    .status-high {
      color: #2196f3;
    }
    
    .progress-out {
      background-color: rgba(244, 67, 54, 0.2);
    }
    
    .progress-out ::ng-deep .mat-progress-bar-fill::after {
      background-color: #f44336;
    }
    
    .progress-low {
      background-color: rgba(255, 152, 0, 0.2);
    }
    
    .progress-low ::ng-deep .mat-progress-bar-fill::after {
      background-color: #ff9800;
    }
    
    .progress-ok {
      background-color: rgba(76, 175, 80, 0.2);
    }
    
    .progress-ok ::ng-deep .mat-progress-bar-fill::after {
      background-color: #4caf50;
    }
    
    .progress-high {
      background-color: rgba(33, 150, 243, 0.2);
    }
    
    .progress-high ::ng-deep .mat-progress-bar-fill::after {
      background-color: #2196f3;
    }
  `]
})
export class StockLevelsComponent implements OnInit {
  stockItems: StockItem[] = [
    { id: 'P001', name: 'Baby Onesie', category: 'Clothing', currentStock: 45, minStock: 20, maxStock: 100, status: 'In Stock', price: 9.99 },
    { id: 'P002', name: 'Toddler T-Shirt', category: 'Clothing', currentStock: 30, minStock: 15, maxStock: 80, status: 'In Stock', price: 7.99 },
    { id: 'P003', name: 'Baby Socks (3 pairs)', category: 'Accessories', currentStock: 60, minStock: 30, maxStock: 120, status: 'In Stock', price: 4.99 },
    { id: 'P004', name: 'Baby Blanket', category: 'Bedding', currentStock: 12, minStock: 15, maxStock: 50, status: 'Low Stock', price: 14.99 },
    { id: 'P005', name: 'Infant Cap', category: 'Accessories', currentStock: 35, minStock: 20, maxStock: 60, status: 'In Stock', price: 6.99 },
    { id: 'P006', name: 'Baby Booties', category: 'Footwear', currentStock: 0, minStock: 10, maxStock: 40, status: 'Out of Stock', price: 8.99 },
    { id: 'P007', name: 'Baby Mittens', category: 'Accessories', currentStock: 8, minStock: 10, maxStock: 30, status: 'Low Stock', price: 5.99 },
    { id: 'P008', name: 'Baby Bibs (5 pack)', category: 'Accessories', currentStock: 65, minStock: 20, maxStock: 60, status: 'Overstocked', price: 12.99 }
  ];
  
  displayedColumns: string[] = ['id', 'name', 'category', 'price', 'stockLevel', 'actions'];
  
  constructor() {}
  
  ngOnInit(): void {}
}
