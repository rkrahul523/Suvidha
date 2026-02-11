import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ffttime } from './fft-time';

export interface TimetableClass {
  short: string;
  course: string;
  startTime: number;
  endTime: number;
  sub: string;
  day: string;
  head: string;
}

@Component({
  selector: 'app-fft-time-table',
  standalone: true,
  imports: [CommonModule, NgbTooltipModule],
  templateUrl: './fft-time-table.html',
  styleUrl: './fft-time-table.scss',
})
export class FftTimeTable {
  rawTimetableData = signal<any[]>(ffttime);
  days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  currentDay = signal('MON');
  timeSlots = [9, 10, 11, 12, 13, 14, 15, 16];

  // Today's date & time
  todayDay = computed(() => {
    const now = new Date();
    return this.days[now.getDay() - 1] || 'MON';
  });

  todayDate = computed(() => {
    const now = new Date();
    return now.toLocaleDateString('en-IN', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
  });

  currentHour = computed(() => {
    const now = new Date();
    const hour = now.getHours();
    return `${hour}:00-${hour + 1}:00`;
  });

  currentTime = computed(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  });

  // 🔥 REACTIVE SIGNALS CHAIN
  flattenedTimetable = computed(() => this.getFlattenedData());
  uniqueCourses = computed(() => Array.from(new Set(this.flattenedTimetable().map(cls => cls.course))));
  avlFaculty = computed(() => this.getAvailableFaculty());
  occFaculty = computed(() => this.getOccupiedFaculty());

  constructor() {
    effect(() => {
      const today = this.todayDay();
      if (this.days.includes(today)) {
        this.currentDay.set(today);
      }
    });
  }

  // 🔥 FIXED: Explicit click handler with FORCE UPDATE
  onDayClick(day: string) {
    console.log('🔹 CLICK DETECTED:', day);
    this.currentDay.set(day);
    console.log('✅ DAY SET TO:', this.currentDay());
    console.log('📊 CLASSES:', this.flattenedTimetable().length);
  }

  private getFlattenedData(): TimetableClass[] {
    const data = this.rawTimetableData();
    const result: TimetableClass[] = [];
    const currentDayKey = this.currentDay();

    data.forEach(courseObj => {
      Object.entries(courseObj).forEach(([courseName, daysObj]: [string, any]) => {
        if (daysObj && typeof daysObj === 'object') {
          Object.entries(daysObj).forEach(([dayKey, classes]: [string, any]) => {
            if (dayKey === currentDayKey && Array.isArray(classes)) {
              classes.forEach((cls: any) => {
                result.push({
                  short: cls.short || '',
                  course: courseName,
                  startTime: Number(cls.startTime) || 0,
                  endTime: Number(cls.endTime) || 0,
                  sub: cls.sub || '',
                  day: dayKey,
                  head: cls.head || ''
                });
              });
            }
          });
        }
      });
    });

    return result.sort((a, b) => a.startTime - b.startTime);
  }

  getCourseData(courseName: string): TimetableClass[] {
    return this.flattenedTimetable().filter(cls => cls.course === courseName);
  }

  isTimeBetween(startTime: number, endTime: number): boolean {
    const now = new Date().getHours();
    return now >= startTime && now < endTime;
  }

  private getAvailableFaculty(): string[] {
    const currentHour = new Date().getHours();
    const busyFaculty = new Set(
      this.flattenedTimetable()
        .filter(cls => cls.startTime <= currentHour && currentHour < cls.endTime)
        .map(cls => cls.sub)
    );
    
    const allFaculty = [
      'Dr. Vivek S Ayar', 'Dr. Deepak Kumar', 'Dr. Nandita Gupta', 
      'Dr. Amitesh Kumar', 'Dr. Himanshu Khandelwal', 'Dr. Pavitra Singh',
      'Dr. Ajit Kr Pramanick', 'Dr. R.K. Odhar', 'Dr. R. Rahul Kulkarni',
      'Dr. Vineet Chak', 'Dr. Manoj Kumar', 'Dr. N.K. Singh'
    ];
    
    return allFaculty.filter(faculty => !busyFaculty.has(faculty));
  }

  private getOccupiedFaculty(): string[] {
    const currentHour = new Date().getHours();
    return Array.from(new Set(
      this.flattenedTimetable()
        .filter(cls => cls.startTime <= currentHour && currentHour < cls.endTime)
        .map(cls => cls.sub)
    ));
  }

  hasClassAtSlot(course: string, slot: number): boolean {
    return this.getCourseData(course).some(cls => cls.startTime === slot);
  }

  // TrackBy functions
  trackByCourse(index: number, course: string): string { return course; }
  trackBySlot(index: number, slot: number): number { return slot; }
  trackByClass(index: number, cls: TimetableClass): string { return `${cls.short}-${cls.startTime}`; }
  trackByFaculty(index: number, faculty: string): string { return faculty; }

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }
}
