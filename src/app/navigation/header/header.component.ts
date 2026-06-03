import { Component, EventEmitter, Output } from '@angular/core';
import { SubscriptSizing } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  isAuth = false;
  authSubscription!: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    })
  }

  @Output()
  sidenavToggle: EventEmitter<void> = new EventEmitter<void>();

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  ngOnDestroy() {
    if (this.authSubscription) { this.authSubscription.unsubscribe(); }
  }

  onLogout() {
    this.authService.logout();
  }



}
