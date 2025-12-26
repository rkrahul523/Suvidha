import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isMobileMenuOpen = signal(false);
  userName = signal('Rahul Sharma');

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(open => !open);
  }

  signOut() {
    console.log('Signing out...');
    this.isMobileMenuOpen.set(false);
  }
}
