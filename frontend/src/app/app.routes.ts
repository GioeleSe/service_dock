import { Routes } from '@angular/router';
import { FanControlComponent } from './fan-control/fan-control.component';
import { EnvironmentalMonitorComponent } from './environmental/environmental-monitor/environmental-monitor.component';

export const routes: Routes = [
    { path: 'fan-control', component: FanControlComponent },
    { path: 'environmental-monitor', component: EnvironmentalMonitorComponent },
    { path: '', redirectTo: 'fan-control', pathMatch: 'full' }, // Default to Fan Control
    { path: '**', redirectTo: 'fan-control' } // Redirect unknown routes
];
