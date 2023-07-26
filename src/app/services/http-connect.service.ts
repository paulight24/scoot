import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class HttpConnectService {
  server: string = 'http://localhost:3000/todos';
  constructor(private http: HttpClient) { }

  fetchTodos(): Observable<Todo[]> {
    return this.http.get(this.server) as Observable<Todo[]>;
  }

  addTodo(data: Partial<Todo>): Observable<Todo> {
    return this.http.post(this.server, data) as Observable<Todo>;
  }

  fetchUpdateTodo(data: Partial<Todo>) {
    return this.http.patch(`${this.server}/${data?.id}`, data) as Observable<Todo>;
  }

  fetchDeleteTodo(id: number) {
    return this.http.delete(`${this.server}/${id}`);
  }
}
