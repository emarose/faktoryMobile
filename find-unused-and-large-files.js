const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const IGNORED_EXTENSIONS = ['.json', '.md', '.lock'];
const IGNORED_FILES = ['styles.js'];
const OUTPUT_FILE = path.join(__dirname, 'analysis-result.txt');
const INLINE_STYLE_THRESHOLD = 5; // Puedes ajustar este valor

let allFiles = [];
let importMap = {};

// Recursively get all JS/TS files in src
function getAllFiles(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath);
    } else {
      const ext = path.extname(file);
      if (
        (ext === '.js' || ext === '.jsx' || ext === '.ts' || ext === '.tsx') &&
        !IGNORED_EXTENSIONS.includes(ext)
      ) {
        allFiles.push(fullPath);
      }
    }
  });
}

// Build import map
function buildImportMap() {
  allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const imports = [];
    // Simple regex for import ... from '...'
    const regex = /import\s+.*?from\s+['"](.*?)['"]/g;
    let match;
    while ((match = regex.exec(content))) {
      imports.push(match[1]);
    }
    importMap[file] = imports;
  });
}

// Find unused files
function findUnusedFiles() {
  // Build a set of all imported paths (relative to src)
  const imported = new Set();
  Object.entries(importMap).forEach(([file, imports]) => {
    imports.forEach(imp => {
      // Only consider relative imports
      if (imp.startsWith('.')) {
        let resolved = path.resolve(path.dirname(file), imp);
        // Try with and without extension
        if (!fs.existsSync(resolved) && fs.existsSync(resolved + '.js')) {
          resolved += '.js';
        } else if (!fs.existsSync(resolved) && fs.existsSync(resolved + '.jsx')) {
          resolved += '.jsx';
        } else if (!fs.existsSync(resolved) && fs.existsSync(resolved + '.ts')) {
          resolved += '.ts';
        } else if (!fs.existsSync(resolved) && fs.existsSync(resolved + '.tsx')) {
          resolved += '.tsx';
        }
        imported.add(resolved);
      }
    });
  });

  // Files that are not imported anywhere (except entry points)
  const unused = allFiles.filter(
    file =>
      !imported.has(file) &&
      !file.endsWith('App.js') &&
      !file.endsWith('index.js') // entry points
  );
  return unused;
}

// Find large files (excluding styles.js)
function findLargeFiles() {
  return allFiles.filter(file => {
    if (IGNORED_FILES.includes(path.basename(file))) return false;
    const lines = fs.readFileSync(file, 'utf8').split('\n').length;
    return lines > 300;
  });
}

// Find files with many inline styles and no styles.js
function findFilesWithManyInlineStyles() {
  const candidates = [];
  allFiles.forEach(file => {
    if (IGNORED_FILES.includes(path.basename(file))) return;
    const dir = path.dirname(file);
    const stylesFile = path.join(dir, 'styles.js');
    if (!fs.existsSync(stylesFile)) {
      const content = fs.readFileSync(file, 'utf8');
      // Count occurrences of style={{ or style = {
      const inlineStyleCount = (content.match(/style\s*=\s*{{/g) || []).length +
                               (content.match(/style={{/g) || []).length;
      if (inlineStyleCount >= INLINE_STYLE_THRESHOLD) {
        candidates.push({ file, inlineStyleCount });
      }
    }
  });
  return candidates;
}

// MAIN
getAllFiles(SRC_DIR);
buildImportMap();

const unusedFiles = findUnusedFiles();
const largeFiles = findLargeFiles();
const filesWithManyInlineStyles = findFilesWithManyInlineStyles();

let output = '';

output += '=== Unused files (not imported anywhere) ===\n';
unusedFiles.forEach(f => output += f + '\n');

output += '\n=== Files with more than 300 lines (excluding styles.js) ===\n';
largeFiles.forEach(f => output += f + '\n');

output += '\n=== Files with many inline styles and NO styles.js in the same folder ===\n';
filesWithManyInlineStyles.forEach(f =>
  output += `${f.file} (inline styles: ${f.inlineStyleCount})\n`
);

fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
console.log(`Analysis complete! See ${OUTPUT_FILE}`);