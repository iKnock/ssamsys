import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dashboardCards = [
    {
      title: 'Products',
      icon: 'inventory_2',
      count: '0',
      route: '/products',
      color: '#3f51b5'
    },
    {
      title: 'Sales Today',
      icon: 'point_of_sale',
      count: '0',
      route: '/sales',
      color: '#4caf50'
    },
    {
      title: 'Customers',
      icon: 'people',
      count: '0',
      route: '/customers',
      color: '#ff9800'
    },
    {
      title: 'Low Stock Items',
      icon: 'warning',
      count: '0',
      route: '/inventory',
      color: '#f44336'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
