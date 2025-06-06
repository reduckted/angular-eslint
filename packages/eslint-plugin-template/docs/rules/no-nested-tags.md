<!--

  DO NOT EDIT.

  This markdown file was autogenerated using a mixture of the following files as the source of truth for its data:
  - ../../src/rules/no-nested-tags.ts
  - ../../tests/rules/no-nested-tags/cases.ts

  In order to update this file, it is therefore those files which need to be updated, as well as potentially the generator script:
  - ../../../../tools/scripts/generate-rule-docs.ts

-->

<br>

# `@angular-eslint/template/no-nested-tags`

Denies nesting of <p> and <a> tags.

- Type: problem

<br>

## Rule Options

The rule does not have any configuration options.

<br>

## Usage Examples

> The following examples are generated automatically from the actual unit tests within the plugin, so you can be assured that their behavior is accurate based on the current commit.

<br>

<details>
<summary>❌ - Toggle examples of <strong>incorrect</strong> code for this rule</summary>

<br>

#### Default Config

```json
{
  "rules": {
    "@angular-eslint/template/no-nested-tags": [
      "error"
    ]
  }
}
```

<br>

#### ❌ Invalid Code

```html
<a><a></a></a>
   ~~~~~~~
```

<br>

---

<br>

#### Default Config

```json
{
  "rules": {
    "@angular-eslint/template/no-nested-tags": [
      "error"
    ]
  }
}
```

<br>

#### ❌ Invalid Code

```html
<p>@if(true) {<p></p>}</p>
              ~~~~~~~
```

<br>

---

<br>

#### Default Config

```json
{
  "rules": {
    "@angular-eslint/template/no-nested-tags": [
      "error"
    ]
  }
}
```

<br>

#### ❌ Invalid Code

```html
<a><div><div><div><div><div><div><div><div><div><div><div><div><div><div><div><div><div><div><div><div>
  <a>fail</a>
  ~~~~~~~~~~~
</div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></a>
```

</details>

<br>

---

<br>

<details>
<summary>✅ - Toggle examples of <strong>correct</strong> code for this rule</summary>

<br>

#### Default Config

```json
{
  "rules": {
    "@angular-eslint/template/no-nested-tags": [
      "error"
    ]
  }
}
```

<br>

#### ✅ Valid Code

```html
<a></a>
```

<br>

---

<br>

#### Default Config

```json
{
  "rules": {
    "@angular-eslint/template/no-nested-tags": [
      "error"
    ]
  }
}
```

<br>

#### ✅ Valid Code

```html
<a></a><a></a>
```

<br>

---

<br>

#### Default Config

```json
{
  "rules": {
    "@angular-eslint/template/no-nested-tags": [
      "error"
    ]
  }
}
```

<br>

#### ✅ Valid Code

```html
<p></p>
```

<br>

---

<br>

#### Default Config

```json
{
  "rules": {
    "@angular-eslint/template/no-nested-tags": [
      "error"
    ]
  }
}
```

<br>

#### ✅ Valid Code

```html
<p></p><p></p>
```

</details>

<br>
