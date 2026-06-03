import { Component, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent {

  constructor(private authService: AuthService) { }

  isAuth = false;
  authSubscription!: Subscription;

  ngOnInit() {
    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    })
  }

  @Output()
  closeSidenav: EventEmitter<void> = new EventEmitter<void>();

  onClose() {
    this.closeSidenav.emit();
  }

  ngOnDestroy() {
    if (this.authSubscription) { this.authSubscription.unsubscribe(); }
  }

  onLogout() {
    this.onClose();
    this.authService.logout();

  }
}
