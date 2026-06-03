import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { exercise } from '../training/exercise.model';
import { TrainingService } from '../training/training.service';
import { MatSort } from '@angular/material/sort';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent {

  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];

  dataSource = new MatTableDataSource<exercise>();
  private exchangedSubscription!: Subscription;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.trainingService.fetchCompletedOrCancelledExercises();
    this.exchangedSubscription = this.trainingService.finishedExercisesChanged.subscribe((exercises: exercise[]) => {
      this.dataSource.data = exercises.map((exercise) => ({
        ...exercise,
        date: (exercise.date as any)?.toDate()
      }));


    })
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: Event) {
    // console.log(filterValue);

    this.dataSource.filter = (filterValue.target as HTMLInputElement).value.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.exchangedSubscription.unsubscribe();
  }

}
