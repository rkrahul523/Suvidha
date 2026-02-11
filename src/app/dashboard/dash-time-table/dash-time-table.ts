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
  // ✅ Data & Configuration
  rawTimetableData = signal<any[]>(dashtime);
  days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  currentDay = signal('MON');
  timeSlots = [9, 10, 11, 12, 13, 14, 15, 16, 17];

  // ✅ Today's Date & Time
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

  currentTime = computed(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  });

  currentHour = computed(() => {
    const now = new Date();
    const hour = now.getHours();
    return `${hour}:00-${hour + 1}:00`;
  });

  // 🔥 FIXED: FULLY REACTIVE SIGNAL CHAIN
  flattenedTimetable = computed(() => this.getFlattenedData());
  
  uniqueCourses = computed(() => {
    return Array.from(new Set(this.flattenedTimetable().map(cls => cls.course)));
  });

  avlFaculty = computed(() => this.getAvailableFaculty());
  occFaculty = computed(() => this.getOccupiedFaculty());

  constructor() {
    // ✅ Auto-select today's day ONCE
    effect(() => {
      const today = this.todayDay();
      console.log(`📅 Today is ${today}`);
      if (this.days.includes(today) && this.currentDay() === 'MON') {
        this.currentDay.set(today);
      }
    });
  }

  // 🔥 FIXED: Day click handler
  onDayClick(day: string) {
    console.log('🔹 CLICK DETECTED:', day);
    console.log('📅 Before:', this.currentDay());
    this.currentDay.set(day);
    console.log('✅ DAY CHANGED TO:', this.currentDay());
    console.log('📊 Classes for', day, ':', this.flattenedTimetable().length);
    console.log('📚 Courses:', this.uniqueCourses());
  }

  // ✅ FIXED: Fully reactive data flattening
  private getFlattenedData(): TimetableClass[] {
    const data = this.rawTimetableData();
    const result: TimetableClass[] = [];
    const currentDayKey = this.currentDay();

    console.log('🔍 Flattening data for day:', currentDayKey);

    data.forEach(courseObj => {
      if (courseObj && typeof courseObj === 'object') {
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
      }
    });

    const sorted = result.sort((a, b) => a.startTime - b.startTime);
    console.log('✅ Flattened classes:', sorted.length);
    return sorted;
  }

  getCourseData(courseName: string): TimetableClass[] {
    return this.flattenedTimetable().filter(cls => cls.course === courseName);
  }

  isTimeBetween(startTime: number, endTime: number): boolean {
    const now = new Date().getHours();
    return now >= startTime && now < endTime;
  }

  // ✅ FIXED: Current hour faculty logic
  private getAvailableFaculty(): string[] {
    const currentHour = new Date().getHours();
    const busyFaculty = new Set(
      this.flattenedTimetable()
        .filter(cls => cls.startTime <= currentHour && currentHour < cls.endTime)
        .map(cls => cls.sub)
    );
    
    const allFaculty = [
      'Dr. Anil Kumar', 'Dr. S.R. Kumar', 'Dr. Arvind Pandey', 'Ms. Sujata S. Gupta',
      'Dr. Partha S. Mondal', 'Dr. Subhankar Basu', 'Dr. Sriparna Chattopadhyay',
      'Dr. H.Vignesh Babu', 'Dr. Abhilash T. Nair', 'Dr. Sumbul Rahman',
      'Dr. Khushboo', 'Dr. Nilima Das', 'Dr. Vandana'
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

  // ✅ TrackBy functions
  trackByCourse(index: number, course: string): string {
    return course;
  }

  trackBySlot(index: number, slot: number): number {
    return slot;
  }

  trackByClass(index: number, cls: TimetableClass): string {
    return `${cls.course}-${cls.short}-${cls.startTime}`;
  }

  trackByFaculty(index: number, faculty: string): string {
    return faculty;
  }

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }
}
