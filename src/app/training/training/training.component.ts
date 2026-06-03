import { Component, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent {

  trainingService = inject(TrainingService);

  exerciseSubscription!: Subscription;
  ongoingTraining: boolean = false;

  ngOnInit() {
    // step5: from the emitted value we decide what to display on the UI
    this.exerciseSubscription = this.trainingService.exerciseChanged.subscribe(exercise=>{
      if(exercise){
        this.ongoingTraining = true;
      }else{
        this.ongoingTraining = false;
      }
      
    })
  }

  ngOnDestroy(){
    if(this.exerciseSubscription){
      this.exerciseSubscription.unsubscribe();
    }
  }


}
