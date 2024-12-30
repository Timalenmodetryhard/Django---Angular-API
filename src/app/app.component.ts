import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MapComponent } from './map/map.component';

@Component({
  selector: 'app-root',
  imports: [MapComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showOperationalOnly: boolean = false;
  selectedStation: any = null;
  selectedBridge: any = null;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  toggleHideNonOperational(event: boolean): void {
    this.showOperationalOnly = event;
  }

  onStationSelected(station: any): void {
    this.selectedStation = station;
  }

  onBridgeSelected(bridge: any): void {
    this.selectedBridge = bridge;
  }
}
