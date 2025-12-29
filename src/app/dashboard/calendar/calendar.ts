import { Component, signal, OnInit, computed ,effect} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Leave {
  employee: string;
  type: 'SL' | 'CL' | 'AL';
  fromDate: string;  // ✅ Now full dd-mm-yyyy
  toDate: string;    // ✅ Now full dd-mm-yyyy
}

export interface CalendarDay {
  date: number;
  isToday: boolean;
  dayOfWeek: number;
  leaves: Leave[];
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
    // ✅ UPDATED: December + January 2026 leaves
    leavesConfig = signal<Leave[]>([
      // ✅ DECEMBER 2025
      // { employee: 'John Doe', type: 'SL', fromDate: '26-12-2025', toDate: '26-12-2025' },
      // { employee: 'Jane Smith', type: 'CL', fromDate: '28-12-2025', toDate: '30-12-2025' },
      // { employee: 'Mike Wilson', type: 'AL', fromDate: '15-12-2025', toDate: '20-12-2025' },
      // { employee: 'Sarah Brown', type: 'SL', fromDate: '05-12-2025', toDate: '05-12-2025' },
      // { employee: 'David Lee', type: 'CL', fromDate: '31-12-2025', toDate: '31-12-2025' },
      // { employee: 'Priya Patel', type: 'AL', fromDate: '10-12-2025', toDate: '12-12-2025' },
      // { employee: 'Raj Kumar', type: 'SL', fromDate: '02-12-2025', toDate: '03-12-2025' },
      
      // // ✅ JANUARY 2026 - NEW LEAVES
      // { employee: 'Alice Johnson', type: 'SL', fromDate: '03-01-2026', toDate: '04-01-2026' },
      // { employee: 'Bob Chen', type: 'CL', fromDate: '10-01-2026', toDate: '12-01-2026' },
      // { employee: 'Emma Davis', type: 'AL', fromDate: '18-01-2026', toDate: '25-01-2026' },
      // { employee: 'Tom Wilson', type: 'SL', fromDate: '07-01-2026', toDate: '07-01-2026' },
      // { employee: 'Lisa Patel', type: 'CL', fromDate: '28-01-2026', toDate: '31-01-2026' },
      // { employee: 'Mark Lee', type: 'AL', fromDate: '15-01-2026', toDate: '15-01-2026' }
    ]);
  
    currentMonthIndex = signal(11); // December
    currentYear = signal(2025);
    hoveredDay = signal<CalendarDay | null>(null);
  
    weekdays = computed(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    weeks = computed(() => this.generateWeeks());
  
    constructor() {
      effect(() => {
        const month = this.currentMonthIndex();
        const year = this.currentYear();
        console.log(`Rendering: ${month + 1}/${year} - Leaves found:`, 
          this.weeks().flat().filter(d => d.leaves.length > 0).length);
      });
    }
  
    /** ✅ FIXED: Perfect month-aware + multi-day rendering */
    generateWeeks(): CalendarDay[][] {
      const now = new Date();
      const today = now.getDate();
      const todayMonth = now.getMonth();
      const todayYear = now.getFullYear();
      
      const month = this.currentMonthIndex();
      const year = this.currentYear();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDay = new Date(year, month, 1).getDay();
      
      const weeksData: CalendarDay[][] = [];
      let dayCounter = 1 - firstDay;
  
      for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
        const week: CalendarDay[] = [];
        for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
          const date = dayCounter;
          if (date >= 1 && date <= daysInMonth) {
            const dayLeaves = this.leavesConfig().filter(leave => {
              const [fromDayStr, fromMonthStr, fromYearStr] = leave.fromDate.split('-');
              const [toDayStr] = leave.toDate.split('-');
              
              const fromDay = parseInt(fromDayStr, 10);
              const fromMonth = parseInt(fromMonthStr, 10) - 1;
              const fromYear = parseInt(fromYearStr, 10);
              const toDay = parseInt(toDayStr, 10);
              
              // ✅ Perfect month matching + multi-day support
              return fromYear === year && 
                     fromMonth === month && 
                     fromDay <= date && 
                     toDay >= date;
            });
            
            week.push({
              date,
              isToday: date === today && month === todayMonth && year === todayYear,
              dayOfWeek,
              leaves: dayLeaves,
              isEmpty: false
            });
          } else {
            week.push({ 
              date: 0, 
              isToday: false, 
              dayOfWeek, 
              leaves: [], 
              isEmpty: true 
            });
          }
          dayCounter++;
        }
        weeksData.push(week);
      }
      return weeksData;
    }
  
    prevMonth() {
      this.currentMonthIndex.update(month => {
        if (month === 0) {
          this.currentYear.update(year => year - 1);
          return 11;
        }
        return month - 1;
      });
    }
  
    nextMonth() {
      this.currentMonthIndex.update(month => {
        if (month === 11) {
          this.currentYear.update(year => year + 1);
          return 0;
        }
        return month + 1;
      });
    }
  
    hoverDay(day: CalendarDay | null) {
      this.hoveredDay.set(day);
    }
  
    selectDay(day: CalendarDay) {
      if (!day.isEmpty) {
        console.log('Selected:', `${day.date}-${this.currentMonthIndex() + 1}-${this.currentYear()}`, day.leaves);
      }
    }
  
    getDayAriaLabel(day: CalendarDay): string {
      if (day.isEmpty) return '';
      return `${day.date} - ${day.leaves.length} leave${day.leaves.length !== 1 ? 's' : ''}`;
    }
  
    getDayTitle(day: CalendarDay): string {
      return day.leaves.map(l => `${l.employee} (${l.fromDate} → ${l.toDate})`).join('\n');
    }
  
    getLeaveTitle(leave: Leave): string {
      const types = { SL: 'Sick Leave', CL: 'Casual Leave', AL: 'Annual Leave' };
      return `${leave.employee}\n${types[leave.type as keyof typeof types]}\n${leave.fromDate} → ${leave.toDate}`;
    }
  
    currentMonth(): string {
      return new Date(this.currentYear(), this.currentMonthIndex(), 1).toLocaleDateString('en-US', { month: 'long' });
    }
  
    currentMonthAbbr(): string {
      return new Date(this.currentYear(), this.currentMonthIndex(), 1).toLocaleDateString('en-US', { month: 'short' });
    }
}