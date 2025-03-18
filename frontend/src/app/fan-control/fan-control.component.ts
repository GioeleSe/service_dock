import {Component, ViewChild} from '@angular/core';
import {ApiService} from "../api-service";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-fan-control',
  imports: [
    MatSlider,
    MatSliderThumb,
    MatSlideToggle,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './fan-control.component.html',
  styleUrls: ['./fan-control.component.css'],
})
export class FanControlComponent {
  isOn:boolean = false;
  private _speed:number = 0;
  constructor(private apiService:ApiService) {};

  @ViewChild('toggleButton') toggleButton!: MatSlideToggle;
  @ViewChild('speedSlider') speedSlider!: MatSliderThumb;

  get speed(): number {
    return this._speed;
  }
  set speed(value: number){
    this._speed = value;
  }

  updateSpeed():void{
    this.toggleButton.checked = (this.speed>0);
  }

  toggleFan():void {
    this.isOn = !this.isOn;
    if(!this.isOn){
      this._speed = 0;
    }
  }

  setFan():void{
    this.apiService.setFanSpeed(this._speed).subscribe(res =>{
      if (isFinite(res) && res===this._speed){
        console.info("Set speed " + res);
      }else{
        console.error("Error setting speed!");
        console.debug("Expected speed " + this._speed + " but got " + res);
      }
    });
  }
  getFan():void{
    this.apiService.getFanSpeed().subscribe((res:number) =>{
      console.debug(res);
      if (isFinite(res) && res<256 && res>=0){
        this.speed = res;
        this.updateSpeed();
        console.info("Got speed " + res);
      }else{
        console.error("Error getting speed-> " + res);
      }
    });
  }
}
