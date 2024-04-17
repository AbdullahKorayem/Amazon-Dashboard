import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    // Retrieve theme choice from localStorage
    const isDarkMode = localStorage.getItem('theme') === 'dark';
    this.toggleDarkMode(isDarkMode);
  }

  toggleDarkMode(isDark: boolean): void {
    // Toggle dark mode
    this.darkModeSubject.next(isDark);
    // Save theme choice to localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
}
