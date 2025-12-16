import { Injectable } from '@angular/core';

@Injectable({ //именно эта штука с этим содержанием делает из класса сервис
  providedIn: 'root'
})
export class ToDoService {
  private todos = ['купить хлеб', 'выгулять собаку']; // публик приват и протектед: фича тайпскрипта. приват - только в текущем контексте. 
  // публик - по умолчанию принимается, доступен там, где есть. протектед - в текущем контексте и во всех дочерних

  getAll(): string[] {
    return this.todos;
  }

  add(todo: string): void {
    this.todos.push(todo);
  }
  
  formatTodo(i: number, title: string): string {
    return `${i + 1}. ${title}`;
  }

  logTodo(todo: string[]): void {
    todo.forEach( (item, i) => {
      console.log(this.formatTodo(i, item))
    });
  }
}
