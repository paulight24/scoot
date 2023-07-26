import { UtilityService } from './services/utility.service';
import { TodoDetailsComponent } from './components/todo-details/todo-details.component';
import { RestService } from './services/rest.service';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddUserInputComponent } from './components/user-input/user-input.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { tap } from 'rxjs';
import { Todo } from './models/todo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Todo management application';

  dataSource!: MatTableDataSource<Todo>;
  displayedColumns: string[] = [
    'id',
    'dueDate',
    'description',
    'priority'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /** This gets the data from the json-server into an observable that will later be async | piped */
  $getTodos = this.restService.getTodoList().pipe(
    tap((res) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  );

  constructor(
    private _dialog: MatDialog,
    private restService: RestService,
    private utility: UtilityService
  ) { }

  /** This opens a dialog when the user clicks open dialog button, 
   * it will both send and return data from the details page i.e 
   * the child component called `TodoDetailsComponent`
   **/
  openDetailsPage(row: any) {
    const dialogRef = this._dialog.open(TodoDetailsComponent, {
      data: { row }
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        this.dataSource.data = this.dataSource.data;
      },
    });
  }

  /** This opens a dialog when the user clicks open dialog button, 
   * it will both send and return data from the add input command 
   * page i.e the child component called `AddUserInputComponent`
   **/
  openAddCommandForm() {
    const dialogRef = this._dialog.open(AddUserInputComponent, {
      data: { sentiments: this.dataSource.data }
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        this.dataSource.data = this.dataSource.data;
      },
    });
  }

  deleteTodo(row: Todo) {
    this.restService.handleDeleteTodo(row.id)
      .subscribe({
        next: (res) => {
          console.log('res: ', res);
          this.utility.openSnackBar('Successfully deleted todo!');
          // reload page
          this.utility.reloadPage();
        }
      });
  }

  editTodo(row: Todo) {
    const dialogRef = this._dialog.open(AddUserInputComponent, {
      data: { todo: row }
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        this.dataSource.data = this.dataSource.data;
      },
    });

  }

  // Filters table data 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
