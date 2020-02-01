const fs = require('fs');
const childProcess = require('child_process');

const marked = require('marked');
const hljs = require('highlight.js');

const srcDirectory = `website`;
const distDirectory = `dist/${srcDirectory}`;

const exec = command => childProcess.execSync(command, { stdio: 'inherit' });

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: code => hljs.highlightAuto(code).value,
  gfm: true,
  headerIds: true,
});

fs.rmdirSync(distDirectory, { recursive: true });
fs.mkdirSync(distDirectory, { recursive: true });

const createPageFromMarkdown = markdownFilePath =>
  template.replace('{{content}}', marked(fs.readFileSync(markdownFilePath, 'utf-8')));

const highlightLink = (html, href) =>
  html.replace(`<a href="${href}"`, `<a href="${href}" class="active"`);

const addBodyClass = (html, className) => html.replace(`<body`, `<body class="${className}"`);

const template = fs.readFileSync(`${srcDirectory}/template.html`, 'utf-8');
const sizeComparisonChart = fs.readFileSync(`${srcDirectory}/size-comparison-chart.html`, 'utf-8');

const indexPage = createPageFromMarkdown('./README.md')
  .replace(/:<\/strong>/g, '</strong>')
  .replace(/<!-- size-comparison -->[\s\S]*?<!-- \/size-comparison -->/gm, sizeComparisonChart);
fs.writeFileSync(
  `${distDirectory}/index.html`,
  addBodyClass(highlightLink(indexPage, './index.html'), 'home')
);

fs.writeFileSync(
  `${distDirectory}/api.html`,
  addBodyClass(highlightLink(createPageFromMarkdown('./API.md'), './api.html'), 'api')
);

fs.writeFileSync(
  `${distDirectory}/guide.html`,
  addBodyClass(highlightLink(createPageFromMarkdown('./GUIDE.md'), './guide.html'), 'guide')
);

const repl = fs.readFileSync(`${srcDirectory}/repl.html`, 'utf-8');
fs.writeFileSync(
  `${distDirectory}/repl.html`,
  addBodyClass(highlightLink(template.replace('{{content}}', repl), './repl.html'), 'repl')
);

childProcess.execSync(`./node_modules/.bin/rollup -c ${srcDirectory}/rollup.config.js`, {
  stdio: 'inherit',
});

exec('./node_modules/.bin/terser -cm -o ./dist/website/index.js ./dist/website/index.js');
exec('./node_modules/.bin/terser -cm -o ./dist/website/repl.js ./dist/website/repl.js');
fs.copyFileSync('node_modules/mini.css/dist/mini-default.min.css', 'dist/website/repl-iframe.css');
fs.copyFileSync('dist/adequate.min.js', 'dist/website/adequate.min.js');
