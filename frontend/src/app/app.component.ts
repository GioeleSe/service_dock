import {Component, Inject, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {FanControlService} from "./fan-control.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    FormsModule,
    MatSlider,
    MatSliderThumb,
    MatSlideToggle,
    MatFormFieldModule,
    MatInputModule,
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isOn:boolean = false;
  private _speed:number = 0;
  constructor(private fanControlService:FanControlService) {};

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
    this.fanControlService.setSpeed(this._speed).subscribe(res =>{
      if (isFinite(res) && res===this._speed){
        console.info("Set speed " + res);
      }else{
        console.error("Error setting speed!");
        console.debug("Expected speed " + this._speed + " but got " + res);
      }
    });
  }
  getFan():void{
    this.fanControlService.getSpeed().subscribe((res:number) =>{
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