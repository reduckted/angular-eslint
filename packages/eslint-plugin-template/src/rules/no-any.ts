import {
  ImplicitReceiver,
  PropertyRead,
  ThisReceiver,
  KeyedRead,
  Call,
  AST,
} from '@angular-eslint/bundled-angular-compiler';
import { ensureTemplateParser } from '@angular-eslint/utils';
import { createESLintRule } from '../utils/create-eslint-rule';

export type Options = [];
export type MessageIds = 'noAny' | 'suggestRemoveAny';
export const RULE_NAME = 'no-any';
const ANY_TYPE_CAST_FUNCTION_NAME = '$any';

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: `The use of "${ANY_TYPE_CAST_FUNCTION_NAME}" nullifies the compile-time benefits of Angular's type system`,
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      noAny: `Avoid using "${ANY_TYPE_CAST_FUNCTION_NAME}" in templates`,
      suggestRemoveAny: `Remove ${ANY_TYPE_CAST_FUNCTION_NAME}`,
    },
  },
  defaultOptions: [],
  create(context) {
    ensureTemplateParser(context);
    const sourceCode = context.sourceCode;

    const isAnyCall = (node: Call): boolean => {
      if (!(node.receiver instanceof PropertyRead)) {
        return false;
      }

      if (node.receiver.name !== ANY_TYPE_CAST_FUNCTION_NAME) {
        return false;
      }

      if (
        !(
          // this.$any() is also valid usage of the native Angular $any()
          (
            node.receiver.receiver instanceof ThisReceiver ||
            node.receiver.receiver instanceof ImplicitReceiver
          )
        )
      ) {
        return false;
      }

      return true;
    };

    const reportAnyCall = (node: Call): void => {
      const { start, end } = node.sourceSpan;
      const nameSpan = (node.receiver as PropertyRead).nameSpan;

      context.report({
        messageId: 'noAny',
        loc: {
          start: sourceCode.getLocFromIndex(start),
          end: sourceCode.getLocFromIndex(end),
        },
        suggest: [
          {
            messageId: 'suggestRemoveAny',
            fix: (fixer) => [
              fixer.removeRange([nameSpan.start, nameSpan.end + 1]),
              fixer.removeRange([end - 1, end]),
            ],
          },
        ],
      });
    };

    /**
     * Handles KeyedRead.KeyedRead cases like
     * $any(attributeList)['NPSScore']['another']
     */
    const findAndReportAnyCalls = (node: AST): void => {
      if (node instanceof Call && isAnyCall(node)) {
        reportAnyCall(node);
      } else if (node instanceof KeyedRead) {
        findAndReportAnyCalls(node.receiver);
      }
    };

    return {
      [`Call[receiver.name="${ANY_TYPE_CAST_FUNCTION_NAME}"]`](node: Call) {
        if (!isAnyCall(node)) {
          return;
        }

        reportAnyCall(node);
      },
      KeyedRead(node: KeyedRead) {
        findAndReportAnyCalls(node);
      },
    };
  },
});
