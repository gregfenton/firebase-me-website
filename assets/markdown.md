
# Comprehensive Markdown Guide

## Headings

# H1 Heading
## H2 Heading
### H3 Heading
#### H4 Heading
##### H5 Heading
###### H6 Heading

## Emphasis

**Bold Text**

*Italic Text*

***Bold and Italic Text***

~~Strikethrough~~

## Lists

### Unordered List
- Item 1
  - Subitem 1.1
  - Subitem 1.2
- Item 2
- Item 3

### Ordered List
1. First item
2. Second item
3. Third item
   1. Subitem 3.1
   2. Subitem 3.2

### Task List
- [x] Completed task
- [ ] Incomplete task

## Links

[Inline Link](https://firebase.google.com)

[Reference Link][1]

[1]: https://firebase.google.com

## Images

![Alt Text](https://firebase.me/assets/images/icon.png)

![Reference Image][2]

[2]: /assets/images/logo.png

## Blockquotes

> This is a blockquote.
>
> Multiple lines are supported.

## Code

### Inline Code
`inline code`

### Code Block
```javascript
function sayHello() {
  console.log("Hello, World!");
}
```

### Fenced Code Block with Syntax Highlighting
```python
def say_hello():
    print("Hello, World!")
```

## Tables

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1    | Data 1   | Data 2   |
| Row 2    | Data 3   | Data 4   |

## Horizontal Rule

---

## Inline HTML

<div style="color: red;">This is a red text using inline HTML.</div>

## Escaping Characters

*This text is not italic*
\*This text is not italic\*

## Footnotes

Here is a simple footnote[^1].

[^1]: This is the footnote.

## Definition Lists

Term 1
: Definition 1

Term 2
: Definition 2

## Mathematical Expressions

Inline: \(E = mc^2\)

Block:
\$\$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
\$\$

## Emoji

:tada: :+1: :smile:

## Abbreviations

Markdown converts text to HTML.

*[HTML]: HyperText Markup Language

## Custom Containers

::: note
This is a note.
:::

::: warning
This is a warning.
:::

## Collapsible Sections

<details>
  <summary>Click to expand</summary>
  
  This is a collapsible section.
</details>

## Videos

![Video](https://battle-hardened-cache.b-cdn.net/media/battle-studio.mp4)

## Custom IDs for Headers

### Header with Custom ID {#custom-id}

You can link to [this header](#custom-id).

## Anchor Links

[Link to top](#comprehensive-markdown-guide)


## Custom Markdown++

to make sure certain aspects are available to us without breaking existing markdown, we provide grouped behaviours

### BreadCrumb
{\{crumb:Name of Crumb}}
{{crumb:Name of Crumb}}

### grouped code blocks
{{group:code}}
```js
javascript goes here
```
```dart
dart goes here
```
```py
python goes here
```
{{endgroup}}

### Stylings
{{group:center}}
Centers all content vertically
![Alt Text](/assets/images/icon.png)
![Alt Text](/assets/images/icon.png)
![Alt Text](/assets/images/icon.png)
{{endgroup}}

{{group:carousel}}
Aligns all images horizontally
![Alt Text](/assets/images/icon.png)
![Alt Text](/assets/images/icon.png)
![Alt Text](/assets/images/icon.png)
other content
### breaks carousel
![Alt Text](/assets/images/icon.png)
![Alt Text](/assets/images/icon.png)
![Alt Text](/assets/images/icon.png)
![Alt Text](/assets/images/icon.png)
![Alt Text](/assets/images/icon.png)
{{endgroup}}