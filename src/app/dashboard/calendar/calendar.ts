
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarDay {
  date: number;
  isToday: boolean;
  leaves: number;
  leaveTypes: string[];
  isEmpty: boolean;
}
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar {
  weeks = signal<any[]>([]);

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar() {
    const today = 26;
    const weeksData: CalendarDay[][] = [];
    const daysInMonth = 31;
    
    for (let week = 0; week < 6; week++) {
      const weekDays: CalendarDay[] = [];
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        const dayNum = (week * 7) + dayOfWeek + 1;
        if (dayNum <= daysInMonth) {
          const leaveTypes = Math.random() > 0.75 ? ['Sick'] : [];
          weekDays.push({
            date: dayNum,
            isToday: dayNum === today,
            leaves: leaveTypes.length,
            leaveTypes,
            isEmpty: false
          });
        } else {
          weekDays.push({ date: 0, isToday: false, leaves: 0, leaveTypes: [], isEmpty: true });
        }
      }
      weeksData.push(weekDays);
    }
    this.weeks.set(weeksData);
  }

  prevMonth() { console.log('Previous month'); }
  nextMonth() { console.log('Next month'); }
  selectDay(day: CalendarDay) { 
    if (!day.isEmpty) console.log('Selected:', day.date, day.leaveTypes); 
  }
}
