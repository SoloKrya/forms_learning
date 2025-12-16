import { Component, EventEmitter, Input, Output } from '@angular/core';

//напишем интерфейс
interface User {
  name: string;
  email: string;
  age: number;
  isAdmin: boolean;
  photos: string[];
  address: UserAddress;
}

interface UserAddress {
  city: string;
  street: string;
  house?: number; //? здесь создает необязательное поле, позволяет ему быть андефайнд, эквивалент house: number | undefined;
}

//расширение интерфейса
interface BaseUser {
  id: number;
  email?: string;
}

interface AdminUser extends BaseUser { //для наследования нескольких интерфейсов - через запятую их
  role: 'admin';
  canBan: boolean;
}

const u: AdminUser = {
  id: 10,
  role: 'admin',
  canBan: true,
  // email — необязателен, можно не указывать
};

interface Animal {
  kind: string; // общий случай
}

interface Cat extends Animal {
  kind: 'cat';  // более конкретный литерал — нормально
}

//напишем тип
type Useressa = {
  name: string;
  email: string;
  age: number;
  isAdmin: boolean;
  photos: string[];
  address: UserAddress;
}

type UserRoles = "Admin" | "User"; //набор строк называется литерал
type Pare = [ number, string ]; //массив с типизированными позициями и фиксированной длиной называется кортеж
type Id = number | string; //строка или число

type ID = number | string; // или-или
type WithTimestamps = { createdAt: Date; updatedAt: Date };
type User1 = { id: ID; name: string } & WithTimestamps; // и-и (склейка полей) с интерфейсами так нельзя

type LoadState = //это дискриминируемое объединение
    { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'error'; message: string };

function render(state: LoadState) {
  if (state.kind === 'error') {
    // тут TS знает: state = { kind: 'error'; message: string }
    console.log(state.message); // ок
  } else {
    // тут вариантов два: 'idle' | 'loading'
    // message тут уже НЕЛЬЗЯ читать — и это хорошо (поймаем ошибки)
  }
}

interface A { id: number }
interface B { name: string }

// Вариант с interface:
interface C extends A, B { active: boolean }

// Вариант с type:
type C2 = A & B & { active: boolean }

interface C3 extends C2 { alive: boolean }

// Быстрый чек-лист «что писать type, а что interface»
// type Status = 'idle' | 'loading' | 'error' — type
// type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string } — type; T - дженерик, тип, сейчас неопределенный, но позднее определяемый
// interface User { id: number; name: string; email?: string } — interface
// type UserWithMeta = User & { roles: string[] } — type, т.к. используется пересечение

//примеры использования дженерика
function first1(arr: any[]): any {
  return arr[0];
}
const x = first1([1, 2, 3]); // x: any — подсказок нет

function first2<T>(arr: T[]): T {
  return arr[0];
}
const a = first2<number>([1, 2, 3]);        // a: number
const b = first2(['a', 'b']);       // b: string
const c = first2([{ id: 1 }]);      // c: { id: number }

function getId<T extends { id: number }>(x: T): number { //extends - наследование
  return x.id;
}
getId({ id: 1, name: 'Ann' }); // ок
// getId({ name: 'Nope' });    // ошибка: нет id

//пример использоваения типа unknown (безопасный any: тип присваивается любой, но до его определения недоступен объект или примитив)
function handle(v: unknown) {
  if (typeof v === 'string') {
    v.toUpperCase();     // ok: v теперь string
  } else if (Array.isArray(v)) { //Array.isArray() - проверка на массив, так как typeof на массив возвращает "объект"
    v.length;            // ok: v теперь any[]
  } else if (v && typeof v === 'object' && 'id' in v) {
    // v: { id: unknown } — уточняем дальше при необходимости
  }
}

@Component({ //ето декоратор
  selector: 'hui',
  imports: [],
  templateUrl: './test.html',
  styleUrl: './test.scss'
})
export class Test {
  @Output() helb = new EventEmitter();
  @Input() title = ""; //чтобы сделать инпут обязательным @Input({required: true})
  @Input({required: true}) item!: string[]; //! здесь создает переменную без значения; string здесь для статической типизации typeScript (оно компилируемое)
  name = 'Slava';
  user!: User;
  value!: Id;
  nechto!: any; //все типы данных
  count = 0;
  likeCounter() {
    this.count++;
    this.helb.emit(this.count);
  };
  logValue(value: string) {
    console.log(value)
  };
}

