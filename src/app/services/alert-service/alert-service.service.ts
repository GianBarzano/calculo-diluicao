import { Injectable } from '@angular/core';
import { AlertConfig } from './interface/AlertConfig';

@Injectable({
  providedIn: 'root',
})
export class AlertServiceService {
  constructor() {}

  warning(config: AlertConfig): void {
    alert(config.message);
  }
}
