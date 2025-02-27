import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from './core/components/header/header.component';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { FooterComponent } from './core/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Baby Clothing Store Management';
  sidenavOpened = true;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      // Check screen size on init
      this.checkScreenSize();
      // Listen for window resize events
      window.addEventListener('resize', () => this.checkScreenSize());
    } else {
      // Default for server-side rendering
      this.sidenavOpened = true;
    }
  }

  toggleSidebar(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  private checkScreenSize(): void {
    if (this.isBrowser) {
      // Close sidenav automatically on small screens
      this.sidenavOpened = window.innerWidth > 768;
    }
  }
}
