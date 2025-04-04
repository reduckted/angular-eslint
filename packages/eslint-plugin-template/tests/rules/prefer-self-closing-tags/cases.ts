import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import type {
  InvalidTestCase,
  ValidTestCase,
} from '@typescript-eslint/rule-tester';
import type {
  MessageIds,
  Options,
} from '../../../src/rules/prefer-self-closing-tags';

const messageId: MessageIds = 'preferSelfClosingTags';

export const valid: readonly (string | ValidTestCase<Options>)[] = [
  '<my-component type="text" [name]="foo">With some content</my-component>',
  '<my-component />',
  `
    <my-component
      *ngIf="condition"
      type="text"
      [name]="foo"
      [items]="items" />
  `,
  '<img />',
  '<img src="foo" *ngIf="condition" />',
  // These elements cannot be self-closing
  '<slot></slot><math></math><rb></rb><svg></svg><template></template>',
  '<div></div>',
  '<div *ngIf="condition"></div>',
  '<th scope="col"></th>',
  '<th *ngIf="condition" scope="col"></th>',
  '<ng-template/>',
  '<ng-template>Content</ng-template>',
  '<ng-content/>',
  '<ng-content select="my-selector" />',
  `<ng-content>Fallback content</ng-content>`,
  `<ng-content>&nbsp;</ng-content>`,
  `<ng-content> <!-- comment --> </ng-content>`,
  `<ng-content
     select="content"
   >
    <p>Fallback content</p>
  </ng-content>`,
  `<ng-content select="[slot='icon-only']">
    <ng-content select="[slot=text]" />
  </ng-content>`,
  `<ng-content select="[slot='foo>bar']" />`,
  `<ng-content select="[slot='foo>bar']">Fallback</ng-content>`,
  { code: '<app-root></app-root>', filename: 'src/index.html' },
  '<ng-container>&nbsp;</ng-container>',
  '<my-component>  <!-- not empty -->  </my-component>',
];

export const invalid: readonly InvalidTestCase<MessageIds, Options>[] = [
  convertAnnotatedSourceToFailureCase({
    description:
      'it should fail if an element has a closing tag but no content',
    annotatedSource: `
      <my-component></my-component>
                    ~~~~~~~~~~~~~~~
    `,
    messageId,
    annotatedOutput: `
      <my-component />
                    
    `,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'it should fail if an element with attributes has a closing tag but no content',
    annotatedSource: `
      <my-component *ngIf="condition" type="text" [name]="foo"></my-component>
                                                               ~~~~~~~~~~~~~~~
    `,
    annotatedOutput: `
      <my-component *ngIf="condition" type="text" [name]="foo" />
                                                               
    `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'it should fail if a multiline element has a closing tag but no content',
    annotatedSource: `
      <my-component
        type="text"
        [name]="foo"
        [items]="items">
      </my-component>
      ~~~~~~~~~~~~~~~
    `,
    annotatedOutput: `
      <my-component
        type="text"
        [name]="foo"
        [items]="items" />
      
    `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'it should fail if the opening and closing tag are on the same new line',
    annotatedSource: `
      <my-component
        type="text"
        [name]="foo"
        [items]="items"
      ></my-component>
       ~~~~~~~~~~~~~~~
    `,
    annotatedOutput: `
      <my-component
        type="text"
        [name]="foo"
        [items]="items"
      />
       
    `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description: 'it should fail on ng-template elements',
    annotatedSource: `
      <ng-template></ng-template>
                   ~~~~~~~~~~~~~~
    `,
    annotatedOutput: `
      <ng-template />
                   
    `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description: 'it should fail on ng-template elements with white spaces',
    annotatedSource: `
      <ng-template> </ng-template>
                    ~~~~~~~~~~~~~~
    `,
    annotatedOutput: `
      <ng-template />
                    
    `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description: 'it should fail on ng-content elements',
    annotatedSource: `
      <ng-content></ng-content>
                  ~~~~~~~~~~~~~
    `,
    annotatedOutput: `
      <ng-content />
                  
    `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description: 'it should fail on ng-content elements with selector',
    annotatedSource: `
      <ng-content
        selector="my-selector"
      ></ng-content>
       ~~~~~~~~~~~~~
    `,
    annotatedOutput: `
      <ng-content
        selector="my-selector"
      />
       
    `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description: 'it should fail on ng-content elements with a line break',
    annotatedSource: `
      <ng-content>
      </ng-content>
      ~~~~~~~~~~~~~
    `,
    annotatedOutput: `
      <ng-content />
      
    `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'it should fail on ng-content elements with no content and > in the selector',
    annotatedSource: `
      <ng-content select="foo>bar">
      </ng-content>
      ~~~~~~~~~~~~~
    `,
    annotatedOutput: `
      <ng-content select="foo>bar" />
      
    `,
    messageId,
  }),
];
