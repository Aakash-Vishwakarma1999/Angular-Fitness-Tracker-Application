import { inject, Injectable } from "@angular/core";
import { exercise } from "./exercise.model";
import { map, Subject, Subscription } from "rxjs";
// import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Firestore, collectionData, collection, collectionSnapshots, addDoc } from '@angular/fire/firestore';
import { UIService } from "src/app/shared/ui.service";

@Injectable({
    providedIn: 'root'
})

export class TrainingService {

    exerciseChanged = new Subject<exercise | null>(); // based on the state of this we
    //  are upadting the UI in the trainingComponent so which component to show app-new-training or app-past-trainings or app-current-training
    exercisesChanges = new Subject<exercise[]>();

    finishedExercisesChanged = new Subject<exercise[]>();
    // private db = inject(AngularFirestore);
    private db = inject(Firestore);

    private availableExercises: exercise[] = []

    private runningExercise!: exercise | undefined | null;
    private fbSubs: Subscription[] = []; // firebaseSubscription
    // private finishedExercieses: exercise[] = [];

     uiService = inject(UIService);

    fetchAvailableExerciese() {
        this.uiService.exercisesLoadedState.next(true);
        const exercisesRef = collection(
            this.db,
            'availableExercises'
        );
        // Use snapshotChanges() when you need the document ID or information about document changes.
        this.fbSubs.push(collectionSnapshots(exercisesRef)   //this returns an observable which has all those values in our db along with the id
            .pipe(
                map(docArray => {
                    
                    console.log('docArray', docArray)
                    // throw(new Error)
                    return docArray.map(doc => {
                        return {
                            id: doc.id,
                            name: (doc.data() as exercise).name,
                            duration: (doc.data() as exercise).duration,
                            calories: (doc.data() as exercise).calories
                        }
                    });

                })
            ).subscribe((exercises: exercise[]) => {
                this.availableExercises = exercises;
                this.exercisesChanges.next([...this.availableExercises]);
                this.uiService.exercisesLoadedState.next(false);
                
            }, error=> {
                this.uiService.exercisesLoadedState.next(false);
                this.uiService.showSnackbar('fetching exercises failed please try again later', '', 3000)
                this.exerciseChanged.next(null);
            }))

    }
    //step3: from the exercise id we received we find out the current running exercise
    startExercise(selectedId: string) {
        // this.db.doc('availableExercises/'+ selectedId).update({lastSelected: new Date()})
        this.runningExercise = this.availableExercises.find(ex => {
            // console.log(selectedId);
            // console.log(ex.id == selectedId);
            return ex.id == selectedId
        })
        //step4: we emit the runningExercise value
        this.exerciseChanged.next({ ...this.runningExercise! })
    }
    // step 11: adding the exercise to database
    completeExercise() {
        this.addDataToDatabase({ ...this.runningExercise!, date: new Date(), state: 'completed' })
        this.runningExercise = null;
        this.exerciseChanged.next(null);

    }
    // step12: when the exercise is manually cancelled then put this data to the db.
    cancelExercise(progress: number) {
        this.addDataToDatabase({
            ...this.runningExercise!,
            duration: this.runningExercise!.duration * (progress / 100),
            calories: this.runningExercise!.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled'
        })
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    getRunningExercise() {
        return { ...this.runningExercise }
    }

    // when pastTrainingComponent loads then onInit this method is called and we emit the fetched value 
    // from the db using finishedExercisesChanged.next
    // fetchCompletedOrCancelledExercises() {
    //     //Use valueChanges() when you only need the data.
    //     this.fbSubs.push(this.db.collection<exercise>('finishedExercises').valueChanges()
    //         .subscribe((exercises: exercise[]) => {

    //             this.finishedExercisesChanged.next(exercises)
    //         }));
    // }

    fetchCompletedOrCancelledExercises() {

        const finishedExercisesRef = collection(
            this.db,
            'finishedExercises'
        );

        this.fbSubs.push(
            collectionData(finishedExercisesRef)
                .subscribe((exercises) => {
                    this.finishedExercisesChanged.next(
                        exercises as exercise[]
                    );
                })
        );
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(subs => {
            subs.unsubscribe();
        })
    }

    // private addDataToDatabase(exercise: exercise) {
    //     this.db.collection('finishedExercises').add(exercise)
    // }

    private addDataToDatabase(exercise: exercise) {

        const finishedExercisesRef = collection(
            this.db,
            'finishedExercises'
        );

         addDoc(
            finishedExercisesRef,
            exercise
        );
    }

}