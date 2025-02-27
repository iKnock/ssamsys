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
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

interface Return {
  id: string;
  saleId: string;
  date: Date;
  customer: string;
  items: number;
  amount: number;
  reason: string;
  status: string;
}

interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  selected: boolean;
}

@Component({
  selector: 'app-returns',
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
    MatStepperModule,
    MatCheckboxModule,
    MatDividerModule,
    ReactiveFormsModule,
    FormsModule
  ],
  template: `
    <div class="container">
      <div class="header-actions">
        <h1 class="page-title">Returns Management</h1>
      </div>
      
      <div class="returns-grid">
        <!-- Return Process Section -->
        <div class="return-process">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Process New Return</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <mat-stepper orientation="vertical" linear>
                <!-- Step 1: Find Sale -->
                <mat-step label="Find Sale">
                  <div class="step-content">
                    <p>Enter the sale ID or search for the sale to be returned</p>
                    
                    <div class="search-container">
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Sale ID</mat-label>
                        <input matInput placeholder="Enter Sale ID">
                        <mat-icon matSuffix>search</mat-icon>
                      </mat-form-field>
                      
                      <div class="search-actions">
                        <button mat-raised-button color="primary">
                          <mat-icon>search</mat-icon> Find Sale
                        </button>
                      </div>
                    </div>
                    
                    <div class="sale-preview">
                      <h3>Sale Details</h3>
                      <div class="sale-info">
                        <div>
                          <strong>Sale ID:</strong> S002
                        </div>
                        <div>
                          <strong>Date:</strong> Feb 26, 2025, 11:45 AM
                        </div>
                        <div>
                          <strong>Customer:</strong> Sarah Johnson
                        </div>
                        <div>
                          <strong>Total:</strong> $87.95
                        </div>
                      </div>
                    </div>
                    
                    <div class="step-actions">
                      <button mat-button matStepperNext color="primary">Next</button>
                    </div>
                  </div>
                </mat-step>
                
                <!-- Step 2: Select Items -->
                <mat-step label="Select Items to Return">
                  <div class="step-content">
                    <p>Select the items you want to return from this sale</p>
                    
                    <table mat-table [dataSource]="saleItems" class="items-table">
                      <!-- Select Column -->
                      <ng-container matColumnDef="select">
                        <th mat-header-cell *matHeaderCellDef>
                          <mat-checkbox></mat-checkbox>
                        </th>
                        <td mat-cell *matCellDef="let item">
                          <mat-checkbox [(ngModel)]="item.selected"></mat-checkbox>
                        </td>
                      </ng-container>
                      
                      <!-- Product Column -->
                      <ng-container matColumnDef="product">
                        <th mat-header-cell *matHeaderCellDef>Product</th>
                        <td mat-cell *matCellDef="let item">{{item.name}}</td>
                      </ng-container>
                      
                      <!-- Quantity Column -->
                      <ng-container matColumnDef="quantity">
                        <th mat-header-cell *matHeaderCellDef>Quantity</th>
                        <td mat-cell *matCellDef="let item">
                          <mat-form-field appearance="outline" class="quantity-field">
                            <input matInput type="number" [(ngModel)]="item.quantity" min="1" [disabled]="!item.selected">
                          </mat-form-field>
                        </td>
                      </ng-container>
                      
                      <!-- Price Column -->
                      <ng-container matColumnDef="price">
                        <th mat-header-cell *matHeaderCellDef>Price</th>
                        <td mat-cell *matCellDef="let item">{{'$' + item.price.toFixed(2)}}</td>
                      </ng-container>
                      
                      <!-- Subtotal Column -->
                      <ng-container matColumnDef="subtotal">
                        <th mat-header-cell *matHeaderCellDef>Subtotal</th>
                        <td mat-cell *matCellDef="let item">{{'$' + item.subtotal.toFixed(2)}}</td>
                      </ng-container>
                      
                      <tr mat-header-row *matHeaderRowDef="displayedItemColumns"></tr>
                      <tr mat-row *matRowDef="let row; columns: displayedItemColumns;"></tr>
                    </table>
                    
                    <div class="return-summary">
                      <div class="summary-row">
                        <span>Total Return Amount:</span>
                        <span>{{'$' + calculateReturnTotal().toFixed(2)}}</span>
                      </div>
                    </div>
                    
                    <div class="step-actions">
                      <button mat-button matStepperPrevious>Back</button>
                      <button mat-button matStepperNext color="primary">Next</button>
                    </div>
                  </div>
                </mat-step>
                
                <!-- Step 3: Return Reason -->
                <mat-step label="Return Reason">
                  <div class="step-content">
                    <p>Specify the reason for the return</p>
                    
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Return Reason</mat-label>
                      <mat-select>
                        <option value="defective">Defective Product</option>
                        <option value="wrong">Wrong Product</option>
                        <option value="damaged">Damaged in Shipping</option>
                        <option value="size">Wrong Size</option>
                        <option value="color">Wrong Color</option>
                        <option value="other">Other Reason</option>
                      </mat-select>
                    </mat-form-field>
                    
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Additional Notes</mat-label>
                      <textarea matInput rows="4" placeholder="Enter any additional details about the return"></textarea>
                    </mat-form-field>
                    
                    <div class="step-actions">
                      <button mat-button matStepperPrevious>Back</button>
                      <button mat-button matStepperNext color="primary">Next</button>
                    </div>
                  </div>
                </mat-step>
                
                <!-- Step 4: Confirm Return -->
                <mat-step label="Confirm Return">
                  <div class="step-content">
                    <p>Review and confirm the return details</p>
                    
                    <div class="return-confirmation">
                      <h3>Return Summary</h3>
                      
                      <div class="confirmation-details">
                        <div class="detail-row">
                          <span>Sale ID:</span>
                          <span>S002</span>
                        </div>
                        <div class="detail-row">
                          <span>Customer:</span>
                          <span>Sarah Johnson</span>
                        </div>
                        <div class="detail-row">
                          <span>Items to Return:</span>
                          <span>2</span>
                        </div>
                        <div class="detail-row">
                          <span>Return Amount:</span>
                          <span>{{'$' + calculateReturnTotal().toFixed(2)}}</span>
                        </div>
                        <div class="detail-row">
                          <span>Return Reason:</span>
                          <span>Defective Product</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="step-actions">
                      <button mat-button matStepperPrevious>Back</button>
                      <button mat-raised-button color="primary" (click)="processReturn()">
                        <mat-icon>check</mat-icon> Process Return
                      </button>
                    </div>
                  </div>
                </mat-step>
              </mat-stepper>
            </mat-card-content>
          </mat-card>
        </div>
        
        <!-- Returns History Section -->
        <div class="returns-history">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Recent Returns</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <table mat-table [dataSource]="returns" class="returns-table">
                <!-- ID Column -->
                <ng-container matColumnDef="id">
                  <th mat-header-cell *matHeaderCellDef>ID</th>
                  <td mat-cell *matCellDef="let return">{{return.id}}</td>
                </ng-container>
                
                <!-- Date Column -->
                <ng-container matColumnDef="date">
                  <th mat-header-cell *matHeaderCellDef>Date</th>
                  <td mat-cell *matCellDef="let return">{{return.date | date:'shortDate'}}</td>
                </ng-container>
                
                <!-- Sale ID Column -->
                <ng-container matColumnDef="saleId">
                  <th mat-header-cell *matHeaderCellDef>Sale ID</th>
                  <td mat-cell *matCellDef="let return">{{return.saleId}}</td>
                </ng-container>
                
                <!-- Amount Column -->
                <ng-container matColumnDef="amount">
                  <th mat-header-cell *matHeaderCellDef>Amount</th>
                  <td mat-cell *matCellDef="let returnItem">{{'$' + returnItem.amount.toFixed(2)}}</td>
                </ng-container>
                
                <!-- Status Column -->
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let return">
                    <mat-chip [ngClass]="{
                      'status-completed': return.status === 'Completed',
                      'status-pending': return.status === 'Pending',
                      'status-processing': return.status === 'Processing'
                    }">
                      {{return.status}}
                    </mat-chip>
                  </td>
                </ng-container>
                
                <!-- Actions Column -->
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let return">
                    <button mat-icon-button color="primary" title="View Details">
                      <mat-icon>visibility</mat-icon>
                    </button>
                  </td>
                </ng-container>
                
                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            </mat-card-content>
          </mat-card>
        </div>
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
    
    .returns-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .step-content {
      margin: 16px 0;
    }
    
    .search-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 20px;
    }
    
    .search-actions {
      display: flex;
      justify-content: flex-end;
    }
    
    .sale-preview {
      background-color: #f5f5f5;
      border-radius: 4px;
      padding: 16px;
      margin-bottom: 20px;
    }
    
    .sale-preview h3 {
      margin-top: 0;
      margin-bottom: 12px;
    }
    
    .sale-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    
    .items-table {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .quantity-field {
      width: 60px;
    }
    
    .return-summary {
      background-color: #f5f5f5;
      border-radius: 4px;
      padding: 16px;
      margin: 16px 0;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      font-weight: 500;
      font-size: 16px;
    }
    
    .step-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }
    
    .return-confirmation {
      background-color: #f5f5f5;
      border-radius: 4px;
      padding: 16px;
      margin-bottom: 20px;
    }
    
    .return-confirmation h3 {
      margin-top: 0;
      margin-bottom: 12px;
    }
    
    .confirmation-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .detail-row {
      display: flex;
      justify-content: space-between;
    }
    
    .returns-table {
      width: 100%;
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
    
    .status-processing {
      background-color: #2196f3 !important;
      color: white !important;
    }
    
    @media (max-width: 960px) {
      .returns-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ReturnsComponent implements OnInit {
  returns: Return[] = [
    { id: 'R001', saleId: 'S004', date: new Date('2025-02-25T16:30:00'), customer: 'Emily Davis', items: 4, amount: 62.96, reason: 'Defective Product', status: 'Completed' },
    { id: 'R002', saleId: 'S007', date: new Date('2025-02-23T17:15:00'), customer: 'Jennifer Taylor', items: 1, amount: 19.99, reason: 'Wrong Size', status: 'Processing' },
    { id: 'R003', saleId: 'S002', date: new Date('2025-02-26T14:20:00'), customer: 'Sarah Johnson', items: 2, amount: 34.98, reason: 'Damaged in Shipping', status: 'Pending' }
  ];
  
  saleItems: SaleItem[] = [
    { id: 'P002', name: 'Toddler T-Shirt', quantity: 2, price: 14.99, subtotal: 29.98, selected: false },
    { id: 'P003', name: 'Baby Socks (3 pairs)', quantity: 1, price: 9.99, subtotal: 9.99, selected: false },
    { id: 'P004', name: 'Baby Blanket', quantity: 1, price: 24.99, subtotal: 24.99, selected: false },
    { id: 'P005', name: 'Infant Cap', quantity: 1, price: 12.99, subtotal: 12.99, selected: false },
    { id: 'P008', name: 'Baby Bibs (5 pack)', quantity: 1, price: 17.99, subtotal: 17.99, selected: false }
  ];
  
  displayedColumns: string[] = ['id', 'date', 'saleId', 'amount', 'status', 'actions'];
  displayedItemColumns: string[] = ['select', 'product', 'quantity', 'price', 'subtotal'];
  
  constructor() {}
  
  ngOnInit(): void {}
  
  calculateReturnTotal(): number {
    return this.saleItems
      .filter(item => item.selected)
      .reduce((total, item) => total + item.subtotal, 0);
  }
  
  processReturn(): void {
    // This would normally call a service to process the return
    console.log('Return processed:', {
      saleId: 'S002',
      items: this.saleItems.filter(item => item.selected),
      amount: this.calculateReturnTotal(),
      reason: 'Defective Product'
    });
    
    // Show success message
    alert('Return processed successfully!');
  }
}
