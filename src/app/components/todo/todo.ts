import { Component, inject } from '@angular/core';
import { ToDoService } from '../../services/to-do.service';

@Component({
  selector: 'app-todo',
  imports: [],
  templateUrl: './todo.html',
  styleUrl: './todo.scss'
})
export class Todo {
  todoService = inject(ToDoService); //первый способ подключения сервиса
  todo: string[] = this.todoService.getAll();
  // constructor(private todoService: ToDoService) { //второй способ подключения сервиса
  //   this.todo = this.todoService.getAll();
  // };
  constructor() {
    this.todoService.logTodo(this.todo)
  }
}
