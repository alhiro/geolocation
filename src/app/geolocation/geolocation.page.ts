import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
declare var google;
@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.page.html',
  styleUrls: ['./geolocation.page.scss'],
})
export class GeolocationPage implements OnInit, AfterViewInit {
  latitude: any;
  longitude: any;
  pos: any;
  @ViewChild('mapElement') mapNativeElement: ElementRef;
  constructor(
    private geolocation: Geolocation
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    
  }

  getGeoLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

      // Load map
      const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
        center: {lat: resp.coords.latitude, lng: resp.coords.longitude},
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });     

      // Show marker on map
      const marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: map.getCenter(),
        draggable: true
      });

      // Event marker after drag on map
      map.addListener(marker, 'dragend', function () {
        this.pos = marker.getPosition();

        console.log("latlong   " + JSON.stringify(this.pos));
        console.log("lat    " + marker.getPosition().lat());
        console.log("long   " + marker.getPosition().lng());

        this.latitude = marker.getPosition().lat();
        this.longitude = marker.getPosition().lng();
      });
      
      // const pos = {
      //   lat: this.latitude,
      //   lng: this.longitude
      // };
      // console.log('pos', pos);

      let content = "<h6 class='no-margin'>My coordinate</h6>" + "<p>" + `${this.latitude+", "+this.longitude}` + "</p>";
      const infoWindow = new google.maps.InfoWindow({
        content: content
      });
      // Click marker open detail
      marker.addListener('click', function() {
        infoWindow.open(map, marker);
      });     

      infoWindow.setPosition(this.pos.getPosition());
      infoWindow.setContent(content);
     
      map.setCenter(this.pos.getPosition());

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

}
