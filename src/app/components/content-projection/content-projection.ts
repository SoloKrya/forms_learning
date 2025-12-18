import { Component } from '@angular/core';
import { Example } from './example/example';

@Component({
    selector: 'app-content-projection',
    imports: [Example],
    templateUrl: './content-projection.html',
    styleUrl: './content-projection.scss',
})
export class ContentProjection {}
