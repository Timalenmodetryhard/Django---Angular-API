import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { GraphComponent } from '../graph/graph.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map',
  imports: [CommonModule, GraphComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private map!: L.Map;
  private centroid: L.LatLngExpression = [48.8566, 2.3522];
  public selectedStation: any = null;
  public stations: any[] = [];
  public bridges: any[] = [];
  public showOperationalOnly: boolean = false;

  constructor(private http: HttpClient) {}

  private initMap(): void {
    this.map = L.map('map', {
      center: this.centroid,
      zoom: 10
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 4,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.loadStations();
    this.loadBridges();

    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);
  }

  private loadStations(): void {
    this.http.get<any>('https://hubeau.eaufrance.fr/api/v2/hydrometrie/referentiel/stations')
      .subscribe((response) => {
        console.log(response);
        this.stations = response.data
        this.updateStationMarkers();
      });
  }

  private loadBridges(): void {
    this.http.get<any>('http://127.0.0.1:8000/api/bridges/')
      .subscribe((response) => {
        this.bridges = response.bridges
        console.log(this.bridges)
        this.updateBridgeMarkers();
      });
  }

  private updateStationMarkers(): void {
    this.stations.forEach(station => {
      if (this.showOperationalOnly && !station.en_service) return;

      const marker = L.marker([station.latitude_station, station.longitude_station], {
        icon: station.en_service ? this.getOperationalIcon() : this.getNonOperationalIcon()
      }).addTo(this.map);

      marker.on('click', () => {
        this.selectStation(station)
        this.map.setView([station.latitude_station, station.longitude_station], this.map.getZoom(), {
          animate: true
        });

        setTimeout(() => {
          this.map.invalidateSize();
        }, 0);
      })
    })
  }

  private updateBridgeMarkers(): void {
    this.bridges.forEach(bridge => {
      L.marker([bridge.location.latitude, bridge.location.longitude], {
        icon: this.getBridgeIcon()
      }).addTo(this.map).bindPopup(`<b>${bridge.name}</b>`);
    });
  }

  private getOperationalIcon(): L.Icon {
    return L.icon({
      iconUrl: '/operational-icon.png',
      iconSize: [25, 25]
    });
  }

  private getNonOperationalIcon(): L.Icon {
    return L.icon({
      iconUrl: '/non-operational-icon.png',
      iconSize: [25, 25]
    });
  }

  private getBridgeIcon(): L.Icon {
    return L.icon({
      iconUrl: '/bridge-icon.png',
      iconSize: [25, 25]
    });
  }

  public toggleOperationalFilter(): void {
    this.showOperationalOnly = !this.showOperationalOnly;
  
    this.map.eachLayer(layer => {
      if (!(layer instanceof L.TileLayer)) {
        this.map.removeLayer(layer);
      }
    });
  
    this.updateStationMarkers();
    this.updateBridgeMarkers();
  }
  

  public selectStation(station: any): void {
    this.selectedStation = station;
  }

  public deselectStation(): void {
    this.selectedStation = null;
  }

  ngOnInit(): void {
    this.initMap();
  }
}

/*
import { Component, OnInit, Input, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  @Input() showOperationalOnly: boolean = false;
  stations: any[] = [];
  bridges: any[] = [];
  map: any;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadStations();
      this.loadBridges();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      import('leaflet').then(L => this.initMap(L));
    }
  }

  initMap(L: any): void {
    const mapElement = document.getElementById('map');
    if (mapElement) {
      this.map = L.map(mapElement).setView([48.8566, 2.3522], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    }
  }

  loadStations(): void {
    this.http.get<any[]>('https://hubeau.api.gouv.fr/hydrometrie/stations')
      .subscribe((stations) => {
        this.stations = stations.filter(station => station.operational || !this.showOperationalOnly);
        this.updateStationMarkers();
      });
  }

  loadBridges(): void {
    this.http.get<any[]>('http://127.0.0.1:8000/api/bridges/')
      .subscribe((bridges) => {
        this.bridges = bridges;
        this.updateBridgeMarkers();
      });
  }

  updateStationMarkers(): void {
    this.stations.forEach(station => {
      const marker = this.map && L.marker([station.latitude, station.longitude]).addTo(this.map);
      const popupContent = `
        <b>${station.name}</b><br>
        ${station.operational ? 'Operational' : 'Non-operational'}
      `;
      marker && marker.bindPopup(popupContent);
    });
  }

  updateBridgeMarkers(): void {
    this.bridges.forEach(bridge => {
      const marker = this.map && L.marker([bridge.latitude, bridge.longitude]).addTo(this.map);
      const popupContent = `<b>${bridge.name}</b>`;
      marker && marker.bindPopup(popupContent);
    });
  }
}
  */
