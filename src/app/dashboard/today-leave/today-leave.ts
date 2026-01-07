import { Component, signal, OnInit, effect, PLATFORM_ID, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { TimeTableApiService } from '../../services/time-api-service';
import { Leave } from '../leave-manager/leave-manager';

@Component({
  selector: 'app-today-leave',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './today-leave.html',
  styleUrl: './today-leave.scss',
})
export class TodayLeaves implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  todayLeaves = signal<Leave[]>([]);
  allLeaves = signal<Leave[]>([]);

  showLeftArrow = signal(false);
  showRightArrow = signal(false);
  isBrowser = false;
  loading = signal(true);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, 
    private api: TimeTableApiService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    effect(() => {
      const apiData = this.api.leaveManagerData();
      if (apiData && apiData.length > 0) {
        this.allLeaves.set(apiData);
        this.filterTodayLeaves();
      }
    });
  }

  ngOnInit() {
   
  }

  ngAfterViewInit() {
    this.loading.set(false);
  }

  /** ✅ UPDATED: Matches your exact Leave format with id, leaveId, day (float) */
  private filterTodayLeaves() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const currentLeaves = this.allLeaves().filter(leave => {
      // Parse dd-mm-yyyy format exactly as your data
      const [fromDay, fromMonth, fromYear] = leave.fromDate.split('-').map(Number);
      const [toDay, toMonth, toYear] = leave.toDate.split('-').map(Number);
      
      const fromDate = new Date(fromYear, fromMonth - 1, fromDay);
      const toDate = new Date(toYear, toMonth - 1, toDay);
      
      return fromDate <= today && toDate >= today;
    });

    this.todayLeaves.set(currentLeaves);
    this.updateScrollArrows();
  }

  trackByLeaveId(index: number, leave: Leave): any {
    return leave.id || leave.leaveId;
  }

  getCardClass(type: Leave['type']): string {
    return {
      EL: 'leave-el gradient-green',
      CL: 'leave-cl gradient-orange', 
      UL: 'leave-ul gradient-red',
      HPL: 'leave-hpl gradient-gray',
      VL: 'leave-vl gradient-blue',
      DL: 'leave-vl gradient-blue',
      RH: 'leave-vl gradient-blue',
    }[type] || 'leave-default';
  }

  getIcon(type: Leave['type']): string {
    return {
      EL: '⭐', CL: '☕', UL: '🚫', 
      HPL: '💰', VL: '✈️', DL: '✈️', RH: '✈️'
    }[type] || '📅';
  }

  getLeaveTypeLabel(type: Leave['type']): string {
    return {
      EL: 'Earned Leave', 
      CL: 'Casual Leave', 
      UL: 'Unauthorized', 
      HPL: 'Half Pay Leave', 
      VL: 'Vacation',
      RH: 'Restricted Holiday',
      DL: 'Duty Leave',
    }[type] || type;
  }

  /** ✅ NEW: Format day (handles 0.5, 1, 2.5 etc.) */
  formatDays(days: number): string {
    if (days === 1) return '1 day';
    if (days % 1 === 0) return `${days} days`;
    return `${days} day${days > 1 ? 's' : ''}`;
  }

  onScroll() {
    if (!this.scrollContainer?.nativeElement) return;
    const el = this.scrollContainer.nativeElement;
    const scrollLeft = el.scrollLeft;
    const scrollWidth = el.scrollWidth;
    const clientWidth = el.clientWidth;

    this.showLeftArrow.set(scrollLeft > 10);
    this.showRightArrow.set(scrollLeft < scrollWidth - clientWidth - 10);
  }

  scrollLeft() { this.scrollContainer.nativeElement.scrollBy({ left: -320, behavior: 'smooth' }); }
  scrollRight() { this.scrollContainer.nativeElement.scrollBy({ left: 320, behavior: 'smooth' }); }

  private updateScrollArrows() {
    setTimeout(() => this.onScroll(), 100);
  }

  getTotalOnLeave(): number {
    return this.todayLeaves().length;
  }
}
