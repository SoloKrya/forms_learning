import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Test } from './test/test';
import { Todo } from './components/todo/todo';
import { TemplateDrivenForm } from './components/template-driven-form/template-driven-form';
import { ReactiveForm } from './components/reactive-form/reactive-form';
import { RadioButtonForm } from './components/radio-button-form/radio-button-form';
import { CheckBoxForm } from './components/check-box-form/check-box-form';
import { CartForm } from './components/cart-form/cart-form';
import { ContentProjection } from './components/content-projection/content-projection';

@Component({
    selector: 'app-root',
    // imports: [RouterOutlet, Todo, TemplateDrivenForm, ReactiveForm, RadioButtonForm, CheckBoxForm, CartForm],
    imports: [RouterOutlet, CartForm, ContentProjection],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    protected readonly title = signal('test-project');
    myTitle = 'sahgdjhg asdgsagdj asjdgsagdsagdj';
    onLikeCounterChanged(newCount: number) {
        console.log(newCount);
    }
}
