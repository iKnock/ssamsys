import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

@Component({
  selector: 'app-new-sale',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatTableModule,
    MatDividerModule,
    ReactiveFormsModule,
    FormsModule
  ],
  template: `
    <div class="container">
      <h1 class="page-title">New Sale</h1>
      
      <div class="sale-grid">
        <div class="product-selection">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Add Products</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="product-search">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Search Products</mat-label>
                  <input matInput placeholder="Search by name or ID">
                  <mat-icon matSuffix>search</mat-icon>
                </mat-form-field>
              </div>
              
              <div class="product-grid">
                <div *ngFor="let product of availableProducts" class="product-item" 
                     [class.out-of-stock]="product.stock <= 0"
                     (click)="product.stock > 0 ? addToCart(product) : null">
                  <div class="product-info">
                    <div class="product-name">{{product.name}}</div>
                    <div class="product-price">{{'$' + product.price.toFixed(2)}}</div>
                  </div>
                  <div class="product-stock" [class.low-stock]="product.stock > 0 && product.stock < 10">
                    {{product.stock > 0 ? product.stock + ' in stock' : 'Out of stock'}}
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
        
        <div class="cart-section">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Current Sale</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="customer-section">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Customer</mat-label>
                  <mat-select>
                    <option value="">Walk-in Customer</option>
                    <option value="C001">John Smith</option>
                    <option value="C002">Sarah Johnson</option>
                    <option value="C003">Michael Brown</option>
                  </mat-select>
                </mat-form-field>
              </div>
              
              <div class="cart-items">
                <table mat-table [dataSource]="cartItems" class="cart-table">
                  <!-- Product Column -->
                  <ng-container matColumnDef="product">
                    <th mat-header-cell *matHeaderCellDef>Product</th>
                    <td mat-cell *matCellDef="let item">{{item.product.name}}</td>
                  </ng-container>
                  
                  <!-- Price Column -->
                  <ng-container matColumnDef="price">
                    <th mat-header-cell *matHeaderCellDef>Price</th>
                    <td mat-cell *matCellDef="let item">{{'$' + item.product.price.toFixed(2)}}</td>
                  </ng-container>
                  
                  <!-- Quantity Column -->
                  <ng-container matColumnDef="quantity">
                    <th mat-header-cell *matHeaderCellDef>Quantity</th>
                    <td mat-cell *matCellDef="let item">
                      <div class="quantity-control">
                        <button mat-icon-button color="primary" (click)="decreaseQuantity(item)" [disabled]="item.quantity <= 1">
                          <mat-icon>remove</mat-icon>
                        </button>
                        <span class="quantity-value">{{item.quantity}}</span>
                        <button mat-icon-button color="primary" (click)="increaseQuantity(item)" [disabled]="item.quantity >= item.product.stock">
                          <mat-icon>add</mat-icon>
                        </button>
                      </div>
                    </td>
                  </ng-container>
                  
                  <!-- Subtotal Column -->
                  <ng-container matColumnDef="subtotal">
                    <th mat-header-cell *matHeaderCellDef>Subtotal</th>
                    <td mat-cell *matCellDef="let item">{{'$' + item.subtotal.toFixed(2)}}</td>
                  </ng-container>
                  
                  <!-- Actions Column -->
                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef></th>
                    <td mat-cell *matCellDef="let item">
                      <button mat-icon-button color="warn" (click)="removeFromCart(item)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </td>
                  </ng-container>
                  
                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                </table>
                
                <div *ngIf="cartItems.length === 0" class="empty-cart">
                  <mat-icon>shopping_cart</mat-icon>
                  <p>Your cart is empty</p>
                  <p class="empty-cart-hint">Click on products to add them to the cart</p>
                </div>
              </div>
              
              <mat-divider></mat-divider>
              
              <div class="sale-summary">
                <div class="summary-row">
                  <span>Subtotal:</span>
                  <span>{{'$' + calculateSubtotal().toFixed(2)}}</span>
                </div>
                <div class="summary-row">
                  <span>Tax (10%):</span>
                  <span>{{'$' + calculateTax().toFixed(2)}}</span>
                </div>
                <div class="summary-row total">
                  <span>Total:</span>
                  <span>{{'$' + calculateTotal().toFixed(2)}}</span>
                </div>
              </div>
              
              <div class="payment-section">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Payment Method</mat-label>
                  <mat-select>
                    <option value="cash">Cash</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="mobile">Mobile Payment</option>
                  </mat-select>
                </mat-form-field>
                
                <div class="action-buttons">
                  <button mat-raised-button color="warn" (click)="clearCart()">
                    <mat-icon>delete_sweep</mat-icon> Clear
                  </button>
                  <button mat-raised-button color="primary" [disabled]="cartItems.length === 0" (click)="completeSale()">
                    <mat-icon>payment</mat-icon> Complete Sale
                  </button>
                </div>
              </div>
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
    
    .page-title {
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 24px;
    }
    
    .sale-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .product-search {
      margin-bottom: 16px;
    }
    
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 16px;
      max-height: 400px;
      overflow-y: auto;
    }
    
    .product-item {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 12px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .product-item:hover {
      background-color: #f5f5f5;
    }
    
    .product-info {
      margin-bottom: 8px;
    }
    
    .product-name {
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .product-price {
      color: #1976d2;
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .product-stock {
      font-size: 12px;
      color: #4caf50;
    }
    
    .low-stock {
      color: #ff9800;
    }
    
    .out-of-stock {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .out-of-stock .product-stock {
      color: #f44336;
    }
    
    .customer-section {
      margin-bottom: 16px;
    }
    
    .cart-items {
      max-height: 300px;
      overflow-y: auto;
      margin-bottom: 16px;
    }
    
    .cart-table {
      width: 100%;
    }
    
    .quantity-control {
      display: flex;
      align-items: center;
    }
    
    .quantity-value {
      margin: 0 8px;
      min-width: 24px;
      text-align: center;
    }
    
    .empty-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 0;
      color: #9e9e9e;
    }
    
    .empty-cart mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
    }
    
    .empty-cart p {
      margin: 4px 0;
    }
    
    .empty-cart-hint {
      font-size: 14px;
    }
    
    .sale-summary {
      margin: 16px 0;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    
    .total {
      font-weight: 500;
      font-size: 18px;
      margin-top: 8px;
    }
    
    .payment-section {
      margin-top: 16px;
    }
    
    .action-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
    }
    
    @media (max-width: 960px) {
      .sale-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class NewSaleComponent implements OnInit {
  availableProducts: Product[] = [
    { id: 'P001', name: 'Baby Onesie', price: 19.99, stock: 45 },
    { id: 'P002', name: 'Toddler T-Shirt', price: 14.99, stock: 30 },
    { id: 'P003', name: 'Baby Socks (3 pairs)', price: 9.99, stock: 60 },
    { id: 'P004', name: 'Baby Blanket', price: 24.99, stock: 25 },
    { id: 'P005', name: 'Infant Cap', price: 12.99, stock: 35 },
    { id: 'P006', name: 'Baby Booties', price: 15.99, stock: 0 },
    { id: 'P007', name: 'Baby Mittens', price: 8.99, stock: 8 },
    { id: 'P008', name: 'Baby Bibs (5 pack)', price: 17.99, stock: 65 }
  ];
  
  cartItems: CartItem[] = [];
  displayedColumns: string[] = ['product', 'price', 'quantity', 'subtotal', 'actions'];
  
  constructor() {}
  
  ngOnInit(): void {}
  
  addToCart(product: Product): void {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      this.increaseQuantity(existingItem);
    } else {
      this.cartItems.push({
        product,
        quantity: 1,
        subtotal: product.price
      });
    }
  }
  
  removeFromCart(item: CartItem): void {
    this.cartItems = this.cartItems.filter(cartItem => cartItem.product.id !== item.product.id);
  }
  
  increaseQuantity(item: CartItem): void {
    if (item.quantity < item.product.stock) {
      item.quantity++;
      item.subtotal = item.quantity * item.product.price;
    }
  }
  
  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      item.subtotal = item.quantity * item.product.price;
    }
  }
  
  clearCart(): void {
    this.cartItems = [];
  }
  
  calculateSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + item.subtotal, 0);
  }
  
  calculateTax(): number {
    return this.calculateSubtotal() * 0.1; // 10% tax
  }
  
  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateTax();
  }
  
  completeSale(): void {
    // This would normally call a service to save the sale to the backend
    console.log('Sale completed:', {
      items: this.cartItems,
      subtotal: this.calculateSubtotal(),
      tax: this.calculateTax(),
      total: this.calculateTotal()
    });
    
    // Clear the cart after sale is complete
    this.clearCart();
    
    // Show success message or navigate to receipt page
    alert('Sale completed successfully!');
  }
}
