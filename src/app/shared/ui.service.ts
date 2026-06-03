import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subject } from "rxjs";

@Injectable()

export class UIService {
    loadingStateChanged = new Subject<boolean>();

    exercisesLoadedState = new Subject<boolean>();

    constructor(private snackbar: MatSnackBar) { }

    showSnackbar(message: any, action: any, duration: any) {
        this.snackbar.open(message, action, {
            duration: duration
        })
    }
}