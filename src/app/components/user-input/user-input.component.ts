import { UtilityService } from './../../services/utility.service';
import { RestService } from './../../services/rest.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Todo } from 'src/app/models/todo';

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.css']
})
export class AddUserInputComponent implements OnInit {
  constructor(
    private restService: RestService,
    private utility: UtilityService,
    private fb: FormBuilder,
    private _dialogRef: MatDialogRef<AddUserInputComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sentiments: Todo[] },
    @Inject(MAT_DIALOG_DATA) public todo: { todo: Todo }
  ) { }

  ngOnInit(): void {
    if (this.todo.todo) {
      this.form.patchValue({
        description: this.todo.todo.description,
        priority: this.todo.todo.priority,
        dueDate: this.todo.todo.dueDate
      });
      this.form.setValue({
        description: this.todo.todo.description,
        priority: this.todo.todo.priority,
        dueDate: this.todo.todo.dueDate
      });

    }
  }

  /** Create form using out of the box angular FormBuilder
   * Set the VALIDATOR TO REQUIRED - for catching errors
   */
  form: FormGroup = this.fb.group({
    description: ['', Validators.required],
    dueDate: ['', Validators.required],
    priority: ['', Validators.required]
  });

  // Getters
  get description() {
    return this.form.get('description');
  }

  get dueDate() {
    return this.form.get('dueDate');
  }

  get priority() {
    return this.form.get('priority');
  }

  /** This method is called when user hits submit 
   * Handles both POST (add todos) and PATCH(Update todos) requests
  */
  submit() {
    this.form.markAllAsTouched();
    if (
      !this.form.valid ||
      !this.form.controls['description']?.value ||
      !this.form.controls['priority']?.value ||
      !this.form.controls['dueDate']?.value
    ) {
      this.utility.openSnackBar('No input was added');
      this._dialogRef.close();
      return;
    }

    let param: Partial<Todo> = { ...this.form.value };

    if (this.todo?.todo?.id) {
      /** Update request: PATCH into database */
      this.restService.handleUpdateTodo({ id: this.todo?.todo?.id, ...param }).subscribe({
        next: (val: Todo) => {
          this.utility.openSnackBar('Todo successfully updated');
          this._dialogRef.close(val);
          this.utility.reloadPage();
        },
        error: (err: HttpErrorResponse) => {
          console.error(err); // Catch error
        },
      });
    } else {
      /** Post request: POST into database */
      this.restService.addTodo(param).subscribe({
        next: (val: Todo) => {
          this.utility.openSnackBar('Todo successfully added');
          this._dialogRef.close(val);
          this.utility.reloadPage();
        },
        error: (err: HttpErrorResponse) => {
          console.error(err); // Catch error
        },
      });
    }
  }

}
