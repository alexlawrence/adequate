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

const template = fs.readFileSync(`${srcDirectory}/template.html`, 'utf-8');
const sizeComparisonChart = fs.readFileSync(`${srcDirectory}/size-comparison-chart.html`, 'utf-8');

const readme = fs.readFileSync('./README.md', 'utf-8');
const indexHtml = marked(readme)
  .replace(/:<\/strong>/g, '</strong>')
  .replace(/<!-- size-comparison -->[\s\S]*?<!-- \/size-comparison -->/gm, sizeComparisonChart);
fs.writeFileSync(`${distDirectory}/index.html`, template.replace('{{content}}', indexHtml));

const apiHtml = marked(fs.readFileSync('./API.md', 'utf-8'));
fs.writeFileSync(`${distDirectory}/api.html`, template.replace('{{content}}', apiHtml));

const guideHtml = marked(fs.readFileSync('./GUIDE.md', 'utf-8'));
fs.writeFileSync(`${distDirectory}/guide.html`, template.replace('{{content}}', guideHtml));

const repl = fs.readFileSync(`${srcDirectory}/repl-content.html`, 'utf-8');
fs.writeFileSync(`${distDirectory}/repl.html`, template.replace('{{content}}', repl));

childProcess.execSync(`./node_modules/.bin/rollup -c ${srcDirectory}/rollup.config.js`, {
  stdio: 'inherit',
});

exec('./node_modules/.bin/terser -cm -o ./dist/website/index.js ./dist/website/index.js');

exec('./node_modules/.bin/terser -cm -o ./dist/website/repl.js ./dist/website/repl.js');

fs.copyFileSync('dist/adequate.min.js', 'dist/website/adequate.min.js');
