
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";
import { User } from "./user.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { TrainingService } from "../training/training/training.service";
import { authState, signOut } from '@angular/fire/auth';
import { MatSnackBar } from "@angular/material/snack-bar";
import { UIService } from "../shared/ui.service";
import { Store } from "@ngrx/store";
import * as fromApp from '../app.reducer';



@Injectable({
    providedIn: 'root'
})

export class AuthService {

    constructor(private router: Router,
        private auth: Auth,
        private trainingService: TrainingService,
        private snackBar: MatSnackBar,
        private uiService: UIService,
        private store: Store<{ui: fromApp.State }>) { }

    initAuthListener() {
        authState(this.auth).subscribe(user => {
            console.log(user);
            if (user) {
                this.isAuthenticated = true;
                this.authChange.next(true); // authChange is used to change the state of the sidenav and the header
                this.router.navigate(['/training'])
            } else {
                this.trainingService.cancelSubscriptions();
                this.authChange.next(false);
                this.router.navigate(['/login']);
                this.isAuthenticated = false;
            }
        });
    } 

    authChange = new Subject<boolean>();

    // private user!: User | null;
    private isAuthenticated = false;// used to manage the state of the authGuard whether to allow navigation to training component

    registerUser(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        // this below is a function provided by angularFire
        createUserWithEmailAndPassword(
            this.auth,
            authData.email,
            authData.password
        ).then(result => {
            console.log(result);
            this.uiService.loadingStateChanged.next(false);

        }).catch(error => {
            this.uiService.loadingStateChanged.next(false);
            console.log(error);
            this.uiService.showSnackbar(error.message, '', 3000)
            // this.snackBar.open(error.message, '', {
            //     duration: 3000
            // })

        })


    }


    login(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        // this below is a function provided by angularFire
        signInWithEmailAndPassword(
            this.auth,
            authData.email,
            authData.password
        ).then(result => {
            console.log(result);
            this.uiService.loadingStateChanged.next(false);

        }).catch(error => {
            this.uiService.loadingStateChanged.next(false);
            console.log(error);
            this.uiService.showSnackbar(error.message, '', 3000)
            // this.snackBar.open(error.message, '', {
            //     duration: 3000
            // })
        })

    }

    logout() {


        signOut(this.auth)
            .then(() => {
                console.log('Logged out');
            })
            .catch(error => {
                console.error(error);
            });
    }



    isAuth() {
        return this.isAuthenticated;
    }


}