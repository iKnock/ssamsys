import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule
  ],
  template: `
    <div class="container">
      <div class="header-actions">
        <h1 class="page-title">Product Categories</h1>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon> Add Category
        </button>
      </div>
      
      <mat-card>
        <mat-card-content>
          <div class="filter-container">
            <mat-form-field appearance="outline">
              <mat-label>Search Categories</mat-label>
              <input matInput placeholder="Search by name or description">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
          
          <table mat-table [dataSource]="categories" class="category-table">
            <!-- ID Column -->
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let category">{{category.id}}</td>
            </ng-container>
            
            <!-- Name Column -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let category">{{category.name}}</td>
            </ng-container>
            
            <!-- Description Column -->
            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Description</th>
              <td mat-cell *matCellDef="let category">{{category.description}}</td>
            </ng-container>
            
            <!-- Product Count Column -->
            <ng-container matColumnDef="productCount">
              <th mat-header-cell *matHeaderCellDef>Products</th>
              <td mat-cell *matCellDef="let category">{{ category.productCount }}</td>
            </ng-container>
            
            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let category">
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
    
    .category-table {
      width: 100%;
    }
    
    mat-form-field {
      width: 100%;
    }
  `]
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [
    { id: 'C001', name: 'Clothing', description: 'Baby and toddler clothing items', productCount: 15 },
    { id: 'C002', name: 'Accessories', description: 'Baby accessories and small items', productCount: 8 },
    { id: 'C003', name: 'Footwear', description: 'Baby shoes, socks and booties', productCount: 6 },
    { id: 'C004', name: 'Bedding', description: 'Blankets, sheets and bedding items', productCount: 10 },
    { id: 'C005', name: 'Toys', description: 'Baby and toddler toys', productCount: 12 }
  ];
  
  displayedColumns: string[] = ['id', 'name', 'description', 'productCount', 'actions'];
  
  constructor() {}
  
  ngOnInit(): void {}
}
