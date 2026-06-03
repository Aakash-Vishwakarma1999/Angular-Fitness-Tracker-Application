import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MaterialModules } from './material.module';

import { WelcomeComponent } from './welcome/welcome.component';

import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
// import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
// import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { UIService } from './shared/ui.service';
import { AuthModule } from './auth/auth.module';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './app.reducer';


@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    HeaderComponent,
    SidenavListComponent,
    

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModules,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    AuthModule,
    StoreModule.forRoot({ui: appReducer})
    

  ],
  providers: [UIService],
  bootstrap: [AppComponent]

})
export class AppModule {

  // AngularFireModule.initializeApp(environment.firebase),
  //   AngularFirestoreModule,
  //   provideAuth(() => getAuth()),
}
