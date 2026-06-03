import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private authService: AuthService, private uiService: UIService) { }

  reactiveForm!: FormGroup;
  email!: string;
  password!: string;
  isLoading = false;
  private loadingSubs!: Subscription;

  ngOnInit() {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    })
    this.reactiveForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }

  onFormSubmit() {
    this.email = this.reactiveForm.get('email')?.value;
    this.password = this.reactiveForm.get('password')?.value;

    this.authService.login({ email: this.email, password: this.password })

  }

  ngOnDestroy(){
    if(this.loadingSubs){
      this.loadingSubs.unsubscribe();
    }
    
  }

}
