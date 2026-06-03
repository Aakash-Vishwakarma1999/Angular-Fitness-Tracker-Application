import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StopTrainingComponent } from './stop-training.component';
import { TrainingService } from '../training/training.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})

// step6: this component loads based o the condition when it is true 
export class CurrentTrainingComponent {

  // @Output() trainingExit = new EventEmitter();
  progress: number = 0;
  timer!: number;

  constructor(private dialog: MatDialog, private trainingService: TrainingService) {

  }

  ngOnInit() {
    this.startOrResumeTimer()
  }
// step7: we fetch the current running exercise and set the progress value to be displayed on the UI
  startOrResumeTimer() {
    const step = this.trainingService.getRunningExercise().duration! / 100 * 1000;

    this.timer = setInterval(() => {
      this.progress = this.progress + 1;
// step8: if the progress reaches 100 then we call this method completeExercise()
      if (this.progress >= 100) {
        this.trainingService.completeExercise();
        clearInterval(this.timer);
      }
    }, step);
  }

  // step9: on click of this we open the StopTrainingComponent which is a dialog component
  onStop() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
    })
// step10: after selecting the option of the dialog page if we select yes i.e it is true
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        // this.trainingExit.emit()
        this.trainingService.cancelExercise(this.progress);
      } else {
        this.startOrResumeTimer()
      }

    })
  }

}
