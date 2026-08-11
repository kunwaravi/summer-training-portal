// ============================================================================
// Web Design & Frontend Development — Deep GfG-Style Curriculum (issue #99)
// ----------------------------------------------------------------------------
// Hand-written, original content. Each section carries 4–5 deep sub-topics
// (substantive teaching text + working code + a real-world note) and a set of
// distinct quizzes: 4 options, exactly one correct, including code-trace
// questions. Replaces the machine-generated template quizzes from seed.ts.
//
// Structure is intentionally plain so a reseed script can iterate it directly.
// ============================================================================

export interface WDTopic {
  title: string;
  text: string; // Markdown body (GfG-style explanation)
  code: string; // Working, copyable example
  note: string; // Short real-world / exam-oriented takeaway
}

export interface WDQuiz {
  text: string;
  options: string[]; // exactly 4
  correctAnswer: string; // one of options
}

export interface WDSection {
  week: number;
  title: string;
  description: string;
  topics: WDTopic[];
  quizzes: WDQuiz[];
}

export const webdesignSections: WDSection[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 1 — Introduction to HTML5 & Web Fundamentals
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 1,
    title: 'Introduction to HTML5 & Web Fundamentals',
    description:
      'How the web actually works under the hood, what HTML is for, and the anatomy of the elements you will write all day long.',
    topics: [
      {
        title: 'How the Web Works: Browsers, Servers & HTTP',
        text:
          'When you open a website, your **browser** (the client) sends a request over the internet to a **server** — a powerful computer that stores the site\'s files. The server replies with the files, and the browser turns them into the page you see.\n\nThe conversation happens using **HTTP** (HyperText Transfer Protocol), a simple request/response language. The two most common requests are:\n\n- **GET** — "please give me this resource" (fetching a page, an image, an API result).\n- **POST** — "here is data, please process it" (submitting a form, logging in).\n\nEvery response carries a **status code**. `200` means OK, `404` means the resource was not found, and `500` means the server itself broke. Your browser also has a **console** (F12 → Network tab) where you can watch every request and response in real time — the single most useful debugging skill for a frontend developer.\n\nHTML arrives as plain text; the browser then parses it, downloads any linked CSS and JavaScript, and renders the page. Everything you will learn in this course — HTML structure, CSS styling, JS behaviour — is a layer on top of this one request/response cycle.',
        code: '<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>Inspector</title>\n</head>\n<body>\n  <h1>Open F12, then reload this page.</h1>\n  <p>Watch the Network tab to see the GET request for this HTML file.</p>\n</body>\n</html>',
        note: 'Interview favourite: a 404 is NOT "the internet is broken" — it means the server answered "resource not found".',
      },
      {
        title: 'What Is HTML? Structure vs Presentation',
        text:
          'HTML (HyperText Markup Language) is the **structure** of a webpage — the skeleton. It decides what is a heading, what is a paragraph, what is a list, and what is a link. It does **not** decide colour, spacing, or animation; that is CSS (presentation). And it does not decide behaviour; that is JavaScript.\n\nKeeping the three layers separate is the core discipline of frontend development:\n\n- **HTML** = content + meaning (`<h1>` says "this is the most important heading").\n- **CSS** = how it looks (fonts, colours, layout).\n- **JS** = what it does (clicking, fetching, validating).\n\nHTML is **not a programming language** — it has no variables, no loops, no logic. It is a *markup* language: you mark up content with tags so a browser knows how to interpret it. If you see "HTML can compute 2 + 2", that is JavaScript doing the arithmetic inside an HTML page, not HTML itself.\n\nEvery HTML document is a tree of elements, and the browser exposes that tree to JavaScript as the **DOM** (Document Object Model). You will meet the DOM again in Section 12 — it is the bridge between your HTML structure and your interactive JavaScript.',
        code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Structure Only</title>\n</head>\n<body>\n  <h1>This is a heading (structure)</h1>\n  <p>This is a paragraph (structure). Colour and font come from CSS.</p>\n  <button type="button">Click behaviour comes from JavaScript.</button>\n</body>\n</html>',
        note: 'Exam point: HTML = structure, CSS = presentation, JS = behaviour. One-line answers love this separation.',
      },
      {
        title: 'Anatomy of an HTML Element',
        text:
          'An element is the building block of HTML. Most elements look like this:\n\n`<p class="intro">Hello world</p>`\n\nThat one line has four parts:\n\n1. **Opening tag** `<p>` — the element\'s name wrapped in angle brackets.\n2. **Attributes** `class="intro"` — extra information in name="value" form. The `class` attribute lets CSS target this element.\n3. **Content** "Hello world" — the text or nested elements inside.\n4. **Closing tag** `</p>` — the same name with a forward slash.\n\nSome elements are **void elements** — they have no content and no closing tag. `<br>` (line break), `<img>` (image), and `<input>` (form field) are the ones you will use most. For `<img>`, the `src` (source) and `alt` (alternative text) attributes are required — `alt` describes the image for screen readers and when the image fails to load.\n\nAttributes can be **boolean** — they are true just by being present, like `disabled` on a button. Elements can also **nest** inside each other, and nesting is what creates the document tree: `<ul><li>Item</li></ul>`. A very common beginner bug is mis-nesting — closing tags in the wrong order — which the browser silently "fixes" in surprising ways, so keep your nesting tidy and indented.',
        code: '<!-- Anatomy in action -->\n<p class="intro">A paragraph with a <strong>bold</strong> word inside.</p>\n<img src="logo.png" alt="EduNexus logo">\n<br>\n<button type="button" disabled>Cannot click me</button>',
        note: 'Common interview trap: <img> is void — it has no closing tag. Writing </img> is an error.',
      },
      {
        title: 'Your First HTML Page: DOCTYPE, head & body',
        text:
          'Every proper HTML5 page starts with the same skeleton. The very first line is `<!DOCTYPE html>` — it tells the browser "this is modern HTML5, render it in standards mode, not legacy quirks mode". Forgetting it triggers quirks mode, where the browser applies 20-year-old buggy rendering rules and your CSS behaves inconsistently.\n\nThe page then splits into two sections:\n\n- **`<head>`** — *invisible* metadata: the page title (shown on the browser tab), `charset` (how text is encoded — always UTF-8), the `viewport` meta tag (required for responsive mobile design), links to CSS files, and keywords/description for search engines.\n- **`<body>`** — everything *visible*: headings, paragraphs, images, forms, and your scripts.\n\nA `lang="en"` attribute on `<html>` tells assistive technology and search engines which language the content is in — a cheap accessibility win. Scripts are best placed at the end of `<body>` (or loaded with `defer`) so they do not block the page from painting while the browser downloads JavaScript.\n\nOnce you can write this skeleton from memory, you know the canvas every webpage is painted on. Everything else in Sections 2–8 is filling this skeleton with structure and style.',
        code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My First Page</title>\n</head>\n<body>\n  <h1>Hello, Web!</h1>\n  <p>This skeleton appears in every single page of this course.</p>\n</body>\n</html>',
        note: 'Always UTF-8: without the charset meta tag, emoji and Hinglish characters can render as garbage (mojibake).',
      },
    ],
    quizzes: [
      {
        text: 'Which protocol does a browser use to request a webpage from a server?',
        options: ['FTP', 'HTTP', 'SMTP', 'DNS'],
        correctAnswer: 'HTTP',
      },
      {
        text: 'The 404 status code means…',
        options: ['the server crashed', 'the resource was not found', 'the request succeeded', 'the page is forbidden'],
        correctAnswer: 'the resource was not found',
      },
      {
        text: 'HTML is best described as…',
        options: ['a programming language with variables and loops', 'a markup language that gives content structure', 'a styling language for colours and fonts', 'a database query language'],
        correctAnswer: 'a markup language that gives content structure',
      },
      {
        text: 'Which layer of a webpage is responsible for colour, spacing and layout?',
        options: ['HTML', 'JavaScript', 'CSS', 'HTTP'],
        correctAnswer: 'CSS',
      },
      {
        text: 'In `<img src="cat.png" alt="A sleeping cat">`, the `alt` attribute is used to…',
        options: ['make the image zoom on hover', 'describe the image for screen readers and fallback text', 'store the image file size', 'link the image to another page'],
        correctAnswer: 'describe the image for screen readers and fallback text',
      },
      {
        text: 'Which tag is written WITHOUT a closing pair?',
        options: ['<p>', '<div>', '<img>', '<h1>'],
        correctAnswer: '<img>',
      },
      {
        text: 'What does `<!DOCTYPE html>` tell the browser?',
        options: ['that the page contains a form', 'that this is HTML5 and to render in standards mode', 'the language of the page content', 'that JavaScript is allowed'],
        correctAnswer: 'that this is HTML5 and to render in standards mode',
      },
      {
        text: 'The `viewport` meta tag inside `<head>` is required for…',
        options: ['showing the page title on the tab', 'responsive design on mobile devices', 'compressing images', 'encrypting the connection'],
        correctAnswer: 'responsive design on mobile devices',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 2 — HTML Semantic Tags & Structure
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 2,
    title: 'HTML Semantic Tags & Structure',
    description:
      'Give your markup meaning with semantic elements, structure full pages with layout tags, and master text, links and media.',
    topics: [
      {
        title: 'Semantic vs Non-Semantic Elements',
        text:
          'A **semantic** element is one whose name describes its meaning. `<article>`, `<nav>`, `<footer>` and `<header>` all tell you (and a machine) what they contain. A **non-semantic** element — `<div>` and `<span>` — says nothing; a `<div>` is just a generic box.\n\nWhy does meaning matter? Three reasons:\n\n1. **Accessibility** — screen readers rely on landmarks like `<nav>` and `<main>` to let blind users jump between page regions.\n2. **SEO** — search engines use semantic structure to understand which content is the article, which is the menu, and which is the footer.\n3. **Maintainability** — `role="navigation"` on ten nested divs is far harder to read than a single `<nav>`.\n\nStart with semantic elements and only fall back to `<div>` when no element expresses the meaning — typically as a pure layout wrapper. A rule of thumb: if you can replace a `<div>` with `<header>`, `<main>`, `<footer>`, `<nav>`, `<article>`, `<section>` or `<aside>` and the page still makes sense, you have better markup.\n\nThis is the difference between "working code" and "good code" — and interviewers love asking you to name five semantic HTML5 elements.',
        code: '<!-- Semantic version -->\n<header>Site header</header>\n<nav>Primary menu</nav>\n<main>\n  <article>Blog post content</article>\n  <aside>Related links sidebar</aside>\n</main>\n<footer>Copyright line</footer>\n\n<!-- Non-semantic equivalent (harder to read, worse for SEO) -->\n<div>Site header</div>\n<div>Primary menu</div>\n<div>\n  <div>Blog post content</div>\n  <div>Related links sidebar</div>\n</div>\n<div>Copyright line</div>',
        note: 'Accessibility checkpoint: a page where the main content is inside <div> soup fails WCAG landmarks — semantic tags fix it for free.',
      },
      {
        title: 'Building a Page with Layout Landmarks',
        text:
          'A typical webpage has a repeating skeleton of **layout landmarks**: a header at the top, navigation, a main content area, and a footer at the bottom. HTML5 gives each one a dedicated tag:\n\n- **`<header>`** — introductory content: logo, tagline, sometimes the site nav.\n- **`<nav>`** — a block of navigation links. It should be reserved for *primary* navigation; a single link does not deserve `<nav>`.\n- **`<main>`** — the unique core content of the page. Use it **once** per page.\n- **`<section>`** — a thematic grouping, usually with a heading (like "Features").\n- **`<article>`** — a self-contained composition: a blog post, a forum reply, a news story. It should make sense on its own, even out of context.\n- **`<aside>`** — content tangentially related to the main content: a sidebar, a pull-quote, an author bio.\n- **`<footer>`** — closing info: copyright, contact, legal links.\n\nNested correctly, these tags form a document outline that assistive technology reads as a table of contents. The classic mistake is putting `<nav>` inside `<footer>` for a single "Back to top" link, or wrapping the entire page in one giant `<div>`.\n\nThink of the tags as named rooms in a house: `<main>` is the living room, `<header>` the porch, `<footer>` the garden gate.',
        code: '<body>\n  <header>\n    <h1>My Portfolio</h1>\n    <nav>\n      <a href="#about">About</a>\n      <a href="#projects">Projects</a>\n      <a href="#contact">Contact</a>\n    </nav>\n  </header>\n  <main>\n    <section id="about"><h2>About me</h2></section>\n    <section id="projects">\n      <h2>Projects</h2>\n      <article><h3>Weather App</h3></article>\n      <article><h3>Todo List</h3></article>\n    </section>\n  </main>\n  <footer>&copy; 2026 Kunwar Avi</footer>\n</body>',
        note: 'Rule to remember: <main> appears exactly ONCE per page — it marks the one-of-a-kind core content.',
      },
      {
        title: 'Headings, Paragraphs & Text Formatting',
        text:
          'Headings form the **outline** of your document, exactly like chapters in a book. HTML provides six levels: `<h1>` (most important, usually one per page) down to `<h6>`. Search engines and screen readers both read your heading hierarchy — jumping from `<h1>` straight to `<h4>` looks broken and hurts accessibility.\n\nBelow headings come paragraphs `<p>`. Inside them you can format inline text:\n\n- **`<strong>`** — important text (renders bold).\n- **`<em>`** — emphasised text (renders italic).\n- **`<mark>`** — highlighted text.\n- **`<small>`** — fine print like disclaimers.\n- **`<code>`** — inline code snippets.\n- **`<blockquote>`** — a quoted passage, with an optional `<cite>`.\n\nLists are a separate family: unordered `<ul>` (bullet points), ordered `<ol>` (numbered), and description lists `<dl>`. Each `<li>` is a list item. If you ever find yourself typing `1. Step` manually as text, you are doing it wrong — that is what `<ol>` is for, and it keeps numbering correct when you insert an item in the middle.\n\nHeadings are not for sizing text — never pick `<h3>` because you want small bold text. Pick the heading level that matches the *meaning*, then style the size with CSS. "Use headings by level, not by size" is a question that appears in almost every HTML interview.',
        code: '<h1>My First Blog Post</h1>\n<p>Published on <time datetime="2026-08-11">11 Aug 2026</time></p>\n\n<p>The quick brown fox <strong>jumps</strong> over the lazy dog.</p>\n<p>Use <em>emphasis</em> sparingly — it loses power if applied everywhere.</p>\n\n<ol>\n  <li>Open an editor</li>\n  <li>Write valid HTML</li>\n  <li>Preview in the browser</li>\n</ol>',
        note: 'SEO + a11y double point: exactly one <h1> per page, and never skip heading levels (h1 → h3 looks broken to screen readers).',
      },
      {
        title: 'Links, Images & Media',
        text:
          'The **anchor** tag `<a>` is what makes the web a *web* — a hyperlink to another page, another site, or a section of the same page.\n\n- External link: `<a href="https://example.com" target="_blank" rel="noopener">Visit</a>`.\n- Same-page anchor: `<a href="#contact">Contact</a>` jumps to the element with `id="contact"`.\n- Email: `<a href="mailto:hi@example.com">Write to me</a>`.\n\nThe `rel="noopener"` on `target="_blank"` links is a **security** habit: without it, the opened page can reach back and tamper with your page via `window.opener`. Every modern security checklist requires it.\n\n**Images** use `<img src="..." alt="...">`. The `src` can be a relative path (`images/logo.png`) or an absolute URL. The `alt` text is not optional decoration — it is required for accessibility and shows when the image breaks. Use the `loading="lazy"` attribute on images below the fold so the browser downloads them only when the user scrolls near them.\n\n**Media**: `<video>` and `<audio>` have `<source>` children and built-in `controls`. Always include `controls` — a video with no visible play button is a classic UX failure.',
        code: '<nav>\n  <a href="https://developer.mozilla.org" target="_blank" rel="noopener">\n    MDN Docs\n  </a>\n  <a href="#about">About section</a>\n  <a href="mailto:hello@edunexus.in">Email me</a>\n</nav>\n\n<img src="images/team.jpg" alt="The EduNexus team at a hackathon" loading="lazy">\n\n<video controls width="480">\n  <source src="intro.mp4" type="video/mp4">\n  Your browser does not support video.\n</video>',
        note: 'Security habit: every target="_blank" link gets rel="noopener" — otherwise the new tab can tamper with your page (reverse tabnabbing).',
      },
    ],
    quizzes: [
      {
        text: 'Which tag CARRIES meaning about its content?',
        options: ['<div>', '<span>', '<article>', '<b>'],
        correctAnswer: '<article>',
      },
      {
        text: 'How many <main> elements should a single page contain?',
        options: ['as many as needed', 'exactly one', 'at most two', 'zero — it is deprecated'],
        correctAnswer: 'exactly one',
      },
      {
        text: 'Which tag marks content that is tangentially related to the main content (like a sidebar)?',
        options: ['<footer>', '<section>', '<aside>', '<header>'],
        correctAnswer: '<aside>',
      },
      {
        text: 'Pick the markup that creates a NUMBERED list:',
        options: ['<ul><li>One</li></ul>', '<ol><li>One</li></ol>', '<list type="1">One</list>', '<dl><li>One</li></dl>'],
        correctAnswer: '<ol><li>One</li></ol>',
      },
      {
        text: 'Why must heading levels never be skipped (e.g. <h1> then <h3>)?',
        options: ['the browser refuses to render them', 'screen readers and SEO read them as a document outline', 'it makes the page load slower', 'it triggers an HTML validator error that crashes the page'],
        correctAnswer: 'screen readers and SEO read them as a document outline',
      },
      {
        text: 'What does the `alt` attribute on <img> do?',
        options: ['zooms the image on hover', 'stores the image author name', 'provides alternative text when the image cannot be shown and for screen readers', 'sets the image compression level'],
        correctAnswer: 'provides alternative text when the image cannot be shown and for screen readers',
      },
      {
        text: 'For a link that opens in a new tab, why should you add `rel="noopener"`?',
        options: ['it makes the link open faster', 'it prevents the opened page from tampering with your page via window.opener', 'it forces HTTPS', 'it blocks pop-up blockers'],
        correctAnswer: 'it prevents the opened page from tampering with your page via window.opener',
      },
      {
        text: 'Which element is VOID (has no closing tag)?',
        options: ['<video>', '<article>', '<a>', '<input>'],
        correctAnswer: '<input>',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 3 — CSS Basics & Selectors
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 3,
    title: 'CSS Basics & Selectors',
    description:
      'Learn how CSS decides which rules win, and master the selectors that let you target any element precisely.',
    topics: [
      {
        title: 'How CSS Works: Cascade, Specificity & Inheritance',
        text:
          'CSS (Cascading Style Sheets) applies style rules to elements. The word **cascading** is the key: when several rules target the same element, the browser needs a deterministic way to pick the winner. Three mechanisms decide:\n\n1. **Source order** — with equal weight, the rule that appears LAST in the stylesheet wins.\n2. **Specificity** — a rule with a more specific selector beats a general one. Roughly: IDs (100) beat classes/attributes/pseudo-classes (10), which beat element/pseudo-element selectors (1). An ID wins over a class regardless of order.\n3. **`!important`** — overrides everything else, but it is a sledgehammer; overusing it creates unmaintainable stylesheets.\n\n**Inheritance** is different: certain properties (like `color` and `font-family`) are *inherited* — set them on a parent and children inherit the value automatically, unless a child sets its own. Box-model properties like `margin` and `padding` do **not** inherit.\n\nThe practical workflow for debugging a mysteriously-styled element: open DevTools, click the element, and read the **Styles** panel — it literally shows you every rule that applies and which one won. Almost every "why is my CSS not working?" moment is resolved there in ten seconds.',
        code: '/* Specificity: id (100) beats class (10) beats element (1) */\n#title { color: red; }        /* 100  */\n.card-title { color: blue; }   /* 10   */\nh1 { color: green; }           /* 1    */\n\n/* Winner on <h1 id="title" class="card-title"> is red. */',
        note: 'DevTools is the answer: the Styles panel shows exactly which selector won and why — read it before guessing.',
      },
      {
        title: 'Basic Selectors: Type, Class, ID & Grouping',
        text:
          'Selectors are how CSS chooses which elements to style. The three fundamental ones:\n\n- **Type selector** `h1 { }` — matches every element of that tag. Low specificity, applies broadly.\n- **Class selector** `.card { }` — matches every element with `class="card"`. Classes are *reusable* — you can have many cards, and one element can carry several classes (`class="card active"`).\n- **ID selector** `#hero { }` — matches the single element with `id="hero"`. IDs must be unique in a page, so they are great for unique sections and anchors, and bad for reusable styling.\n\n**Grouping** lets you share rules across selectors with a comma: `h1, h2, h3 { font-family: sans-serif; }` — one rule, three selectors, no repetition.\n\nA class is the workhorse of real-world CSS. Framework designers lean on classes heavily because they express *intent* (`.btn-danger` = "this button is dangerous") and can be recombined freely, while IDs lock you into one element.\n\nNaming matters: prefer `.card-title` over `.title`, and keep a consistent convention like BEM (`.block__element--modifier`) for large projects — predictability beats cleverness when the project has twenty pages.',
        code: '<h1 id="page-title">Dashboard</h1>\n<p class="lead">Welcome back, student.</p>\n<button class="btn">Save</button>\n<button class="btn btn-primary">Submit</button>\n\n<style>\n  #page-title { font-size: 2rem; }        /* unique → ID */\n  .lead { color: #64748b; }                /* reusable */\n  .btn { padding: 8px 16px; border-radius: 6px; }\n  .btn-primary { background: #2563eb; color: white; }\n  h1, h2, h3 { font-family: "Segoe UI", sans-serif; } /* grouping */\n</style>',
        note: 'Rule of thumb: use classes for anything reusable, reserve IDs for unique page anchors and single-instance sections.',
      },
      {
        title: 'Combinators & Attribute Selectors',
        text:
          'Combinators let you select elements by their **relationship** in the document tree:\n\n- **Descendant** (space): `.nav a` — every `<a>` inside `.nav`, at any depth.\n- **Child** (`>`): `.nav > a` — `<a>` that is a *direct* child of `.nav`.\n- **Adjacent sibling** (`+`): `h2 + p` — the `<p>` immediately after an `<h2>`.\n- **General sibling** (`~`): `h2 ~ p` — every `<p>` that follows an `<h2>` as a sibling.\n\nThe child combinator is the most common source of debugging confusion: `.nav a` styles links nested three levels deep too, while `.nav > a` only touches direct children. Choose deliberately.\n\n**Attribute selectors** match on attributes: `[type="text"]`, `[href^="https"]` (starts with), `[href$=".pdf"]` (ends with), `[class~="btn"]` (contains the word). They are perfect for styling inputs by type or flagging external links without touching the HTML.\n\nCombinators are also the natural way to express state with classes: `.menu .active` styles the active item, `.form.invalid input` highlights every field in an invalid form.',
        code: '<nav class="menu">\n  <a href="#">Home</a>\n  <ul>\n    <li><a href="#">About</a></li>  <!-- NOT a direct child -->\n  </ul>\n</nav>\n\n<style>\n  .menu > a { font-weight: bold; }        /* direct child only → Home */\n  .menu a { color: #0f172a; }              /* every link inside */\n  a[href^="https"]::after { content: " ↗"; }\n  input[type="email"] { border-color: #38bdf8; }\n  h2 + p { margin-top: 4px; }             /* paragraph right after h2 */\n</style>',
        note: 'The gap between .menu a and .menu > a is a classic job-test question — one styles all descendants, the other only direct children.',
      },
      {
        title: 'Pseudo-classes & Pseudo-elements',
        text:
          'Pseudo-classes style elements based on **state** or position — things that are not in the HTML. The most useful:\n\n- `:hover`, `:focus`, `:active` — mouse over, keyboard focus, press-and-hold. `:focus` is the accessibility-critical one: a button with no visible focus style is unusable for keyboard users.\n- `:first-child`, `:last-child`, `:nth-child(2)`, `:nth-of-type(odd)` — positional selection.\n- `:not(selector)` — everything except. `input:not([type="hidden"])` targets all visible inputs.\n- `:checked` — a ticked checkbox or radio.\n\n**Pseudo-elements** create *virtual elements* — they start with a double colon `::`:\n\n- `::before` / `::after` — insert generated content before/after an element. They are how icons, badges and decorative quotes are often drawn without extra HTML. They require a `content` property to exist at all.\n- `::first-letter`, `::first-line` — typographic effects.\n- `::placeholder` — style the placeholder text of an input.\n\nThe distinction is worth memorising for interviews: a pseudo-**class** is a single colon `:` and describes a state; a pseudo-**element** is a double colon `::` and acts like a phantom child element.',
        code: '<style>\n  .btn { background: #2563eb; color: white; }\n  .btn:hover { background: #1d4ed8; }   /* state: hovered */\n  .btn:focus { outline: 3px solid #93c5fd; } /* keyboard users */\n\n  .badge::after { content: " ★"; color: #f59e0b; } /* generated star */\n\n  li:nth-child(even) { background: #f8fafc; }      /* zebra rows */\n  p:not(.lead) { line-height: 1.6; }\n</style>\n\n<ul>\n  <li>Row 1</li><li>Row 2</li><li>Row 3</li>\n</ul>',
        note: 'Accessibility rule: never remove :focus outline without replacing it — keyboard users need to see where they are.',
      },
    ],
    quizzes: [
      {
        text: 'Two rules target the same element: `#title { color: red }` and `.card-title { color: blue }`. Which wins?',
        options: ['blue — it comes later', 'red — IDs have higher specificity than classes', 'they merge into purple', 'the browser picks randomly'],
        correctAnswer: 'red — IDs have higher specificity than classes',
      },
      {
        text: 'The child combinator selects…',
        options: ['every descendant at any depth', 'only direct children', 'only the first child', 'only the last child'],
        correctAnswer: 'only direct children',
      },
      {
        text: 'Which selector matches an `<input>` of type email?',
        options: ['input.email', 'input[type="email"]', 'email > input', 'input:email'],
        correctAnswer: 'input[type="email"]',
      },
      {
        text: 'Which CSS feature generates content before an element using `content`?',
        options: [':hover', ':focus', '::before', ':first-child'],
        correctAnswer: '::before',
      },
      {
        text: 'For a keyboard user, why is `:focus` styling important?',
        options: ['it speeds up page load', 'it shows where the keyboard is on the page', 'it changes the page language', 'it makes the page responsive'],
        correctAnswer: 'it shows where the keyboard is on the page',
      },
      {
        text: 'Which property IS inherited from a parent to its children by default?',
        options: ['margin', 'padding', 'color', 'border'],
        correctAnswer: 'color',
      },
      {
        text: 'What does `.menu a` (space) select?',
        options: ['only <a> that are direct children of .menu', 'every <a> inside .menu at any depth', 'the <a> immediately after .menu', 'the <a> with id="menu"'],
        correctAnswer: 'every <a> inside .menu at any depth',
      },
      {
        text: 'A pseudo-CLASS (single colon) describes…',
        options: ['a phantom child element', 'a state like hover or focus', 'a new HTML tag', 'a media query'],
        correctAnswer: 'a state like hover or focus',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 4 — CSS Box Model & Units
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 4,
    title: 'CSS Box Model & Units',
    description:
      'Master the box that every element becomes, control sizing with box-sizing, and choose the right unit for every job.',
    topics: [
      {
        title: 'The Box Model: content, padding, border & margin',
        text:
          'Every element on a webpage is rendered as a **rectangular box**. The box model is the set of layers that make up that rectangle, and understanding it is the difference between layouts that "just work" and layouts that mysteriously overflow.\n\nFrom inside out:\n\n1. **Content** — the actual text, image, or child element.\n2. **Padding** — transparent space *inside* the border, pushing content away from the edges. It has a background: paint the element and padding is coloured.\n3. **Border** — a visible or invisible edge around the padding.\n4. **Margin** — transparent space *outside* the border, pushing other elements away. Margins have no background.\n\nTwo behaviours trip beginners up constantly:\n\n- **Vertical margin collapse** — adjacent elements\' vertical margins do not stack; the *larger* one wins. `10px` under one box and `20px` above the next combine to `20px`, not `30px`.\n- **Width accounting** — by default `width: 200px` sets the *content* width, so the element actually takes `200 + padding + border` pixels. This surprises everyone, and it is exactly why `box-sizing` exists (next topic).',
        code: '<style>\n  .box {\n    width: 200px;\n    padding: 20px;   /* inside the border */\n    border: 4px solid #2563eb;\n    margin: 16px;    /* outside the border */\n  }\n</style>\n<div class="box">Content area</div>',
        note: 'The classic gotcha: width:200px + padding:20px on both sides = 240px rendered — the content box model counts only content.',
      },
      {
        title: 'Sizing & box-sizing',
        text:
          'The default `box-sizing: content-box` means `width` measures only the content — add padding and border and the element grows, breaking your carefully planned grid. The fix is `box-sizing: border-box`, where `width` includes content **plus** padding **plus** border, so the number you write is the number you get.\n\nThe modern, recommended reset is: `*, *::before, *::after { box-sizing: border-box; }`. Apply it once at the top of your stylesheet and every element throughout the project sizes predictably.\n\nTwo sizing pitfalls remain even with border-box:\n\n- **`min-width` / `max-width`** — a card that "should be 300px" but squeezes on small screens needs `max-width: 300px` with `width: 100%`, not a hard `width`. Hard widths cause horizontal scrolling on narrow phones.\n- **`height` traps** — never fix heights for text containers. Text length changes with viewport, font and user zoom; a hard `height` guarantees overflow or empty space. Use `min-height` and let content breathe.\n\nThink of `width` as "I want it at least this capable" rather than "I want it exactly this size". Flexibility is the entire game of responsive design.',
        code: '<style>\n  *, *::before, *::after { box-sizing: border-box; }\n\n  .card {\n    width: 100%;\n    max-width: 320px;   /* flexible up to a ceiling */\n    padding: 24px;\n    border: 1px solid #e2e8f0;\n    border-radius: 12px;\n  }\n\n  .sidebar {\n    min-height: 100px;  /* grows with content, never overflows */\n  }\n</style>\n<div class="card">A card that shrinks on mobile and stops at 320px.</div>',
        note: 'border-box on everything is the single highest-leverage CSS habit — adopt the universal reset on day one.',
      },
      {
        title: 'CSS Units: px, %, em, rem, vh & vw',
        text:
          'Choosing the right unit is a design decision, not a taste decision. The main options:\n\n- **`px`** — absolute, one CSS pixel. Great for borders, shadows, and fixed UI details. It is *not* responsive to the user\'s default font size.\n- **`%`** — relative to the parent. Perfect for widths: `width: 50%` is half the parent, no matter the viewport.\n- **`em`** — relative to the *element\'s own* font-size (or the parent for inherited properties). Compound: an `em` inside an `em` multiplies, which makes `em` sizing drift unpredictably.\n- **`rem`** — relative to the **root** font-size (usually 16px). `2rem` is always 32px regardless of nesting. Best choice for font sizes and most spacing.\n- **`vw` / `vh`** — percentages of the *viewport* (the visible window): `100vw` is the full window width, `50vh` half the height. Useful for full-screen hero sections, but watch for mobile scrollbars that change `vw` slightly.\n\nThe professional default: **`rem` for typography and spacing**, **`%` for layout widths**, **`px` for borders/shadows**, and **`vw/vh` for full-viewport moments** like heroes.\n\nThe hidden benefit of `rem`: a user who sets their browser to 20px default font gets a proportionally larger site automatically — accessibility for free.',
        code: '<style>\n  html { font-size: 16px; }\n\n  .hero {\n    min-height: 60vh;          /* 60% of viewport height */\n    padding: 2rem;             /* 32px, root-relative */\n  }\n\n  .title {\n    font-size: 2.5rem;         /* 40px, scales with user font setting */\n    padding-bottom: 0.5em;     /* relative to 40px = 20px gap */\n  }\n\n  .border-note {\n    border: 1px solid #cbd5e1; /* px is fine for hairlines */\n  }\n</style>',
        note: 'Interview favourite: rem is root-relative (16px default), em is element-relative — and em compounds when nested, rem does not.',
      },
      {
        title: 'Display Modes & Visibility',
        text:
          'The `display` property decides how a box behaves in the layout. The values you will use daily:\n\n- **`block`** — takes the full width available, starts on a new line. `<div>`, `<p>`, `<h1>` are block by default.\n- **`inline`** — flows within the line, ignores width/height, respects only horizontal padding/margin. `<span>`, `<a>`, `<strong>` are inline.\n- **`inline-block`** — flows inline (sits on a line with text) but *honours* width/height/margin like a block. Great for buttons in a row.\n- **`none`** — removes the element from the layout entirely; it takes no space and is gone.\n- **`flex` / `grid`** — switch the element into a layout container (Sections 5–6).\n\n`display: none` is different from `visibility: hidden` (the box keeps its space, just invisible) and from `opacity: 0` (still there, still clickable, just transparent). Choosing wrongly is a common source of "my element vanished" confusion:\n\n- Want it *gone* (layout reflows)? `display: none`.\n- Want it *hidden but occupying space*? `visibility: hidden`.\n- Want it *invisible but still interactive* (rare, for fancy reveals)? `opacity`.\n\nThe `display` property is also where you turn a `<div>` into a centering machine — `display: flex` + `align-items: center` + `justify-content: center` centers any child both ways in three lines.',
        code: '<style>\n  .inline-btn { display: inline-block; width: 120px; }\n  .gone { display: none; }         /* removes from layout */\n  .hidden { visibility: hidden; }  /* keeps space, invisible */\n  .fade { opacity: 0; }            /* invisible but clickable */\n\n  .center {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    height: 200px;\n  }\n</style>\n<div class="center">Perfectly centered content</div>',
        note: 'Exam contrast: display:none removes the box (space collapses); visibility:hidden keeps the space. Choose by whether the layout should reflow.',
      },
    ],
    quizzes: [
      {
        text: 'Which layer of the box model has NO background and pushes OTHER elements away?',
        options: ['padding', 'border', 'margin', 'content'],
        correctAnswer: 'margin',
      },
      {
        text: 'With the default `box-sizing: content-box`, a 200px-wide element with 20px padding renders at…',
        options: ['200px', '220px', '240px', '160px'],
        correctAnswer: '240px',
      },
      {
        text: 'Which unit is relative to the ROOT font size?',
        options: ['em', 'rem', 'px', '%'],
        correctAnswer: 'rem',
      },
      {
        text: 'Two adjacent boxes have vertical margins of 10px and 20px. How much space separates them?',
        options: ['30px', '10px', '20px', '15px'],
        correctAnswer: '20px',
      },
      {
        text: 'Which display value removes an element from the layout completely (no space left)?',
        options: ['visibility: hidden', 'opacity: 0', 'display: none', 'display: inline'],
        correctAnswer: 'display: none',
      },
      {
        text: 'Which display value sits inline with text BUT honours width and height?',
        options: ['inline', 'block', 'inline-block', 'none'],
        correctAnswer: 'inline-block',
      },
      {
        text: 'To let a card fill its container on mobile but never exceed 320px, use…',
        options: ['width: 320px', 'width: 100%; max-width: 320px', 'min-width: 320px', 'width: 320vw'],
        correctAnswer: 'width: 100%; max-width: 320px',
      },
      {
        text: 'What is the purpose of the universal reset `*, *::before, *::after { box-sizing: border-box; }`?',
        options: ['it makes all text bold', 'it makes width include padding and border so sizing is predictable', 'it removes all margins', 'it disables flexbox'],
        correctAnswer: 'it makes width include padding and border so sizing is predictable',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 5 — Flexbox & Modern Layouts
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 5,
    title: 'Flexbox & Modern Layouts',
    description:
      'One-dimensional layout done right: the flex axis model, alignment, growing and shrinking, and the centering patterns you will reuse daily.',
    topics: [
      {
        title: 'Flexbox: The Flex Container & the Main Axis',
        text:
          'Flexbox is a CSS layout mode for arranging items in **one dimension** — a row or a column. You create it by setting `display: flex` on a parent (the **flex container**); its direct children become **flex items**.\n\nThe model is built on two perpendicular axes:\n\n- **Main axis** — the direction items are laid out. Set by `flex-direction`: `row` (default, left to right), `column` (top to bottom), or the reversed variants `row-reverse` / `column-reverse`.\n- **Cross axis** — perpendicular to the main axis.\n\nAll the layout properties you will learn split along these two axes, which is why a diagram of the two arrows is the first thing to internalise. The container decides *direction and placement*; the items decide *size and flexibility*.\n\nBecause the container controls alignment, flexbox turns one of CSS\'s hardest historical problems — vertical centering — into a three-line rule: `display: flex; align-items: center; justify-content: center;`.\n\nA practical warning: flex only affects **direct children**. Wrap grandchildren in their own flex container if you need to lay them out too — a mistake beginners make is expecting nested elements to align under a grandparent\'s flexbox.',
        code: '<style>\n  .row {\n    display: flex;\n    flex-direction: row;      /* main axis: left → right */\n    gap: 12px;\n  }\n  .col {\n    display: flex;\n    flex-direction: column;   /* main axis: top → bottom */\n    gap: 8px;\n  }\n</style>\n<div class="row">\n  <span>A</span><span>B</span><span>C</span>  <!-- side by side -->\n</div>\n<div class="col">\n  <span>1</span><span>2</span>              <!-- stacked -->\n</div>',
        note: 'Memory hook: flex-direction:row = items in a row on the main axis; flex-direction:column = items stacked like a column.',
      },
      {
        title: 'Aligning on Both Axes: justify-content & align-items',
        text:
          'Two container properties control alignment, one per axis — and mixing them up is the #1 flexbox bug:\n\n- **`justify-content`** aligns along the **main** axis. Values: `flex-start` (default), `flex-end`, `center`, `space-between` (first item at start, last at end, equal gaps between), `space-around` (equal space around each), `space-evenly` (equal space everywhere).\n- **`align-items`** aligns along the **cross** axis. Values: `stretch` (default — items fill the cross size), `flex-start`, `flex-end`, `center`, `baseline`.\n\nThe mental model: **justify = main axis, align = cross axis**. When your items are not centering where you expect, the first thing to check is whether you used the right one for the axis you meant.\n\nA classic pattern uses both together — the "centered toolbar": `justify-content: space-between` pushes the logo left and the menu right, while `align-items: center` vertically centres them in the bar.\n\n`gap` (row and column spacing between items) is modern, supported everywhere, and replaces the old margin-hacking that caused doubled spacing at row edges. Prefer `gap` over per-item margins for spacing between flex items.',
        code: '<style>\n  .toolbar {\n    display: flex;\n    justify-content: space-between;  /* logo left, actions right */\n    align-items: center;             /* vertical centre */\n    padding: 0 1rem;\n  }\n  .centered {\n    display: flex;\n    justify-content: center;         /* main axis centre */\n    align-items: center;             /* cross axis centre */\n    height: 200px;\n  }\n</style>\n<div class="toolbar">\n  <span>Logo</span>\n  <nav><a href="#">Home</a> <a href="#">About</a></nav>\n</div>\n<div class="centered">Both-ways centred</div>',
        note: 'Recite this before every flexbox layout: justify = main axis, align = cross axis. Wrong axis is the classic bug.',
      },
      {
        title: 'Flex Items: grow, shrink, basis & order',
        text:
          'Flex items control their **size** through three intertwined properties:\n\n- **`flex-basis`** — the item\'s starting main-size (like a width on the main axis) before growing or shrinking. Default `auto` (uses the item\'s width/height).\n- **`flex-grow`** — how much spare space this item may *absorb*. `0` = never grow. `1` on every item = share spare space equally. `2` = absorb twice as much as a `1`.\n- **`flex-shrink`** — how much the item is willing to *give up* when space runs short. Default `1` (shrink proportionally); `0` = never shrink (can overflow).\n\nThe shorthand `flex: 1` means `flex: 1 1 0%` — grow, shrink, and start from zero basis — which is the "fill available space equally" workhorse used in thousands of sidebars and content columns. `flex: 0 0 auto` is the "keep natural size" setting.\n\n`order` re-sequences items visually without touching the HTML: lower `order` comes first. It is powerful but can make the DOM order (what screen readers read) differ from the visual order — use it sparingly and never for focus-critical content.\n\nThe classic two-column layout: a sidebar `flex: 0 0 240px` (fixed 240px, never grows or shrinks) next to a content area `flex: 1` (absorbs everything left over).',
        code: '<style>\n  .layout { display: flex; gap: 16px; }\n  .sidebar { flex: 0 0 240px; }   /* fixed 240px, no grow/shrink */\n  .content { flex: 1; }           /* grows to fill the rest */\n\n  .cards { display: flex; }\n  .cards article { flex: 1; }     /* three cards share space equally */\n  .cards article:nth-child(2) { order: -1; } /* move card 2 first */\n</style>\n<div class="layout">\n  <aside class="sidebar">Sidebar</aside>\n  <main class="content">Main content stretches</main>\n</div>',
        note: 'Flexbox interview classic: flex:1 === flex:1 1 0% (grow, shrink, zero basis) — it makes equal columns that all start from nothing.',
      },
      {
        title: 'Centering Patterns & Practical Layouts',
        text:
          'Flexbox turns layout into a kit of small, composable patterns. The ones worth memorising:\n\n1. **Perfect centering** — `display: flex; justify-content: center; align-items: center;` on a container. Used for hero text, loading spinners, and empty states.\n2. **Navbar** — `justify-content: space-between` with `align-items: center`: brand on the left, links on the right, vertically centred.\n3. **Card grid** — a container `display: flex; flex-wrap: wrap; gap: 1rem;` with cards `flex: 1 1 250px` (grow to fill, but wrap to a new row below 250px). This is a responsive grid without a single media query.\n4. **Sticky footer** — `body { display: flex; flex-direction: column; min-height: 100vh; }` and `main { flex: 1; }` so the footer is pushed to the bottom on short pages.\n5. **Equal-height columns** — the default `align-items: stretch` makes all siblings as tall as the tallest one. This is why card grids have aligned bottoms without extra work.\n\nThe power of these patterns is that they are **composable** — a navbar containing a centered group, which itself contains icons — each level solving one small problem.\n\nWhen a layout involves both rows *and* columns with tricky alignment, flexbox gets awkward — that is the signal to reach for **Grid**, the two-dimensional tool in Section 6.',
        code: '<style>\n  body {\n    display: flex;\n    flex-direction: column;\n    min-height: 100vh;   /* sticky footer trick */\n  }\n  main { flex: 1; }\n\n  .grid {\n    display: flex;\n    flex-wrap: wrap;\n    gap: 1rem;\n  }\n  .grid article {\n    flex: 1 1 250px;     /* responsive card grid, no media query */\n  }\n</style>\n<header>Navbar</header>\n<main class="grid">\n  <article>Card 1</article>\n  <article>Card 2</article>\n  <article>Card 3</article>\n</main>\n<footer>Footer pinned to bottom</footer>',
        note: 'flex: 1 1 250px cards = a responsive grid in one line: grow to fill, shrink gracefully, wrap onto new rows below 250px.',
      },
    ],
    quizzes: [
      {
        text: 'With `flex-direction: row`, which property controls horizontal placement of items?',
        options: ['align-items', 'justify-content', 'align-content', 'flex-direction'],
        correctAnswer: 'justify-content',
      },
      {
        text: '`display: flex; flex-direction: column` lays items out…',
        options: ['left to right', 'top to bottom', 'diagonally', 'in a circle'],
        correctAnswer: 'top to bottom',
      },
      {
        text: 'What does `flex: 1` shorthand mean in full?',
        options: ['flex: 1 0 auto', 'flex: 1 1 0%', 'flex: 0 1 auto', 'flex: 1 1 100%'],
        correctAnswer: 'flex: 1 1 0%',
      },
      {
        text: 'Which property re-sequences flex items visually without changing the HTML order?',
        options: ['order', 'z-index', 'position', 'float'],
        correctAnswer: 'order',
      },
      {
        text: 'To push a logo to the far left and a menu to the far right in a navbar, use…',
        options: ['align-items: space-between', 'justify-content: space-between', 'justify-content: flex-end', 'gap: auto'],
        correctAnswer: 'justify-content: space-between',
      },
      {
        text: 'A sidebar should stay exactly 240px and never grow or shrink. Which rule?',
        options: ['flex: 1', 'flex: 0 0 240px', 'flex: 1 1 240px', 'flex: 0 1 240px'],
        correctAnswer: 'flex: 0 0 240px',
      },
      {
        text: 'The default `align-items` value makes flex items…',
        options: ['overflow', 'stretch to the tallest sibling', 'collapse to nothing', 'wrap to a new line'],
        correctAnswer: 'stretch to the tallest sibling',
      },
      {
        text: 'A card grid that wraps onto new rows uses which container properties?',
        options: ['display: flex; flex-wrap: wrap; gap', 'display: grid; flex-direction: column', 'display: inline; gap', 'position: absolute; flex-wrap'],
        correctAnswer: 'display: flex; flex-wrap: wrap; gap',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 6 — CSS Grid, Transitions & Animations
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 6,
    title: 'CSS Grid, Transitions & Animations',
    description:
      'Two-dimensional layouts with Grid, smooth state changes with transitions, and self-running motion with keyframe animations.',
    topics: [
      {
        title: 'Grid Basics: tracks, lines & the template',
        text:
          'Grid is the **two-dimensional** layout tool — it arranges items in rows *and* columns at once, which is exactly the shape of most page layouts (a header, a sidebar, a main area, a footer).\n\nSet `display: grid` on a container, then define the tracks:\n\n- **`grid-template-columns: 200px 1fr`** — two columns: a fixed 200px one and a flexible one (`1fr` = one fraction of the remaining space).\n- **`grid-template-rows: auto 1fr auto`** — three rows sized to content, flexible, then content.\n- **`gap`** — spacing between tracks (replaces margins).\n\nThe `fr` unit is Grid\'s star: `1fr 2fr` splits space 1:2 — the second column gets twice the width of the first, always proportional regardless of container size. Mix fixed and flexible: `250px 1fr 1fr`.\n\nItems are placed automatically in row-major order — the first child goes in column 1 row 1, the next in column 2 row 1, and so on. You can also place explicitly with `grid-column: 1 / 3` (span from line 1 to line 3) and `grid-row`.\n\nGrid lines are numbered starting at 1, and the browser draws the boundaries between tracks. `grid-column: 1 / -1` spans the whole row — perfect for making a full-width header inside a grid page. When you have a whole-page skeleton, Grid is the right tool; when you have a row of items, Flexbox is simpler. Many pages use both.',
        code: '<style>\n  .page {\n    display: grid;\n    grid-template-columns: 220px 1fr;  /* sidebar + main */\n    grid-template-rows: auto 1fr auto; /* header, content, footer */\n    gap: 16px;\n    min-height: 100vh;\n  }\n  .page header { grid-column: 1 / -1; }  /* full width */\n  .page footer { grid-column: 1 / -1; }\n</style>\n<div class="page">\n  <header>Header spans the full width</header>\n  <aside>Sidebar (220px)</aside>\n  <main>Main content (1fr)</main>\n  <footer>Footer spans full width</footer>\n</div>',
        note: 'grid-column: 1 / -1 makes an item span every column — the standard trick for full-width headers and footers in a grid.',
      },
      {
        title: 'Grid Areas & Auto-Placement',
        text:
          'Named **grid areas** turn a layout into something you can read like ASCII art. Define areas on the container, then assign them with the `grid-area` property on each child:\n\n`grid-template-areas: "header header" "sidebar main" "footer footer";`\n\nEach row is a quoted string; each cell is an area name; repeating a name spans that area across the cells. A `.` means an empty cell. This is the most *readable* way to describe a whole-page layout — you can literally see the shape.\n\nGrid also handles placement you did not ask for via **auto-placement**: items flow into the next available cell in order. Auto-placement pairs beautifully with the `auto-fit` / `minmax` trick for responsive grids:\n\n`grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));`\n\nThis single line creates as many columns as fit, each at least 250px wide, growing to share the row. Shrink the window and columns wrap down — a fully responsive card grid with **zero media queries**. It is one of the most satisfying CSS features to demo.\n\n`repeat()` avoids typing the same track over and over — `repeat(3, 1fr)` is three equal columns. Combine the tools: `repeat(auto-fit, minmax(240px, 1fr))` is the professional default for grids of cards.',
        code: '<style>\n  .dash {\n    display: grid;\n    grid-template-columns: 240px 1fr;\n    grid-template-areas:\n      "header header"\n      "sidebar main"\n      "footer footer";\n    gap: 12px;\n  }\n  .dash header { grid-area: header; }\n  .dash aside  { grid-area: sidebar; }\n  .dash main   { grid-area: main; }\n  .dash footer { grid-area: footer; }\n\n  .cards {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n    gap: 16px;\n  }\n</style>\n<div class="cards">\n  <article>Card A</article><article>Card B</article>\n  <article>Card C</article><article>Card D</article>\n</div>',
        note: 'repeat(auto-fit, minmax(250px, 1fr)) = a self-wrapping responsive card grid. If you remember one Grid line, remember this one.',
      },
      {
        title: 'Transitions: property, duration & easing',
        text:
          'A **transition** animates a property when it *changes value* — hover a button and its background fades to the new colour instead of snapping. It has four parts:\n\n- **`transition-property`** — which property to animate (`background-color`, `transform`, `all`). Listing specific properties is more performant than `all`.\n- **`transition-duration`** — how long, e.g. `0.3s`.\n- **`transition-timing-function`** — the easing curve: `ease` (default), `linear`, `ease-in`, `ease-out`, `ease-in-out`, or `cubic-bezier(...)`. `ease-out` gives a snappy feel for hover states.\n- **`transition-delay`** — optional wait before starting.\n\nShorthand: `transition: background-color 0.3s ease;`\n\nThe property must be **animatable** for the transition to do anything. `background-color`, `color`, `opacity`, `transform` and `box-shadow` all animate smoothly. Layout properties like `margin`, `padding` and `width` animate too but cause **reflow** — the browser recomputes the whole page each frame, which janks the animation. The professional rule: animate `transform` and `opacity` for buttery motion, never `top`/`left`/`width`.\n\nThe state itself lives in the CSS: the base rule has the `transition`, and the hover/focus rule changes the property. The transition interpolates between the two values automatically.\n\nRespect users who prefer reduced motion: `@media (prefers-reduced-motion: reduce)` lets you disable decorative animations — an accessibility practice interviewers increasingly probe.',
        code: '<style>\n  .btn {\n    background: #2563eb;\n    transform: scale(1);\n    transition: background-color 0.2s ease, transform 0.2s ease;\n  }\n  .btn:hover {\n    background: #1d4ed8;\n    transform: scale(1.05);   /* transform animates without reflow */\n  }\n\n  @media (prefers-reduced-motion: reduce) {\n    .btn { transition: none; }\n  }\n</style>\n<button class="btn">Hover me</button>',
        note: 'Performance rule: animate transform and opacity only — animating width/height/top forces reflow and looks janky.',
      },
      {
        title: 'Keyframe Animations & Transforms',
        text:
          'Transitions react to a state change; **animations** run by themselves. Define a `@keyframes` block naming the animation and its **keyframes** (progress points), then apply it:\n\n```css\n@keyframes fadeIn {\n  from { opacity: 0; transform: translateY(8px); }\n  to   { opacity: 1; transform: translateY(0); }\n}\n.box { animation: fadeIn 0.6s ease-out forwards; }\n```\n\nThe `animation` shorthand sets the name, duration, timing, and more: `animation: name 1s ease infinite` repeats forever (spinners); `forwards` keeps the end state after finishing.\n\n**Transforms** are the engine under most smooth motion:\n\n- `translate(x, y)` — move (prefer over `top`/`left`).\n- `scale(n)` — resize (hover zooms).\n- `rotate(deg)` — spin.\n- `transform-origin` — the pivot point (default centre).\n\nMultiple transforms combine in one declaration: `transform: translate(10px, 10px) scale(1.1)`.\n\nAnimations versus transitions: use a **transition** when the motion is tied to a state change (hover, focus, toggle); use a **keyframe animation** when motion must start on page load or loop (hero entrance, loading spinner, background pulse).\n\nKeep animations short, subtle, and purposeful — a page where everything bounces feels cheap. And always respect `prefers-reduced-motion`, or your animation becomes an accessibility defect.',
        code: '<style>\n  @keyframes spin {\n    to { transform: rotate(360deg); }\n  }\n  .spinner {\n    width: 24px; height: 24px;\n    border: 3px solid #cbd5e1;\n    border-top-color: #2563eb;\n    border-radius: 50%;\n    animation: spin 0.8s linear infinite;\n  }\n\n  @keyframes slideUp {\n    from { opacity: 0; transform: translateY(20px); }\n    to   { opacity: 1; transform: translateY(0); }\n  }\n  .hero-in { animation: slideUp 0.7s ease-out both; }\n</style>\n<div class="spinner"></div>',
        note: 'Transition = reacts to a state change. Keyframe animation = runs on its own (load, loop). Choose accordingly.',
      },
    ],
    quizzes: [
      {
        text: 'Grid is best described as a layout system for…',
        options: ['one dimension only (a row)', 'two dimensions (rows and columns at once)', 'three-dimensional scenes', 'absolute pixel positioning'],
        correctAnswer: 'two dimensions (rows and columns at once)',
      },
      {
        text: 'In `grid-template-columns: 1fr 2fr`, the second column is…',
        options: ['twice the first column', 'half the first column', 'twice the viewport', '200px wide'],
        correctAnswer: 'twice the first column',
      },
      {
        text: 'Which declaration makes an item span every column in a grid?',
        options: ['grid-column: auto', 'grid-column: 1 / -1', 'grid-column: span 0', 'grid-column: 100%'],
        correctAnswer: 'grid-column: 1 / -1',
      },
      {
        text: '`grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))` produces…',
        options: ['exactly three fixed columns', 'as many ≥250px columns as fit, wrapping responsively', 'one 250px column', 'a single-row flexbox'],
        correctAnswer: 'as many ≥250px columns as fit, wrapping responsively',
      },
      {
        text: 'Which properties should you animate for smooth, reflow-free motion?',
        options: ['width and height', 'margin and padding', 'transform and opacity', 'top and left'],
        correctAnswer: 'transform and opacity',
      },
      {
        text: 'A spinner that loops forever uses which animation setting?',
        options: ['animation-iteration-count: 1', 'animation-iteration-count: infinite', 'animation-delay: infinite', 'animation-fill-mode: none'],
        correctAnswer: 'animation-iteration-count: infinite',
      },
      {
        text: 'A transition animates a property when…',
        options: ['the page first loads', 'the property changes value (e.g. hover)', 'the browser window resizes', 'the user scrolls'],
        correctAnswer: 'the property changes value (e.g. hover)',
      },
      {
        text: 'Which media query disables decorative motion for users who request reduced motion?',
        options: ['@media (max-width: 480px)', '@media (prefers-reduced-motion: reduce)', '@media (hover: none)', '@media (orientation: portrait)'],
        correctAnswer: '@media (prefers-reduced-motion: reduce)',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 7 — Responsive Design & Media Queries
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 7,
    title: 'Responsive Design & Media Queries',
    description:
      'Design for every screen: mobile-first thinking, breakpoint-driven media queries, fluid units, and the responsive patterns that scale.',
    topics: [
      {
        title: 'The Mobile-First Philosophy',
        text:
          'Responsive design means one page that adapts to every screen — from a 320px phone to a 4K monitor. The dominant strategy is **mobile-first**: design and write CSS for the smallest screen first, then add enhancements as the viewport grows.\n\nWhy mobile-first? Three practical reasons:\n\n1. **Constraints force clarity** — a phone has no room for decoration, so you decide what is truly essential.\n2. **Performance** — mobile CSS is the default; desktop is the progressive enhancement. Users on slow connections get the lean version.\n3. **Future-proofing** — new devices tend to be smaller or odd-shaped, and a mobile-first base degrades gracefully to anything.\n\nIn code, mobile-first means your base styles (no media query) target phones, and `@media (min-width: …)` blocks **add** layout for bigger screens. The alternative — desktop-first with `@media (max-width: …)` — is harder to maintain because you are constantly overriding on the way down.\n\nThe companion habit is designing in the browser: resize your DevTools to a phone width early, get the page working, then widen and layer on the layout. If you start on a desktop monitor and "shrink later", you end up with a desktop page full of hacks.',
        code: '/* Mobile-first: base styles are for phones */\n.cards { display: grid; grid-template-columns: 1fr; gap: 16px; }\n\n/* Tablet and up: two columns */\n@media (min-width: 640px) {\n  .cards { grid-template-columns: repeat(2, 1fr); }\n}\n\n/* Desktop and up: four columns */\n@media (min-width: 1024px) {\n  .cards { grid-template-columns: repeat(4, 1fr); }\n}',
        note: 'Mobile-first = base styles for phones, min-width queries ADD layout as screens grow. Min-width, not max-width.',
      },
      {
        title: 'Media Queries: Breakpoints & Syntax',
        text:
          'A **media query** applies CSS only when a condition about the environment is true. The syntax you will use most:\n\n`@media (min-width: 768px) { … }`\n\nCommon conditions:\n\n- `(min-width: …)` / `(max-width: …)` — viewport width. The core of responsive design.\n- `(min-height: …)` / `(max-height: …)` — viewport height (rarely needed).\n- `(orientation: landscape)` / `(orientation: portrait)` — for tablet orientation changes.\n- `(prefers-color-scheme: dark)` — dark mode.\n- `(prefers-reduced-motion: reduce)` — accessibility.\n- `(hover: hover)` — devices with a precise pointer (desktop) vs touch.\n\nBreakpoints are the widths where your layout changes. The "classic" trio is roughly `640px` (phone landscape / small tablet), `768px` (tablet), and `1024px` (desktop) — but copy the widths **from your content**, not from a chart. Build the layout, resize, and note where it breaks; that is your real breakpoint.\n\nA useful mental model: a breakpoint is a *contract* — "below 768px, the sidebar hides; at 768px and above, it appears". Document those contracts in comments so the next developer (or future you) knows why the number exists.\n\nAlso remember: media queries cascade like normal CSS, so order matters. With a mobile-first `min-width` strategy, write small widths first and larger widths after — the later, more-specific query wins at the shared boundary.',
        code: '@media (min-width: 768px) {\n  .sidebar { display: block; }  /* contract: sidebar appears at ≥768px */\n}\n\n@media (min-width: 1024px) {\n  .cards { grid-template-columns: repeat(4, 1fr); }\n}\n\n@media (prefers-color-scheme: dark) {\n  body { background: #0f172a; color: #e2e8f0; }\n}',
        note: 'Pick breakpoints from your content (where it actually breaks), not from a chart — and document the contract in a comment.',
      },
      {
        title: 'Fluid Units & Fluid Images',
        text:
          'Fixed pixels fight responsiveness. The responsive toolkit uses **fluid** units that scale with context:\n\n- Percentages and `fr` for layout widths — `width: 100%` follows the parent; `1fr` follows the grid.\n- `rem` for typography — scales with the root font size, so text stays readable and proportioned.\n- `clamp()` for fluid type — `font-size: clamp(1rem, 2vw, 2.5rem)` means "at least 1rem, ideally 2vw, at most 2.5rem". The headline grows with the viewport but never gets silly on a projector or unreadable on a phone. This one function removes many media-query font tweaks.\n- `min()` / `max()` for sizing decisions — `width: min(100%, 1200px)` caps a content container while letting it fill small screens.\n\n**Fluid images** are the classic pitfall: a wide image overflows a narrow phone. The two-line fix:\n\n`img { max-width: 100%; height: auto; }`\n\nNow every image shrinks to its container while keeping aspect ratio. Add `height: auto` — without it, the image keeps its fixed height and distorts when compressed.\n\nVideos and embeds need the same treatment (wrap them in a container with `max-width: 100%`). The goal: no horizontal scrollbar on any device, ever.',
        code: '<style>\n  .container {\n    width: min(100% - 2rem, 1200px); /* fills phone, caps at 1200px */\n    margin-inline: auto;\n  }\n\n  h1 { font-size: clamp(1.6rem, 4vw, 3rem); }\n\n  img {\n    max-width: 100%;   /* never overflow the parent */\n    height: auto;      /* keep the aspect ratio */\n  }\n</style>\n<img src="screenshot.png" alt="App screenshot">',
        note: 'img { max-width: 100%; height: auto; } is the mandatory image rule — it kills horizontal overflow on phones forever.',
      },
      {
        title: 'Responsive Patterns: nav, grids & cards',
        text:
          'Real pages are built from a handful of repeatable responsive patterns:\n\n1. **Collapsing navigation** — on desktop the menu links sit in a row; below a breakpoint they collapse behind a hamburger button toggled with JavaScript. The HTML stays the same; CSS hides/shows, JS toggles a class.\n2. **Multi-column → single-column grids** — `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))` or explicit media queries turn a 3-column desktop grid into a 1-column phone list. Cards naturally stack; content reorders by importance.\n3. **Fluid hero** — full-width hero with `min-height: 60vh`, text sized with `clamp()`, and a background image with `background-size: cover`.\n4. **Hide-on-mobile sidebar** — the sidebar `display: none` below a breakpoint, then `display: block` at `min-width`. Use a media query, not a JS check, so it works before JS loads.\n5. **Tables on mobile** — a wide table becomes a stacked list of label:value pairs, either via CSS (`display: block` on cells) or by rendering a second markup for small screens.\n\nThe through-line is **progressive disclosure**: show the most important content first, hide or restructure the rest below the breakpoint. Users on phones are not "getting less" — they are getting the *right slice* for a small screen.',
        code: '<style>\n  .menu { display: none; }              /* hidden on phone */\n  .menu-toggle { display: block; }\n\n  @media (min-width: 768px) {\n    .menu { display: flex; gap: 1.5rem; }  /* shown on desktop */\n    .menu-toggle { display: none; }\n  }\n</style>\n<nav>\n  <button class="menu-toggle" aria-label="Open menu">&#9776;</button>\n  <div class="menu">\n    <a href="#">Home</a><a href="#">Courses</a><a href="#">About</a>\n  </div>\n</nav>',
        note: 'Collapsing nav pattern: CSS hides/shows by breakpoint, JS only toggles a class for the hamburger — no JS = still usable.',
      },
    ],
    quizzes: [
      {
        text: 'The mobile-first strategy means…',
        options: ['designing for desktop and shrinking later', 'writing base CSS for phones, then adding layouts with min-width queries', 'using only pixel units', 'blocking desktop users'],
        correctAnswer: 'writing base CSS for phones, then adding layouts with min-width queries',
      },
      {
        text: 'Which query applies styles at 768px and WIDER?',
        options: ['@media (max-width: 768px)', '@media (min-width: 768px)', '@media (width: 768px)', '@media (max-height: 768px)'],
        correctAnswer: '@media (min-width: 768px)',
      },
      {
        text: 'The fluid-type function that sets a min, ideal, and max font size in one line is…',
        options: ['calc()', 'clamp()', 'var()', 'minmax()'],
        correctAnswer: 'clamp()',
      },
      {
        text: 'Which CSS stops images from overflowing a phone screen while keeping their shape?',
        options: ['img { width: 100%; height: 100%; }', 'img { max-width: 100%; height: auto; }', 'img { overflow: hidden; }', 'img { display: inline; }'],
        correctAnswer: 'img { max-width: 100%; height: auto; }',
      },
      {
        text: 'Why pick breakpoints from your content rather than a chart?',
        options: ['charts are inaccurate', 'each layout breaks at its own natural width', 'content is cheaper than charts', 'browsers ignore chart breakpoints'],
        correctAnswer: 'each layout breaks at its own natural width',
      },
      {
        text: 'A sidebar that appears only on desktop should be…',
        options: ['display: none by default; display: block inside a min-width query', 'always visible with overflow hidden', 'removed from the HTML on mobile', 'positioned absolutely'],
        correctAnswer: 'display: none by default; display: block inside a min-width query',
      },
      {
        text: 'In a mobile-first stylesheet, larger breakpoints should appear…',
        options: ['before the base styles', 'after the smaller ones, so later rules win at the shared width', 'in a separate file', 'only with !important'],
        correctAnswer: 'after the smaller ones, so later rules win at the shared width',
      },
      {
        text: 'The hamburger menu pattern relies on…',
        options: ['CSS to show/hide by breakpoint + JS to toggle the open class', 'JavaScript only', 'pure HTML attributes', 'server-side detection'],
        correctAnswer: 'CSS to show/hide by breakpoint + JS to toggle the open class',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 8 — Tailwind CSS Introduction
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 8,
    title: 'Tailwind CSS Introduction',
    description:
      'The utility-first workflow: atomic classes, spacing and color utilities, responsive prefixes, and keeping your customisation under control.',
    topics: [
      {
        title: 'Utility-First vs Component CSS',
        text:
          'Tailwind is a **utility-first** CSS framework: instead of writing named classes in a stylesheet and mapping them to elements, you compose **utility classes** directly in the HTML — `text-center`, `p-4`, `bg-blue-500`, `rounded-lg`.\n\nCompare the two approaches:\n\n- **Component CSS**: `.card { padding: 1rem; border-radius: 12px; box-shadow: … }` — the style lives in a stylesheet; changing it changes every card. Great when you want one true source, but naming and global coupling grow with the project.\n- **Utility CSS**: `<div class="p-4 rounded-xl shadow-md">` — every declaration is visible right where it is used. No naming decisions, no cross-file hunting, and you cannot accidentally reuse a class elsewhere and break it.\n\nUtility-first shines for iteration speed and consistent spacing/colour scales (you use the same `p-4` everywhere, so spacing stays uniform). Its main criticism is a *dense class attribute* — but the trade-off is deliberately accepted by most modern teams.\n\nThe practical hybrid: use utilities for layout and one-off styling, and extract *repeated* patterns into reusable components (in a framework like React) or `@apply` — but start with plain utilities. Tailwind does not replace knowing CSS — it *is* CSS, and it assumes you understand the box model, flexbox, and grid from Sections 3–7.',
        code: '<!-- Utility-first: the whole card style is inline in the class list -->\n<div class="max-w-sm p-6 bg-white rounded-xl shadow-md border border-slate-100">\n  <h3 class="text-lg font-semibold text-slate-800">Web Design</h3>\n  <p class="mt-2 text-sm text-slate-500">\n    A course in progress — Tailwind in use.\n  </p>\n</div>\n\n<!-- Same idea, component CSS (the .card rule lives in a .css file) -->\n<!-- <div class="card"> … </div> -->',
        note: 'Utility classes are atomic: p-6 sets padding once, rounded-xl sets one radius. No naming, no global leakage.',
      },
      {
        title: 'Core Utilities: Spacing, Color & Typography',
        text:
          'Tailwind\'s power comes from a **design scale** — every utility draws from a fixed set of values, which keeps your site visually consistent without effort.\n\n**Spacing** uses the `p`, `m`, and `gap` prefixes with a scale: `p-0` to `p-96` step in 0.25rem increments, plus fractions like `px-4` (horizontal padding) and `pt-2`. `p-4` is always 1rem — uniform rhythm everywhere. Negative margins work too: `-mt-2`.\n\n**Color** is a scale of every hue: `bg-blue-500`, `text-blue-600`, `border-blue-200`. Each color family runs `-50` (lightest) to `-950`. The `-500` middle is the "brand" value, `-600/-700` are hover/darker, `-100/-200` are subtle backgrounds. Hover and focus variants attach directly: `hover:bg-blue-600`, `focus:ring-2`.\n\n**Typography**: `text-sm`, `text-lg`, `text-2xl` size text on the `rem` scale; `font-semibold`/`font-bold` set weight; `text-slate-600` colors it; `leading-relaxed` sets line height. Alignment and decoration are utilities too: `text-center`, `uppercase`, `tracking-wide`.\n\nBecause every value is on a scale, you stop inventing arbitrary paddings and colors — the design system enforces itself. When you genuinely need a custom value, Tailwind allows it with square brackets: `p-[13px]`, `bg-[#123456]`. Use them sparingly.',
        code: '<div class="bg-slate-50 p-8 rounded-2xl">\n  <h2 class="text-2xl font-bold text-slate-900">Card title</h2>\n  <p class="mt-3 text-slate-600 leading-relaxed">\n    Spacing from the same scale, colors from the same palette —\n    the page stays consistent without a single custom style.\n  </p>\n  <button class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">\n    Learn more\n  </button>\n</div>',
        note: 'The scale is the design system: hover:bg-blue-700 attaches the hover state to the same color family — no extra CSS.',
      },
      {
        title: 'Layout Utilities: Flex, Grid & Responsive Prefixes',
        text:
          'Tailwind exposes all of Sections 5–7 as utilities:\n\n- **Flexbox**: `flex`, `items-center`, `justify-between`, `flex-col`, `gap-4`, `flex-1`, `flex-wrap`.\n- **Grid**: `grid`, `grid-cols-3`, `grid-cols-[200px_1fr]` (arbitrary), `col-span-2`, `gap-6`.\n- **Position**: `relative`, `absolute`, `fixed`, with `top-0`, `left-4`.\n- **Display**: `hidden`, `block`, `inline-flex`.\n\nThe responsive breakthrough is the **prefix system**: every utility has a `sm:`, `md:`, `lg:`, `xl:` variant that only applies at that breakpoint. They work exactly like the media queries from Section 7 — `md:` = `@media (min-width: 768px)` — but without writing a single query.\n\nA responsive grid is therefore one line:\n`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">`\n\nPhone: 1 column. Tablet: 2. Desktop: 4. The same pattern collapses the nav (`hidden md:flex`) and shows the hamburger (`md:hidden`) — the exact responsive patterns from Section 7, expressed inline.\n\nDefault breakpoints: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px. Because the strategy is mobile-first (`min-width`), write the base utility then add the prefixed variants in increasing order.',
        code: '<nav class="flex items-center justify-between p-4 bg-white border-b">\n  <span class="font-bold">EduNexus</span>\n  <div class="hidden md:flex gap-6">   <!-- hidden until md -->\n    <a href="#">Courses</a>\n    <a href="#">About</a>\n    <a href="#">Contact</a>\n  </div>\n</nav>\n\n<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">\n  <article class="p-4 border rounded-lg">Card</article>\n  <article class="p-4 border rounded-lg">Card</article>\n  <article class="p-4 border rounded-lg">Card</article>\n  <article class="p-4 border rounded-lg">Card</article>\n</div>',
        note: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 = the responsive grid of Section 7 in one class string. No media queries written.',
      },
      {
        title: 'Customisation & the Tailwind Workflow',
        text:
          'Tailwind ships as **CSS** and is built at compile time. Two common setups:\n\n- **Play CDN** — a `<script>` tag that scans your markup on the fly. Perfect for demos and small experiments; it generates all utilities dynamically but is heavy for production.\n- **Build pipeline** — the standard: a `tailwind.config.js` (or v4 CSS-first config) plus a build step that scans your source files and emits **only the classes actually used**. A real project\'s final CSS is often under 10 KB — one reason Tailwind is loved for performance.\n\nCustomisation happens in the config: add brand colors (`theme.extend.colors.brand`), fonts, breakpoints, and animations. In Tailwind v4 the config can be written directly in CSS with `@theme`.\n\nThree workflow rules keep utility CSS maintainable:\n\n1. **Extract repeated patterns** — when the same five-class combo appears ten times, that is a component: in React, make a `<Card>`; in plain HTML, `@apply` the utilities into one class.\n2. **Use the scale** — custom arbitrary values are allowed (`text-[13px]`) but constant overrides defeat the system\'s consistency.\n3. **Keep the scan config tight** — Tailwind only generates classes it finds in your files; make sure your config points at every HTML/JSX file, or classes silently vanish in production.\n\nTailwind is a productivity multiplier once the CSS fundamentals are solid — it is not a replacement for understanding them.',
        code: '<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <script src="https://cdn.tailwindcss.com"></script>\n</head>\n<body class="bg-slate-100 flex items-center justify-center min-h-screen">\n  <div class="bg-white p-8 rounded-2xl shadow-lg text-center">\n    <h1 class="text-2xl font-bold">Tailwind via CDN</h1>\n    <p class="mt-2 text-slate-500">Works instantly — try it.</p>\n  </div>\n</body>\n</html>',
        note: 'In production, Tailwind scans your source and ships only used classes — final CSS often under 10 KB.',
      },
    ],
    quizzes: [
      {
        text: 'What is Tailwind CSS?',
        options: ['JavaScript framework', 'utility-first CSS framework', 'build tool', 'database'],
        correctAnswer: 'utility-first CSS framework',
      },
      {
        text: '`p-4` in Tailwind sets…',
        options: ['padding on all sides to 1rem', 'padding-top to 4px', 'position to 4', 'page number 4'],
        correctAnswer: 'padding on all sides to 1rem',
      },
      {
        text: 'The `md:` prefix in `md:grid-cols-2` means…',
        options: ['two columns only on phones', 'the utility applies at the md breakpoint (768px) and up', 'two columns on every screen', 'the column is 2px wide'],
        correctAnswer: 'the utility applies at the md breakpoint (768px) and up',
      },
      {
        text: 'Which class hides an element by default but shows it from md up?',
        options: ['hidden md:block', 'block md:hidden', 'flex md:none', 'visible md:hide'],
        correctAnswer: 'hidden md:block',
      },
      {
        text: 'A responsive card grid in one class string is…',
        options: ['grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', 'flex grid-cols-4 gap-4', 'p-4 gap-4 grid-cols-1', 'grid-cols-responsive'],
        correctAnswer: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
      },
      {
        text: 'When you run a production build, Tailwind emits CSS for…',
        options: ['every utility in the framework', 'only the classes actually found in your source files', 'every class you define manually', 'only hover states'],
        correctAnswer: 'only the classes actually found in your source files',
      },
      {
        text: '`hover:bg-blue-700` means the background becomes blue-700…',
        options: ['when the page loads', 'when the mouse hovers over the element', 'when clicked', 'on mobile devices'],
        correctAnswer: 'when the mouse hovers over the element',
      },
      {
        text: 'Which class centers content along the cross axis in a flex container?',
        options: ['justify-center', 'items-center', 'mx-auto', 'align-middle'],
        correctAnswer: 'items-center',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 9 — JavaScript Basics, Variables & Types
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 9,
    title: 'JavaScript Basics, Variables & Types',
    description:
      'The language of behaviour: where JS runs, how to declare variables, the primitive types, and the coercion traps that trip everyone.',
    topics: [
      {
        title: 'What JavaScript Can Do & Where It Runs',
        text:
          'JavaScript is the **behaviour layer** of the web — the only programming language that browsers understand natively. It turns a static page into an application: validating a form, fetching data, animating a chart, updating a shopping cart without reloading.\n\nIt runs in two main places:\n\n- **In the browser** — scripts attached to an HTML page react to clicks, keyboard, and network events. The browser provides the **DOM API** (`document`) for touching the page and the **Web APIs** (`fetch`, `setTimeout`, `localStorage`) for the rest.\n- **On servers with Node.js** — the same language runs on the backend, handling HTTP requests, reading databases, and serving APIs. This course\'s own backend is Node.\n\n"Where do I put the code?" A `<script>` tag before `</body>` runs after the page loads; better, `defer` lets the browser download the script in parallel and run it after the HTML is parsed.\n\nJavaScript is **dynamic** — variables have no fixed type, functions are values you can pass around, and objects can gain properties at any time. That flexibility is powerful and also the source of most bugs, so the discipline of choosing types carefully (Sections 9–11) matters more here than in a statically-typed language.',
        code: '<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>JS Runs Here</title>\n</head>\n<body>\n  <button id="hello">Say hello</button>\n  <p id="out"></p>\n\n  <script>\n    const btn = document.getElementById("hello");\n    const out = document.getElementById("out");\n    btn.addEventListener("click", () => {\n      out.textContent = "Hello from JavaScript! " + (1 + 1);\n    });\n  </script>\n</body>\n</html>',
        note: 'JS = behaviour. The browser gives it document (DOM) + fetch + localStorage; Node gives it servers.',
      },
      {
        title: 'Variables: let, const & var',
        text:
          'Variables store values. Modern JavaScript offers three declaration keywords with different rules:\n\n- **`let`** — a variable you intend to reassign: `let count = 0; count += 1;`. Block-scoped: it lives only inside the braces where it is declared.\n- **`const`** — a variable that will not be *reassigned*. This is the default choice. Note: `const` does not make an object or array immutable — `const obj = {}; obj.name = "hi"` is fine; you just cannot point the name at a different object.\n- **`var`** — the old keyword. Function-scoped, hoisted, and reassignable everywhere. It leaks into surprising scopes and is the source of classic bugs; you will almost never need it in new code.\n\nWhy prefer `const`? Because it encodes *intent* and prevents accidents — the compiler stops you from reassigning something you meant to keep fixed. If you later find you need to reassign, change to `let` deliberately.\n\n**Naming** rules: identifiers start with a letter, `$`, or `_`; they are case-sensitive (`myVar` ≠ `myvar`); and the community convention is **camelCase** (`totalScore`). Meaningful names beat clever abbreviations — `timeoutId` beats `t`, always.\n\nA rule worth adopting: **use `const` by default, `let` when you must reassign, and never `var` in new code.**',
        code: 'const appName = "EduNexus";   // never reassigned\nlet score = 0;                 // will be updated\nscore += 10;                   // score = 10\n\nconst user = { name: "Avi" };  // const object…\nuser.name = "Kunwar";          // …but properties can change\n\n// var is legacy and leaks scope:\nif (true) { var leaky = "I escape!"; }\nconsole.log(leaky);            // "I escape!" — var ignores blocks',
        note: 'const by default, let when reassigning, var only in legacy code. const does not freeze objects — it only forbids reassignment.',
      },
      {
        title: 'Primitive Types: string, number, boolean & friends',
        text:
          'JavaScript has seven primitive types — the building blocks you will store in variables:\n\n- **`string`** — text: `"hello"`, `\'hi\'`, or backticks `` ` `` for template literals that interpolate values: `` `Hello ${name}` ``.\n- **`number`** — all numbers, integer or decimal, are one type. `NaN` (Not a Number) is the result of failed math like `"abc" * 2`, and `Infinity` from dividing by zero.\n- **`boolean`** — `true` / `false`, the result of comparisons.\n- **`null`** — the intentional "no value": `let choice = null;` means "deliberately empty".\n- **`undefined`** — a variable declared but never assigned: `let x;` gives `x` the value `undefined`.\n- **`bigint`** and **`symbol`** — rarer; bigint for numbers beyond 2^53, symbol for unique keys.\n\nThe classic confusion is `null` vs `undefined`: `null` is *assigned* to mean "empty on purpose"; `undefined` is the *default* for something never set. `typeof null` famously returns `"object"` — a long-standing language quirk worth knowing so it does not mislead you.\n\nEvery value also has a **boolean truthiness** for `if` conditions: `0`, `""`, `null`, `undefined`, `NaN`, and `false` are **falsy**; everything else — including `"0"` and `[]` — is **truthy**. This is the source of countless bugs: `if (userInput)` passes for an empty array but not an empty string.',
        code: 'const name = "Avi";\nconst age = 21;\nconst enrolled = true;\nconst progress = null;      // intentional: not started\nlet grade;                  // undefined\n\nconsole.log(`Name: ${name}, age: ${age}`); // template literal\n\nif (0) { /* falsy — never runs */ }\nif ([]) { /* truthy! — this DOES run */ }\n\nconsole.log(0 === false);   // false — types differ\nconsole.log(typeof null);   // "object" — famous quirk',
        note: 'Falsy list: 0, "", null, undefined, NaN, false. Everything else is truthy — including "0" and []. Memorize it; it prevents whole bug classes.',
      },
      {
        title: 'Type Coercion & Template Literals',
        text:
          'JavaScript converts types automatically — **coercion** — and that convenience hides traps. `"5" + 1` is `"51"` (the `+` concatenates strings) while `"5" - 1` is `4` (the `-` forces numbers). The `+` operator is the notorious one: if either side is a string, it concatenates.\n\nThe safer tools:\n\n- **Strict equality `===`** — compares *type and value*: `5 === "5"` is `false`. Always prefer it.\n- **Loose equality `==`** — coerces then compares: `5 == "5"` is `true`. Full of surprises; avoid.\n- **Explicit conversion** — say what you mean: `Number("5")`, `String(5)`, `Boolean(0)`. Explicit beats implicit every time.\n\n**Template literals** (backticks) are the modern way to build strings: `` const msg = `Score: ${score} out of ${total}`; `` — readable, no `+` chain, and you can embed multi-line text naturally.\n\nA practical coercion checklist for interview-style questions: `null == undefined` is `true` (loose), `null === undefined` is `false` (strict); `NaN === NaN` is `false` (NaN equals nothing, even itself — use `Number.isNaN(x)`); and `[1] == 1` is `true` (the array coerces to its string `"1"`).\n\nThe discipline: let data arrive as strings from inputs, then convert **once**, explicitly, at the boundary — and compare with `===` everywhere else.',
        code: 'console.log("5" + 1);    // "51" — string concat\nconsole.log("5" - 1);    // 4 — numeric coercion\nconsole.log(5 === "5");  // false — strict (type + value)\nconsole.log(5 == "5");   // true — loose (coerces) — avoid\nconsole.log(Number("7"));// 7 — explicit conversion\n\nconst score = 8, total = 10;\nconst msg = `You scored ${score}/${total}`; // template literal\n\n// NaN never equals itself:\nconsole.log(NaN === NaN); // false\nconsole.log(Number.isNaN(NaN)); // true',
        note: 'Use === always, convert explicitly with Number()/String(), build strings with template literals. That covers 90% of coercion bugs.',
      },
    ],
    quizzes: [
      {
        text: 'Which declaration keyword should you use by DEFAULT for a variable you never reassign?',
        options: ['var', 'let', 'const', 'static'],
        correctAnswer: 'const',
      },
      {
        text: 'What does `"5" + 1` evaluate to in JavaScript?',
        options: ['6', '"51"', 'NaN', 'undefined'],
        correctAnswer: '"51"',
      },
      {
        text: 'The value of `5 === "5"` is…',
        options: ['true', 'false', 'NaN', 'TypeError'],
        correctAnswer: 'false',
      },
      {
        text: 'Which of these is FALSY in JavaScript?',
        options: ['[]', '"0"', '0', '{}'],
        correctAnswer: '0',
      },
      {
        text: '`let x;` then `console.log(x)` prints…',
        options: ['null', 'undefined', 'NaN', '0'],
        correctAnswer: 'undefined',
      },
      {
        text: 'Which statement is TRUE about `const`?',
        options: ['it freezes objects, so their properties cannot change', 'it forbids reassigning the variable name', 'it is block-scoped only in strict mode', 'it can only hold primitives'],
        correctAnswer: 'it forbids reassigning the variable name',
      },
      {
        text: 'The correct way to interpolate a variable into a string is…',
        options: ['var msg = "Score: " . score', 'const msg = `Score: ${score}`', 'const msg = "Score: #score"', 'const msg = %s(score)'],
        correctAnswer: 'const msg = `Score: ${score}`',
      },
      {
        text: 'The result of `NaN === NaN` is…',
        options: ['true', 'false', 'undefined', 'throws an error'],
        correctAnswer: 'false',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 10 — JS Control Flow & Operators
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 10,
    title: 'JS Control Flow & Operators',
    description:
      'Comparisons and logic, branching with if/ternary/switch, and the four loop families that drive real programs.',
    topics: [
      {
        title: 'Comparison & Logical Operators',
        text:
          '**Comparison operators** produce a boolean: `>` `>=` `<` `<=` compare numbers; `===` and `!==` compare value and type (strict); `==`/`!=` are the loose, coercion-laden versions to avoid.\n\nTwo special cases: `NaN` equals nothing (`NaN === NaN` is false — use `Number.isNaN`), and objects/arrays compare by *reference*, so `[1,2] === [1,2]` is false — two different arrays are never equal, even with identical contents. To compare array contents you compare element by element.\n\n**Logical operators** combine booleans:\n\n- **`&&` (AND)** — `true` only if both sides are true. Also *returns a value*: `a && b` returns `a` if `a` is falsy, else `b`.\n- **`||` (OR)** — true if either is true. Returns `a` if `a` is truthy, else `b`. This makes `||` the classic **default-value** operator: `const name = input || "Guest";`.\n- **`!` (NOT)** — flips: `!true` is `false`.\n- **`??` (nullish coalescing)** — returns the right side only when the left is `null` or `undefined`. The modern alternative to `||` for defaults when you want to keep `0` and `""` as valid values: `const n = count ?? 10;` keeps `count = 0` as `0`.\n\nBecause `&&` and `||` return values, you can write neat guards: `user && renderProfile(user)` renders only when the user exists — a pattern you will see constantly in React.',
        code: 'const age = 17;\nconsole.log(age >= 18);      // false\n\nconst input = "";             // empty string is falsy\nconst name = input || "Guest"; // "Guest" — default value\n\nconst count = 0;\nconsole.log(count || 10);     // 10 — 0 is falsy!\nconsole.log(count ?? 10);     // 0 — ?? only triggers on null/undefined\n\nconst user = { name: "Avi" };\nuser && console.log(user.name);  // guard: runs only if user exists',
        note: '|| gives a default for falsy values (0, "" become the fallback); ?? gives a default only for null/undefined. Choose ?? when 0 is a real value.',
      },
      {
        title: 'Branching: if, else if, else & the ternary',
        text:
          'The `if` statement runs a block when a condition is truthy, `else if` chains further conditions, and `else` catches everything remaining:\n\n```js\nif (score >= 90) {\n  grade = "A";\n} else if (score >= 75) {\n  grade = "B";\n} else {\n  grade = "C";\n}\n```\n\nOrder matters — put the most specific conditions first. `score >= 90` must be tested before `score >= 75`, or every A student would match the B branch first.\n\nThe **ternary** operator is a compact one-line if/else for *choosing a value*:\n`const status = score >= 50 ? "Pass" : "Fail";`\n\nRead it as "condition ? value-if-true : value-if-false". Use it when the whole point is to pick one of two values and assign it. Nested ternaries (a ternary inside a ternary) become unreadable — if you need that, reach for `if/else` or a `switch`.\n\n**`switch`** compares one expression against several cases — cleaner than a long if/else chain when you are testing the *same* value against many possibilities (a day name, a status code). Every `case` needs a `break` (or `return`); forgetting it makes execution "fall through" into the next case — a classic bug.\n\nThe rule of thumb: single two-way value choice → ternary; multi-condition logic → if/else; same-value-many-cases → switch.',
        code: 'function gradeFor(score) {\n  if (score >= 90) return "A";\n  if (score >= 75) return "B";\n  return "C";\n}\n\nconst status = score >= 50 ? "Pass" : "Fail";\n\nfunction weekdayName(n) {\n  switch (n) {\n    case 1: return "Monday";\n    case 2: return "Tuesday";\n    default: return "Weekend or unknown";\n  }\n}',
        note: 'Most-specific-first: test score >= 90 before score >= 75, or A students hit the B branch first.',
      },
      {
        title: 'Loops: for, while, do-while & for-of',
        text:
          'Loops repeat work. JavaScript\'s four main families:\n\n- **`for`** — the counting loop, for a known number of repetitions:\n`for (let i = 0; i < 5; i++) { … }` — the three parts are init, condition, and update. `i++` increments by one.\n- **`while`** — repeats *while* a condition is true; the condition is checked **before** each iteration. Use it when you do not know how many iterations you need (keep retrying until success). Danger: if the condition never becomes false, you have an **infinite loop** that freezes the tab.\n- **`do…while`** — like `while`, but the body runs **once before** the condition is checked. Use it when the work must happen at least once.\n- **`for…of`** — iterates *values* of an array: `for (const item of items)`. This is the loop you will use most in modern code — no index bookkeeping, no off-by-one errors.\n\nAvoid `for…in` (it iterates object *keys*, including inherited ones) unless you specifically need keys. To loop over an object\'s keys, use `Object.keys(obj)` with `for…of`.\n\nTwo control keywords: **`break`** exits the loop entirely; **`continue`** skips the rest of the current iteration and moves to the next. A `break` inside a nested loop only exits the innermost loop.\n\nPractical guideline: prefer `for…of` for arrays, `for` with an index only when you need the position, and `while` for unknown-length repetition.',
        code: 'const items = ["HTML", "CSS", "JS"];\n\nfor (const item of items) {\n  console.log(item);      // values, no index math\n}\n\nfor (let i = 0; i < 3; i++) {\n  console.log("count", i); // index loop\n}\n\nlet attempts = 0;\nwhile (attempts < 3) {\n  console.log("trying…");\n  attempts++;\n}\n\nfor (const item of items) {\n  if (item === "CSS") continue; // skip CSS\n  if (item === "JS") break;     // stop at JS\n  console.log(item);\n}',
        note: 'for…of is the modern default for arrays. while is for unknown repetition — and always ensure the condition can become false.',
      },
      {
        title: 'The switch Statement in Depth',
        text:
          'When one value must be tested against many possibilities, a `switch` is often cleaner than a long `if…else if` chain:\n\n```js\nswitch (statusCode) {\n  case 200:\n    console.log("OK");\n    break;\n  case 404:\n    console.log("Not found");\n    break;\n  case 500:\n    console.log("Server error");\n    break;\n  default:\n    console.log("Unknown status");\n}\n```\n\nThree rules keep a switch correct:\n\n- **Every `case` needs `break` (or `return`)** — otherwise execution **falls through** into the next case. A missing `break` is the classic switch bug: the first matching case runs, then the one below it runs too. `default` has no need for `break` if it is last.\n- **Cases match with strict equality** (`===`). `case "5"` will NOT match the number `5`, and `case 1` will not match `"1"`. No coercion happens.\n- **`default` runs when nothing matches** — treat it as the else branch. It is conventionally last, but you may put it first when you want unmatched values caught early.\n\n**Grouping** lets several cases share one body — list the cases back-to-back with no body until the last one:\n`case "mon": case "tue": console.log("weekday"); break;`\n\n**Choosing switch vs if:** use `switch` when you are comparing the *same* expression against a fixed set of literal values (day names, HTTP statuses, enum-like state strings). Use `if…else` when the conditions are *different expressions* (ranges, comparisons) or involve `&&`/`||`. A `switch` on a single expression always beats a chain of `else if (value === …)`.',
        code: 'function describe(statusCode) {\n  switch (statusCode) {\n    case 200:\n      return "OK";\n    case 404:\n      return "Not found";\n    case 500:\n      return "Server error";\n    default:\n      return "Unknown status";\n  }\n}\n\nfunction dayType(day) {\n  switch (day) {\n    case "sat":\n    case "sun":\n      return "weekend"; // grouped cases share a body\n    default:\n      return "weekday";\n  }\n}\n\nconsole.log(describe(404)); // "Not found"\nconsole.log(dayType("sat")); // "weekend"\nconsole.log(describe("404")); // "Unknown status" — strict, no coercion',
        note: 'switch compares with === and needs break/return per case. Group related cases together; reserve it for one expression against many literals.',
      },
    ],
    quizzes: [
      {
        text: '`"5" === 5` evaluates to…',
        options: ['true', 'false', 'undefined', '5'],
        correctAnswer: 'false',
      },
      {
        text: '`const name = input || "Guest"` gives "Guest" when input is…',
        options: ['"Alice"', '0 or "" (any falsy value)', 'a number above 0', 'undefined only'],
        correctAnswer: '0 or "" (any falsy value)',
      },
      {
        text: 'Which operator returns the right side only when the left is null or undefined?',
        options: ['||', '&&', '??', '!'],
        correctAnswer: '??',
      },
      {
        text: 'The ternary `score >= 50 ? "Pass" : "Fail"` is equivalent to which if statement?',
        options: [
          'if (score >= 50) return "Fail"; else return "Pass";',
          'if (score >= 50) return "Pass"; else return "Fail";',
          'if (score) return "Pass"; else return "Fail";',
          'if (score < 50) return "Pass"; else return "Fail";',
        ],
        correctAnswer: 'if (score >= 50) return "Pass"; else return "Fail";',
      },
      {
        text: 'What happens when a matched `switch` case has no `break`?',
        options: ['the browser crashes', 'execution falls through into the next case', 'the switch is skipped entirely', 'only the default runs'],
        correctAnswer: 'execution falls through into the next case',
      },
      {
        text: 'Which loop guarantees its body runs at least once?',
        options: ['while', 'for', 'do…while', 'for…of'],
        correctAnswer: 'do…while',
      },
      {
        text: 'The modern loop to iterate over the VALUES of an array is…',
        options: ['for (let i = 0; i < arr.length; i++)', 'for…of', 'while', 'do…while'],
        correctAnswer: 'for…of',
      },
      {
        text: '`[1, 2] === [1, 2]` evaluates to…',
        options: ['true', 'false — arrays compare by reference, not content', 'undefined', 'TypeError'],
        correctAnswer: 'false — arrays compare by reference, not content',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 11 — JS Functions & Arrays
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 11,
    title: 'JS Functions & Arrays',
    description:
      'Functions in all their forms, the array methods that replace loops, and spread/rest for flexible data handling.',
    topics: [
      {
        title: 'Function Declarations, Expressions & Arrow Functions',
        text:
          'A **function** is a reusable block of behaviour — give it inputs, get back a result. JavaScript writes them three ways:\n\n1. **Declaration**: `function add(a, b) { return a + b; }` — hoisted, so you can call it before the line it is written on.\n2. **Expression**: `const add = function (a, b) { return a + b; };` — a function stored in a variable.\n3. **Arrow function**: `const add = (a, b) => a + b;` — the modern concise form. With one parameter you can drop the parentheses (`x => x * 2`), and with an expression body the `return` is implicit.\n\nThe three big differences to remember:\n\n- **`this` binding** — arrow functions do **not** have their own `this`; they inherit it from the surrounding scope. This makes arrows perfect for callbacks in objects and classes where you want the *outer* `this`.\n- **`arguments` object** — regular functions have an implicit `arguments` list; arrows do not (use rest parameters instead).\n- **Hoisting** — declarations are hoisted; expressions/arrows are not, so you must define them before use.\n\nA function can return **anything** — a number, an object, even another function (a "closure", Section 11 covers the mechanics). If no `return` is written, it returns `undefined`.\n\nModern codebases default to **arrows for short callbacks and `this`-safe helpers**, and `function` declarations for named, reusable top-level functions.',
        code: '// Declaration (hoisted — can call before the definition)\nfunction add(a, b) { return a + b; }\n\n// Expression\nconst mul = function (a, b) { return a * b; };\n\n// Arrow — concise, no own `this`\nconst square = x => x * x;\nconst greet = name => `Hello, ${name}!`;\n\nconst user = {\n  name: "Avi",\n  shout() {\n    // arrow inherits `this` from the method scope\n    const loud = () => `${this.name}!!!`;\n    return loud();\n  },\n};\nconsole.log(user.shout()); // "Avi!!!"',
        note: 'Arrow functions inherit `this` from the surrounding scope — that is why callbacks inside methods use arrows, not function declarations.',
      },
      {
        title: 'Parameters, Defaults & Rest',
        text:
          'Functions take **parameters** (the names) and receive **arguments** (the values). Three modern conveniences:\n\n- **Default parameters** — assign a fallback when the argument is `undefined`: `function greet(name = "Guest") { … }`. Cleaner than the old `||` trick and applies only to `undefined`, so `null` is not silently replaced.\n- **Rest parameters** — collect the *extra* arguments into an array with `...`: `function sum(...nums) { return nums.reduce((a, b) => a + b, 0); }`. This replaces the awkward old `arguments` object with a real array.\n- **Destructuring parameters** — unpack an object right in the signature: `function render({ name, age }) { … }` lets callers pass a config object and you pluck what you need.\n\nTwo related facts to keep straight:\n\n- **Rest** collects — it *gathers* remaining values into an array. It only ever appears as the **last** parameter.\n- **Spread** (`...`) does the opposite — it *spreads* an array or object into individual values: `Math.max(...nums)` turns an array into arguments; `{ ...user, age: 22 }` clones an object with one field changed (the spread idiom for immutable updates).\n\nFunctions are values, so they can be passed around like data — to `setTimeout`, to event listeners, to `Array.map`. Understanding "functions as first-class citizens" unlocks every pattern in this section and Section 14\'s async code.',
        code: 'function greet(name = "Guest") {\n  return `Hello, ${name}!`;\n}\nconsole.log(greet());        // "Hello, Guest!"\n\nfunction sum(...nums) {\n  return nums.reduce((a, b) => a + b, 0);\n}\nconsole.log(sum(1, 2, 3));   // 6\n\nconst scores = [85, 92, 78];\nconsole.log(Math.max(...scores)); // 92 — spread\n\nconst user = { name: "Avi", age: 21 };\nconst updated = { ...user, age: 22 }; // copy + override\nconsole.log(updated.age);    // 22, user untouched',
        note: 'Rest gathers (...args → array), spread scatters (array → individual values). Rest is a parameter; spread is an argument.',
      },
      {
        title: 'Array Methods: map, filter & reduce',
        text:
          'Arrays have methods that **replace whole loops** — the functional trio every JS interview starts with:\n\n- **`map`** — transform every element, return a new array of the same length: `[1,2,3].map(n => n * 2)` → `[2,4,6]`. Use it to convert one list into another (ids → names, numbers → HTML strings).\n- **`filter`** — keep elements that pass a test, return a shorter array: `[3,8,5,9].filter(n => n > 5)` → `[8,9]`. Use it to pick a subset.\n- **`reduce`** — fold the whole array into a single value: `[1,2,3].reduce((acc, n) => acc + n, 0)` → `6`. The callback receives the accumulator and each element; the second argument is the starting accumulator. Use it for sums, counts, grouping, building objects.\n\nThree habits keep these readable:\n\n1. **They are immutable** — `map`/`filter` return new arrays; the original is untouched. That is exactly what React needs for state updates.\n2. **Chain them** — `users.filter(u => u.active).map(u => u.name)` reads like a sentence.\n3. **Know the sibling methods** — `find` (first match), `some` (any match), `every` (all match), `includes` (membership), `sort` (careful — it mutates and sorts strings lexically by default), `forEach` (side-effects only).\n\nThe mental shift: describe *what* you want (`filter` the active ones), not *how* to loop. Code written this way has fewer off-by-one errors and no stray index bugs.',
        code: 'const users = [\n  { name: "Avi", active: true, score: 85 },\n  { name: "Sara", active: false, score: 92 },\n  { name: "Meera", active: true, score: 78 },\n];\n\nconst activeNames = users\n  .filter(u => u.active)            // [{Avi},{Meera}]\n  .map(u => u.name);                // ["Avi", "Meera"]\n\nconst total = users.reduce((acc, u) => acc + u.score, 0);\nconst top = users.find(u => u.score > 90); // first match\nconst anyActive = users.some(u => u.active);\n\nconsole.log(activeNames, total, top?.name, anyActive);',
        note: 'map transforms (same length), filter selects (shorter), reduce folds (one value). All three return new values — never mutate the original.',
      },
      {
        title: 'Array Iteration & Spread/Rest in Practice',
        text:
          'Now the pieces compose. The idiomatic way to turn a data array into a rendered list:\n\n`items.map(item => \`<li>${item}</li>\`).join("")` — map transforms each item, `join` concatenates into one HTML string.\n\nPractical patterns built from what you have learned:\n\n- **Chaining with early shape** — `scores.filter(s => s >= 40).map(s => s * 2).reduce((a, b) => a + b, 0)`.\n- **Spreading into a new array** — `const combined = [...first, ...second]` concatenates; `const copy = [...arr]` clones (shallowly).\n- **Spreading into objects** — `{ ...defaults, ...userPrefs }` merges with later keys winning — the standard config-merge idiom.\n- **Rest in destructuring** — `const [first, ...rest] = arr` unpacks the head and the tail; `const { name, ...otherProps } = obj` unpacks known keys and keeps the remainder.\n\nOne warning: `sort()` mutates the original array and sorts **strings** by default — `[10, 2, 30].sort()` gives `[10, 2, 30]` (lexical: "10" < "2"). Always pass a comparator for numbers: `.sort((a, b) => a - b)`.\n\nAlso note that `map`, `filter`, `reduce`, `find` all return **new or single values** and leave the input untouched — combine that immutability with spread to update state safely, which is exactly the discipline React state expects from Section 18 onwards.',
        code: 'const first = [1, 2];\nconst second = [3, 4];\nconst combined = [...first, ...second];   // [1,2,3,4]\n\nconst defaults = { theme: "light", lang: "en" };\nconst prefs = { lang: "hi" };\nconst config = { ...defaults, ...prefs };  // lang wins → hi\n\nconst [head, ...tail] = [10, 20, 30];      // head=10, tail=[20,30]\n\nconst nums = [10, 2, 30];\nconsole.log([...nums].sort((a, b) => a - b)); // [2,10,30] — copied first\n\nconst list = ["HTML", "CSS", "JS"].map(t => `<li>${t}</li>`).join("");',
        note: 'sort() mutates and defaults to string order — copy with spread and pass a comparator: [...arr].sort((a,b) => a - b).',
      },
    ],
    quizzes: [
      {
        text: 'Which array method TRANSFORMS every element into a new array of the same length?',
        options: ['filter', 'reduce', 'map', 'sort'],
        correctAnswer: 'map',
      },
      {
        text: 'What does `[3, 8, 5, 9].filter(n => n > 5)` produce?',
        options: ['[3, 5]', '[8, 9]', '[3, 8, 5, 9]', '[5, 8, 9]'],
        correctAnswer: '[8, 9]',
      },
      {
        text: '`[1, 2, 3].reduce((acc, n) => acc + n, 0)` evaluates to…',
        options: ['0', '6', '123', 'undefined'],
        correctAnswer: '6',
      },
      {
        text: 'Which of these is a difference between arrow functions and function declarations?',
        options: ['arrows have their own `this`', 'arrows inherit `this` from the surrounding scope', 'declarations cannot be hoisted', 'arrows cannot take parameters'],
        correctAnswer: 'arrows inherit `this` from the surrounding scope',
      },
      {
        text: 'The `...nums` in `function sum(...nums)` is called…',
        options: ['a spread parameter', 'a rest parameter', 'a destructured array', 'a default parameter'],
        correctAnswer: 'a rest parameter',
      },
      {
        text: '`Math.max(...scores)` — the `...scores` here is…',
        options: ['rest — gathers into an array', 'spread — scatters the array into arguments', 'a type cast', 'a loop'],
        correctAnswer: 'spread — scatters the array into arguments',
      },
      {
        text: '`[10, 2, 30].sort()` (no comparator) returns…',
        options: ['[2, 10, 30]', '[10, 2, 30] — string order, not numeric', 'NaN', 'a TypeError'],
        correctAnswer: '[10, 2, 30] — string order, not numeric',
      },
      {
        text: 'Which array method returns the FIRST element passing a test?',
        options: ['filter', 'map', 'find', 'every'],
        correctAnswer: 'find',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 12 — DOM Manipulation
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 12,
    title: 'DOM Manipulation',
    description:
      'The bridge between HTML and JavaScript: selecting elements, changing them, creating nodes, and doing it safely.',
    topics: [
      {
        title: 'The DOM Tree & the document Object',
        text:
          'When the browser loads an HTML page, it builds an in-memory **tree** of nodes — the **Document Object Model (DOM)**. Every tag becomes an element node, every piece of text a text node, every attribute part of its element. JavaScript talks to the page through this tree via the global `document` object.\n\nThe tree matters because it defines *relationships*: parent, child, sibling. `<html>` is the root; its children are `<head>` and `<body>`; `<body>` has the visible elements. You navigate these relationships every time you select an element and walk up or down.\n\nThe DOM is **live** — when JavaScript changes a node, the screen updates (almost) immediately. That is the whole trick of interactive pages: you are not editing a static file; you are mutating the running representation of it.\n\nA key distinction: the DOM is **not** the HTML source. The HTML is the *recipe*; the DOM is the *cooked dish*. JavaScript that adds elements, changes text, or moves nodes is cooking live — and if you inspect the page source ("View Source"), you see only the original recipe, not the current dish. DevTools *Elements* panel shows the live DOM.\n\nEvery interactive feature you will build — counters, toggles, forms, galleries — is a sequence of: select a node, listen for an event, mutate the tree. The next three topics cover each step.',
        code: '<!DOCTYPE html>\n<html>\n<body>\n  <h1 id="title">Original heading</h1>\n  <ul id="list"><li>One</li></ul>\n  <script>\n    // The DOM is live — change a node and the screen updates\n    document.getElementById("title").textContent = "Changed by JS!";\n\n    const li = document.createElement("li");\n    li.textContent = "Two";\n    document.getElementById("list").appendChild(li);\n  </script>\n</body>\n</html>',
        note: 'DOM ≠ source code. View Source shows the recipe; DevTools Elements shows the live, mutated tree.',
      },
      {
        title: 'Selecting Elements: getElementById & querySelector',
        text:
          'Before you can change an element, you must **select** it. The modern toolkit:\n\n- **`document.getElementById("title")`** — returns the one element with that id. Fast, specific, and always unique.\n- **`document.querySelector("selector")`** — returns the *first* element matching any CSS selector: `querySelector(".card")`, `querySelector("button.primary")`, `querySelector("#list li")`. Returns `null` if nothing matches — always check for `null` before using the result.\n- **`document.querySelectorAll("selector")`** — returns a static **NodeList** of *all* matches. It is array-like: use `Array.from(...)` or spread, or call `.forEach` directly.\n- **`document.getElementsByClassName` / `getElementsByTagName`** — older, return *live* collections that update as the DOM changes; they also miss the CSS-selector convenience of `querySelectorAll`. Prefer `querySelectorAll`.\n\nThe selector strings are exactly the CSS you learned in Section 3 — `#id`, `.class`, `element`, `[attr]`, and combinators like `.nav > a`. If you can style it with CSS, you can select it with `querySelector`.\n\nCommon bug: `querySelectorAll` returns a NodeList, not an array — `.map()` will throw. Convert first: `[...document.querySelectorAll(".card")]`.\n\nPerformance note: id lookups are fastest, but for normal pages any of these are instant. Clarity wins: use `getElementById` for a single unique element and `querySelectorAll` for groups.',
        code: 'const title = document.getElementById("title");       // unique id\nconst firstCard = document.querySelector(".card");      // first match\nconst allCards = [...document.querySelectorAll(".card")]; // array copy\n\nconst navLinks = document.querySelectorAll("nav a");    // every link in nav\n\nif (firstCard) {\n  firstCard.classList.add("active");\n}\n\nallCards.forEach((card, i) => {\n  card.dataset.index = String(i);\n});',
        note: 'querySelector takes any CSS selector; querySelectorAll returns a NodeList (not an array) — spread it before using .map/.filter.',
      },
      {
        title: 'Reading & Changing the DOM: text, attributes & classes',
        text:
          'Once selected, elements expose readable and writable properties:\n\n- **`textContent`** — get or set the *plain text* inside. Setting it replaces all children and is safe: it never parses HTML.\n- **`innerHTML`** — get or set *HTML markup*. Powerful, but **dangerous**: `element.innerHTML = userInput` where `userInput` contains `<img src=x onerror=alert(1)>` executes that script — a **cross-site scripting (XSS)** vulnerability. Only use `innerHTML` with content you trust or sanitised data; otherwise use `textContent`.\n- **`value`** — for inputs, textareas and selects: read or write the field\'s value.\n- **`setAttribute(name, value)` / `getAttribute(name)`** — general attributes: `img.setAttribute("alt", "…")`, `a.setAttribute("href", url)`.\n- **`classList`** — the modern class API: `add()`, `remove()`, `toggle()`, `contains()`. `toggle("dark")` adds or removes depending on whether it is present — the engine of theme switches. Never build class strings by hand when `classList` exists.\n- **`style`** — inline styles: `el.style.color = "red"`. Use for dynamic one-offs; keep real styling in CSS classes and toggle those instead (a `display: none` class beats `el.style.display = "none"` scattered through code).\n- **`dataset`** — read `data-*` attributes: `data-id="5"` becomes `el.dataset.id === "5"`.\n\nThe professional instinct: mutate **classes**, not styles; use **textContent**, not innerHTML, for user data.',
        code: 'const out = document.getElementById("output");\nout.textContent = "Safe text — never parsed as HTML";\n\nconst box = document.getElementById("box");\nbox.classList.add("active");\nbox.classList.toggle("dark");   // theme toggle\n\nconst img = document.querySelector("img");\nimg.setAttribute("alt", "Product photo");\n\nconst input = document.querySelector("#email");\nconst typed = input.value;       // read user input\n\nconsole.log(img.dataset.role);   // reads data-role="…"',
        note: 'XSS guard: if a value can contain user input, set it with textContent, never innerHTML. innerHTML + untrusted data = script injection.',
      },
      {
        title: 'Creating, Appending & Removing Nodes',
        text:
          'Beyond editing existing nodes, you build the DOM from scratch. The four verbs:\n\n- **`document.createElement("li")`** — create a detached element (not yet in the page).\n- **`parent.appendChild(child)`** — add it as the *last* child. Moving an existing node also works: appendChild *moves* it.\n- **`parent.append(a, b, text)`** — insert several things at once (elements *and* text).\n- **`parent.insertBefore(newNode, reference)`** — insert before a specific child; `prepend` adds to the front.\n- **`node.remove()`** — remove the node from the tree entirely.\n\nBuilding a list from data is the canonical pattern:\n\n```js\nconst data = ["HTML", "CSS", "JS"];\nconst ul = document.getElementById("list");\nfor (const item of data) {\n  const li = document.createElement("li");\n  li.textContent = item;\n  ul.appendChild(li);\n}\n```\n\nThree performance habits:\n\n1. **Build in a fragment or a string, then insert once.** `document.createDocumentFragment()` lets you assemble many nodes and add them in a single reflow instead of dozens.\n2. **`insertAdjacentHTML(position, html)`** — for trusted HTML, inserts a chunk at a position ("beforeend", "afterbegin") in one call.\n3. **Avoid repeated DOM reads in loops** — query the container once *outside* the loop, not inside.\n\nAnd remember the pairing discipline: every element you create and append is your responsibility to remove when no longer needed — leaked detached nodes in long-lived pages grow memory usage.',
        code: 'const data = ["HTML", "CSS", "JS"];\nconst ul = document.getElementById("list");\nconst frag = document.createDocumentFragment();\n\nfor (const item of data) {\n  const li = document.createElement("li");\n  li.textContent = item;\n  frag.appendChild(li);\n}\nul.appendChild(frag);      // one insertion, one reflow\n\n// Remove the first item later\nul.firstElementChild.remove();',
        note: 'Assemble off-screen (fragment), insert once — fewer reflows, smoother pages. Remove nodes you no longer need to avoid leaks.',
      },
    ],
    quizzes: [
      {
        text: 'Which method returns the FIRST element matching a CSS selector?',
        options: ['getElementsByTagName', 'querySelector', 'querySelectorAll', 'getElementById'],
        correctAnswer: 'querySelector',
      },
      {
        text: 'What does `document.querySelectorAll(".card")` return?',
        options: ['a single element', 'a NodeList (array-like, not a true array)', 'a CSSRule', 'a live HTMLCollection'],
        correctAnswer: 'a NodeList (array-like, not a true array)',
      },
      {
        text: 'Which is the SAFE way to put user-supplied text into an element?',
        options: ['element.innerHTML = userInput', 'element.textContent = userInput', 'element.insertAdjacentHTML("beforeend", userInput)', 'element.outerHTML = userInput'],
        correctAnswer: 'element.textContent = userInput',
      },
      {
        text: 'Which API toggles a class on/off in one call?',
        options: ['classList.toggle("dark")', 'setAttribute("class", "dark")', 'classList.swap("dark")', 'className = "dark"'],
        correctAnswer: 'classList.toggle("dark")',
      },
      {
        text: 'To read the text typed into `<input id="email">`, use…',
        options: ['document.getElementById("email").textContent', 'document.getElementById("email").value', 'document.getElementById("email").innerHTML', 'document.getElementById("email").data'],
        correctAnswer: 'document.getElementById("email").value',
      },
      {
        text: 'A `data-role="admin"` attribute is readable in JS as…',
        options: ['el.role', 'el.dataset.role', 'el.getAttribute("data")', 'el.data.role'],
        correctAnswer: 'el.dataset.role',
      },
      {
        text: 'Creating `<li>` elements and inserting them all at once is best done with…',
        options: ['a document fragment', 'innerHTML loop with textContent', 'several appendChild calls in a loop', 'document.write'],
        correctAnswer: 'a document fragment',
      },
      {
        text: 'Which statement about the DOM is TRUE?',
        options: ['it is identical to the HTML source file', 'it is a live tree that JS can mutate, and the screen reflects it', 'it only exists on the server', 'it cannot be inspected in DevTools'],
        correctAnswer: 'it is a live tree that JS can mutate, and the screen reflects it',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 13 — Event Handlers & Interactivity
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 13,
    title: 'Event Handlers & Interactivity',
    description:
      'How the browser reports user actions: the event flow, addEventListener, the event object, and delegation for dynamic pages.',
    topics: [
      {
        title: 'The Event Model: Bubbling & Capturing',
        text:
          'When a user clicks a button, the browser fires a **click event** — but not just at the button. The event travels a path through the DOM in two phases:\n\n1. **Capture phase** — from the root `<html>` down to the target element.\n2. **Target phase** — at the clicked element.\n3. **Bubble phase** — back up from the target to the root.\n\nBy default, listeners react during the **bubble** phase. This "bubbling" is why clicking a child can also trigger a listener on its parent — the event *rises* through every ancestor.\n\nWhy does this matter? It powers **event delegation** (Section 13.4): attach ONE listener to a container and catch clicks from any current or *future* child. It also explains classic bugs — a click on a nested element firing a parent\'s handler when you expected only the child\'s.\n\nYou can stop the ride:\n\n- **`event.stopPropagation()`** — stops the event from bubbling further up (or capturing further down). The current target\'s other listeners still run.\n- **`event.stopImmediatePropagation()`** — also blocks other listeners on the same element.\n\nUse these sparingly. A page covered in `stopPropagation` calls becomes a debugging maze; often the intended behaviour is achievable with `event.target` checks in a single delegated listener instead. Capture phase matters rarely — you pass `{ capture: true }` as the third argument to `addEventListener` when you need it.',
        code: '<div id="outer">\n  <button id="inner">Click me</button>\n</div>\n<script>\n  document.getElementById("outer").addEventListener("click", () => {\n    console.log("outer — bubble phase reached");\n  });\n  document.getElementById("inner").addEventListener("click", (e) => {\n    console.log("inner clicked");\n    // e.stopPropagation(); // uncomment to stop the bubble\n  });\n  // Clicking the button logs: "inner clicked", then "outer…".\n</script>',
        note: 'Events bubble from target up to the root. A parent listener fires for child clicks unless you stopPropagation.',
      },
      {
        title: 'addEventListener & the Event Object',
        text:
          'The modern way to attach behaviour to an element:\n\n`element.addEventListener("click", handler)` — registers a function to run when that event fires.\n\nAlternatives and why they are worse: the HTML attribute `onclick="…"` mixes JS into markup and cannot attach two handlers; the property `element.onclick = fn` allows only **one** handler. `addEventListener` allows many, is removable (`removeEventListener` with the same function reference), and works for every event type.\n\nThe handler receives the **event object** `e`, packed with useful information:\n\n- `e.target` — the element the event actually happened on (deepest, after bubbling).\n- `e.currentTarget` — the element the listener is attached to.\n- `e.type` — the event name (\"click\", \"submit\", …).\n- For keyboard: `e.key` — which key was pressed.\n- For mouse: `e.clientX`/`clientY` — coordinates; `e.button`.\n- `e.preventDefault()` — stop the default browser action (e.g. stop a form from submitting, stop a link from navigating).\n\nCommon event names: `click`, `dblclick`, `mouseenter`/`mouseleave`, `mouseover`/`mouseout`, `input` (fires on every keystroke/change in a text field), `change` (fires when a select/checkbox commits), `submit`, `focus`/`blur`, `keydown`/`keyup`, `scroll`, `resize`.\n\nThe recurring pattern: select → `addEventListener` → read `e` → mutate the DOM. Everything interactive you will build is this loop.',
        code: 'const btn = document.querySelector("#save");\nbtn.addEventListener("click", (e) => {\n  console.log("Clicked at", e.clientX, e.clientY);\n});\n\nconst link = document.querySelector("a#track");\nlink.addEventListener("click", (e) => {\n  e.preventDefault();          // stop navigation\n  console.log("Tracked, no page change");\n});\n\ndocument.addEventListener("keydown", (e) => {\n  if (e.key === "Escape") console.log("ESC pressed");\n});\n\nconst input = document.querySelector("#search");\ninput.addEventListener("input", (e) => {\n  console.log("typing:", e.target.value);\n});',
        note: 'e.preventDefault() stops the default action (form submit, link jump); e.target is the deepest element clicked; e.currentTarget is where the listener lives.',
      },
      {
        title: 'Common Events: click, input, submit & keydown',
        text:
          'The events you will wire every day:\n\n- **`click`** — buttons, cards, nav items. Attach to interactive elements; use `<button>` for actions (a `<div>` with onClick is not keyboard-accessible).\n- **`input`** — fires on *every* keystroke, paste, or cut in a text field. Perfect for live search and character counters.\n- **`change`** — fires when a `<select>` option or checkbox value *commits*. For text fields, prefer `input` (live) or `blur` (when leaving the field).\n- **`submit`** — on the `<form>` element, not the button. The professional pattern: listen for submit, read the fields, validate, `e.preventDefault()` to stop the page reload, then do your own handling.\n- **`keydown`** — keyboard shortcuts: Enter to send, Escape to close a modal, arrow keys for a gallery. `e.key` gives the printable name (`"Enter"`, `"Escape"`, `"ArrowRight"`).\n- **`focus` / `blur`** — when an element gains/loses keyboard focus. `blur` is useful for "left the field" validation.\n\nTwo event categories deserve care:\n\n- **`mouseenter`/`mouseleave`** do NOT bubble (unlike `mouseover`/`mouseout`), so they are safer for hover menus.\n- Touch vs mouse: on phones a `click` still fires (the browser synthesises it), so you rarely need separate touch handlers.\n\nBest practice for form UX: validate on `blur`/`input` for live feedback, but *re-validate everything* on `submit` — users can submit before blurring the last field.',
        code: '<form id="signup">\n  <input id="email" type="email" placeholder="you@example.com">\n  <button type="submit">Sign up</button>\n</form>\n<script>\n  const form = document.getElementById("signup");\n  form.addEventListener("submit", (e) => {\n    e.preventDefault();                 // no page reload\n    const email = document.getElementById("email").value;\n    if (!email.includes("@")) {\n      alert("Please enter a valid email");\n      return;\n    }\n    console.log("Submitting", email);\n  });\n\n  document.addEventListener("keydown", (e) => {\n    if (e.key === "Escape") console.log("Modal: close");\n  });\n</script>',
        note: 'Forms: listen on the form\'s submit, preventDefault to stop reload, then validate and handle — never rely on the native reload.',
      },
      {
        title: 'Event Delegation & Dynamic Content',
        text:
          '**Event delegation** attaches one listener to an *ancestor* instead of one listener per child. Because events bubble, a single listener on a container catches clicks from every child — including children added *after* the listener was attached.\n\nThis solves the classic dynamic-content bug: `document.querySelectorAll(".item").forEach(el => el.addEventListener(...))` attaches to the elements that exist *now*, so new `.item` elements created later have no handler.\n\nWith delegation, the container listener lives forever and catches everything:\n\n```js\nlist.addEventListener("click", (e) => {\n  const item = e.target.closest(".item");\n  if (!item) return;              // not a click on an item\n  handle(item.dataset.id);\n});\n```\n\nKey techniques in that snippet:\n\n- **`e.target`** is the deepest clicked element (could be a `<span>` inside the item).\n- **`closest(".item")`** walks up from the target and returns the nearest ancestor matching the selector — the exact element you care about, no matter what inner element was clicked.\n- The guard `if (!item) return;` ignores clicks outside any item.\n\nDelegation wins on three fronts: fewer listeners (memory), works for dynamic content, and fewer lines. Modern frameworks (React) do this internally — a single root listener dispatches to components.\n\nThe `{ once: true }` option in `addEventListener` runs the handler once then auto-removes it — handy for one-time init. And `removeEventListener` must be handed the *same* function reference to actually remove a listener.',
        code: '<ul id="todo-list">\n  <li class="todo" data-id="1">Learn HTML</li>\n  <li class="todo" data-id="2">Learn CSS</li>\n</ul>\n<script>\n  const list = document.getElementById("todo-list");\n\n  // ONE listener catches clicks on current AND future items\n  list.addEventListener("click", (e) => {\n    const item = e.target.closest(".todo");\n    if (!item) return;\n    console.log("Clicked todo id:", item.dataset.id);\n  });\n\n  // Add a new item later — the listener still works\n  const li = document.createElement("li");\n  li.className = "todo";\n  li.dataset.id = "3";\n  li.textContent = "Learn JS";\n  list.appendChild(li);\n</script>',
        note: 'Delegation pattern: e.target.closest(".todo") + a guard, on ONE container listener — handles current and future children.',
      },
    ],
    quizzes: [
      {
        text: 'In which phase do event listeners run by default?',
        options: ['capture', 'bubble', 'target-only', 'document-ready'],
        correctAnswer: 'bubble',
      },
      {
        text: 'Which method stops an event from bubbling further up the tree?',
        options: ['e.preventDefault()', 'e.stopPropagation()', 'e.stopBubble()', 'e.returnValue = false'],
        correctAnswer: 'e.stopPropagation()',
      },
      {
        text: 'Which method stops a form from reloading the page on submit?',
        options: ['e.stopPropagation()', 'e.preventDefault()', 'form.block()', 'return cancel()'],
        correctAnswer: 'e.preventDefault()',
      },
      {
        text: 'The event property that refers to the DEEPEST element the event happened on is…',
        options: ['e.currentTarget', 'e.target', 'e.element', 'e.source'],
        correctAnswer: 'e.target',
      },
      {
        text: 'Which event fires after EVERY keystroke in a text field?',
        options: ['change', 'input', 'blur', 'keyup-scroll'],
        correctAnswer: 'input',
      },
      {
        text: 'Event delegation works because…',
        options: ['events only fire on the target', 'events bubble up from the target through its ancestors', 'the browser copies listeners to new nodes', 'addEventListener is global'],
        correctAnswer: 'events bubble up from the target through its ancestors',
      },
      {
        text: 'In a delegated listener, which call finds the closest ancestor matching `.todo`?',
        options: ['e.target.closest(".todo")', 'e.currentTarget.querySelector(".todo")', 'e.target.parentNode', 'document.querySelectorAll(".todo")'],
        correctAnswer: 'e.target.closest(".todo")',
      },
      {
        text: 'Why does `querySelectorAll` + per-element listeners fail for dynamically added elements?',
        options: ['listeners cannot be attached in loops', 'new elements created later have no listener attached', 'querySelectorAll returns nothing', 'bubbling is disabled for new nodes'],
        correctAnswer: 'new elements created later have no listener attached',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 14 — Async JS, Promises & Fetch/APIs
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 14,
    title: 'Async JS, Promises & Fetch/APIs',
    description:
      'Why JavaScript does not block, how Promises tame async work, and talking to real APIs with fetch and async/await.',
    topics: [
      {
        title: 'Why Async: The Single-Threaded Event Loop',
        text:
          'JavaScript runs on **one thread** — one thing at a time. If that thread is busy doing slow work (loading a huge image, waiting for a server), the whole page would freeze and clicks would queue up. That is the problem **asynchrony** solves.\n\nThe browser runs an **event loop**: it executes your synchronous code, then keeps checking a queue of *pending callbacks*. Slow operations — network requests, timers, file reads — are handed to the browser\'s background, and their callbacks are queued to run later, when the thread is free.\n\nConcrete example: `setTimeout(() => console.log("later"), 0)` does **not** log immediately. It queues the callback; the synchronous code runs first, then the callback. This is why `console.log` order can surprise beginners:\n\n```js\nconsole.log("A");\nsetTimeout(() => console.log("B"), 0);\nconsole.log("C");\n// logs: A, C, B\n```\n\nThe distinction to internalise:\n\n- **Synchronous** code blocks — it must finish before anything else runs.\n- **Asynchronous** code schedules work — it returns immediately and the callback runs later.\n\nSo when you fetch data, the function that called `fetch` does not wait — it returns a "promise of a future value", and your continuation code runs when the data arrives. The `fetch` API is the practical star: it is how frontends talk to the course\'s own backend.',
        code: 'console.log("A");\nsetTimeout(() => console.log("B"), 0);\nconsole.log("C");\n\n// Output order: A, C, B\n// setTimeout queues a callback; sync code finishes first.\n\n// A slow, blocking pattern (do NOT do this):\n// const data = awaitLotsOfWorkSync(); // freezes the page\n\n// The async pattern: kick off work, handle the result later.',
        note: 'JS is single-threaded; setTimeout(…, 0) still runs after all synchronous code — callbacks are queued, not executed inline.',
      },
      {
        title: 'Promises: then, catch & finally',
        text:
          'A **Promise** is an object representing work that is not finished yet — a "promise of a future value". It starts **pending**, then settles as either **fulfilled** (with a value) or **rejected** (with an error).\n\nYou consume a promise with its three methods:\n\n- **`.then(cb)`** — runs when fulfilled, receives the value.\n- **`.catch(cb)`** — runs when rejected, receives the error. Put it at the end of the chain to catch failures from any earlier step.\n- **`.finally(cb)`** — runs either way (loading spinners off, cleanup).\n\nChaining is the point: `fetch(url).then(r => r.json()).then(data => render(data)).catch(err => showError(err))` — each `.then` returns a new promise, so the chain reads top-to-bottom. A rejection anywhere jumps to the nearest `.catch`.\n\nCreating a promise: `new Promise((resolve, reject) => { … })` where you call `resolve(value)` on success and `reject(err)` on failure. In practice you create them less often than you *consume* them — every `fetch`, every `await`, most APIs return promises.\n\nThe key discipline: **always handle rejection**. An unhandled rejection is a silent failure — your loading spinner spins forever and the user sees nothing. A `.catch` that shows a message turns a crash into a recoverable state.\n\n`Promise.all([p1, p2])` waits for several promises together and settles with an array (or rejects on the first failure) — the standard way to fetch multiple independent resources in parallel.',
        code: 'function fetchUser(id) {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      id > 0 ? resolve({ id, name: "Avi" }) : reject(new Error("Bad id"));\n    }, 500);\n  });\n}\n\nfetchUser(1)\n  .then(user => console.log("Got", user.name))\n  .catch(err => console.error("Failed:", err.message))\n  .finally(() => console.log("done (always runs)"));\n\n// Parallel independent work:\nPromise.all([fetchUser(1), fetchUser(2)])\n  .then(([a, b]) => console.log(a.name, b.name));',
        note: 'A promise settles once: fulfilled (value) or rejected (error). Always chain a .catch — unhandled rejections fail silently.',
      },
      {
        title: 'async/await: Readable Asynchronous Code',
        text:
          '`async/await` is syntax sugar over promises that makes async code read like synchronous code — and it is the style you will use every day.\n\n- Mark a function `async`: it always returns a promise.\n- Inside it, `await somePromise()` **pauses** the function until the promise settles, then yields its value. `await` is only legal inside an `async` function.\n\nThe payoff is readability:\n\n```js\nasync function load() {\n  const res = await fetch("/api/courses");\n  const courses = await res.json();\n  render(courses);\n}\n```\n\n…replaces the `.then` chain, and the sequential steps read in order.\n\n**Error handling** returns to the familiar `try/catch`:\n\n```js\ntry {\n  const res = await fetch("/api/courses");\n  if (!res.ok) throw new Error("HTTP " + res.status);\n  const courses = await res.json();\n  render(courses);\n} catch (err) {\n  showError(err.message);\n}\n```\n\nTwo traps to know:\n\n1. **`await` is serial** — writing two `await`s one after another waits for the first before starting the second. If they are independent, start them together: `const [a, b] = await Promise.all([fetchA(), fetchB()])`.\n2. **A caught error is a string in some APIs** — always `throw new Error(message)` to preserve a stack.\n\nRule of thumb for modern code: `async/await` for *writing*, `.then/.catch` for *passing* callbacks (like `useEffect` in React). You need both.',
        code: 'async function loadCourses() {\n  try {\n    const res = await fetch("/api/courses");\n    if (!res.ok) throw new Error(`HTTP ${res.status}`);\n    const courses = await res.json();\n    renderCourses(courses);\n  } catch (err) {\n    showError(err.message);   // network down, 404, 500 — all land here\n  }\n}\n\n// Independent requests run in PARALLEL via Promise.all:\nconst [courses, user] = await Promise.all([\n  fetch("/api/courses").then(r => r.json()),\n  fetch("/api/me").then(r => r.json()),\n]);',
        note: 'await is serial: two awaited calls run one after another. For independent fetches use Promise.all — it halves the latency.',
      },
      {
        title: 'fetch API & Talking to Real Backends',
        text:
          'The **Fetch API** is the modern way to make HTTP requests from the browser. It returns a promise, so it pairs perfectly with async/await:\n\n- **GET** — `const res = await fetch("/api/courses")`. The default.\n- **POST** — `fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })`.\n\nTwo stages to remember:\n\n1. The **response** arrives even for errors — `res.ok` is `false` for a 404/500, but the promise only *rejects* on network failure (offline, DNS). **Always check `res.ok` and throw.**\n2. The **body** must be parsed: `await res.json()` for JSON, `await res.text()` for plain text.\n\nAuthorization — how this course\'s own backend identifies you — goes in a header: `Authorization: Bearer <token>`. Your login returns a token, and every protected call sends it:\n\n```js\nfetch("/api/me", {\n  headers: { Authorization: `Bearer ${token}` },\n})\n```\n\nError-handling habit for real apps: distinguish the failure types — network error (show "offline"), HTTP 401/403 (session expired → redirect to login), HTTP 422 (validation — show the field errors), HTTP 500 (show "try again later").\n\n**CORS** is the browser\'s safety gate: a page on one origin calling an API on another is blocked unless the API sends the right `Access-Control-Allow-Origin` header. During development, the backend must allow your frontend\'s origin — which is why the course backend has CORS configured.',
        code: 'async function login() {\n  const res = await fetch("/api/auth/login", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ email: "avi@example.com", password: "secret123" }),\n  });\n  if (!res.ok) throw new Error(`Login failed: ${res.status}`);\n  const { token } = await res.json();\n  localStorage.setItem("token", token);\n  return token;\n}\n\nasync function me(token) {\n  const res = await fetch("/api/me", {\n    headers: { Authorization: `Bearer ${token}` },\n  });\n  if (res.status === 401) window.location = "/login"; // session expired\n  return res.json();\n}',
        note: 'fetch rejects only on network failure — a 404 is still a fulfilled promise. Always check res.ok and throw before parsing.',
      },
    ],
    quizzes: [
      {
        text: 'What does `setTimeout(() => console.log("B"), 0)` do relative to the synchronous code?',
        options: ['runs B first, then the sync code', 'queues the callback to run after all synchronous code', 'blocks the thread for 0ms then runs B', 'throws an error'],
        correctAnswer: 'queues the callback to run after all synchronous code',
      },
      {
        text: 'A promise settles into which two final states?',
        options: ['pending / waiting', 'fulfilled / rejected', 'started / stopped', 'queued / done'],
        correctAnswer: 'fulfilled / rejected',
      },
      {
        text: 'In a promise chain, a failure anywhere jumps to…',
        options: ['the next .then', 'the nearest .catch', '.finally', 'the start of the chain'],
        correctAnswer: 'the nearest .catch',
      },
      {
        text: '`await` is only allowed inside…',
        options: ['any function', 'an async function', 'a callback', 'a class constructor only'],
        correctAnswer: 'an async function',
      },
      {
        text: 'Two awaited fetches written one after another run…',
        options: ['in parallel', 'one after the other (serially)', 'both at once always', 'only the first'],
        correctAnswer: 'one after the other (serially)',
      },
      {
        text: 'What does `fetch()` return?',
        options: ['a callback', 'a Promise', 'an XMLHttpRequest', 'a string'],
        correctAnswer: 'a Promise',
      },
      {
        text: 'Why must you check `res.ok` after `fetch`?',
        options: ['fetch rejects on HTTP errors, so this is optional', 'fetch only rejects on network failure — a 404 still resolves, so res.ok catches it', 'fetch always resolves with res.ok true', 'res.ok is a string'],
        correctAnswer: 'fetch only rejects on network failure — a 404 still resolves, so res.ok catches it',
      },
      {
        text: 'To fetch two INDEPENDENT resources with minimal latency, use…',
        options: ['two serial awaits', 'Promise.all([fetchA(), fetchB()])', 'a for loop of awaits', 'setTimeout'],
        correctAnswer: 'Promise.all([fetchA(), fetchB()])',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 15 — Mini-Project Planning (Portfolio)
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 15,
    title: 'Mini-Project Planning (Portfolio)',
    description:
      'Turn a vague "make a portfolio" into a buildable plan: scope, structure, design tokens, and a file layout you can execute without guessing.',
    topics: [
      {
        title: 'Scoping the Project: Requirements & MVP',
        text:
          'Every good project starts with a **scope** — a short list of what the site must do. For a portfolio, the non-negotiable core (the MVP) might be:\n\n1. Hero section — who you are and what you do.\n2. About — a short profile.\n3. Projects — a grid of 3–4 cards linking to work.\n4. Contact — a form or link.\n\nWrite these as **requirements**, not descriptions: "The contact form validates email and shows a success message." Requirements are testable — you know when you are done.\n\nThe discipline of an MVP is saying **no**: every extra feature (dark-mode toggle, animations everywhere, a blog, multiple languages) doubles complexity. List them as *future ideas* and build them only after the core works. A finished small site beats a half-built ambitious one — and you can always add.\n\nScope also fixes constraints: plain HTML/CSS/JS (this course\'s stack), no frameworks, no build tools — that keeps the deploy trivial (Section 19). Time-box the build: this project has a few sections of course time, so each page should be achievable in one sitting.\n\nFinally, write a **definition of done** for the MVP: "On desktop and mobile, all four sections render; every project link works; the contact form validates client-side; the page scores 90+ on Lighthouse." Now you know what "finished" means before you start.',
        code: '<!-- planning-note.md (scope) -->\n# Portfolio — Scope (MVP)\n## Must do\n1. Hero: name + one-line intro\n2. About: 2 paragraphs + photo\n3. Projects: grid of 4 cards, each link opens\n4. Contact: email form with validation + success msg\n\n## Deliberately NOT in v1\n- Dark mode, blog, multi-language, heavy animations\n\n## Definition of done\n- Responsive (phone + desktop)\n- Lighthouse score 90+ on performance & accessibility\n- All project links resolve',
        note: 'An MVP is not "the least you can get away with" — it is the smallest scope that is genuinely useful and testable.',
      },
      {
        title: 'Wireframing & Information Architecture',
        text:
          'Before writing a single tag, draw the **wireframe** — a low-fidelity layout sketch showing where each block goes. You can draw boxes on paper, in a whiteboard tool, or with plain `<div>`s. The goal is structure, not beauty: which content is where, and in what order.\n\nA one-page portfolio typically flows top to bottom:\n\n- **Header** (fixed): logo/name + nav links (About, Projects, Contact).\n- **Hero**: name, tagline, call-to-action button.\n- **About**: photo + short bio.\n- **Projects**: grid of cards (image, title, short description, link).\n- **Contact**: form + email/phone/socials.\n- **Footer**: copyright, small links.\n\nThat ordering is **information architecture** — deciding what the visitor meets first and what supports it. Each section is one `<section>` with a heading, which also gives you the accessibility landmarks from Section 2.\n\nTwo questions guide every placement decision:\n\n1. What does the visitor want first? (Who am I / what can you do → the hero.)\n2. What action do we want them to take? (Contact me → placed after trust-building content.)\n\nThe wireframe also reveals the **reusable blocks** — card, button, section heading — that you will build once and reuse, keeping the CSS consistent.',
        code: '<!-- Low-fi wireframe as HTML skeletons --\n+--------------------------------------+\n|  [Logo]   About  Projects  Contact   |  <header><nav>\n+--------------------------------------+\n|  Hey, I am Avi — Web Designer        |  <section class="hero">\n|  [See my work]                       |\n+--------------------------------------+\n|  About me  |  [photo]                |  <section id="about">\n+--------------------------------------+\n|  [card] [card] [card] [card]         |  <section id="projects">\n+--------------------------------------+\n|  [email] [message] [Send]            |  <section id="contact">\n+--------------------------------------+\n|  (c) 2026 Avi                        |  <footer>\n+--------------------------------------+',
        note: 'Wireframe first: decide placement and order on paper, then write HTML — it prevents rewrite loops mid-build.',
      },
      {
        title: 'Design Tokens: Colors, Type & Spacing',
        text:
          'Before styling, choose the **design tokens** — the fixed values your whole site shares. Tokens make the design consistent and the CSS easy to maintain.\n\n**Colour**: pick a small palette — a primary (brand), a neutral set (background/text), and one accent. A practical scheme: dark slate text (`#0f172a`), light background (`#f8fafc`), one blue primary (`#2563eb`), one accent (e.g. pink `#db2777`). Define them as CSS variables and reference those — change the variable, restyle the whole site:\n\n```css\n:root {\n  --color-bg: #f8fafc;\n  --color-text: #0f172a;\n  --color-primary: #2563eb;\n  --color-accent: #db2777;\n}\n```\n\n**Typography**: choose one font family for headings and one for body (or a single system-font stack). Set a type scale: body `1rem`, headings `2rem/1.5rem/1.25rem`, captions `0.875rem`. `rem` keeps it accessible to browser font settings.\n\n**Spacing**: adopt a small scale — `4px, 8px, 16px, 24px, 32px, 64px` — and stick to it. `margin` and `padding` from the same scale gives the page a rhythm; stray one-off values (13px, 27px) make it feel random.\n\n**Effects**: define the two or three shadows and radii you will reuse (`.shadow-sm`, `.shadow-lg`; `--radius: 8px`).\n\nWriting tokens down (as CSS variables or a comment block) is the difference between a consistent design and a patchwork — and it is exactly what frameworks like Tailwind formalise (Section 8).',
        code: ':root {\n  /* color tokens */\n  --color-bg: #f8fafc;\n  --color-surface: #ffffff;\n  --color-text: #0f172a;\n  --color-muted: #64748b;\n  --color-primary: #2563eb;\n  --color-accent: #db2777;\n\n  /* type scale */\n  --font-body: "Inter", system-ui, sans-serif;\n  --size-body: 1rem;\n  --size-h1: 2.5rem;\n  --size-h2: 1.75rem;\n\n  /* spacing scale */\n  --space-1: 4px;  --space-2: 8px;\n  --space-3: 16px; --space-4: 24px;\n  --space-5: 32px; --space-6: 64px;\n\n  /* effects */\n  --radius: 10px;\n  --shadow-card: 0 4px 12px rgba(15, 23, 42, 0.08);\n}\n\nbody {\n  background: var(--color-bg);\n  color: var(--color-text);\n  font-family: var(--font-body);\n}',
        note: 'Design tokens = the fixed palette you never break: colours, type scale, spacing scale, effects — all as CSS variables.',
      },
      {
        title: 'File Structure & Build Plan',
        text:
          'A portfolio needs no build tool — plain files are the deployment-free approach. A clean structure keeps the project navigable:\n\n```\nportfolio/\n├── index.html        (single page — fine for an MVP)\n├── css/\n│   └── style.css     (tokens at top, then sections)\n├── js/\n│   └── main.js       (nav toggle, form validation, scroll)\n└── images/\n    └── (project screenshots, profile photo)\n```\n\nFor an MVP a **single `index.html`** is the right call — every section lives on one page, nav links are anchors (`#projects`), and there is zero routing complexity. You can split into multiple pages later when the content genuinely demands it.\n\nWrite the **build plan** — the order of work — before coding. A sensible sequence:\n\n1. `index.html` skeleton with all four sections (empty content boxes).\n2. `style.css` — tokens, then base styles, then section styles mobile-first.\n3. Responsive layout (grid + media queries) for the projects section.\n4. `main.js` — nav toggle on mobile, form validation, scroll behaviour.\n5. Content pass — real images and text, alt attributes everywhere.\n6. Lighthouse check + fixes.\n\nEach step is independently testable: after step 1, the page renders the outline; after step 2 it looks styled; after step 4 it is interactive. That sequence lets you see progress at every sitting instead of coding for hours before anything runs.\n\nKeep the structure honest — you are building to *learn and ship*, not to show off complexity. A tidy three-folder project that deploys beats a sprawling scaffold you cannot finish.',
        code: 'portfolio/\n├── index.html\n├── css/\n│   └── style.css\n├── js/\n│   └── main.js\n└── images/\n    ├── profile.jpg\n    └── project-*.png\n\n<!-- Build plan (comment this at the top of index.html) -->\n<!-- 1. skeleton  →  2. style.css tokens/base/sections\n     3. responsive grid  →  4. main.js interactivity\n     5. content pass + alt  →  6. Lighthouse check  -->',
        note: 'Plan the build order so every step is visible and testable: skeleton → styles → responsive → JS → content → audit.',
      },
    ],
    quizzes: [
      {
        text: 'An MVP (Minimum Viable Product) is best described as…',
        options: ['the smallest scope that is genuinely useful and testable', 'a project with no styling', 'a prototype you throw away', 'the feature-complete final version'],
        correctAnswer: 'the smallest scope that is genuinely useful and testable',
      },
      {
        text: 'What is a wireframe used for?',
        options: ['the final pixel-perfect design', 'a low-fidelity layout sketch showing where blocks go', 'a JavaScript file', 'a CSS preprocessor'],
        correctAnswer: 'a low-fidelity layout sketch showing where blocks go',
      },
      {
        text: 'What are design tokens?',
        options: ['the fixed values (colors, type, spacing) the whole site shares', 'random CSS values', 'React components', 'API endpoints'],
        correctAnswer: 'the fixed values (colors, type, spacing) the whole site shares',
      },
      {
        text: 'Why store colors in CSS variables like `--color-primary`?',
        options: ['browsers require it', 'changing the variable restyles every usage at once', 'it makes CSS load faster', 'variables are mandatory in HTML5'],
        correctAnswer: 'changing the variable restyles every usage at once',
      },
      {
        text: 'For an MVP single-page portfolio, the nav links "About / Projects / Contact" are best implemented as…',
        options: ['anchors (#about, #projects, #contact) to same-page sections', 'separate HTML files', 'iframes', 'server redirects'],
        correctAnswer: 'anchors (#about, #projects, #contact) to same-page sections',
      },
      {
        text: 'A "definition of done" helps by…',
        options: ['making the project longer', 'letting you know what finished means before you start', 'replacing the wireframe', 'deleting the scope'],
        correctAnswer: 'letting you know what finished means before you start',
      },
      {
        text: 'Which is the RIGHT build order for the portfolio?',
        options: ['style.css → images → index.html → JS', 'index.html skeleton → CSS → responsive → JS → content → audit', 'JS first → CSS → HTML → audit', 'deploy first → design later'],
        correctAnswer: 'index.html skeleton → CSS → responsive → JS → content → audit',
      },
      {
        text: 'What is the main benefit of writing requirements like "the form validates email"?',
        options: ['they make code longer', 'they are testable — you know when you are done', 'they replace HTML', 'they confuse the client'],
        correctAnswer: 'they are testable — you know when you are done',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 16 — Building the Portfolio Project
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 16,
    title: 'Building the Portfolio Project',
    description:
      'Execute the plan: the semantic page skeleton, a strong hero, an about section, a projects grid, and a contact form.',
    topics: [
      {
        title: 'Semantic Page Skeleton: header, main & sections',
        text:
          'The build starts with the HTML **skeleton** — every section in place, empty but correctly structured, before any styling. This is where Section 2\'s semantics earn their keep.\n\nThe outline: `<header>` with the site name and `<nav>`; a `<main>` containing `<section id="hero">`, `<section id="about">`, `<section id="projects">`, `<section id="contact">`; then a `<footer>`. Each section carries an `id` so the nav anchors (`#about`) jump to it.\n\nThree structural rules for this skeleton:\n\n1. **One `<h1>`** — the hero heading, the page\'s title. Every other heading steps down the outline: section `<h2>`s, card `<h3>`s.\n2. **Landmarks in place** — `<main>` exactly once, `<nav>` for the primary menu, `<footer>` for legal/copyright.\n3. **Skip link** — a "Skip to content" link as the *first* element, hidden visually but focused by keyboard: `<a class="skip" href="#main">Skip to content</a>`. Screen-reader and keyboard users jump straight past the nav. It is a tiny line of code and an accessibility requirement.\n\nAlso add the meta essentials in `<head>`: `charset`, `viewport`, `title`, and a `<meta name="description">` for search listings.\n\nWrite the skeleton with **placeholder content** (dummy headings, an empty projects grid). Styling and real content come next — but a correct skeleton means the wireframe from Section 15 is now a real page you can look at and click through.',
        code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <meta name="description" content="Avi — web designer portfolio">\n  <title>Avi — Portfolio</title>\n  <link rel="stylesheet" href="css/style.css">\n</head>\n<body>\n  <a class="skip" href="#main">Skip to content</a>\n  <header>\n    <p class="logo">Avi.</p>\n    <nav>\n      <a href="#about">About</a>\n      <a href="#projects">Projects</a>\n      <a href="#contact">Contact</a>\n    </nav>\n  </header>\n  <main id="main">\n    <section id="hero"><h1>Hi, I am Avi.</h1></section>\n    <section id="about"><h2>About</h2></section>\n    <section id="projects"><h2>Projects</h2></section>\n    <section id="contact"><h2>Contact</h2></section>\n  </main>\n  <footer>&copy; 2026 Avi</footer>\n</body>\n</html>',
        note: 'Skeleton first = the wireframe becomes a real clickable page before any CSS. One <h1>, skip link, landmarks in place.',
      },
      {
        title: 'Hero & About Sections',
        text:
          'The **hero** is the first thing a visitor sees — it must answer "who are you?" in about three seconds. Structure it as: a large heading with your name, a one-line role ("Web designer & frontend developer"), and one call-to-action button ("See my work" → `#projects`).\n\nStyle the hero to feel like a *stage*: generous padding (`padding: 6rem 1rem`), a `min-height: 70vh` if you want it to fill the screen, centred content, and a headline sized with `clamp()` (Section 7) so it scales.\n\nBackground options from simple to fancy: a solid brand-tinted colour, a `linear-gradient`, or a subtle pattern image with `background-size: cover`. The hero\'s job is hierarchy, not decoration — keep the contrast high (dark text on light, or light on dark) so the name is instantly readable.\n\nThe **About** section tells the longer story. Typical layout: photo on one side, two or three paragraphs on the other, using the Flexbox two-column pattern (`display: flex; gap; flex-wrap`) that collapses to a single column on mobile. Include:\n\n- Your background and what you are currently learning.\n- A concrete skill list (the languages/tools from this course).\n- Something human — a hobby or interest — that makes you memorable.\n\nAlways provide a real `alt` for the photo (`alt="Portrait of Avi"`). On small screens the flex container wraps, so the photo stacks above the text and the section still reads well.',
        code: '<section id="hero" class="hero">\n  <h1 class="hero-title">Hi, I am Avi.</h1>\n  <p class="hero-role">Web designer & frontend developer</p>\n  <a class="btn" href="#projects">See my work</a>\n</section>\n\n<section id="about" class="about">\n  <img src="images/profile.jpg" alt="Portrait of Avi" class="about-photo">\n  <div class="about-text">\n    <h2>About me</h2>\n    <p>I build clean, responsive websites. Currently learning the full\n    frontend stack: HTML, CSS, JavaScript and modern layout.</p>\n    <p>Skills: HTML5, CSS3, Flexbox, Grid, JavaScript, Tailwind.</p>\n  </div>\n</section>',
        note: 'Hero answers "who + one action" in seconds; About tells the longer story with a photo + paragraphs that stack on mobile.',
      },
      {
        title: 'Projects Grid & Skill Section',
        text:
          'The **projects** section is the portfolio\'s proof — real work shown as a grid of cards. Each card needs:\n\n- A screenshot or thumbnail (`<img>` with `alt` and `loading="lazy"`).\n- A title (`<h3>`).\n- One or two sentences describing what it is and what you used.\n- A link ("View project") to the live site or repo.\n\nThe responsive grid is the Section 7 pattern, ready-made: `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))` — three or four cards on desktop, one or two on mobile, zero media queries. Add `gap` for breathing room and a subtle `border-radius` + shadow to lift each card.\n\nA **skills** strip completes the story — a row of chips listing your technologies. Make it honest: only list what you can actually build with. This is also where interviewers probe — claiming a tool you cannot use is worse than listing fewer.\n\nCard quality rules:\n\n1. Every card link must work — dead links destroy trust instantly.\n2. Screenshots should be real: actual renderings of the project, not stock images.\n3. If a project is not live yet, say so ("In progress") rather than leaving a broken button.\n\nThree to four strong cards are enough for a student portfolio. One impressive project with a working demo outweighs five half-finished placeholders.',
        code: '<section id="projects" class="projects">\n  <h2>Projects</h2>\n  <div class="grid">\n    <article class="card">\n      <img src="images/project-todo.png" alt="Screenshot of the Todo app" loading="lazy">\n      <h3>Todo App</h3>\n      <p>A CRUD todo list with local storage persistence, built in vanilla JS.</p>\n      <a href="https://example.com/todo" target="_blank" rel="noopener">View project</a>\n    </article>\n    <article class="card">\n      <img src="images/project-landing.png" alt="Screenshot of the landing page" loading="lazy">\n      <h3>Product Landing Page</h3>\n      <p>Responsive landing page using CSS Grid, Flexbox and animations.</p>\n      <a href="https://example.com/landing" target="_blank" rel="noopener">View project</a>\n    </article>\n  </div>\n</section>',
        note: 'Projects grid = repeat(auto-fit, minmax(250px, 1fr)) + real screenshots + working links. 3–4 strong cards beat 8 placeholders.',
      },
      {
        title: 'Contact Form & Footer',
        text:
          'The **contact** section turns visitors into leads. A minimal form — name, email, message, submit — is all you need:\n\n```html\n<form id="contact-form">\n  <label for="name">Name</label>\n  <input id="name" name="name" type="text" required>\n  <label for="email">Email</label>\n  <input id="email" name="email" type="email" required>\n  <label for="message">Message</label>\n  <textarea id="message" name="message" rows="5" required></textarea>\n  <button type="submit">Send message</button>\n</form>\n```\n\nThree best practices baked into that markup:\n\n1. **Labels for every field** — a `<label for="id">` tied to its input is required for accessibility (screen readers announce the field, and clicking the label focuses it).\n2. **Correct `type`s** — `type="email"` gives free mobile keyboard and built-in validation.\n3. **`required`** — the browser blocks empty submits before any JS runs.\n\nClient-side validation (Section 18) enhances this; but a form with no backend still needs an honest fallback — a `mailto:` link is the classic zero-backend solution: clicking opens the user\'s email app. For a real form submission endpoint you would POST to a service.\n\nThe **footer** closes the page: copyright, a couple of small links (email, socials, maybe a back-to-top anchor). Keep it minimal — the footer should never outrank the content above it.\n\nAfter the form, the page is complete and matches the wireframe — the next three sections are polish and deployment.',
        code: '<section id="contact" class="contact">\n  <h2>Get in touch</h2>\n  <form id="contact-form" action="#" method="post">\n    <label for="name">Name</label>\n    <input id="name" name="name" type="text" required>\n\n    <label for="email">Email</label>\n    <input id="email" name="email" type="email" required>\n\n    <label for="message">Message</label>\n    <textarea id="message" name="message" rows="5" required></textarea>\n\n    <button type="submit">Send message</button>\n    <p class="form-fallback">\n      Prefer email? <a href="mailto:hi@example.com">hi@example.com</a>\n    </p>\n  </form>\n</section>\n\n<footer>\n  <p>&copy; 2026 Avi · <a href="#main">Back to top</a></p>\n</footer>',
        note: 'Every input gets a <label for="…">, the right type, and required — that is usable, accessible markup before a line of CSS.',
      },
    ],
    quizzes: [
      {
        text: 'Which element should appear exactly ONCE per page, wrapping the unique content?',
        options: ['<header>', '<main>', '<aside>', '<nav>'],
        correctAnswer: '<main>',
      },
      {
        text: 'A "skip to content" link mainly helps…',
        options: ['search engines rank images', 'keyboard and screen-reader users skip repeated navigation', 'mobile users save data', 'the browser load faster'],
        correctAnswer: 'keyboard and screen-reader users skip repeated navigation',
      },
      {
        text: 'Why use `type="email"` on an email input?',
        options: ['it stores the value as a number', 'it gives mobile keyboards + built-in email validation', 'it is required by CSS', 'it disables the field'],
        correctAnswer: 'it gives mobile keyboards + built-in email validation',
      },
      {
        text: 'A `<label for="email">` is tied to an input with…',
        options: ['class="email"', 'id="email"', 'name="email"', 'type="email"'],
        correctAnswer: 'id="email"',
      },
      {
        text: 'The portfolio projects grid that stays responsive uses…',
        options: ['position: absolute per card', 'grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))', 'display: inline on every card', 'fixed pixel widths'],
        correctAnswer: 'grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))',
      },
      {
        text: 'Which attribute on the profile photo is required for accessibility?',
        options: ['width', 'alt', 'data-src', 'loading'],
        correctAnswer: 'alt',
      },
      {
        text: 'The hero section should answer, within seconds…',
        options: ['the full life story', 'who you are and offer one clear action', 'every skill you know', 'a pricing table'],
        correctAnswer: 'who you are and offer one clear action',
      },
      {
        text: 'The classic zero-backend fallback so visitors can still contact you is…',
        options: ['a mailto: link', 'a POST to a database', 'a WebSocket', 'an iframe'],
        correctAnswer: 'a mailto: link',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 17 — Styling & Responsive Polish
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 17,
    title: 'Styling & Responsive Polish',
    description:
      'From "it works" to "it feels designed": consistent rhythm, solid breakpoints, accessibility that holds up, and performance that loads fast.',
    topics: [
      {
        title: 'Consistent Spacing & Visual Rhythm',
        text:
          'A site looks "designed" when its spacing is **consistent** — the same gaps repeat, and the eye learns the pattern. This is exactly what the design tokens from Section 15 enforce: every margin and padding drawn from one small scale.\n\nPractical rhythm rules:\n\n1. **A base unit, then multiples** — if your token scale is 4/8/16/24/32/64px, use them *as-is*; resist `margin-top: 13px`. Slight irregularity reads as sloppiness even when nobody can say why.\n2. **Vertical rhythm for text** — set one consistent line-height (1.5–1.7 for body) and one paragraph margin (`margin-bottom: 1rem`), so blocks of prose align to an invisible grid.\n3. **Section padding** — give each section the same top/bottom padding (`padding: 4rem 1rem`) so scrolling feels like turning pages, not bumping down stairs.\n4. **The gap principle** — prefer `gap` on flex/grid containers over per-item margins; it removes doubled edges and keeps spacing symmetrical.\n5. **Group spacing by relationship** — related items close together (`gap: 8px` inside a card), unrelated sections far apart (`padding: 4rem` between sections). Space communicates grouping; consistent space communicates clean design.\n\nWhen in doubt, screenshot your page and squint: the eye catches uneven gutters instantly. A page where every gap comes from the same scale *looks* professional without any decoration.',
        code: ':root {\n  --space-1: 4px;  --space-2: 8px;\n  --space-3: 16px; --space-4: 24px;\n  --space-5: 32px; --space-6: 64px;\n}\n\nbody { line-height: 1.6; }\np { margin-bottom: 1rem; }          /* vertical rhythm */\n\nsection { padding: 4rem 1rem; }      /* even section rhythm */\n\n.card { display: flex; flex-direction: column; gap: var(--space-2); }\n\n.projects .grid { gap: var(--space-4); }\n\n/* Distance signals relationship: tight inside, loose between */',
        note: 'One spacing scale + even section padding = rhythm. Distance communicates grouping; consistency reads as professional.',
      },
      {
        title: 'Breakpoints, Images & the Responsive Check',
        text:
          'Polish means verifying the responsive contract from Section 7 — every layout decision has a width where it changes, and all of them work. The systematic check:\n\n1. **Test the real widths** — open DevTools, use the responsive mode, and drag through 320px, 480px, 768px, 1024px, 1440px. At each width ask: does anything overflow horizontally? Is the text line length sane (roughly 45–75 characters)?\n2. **No horizontal scroll** — the top overflow signal. The usual culprits: a fixed-width element (hard `width: 600px`), a wide image without `max-width: 100%`, or a margin/negative-position pushing content past the viewport.\n3. **Images everywhere** — Section 7\'s rule: `img { max-width: 100%; height: auto; }`. For hero/background images use `background-size: cover` or `object-fit: cover` so they crop, not stretch.\n4. **Type that scales** — headlines via `clamp()`; body text in `rem`, not hard px, so browser zoom and user font settings work.\n5. **Touch targets** — tap targets should be at least 44×44px (Apple/Google guideline). A phone is not a mouse; 12px links are a usability fail.\n\nOne powerful habit: use DevTools to *emulate* a mid-range phone and take the layout seriously — the page most users see is the mobile one. Desktop is the minority on most consumer sites.\n\nThe responsive check is not a single pass — re-run it after every styling change to a layout-bearing element.',
        code: 'img, video {\n  max-width: 100%;\n  height: auto;\n}\n\n@media (min-width: 768px) {\n  .about { display: flex; gap: 2rem; align-items: center; }\n}\n\n@media (min-width: 1024px) {\n  .hero { padding: 6rem 1rem; }\n}\n\n/* Touch targets — at least 44px on phones */\nnav a, button { min-height: 44px; }\n\nh1 { font-size: clamp(1.8rem, 5vw, 3.5rem); } /* fluid headline */',
        note: 'The responsive check at real widths (320/768/1024/1440): no horizontal scroll, fluid images, 44px+ touch targets, clamp() type.',
      },
      {
        title: 'Accessibility: Contrast, Focus & ARIA',
        text:
          'Accessibility (a11y) is not a feature — it is a baseline. The highest-impact fixes are cheap and checkable:\n\n**Colour contrast** — text must stand out from its background. The WCAG guideline is a 4.5:1 contrast ratio for normal text (3:1 for large text). Grey-on-grey "subtle" text is the most common violation. DevTools\' built-in contrast checker (in the colour picker) tells you the ratio instantly — fix any text below 4.5:1.\n\n**Focus visibility** — keyboard users navigate with Tab. The default focus ring (outline) must stay visible. The sin is `outline: none` with nothing replacing it — a keyboard user literally cannot see where they are. Style a visible alternative: `:focus-visible { outline: 3px solid var(--color-primary); }`.\n\n**ARIA and semantics** — use native elements first (a real `<button>` is focusable and announces correctly for free), then add ARIA only where native semantics are missing: `aria-label` on icon-only buttons (`aria-label="Open menu"` on a hamburger), `aria-current="page"` on the active nav link, `role="alert"` on dynamic error messages. "No ARIA is better than bad ARIA" — a wrong role lies to assistive tech.\n\n**Semantic structure** — the landmarks from Section 2 (one `<main>`, proper heading order, labels on inputs) are most of the a11y work already. The skip link from Section 16 completes it.\n\nA quick audit loop: run Lighthouse\'s accessibility section (it flags contrast, missing labels, unlabeled buttons) — it catches most of these in one click.',
        code: '/* Focus must remain visible for keyboard users */\n:focus-visible {\n  outline: 3px solid var(--color-primary);\n  outline-offset: 2px;\n}\n\n/* Icon-only button needs an accessible name */\n<button class="menu-toggle" aria-label="Open menu" aria-expanded="false">&#9776;</button>\n\n/* Current page in nav */\n<nav><a href="index.html" aria-current="page">Home</a></nav>\n\n/* Text colour that passes 4.5:1 on #f8fafc */\n.muted { color: #475569; }   /* not #94a3b8 (too low contrast) */',
        note: 'The a11y trio: 4.5:1 contrast, a visible :focus-visible ring, and native semantics before ARIA. Run Lighthouse a11y to audit.',
      },
      {
        title: 'Performance: Images, Fonts & Minimal JS',
        text:
          'Performance is a feature users feel before anything else — a slow page reads as broken. The highest-leverage wins, cheapest first:\n\n**Images are the #1 weight.** A 3 MB screenshot slows every visit. Fixes: resize to the *display* size (a 1200px card needs no 4000px image), save as WebP/AVIF where possible, and add `loading="lazy"` to below-the-fold images so they download only near view. `srcset` lets one `<img>` serve different sizes to different screens.\n\n**Fonts** — webfonts are often hundreds of KB. Use `font-display: swap` so text renders immediately with a fallback while the font loads (no invisible-text flash). Better: `preload` the font, or lean on system fonts and skip the download entirely.\n\n**CSS/JS weight** — for this vanilla project, keep CSS in one file and JS minimal. Avoid loading libraries for tasks a few lines solve (a modal needs no framework). Unused CSS and JS are pure waste on every page load.\n\n**The numbers** — good budgets for a portfolio: under 1 MB total, fewer than 20 requests, DOM under ~800 nodes. Lighthouse\'s performance score measures this and names your biggest offender — run it after each milestone.\n\n**Caching** — the browser reuses files by default when they do not change; hosting platforms (Section 19) set cache headers for you. The main manual win is naming changed files differently (`style.v2.css`) so users get the update.\n\nShip the smallest thing that works, then measure with Lighthouse and fix what it names.',
        code: '<!-- Lazy, sized, modern-format images -->\n<img\n  src="images/project-1.webp"\n  alt="Screenshot of the weather app"\n  width="800" height="500"\n  loading="lazy"\n  srcset="images/project-1-400.webp 400w, images/project-1-800.webp 800w"\n  sizes="(max-width: 768px) 100vw, 400px"\n>\n\n/* Font that never blocks text rendering */\n@font-face {\n  font-family: "Inter";\n  src: url("inter.woff2") format("woff2");\n  font-display: swap;\n}',
        note: 'Performance order of impact: resize/lazy your images → font-display: swap → trim CSS/JS → run Lighthouse and fix what it names.',
      },
    ],
    quizzes: [
      {
        text: 'Why draw all spacing from one small scale (e.g. 4/8/16/24px)?',
        options: ['it is required by browsers', 'consistent rhythm reads as designed and professional', 'it reduces CSS file size', 'it is the only legal spacing in HTML'],
        correctAnswer: 'consistent rhythm reads as designed and professional',
      },
      {
        text: 'The minimum touch-target size recommended for phones is about…',
        options: ['12px', '44px', '100px', '2px'],
        correctAnswer: '44px',
      },
      {
        text: 'WCAG requires normal body text to have a contrast ratio of at least…',
        options: ['1.5:1', '3:1', '4.5:1', '10:1'],
        correctAnswer: '4.5:1',
      },
      {
        text: 'Removing `outline` on focus without a replacement…',
        options: ['is fine — mouse users never need it', 'makes keyboard navigation invisible and fails accessibility', 'speeds up the page', 'is required by Tailwind'],
        correctAnswer: 'makes keyboard navigation invisible and fails accessibility',
      },
      {
        text: 'What does `font-display: swap` prevent?',
        options: ['the page being cached', 'invisible text while a webfont loads', 'font downloading entirely', 'system font use'],
        correctAnswer: 'invisible text while a webfont loads',
      },
      {
        text: '`loading="lazy"` on an image means…',
        options: ['the image never loads', 'it downloads only when the user scrolls near it', 'it loads on every scroll', 'it is lower quality'],
        correctAnswer: 'it downloads only when the user scrolls near it',
      },
      {
        text: 'Which tool names your biggest performance offender in one run?',
        options: ['WebSocket', 'Lighthouse', 'DevTools Console only', 'npm'],
        correctAnswer: 'Lighthouse',
      },
      {
        text: '`aria-label="Open menu"` on a hamburger button is needed because…',
        options: ['buttons cannot contain text', 'an icon-only button has no visible text for assistive tech to announce', 'aria-label makes the icon animate', 'labels are only for inputs'],
        correctAnswer: 'an icon-only button has no visible text for assistive tech to announce',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 18 — Interactivity & UX Enhancements
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 18,
    title: 'Interactivity & UX Enhancements',
    description:
      'Make the portfolio feel alive: real form validation, smooth navigation, lightbox and modal patterns, and a dark mode that remembers itself.',
    topics: [
      {
        title: 'Client-Side Form Validation',
        text:
          'HTML gives you the first line of validation for free — `required`, `type="email"`, `minlength` — but real UX needs **JavaScript** validation with specific, friendly messages.\n\nThe pattern: listen for `submit` on the form, `preventDefault()` (Section 13), read every field, validate, then either submit or show errors:\n\n```js\nform.addEventListener("submit", (e) => {\n  e.preventDefault();\n  const email = emailInput.value.trim();\n  errors.innerHTML = "";\n  if (!email) return showError("Email is required.");\n  if (!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email))\n    return showError("Enter a valid email address.");\n  // valid → submit (or show success)\n  success.textContent = "Message sent! I will reply soon.";\n  form.reset();\n});\n```\n\nThe regex `^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$` is a simple email shape check — something@something.tld. (Full RFC email validation is a rabbit hole; this catches typos, which is the job.)\n\nValidation UX rules:\n\n1. **Validate on `blur`/`input` for live feedback**, but *always re-validate on submit* — users can submit without blurring.\n2. **Show errors next to the field** and describe the fix ("Email is required"), not just "Invalid input".\n3. **`aria-invalid` and `role="alert"`** on error messages so screen readers announce them.\n4. **Never trust the client** — client validation is UX; the server is the real gate. A backend always re-validates (that is exactly how this course\'s API behaves).\n5. **`trim()` the values** so "  a@b.com  " does not fail or sneak through.\n\nGood validation turns a form from "an error I must guess at" into "a conversation".',
        code: 'const form = document.getElementById("contact-form");\nconst email = document.getElementById("email");\nconst err = document.getElementById("email-error");\n\nemail.addEventListener("blur", () => validateEmail()); // live feedback\n\nform.addEventListener("submit", (e) => {\n  e.preventDefault();\n  if (!validateEmail()) return;   // re-validate on submit\n  successEl.textContent = "Message sent! I will reply soon.";\n  form.reset();\n});\n\nfunction validateEmail() {\n  const value = email.value.trim();\n  if (!value) { err.textContent = "Email is required."; email.setAttribute("aria-invalid", "true"); return false; }\n  if (!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(value)) {\n    err.textContent = "Enter a valid email address.";\n    email.setAttribute("aria-invalid", "true");\n    return false;\n  }\n  err.textContent = "";\n  email.removeAttribute("aria-invalid");\n  return true;\n}',
        note: 'Validate live on blur/input for feedback, but always re-validate on submit. Client validation is UX — the server stays the real gate.',
      },
      {
        title: 'Smooth Scrolling & Scrollspy Navigation',
        text:
          'Anchor links (`#about`) jump instantly; a **smooth scroll** makes the transition feel considered. One CSS line does it:\n\n`html { scroll-behavior: smooth; }`\n\nThat handles every anchor on the page. Two refinements make it production-grade:\n\n1. **Respect reduced motion** — wrap it so motion-preference users keep instant jumps:\n   `@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }`\n2. **Offset for a fixed header** — a fixed nav covers the section top after scrolling. Fix with `scroll-margin-top` on the sections: `section[id] { scroll-margin-top: 4rem; }`.\n\n**Scrollspy** highlights the nav link for the section currently in view — the classic "you are here" indicator. The lightweight vanilla technique uses an Intersection Observer:\n\n```js\nconst sections = document.querySelectorAll("section[id]");\nconst links = document.querySelectorAll("nav a");\nconst spy = new IntersectionObserver((entries) => {\n  entries.forEach((entry) => {\n    if (entry.isIntersecting) {\n      links.forEach(l => l.classList.toggle("active", l.hash === `#${entry.target.id}`));\n    }\n  });\n}, { rootMargin: "-40% 0px -55% 0px" });\nsections.forEach(s => spy.observe(s));\n```\n\nThe observer fires whenever a section crosses the middle band of the viewport (the `rootMargin` trick), and the matching link gets `.active`. The observer approach is preferred over scroll-event listeners — it does not run a handler every pixel, so it is cheap and smooth.\n\nAdd `aria-current="location"` (or keep `aria-current="page"`) on the active link so assistive tech knows too.',
        code: '<style>\n  html { scroll-behavior: smooth; }\n  section[id] { scroll-margin-top: 4rem; }  /* clear fixed nav */\n  nav a.active { color: var(--color-primary); font-weight: 700; }\n</style>\n\n<script>\n  const spy = new IntersectionObserver((entries) => {\n    entries.forEach((entry) => {\n      if (!entry.isIntersecting) return;\n      document.querySelectorAll("nav a").forEach((a) => {\n        const on = a.hash === `#${entry.target.id}`;\n        a.classList.toggle("active", on);\n        if (on) a.setAttribute("aria-current", "location");\n        else a.removeAttribute("aria-current");\n      });\n    });\n  }, { rootMargin: "-40% 0px -55% 0px" });\n  document.querySelectorAll("section[id]").forEach((s) => spy.observe(s));\n</script>',
        note: 'scroll-behavior: smooth + scroll-margin-top for the fixed nav; scrollspy via IntersectionObserver (cheap) instead of a scroll listener.',
      },
      {
        title: 'Lightbox & Modal Patterns',
        text:
          'A **modal** is a focused overlay for one action (image preview, confirmation). The accessible pattern has strict rules:\n\n**Structure** — a backdrop `<div class="overlay">` plus the dialog `<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">`. Opening it: unhide it, move focus *into* the dialog. Closing: Escape key, a close button, or a click on the backdrop — then return focus to the element that opened it.\n\n**Focus trap** — the hard part: Tab inside a modal must stay inside it (otherwise keyboard users tab into the page behind). A minimal trap: on Tab, if focus would leave the dialog, wrap it to the first/last focusable element.\n\n**Scroll lock** — while open, lock the background: `body { overflow: hidden }` on open, restore on close.\n\n**A lightbox** is just a modal for images: clicking a thumbnail opens a large version. Build it with the same skeleton — a `<figure>` inside a dialog containing the full-size `<img>` and a caption.\n\nThe open/close mechanics in vanilla JS:\n\n```js\nconst dialog = document.getElementById("lightbox");\nconst closeBtn = dialog.querySelector(".close");\n\nfunction openLightbox(src, caption) {\n  imgEl.src = src; imgEl.alt = caption;\n  dialog.hidden = false;\n  document.body.style.overflow = "hidden";\n  closeBtn.focus();               // move focus INTO the dialog\n}\nfunction closeLightbox() {\n  dialog.hidden = true;\n  document.body.style.overflow = "";\n  lastFocused.focus();            // return focus\n}\ncloseBtn.addEventListener("click", closeLightbox);\ndialog.addEventListener("click", (e) => { if (e.target === dialog) closeLightbox(); });\ndocument.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });',
        code: '<div id="lightbox" class="overlay" hidden role="dialog" aria-modal="true" aria-labelledby="lb-title">\n  <div class="dialog">\n    <button class="close" aria-label="Close">&#10005;</button>\n    <img id="lb-img" src="" alt="">\n    <p id="lb-caption"></p>\n  </div>\n</div>',
        note: 'Modal rules: focus moves in on open, stays trapped (Tab), returns on close; Escape closes; background scroll locks while open.',
      },
      {
        title: 'Dark Mode with localStorage',
        text:
          'A dark mode toggle is the classic "alive" feature — and the whole trick is **persistence**: the choice must survive a reload.\n\nThe plan: a toggle button flips a class on `<html>` (`data-theme="dark"`), CSS variables swap their values, and the choice is saved in `localStorage` and read back on load.\n\n**CSS** — because Section 15 put colours in variables, dark mode is one block:\n\n```css\n:root { --bg: #f8fafc; --text: #0f172a; }\n[data-theme="dark"] { --bg: #0f172a; --text: #f8fafc; }\nbody { background: var(--bg); color: var(--text); }\n```\n\n**JS** — the toggle + persistence:\n\n```js\nconst root = document.documentElement;\nconst saved = localStorage.getItem("theme");\nif (saved) root.setAttribute("data-theme", saved);\n// also respect the OS preference as a default:\nelse if (window.matchMedia("(prefers-color-scheme: dark)").matches)\n  root.setAttribute("data-theme", "dark");\n\ntoggle.addEventListener("click", () => {\n  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";\n  root.setAttribute("data-theme", next);\n  localStorage.setItem("theme", next);\n});\n```\n\nThe order matters: load *before* the page paints (a script in `<head>`) so there is no flash of the wrong theme.\n\n**Flash-of-wrong-theme prevention** — put the theme-apply script early and small. The moment `data-theme` is set on `<html>`, CSS variables react instantly.\n\n`localStorage` stores strings only — `getItem`/`setItem` — and it is per-origin, so it persists across reloads but is separate for every site. It is the right tool for tiny preferences like this (not for sensitive data — that lives on the server).',
        code: '<script>\n  // Run early in <head> to avoid a flash of the wrong theme\n  const root = document.documentElement;\n  const saved = localStorage.getItem("theme");\n  const osDark = window.matchMedia("(prefers-color-scheme: dark)").matches;\n  root.setAttribute("data-theme", saved || (osDark ? "dark" : "light"));\n\n  const toggle = document.getElementById("theme-toggle");\n  toggle.addEventListener("click", () => {\n    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";\n    root.setAttribute("data-theme", next);\n    localStorage.setItem("theme", next);\n  });\n</script>',
        note: 'localStorage persists the choice across reloads; set data-theme on <html> early so CSS variables swap with zero flash.',
      },
    ],
    quizzes: [
      {
        text: 'Client-side validation is primarily about…',
        options: ['security — the only gate needed', 'UX — giving users immediate, friendly feedback; the server still validates', 'replacing the backend', 'database integrity'],
        correctAnswer: 'UX — giving users immediate, friendly feedback; the server still validates',
      },
      {
        text: 'In a modal, focus must…',
        options: ['stay on the button that opened it', 'move into the dialog on open, be trapped inside, and return on close', 'never move', 'move to the browser address bar'],
        correctAnswer: 'move into the dialog on open, be trapped inside, and return on close',
      },
      {
        text: 'To lock background scrolling while a modal is open…',
        options: ['set body { overflow: hidden } and restore it on close', 'use position: sticky', 'hide the background entirely', 'stop the scroll event'],
        correctAnswer: 'set body { overflow: hidden } and restore it on close',
      },
      {
        text: 'Why load the theme script early in <head>?',
        options: ['so CSS variables compile', 'to set data-theme before paint and avoid a flash of the wrong theme', 'so the browser caches it', 'localStorage requires head placement'],
        correctAnswer: 'to set data-theme before paint and avoid a flash of the wrong theme',
      },
      {
        text: 'What does `localStorage.getItem("theme")` return if nothing was saved?',
        options: ['false', 'null', '""', 'undefined'],
        correctAnswer: 'null',
      },
      {
        text: 'The scrollspy technique recommended over a scroll listener is…',
        options: ['setInterval', 'IntersectionObserver', 'WebSocket', 'requestAnimationFrame only'],
        correctAnswer: 'IntersectionObserver',
      },
      {
        text: 'Adding `scroll-margin-top` to sections fixes what problem?',
        options: ['page load speed', 'anchor jumps landing under a fixed header', 'modal focus', 'font loading'],
        correctAnswer: 'anchor jumps landing under a fixed header',
      },
      {
        text: 'A simple email-shape check catches…',
        options: ['whether an address really exists', 'typos like "avi@example" missing a dot', 'whether the server accepts mail', 'password strength'],
        correctAnswer: 'typos like "avi@example" missing a dot',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 19 — Git, Hosting & Deployment
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 19,
    title: 'Git, Hosting & Deployment',
    description:
      'Version control, branches and .gitignore, then pushing the portfolio live to modern static hosting with a custom domain.',
    topics: [
      {
        title: 'Version Control Basics: init, add & commit',
        text:
          '**Git** is a version-control system — it snapshots your project at each commit so you can compare, roll back, and collaborate without fear. Every professional frontend project lives in a Git repository.\n\nThe core loop:\n\n```bash\ngit init                 # create a repo in this folder\ngit add index.html css js images   # stage files (or git add .)\ngit commit -m "Add portfolio skeleton"  # snapshot with a message\n```\n\nThree concepts to keep straight:\n\n- **Working directory** — the files you edit.\n- **Staging area** — files marked for the next snapshot (`git add`).\n- **Repository** — the history of snapshots (`git commit`).\n\nThe workflow is: edit → `git add` → `git commit`. Check state anytime with `git status` (what changed), and `git log` to see history.\n\nWrite **commit messages that explain why**, in the present tense: "Add responsive projects grid", "Fix contact form validation". A future reader (you, in three months) reads the log like a changelog.\n\n`git diff` shows unstaged changes before you commit — review it before every commit so you never commit debugging leftovers. And remember: **git commits locally** — nothing leaves your machine until you `git push` to a remote (next topics). Committing often and committing early is the safety net that makes experimentation cheap: a broken experiment is one `git checkout` away.',
        code: '# One commit loop\ncd portfolio\ngit init\ngit add index.html css/style.css js/main.js\n\n# See what is staged/changed before committing\ngit status\ngit diff --stat\n\ngit commit -m "Add portfolio skeleton with four sections"\n\n# Review history\ngit log --oneline',
        note: 'The three areas: working → staged (git add) → committed (git commit). Commit often, with messages that explain WHY.',
      },
      {
        title: 'Branches, Merging & .gitignore',
        text:
          'A **branch** is a separate line of development. The default is `main`; the habit is to create a branch for each feature, work there, and merge it back when done — so `main` always stays deployable.\n\n```bash\ngit branch feature-nav      # create a branch\ngit switch feature-nav      # switch to it\ngit checkout -b feature-nav # create AND switch in one step\n# …work and commit…\ngit switch main             # back to main\ngit merge feature-nav       # bring the feature in\n```\n\nBranches are cheap and encourage experiment: try a redesign on `feature-redesign`, and if it fails, delete the branch — `main` never saw it.\n\n**Merging** folds one branch into another. If two branches changed the same lines differently, git reports a **conflict** — you must edit the file to decide which change wins, then commit. Conflicts are normal, not failures; the conflicted markers (`<<<<<<<`, `=======`, `>>>>>>>`) show both versions side by side.\n\n**`.gitignore`** tells git which files to *never* track — generated junk that should not be in history:\n\n```\nnode_modules/\ndist/\n*.log\n.DS_Store\n.env\n```\n\nIgnoring `.env` matters for security — it may hold API keys. Ignoring `node_modules` keeps repos small. If you ever see a huge repo or a committed secret, `.gitignore` is the missing discipline.\n\nA remote (GitHub) is a second copy: `git remote add origin <url>`, then `git push -u origin main` to back up, and `git pull` to fetch others\' changes. `git status` reminds you when you are ahead/behind.',
        code: '# .gitignore — never track these\ndist/\nnode_modules/\n.env\n*.log\n.DS_Store\n\n# Feature branch workflow\ngit checkout -b feature-dark-mode\ngit add .\ngit commit -m "Add dark mode toggle"\ngit switch main\ngit merge feature-dark-mode\n\n# Push to GitHub for the first time\ngit remote add origin https://github.com/you/portfolio.git\ngit push -u origin main',
        note: 'Branch per feature, merge into main when stable. .gitignore keeps node_modules, logs and .env (secrets!) out of history.',
      },
      {
        title: 'Deploying to Modern Static Hosting',
        text:
          'A static site (plain HTML/CSS/JS) deploys to **static hosting** — the platform serves your files over HTTPS from a CDN (content delivery network, servers worldwide) and re-deploys when you push to Git.\n\nThe three mainstream options:\n\n- **GitHub Pages** — free, tied to your GitHub account. Push your repo, enable Pages in settings, and get `username.github.io/portfolio`. Ideal for learning, HTTPS included, no credit card.\n- **Netlify** — free tier, deploys from any Git push (continuous deployment), one-click. Has a drag-and-drop deploy for local folders too.\n- **Vercel** — similar, popular with frontend developers, free for personal projects.\n\nThe Netlify/Vercel flow (continuous deployment):\n\n1. Push the repo to GitHub.\n2. Connect the repo on Netlify/Vercel ("New site → Import from Git").\n3. Set build settings if any (for a plain static site, none).\n4. Every `git push` to `main` automatically builds and ships a new version — the deploy happens without you touching a server.\n\nThe reasons to prefer these over raw FTP to a server: HTTPS certificates are automatic, the CDN makes the site fast everywhere, and rollback is one click in the dashboard (they keep every deploy).\n\nFor this vanilla portfolio there is no build step — you can even drag-and-drop the folder. But connecting the Git repo is the professional habit, because it ties deployment to your version control (next topic).',
        code: '# Steps on Netlify (same shape on Vercel)\n# 1. Repo already on GitHub:\n#    git remote add origin https://github.com/you/portfolio.git\n#    git push -u origin main\n#\n# 2. netlify.com → Add new site → Import an existing project → pick the repo.\n# 3. Build command: (empty for static)   Publish directory: . (root)\n# 4. Deploy → every future push redeploys automatically.\n#\n# Alternative without Git: drag-and-drop the folder at app.netlify.com/drop',
        note: 'Static hosting (Netlify/Vercel/GitHub Pages) = HTTPS + CDN + one-click rollbacks. Connect the Git repo for auto-deploys.',
      },
      {
        title: 'Custom Domains & the Deploy Pipeline',
        text:
          'A custom domain (`myportfolio.dev`) turns a hosted folder into a branded site. The flow is the same everywhere:\n\n1. **Buy/point the domain** — at your registrar, change the DNS to point at the host. Netlify/Vercel each provide a target: for Netlify, add `A` records for the apex domain and a `CNAME` for `www`.\n2. **Tell the host** — in Netlify: Site settings → Domain management → Add custom domain. The host verifies the DNS record and issues an HTTPS certificate automatically (Let\'s Encrypt).\n3. **Verify** — wait for DNS propagation (minutes to hours) and the site answers on your domain over `https://`.\n\nThe "deploy pipeline" is the discipline that turns pushes into production: **every push to `main` redeploys** (the platforms do this by default), and pull requests get *preview deploys* — Netlify/Vercel build each PR at its own temporary URL, so you can review before merging.\n\nA tiny but vital habit: **deploy early and often**. Push the skeleton in Section 16 as soon as it renders — a live link changes everything (friends can open it, you can show a teacher). Then each feature commit ships a new version. Waiting until "it is finished" is how projects stay un-deployed forever.\n\nFinally, keep the domain list honest: `https://` (never a raw IP), a working favicon, and a `404.html` or custom not-found page — small polish that makes a deployed site feel finished.',
        code: '# Custom domain on Netlify — DNS records at your registrar\n# Apex (myportfolio.dev):\n#   A     @           75.2.60.5        (Netlify load balancer)\n# WWW:\n#   CNAME  www        myportfolio.netlify.app\n\n# After DNS points, add the domain in Netlify:\n#   Site config → Domain management → Add custom domain → myportfolio.dev\n# HTTPS is issued automatically (Let’s Encrypt).\n\n# Deploy early: push the skeleton as soon as it renders, then iterate.\ngit add .\ngit commit -m "Deploy skeleton"\ngit push origin main   # → auto-redeploys',
        note: 'Custom domain = registrar DNS records pointing at your host + add the domain there; HTTPS is issued automatically.',
      },
    ],
    quizzes: [
      {
        text: 'The correct Git staging workflow order is…',
        options: ['commit → add → edit', 'edit → git add → git commit', 'git commit → git add → edit', 'git push → git commit'],
        correctAnswer: 'edit → git add → git commit',
      },
      {
        text: 'What does `git add` do?',
        options: ['creates a snapshot permanently', 'moves changed files into the staging area for the next commit', 'pushes to GitHub', 'deletes untracked files'],
        correctAnswer: 'moves changed files into the staging area for the next commit',
      },
      {
        text: 'The purpose of `.gitignore` is…',
        options: ['to delete files from disk', 'to keep generated/sensitive files (node_modules, .env) out of version control', 'to make git faster', 'to hide files from users'],
        correctAnswer: 'to keep generated/sensitive files (node_modules, .env) out of version control',
      },
      {
        text: 'In a feature-branch workflow, what stays true about `main`?',
        options: ['full of experiments', 'always deployable — features merge back when stable', 'private', 'empty'],
        correctAnswer: 'always deployable — features merge back when stable',
      },
      {
        text: 'A git merge CONFLICT means…',
        options: ['git is broken', 'two branches changed the same lines differently and you must choose', 'the repo is corrupted', 'you must delete a branch'],
        correctAnswer: 'two branches changed the same lines differently and you must choose',
      },
      {
        text: 'Which is NOT true about Netlify/Vercel/GitHub Pages?',
        options: ['they serve over HTTPS with automatic certificates', 'every push to main can auto-redeploy', 'they require a credit card and a private server', 'they keep deploy history for rollback'],
        correctAnswer: 'they require a credit card and a private server',
      },
      {
        text: 'What do preview deploys on pull requests enable?',
        options: ['run tests locally only', 'review a build of the PR at its own URL before merging', 'skip version control', 'push to production directly'],
        correctAnswer: 'review a build of the PR at its own URL before merging',
      },
      {
        text: 'Why push the skeleton to deploy as early as possible?',
        options: ['deploys are irreversible', 'a live link lets people view it and iterate in small shipping steps', 'hosting is temporary', 'git requires it'],
        correctAnswer: 'a live link lets people view it and iterate in small shipping steps',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 20 — Final Project Review & Certification
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 20,
    title: 'Final Project Review & Certification',
    description:
      'The last mile: a systematic review checklist, cross-device testing, a Lighthouse audit, and the road map to the certification exam.',
    topics: [
      {
        title: 'The Code Review Checklist',
        text:
          'Before calling the project done, review it with a checklist — the same kind of pass a professional does before a merge. Read the code as if a stranger wrote it:\n\n**HTML**\n- Exactly one `<h1>`, headings in order (no skips).\n- One `<main>`, semantic tags used, no `<div>` soup.\n- Every `<img>` has `alt`; every input has a `<label>`.\n- All links work (`href` correct, `target="_blank"` has `rel="noopener"`).\n\n**CSS**\n- Colours/fonts/spacing from tokens, no stray magic values.\n- `box-sizing: border-box` reset present.\n- No `outline: none` without a `:focus-visible` replacement.\n- Responsive at 320/768/1024/1440 — no horizontal scroll.\n\n**JavaScript**\n- No `console.log` debugging leftovers, no commented-out dead code.\n- `===` used consistently, variables with `const`/`let` (no `var`).\n- All promises/fetches have `.catch` or `try/catch` — no silent failures.\n- User content inserted with `textContent`, never raw `innerHTML`.\n\n**Project hygiene**\n- `.gitignore` present, no secrets or `node_modules` committed.\n- A README that says what the project is and how to run it.\n\nReviewing catches the embarrassments (a broken link, a leftover `console.log`) that turn a good build into a sloppy submission. If you can, ask one classmate to click through it — a fresh pair of eyes finds what your own eyes skip.',
        code: '<!-- review-checklist.md -->\n## HTML\n- [ ] one h1, ordered headings\n- [ ] one main, semantic tags\n- [ ] img alt + input labels\n- [ ] links work; _blank has rel="noopener"\n\n## CSS\n- [ ] tokens, no magic values\n- [ ] box-sizing reset\n- [ ] visible :focus-visible\n- [ ] responsive, no horizontal scroll\n\n## JS\n- [ ] no console.log / dead code\n- [ ] const/let only, === everywhere\n- [ ] every fetch has error handling\n- [ ] textContent, not raw innerHTML\n\n## Hygiene\n- [ ] .gitignore, no secrets committed\n- [ ] README present',
        note: 'Review code as if a stranger wrote it. The checklist catches broken links, dead console.logs, and missed labels before anyone else sees them.',
      },
      {
        title: 'Testing Across Devices & Browsers',
        text:
          'A page that works in your desktop Chrome still needs a **cross-device pass** — most visitors are on phones, and browsers differ.\n\nThe practical test ladder, cheapest first:\n\n1. **DevTools responsive mode** — 320px, 375px, 768px, 1024px, 1440px. Test interactivity (nav toggle, form, modal) at each width, not just the layout.\n2. **Real mobile browser** — open the deployed URL on your actual phone. DevTools emulates well but touch, scrolling feel, and font sizes are only real on a device. Bonus: test portrait AND landscape.\n3. **Second browser** — open it in Firefox and Safari (or at least Edge). Rendering differences are rare in 2026, but `flex`/`grid` bugs and odd font behaviour still appear. Test on the browser your audience uses.\n4. **Input method** — click with a mouse *and* navigate with the keyboard only (Tab, Enter, Escape). Keyboard navigation finds focus bugs, missing labels, and trap bugs immediately.\n5. **Zoom** — browsers zoom pages to 200% and even 400% for low-vision users. The layout should reflow, not break.\n\nDuring the test, keep a short issue log (device, width, bug) — fixing a list of five concrete problems beats re-testing aimlessly.\n\nThe honest truth: you cannot test every device, but the ladder above covers 99% of what breaks. Automation (real browser testing) is a later-career topic; the manual ladder is the right scope for this project.',
        code: '# Cross-device test log\n| Device | Width | What broke |\n|--------|-------|-----------|\n| iPhone SE | 375px | nav toggle missing |\n| Firefox desktop | 1280px | grid card overflow on hover |\n| Keyboard only | —    | modal focus not trapped |\n| Zoom 200%   | —    | hero text clipped |\n\n# Fix in order of severity, then re-test each case.',
        note: 'Test ladder: DevTools widths → real phone → second browser → keyboard-only → zoom. Log concrete bugs, fix the list, re-test.',
      },
      {
        title: 'The Performance & Accessibility Audit',
        text:
          'The final quality gate is a formal **audit** — Lighthouse (in Chrome DevTools → Lighthouse) scores four areas: Performance, Accessibility, Best Practices, SEO.\n\nRun it, then read the *specific* failures — the tool tells you exactly what to fix:\n\n- **Performance** — look for "Reduce initial server response time", "Properly size images", "Eliminate render-blocking resources". Each failure links to the offending asset.\n- **Accessibility** — "Elements must have sufficient color contrast", "Form elements must have labels", "Buttons must have discernible text". These map 1:1 to the checklist items above.\n- **Best Practices** — "No browser errors logged to console", "Ensure CSP is effective" (a security header the host sets).\n- **SEO** — "Document has a meta description", "Image elements have explicit width and height".\n\nFix the failures and re-run until **Performance and Accessibility both score 90+** — that is a realistic, defensible bar for the certification submission.\n\nTwo audit habits worth keeping:\n\n1. **Audit in a normal condition** — close other tabs, use a fresh incognito window (so extensions do not skew the score), and test the *deployed* URL, not `localhost`.\n2. **Re-audit after big changes** — performance regressions sneak in one image at a time.\n\nThe audit is not a certification ceremony — it is a bug list with priorities. Treat the 90+ pass as the definition of done you wrote in Section 15.',
        code: '# How to audit\n# 1. Open the deployed URL in Chrome.\n# 2. DevTools → Lighthouse (top-left panel).\n# 3. Categories: Performance, Accessibility, Best Practices, SEO.\n# 4. Run; read each failed check; fix; re-run.\n\n# Targets for the submission\nPerformance: 90+\nAccessibility: 90+\nBest Practices: 90+\nSEO: 90+\n\n# Common fixes the audit names\n# - resize/compress images\n# - add meta description\n# - explicit width/height on images\n# - fix contrast ratios\n# - no console errors',
        note: 'Lighthouse gives you a prioritized bug list. Targets: Performance and Accessibility 90+. Audit the deployed URL in a fresh window.',
      },
      {
        title: 'Certification Prep & What Comes Next',
        text:
          'The certification exam (the course final) tests the whole arc: HTML structure and semantics, CSS layout and responsiveness, JavaScript behaviour, and a deployed project. How to prepare in the last stretch:\n\n1. **Rebuild the portfolio from scratch, from memory** — no notes, just the wireframe. The rebuild exposes every gap; the first build took hours because every concept was new, the second takes minutes because the patterns have sunk in. That difference is the learning.\n2. **Drill the concept list** — for each section, be able to answer in one sentence: What does `box-sizing: border-box` do? Why is `textContent` safer than `innerHTML`? What is event bubbling? One-sentence answers are exactly what interviews and exams probe.\n3. **Re-do the quizzes** — the Section 1–20 chapter quizzes are the syllabus; a clean pass on each means you can explain, not just recognise.\n4. **Polish the deliverable** — the deployed portfolio *is* part of the submission. Re-run the Lighthouse audit, re-test on your phone, and fix the last contrast or focus issue.\n5. **Write a short README** — what you built, what stack, how to run it locally, what you learned. It is the professional finishing touch.\n\nWhat comes next after certification: the natural path is JavaScript frameworks (React — the exact stack this course\'s frontend uses), then consuming real APIs, then the backend (Node) so you can build full products. Every one of those builds on the HTML/CSS/JS fundamentals you now have.\n\nYou did not just learn three languages — you learned how the web turns structure, style and behaviour into a page, and you shipped one.',
        code: '# Final revision — one-sentence drills\n# HTML: Why one <main>?  →  It marks the unique core content (a11y + SEO).\n# CSS: What is rem?      →  A unit relative to the root font size.\n# Flexbox: justify vs align → justify = main axis, align = cross axis.\n# JS: Why === ?          →  Compares value AND type; no coercion surprises.\n# JS: Why textContent?   →  Never parses HTML → no XSS.\n# Async: fetch + res.ok  →  fetch only rejects on network failure; check res.ok.\n# Deploy: static host    →  HTTPS + CDN + auto-deploy on git push.',
        note: 'Rebuild from memory to expose gaps, drill one-sentence explanations, redo the chapter quizzes, and ship the audited portfolio.',
      },
    ],
    quizzes: [
      {
        text: 'Why should the HTML review check that every image has `alt`?',
        options: ['it compresses the image', 'it provides accessible text and fallback content', 'it is only for SEO', 'it speeds up rendering'],
        correctAnswer: 'it provides accessible text and fallback content',
      },
      {
        text: 'A console.log left in production code…',
        options: ['is harmless and normal', 'is reviewable dead code that should be removed before shipping', 'improves performance', 'is required for deployment'],
        correctAnswer: 'is reviewable dead code that should be removed before shipping',
      },
      {
        text: 'Why test on a REAL phone and not only DevTools responsive mode?',
        options: ['DevTools lies about layout', 'touch feel, scrolling and real font sizes only appear on hardware', 'phones are faster', 'browsers block DevTools'],
        correctAnswer: 'touch feel, scrolling and real font sizes only appear on hardware',
      },
      {
        text: 'Testing with keyboard only (Tab/Enter/Escape) is the best way to uncover…',
        options: ['colour palette issues', 'focus bugs, missing labels and modal trap failures', 'image compression problems', 'DNS issues'],
        correctAnswer: 'focus bugs, missing labels and modal trap failures',
      },
      {
        text: 'What Lighthouse score should you target for the submission?',
        options: ['50 for everything', '90+ on Performance and Accessibility', 'any score — it is decorative', 'exactly 100 on SEO only'],
        correctAnswer: '90+ on Performance and Accessibility',
      },
      {
        text: 'How should you run Lighthouse for a trustworthy score?',
        options: ['on localhost with extensions open', 'on the deployed URL in a fresh window without extensions', 'in a screenshot tool', 'on the raw HTML file'],
        correctAnswer: 'on the deployed URL in a fresh window without extensions',
      },
      {
        text: 'Which revision exercise exposes gaps most effectively?',
        options: ['reading the notes once', 'rebuilding the portfolio from memory to expose gaps', 'watching more tutorials', 'copying another project'],
        correctAnswer: 'rebuilding the portfolio from memory to expose gaps',
      },
      {
        text: 'A README on the final project should…',
        options: ['be skipped — code speaks for itself', 'state what it is, the stack, how to run it, and what was learned', 'contain only the license', 'list every git commit'],
        correctAnswer: 'state what it is, the stack, how to run it, and what was learned',
      },
    ],
  },
];

// ============================================================================
// Web Design — Final Exam (15 distinct questions)
// ============================================================================
export interface WDFinalExamQuestion {
  text: string;
  options: string[]; // exactly 4
  correctAnswer: string; // one of options
}

export const webdesignFinalExam: WDFinalExamQuestion[] = [
  {
    text: 'A visitor opens your site on a 320px phone and the page scrolls horizontally. The MOST likely cause is…',
    options: [
      'an image without max-width: 100% or a fixed-width element',
      'too much padding on the body',
      'the site uses too many fonts',
      'missing meta description',
    ],
    correctAnswer: 'an image without max-width: 100% or a fixed-width element',
  },
  {
    text: 'Which property is measured from the OUTSIDE of the border and pushes other elements away?',
    options: ['padding', 'margin', 'content-width', 'border-width'],
    correctAnswer: 'margin',
  },
  {
    text: '`const el = document.querySelector(".card");` — if nothing matches, `el` is…',
    options: ['undefined', 'null', 'false', 'an empty array'],
    correctAnswer: 'null',
  },
  {
    text: 'Why must a fetch() result be checked with `res.ok` before parsing?',
    options: [
      'the promise rejects on every HTTP error',
      'fetch only rejects on network failure — a 404 still resolves, so res.ok catches it',
      'res.ok is required for CORS',
      'parsing fails without it',
    ],
    correctAnswer: 'fetch only rejects on network failure — a 404 still resolves, so res.ok catches it',
  },
  {
    text: 'The mobile-first order in a stylesheet means…',
    options: [
      'base styles target phones; min-width queries ADD layout for bigger screens',
      'max-width queries come first',
      'desktop styles are the base',
      'media queries are forbidden',
    ],
    correctAnswer: 'base styles target phones; min-width queries ADD layout for bigger screens',
  },
  {
    text: 'Which is the accessible, semantic way to mark up a navigation menu?',
    options: ['<div class="menu">', '<nav><ul><li><a>…</a></li></ul></nav>', '<span id="nav">', '<p role="menu">'],
    correctAnswer: '<nav><ul><li><a>…</a></li></ul></nav>',
  },
  {
    text: 'Which pair of CSS properties gives you smooth motion WITHOUT forcing reflow every frame?',
    options: ['width / height', 'transform / opacity', 'margin / padding', 'top / left'],
    correctAnswer: 'transform / opacity',
  },
  {
    text: '`[10, 2, 30].sort()` (no comparator) returns…',
    options: [
      '[2, 10, 30]',
      '[10, 2, 30] — lexical (string) order',
      'NaN',
      '[30, 2, 10]',
    ],
    correctAnswer: '[10, 2, 30] — lexical (string) order',
  },
  {
    text: 'Putting user-supplied text into the page with `element.innerHTML = userInput` risks…',
    options: ['a slower page', 'cross-site scripting (XSS) if the input contains HTML/scripts', 'layout overflow', 'browser crashes'],
    correctAnswer: 'cross-site scripting (XSS) if the input contains HTML/scripts',
  },
  {
    text: 'Why use `const` for most variables?',
    options: [
      'it is faster than let',
      'it forbids reassignment, encoding intent and preventing accidents',
      'it is the only legal keyword',
      'it makes variables global',
    ],
    correctAnswer: 'it forbids reassignment, encoding intent and preventing accidents',
  },
  {
    text: 'An event listener on a `<form>` should listen for which event to catch the submit button?',
    options: ['click', 'submit', 'change', 'enter'],
    correctAnswer: 'submit',
  },
  {
    text: '`grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))` gives you…',
    options: [
      'exactly three columns',
      'a responsive grid that wraps based on available space',
      'a single flex row',
      'an absolute-positioned layout',
    ],
    correctAnswer: 'a responsive grid that wraps based on available space',
  },
  {
    text: 'The professional pattern to persist a theme choice across reloads is…',
    options: [
      'a cookie set by the server only',
      'localStorage, read early and applied before paint',
      'a global JavaScript variable',
      'a CSS import',
    ],
    correctAnswer: 'localStorage, read early and applied before paint',
  },
  {
    text: 'In the flexbox model, `justify-content` aligns items along the…',
    options: ['cross axis', 'main axis', 'z-axis', 'diagonal'],
    correctAnswer: 'main axis',
  },
  {
    text: 'The single most important reason to deploy early and often is…',
    options: [
      'deployments are irreversible',
      'a live link makes the project reviewable and forces small shipping steps',
      'hosts charge per deploy',
      'git requires it',
    ],
    correctAnswer: 'a live link makes the project reviewable and forces small shipping steps',
  },
];

