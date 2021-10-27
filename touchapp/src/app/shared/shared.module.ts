import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import {
  CommonModule,
  APP_BASE_HREF
} from '@angular/common';

import { LogoutDirective } from './directives/logout/logout.directive';
import { FullHeightDirective } from './directives/full-height/full-height.directive';
import { FullWidthDirective } from './directives/full-width/full-width.directive';
import { HeaderStatusComponent } from './directives/header-status/header-status.component';
import { HrMinSecPipe } from './pipes/hr-min-secs/hr-min-secs.pipe';
import { BaseChartDirective } from './directives/charts/base-chart/base-chart.directive'
import { AmplificationChartDirective } from './directives/charts/amplification-chart/amplification-chart.directive'
import { WellButtonsComponent } from './components/well-buttons/well-buttons.component';
import { ToggleSwitchComponent } from './components/toggle-switch/toggle-switch.component';

@NgModule({
  declarations: [
    LogoutDirective,
    FullHeightDirective,
    FullWidthDirective,
    BaseChartDirective,
    AmplificationChartDirective,
    WellButtonsComponent,
    ToggleSwitchComponent,
    HeaderStatusComponent,
    HrMinSecPipe
  ],
  imports: [
    FormsModule,
    HttpModule,
    CommonModule,
  ],
  exports: [
    RouterModule,
    FormsModule,
    HttpModule,
    CommonModule,
    LogoutDirective,
    FullHeightDirective,
    FullWidthDirective,
    HeaderStatusComponent,
    BaseChartDirective,
    AmplificationChartDirective,
    WellButtonsComponent,
    ToggleSwitchComponent,
    HrMinSecPipe
  ],
  providers: [
    Title,
    { provide: APP_BASE_HREF, useValue: '/' },
  ]
})

export class SharedModule { }