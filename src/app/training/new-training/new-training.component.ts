import { Component, EventEmitter, inject, Output } from '@angular/core';
import { TrainingService } from '../training/training.service';
import { exercise } from '../training/exercise.model';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators'
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent {

  exercises!: exercise[];
  trainingService = inject(TrainingService);
  uiService = inject(UIService);
  exerciseSubscription!: Subscription;
  isExerciseValueLoaded = false;


  // @Output()
  // trainingStart: EventEmitter<void> = new EventEmitter();

  // step2:
  // On Start of an exercise the form is  submitted and this method onstartTraining() is called and passes the exercise id
  onstartTraining(form: NgForm) {
    // this.trainingStart.emit();
    console.log(form.value.exercise);

    this.trainingService.startExercise(form.value.exercise)
  }

  ngOnInit() {
    // this.exercises = this.trainingService.getAvailableExerciese();

    this.uiService.exercisesLoadedState.subscribe(value => {
      this.isExerciseValueLoaded = value;
    })
    // step1: on init we fetch all the collection data from the db and emit it using exercisesChanges
    this.fetchExercises();

    this.exerciseSubscription = this.trainingService.exercisesChanges
      .subscribe((exercises: exercise[]) => {
        this.exercises = exercises;
        // this.uiService.exercisesLoadedState.next(false);
      });
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExerciese();
  }
  ngOnDestroy() {
    if(this.exerciseSubscription)
   { this.exerciseSubscription.unsubscribe();}
  }

}
