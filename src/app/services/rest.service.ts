import { HttpConnectService } from './http-connect.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  private $dataStore = new BehaviorSubject<Todo[]>([]);
  public $TodosStore = this.$dataStore.asObservable();

  constructor(private _httpConnectService: HttpConnectService) { }

  getTodoList(): Observable<Todo[]> {
    return this._httpConnectService.fetchTodos()
      .pipe(
        catchError((error) => {
          throw new Error('An error occored: ', error);
        }),
        tap((response: Todo[]) => this.$dataStore.next(response))
      );
  }

  addTodo(param: Partial<Todo>): Observable<Todo> {
    return this._httpConnectService.addTodo(param)
      .pipe(
        catchError((error) => {
          throw new Error('An error occured: ', error);
        }),
        tap((response: Todo) => {
        })
      );
  }

  handleUpdateTodo(todo: Partial<Todo>): Observable<Todo> {
    return this._httpConnectService.fetchUpdateTodo(todo)
      .pipe(
        catchError((error) => {
          throw new Error('An error occured: ', error);
        }),
      );
  }

  handleDeleteTodo(id: number) {
    return this._httpConnectService.fetchDeleteTodo(id);
  }



}
