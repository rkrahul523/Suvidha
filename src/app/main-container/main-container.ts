import { Component, signal } from '@angular/core';
import { DashTimetableComponent } from '../dashboard/dash-time-table/dash-time-table';
import { Login } from '../login/login';
import { CommonModule } from '@angular/common';

type Tab = 'login' | 'Dashtimetable';
@Component({
  selector: 'app-main-container',
  standalone: true,
  imports: [CommonModule,DashTimetableComponent, Login],
  templateUrl: './main-container.html',
  styleUrl: './main-container.scss',
})
export class MainContainer {
  activeTab = signal<Tab>('login');

  setActiveTab(tab: Tab) {
    this.activeTab.set(tab);
  }
}

