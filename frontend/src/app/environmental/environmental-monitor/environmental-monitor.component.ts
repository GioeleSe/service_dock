import {Component, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
// import {EnvironmentalGraphComponent} from "../environmental-graph/environmental-graph.component";
import {ApiService, EnvironmentalData} from "../../api-service";
import {EnvironmentalGraphComponent} from "../environmental-graph/environmental-graph.component";

@Component({
  selector: 'environmental-monitor',
  imports: [
    MatIcon,
    EnvironmentalGraphComponent,
    // EnvironmentalGraphComponent
  ],
  templateUrl: './environmental-monitor.component.html',
  styleUrls: ['./environmental-monitor.component.css'],
})
export class EnvironmentalMonitorComponent implements OnInit {
  protected _temp:number = 0;
  protected _hum:number = 0;
  protected isUpdating:boolean = false;
  protected failedUpdate:boolean = false;

  setTemp(temp:number){
    this._temp = temp;
  }
  getTemp():number{
    return this._temp
  }
  setHum(hum:number){
    this._hum = hum;
  }
  getHum():number{
    return this._hum;
  }

  updateEnv():void{
    this.isUpdating = true;
    this.apiService.getEnvironmentalNow().subscribe(
      (res:EnvironmentalData) =>{
        if (!isNaN(res[1]) && !isNaN(res[2])){
          this._temp = res[1]/100;
          this._hum = res[2]/100;
          console.debug("Got temperature " + res[1] + " and humidity " + res[2]);
          this.failedUpdate = false;
        }else{
          this.failedUpdate = true;
          console.error("Error getting environmental data-> " + res);
        }
        this.isUpdating = false;
      },
      error => {
        console.warn("cannot update environmental data, got error " + JSON.stringify(error));
        this.isUpdating = false;
        this.failedUpdate = true;
      }
    );
  }

  constructor(private apiService:ApiService) {};

  ngOnInit(): void {
    this.updateEnv()
  }
}

