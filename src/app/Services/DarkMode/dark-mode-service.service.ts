import { Inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class DarkModeEffects {

  private _platformId: any;
  private _renderer: Renderer2;
  private _document: Document;

  private _theme$ = new ReplaySubject<'light' | 'dark'>(1);
  public theme$ = this._theme$.asObservable();
  private _destroyed$ = new Subject<void>();

  constructor(
    @Inject(PLATFORM_ID) platformId: any,
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) document: any
  ) {
    this._platformId = platformId;
    this._renderer = rendererFactory.createRenderer(null, null);
    this._document = document;
    this.syncThemeFromLocalStorage();
    this.toggleClassOnThemeChanges();
  }

  private syncThemeFromLocalStorage(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._theme$.next(
        localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
      );
    }
  }

  private toggleClassOnThemeChanges(): void {
    this.theme$.pipe(takeUntil(this._destroyed$)).subscribe((theme) => {
      if (theme === 'dark') {
        this._renderer.addClass(this._document.documentElement, 'dark');
      } else {
        if (this._document.documentElement.className.includes('dark')) {
          this._renderer.removeClass(this._document.documentElement, 'dark');
        }
      }
    });
  }

  public toggleDarkMode(): void {
    const newTheme = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    this._theme$.next(newTheme);
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
