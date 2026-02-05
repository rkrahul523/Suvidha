import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { dashtime } from './dash';

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
  selector: 'app-dash-time-table',
  standalone: true,
  imports: [CommonModule, NgbTooltipModule],
  templateUrl: './dash-time-table.html',
  styleUrl: './dash-time-table.scss',
})
export class DashTimetableComponent {
  rawTimetableData = signal<any[]>(dashtime);

  days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  currentDay = signal('MON');
  timeSlots = [9, 10, 11, 12, 13, 14, 15, 16, 17];

  // ✅ TODAY'S DATE & DAY - AUTO SELECTS TODAY (THU)
  todayDay = computed(() => {
    const now = new Date();
    return this.days[now.getDay() - 1] || 'MON';
  });

  todayDate = computed(() => {
    const now = new Date();
    return now.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  });

  uniqueCourses = computed(() => Array.from(new Set(
    this.rawTimetableData().flatMap(obj => Object.keys(obj))
  )));

  currentTime = computed(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  });

  flattenedTimetable = computed(() => this.getFlattenedData());
  avlFaculty = computed(() => this.getAvailableFaculty());
  occFaculty = computed(() => this.getOccupiedFaculty());

  constructor() {
    // ✅ AUTO-SELECT TODAY'S DAY
    effect(() => {
      const today = this.todayDay();
      if (this.days.includes(today)) {
        this.currentDay.set(today);
      }
      console.log(`📅 Today: ${this.todayDate()} | Selected: ${this.currentDay()}`);
    });
  }

  changeDay(day: string) {
    this.currentDay.set(day);
  }

  private getFlattenedData(): TimetableClass[] {
    const data = this.rawTimetableData();
    const result: TimetableClass[] = [];
    const currentDayKey = this.currentDay();

    data.forEach(courseObj => {
      Object.entries(courseObj).forEach(([courseName, daysObj]: [string, any]) => {
        Object.entries(daysObj).forEach(([dayKey, classes]: [string, any]) => {
          if (dayKey === currentDayKey && Array.isArray(classes)) {
            classes.forEach((cls: any) => {
              result.push({
                short: cls.short || '',
                course: courseName,
                startTime: cls.startTime || 0,
                endTime: cls.endTime || 0,
                sub: cls.sub || '',
                day: cls.day || dayKey,
                head: cls.head || ''
              });
            });
          }
        });
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
    const busyFaculty = new Set(this.flattenedTimetable().map(cls => cls.sub));
    const allFaculty = [
      'Dr. Anil Kumar', 'Dr. S.R. Kumar', 'Dr. Arvind Pandey', 'Ms. Sujata S. Gupta',
      'Dr. Partha S. Mondal', 'Dr. Subhankar Basu', 'Dr. Sriparna Chattopadhyay',
      'Dr. H.Vignesh Babu', 'Dr. Abhilash T. Nair', 'Dr. Sumbul Rahman',
      'Dr. Khushboo', 'Dr. Nilima Das', 'Dr. Vandana'
    ];
    return allFaculty.filter(faculty => !busyFaculty.has(faculty));
  }

  private getOccupiedFaculty(): string[] {
    return Array.from(new Set(this.flattenedTimetable().map(cls => cls.sub)));
  }

  hasClassAtSlot(course: string, slot: number): boolean {
    return this.getCourseData(course).some(cls => cls.startTime === slot);
  }

  trackByCourse(index: number, course: string): string {
    return course;
  }

  trackBySlot(index: number, slot: number): number {
    return slot;
  }

  trackByClass(index: number, cls: any): any {
    return cls.short || cls.startTime || index;
  }

  trackByFaculty(index: number, faculty: string): string {
    return faculty;
  }

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }
}
