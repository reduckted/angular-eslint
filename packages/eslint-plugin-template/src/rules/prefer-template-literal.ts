import {
  AST,
  LiteralPrimitive,
  TemplateLiteral,
  type Binary,
} from '@angular-eslint/bundled-angular-compiler';
import { ensureTemplateParser } from '@angular-eslint/utils';
import { createESLintRule } from '../utils/create-eslint-rule';
import {
  getLiteralPrimitiveStringValue,
  isLiteralPrimitive,
  isStringLiteralPrimitive,
} from '../utils/literal-primitive';
import { RuleFix, RuleFixer } from '@typescript-eslint/utils/ts-eslint';

const messageId = 'preferTemplateLiteral';

export type Options = [];
export type MessageIds = typeof messageId;
export const RULE_NAME = 'prefer-template-literal';

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Ensure that template literals are used instead of concatenating strings or expressions.',
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferTemplateLiteral:
        'Prefer using template literal instead of concatenating strings or expressions',
    },
  },
  defaultOptions: [],
  create(context) {
    ensureTemplateParser(context);
    const { sourceCode } = context;

    return {
      'Binary[operation="+"]'(node: Binary) {
        const { left, right } = node;

        const isLeftString =
          isStringLiteralPrimitive(left) || left instanceof TemplateLiteral;
        const isRightString =
          isStringLiteralPrimitive(right) || right instanceof TemplateLiteral;

        // If both sides are not strings, we don't report anything
        if (!isLeftString && !isRightString) {
          return;
        }

        const {
          sourceSpan: { start, end },
        } = node;

        function getQuote(): '"' | "'" | '`' {
          const leftValue = sourceCode.text.at(left.sourceSpan.start);
          if (leftValue === "'" || leftValue === '"') {
            return leftValue;
          }
          const rightValue = sourceCode.text.at(right.sourceSpan.start);
          if (rightValue === "'" || rightValue === '"') {
            return rightValue;
          }
          return '`';
        }

        context.report({
          loc: {
            start: sourceCode.getLocFromIndex(start),
            end: sourceCode.getLocFromIndex(end),
          },
          messageId,
          fix: (fixer) => {
            // If both sides are literals, we remove the `+` sign, escape if necessary and concatenate them
            if (
              left instanceof LiteralPrimitive &&
              right instanceof LiteralPrimitive
            ) {
              const quote = getQuote();
              return fixer.replaceTextRange(
                [start, end],
                `${quote}${getLiteralPrimitiveStringValue(left, quote)}${getLiteralPrimitiveStringValue(right, quote)}${quote}`,
              );
            }

            const fixes = new Array<RuleFix>();

            // Fix the left side
            fixes.push(...getLeftSideFixes(fixer, left));

            // Remove the `+` sign
            fixes.push(
              fixer.removeRange([left.sourceSpan.end, right.sourceSpan.start]),
            );

            // Fix the right side
            fixes.push(...getRightSideFixes(fixer, right));

            return fixes;
          },
        });
      },
    };
  },
});

function getLeftSideFixes(fixer: RuleFixer, left: AST): readonly RuleFix[] {
  const { start, end } = left.sourceSpan;

  if (left instanceof TemplateLiteral) {
    // Remove the end ` sign from the left side
    return [fixer.removeRange([end - 1, end])];
  } else if (isLiteralPrimitive(left)) {
    // Transform left side to template literal
    return [
      fixer.replaceTextRange(
        [start, end],
        `\`${getLiteralPrimitiveStringValue(left, '`')}`,
      ),
    ];
  } else {
    // Transform left side to template literal
    return [
      fixer.insertTextBeforeRange([start, end], '`${'),
      fixer.insertTextAfterRange([start, end], '}'),
    ];
  }
}

function getRightSideFixes(fixer: RuleFixer, right: AST): readonly RuleFix[] {
  const { start, end } = right.sourceSpan;

  if (right instanceof TemplateLiteral) {
    // Remove the start ` sign from the right side
    return [fixer.removeRange([start, start + 1])];
  } else if (isLiteralPrimitive(right)) {
    // Transform right side to template literal if it's a string
    return [
      fixer.replaceTextRange(
        [start, end],
        `${getLiteralPrimitiveStringValue(right, '`')}\``,
      ),
    ];
  } else {
    // Transform right side to template literal
    return [
      fixer.insertTextBeforeRange([start, end], '${'),
      fixer.insertTextAfterRange([start, end], '}`'),
    ];
  }
}
