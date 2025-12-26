import { Component, signal, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface LeaveEmployee {
  name: string;
  type: 'Sick' | 'Casual' | 'Annual';
  date: string;
}
@Component({
  selector: 'app-show-leave',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-leave.html',
  styleUrl: './show-leave.scss',
})
export class ShowLeave {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  
  employees = signal<LeaveEmployee[]>([
    { name: 'John Doe', type: 'Sick', date: 'Dec 26, 2025' },
    { name: 'Jane Smith', type: 'Casual', date: 'Dec 26, 2025' },
    { name: 'Mike Wilson', type: 'Annual', date: 'Dec 26, 2025' },
    { name: 'Sarah Brown', type: 'Sick', date: 'Dec 26, 2025' },
    { name: 'David Lee', type: 'Casual', date: 'Dec 26, 2025' },
    { name: 'Priya Patel', type: 'Annual', date: 'Dec 26, 2025' },
    { name: 'Raj Kumar', type: 'Sick', date: 'Dec 26, 2025' },
    { name: 'Anita Singh', type: 'Casual', date: 'Dec 26, 2025' }
  ]);

  showLeftArrow = signal(false);
  showRightArrow = signal(true);

  getCardClass(type: LeaveEmployee['type']): string {
    return {
      'Sick': 'bg-danger text-white',
      'Casual': 'bg-warning text-dark',
      'Annual': 'bg-info text-white'
    }[type] || '';
  }

  getIcon(type: LeaveEmployee['type']): string {
    return { 'Sick': '🤒', 'Casual': '☕', 'Annual': '✈️' }[type] || '📅';
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
