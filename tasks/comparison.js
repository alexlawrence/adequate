import childProcess from 'child_process';
import fs from 'fs';
import zlib from 'zlib';

const mergeFiles = (inputFilenames, outputFilename) => {
  const content = inputFilenames.map((filename) => fs.readFileSync(filename, 'utf-8')).join('\n');
  fs.writeFileSync(outputFilename, content);
};

const execTerser = (options) =>
  childProcess.execSync(`npx terser -cm -o ${options}`, {
    stdio: 'inherit',
  });

const gzip = (absoluteFilename) =>
  fs.writeFileSync(
    absoluteFilename + '.gz',
    zlib.gzipSync(fs.readFileSync(absoluteFilename, 'utf-8')),
  );

const calculateFileSize = (absoluteFilename) =>
  (fs.statSync(absoluteFilename).size / 1024).toFixed(3);

fs.rmSync('./dist/comparison', { recursive: true, force: true });

const exampleAppsToBuild = ['todo-list'];

const build = (libraryName, libraryFilenames) => {
  console.log(`${libraryName}:`);
  const srcDirectory = `comparison/${libraryName}`;
  const distDirectory = `dist/${srcDirectory}`;
  fs.mkdirSync(distDirectory, { recursive: true });
  mergeFiles(
    libraryFilenames.map((filename) => `${srcDirectory}/${filename}`),
    `${distDirectory}/${libraryName}.min.js`,
  );
  gzip(`${distDirectory}/${libraryName}.min.js`);
  console.log(
    `- minzipped library size: ${calculateFileSize(`${distDirectory}/${libraryName}.min.js.gz`)}kb`,
  );
  exampleAppsToBuild.forEach((app) => {
    fs.mkdirSync(`${distDirectory}/${app}`, { recursive: true });
    execTerser(`${distDirectory}/${app}/index.min.js ${srcDirectory}/${app}/index.js`);
    mergeFiles(
      [`${distDirectory}/${libraryName}.min.js`, `${distDirectory}/${app}/index.min.js`],
      `${distDirectory}/${app}/bundle.min.js`,
    );
    gzip(`${distDirectory}/${app}/bundle.min.js`);
    fs.copyFileSync(`${srcDirectory}/${app}/index.html`, `${distDirectory}/${app}/index.html`);
    console.log(
      `- minzipped ${app} bundle size: ${calculateFileSize(
        `${distDirectory}/${app}/bundle.min.js.gz`,
      )}kb`,
    );
  });
};

console.log('library comparison\n\n');
build('react@17.0.1', ['react.production.min.js', 'react-dom.production.min.js']);
build('preact@10.5.12', ['preact.umd.js', 'hooks.umd.js']);
fs.copyFileSync('dist/adequate.min.js', 'comparison/adequate@latest/adequate.min.js');
build('adequate@latest', ['adequate.min.js']);
