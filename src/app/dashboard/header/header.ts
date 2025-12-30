import { Component, signal, OnInit, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LeaveDialog } from '../leave-dialog/leave-dialog';
import { TimeTableApiService } from '../../services/time-api-service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  isMobileMenuOpen = signal(false);
  userName = signal('Rahul Sharma');
  // public/images/profiles/Ajeet Gupta.jpeg
  profileImage = computed(() => {
    const name = this.userName(); // Call here if needed
    return `/images/profiles/${name.replace(/\s+/g, '_')}.jpeg`;
  });
  constructor(
    private modal: NgbModal,
    private route: Router,
    private api: TimeTableApiService,
  ) {
    effect(() => {
      const apiData = this.api.leaveManagerData();
      this.userName.set(localStorage.getItem('username') ?? '');
      //const departm
      // localStorage.setItem('username',res.data.name ))
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((open) => !open);
  }
  ngOnInit() {
    this.userName.set(this.api.currentUser);
  }

  openLeave() {
    this.modal.open(LeaveDialog, {
      size: 'lg',
      backdrop: false,
      centered: true,
    });
  }

  signOut() {
    console.log('Signing out...');
    this.isMobileMenuOpen.set(false);
    localStorage.removeItem('token');
    this.route.navigateByUrl(`/login`);
  }
}
