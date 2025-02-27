import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    RouterModule
  ],
  template: `
    <div class="container">
      <div class="header-actions">
        <h1 class="page-title">Products</h1>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon> Add Product
        </button>
      </div>
      
      <mat-card>
        <mat-card-content>
          <div class="filter-container">
            <mat-form-field appearance="outline">
              <mat-label>Search Products</mat-label>
              <input matInput placeholder="Search by name, category, etc.">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
          
          <table mat-table [dataSource]="products" class="product-table">
            <!-- ID Column -->
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let product">{{product.id}}</td>
            </ng-container>
            
            <!-- Name Column -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let product">{{product.name}}</td>
            </ng-container>
            
            <!-- Category Column -->
            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Category</th>
              <td mat-cell *matCellDef="let product">{{product.category}}</td>
            </ng-container>
            
            <!-- Price Column -->
            <ng-container matColumnDef="price">
              <th mat-header-cell *matHeaderCellDef>Price</th>
              <td mat-cell *matCellDef="let product">{{ '$' + product.price.toFixed(2) }}</td>
            </ng-container>
            
            <!-- Stock Column -->
            <ng-container matColumnDef="stock">
              <th mat-header-cell *matHeaderCellDef>Stock</th>
              <td mat-cell *matCellDef="let product">{{product.stock}}</td>
            </ng-container>
            
            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let product">
                <span [ngClass]="{'status-active': product.status === 'Active', 
                                  'status-inactive': product.status === 'Inactive'}">
                  {{product.status}}
                </span>
              </td>
            </ng-container>
            
            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let product">
                <button mat-icon-button color="primary" title="Edit">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" title="Delete">
                  <mat-icon>delete</mat-icon>
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
    
    .filter-container {
      margin-bottom: 20px;
    }
    
    .product-table {
      width: 100%;
    }
    
    .status-active {
      color: green;
      font-weight: 500;
    }
    
    .status-inactive {
      color: red;
      font-weight: 500;
    }
    
    mat-form-field {
      width: 100%;
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [
    { id: 'P001', name: 'Baby Onesie', category: 'Clothing', price: 19.99, stock: 45, status: 'Active' },
    { id: 'P002', name: 'Toddler T-Shirt', category: 'Clothing', price: 14.99, stock: 30, status: 'Active' },
    { id: 'P003', name: 'Baby Socks (3 pairs)', category: 'Accessories', price: 9.99, stock: 60, status: 'Active' },
    { id: 'P004', name: 'Baby Blanket', category: 'Bedding', price: 24.99, stock: 25, status: 'Active' },
    { id: 'P005', name: 'Infant Cap', category: 'Accessories', price: 12.99, stock: 35, status: 'Active' },
    { id: 'P006', name: 'Baby Booties', category: 'Footwear', price: 15.99, stock: 0, status: 'Inactive' }
  ];
  
  displayedColumns: string[] = ['id', 'name', 'category', 'price', 'stock', 'status', 'actions'];
  
  constructor() {}
  
  ngOnInit(): void {}
}
