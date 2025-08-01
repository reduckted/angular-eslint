import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import type {
  InvalidTestCase,
  ValidTestCase,
} from '@typescript-eslint/rule-tester';
import type {
  MessageIds,
  Options,
} from '../../../src/rules/no-interpolation-in-attributes';

const messageId: MessageIds = 'noInterpolationInAttributes';

export const valid: readonly (string | ValidTestCase<Options>)[] = [
  '<input type="text" [name]="foo">',
  '<input type="text" name="foo" [(ngModel)]="foo">',
  '<input type="text" [name]="foo + \'bar\'">',
  '<input type="text" [name]="foo | bar">',
  '<div>{{ content }}</div>',
  {
    options: [{ allowSubstringInterpolation: true }],
    code: `<img class="icon icon--{{size}}" alt="{{username}} is online" src="online.png">`,
  },
];

export const invalid: readonly InvalidTestCase<MessageIds, Options>[] = [
  convertAnnotatedSourceToFailureCase({
    description:
      'it should fail and autofix if interpolation is used as attribute value',
    annotatedSource: `
        <input type="text" name="{{ foo }}">
                                 ~~~~~~~~~
      `,
    messageId,
    annotatedOutput: `
        <input type="text" [name]="foo">
                                 
      `,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'it should fail and not autofix if interpolation is used as part of attribute value',
    annotatedSource: `
        <input type="text" name="{{ foo }}bar">
                                 ~~~~~~~~~~~~
      `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'it should fail and autofix the full attribute if interpolation is used as attribute value',
    annotatedSource: `
        <input type="text" attr.data-myExample="{{ foo }}">
                                                ~~~~~~~~~
      `,
    messageId,
    annotatedOutput: `
        <input type="text" [attr.data-myExample]="foo">
                                                
      `,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'it should fail and not autofix when interpolation is used as part of attribute value and this is explicitly configured as disallowed',
    annotatedSource: `
        <input type="text" name="{{ foo }}bar">
                                 ~~~~~~~~~~~~
      `,
    messageId,
    options: [{ allowSubstringInterpolation: false }],
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'it should fail and autofix if the entire value of an attribute is an interpolation when allowSubstringInterpolation is true',
    annotatedSource: `
       <img alt="{{username}} is online" src="{{src}}">
                                              ~~~~~~~
      `,
    messageId,
    options: [{ allowSubstringInterpolation: true }],
    annotatedOutput: `
       <img alt="{{username}} is online" [src]="src">
                                              
      `,
  }),
];
