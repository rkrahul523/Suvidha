import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LeaveDialog } from '../leave-dialog/leave-dialog';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isMobileMenuOpen = signal(false);
  userName = signal('Rahul Sharma');

  constructor(private modal: NgbModal ,private route:Router){

  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(open => !open);
  }


  openLeave() {
    this.modal.open(LeaveDialog, {
      size: 'lg',
      backdrop: false,
      centered: true
    });
  }

  signOut() {
    console.log('Signing out...');
    this.isMobileMenuOpen.set(false);
      localStorage.removeItem("token");
      this.route.navigateByUrl(`/login`)
  }
}
