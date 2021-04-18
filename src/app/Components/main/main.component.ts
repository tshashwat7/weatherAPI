import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
export class weather {
  time ='';    
  icon =''; 
  iconName =''; 
  temp =''; 
  arrowStyling =''; 
  windSpeed ='';
  windDirection =''; 
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {

  weatherRows:any=[];
  city:string='';
  constructor() { }

  ngOnInit() {
    this.getWeatherData();
  }

  groupWeatherByDay(list:any) {
    const map = new Map();
    let val: any[] = [];
    list.forEach((item: any) => {
         const key = moment(item.dt*1000).format("dddd Do MMMM");
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    map.forEach((value, key) => {
      let v = {
        day: key,
        value: value
      }
      val.push(v);
    });
    return val;
   }

  getWeatherData(){
    fetch('http://api.openweathermap.org/data/2.5/forecast?q=deoria&appid=5beb4e10afbd48f71c2cb2c12b84782a')
    .then(response=>response.json())
    .then(data=>{
      const weather = data;
      this.city = weather.city && weather.city.name;
      this.weatherRows = this.groupWeatherByDay( weather.list)
      this.setWeatherData(this.weatherRows);
  });
}
  
  setWeatherData(data: any){
    let WeatherData : weather;
    data.forEach((ele:any) => {
      ele.value.forEach((element: any) => {
      WeatherData = new weather();
      element.time = moment(element.dt*1000).format("HH:mm");
      element.icon = 'http://openweathermap.org/img/w/'+ element.weather[0].icon + '.png';
      element.iconName = element.weather[0].description;
      element.temp = (element.main.temp - 273.15).toFixed(0)+ '°C';
      element.arrowStyling = `rotate(${Math.round(element.wind.deg)}deg)`;
      element.windSpeed = Math.round(this.convertKmphToMph(element.wind.speed)) +'mph';
      element.windDirection = `${Math.round(element.wind.deg)}°`;
    });
  });
  }
  convertKmphToMph(kmph: number) {
    return kmph * 0.621371
  }
  getDirection(val: any){
    return val;
  }
}
