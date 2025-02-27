import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavItem[];
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: 'Products',
      icon: 'inventory_2',
      children: [
        {
          label: 'All Products',
          icon: 'list',
          route: '/products'
        },
        {
          label: 'Categories',
          icon: 'category',
          route: '/products/categories'
        }
      ]
    },
    {
      label: 'Inventory',
      icon: 'inventory',
      children: [
        {
          label: 'Stock Levels',
          icon: 'analytics',
          route: '/inventory'
        }
      ]
    },
    {
      label: 'Sales',
      icon: 'point_of_sale',
      children: [
        {
          label: 'New Sale',
          icon: 'add_shopping_cart',
          route: '/sales/new'
        },
        {
          label: 'All Sales',
          icon: 'receipt_long',
          route: '/sales'
        },
        {
          label: 'Returns',
          icon: 'assignment_return',
          route: '/sales/returns'
        }
      ]
    },
    {
      label: 'Customers',
      icon: 'people',
      route: '/customers'
    },
    {
      label: 'Reports',
      icon: 'bar_chart',
      route: '/reports',
      roles: ['admin', 'manager']
    }
  ];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  hasRole(roles?: string[]): boolean {
    if (!roles || roles.length === 0) return true;
    return this.authService.hasRole(roles);
  }
}
