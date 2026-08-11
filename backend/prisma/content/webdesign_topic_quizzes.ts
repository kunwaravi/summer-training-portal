// ============================================================================
// Web Design & Frontend Development — Per-Topic Quizzes
// ----------------------------------------------------------------------------
// The frontend topic-lock flow requires EVERY topic to have its own attached
// quiz questions: CourseDetail navigates to /quiz/:id/:week/:topicId and
// getTopicQuizQuestions() returns null when a topic has zero questions, which
// 404s and locks that topic and every later topic. This map is keyed by the
// EXACT topic titles used in content/webdesign.ts and gives each one 4
// distinct questions (4 options, exactly 1 correct).
// ============================================================================

export interface WDTopicQuiz {
  text: string;
  options: string[]; // exactly 4
  correctAnswer: string; // one of options
}

export const webdesignTopicQuizzes: Record<string, WDTopicQuiz[]> = {
  // ── Section 1 — Introduction to HTML5 & Web Fundamentals ──────────────
  'How the Web Works: Browsers, Servers & HTTP': [
    {
      text: 'The browser (client) gets a page by sending a request to a…',
      options: ['database', 'server', 'printer', 'router table'],
      correctAnswer: 'server',
    },
    {
      text: 'Which HTTP method asks the server for a resource like a page or image?',
      options: ['POST', 'GET', 'PUT', 'DELETE'],
      correctAnswer: 'GET',
    },
    {
      text: 'Which HTTP status code means "resource not found"?',
      options: ['200', '301', '404', '500'],
      correctAnswer: '404',
    },
    {
      text: 'Where can you watch every HTTP request a page makes in real time?',
      options: ['the browser Network tab (F12)', 'the operating system settings', 'the HTML source only', 'the file manager'],
      correctAnswer: 'the browser Network tab (F12)',
    },
  ],
  'What Is HTML? Structure vs Presentation': [
    {
      text: 'Which layer of a webpage decides the MEANING of content (what is a heading, what is a list)?',
      options: ['CSS', 'JavaScript', 'HTML', 'HTTP'],
      correctAnswer: 'HTML',
    },
    {
      text: 'Which layer decides colour, spacing and font?',
      options: ['HTML', 'CSS', 'JavaScript', 'The server'],
      correctAnswer: 'CSS',
    },
    {
      text: 'Is HTML a programming language?',
      options: [
        'Yes — it has variables and loops',
        'No — it is a markup language for describing structure',
        'Yes — it computes arithmetic',
        'No — it is a styling language',
      ],
      correctAnswer: 'No — it is a markup language for describing structure',
    },
    {
      text: 'What does the browser expose so JavaScript can interact with the HTML structure?',
      options: ['the CSS cascade', 'the DOM (Document Object Model)', 'the HTTP header', 'the URL bar'],
      correctAnswer: 'the DOM (Document Object Model)',
    },
  ],
  'Anatomy of an HTML Element': [
    {
      text: 'In `<p class="intro">Hi</p>`, what is `class="intro"` called?',
      options: ['a closing tag', 'an attribute', 'an element name', 'a void marker'],
      correctAnswer: 'an attribute',
    },
    {
      text: 'Which of these is a VOID element (no closing tag)?',
      options: ['<p>', '<div>', '<br>', '<h1>'],
      correctAnswer: '<br>',
    },
    {
      text: 'A BOOLEAN attribute (true just by being present) example is…',
      options: ['class', 'id', 'disabled', 'href'],
      correctAnswer: 'disabled',
    },
    {
      text: 'Why must `<img>` always carry an `alt` attribute?',
      options: [
        'it compresses the image',
        'it provides alternative text for screen readers and broken images',
        'it sets the image width',
        'it is required for caching',
      ],
      correctAnswer: 'it provides alternative text for screen readers and broken images',
    },
  ],
  'Your First HTML Page: DOCTYPE, head & body': [
    {
      text: 'What does `<!DOCTYPE html>` prevent?',
      options: ['slow loading', 'quirks mode rendering with legacy buggy rules', 'the page being indexed', 'CSS applying'],
      correctAnswer: 'quirks mode rendering with legacy buggy rules',
    },
    {
      text: 'Which `<head>` child is REQUIRED for responsive mobile design?',
      options: ['<meta name="viewport">', '<meta name="author">', '<link rel="icon">', '<style>'],
      correctAnswer: '<meta name="viewport">',
    },
    {
      text: 'Content visible to the user lives in…',
      options: ['<head>', '<body>', '<title>', 'the doctype'],
      correctAnswer: '<body>',
    },
    {
      text: 'Why add `lang="en"` to the `<html>` tag?',
      options: [
        'it speeds up loading',
        'it tells search engines and assistive tech the content language',
        'it is required for UTF-8',
        'it enables the viewport',
      ],
      correctAnswer: 'it tells search engines and assistive tech the content language',
    },
  ],

  // ── Section 2 — HTML Semantic Tags & Structure ────────────────────────
  'Semantic vs Non-Semantic Elements': [
    {
      text: 'Which element is SEMANTIC?',
      options: ['<div>', '<span>', '<article>', '<b>'],
      correctAnswer: '<article>',
    },
    {
      text: 'Why do screen readers and search engines care about semantic tags?',
      options: ['they change the font', 'they expose page landmarks and structure', 'they disable images', 'they speed up CSS'],
      correctAnswer: 'they expose page landmarks and structure',
    },
    {
      text: 'Which tag is the generic layout box with NO meaning?',
      options: ['<header>', '<section>', '<div>', '<footer>'],
      correctAnswer: '<div>',
    },
    {
      text: 'A blog post that makes sense on its own, out of context, should use…',
      options: ['<div>', '<article>', '<aside>', '<span>'],
      correctAnswer: '<article>',
    },
  ],
  'Building a Page with Layout Landmarks': [
    {
      text: 'How many `<main>` elements should a page have?',
      options: ['as many as sections', 'exactly one', 'one per heading', 'zero — deprecated'],
      correctAnswer: 'exactly one',
    },
    {
      text: 'The primary navigation links should live in…',
      options: ['<footer>', '<nav>', '<aside>', '<main>'],
      correctAnswer: '<nav>',
    },
    {
      text: 'A sidebar with tangentially related content uses…',
      options: ['<main>', '<nav>', '<aside>', '<header>'],
      correctAnswer: '<aside>',
    },
    {
      text: 'A thematic group of content that usually carries its own heading uses…',
      options: ['<section>', '<div>', '<span>', '<li>'],
      correctAnswer: '<section>',
    },
  ],
  'Headings, Paragraphs & Text Formatting': [
    {
      text: 'How many heading levels does HTML provide?',
      options: ['three', 'four', 'six', 'ten'],
      correctAnswer: 'six',
    },
    {
      text: 'Skipping from <h1> straight to <h4> is bad because…',
      options: ['it breaks the document outline for screen readers and SEO', 'browsers refuse to render it', 'it makes text bold', 'it triggers a CSS error'],
      correctAnswer: 'it breaks the document outline for screen readers and SEO',
    },
    {
      text: 'Which element marks IMPORTANT text (renders bold)?',
      options: ['<em>', '<mark>', '<strong>', '<small>'],
      correctAnswer: '<strong>',
    },
    {
      text: 'For a numbered procedure, you should use…',
      options: ['<ul>', '<ol>', '<dl>', '<p>'],
      correctAnswer: '<ol>',
    },
  ],
  'Links, Images & Media': [
    {
      text: 'What does `rel="noopener"` on a `target="_blank"` link prevent?',
      options: ['the link opening', 'the new tab tampering with your page via window.opener', 'browser caching', 'images loading'],
      correctAnswer: 'the new tab tampering with your page via window.opener',
    },
    {
      text: 'An anchor `<a href="#contact">` jumps to…',
      options: ['the top of the page', 'the element with id="contact"', 'the file contact.html', 'a new tab'],
      correctAnswer: 'the element with id="contact"',
    },
    {
      text: 'Which attribute makes below-the-fold images download only near view?',
      options: ['alt', 'srcset', 'loading="lazy"', 'width'],
      correctAnswer: 'loading="lazy"',
    },
    {
      text: 'A `<video>` element that cannot be seen as playable lacks…',
      options: ['controls', 'source', 'autoplay', 'poster'],
      correctAnswer: 'controls',
    },
  ],

  // ── Section 3 — CSS Basics & Selectors ────────────────────────────────
  'How CSS Works: Cascade, Specificity & Inheritance': [
    {
      text: 'Which selector has the HIGHEST specificity?',
      options: ['h1 (element)', '.card (class)', '#title (id)', '* (universal)'],
      correctAnswer: '#title (id)',
    },
    {
      text: 'Two equal-specificity rules target an element — which one wins?',
      options: ['the one written first', 'the one written LAST in the stylesheet', 'the shorter one', 'the browser picks randomly'],
      correctAnswer: 'the one written LAST in the stylesheet',
    },
    {
      text: 'Which property IS inherited from parent to children by default?',
      options: ['margin', 'padding', 'color', 'border'],
      correctAnswer: 'color',
    },
    {
      text: '`!important` should be used…',
      options: ['everywhere for safety', 'sparingly — it is a sledgehammer that breaks the cascade', 'only on classes', 'only on IDs'],
      correctAnswer: 'sparingly — it is a sledgehammer that breaks the cascade',
    },
  ],
  'Basic Selectors: Type, Class, ID & Grouping': [
    {
      text: 'Which selector matches EVERY element with class="card"?',
      options: ['#card', '.card', 'card', '*card'],
      correctAnswer: '.card',
    },
    {
      text: 'IDs must be…',
      options: ['reusable on many elements', 'unique on the page', 'uppercase', 'numeric'],
      correctAnswer: 'unique on the page',
    },
    {
      text: '`h1, h2, h3 { font-family: sans-serif; }` applies the rule to…',
      options: ['only h1', 'every heading element listed — it is grouping', 'only the first heading', 'all elements'],
      correctAnswer: 'every heading element listed — it is grouping',
    },
    {
      text: 'For reusable styling across many elements, the best selector is…',
      options: ['an id selector', 'a class selector', 'the universal selector', 'a type selector on body'],
      correctAnswer: 'a class selector',
    },
  ],
  'Combinators & Attribute Selectors': [
    {
      text: '`.menu > a` selects…',
      options: ['every <a> anywhere inside .menu', 'only <a> that are DIRECT children of .menu', 'the first <a> on the page', 'every <a> with class menu'],
      correctAnswer: 'only <a> that are DIRECT children of .menu',
    },
    {
      text: '`.menu a` (space) selects…',
      options: ['only direct children', 'every <a> descendant of .menu at any depth', 'only hovered links', 'nothing'],
      correctAnswer: 'every <a> descendant of .menu at any depth',
    },
    {
      text: '`input[type="email"]` is an…',
      options: ['id selector', 'attribute selector', 'pseudo-element', 'combinator'],
      correctAnswer: 'attribute selector',
    },
    {
      text: '`a[href^="https"]` matches links whose href…',
      options: ['ends with https', 'starts with https', 'contains https', 'is exactly https'],
      correctAnswer: 'starts with https',
    },
  ],
  'Pseudo-classes & Pseudo-elements': [
    {
      text: 'A single-colon `:hover` is a…',
      options: ['pseudo-element', 'pseudo-class (a state)', 'combinator', 'attribute selector'],
      correctAnswer: 'pseudo-class (a state)',
    },
    {
      text: 'Which pseudo-element inserts generated content and REQUIRES a `content` property?',
      options: [':hover', ':focus', '::before', ':first-child'],
      correctAnswer: '::before',
    },
    {
      text: '`:nth-child(even)` selects…',
      options: ['every even-numbered child', 'only the second child', 'all children', 'evenly spaced children'],
      correctAnswer: 'every even-numbered child',
    },
    {
      text: 'The accessibility-critical pseudo-class that shows where the keyboard is is…',
      options: [':hover', ':focus', ':active', ':checked'],
      correctAnswer: ':focus',
    },
  ],

  // ── Section 4 — CSS Box Model & Units ─────────────────────────────────
  'The Box Model: content, padding, border & margin': [
    {
      text: 'Which box-model layer sits INSIDE the border and has a background?',
      options: ['margin', 'padding', 'content only', 'outline'],
      correctAnswer: 'padding',
    },
    {
      text: 'Which layer pushes OTHER elements away and has no background?',
      options: ['padding', 'border', 'margin', 'content'],
      correctAnswer: 'margin',
    },
    {
      text: 'Two vertical margins of 10px and 20px collapse to…',
      options: ['30px', '20px (the larger wins)', '10px', '15px'],
      correctAnswer: '20px (the larger wins)',
    },
    {
      text: 'In the default box model, `width: 200px` measures…',
      options: ['content width only, before padding and border', 'the full rendered box including padding', 'the full box plus margin', 'the border only'],
      correctAnswer: 'content width only, before padding and border',
    },
  ],
  'Sizing & box-sizing': [
    {
      text: 'With `box-sizing: border-box`, `width: 200px` includes…',
      options: ['only content', 'content + padding + border', 'content + margin', 'padding only'],
      correctAnswer: 'content + padding + border',
    },
    {
      text: 'The recommended modern reset is…',
      options: [
        '* { margin: 0 }',
        '*, *::before, *::after { box-sizing: border-box }',
        'html { box-sizing: content-box }',
        'body { width: 100% }',
      ],
      correctAnswer: '*, *::before, *::after { box-sizing: border-box }',
    },
    {
      text: 'A card that fills its container but never exceeds 300px uses…',
      options: ['width: 300px', 'width: 100%; max-width: 300px', 'min-width: 300px', 'width: 300vw'],
      correctAnswer: 'width: 100%; max-width: 300px',
    },
    {
      text: 'Why avoid a hard `height` on text containers?',
      options: ['it is not supported', 'text length changes with viewport/font, so hard heights overflow or leave gaps', 'it makes text bold', 'it disables scrolling'],
      correctAnswer: 'text length changes with viewport/font, so hard heights overflow or leave gaps',
    },
  ],
  'CSS Units: px, %, em, rem, vh & vw': [
    {
      text: 'Which unit is relative to the ROOT font size (default 16px)?',
      options: ['em', 'rem', 'px', '%'],
      correctAnswer: 'rem',
    },
    {
      text: '`2rem` with a 16px root font equals…',
      options: ['16px', '24px', '32px', '2px'],
      correctAnswer: '32px',
    },
    {
      text: 'Which unit is relative to the VIEWPORT height?',
      options: ['vh', 'em', '%', 'rem'],
      correctAnswer: 'vh',
    },
    {
      text: 'Why prefer `rem` for typography?',
      options: ['it is smaller', 'it scales with the user font setting (accessibility)', 'it is pixel-perfect', 'it loads faster'],
      correctAnswer: 'it scales with the user font setting (accessibility)',
    },
  ],
  'Display Modes & Visibility': [
    {
      text: 'Which display value removes an element from the layout entirely?',
      options: ['visibility: hidden', 'opacity: 0', 'display: none', 'display: inline'],
      correctAnswer: 'display: none',
    },
    {
      text: 'Which keeps the space but makes the element invisible?',
      options: ['display: none', 'visibility: hidden', 'display: inline', 'float: left'],
      correctAnswer: 'visibility: hidden',
    },
    {
      text: '`display: inline-block` differs from `inline` because it…',
      options: ['starts on a new line', 'honours width and height', 'removes spacing', 'is invisible'],
      correctAnswer: 'honours width and height',
    },
    {
      text: 'Which property switches an element into a centering layout container?',
      options: ['display: flex', 'position: absolute', 'overflow: hidden', 'z-index'],
      correctAnswer: 'display: flex',
    },
  ],

  // ── Section 5 — Flexbox & Modern Layouts ──────────────────────────────
  'Flexbox: The Flex Container & the Main Axis': [
    {
      text: 'You create a flex container by setting…',
      options: ['position: relative', 'display: flex', 'float: none', 'overflow: hidden'],
      correctAnswer: 'display: flex',
    },
    {
      text: 'The default `flex-direction` is…',
      options: ['column', 'row', 'row-reverse', 'column-reverse'],
      correctAnswer: 'row',
    },
    {
      text: 'With `flex-direction: column`, the main axis runs…',
      options: ['left to right', 'top to bottom', 'bottom to top', 'diagonally'],
      correctAnswer: 'top to bottom',
    },
    {
      text: 'Flexbox only affects…',
      options: ['all descendants at any depth', 'direct children of the container', 'the parent element', 'sibling containers'],
      correctAnswer: 'direct children of the container',
    },
  ],
  'Aligning on Both Axes: justify-content & align-items': [
    {
      text: 'Which property aligns items along the MAIN axis?',
      options: ['align-items', 'justify-content', 'align-self', 'gap'],
      correctAnswer: 'justify-content',
    },
    {
      text: 'Which aligns items along the CROSS axis?',
      options: ['justify-content', 'align-items', 'flex-wrap', 'order'],
      correctAnswer: 'align-items',
    },
    {
      text: '`justify-content: space-between`…',
      options: ['centers everything', 'pushes the first item to the start and the last to the end with equal gaps', 'stacks items vertically', 'hides items'],
      correctAnswer: 'pushes the first item to the start and the last to the end with equal gaps',
    },
    {
      text: 'The preferred way to space flex items evenly is…',
      options: ['per-item margins', 'the gap property', 'padding on the container', 'negative margins'],
      correctAnswer: 'the gap property',
    },
  ],
  'Flex Items: grow, shrink, basis & order': [
    {
      text: 'The shorthand `flex: 1` expands to…',
      options: ['flex: 1 0 auto', 'flex: 1 1 0%', 'flex: 0 1 auto', 'flex: 1 1 100%'],
      correctAnswer: 'flex: 1 1 0%',
    },
    {
      text: '`flex: 0 0 240px` means the item…',
      options: ['grows freely', 'stays fixed at 240px (no grow, no shrink)', 'shrinks to 0', 'is 240px only on hover'],
      correctAnswer: 'stays fixed at 240px (no grow, no shrink)',
    },
    {
      text: '`flex-grow: 2` on one item and `1` on others means it absorbs…',
      options: ['twice as much spare space', 'half as much', 'no space', 'exactly 2px'],
      correctAnswer: 'twice as much spare space',
    },
    {
      text: 'Which property re-sequences items visually without changing HTML order?',
      options: ['order', 'float', 'z-index', 'position'],
      correctAnswer: 'order',
    },
  ],
  'Centering Patterns & Practical Layouts': [
    {
      text: 'Perfect two-way centering uses…',
      options: [
        'justify-content: center; align-items: center',
        'text-align: center only',
        'margin: 0 auto only',
        'position: fixed',
      ],
      correctAnswer: 'justify-content: center; align-items: center',
    },
    {
      text: 'A responsive card grid in flexbox (no media query) uses…',
      options: [
        'flex-wrap: wrap with cards flex: 1 1 250px',
        'display: block on each card',
        'absolute positioning',
        'fixed widths',
      ],
      correctAnswer: 'flex-wrap: wrap with cards flex: 1 1 250px',
    },
    {
      text: 'The sticky-footer trick needs `body { display: flex; flex-direction: column; min-height: 100vh }` and main with…',
      options: ['flex: 1', 'height: 50%', 'overflow: hidden', 'position: sticky'],
      correctAnswer: 'flex: 1',
    },
    {
      text: 'The default `align-items: stretch` makes flex siblings…',
      options: ['equal heights (tallest wins)', 'collapsed', 'overflow', 'wrap'],
      correctAnswer: 'equal heights (tallest wins)',
    },
  ],

  // ── Section 6 — CSS Grid, Transitions & Animations ────────────────────
  'Grid Basics: tracks, lines & the template': [
    {
      text: 'Grid is the layout tool for…',
      options: ['one dimension only', 'two dimensions (rows AND columns at once)', 'three-dimensional scenes', 'absolute positioning only'],
      correctAnswer: 'two dimensions (rows AND columns at once)',
    },
    {
      text: '`grid-template-columns: 1fr 2fr` gives…',
      options: ['two equal columns', 'a fixed column and a flexible one 2x wider', 'three columns', 'two rows'],
      correctAnswer: 'a fixed column and a flexible one 2x wider',
    },
    {
      text: 'Which declaration makes an item span every column?',
      options: ['grid-column: 1 / -1', 'grid-column: auto', 'grid-column: 100%', 'grid-row: 1'],
      correctAnswer: 'grid-column: 1 / -1',
    },
    {
      text: '`repeat(3, 1fr)` is shorthand for…',
      options: ['one column 3px wide', 'three equal columns', 'three rows auto', 'a 3x3 grid'],
      correctAnswer: 'three equal columns',
    },
  ],
  'Grid Areas & Auto-Placement': [
    {
      text: '`grid-template-areas: "header header" "sidebar main" "footer footer"` describes…',
      options: ['a layout you can read like ASCII art', 'a flexbox row', 'a single column', 'an animation'],
      correctAnswer: 'a layout you can read like ASCII art',
    },
    {
      text: 'A `.` (dot) in a grid-area string means…',
      options: ['a full row', 'an empty cell', 'a comment', 'a new line'],
      correctAnswer: 'an empty cell',
    },
    {
      text: 'Items a grid does not explicitly place are…',
      options: ['hidden', 'auto-placed in row-major order', 'stacked on top of each other', 'moved to the footer'],
      correctAnswer: 'auto-placed in row-major order',
    },
    {
      text: 'The one-line fully-responsive card grid is…',
      options: [
        'grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))',
        'grid-template-columns: 250px 250px',
        'display: inline-grid',
        'grid-columns: auto-fit',
      ],
      correctAnswer: 'grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))',
    },
  ],
  'Transitions: property, duration & easing': [
    {
      text: 'A transition animates a property…',
      options: ['when the page loads', 'when the property value changes (e.g. hover)', 'only on click', 'every frame always'],
      correctAnswer: 'when the property value changes (e.g. hover)',
    },
    {
      text: '`transition: background-color 0.3s ease` sets…',
      options: ['property, duration, easing', 'property only', 'duration only', 'a keyframe name'],
      correctAnswer: 'property, duration, easing',
    },
    {
      text: 'Which properties animate WITHOUT forcing reflow each frame?',
      options: ['width / height', 'transform / opacity', 'margin / padding', 'top / left'],
      correctAnswer: 'transform / opacity',
    },
    {
      text: 'Which accessibility media query disables decorative motion?',
      options: [
        '@media (max-width: 480px)',
        '@media (prefers-reduced-motion: reduce)',
        '@media (orientation: portrait)',
        '@media (hover: hover)',
      ],
      correctAnswer: '@media (prefers-reduced-motion: reduce)',
    },
  ],
  'Keyframe Animations & Transforms': [
    {
      text: 'A keyframe animation runs…',
      options: ['only on hover', 'on its own (load, loop, trigger)', 'only on click', 'after a server response'],
      correctAnswer: 'on its own (load, loop, trigger)',
    },
    {
      text: '`animation: spin 0.8s linear infinite` — the `infinite` sets…',
      options: ['the duration', 'the repeat count', 'the easing', 'the delay'],
      correctAnswer: 'the repeat count',
    },
    {
      text: 'Which transform scales an element?',
      options: ['translate(2, 2)', 'scale(1.1)', 'rotate(45deg)', 'skew(2deg)'],
      correctAnswer: 'scale(1.1)',
    },
    {
      text: 'To move an element smoothly, prefer `transform: translate()` over…',
      options: ['left / top', 'opacity', 'color', 'visibility'],
      correctAnswer: 'left / top',
    },
  ],

  // ── Section 7 — Responsive Design & Media Queries ─────────────────────
  'The Mobile-First Philosophy': [
    {
      text: 'Mobile-first means…',
      options: [
        'designing desktop and shrinking later',
        'base styles target phones; min-width queries ADD desktop layout',
        'no media queries at all',
        'blocking phone users',
      ],
      correctAnswer: 'base styles target phones; min-width queries ADD desktop layout',
    },
    {
      text: 'Why do mobile constraints force clarity?',
      options: ['phones are slower', 'small screens allow no decoration, so you pick what is essential', 'phones cannot render CSS', 'the browser blocks fonts'],
      correctAnswer: 'small screens allow no decoration, so you pick what is essential',
    },
    {
      text: 'In mobile-first CSS, desktop enhancements go inside…',
      options: ['max-width queries', 'min-width queries', 'the base styles', 'JavaScript'],
      correctAnswer: 'min-width queries',
    },
    {
      text: 'The habit that prevents a "shrink later" desktop-first mess is…',
      options: [
        'designing in the browser from a phone width up',
        'coding only on a desktop monitor',
        'using pixels for everything',
        'deleting the media queries',
      ],
      correctAnswer: 'designing in the browser from a phone width up',
    },
  ],
  'Media Queries: Breakpoints & Syntax': [
    {
      text: '`@media (min-width: 768px)` applies styles…',
      options: ['below 768px', 'at 768px and wider', 'exactly at 768px', 'only in portrait'],
      correctAnswer: 'at 768px and wider',
    },
    {
      text: 'Breakpoints should be chosen from…',
      options: ['a fixed chart of device sizes', 'where your content actually starts to break', 'the screen width of your own monitor', 'the number of sections'],
      correctAnswer: 'where your content actually starts to break',
    },
    {
      text: 'In a mobile-first file, larger min-width blocks should come…',
      options: ['before the base styles', 'after the smaller ones so later rules win at the boundary', 'in a separate file', 'with !important'],
      correctAnswer: 'after the smaller ones so later rules win at the boundary',
    },
    {
      text: 'Which query targets devices with a precise pointer like a mouse?',
      options: ['(hover: hover)', '(orientation: landscape)', '(max-width: 600px)', '(prefers-color-scheme: dark)'],
      correctAnswer: '(hover: hover)',
    },
  ],
  'Fluid Units & Fluid Images': [
    {
      text: 'The fluid-type function `font-size: clamp(1rem, 2vw, 2.5rem)` means…',
      options: [
        'at least 1rem, ideally 2vw, at most 2.5rem',
        'exactly 2vw always',
        '1rem then 2.5rem alternately',
        'a fixed 2.5rem',
      ],
      correctAnswer: 'at least 1rem, ideally 2vw, at most 2.5rem',
    },
    {
      text: 'The two-line rule that stops images overflowing phones is…',
      options: [
        'img { max-width: 100%; height: auto }',
        'img { width: 100%; height: 100% }',
        'img { overflow: hidden }',
        'img { display: none }',
      ],
      correctAnswer: 'img { max-width: 100%; height: auto }',
    },
    {
      text: '`width: min(100%, 1200px)` on a container means…',
      options: ['it is always 1200px', 'it fills the parent but never exceeds 1200px', 'it is 100px', 'it overflows'],
      correctAnswer: 'it fills the parent but never exceeds 1200px',
    },
    {
      text: 'Without `height: auto`, a compressed image…',
      options: ['keeps its aspect', 'distorts because the height stays fixed', 'disappears', 'gets blurry'],
      correctAnswer: 'distorts because the height stays fixed',
    },
  ],
  'Responsive Patterns: nav, grids & cards': [
    {
      text: 'The collapsing hamburger nav pattern relies on…',
      options: ['JavaScript for everything', 'CSS show/hide by breakpoint + JS toggling a class', 'server detection', 'an iframe'],
      correctAnswer: 'CSS show/hide by breakpoint + JS toggling a class',
    },
    {
      text: 'A hide-on-mobile sidebar should use…',
      options: [
        'display: none by default; display: block inside a min-width query',
        'a JavaScript width check',
        'position: absolute',
        'opacity: 0',
      ],
      correctAnswer: 'display: none by default; display: block inside a min-width query',
    },
    {
      text: 'Progressive disclosure on mobile means…',
      options: [
        'showing the most important content first and hiding/restructuring the rest',
        'showing everything at once',
        'removing all images',
        'forcing a desktop layout',
      ],
      correctAnswer: 'showing the most important content first and hiding/restructuring the rest',
    },
    {
      text: 'A 3-column desktop grid becomes a 1-column phone list via…',
      options: ['grid-template-columns with breakpoints or auto-fit minmax', 'absolute positioning', 'fixed pixel widths', 'overflow hidden'],
      correctAnswer: 'grid-template-columns with breakpoints or auto-fit minmax',
    },
  ],

  // ── Section 8 — Tailwind CSS Introduction ─────────────────────────────
  'Utility-First vs Component CSS': [
    {
      text: 'Tailwind is a…',
      options: ['JavaScript framework', 'utility-first CSS framework', 'database', 'build system for HTML'],
      correctAnswer: 'utility-first CSS framework',
    },
    {
      text: 'The main trade-off of utility classes is…',
      options: ['no CSS at all', 'dense class attributes, in exchange for no naming decisions', 'slower loading', 'no responsive support'],
      correctAnswer: 'dense class attributes, in exchange for no naming decisions',
    },
    {
      text: 'Utility classes keep spacing consistent because…',
      options: ['they are random', 'they draw from one scale (p-2, p-4, p-6)', 'they are forbidden', 'CSS is ignored'],
      correctAnswer: 'they draw from one scale (p-2, p-4, p-6)',
    },
    {
      text: 'When the same five-class combo repeats often, the fix is…',
      options: ['copy-paste it', 'extract it into a reusable component or @apply', 'use !important', 'delete it'],
      correctAnswer: 'extract it into a reusable component or @apply',
    },
  ],
  'Core Utilities: Spacing, Color & Typography': [
    {
      text: '`p-4` sets padding on all sides to…',
      options: ['4px', '1rem (from the spacing scale)', '40px', '4vw'],
      correctAnswer: '1rem (from the spacing scale)',
    },
    {
      text: '`hover:bg-blue-700` changes the background…',
      options: ['on page load', 'when the mouse hovers the element', 'after a click', 'on mobile only'],
      correctAnswer: 'when the mouse hovers the element',
    },
    {
      text: 'In the color scale, `bg-blue-500` is typically the…',
      options: ['lightest shade', 'brand/default shade', 'darkest shade', 'transparent shade'],
      correctAnswer: 'brand/default shade',
    },
    {
      text: 'An arbitrary one-off value in Tailwind is written as…',
      options: ['p-4', 'p-[13px]', 'p-var(13px)', 'padding-13'],
      correctAnswer: 'p-[13px]',
    },
  ],
  'Layout Utilities: Flex, Grid & Responsive Prefixes': [
    {
      text: 'The `md:` prefix applies a utility…',
      options: ['only on phones', 'at the md breakpoint (768px) and up', 'only on tablets exactly', 'never'],
      correctAnswer: 'at the md breakpoint (768px) and up',
    },
    {
      text: '`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4` gives…',
      options: ['one fixed 4-column grid', '1 column on phones, 2 on md, 4 on lg', '4 columns everywhere', 'a flexbox row'],
      correctAnswer: '1 column on phones, 2 on md, 4 on lg',
    },
    {
      text: '`hidden md:flex` means the element…',
      options: ['is always visible', 'is hidden by default and becomes flex from md up', 'is flex only on phones', 'never renders'],
      correctAnswer: 'is hidden by default and becomes flex from md up',
    },
    {
      text: 'Tailwind default breakpoints follow a…',
      options: ['max-width strategy', 'mobile-first min-width strategy', 'fixed-pixel strategy', 'random strategy'],
      correctAnswer: 'mobile-first min-width strategy',
    },
  ],
  'Customisation & the Tailwind Workflow': [
    {
      text: 'In a production build, Tailwind generates CSS for…',
      options: ['every utility in the framework', 'only the classes found in your source files', 'only base styles', 'all hover variants'],
      correctAnswer: 'only the classes found in your source files',
    },
    {
      text: 'The Play CDN is best for…',
      options: ['production sites at scale', 'demos and small experiments', 'databases', 'servers'],
      correctAnswer: 'demos and small experiments',
    },
    {
      text: 'If a class silently vanishes in production, the usual cause is…',
      options: ['a slow network', 'the scan config not covering the file that uses it', 'a browser bug', 'too much CSS'],
      correctAnswer: 'the scan config not covering the file that uses it',
    },
    {
      text: 'Custom brand colours are added in…',
      options: ['the config (theme.extend) or the v4 CSS theme', 'a JavaScript file', 'the HTML only', 'a database table'],
      correctAnswer: 'the config (theme.extend) or the v4 CSS theme',
    },
  ],

  // ── Section 9 — JavaScript Basics, Variables & Types ──────────────────
  'What JavaScript Can Do & Where It Runs': [
    {
      text: 'JavaScript is the layer of a webpage that…',
      options: ['provides structure', 'provides behaviour (interactivity, fetching, validation)', 'provides colours', 'stores data permanently'],
      correctAnswer: 'provides behaviour (interactivity, fetching, validation)',
    },
    {
      text: 'In the browser, JS interacts with the page through…',
      options: ['the DOM API (document) and Web APIs like fetch', 'the file system', 'the database directly', 'the server only'],
      correctAnswer: 'the DOM API (document) and Web APIs like fetch',
    },
    {
      text: 'JavaScript also runs on servers thanks to…',
      options: ['Java', 'Node.js', 'Python', 'Apache'],
      correctAnswer: 'Node.js',
    },
    {
      text: '`defer` on a script tag means…',
      options: [
        'it downloads in parallel and runs after HTML parsing',
        'it never runs',
        'it runs before the HTML loads',
        'it is minified',
      ],
      correctAnswer: 'it downloads in parallel and runs after HTML parsing',
    },
  ],
  'Variables: let, const & var': [
    {
      text: 'Which keyword should be your default for variables you never reassign?',
      options: ['var', 'let', 'const', 'static'],
      correctAnswer: 'const',
    },
    {
      text: '`const obj = { name: "A" }; obj.name = "B";` — this…',
      options: ['throws an error', 'works: const only forbids reassigning the variable, not changing properties', 'silently fails', 'reassigns the variable'],
      correctAnswer: 'works: const only forbids reassigning the variable, not changing properties',
    },
    {
      text: '`let` differs from `var` mainly because…',
      options: ['it is slower', 'it is block-scoped, while var is function-scoped and leaks from blocks', 'it cannot hold numbers', 'it is global'],
      correctAnswer: 'it is block-scoped, while var is function-scoped and leaks from blocks',
    },
    {
      text: 'The JS naming convention for variables is…',
      options: ['PascalCase', 'camelCase', 'snake_case', 'UPPER_CASE'],
      correctAnswer: 'camelCase',
    },
  ],
  'Primitive Types: string, number, boolean & friends': [
    {
      text: '`let x;` — the value of `x` is…',
      options: ['null', 'undefined', 'NaN', '0'],
      correctAnswer: 'undefined',
    },
    {
      text: 'Which is the FALSY value among these?',
      options: ['[]', '"0"', '0', '{}'],
      correctAnswer: '0',
    },
    {
      text: '`typeof null` famously returns…',
      options: ['"null"', '"undefined"', '"object"', '"boolean"'],
      correctAnswer: '"object"',
    },
    {
      text: '`NaN` results from…',
      options: ['valid division', 'failed math like "abc" * 2', 'string concatenation', 'a boolean operation'],
      correctAnswer: 'failed math like "abc" * 2',
    },
  ],
  'Type Coercion & Template Literals': [
    {
      text: '`"5" + 1` evaluates to…',
      options: ['6', '"51"', 'NaN', 'undefined'],
      correctAnswer: '"51"',
    },
    {
      text: '`5 === "5"` is…',
      options: ['true', 'false (strict compares type AND value)', 'NaN', 'a TypeError'],
      correctAnswer: 'false (strict compares type AND value)',
    },
    {
      text: 'The correct template literal is…',
      options: ['"Hi " + name', '`Hi ${name}`', 'Hi %name', '"Hi #{name}"'],
      correctAnswer: '`Hi ${name}`',
    },
    {
      text: '`NaN === NaN` is…',
      options: ['true', 'false — NaN equals nothing, even itself', 'undefined', 'throws'],
      correctAnswer: 'false — NaN equals nothing, even itself',
    },
  ],

  // ── Section 10 — JS Control Flow & Operators ──────────────────────────
  'Comparison & Logical Operators': [
    {
      text: '`const name = input || "Guest"` uses `||` to…',
      options: ['throw an error', 'provide a default when input is falsy', 'combine two strings', 'compare types'],
      correctAnswer: 'provide a default when input is falsy',
    },
    {
      text: '`0 ?? 10` evaluates to…',
      options: ['10', '0 — ?? only triggers on null/undefined', 'NaN', 'false'],
      correctAnswer: '0 — ?? only triggers on null/undefined',
    },
    {
      text: '`[1, 2] === [1, 2]` is…',
      options: ['true', 'false — arrays compare by reference, not content', 'undefined', 'NaN'],
      correctAnswer: 'false — arrays compare by reference, not content',
    },
    {
      text: 'The guard `user && render(user)` renders only when…',
      options: ['user is false', 'user is truthy', 'user is an array', 'render is undefined'],
      correctAnswer: 'user is truthy',
    },
  ],
  'Branching: if, else if, else & the ternary': [
    {
      text: 'In an if/else-if chain, the MOST specific condition must…',
      options: ['come first', 'come last', 'be skipped', 'use =='],
      correctAnswer: 'come first',
    },
    {
      text: 'The ternary `a ? b : c` means…',
      options: ['if a then c else b', 'if a then b else c', 'a equals b and c', 'loop a times'],
      correctAnswer: 'if a then b else c',
    },
    {
      text: 'A `switch` case that forgets `break` will…',
      options: ['crash', 'fall through into the next case', 'skip the next case', 'run twice'],
      correctAnswer: 'fall through into the next case',
    },
    {
      text: 'When choosing between a value pair, the most readable compact choice is…',
      options: ['nested ternaries', 'a simple ternary', 'a while loop', 'switch without breaks'],
      correctAnswer: 'a simple ternary',
    },
  ],
  'Loops: for, while, do-while & for-of': [
    {
      text: 'The modern loop to iterate the VALUES of an array is…',
      options: ['for…in', 'for…of', 'while', 'do…while'],
      correctAnswer: 'for…of',
    },
    {
      text: 'Which loop runs its body AT LEAST once before checking the condition?',
      options: ['while', 'for', 'do…while', 'for…of'],
      correctAnswer: 'do…while',
    },
    {
      text: 'An infinite loop freezes the browser when…',
      options: ['the loop is short', 'the while condition never becomes false', 'for-of is used', 'break is present'],
      correctAnswer: 'the while condition never becomes false',
    },
    {
      text: '`break` exits the loop; `continue`…',
      options: ['exits the program', 'skips the rest of the current iteration', 'starts a new loop', 'reverses the loop'],
      correctAnswer: 'skips the rest of the current iteration',
    },
  ],
  'The switch Statement in Depth': [
    {
      text: 'A `switch` case that forgets its `break` will…',
      options: ['crash', 'fall through into the next case', 'skip the matching case', 'run only default'],
      correctAnswer: 'fall through into the next case',
    },
    {
      text: '`switch` compares the expression to each case using…',
      options: ['loose equality ==', 'strict equality ===', 'truthiness', 'type coercion'],
      correctAnswer: 'strict equality ===',
    },
    {
      text: '`case "5"` will match which input?',
      options: ['the number 5', 'the string "5" only', 'both 5 and "5"', 'neither'],
      correctAnswer: 'the string "5" only',
    },
    {
      text: 'To make several cases share one body, you…',
      options: [
        'write `case "sat": break; case "sun":`',
        'list the cases back-to-back with no body until the last one',
        'use nested switches',
        'duplicate the body under each case',
      ],
      correctAnswer: 'list the cases back-to-back with no body until the last one',
    },
  ],

  // ── Section 11 — JS Functions & Arrays ────────────────────────────────
  'Function Declarations, Expressions & Arrow Functions': [
    {
      text: 'Which function form is HOISTED (callable before its definition line)?',
      options: ['arrow function', 'function declaration', 'function expression', 'class method'],
      correctAnswer: 'function declaration',
    },
    {
      text: 'Arrow functions differ from regular functions because they…',
      options: ['have their own this', 'inherit `this` from the surrounding scope', 'cannot take parameters', 'are always async'],
      correctAnswer: 'inherit `this` from the surrounding scope',
    },
    {
      text: 'A function with no explicit return returns…',
      options: ['null', 'undefined', '0', 'false'],
      correctAnswer: 'undefined',
    },
    {
      text: 'The shortest arrow `x => x * 2`…',
      options: ['needs a block and return', 'implicitly returns x * 2', 'throws a syntax error', 'returns undefined'],
      correctAnswer: 'implicitly returns x * 2',
    },
  ],
  'Parameters, Defaults & Rest': [
    {
      text: '`function greet(name = "Guest")` gives "Guest" when…',
      options: ['name is null', 'name is undefined', 'name is 0', 'name is ""'],
      correctAnswer: 'name is undefined',
    },
    {
      text: '`function sum(...nums)` — the `...nums` is a…',
      options: ['spread argument', 'rest parameter gathering extras into an array', 'default value', 'type annotation'],
      correctAnswer: 'rest parameter gathering extras into an array',
    },
    {
      text: 'Rest parameters must appear…',
      options: ['first', 'last in the parameter list', 'only in arrow functions', 'inside a string'],
      correctAnswer: 'last in the parameter list',
    },
    {
      text: '`Math.max(...scores)` uses spread to…',
      options: ['gather arguments into an array', 'scatter the array into individual arguments', 'sort the array', 'copy the array'],
      correctAnswer: 'scatter the array into individual arguments',
    },
  ],
  'Array Methods: map, filter & reduce': [
    {
      text: '`[1, 2, 3].map(n => n * 2)` returns…',
      options: ['[1, 2, 3]', '[2, 4, 6]', '[1, 4, 9]', '6'],
      correctAnswer: '[2, 4, 6]',
    },
    {
      text: '`[3, 8, 5, 9].filter(n => n > 5)` returns…',
      options: ['[3, 5]', '[8, 9]', '[3, 8, 5, 9]', '[5, 9]'],
      correctAnswer: '[8, 9]',
    },
    {
      text: '`[1, 2, 3].reduce((acc, n) => acc + n, 0)` returns…',
      options: ['0', '6', '123', 'undefined'],
      correctAnswer: '6',
    },
    {
      text: 'Which method returns the FIRST element passing a test?',
      options: ['filter', 'find', 'map', 'every'],
      correctAnswer: 'find',
    },
  ],
  'Array Iteration & Spread/Rest in Practice': [
    {
      text: '`[...first, ...second]` …',
      options: ['sorts both arrays', 'concatenates first and second into a new array', 'removes duplicates', 'reverses both'],
      correctAnswer: 'concatenates first and second into a new array',
    },
    {
      text: '`{ ...defaults, ...prefs }` merges objects so that…',
      options: ['defaults win', 'later keys (prefs) win', 'keys alternate', 'an error is thrown'],
      correctAnswer: 'later keys (prefs) win',
    },
    {
      text: '`[10, 2, 30].sort()` without a comparator gives…',
      options: ['[2, 10, 30]', '[10, 2, 30] (string order)', 'NaN', 'a TypeError'],
      correctAnswer: '[10, 2, 30] (string order)',
    },
    {
      text: '`const [head, ...rest] = [10, 20, 30]` makes…',
      options: ['head=10, rest=[20, 30]', 'head=[10, 20], rest=[30]', 'head=30, rest=[10, 20]', 'an error'],
      correctAnswer: 'head=10, rest=[20, 30]',
    },
  ],

  // ── Section 12 — DOM Manipulation ─────────────────────────────────────
  'The DOM Tree & the document Object': [
    {
      text: 'The DOM is best described as…',
      options: ['the HTML source file', 'a live in-memory tree the browser builds and JS can mutate', 'a CSS stylesheet', 'the server response headers'],
      correctAnswer: 'a live in-memory tree the browser builds and JS can mutate',
    },
    {
      text: 'View Source shows the original HTML, but DevTools Elements shows…',
      options: ['nothing', 'the live, currently-mutated DOM', 'the CSS rules', 'the JavaScript file'],
      correctAnswer: 'the live, currently-mutated DOM',
    },
    {
      text: 'The root of the DOM tree is…',
      options: ['body', 'html', 'head', 'document root element'],
      correctAnswer: 'html',
    },
    {
      text: 'When JS changes a DOM node, the screen…',
      options: ['updates almost immediately', 'never changes', 'requires a full reload', 'goes blank'],
      correctAnswer: 'updates almost immediately',
    },
  ],
  'Selecting Elements: getElementById & querySelector': [
    {
      text: '`document.querySelector(".card")` returns…',
      options: ['all matching elements', 'the FIRST element matching the CSS selector', 'an HTMLCollection', 'the id attribute'],
      correctAnswer: 'the FIRST element matching the CSS selector',
    },
    {
      text: '`document.querySelectorAll(".card")` returns…',
      options: ['a single element', 'a NodeList (array-like, not a true array)', 'a string', 'null'],
      correctAnswer: 'a NodeList (array-like, not a true array)',
    },
    {
      text: 'If `querySelector` finds nothing it returns…',
      options: ['undefined', 'null', 'false', 'an empty array'],
      correctAnswer: 'null',
    },
    {
      text: 'To use `.map` on a NodeList you should first…',
      options: ['convert it with spread: [...nodeList]', 'call nodeList.map directly', 'iterate with for…in', 'cast it to string'],
      correctAnswer: 'convert it with spread: [...nodeList]',
    },
  ],
  'Reading & Changing the DOM: text, attributes & classes': [
    {
      text: 'The SAFE way to set user-supplied text is…',
      options: ['element.innerHTML', 'element.textContent', 'element.outerHTML', 'element.insertAdjacentHTML'],
      correctAnswer: 'element.textContent',
    },
    {
      text: '`innerHTML = userInput` with untrusted input risks…',
      options: ['slower load', 'cross-site scripting (XSS)', 'a layout shift', 'broken CSS'],
      correctAnswer: 'cross-site scripting (XSS)',
    },
    {
      text: 'Which reads what a user typed into `<input id="email">`?',
      options: ['el.textContent', 'el.value', 'el.innerHTML', 'el.checked'],
      correctAnswer: 'el.value',
    },
    {
      text: '`el.dataset.role` reads the attribute…',
      options: ['role', 'data-role', 'dataset-role', 'data'],
      correctAnswer: 'data-role',
    },
  ],
  'Creating, Appending & Removing Nodes': [
    {
      text: '`document.createElement("li")` creates…',
      options: ['an element already in the page', 'a detached element not yet in the document', 'a CSS class', 'a string'],
      correctAnswer: 'a detached element not yet in the document',
    },
    {
      text: '`parent.appendChild(child)` adds the child…',
      options: ['at the start', 'as the last child', 'in the middle', 'nowhere'],
      correctAnswer: 'as the last child',
    },
    {
      text: 'Building many nodes and inserting once is best done with…',
      options: ['a document fragment', 'dozens of appendChild calls', 'document.write', 'innerHTML per node'],
      correctAnswer: 'a document fragment',
    },
    {
      text: 'To remove an element from the tree entirely, call…',
      options: ['node.remove()', 'node.hide()', 'node.delete()', 'document.remove(node)'],
      correctAnswer: 'node.remove()',
    },
  ],

  // ── Section 13 — Event Handlers & Interactivity ───────────────────────
  'The Event Model: Bubbling & Capturing': [
    {
      text: 'Event listeners run in which phase by default?',
      options: ['capture', 'bubble', 'target only', 'document ready'],
      correctAnswer: 'bubble',
    },
    {
      text: 'Clicking a child can also trigger a parent listener because…',
      options: ['the event bubbles up through ancestors', 'the parent copies the child handler', 'capture is always on', 'JS runs twice'],
      correctAnswer: 'the event bubbles up through ancestors',
    },
    {
      text: '`e.stopPropagation()` stops…',
      options: ['the default browser action', 'the event bubbling further', 'the element rendering', 'the loop'],
      correctAnswer: 'the event bubbling further',
    },
    {
      text: 'The bubble order for a click on a button inside a div is…',
      options: ['div first then button', 'button first, then up through ancestors', 'only the button', 'only the div'],
      correctAnswer: 'button first, then up through ancestors',
    },
  ],
  'addEventListener & the Event Object': [
    {
      text: 'Why prefer `addEventListener` over `el.onclick = fn`?',
      options: [
        'onclick is faster',
        'addEventListener allows many handlers and is removable',
        'onclick does not exist',
        'addEventListener runs once',
      ],
      correctAnswer: 'addEventListener allows many handlers and is removable',
    },
    {
      text: '`e.target` is…',
      options: ['the element the listener is attached to', 'the deepest element the event happened on', 'the document root', 'always the button'],
      correctAnswer: 'the deepest element the event happened on',
    },
    {
      text: '`e.preventDefault()` stops…',
      options: ['event bubbling', 'the default browser action (form submit, link jump)', 'other listeners', 'timers'],
      correctAnswer: 'the default browser action (form submit, link jump)',
    },
    {
      text: 'Which event fires on EVERY keystroke in a text field?',
      options: ['change', 'input', 'blur', 'focus'],
      correctAnswer: 'input',
    },
  ],
  'Common Events: click, input, submit & keydown': [
    {
      text: 'To catch a form submission, listen for which event on the form element?',
      options: ['click', 'submit', 'keydown', 'change'],
      correctAnswer: 'submit',
    },
    {
      text: 'The professional submit pattern calls `e.preventDefault()` to…',
      options: ['stop the page reloading', 'stop bubbling', 'disable the button', 'clear the form'],
      correctAnswer: 'stop the page reloading',
    },
    {
      text: '`e.key` on a keydown event gives…',
      options: ['the character code only', 'the printable key name like "Enter"', 'the mouse position', 'the target id'],
      correctAnswer: 'the printable key name like "Enter"',
    },
    {
      text: '`change` fires on a text input…',
      options: ['on every keystroke', 'when the value commits (e.g. leaving the field)', 'never', 'on focus'],
      correctAnswer: 'when the value commits (e.g. leaving the field)',
    },
  ],
  'Event Delegation & Dynamic Content': [
    {
      text: 'Event delegation attaches…',
      options: ['one listener per child', 'one listener to an ancestor that catches child events via bubbling', 'no listeners', 'a listener to the document only'],
      correctAnswer: 'one listener to an ancestor that catches child events via bubbling',
    },
    {
      text: 'Per-element listeners fail for dynamically added elements because…',
      options: ['listeners are deleted', 'new elements added later have no listener attached', 'bubbling stops', 'querySelectorAll breaks'],
      correctAnswer: 'new elements added later have no listener attached',
    },
    {
      text: 'In a delegated listener, `e.target.closest(".todo")`…',
      options: ['returns the nearest ancestor matching .todo (or null)', 'returns all .todo elements', 'returns the target only', 'throws'],
      correctAnswer: 'returns the nearest ancestor matching .todo (or null)',
    },
    {
      text: 'The guard `if (!item) return;` in a delegated handler ignores…',
      options: ['clicks on items', 'clicks that are not on a matching item', 'keyboard events', 'touch events'],
      correctAnswer: 'clicks that are not on a matching item',
    },
  ],

  // ── Section 14 — Async JS, Promises & Fetch/APIs ──────────────────────
  'Why Async: The Single-Threaded Event Loop': [
    {
      text: 'JavaScript runs on…',
      options: ['many threads', 'a single thread — one thing at a time', 'a GPU', 'the server only'],
      correctAnswer: 'a single thread — one thing at a time',
    },
    {
      text: '`setTimeout(() => log("B"), 0)`…',
      options: ['runs B first', 'queues the callback until synchronous code finishes', 'blocks the thread', 'is illegal'],
      correctAnswer: 'queues the callback until synchronous code finishes',
    },
    {
      text: 'Slow work like network requests is handed to…',
      options: ['the JS thread to block on', 'the browser background, then its callback is queued', 'the CSS engine', 'the garbage collector'],
      correctAnswer: 'the browser background, then its callback is queued',
    },
    {
      text: 'The order of `log("A"); setTimeout(…B…, 0); log("C")` is…',
      options: ['A, B, C', 'A, C, B', 'B, A, C', 'C, A, B'],
      correctAnswer: 'A, C, B',
    },
  ],
  'Promises: then, catch & finally': [
    {
      text: 'A promise settles into…',
      options: ['pending / waiting', 'fulfilled / rejected', 'started / stopped', 'queued / done'],
      correctAnswer: 'fulfilled / rejected',
    },
    {
      text: 'A rejection anywhere in a `.then` chain jumps to…',
      options: ['the next .then', 'the nearest .catch', '.finally', 'the beginning'],
      correctAnswer: 'the nearest .catch',
    },
    {
      text: '`.finally()` runs…',
      options: ['only on success', 'only on failure', 'either way (cleanup)', 'never'],
      correctAnswer: 'either way (cleanup)',
    },
    {
      text: '`Promise.all([p1, p2])`…',
      options: ['runs them one after another', 'waits for all and settles with an array (or the first failure)', 'returns the first only', 'cancels both'],
      correctAnswer: 'waits for all and settles with an array (or the first failure)',
    },
  ],
  'async/await: Readable Asynchronous Code': [
    {
      text: '`await` is only legal inside…',
      options: ['any function', 'an async function', 'a callback', 'a class field'],
      correctAnswer: 'an async function',
    },
    {
      text: 'An `async` function always returns…',
      options: ['a value directly', 'a promise', 'undefined', 'a callback'],
      correctAnswer: 'a promise',
    },
    {
      text: 'Errors in async/await are handled with…',
      options: ['.then only', 'try/catch', 'a global handler only', 'finally'],
      correctAnswer: 'try/catch',
    },
    {
      text: 'Two awaited fetches written sequentially run…',
      options: ['in parallel', 'one after the other (serially)', 'concurrently always', 'only the first'],
      correctAnswer: 'one after the other (serially)',
    },
  ],
  'fetch API & Talking to Real Backends': [
    {
      text: '`fetch()` returns…',
      options: ['a callback', 'a promise', 'an array', 'a string'],
      correctAnswer: 'a promise',
    },
    {
      text: 'fetch only REJECTS on…',
      options: ['HTTP 404/500', 'network failure (offline, DNS)', 'any non-200', 'a bad JSON body'],
      correctAnswer: 'network failure (offline, DNS)',
    },
    {
      text: 'So you must always check…',
      options: ['res.headers', 'res.ok', 'res.url', 'res.redirected'],
      correctAnswer: 'res.ok',
    },
    {
      text: 'To send an auth token, the standard header is…',
      options: ['Cookie: token', 'Authorization: Bearer <token>', 'X-Token: <token>', 'Content-Type: bearer'],
      correctAnswer: 'Authorization: Bearer <token>',
    },
  ],

  // ── Section 15 — Mini-Project Planning (Portfolio) ────────────────────
  'Scoping the Project: Requirements & MVP': [
    {
      text: 'An MVP is…',
      options: [
        'the smallest scope that is genuinely useful and testable',
        'a project with no styling',
        'the full final version',
        'a throwaway prototype',
      ],
      correctAnswer: 'the smallest scope that is genuinely useful and testable',
    },
    {
      text: 'A requirement like "the form validates email" is useful because…',
      options: ['it is long', 'it is testable — you know when you are done', 'it replaces HTML', 'it looks professional'],
      correctAnswer: 'it is testable — you know when you are done',
    },
    {
      text: 'A "definition of done"…',
      options: ['makes the project endless', 'lets you know what finished means before starting', 'is a decoration', 'deletes the scope'],
      correctAnswer: 'lets you know what finished means before starting',
    },
    {
      text: 'Extra features beyond the MVP should be…',
      options: ['added first', 'listed as future ideas and built only after the core works', 'never written down', 'required for done'],
      correctAnswer: 'listed as future ideas and built only after the core works',
    },
  ],
  'Wireframing & Information Architecture': [
    {
      text: 'A wireframe is…',
      options: ['the pixel-perfect design', 'a low-fidelity layout sketch showing where blocks go', 'a JavaScript file', 'a colour palette'],
      correctAnswer: 'a low-fidelity layout sketch showing where blocks go',
    },
    {
      text: 'Information architecture decides…',
      options: ['the font size', 'what content the visitor meets first and what supports it', 'the file names', 'the domain name'],
      correctAnswer: 'what content the visitor meets first and what supports it',
    },
    {
      text: 'A one-page portfolio typically flows…',
      options: ['footer to hero', 'hero → about → projects → contact', 'projects → footer → hero', 'randomly'],
      correctAnswer: 'hero → about → projects → contact',
    },
    {
      text: 'Wireframing first prevents…',
      options: ['all bugs', 'rewrite loops by settling placement before coding', 'loading issues', 'git conflicts'],
      correctAnswer: 'rewrite loops by settling placement before coding',
    },
  ],
  'Design Tokens: Colors, Type & Spacing': [
    {
      text: 'Design tokens are…',
      options: ['random values', 'the fixed palette (colors, type, spacing) the whole site shares', 'React components', 'API endpoints'],
      correctAnswer: 'the fixed palette (colors, type, spacing) the whole site shares',
    },
    {
      text: 'Storing colors as CSS variables means…',
      options: ['nothing', 'changing the variable restyles every usage at once', 'CSS becomes slower', 'browsers block them'],
      correctAnswer: 'changing the variable restyles every usage at once',
    },
    {
      text: 'A healthy color palette has…',
      options: ['dozens of random hues', 'a primary, neutrals, and one accent', 'only black and white', 'only brand colors'],
      correctAnswer: 'a primary, neutrals, and one accent',
    },
    {
      text: 'Using one small spacing scale gives the page…',
      options: ['randomness', 'rhythm and consistency', 'more bytes', 'fixed pixel errors'],
      correctAnswer: 'rhythm and consistency',
    },
  ],
  'File Structure & Build Plan': [
    {
      text: 'For an MVP portfolio, the right structure is…',
      options: [
        'one index.html + css/ + js/ + images/',
        'a database and a server',
        'twenty separate pages',
        'no folders at all',
      ],
      correctAnswer: 'one index.html + css/ + js/ + images/',
    },
    {
      text: 'Why keep the MVP a single index.html?',
      options: ['it is required by law', 'anchors to sections replace routing complexity', 'browsers only read one file', 'CSS needs it'],
      correctAnswer: 'anchors to sections replace routing complexity',
    },
    {
      text: 'The build order that keeps every step visible is…',
      options: [
        'JS first then HTML',
        'skeleton → CSS → responsive → JS → content → audit',
        'deploy then design',
        'images then JS',
      ],
      correctAnswer: 'skeleton → CSS → responsive → JS → content → audit',
    },
    {
      text: 'A build plan is useful because…',
      options: ['it is paperwork', 'each step is independently testable and progress is visible', 'it replaces testing', 'it is required by git'],
      correctAnswer: 'each step is independently testable and progress is visible',
    },
  ],

  // ── Section 16 — Building the Portfolio Project ───────────────────────
  'Semantic Page Skeleton: header, main & sections': [
    {
      text: 'The page skeleton is built BEFORE styling because…',
      options: ['CSS needs it', 'it turns the wireframe into a clickable page you can inspect', 'HTML cannot be edited later', 'styling comes first'],
      correctAnswer: 'it turns the wireframe into a clickable page you can inspect',
    },
    {
      text: 'Each `<section>` gets an `id` so that…',
      options: ['CSS is faster', 'nav anchors can jump to it', 'images load', 'the footer shows'],
      correctAnswer: 'nav anchors can jump to it',
    },
    {
      text: 'A "Skip to content" link is placed…',
      options: ['in the footer', 'as the FIRST element on the page', 'inside every section', 'nowhere — it is decorative'],
      correctAnswer: 'as the FIRST element on the page',
    },
    {
      text: 'The skip link mainly benefits…',
      options: ['image-heavy users', 'keyboard and screen-reader users who skip repeated nav', 'mobile data savings', 'SEO ranking'],
      correctAnswer: 'keyboard and screen-reader users who skip repeated nav',
    },
  ],
  'Hero & About Sections': [
    {
      text: 'The hero must answer, within seconds…',
      options: ['your life story', 'who you are plus one clear call to action', 'every skill', 'a pricing table'],
      correctAnswer: 'who you are plus one clear call to action',
    },
    {
      text: 'A headline that scales across screens uses…',
      options: ['font-size: 40px', 'clamp()', 'font-size: 10vw always', 'rem only on desktop'],
      correctAnswer: 'clamp()',
    },
    {
      text: 'The About section\'s two-column layout collapses on mobile using…',
      options: ['absolute positioning', 'flexbox with flex-wrap', 'fixed widths', 'tables'],
      correctAnswer: 'flexbox with flex-wrap',
    },
    {
      text: 'The profile photo must include…',
      options: ['width=200', 'a real alt attribute', 'a caption', 'loading=blocking'],
      correctAnswer: 'a real alt attribute',
    },
  ],
  'Projects Grid & Skill Section': [
    {
      text: 'The responsive projects grid uses…',
      options: [
        'grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))',
        'position: absolute per card',
        'display: inline',
        'fixed 300px columns',
      ],
      correctAnswer: 'grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))',
    },
    {
      text: 'Card screenshots should be…',
      options: ['stock images', 'real renderings of the projects', 'placeholders forever', 'images with no alt'],
      correctAnswer: 'real renderings of the projects',
    },
    {
      text: 'A project that is not live yet should…',
      options: ['link to a broken URL', 'say "In progress" honestly', 'be hidden', 'claim it works'],
      correctAnswer: 'say "In progress" honestly',
    },
    {
      text: 'For a student portfolio, how many strong cards are enough?',
      options: ['3–4', 'at least 20', '1 with no link', 'none'],
      correctAnswer: '3–4',
    },
  ],
  'Contact Form & Footer': [
    {
      text: 'A `<label for="email">` connects to the input with…',
      options: ['class="email"', 'id="email"', 'name="email"', 'data-email'],
      correctAnswer: 'id="email"',
    },
    {
      text: '`type="email"` on an input gives…',
      options: ['a database connection', 'mobile email keyboard + built-in validation', 'a file upload', 'nothing'],
      correctAnswer: 'mobile email keyboard + built-in validation',
    },
    {
      text: '`required` on an input means…',
      options: ['the field is hidden', 'the browser blocks empty submits', 'the field is styled red', 'the input is disabled'],
      correctAnswer: 'the browser blocks empty submits',
    },
    {
      text: 'The zero-backend way to let visitors contact you is…',
      options: ['a mailto: link', 'a database insert', 'a WebSocket', 'a server'],
      correctAnswer: 'a mailto: link',
    },
  ],

  // ── Section 17 — Styling & Responsive Polish ──────────────────────────
  'Consistent Spacing & Visual Rhythm': [
    {
      text: 'Drawing all spacing from one scale (4/8/16/24/32/64px)…',
      options: ['is slower', 'gives the page rhythm that reads as designed', 'is forbidden', 'breaks flexbox'],
      correctAnswer: 'gives the page rhythm that reads as designed',
    },
    {
      text: 'A consistent `line-height` and paragraph margin produce…',
      options: ['vertical rhythm', 'horizontal scroll', 'random gaps', 'bold text'],
      correctAnswer: 'vertical rhythm',
    },
    {
      text: 'Spacing communicates…',
      options: ['colours', 'grouping and relationship', 'fonts', 'speed'],
      correctAnswer: 'grouping and relationship',
    },
    {
      text: 'Related items close together, unrelated sections far apart — this is…',
      options: ['randomness', 'grouping via space', 'a bug', 'accessibility'],
      correctAnswer: 'grouping via space',
    },
  ],
  'Breakpoints, Images & the Responsive Check': [
    {
      text: 'The widths to test in DevTools responsive mode are roughly…',
      options: ['320/768/1024/1440', '640 only', '1280 only', '2000/4000'],
      correctAnswer: '320/768/1024/1440',
    },
    {
      text: 'Horizontal scroll on mobile is usually caused by…',
      options: ['too much colour', 'a fixed-width element or a wide image without max-width 100%', 'too many fonts', 'the footer'],
      correctAnswer: 'a fixed-width element or a wide image without max-width 100%',
    },
    {
      text: 'Recommended minimum touch-target size is…',
      options: ['12px', '44px', '200px', '5px'],
      correctAnswer: '44px',
    },
    {
      text: 'A good line length for body text is…',
      options: ['10 characters', '45–75 characters', '300 characters', 'no limit'],
      correctAnswer: '45–75 characters',
    },
  ],
  'Accessibility: Contrast, Focus & ARIA': [
    {
      text: 'The WCAG normal-text contrast requirement is…',
      options: ['1.5:1', '4.5:1', '3:1', '10:1'],
      correctAnswer: '4.5:1',
    },
    {
      text: 'The sin of `outline: none` without a replacement is…',
      options: ['it is fast', 'keyboard users cannot see their focus', 'it breaks flexbox', 'it disables images'],
      correctAnswer: 'keyboard users cannot see their focus',
    },
    {
      text: 'Which selector styles the keyboard focus ring?',
      options: [':hover', ':focus-visible', ':active', ':checked'],
      correctAnswer: ':focus-visible',
    },
    {
      text: 'An icon-only button needs…',
      options: ['aria-label', 'a border', 'a background image', 'text-align'],
      correctAnswer: 'aria-label',
    },
  ],
  'Performance: Images, Fonts & Minimal JS': [
    {
      text: 'The #1 source of page weight is…',
      options: ['CSS comments', 'images', 'HTML whitespace', 'the footer'],
      correctAnswer: 'images',
    },
    {
      text: '`font-display: swap` prevents…',
      options: ['fonts loading', 'invisible text while a webfont loads', 'caching', 'the page rendering'],
      correctAnswer: 'invisible text while a webfont loads',
    },
    {
      text: '`loading="lazy"` downloads an image…',
      options: ['immediately', 'only when the user scrolls near it', 'never', 'twice'],
      correctAnswer: 'only when the user scrolls near it',
    },
    {
      text: 'The tool that names your biggest performance offender is…',
      options: ['npm', 'Lighthouse', 'WebSocket', 'Git'],
      correctAnswer: 'Lighthouse',
    },
  ],

  // ── Section 18 — Interactivity & UX Enhancements ──────────────────────
  'Client-Side Form Validation': [
    {
      text: 'Client-side validation is…',
      options: ['the only security gate', 'UX feedback — the server still validates', 'a replacement for the backend', 'optional everywhere'],
      correctAnswer: 'UX feedback — the server still validates',
    },
    {
      text: 'The submit handler should…',
      options: ['always reload', 'preventDefault, validate, then handle', 'skip validation', 'clear the page'],
      correctAnswer: 'preventDefault, validate, then handle',
    },
    {
      text: 'Validate live on `blur`/`input`, but…',
      options: ['never on submit', 'always re-validate on submit', 'only on submit', 'only on hover'],
      correctAnswer: 'always re-validate on submit',
    },
    {
      text: '`input.value.trim()` is used to…',
      options: ['round numbers', 'remove surrounding whitespace so values like " a@b.com " work', 'make text bold', 'count characters'],
      correctAnswer: 'remove surrounding whitespace so values like " a@b.com " work',
    },
  ],
  'Smooth Scrolling & Scrollspy Navigation': [
    {
      text: 'One CSS line for smooth anchor scrolling is…',
      options: ['overflow: smooth', 'scroll-behavior: smooth', 'transition: scroll', 'animation: scroll 1s'],
      correctAnswer: 'scroll-behavior: smooth',
    },
    {
      text: '`scroll-margin-top: 4rem` on sections fixes…',
      options: ['page speed', 'anchor jumps landing under a fixed header', 'modal focus', 'font sizes'],
      correctAnswer: 'anchor jumps landing under a fixed header',
    },
    {
      text: 'The recommended scrollspy technique is…',
      options: ['a scroll event listener', 'IntersectionObserver', 'setInterval', 'a fetch call'],
      correctAnswer: 'IntersectionObserver',
    },
    {
      text: 'The observer approach is preferred because…',
      options: ['it is cheaper — no handler per pixel', 'it is the only option', 'it is required by law', 'it blocks rendering'],
      correctAnswer: 'it is cheaper — no handler per pixel',
    },
  ],
  'Lightbox & Modal Patterns': [
    {
      text: 'On opening a modal, focus should…',
      options: ['stay where it was', 'move into the dialog', 'move to the address bar', 'be lost'],
      correctAnswer: 'move into the dialog',
    },
    {
      text: 'While a modal is open, background scroll is locked with…',
      options: ['overflow: hidden on body, restored on close', 'position: sticky', 'display: none on body', 'a timeout'],
      correctAnswer: 'overflow: hidden on body, restored on close',
    },
    {
      text: 'The modal closes on…',
      options: ['Escape, the close button, or backdrop click', 'any keystroke', 'only the close button', 'page reload'],
      correctAnswer: 'Escape, the close button, or backdrop click',
    },
    {
      text: 'On closing a modal, focus should…',
      options: ['stay in the dialog', 'return to the element that opened it', 'go to the footer', 'be cleared'],
      correctAnswer: 'return to the element that opened it',
    },
  ],
  'Dark Mode with localStorage': [
    {
      text: '`localStorage.getItem("theme")` returns `null` when…',
      options: ['the value is "null"', 'nothing was saved yet', 'the key is empty string', 'the browser is dark'],
      correctAnswer: 'nothing was saved yet',
    },
    {
      text: 'Applying the theme script EARLY (in head) prevents…',
      options: ['the page caching', 'a flash of the wrong theme', 'localStorage errors', 'CSS loading'],
      correctAnswer: 'a flash of the wrong theme',
    },
    {
      text: 'The OS dark preference is read with…',
      options: ['window.matchMedia("(prefers-color-scheme: dark)")', 'localStorage always', 'navigator.dark', 'document.cookie'],
      correctAnswer: 'window.matchMedia("(prefers-color-scheme: dark)")',
    },
    {
      text: 'Theme colors swap automatically because they are…',
      options: ['hardcoded in HTML', 'CSS variables under [data-theme]', 'inline styles', 'server-side'],
      correctAnswer: 'CSS variables under [data-theme]',
    },
  ],

  // ── Section 19 — Git, Hosting & Deployment ────────────────────────────
  'Version Control Basics: init, add & commit': [
    {
      text: 'The Git workflow order is…',
      options: ['commit → add → edit', 'edit → git add → git commit', 'push → add → edit', 'add → commit → edit'],
      correctAnswer: 'edit → git add → git commit',
    },
    {
      text: '`git add` moves changes to…',
      options: ['the remote', 'the staging area', 'the trash', 'a branch'],
      correctAnswer: 'the staging area',
    },
    {
      text: '`git status` shows…',
      options: ['your internet speed', 'which files changed and are staged', 'the commit log only', 'the remote URL'],
      correctAnswer: 'which files changed and are staged',
    },
    {
      text: 'Good commit messages explain…',
      options: ['the file size', 'why the change was made', 'your name', 'the date'],
      correctAnswer: 'why the change was made',
    },
  ],
  'Branches, Merging & .gitignore': [
    {
      text: 'A feature-branch workflow keeps `main`…',
      options: ['full of experiments', 'always deployable — features merge when stable', 'private', 'empty'],
      correctAnswer: 'always deployable — features merge when stable',
    },
    {
      text: 'A merge conflict happens when…',
      options: ['git is broken', 'two branches changed the same lines differently and you must choose', 'a branch is deleted', 'the repo is new'],
      correctAnswer: 'two branches changed the same lines differently and you must choose',
    },
    {
      text: '`.gitignore` should include…',
      options: ['index.html', 'node_modules and .env (secrets)', 'your source files', 'the README'],
      correctAnswer: 'node_modules and .env (secrets)',
    },
    {
      text: '`.env` must be git-ignored because…',
      options: ['it is large', 'it may hold API keys and secrets', 'it is binary', 'it breaks git'],
      correctAnswer: 'it may hold API keys and secrets',
    },
  ],
  'Deploying to Modern Static Hosting': [
    {
      text: 'Netlify, Vercel and GitHub Pages are…',
      options: ['databases', 'static hosting platforms that serve over HTTPS', 'JavaScript frameworks', 'CSS preprocessors'],
      correctAnswer: 'static hosting platforms that serve over HTTPS',
    },
    {
      text: 'Continuous deployment means…',
      options: ['you push and deploy manually', 'every git push to main auto-redeploys', 'deploys happen by email', 'only branches deploy'],
      correctAnswer: 'every git push to main auto-redeploys',
    },
    {
      text: 'These platforms provide HTTPS certificates…',
      options: ['manually, you must buy them', 'automatically', 'never', 'after 30 days'],
      correctAnswer: 'automatically',
    },
    {
      text: 'For a plain static portfolio, the build command is…',
      options: ['npm run build — required', 'empty — there is no build step', 'gcc', 'python manage.py migrate'],
      correctAnswer: 'empty — there is no build step',
    },
  ],
  'Custom Domains & the Deploy Pipeline': [
    {
      text: 'A custom domain is connected by…',
      options: ['changing DNS records at the registrar to point at your host', 'editing the HTML', 'renaming the repo', 'a phone call'],
      correctAnswer: 'changing DNS records at the registrar to point at your host',
    },
    {
      text: 'The apex domain uses which DNS record?',
      options: ['A record', 'MX record', 'TXT record', 'SRV record'],
      correctAnswer: 'A record',
    },
    {
      text: '`www` subdomain typically uses which record?',
      options: ['A', 'CNAME', 'TXT', 'NS'],
      correctAnswer: 'CNAME',
    },
    {
      text: 'Preview deploys for pull requests let you…',
      options: ['skip testing', 'review a build of the PR at its own URL before merging', 'push to main directly', 'delete branches'],
      correctAnswer: 'review a build of the PR at its own URL before merging',
    },
  ],

  // ── Section 20 — Final Project Review & Certification ─────────────────
  'The Code Review Checklist': [
    {
      text: 'Reviewing code as if a stranger wrote it helps…',
      options: ['find obvious issues you gloss over', 'slow down the build', 'replace testing', 'avoid git'],
      correctAnswer: 'find obvious issues you gloss over',
    },
    {
      text: 'A leftover `console.log` in production code is…',
      options: ['fine and normal', 'reviewable dead code to remove before shipping', 'required', 'an error'],
      correctAnswer: 'reviewable dead code to remove before shipping',
    },
    {
      text: 'The HTML review checks that…',
      options: ['every image has alt and every input has a label', 'images have no alt', 'there are many divs', 'headings are skipped'],
      correctAnswer: 'every image has alt and every input has a label',
    },
    {
      text: 'The JS review checks that…',
      options: ['var is used everywhere', 'every fetch has error handling', 'console.log stays', 'innerHTML is used for user data'],
      correctAnswer: 'every fetch has error handling',
    },
  ],
  'Testing Across Devices & Browsers': [
    {
      text: 'The cheapest first step of cross-device testing is…',
      options: ['buying a real device for every model', 'DevTools responsive mode at key widths', 'screenshots', 'a server'],
      correctAnswer: 'DevTools responsive mode at key widths',
    },
    {
      text: 'Testing on a REAL phone is necessary because…',
      options: ['DevTools lies about layout', 'touch feel, scrolling and real font sizes only appear on hardware', 'phones are faster', 'browsers block DevTools'],
      correctAnswer: 'touch feel, scrolling and real font sizes only appear on hardware',
    },
    {
      text: 'Testing with keyboard only (Tab/Enter/Escape) finds…',
      options: ['colour issues', 'focus bugs, missing labels, modal traps', 'image weight', 'DNS errors'],
      correctAnswer: 'focus bugs, missing labels, modal traps',
    },
    {
      text: 'A page should survive browser zoom up to…',
      options: ['110%', '200% and even 400%', '150%', 'no zoom'],
      correctAnswer: '200% and even 400%',
    },
  ],
  'The Performance & Accessibility Audit': [
    {
      text: 'Lighthouse scores which four areas?',
      options: [
        'Performance, Accessibility, Best Practices, SEO',
        'Speed, Colour, Fonts, Images',
        'HTML, CSS, JS, Git',
        'Design, Code, Test, Deploy',
      ],
      correctAnswer: 'Performance, Accessibility, Best Practices, SEO',
    },
    {
      text: 'The recommended submission targets are…',
      options: ['50 for everything', '90+ on Performance and Accessibility', '100 only on SEO', 'any score'],
      correctAnswer: '90+ on Performance and Accessibility',
    },
    {
      text: 'For a trustworthy score, run Lighthouse…',
      options: ['on localhost with extensions', 'on the deployed URL in a fresh window', 'in a screenshot tool', 'on a single image'],
      correctAnswer: 'on the deployed URL in a fresh window',
    },
    {
      text: 'Lighthouse is best described as…',
      options: ['a decoration', 'a prioritized bug list with fixes', 'a hosting service', 'a font provider'],
      correctAnswer: 'a prioritized bug list with fixes',
    },
  ],
  'Certification Prep & What Comes Next': [
    {
      text: 'The most effective final revision exercise is…',
      options: ['reading notes once', 'rebuilding the portfolio from memory to expose gaps', 'watching more tutorials', 'copying another site'],
      correctAnswer: 'rebuilding the portfolio from memory to expose gaps',
    },
    {
      text: 'One-sentence answers to concept questions are important because…',
      options: ['they are short', 'interviews and exams probe explanation, not just recognition', 'they fill space', 'they are required by git'],
      correctAnswer: 'interviews and exams probe explanation, not just recognition',
    },
    {
      text: 'The natural next step after this course is…',
      options: ['learning a JS framework (React), then real APIs and backend', 'starting over with HTML', 'stopping', 'only CSS'],
      correctAnswer: 'learning a JS framework (React), then real APIs and backend',
    },
    {
      text: 'The deployed portfolio is part of the submission because…',
      options: ['deploying is mandatory', 'it proves you can ship, and it is the audit target', 'hosting is expensive', 'it hides code'],
      correctAnswer: 'it proves you can ship, and it is the audit target',
    },
  ],
};
