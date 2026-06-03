import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  constructor(private authService: AuthService, private uiService: UIService) {

  }

  isLoading = false;
  private loadingSubs!: Subscription;

  maxDate!: Date;

  ngOnInit() {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    })
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onSubmit(form: NgForm) {
    console.log(form);
    let data = {
      email: form.value.email,
      password: form.value.password
    }
    this.authService.registerUser(data)

  }

  ngOnDestroy() {
    if (this.loadingSubs) { this.loadingSubs.unsubscribe(); }
  }
}
