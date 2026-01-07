import { Component, signal, AfterViewInit, ElementRef, ViewChild, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Leave } from '../leave-manager/leave-manager';
import { TimeTableApiService } from '../../services/time-api-service';

@Component({
  selector: 'app-show-leave',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-leave.html',
  styleUrl: './show-leave.scss',
})
export class ShowLeave implements OnInit {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  employees = signal<Leave[]>([]);

  constructor(private api: TimeTableApiService) {
    // = this.api.upcomingLeave;
    effect(() => {
      const apiData = this.api.leaveManagerData();
      if (apiData && apiData.length > 0) {
        this.employees.set(apiData);
      }
    });
  }

  ngOnInit() {}

  showLeftArrow = signal(false);
  showRightArrow = signal(true);

  getCardClass(type: Leave['type']): string {
    const classMap: Record<Leave['type'], string> = {
      EL: 'bg-success text-white', // Earned Leave - Green
      CL: 'bg-warning text-dark', // Casual Leave - Yellow/Orange
      UL: 'bg-danger text-white', // Unauthorised Leave - Red
      HPL: 'bg-secondary text-white', // Half Pay Leave - Gray
      VL: 'bg-info text-white', // Vacation Leave - Blue
      DL: 'bg-info text-white', // Vacation Leave - Blue
      RH: 'bg-info text-white', // Vacation Leave - Blue
    };
    return classMap[type];
  }

  getIcon(type: Leave['type']): string {
    const iconMap: Record<Leave['type'], string> = {
      EL: '🌟', // Earned Leave
      CL: '☕', // Casual Leave
      UL: '🚫', // Unauthorised Leave
      HPL: '💸', // Half Pay Leave
      VL: '✈️', // Vacation Leave
      DL: '✈️', // Vacation Leave
      RH: '✈️', // Vacation Leave
    };
    return iconMap[type] || '📅';
  }

  onScroll() {
    const scrollLeft = this.scrollContainer.nativeElement.scrollLeft;
    const scrollWidth = this.scrollContainer.nativeElement.scrollWidth;
    const clientWidth = this.scrollContainer.nativeElement.clientWidth;

    this.showLeftArrow.set(scrollLeft > 10);
    this.showRightArrow.set(scrollLeft < scrollWidth - clientWidth - 10);
  }

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }
}
