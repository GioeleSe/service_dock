import {Component} from '@angular/core';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatListItem, MatNavList} from "@angular/material/list";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
    imports: [
        MatSidenav,
        MatSidenavContent,
        MatSidenavContainer,
        MatIcon,
        MatToolbar,
        MatNavList,
        RouterOutlet,
        RouterLink,
        MatListItem,
        RouterLinkActive,
    ],
  styleUrls: [
      './app.component.css',
  ]
})
export class AppComponent {
}