import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./features/auth/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: 'products',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./features/products/category-list/category-list.component').then(m => m.CategoryListComponent)
      }
    ]
  },
  {
    path: 'inventory',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/inventory/stock-levels/stock-levels.component').then(m => m.StockLevelsComponent)
      }
    ]
  },
  {
    path: 'sales',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/sales/sales-list/sales-list.component').then(m => m.SalesListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./features/sales/new-sale/new-sale.component').then(m => m.NewSaleComponent)
      },
      {
        path: 'returns',
        loadComponent: () => import('./features/sales/returns/returns.component').then(m => m.ReturnsComponent)
      }
    ]
  },
  {
    path: 'customers',
    loadComponent: () => import('./features/customers/customer-list/customer-list.component').then(m => m.CustomerListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'reports',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'manager'] },
    loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent)
  },
  {
    path: 'reports/sales',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'manager'] },
    loadComponent: () => import('./features/reports/sales-reports/sales-reports.component').then(m => m.SalesReportsComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
