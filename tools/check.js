const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, '..', 'src');
const OUTPUT_FILE = path.join(__dirname, '..', '..', 'analysis-result.txt');
const IGNORED_EXTENSIONS = [".json", ".md", ".lock"];
const IGNORED_FILES = ["styles.js"];
const INLINE_STYLE_THRESHOLD = 5; // Puedes ajustar este valor

let allFiles = [];
let importMap = {};

function analyzeColorsByType() {
  const bgColorRegex = /backgroundColor\s*:\s*['"`]([^'"`]+)['"`]/g;
  const textColorRegex = /[^a-zA-Z]color\s*:\s*['"`]([^'"`]+)['"`]/g; // avoid matching shadowColor
  // Exclude shadowColor
  const shadowColorRegex = /shadowColor\s*:\s*['"`]([^'"`]+)['"`]/g;

  const bgColorCount = {};
  const textColorCount = {};
  let totalBg = 0;
  let totalText = 0;

  allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');

    // Exclude shadowColor
    let contentNoShadow = content.replace(shadowColorRegex, '');

    // Background colors
    let match;
    while ((match = bgColorRegex.exec(contentNoShadow))) {
      const color = match[1];
      if (color && (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl'))) {
        bgColorCount[color] = (bgColorCount[color] || 0) + 1;
        totalBg++;
      }
    }

    // Text colors (avoid shadowColor)
    while ((match = textColorRegex.exec(contentNoShadow))) {
      const color = match[1];
      if (color && (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl'))) {
        textColorCount[color] = (textColorCount[color] || 0) + 1;
        totalText++;
      }
    }
  });

  // Prepare output
  function statsToString(obj, total, label) {
    const stats = Object.entries(obj)
      .map(([color, count]) => ({
        color,
        count,
        percent: ((count / total) * 100).toFixed(2)
      }))
      .sort((a, b) => b.count - a.count);

    let out = `\n=== ${label} ===\n`;
    stats.forEach(stat => {
      out += `${stat.color}: ${stat.count} uses (${stat.percent}%)\n`;
    });
    out += `Total unique ${label}: ${stats.length}\n`;
    return out;
  }

  // Add a global total summary
  const totalUniqueColors = Object.keys(bgColorCount).length + Object.keys(textColorCount).length;
  let summary = `\n=== Color summary ===\nTotal unique backgroundColor: ${Object.keys(bgColorCount).length}\nTotal unique text color: ${Object.keys(textColorCount).length}\nTotal unique colors (all): ${totalUniqueColors}\n`;

  return (
    summary +
    statsToString(bgColorCount, totalBg, 'backgroundColor usage') +
    statsToString(textColorCount, totalText, 'text color usage')
  );
}
// Recursively get all JS/TS files in src
function getAllFiles(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath);
    } else {
      const ext = path.extname(file);
      if (
        (ext === ".js" || ext === ".jsx" || ext === ".ts" || ext === ".tsx") &&
        !IGNORED_EXTENSIONS.includes(ext)
      ) {
        allFiles.push(fullPath);
      }
    }
  });
}

// Build import map
function buildImportMap() {
  allFiles.forEach((file) => {
    const content = fs.readFileSync(file, "utf8");
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
    imports.forEach((imp) => {
      // Only consider relative imports
      if (imp.startsWith(".")) {
        let resolved = path.resolve(path.dirname(file), imp);
        // Try with and without extension
        if (!fs.existsSync(resolved) && fs.existsSync(resolved + ".js")) {
          resolved += ".js";
        } else if (
          !fs.existsSync(resolved) &&
          fs.existsSync(resolved + ".jsx")
        ) {
          resolved += ".jsx";
        } else if (
          !fs.existsSync(resolved) &&
          fs.existsSync(resolved + ".ts")
        ) {
          resolved += ".ts";
        } else if (
          !fs.existsSync(resolved) &&
          fs.existsSync(resolved + ".tsx")
        ) {
          resolved += ".tsx";
        }
        imported.add(resolved);
      }
    });
  });

  // Files that are not imported anywhere (except entry points)
  const unused = allFiles.filter(
    (file) =>
      !imported.has(file) &&
      !file.endsWith("App.js") &&
      !file.endsWith("index.js") // entry points
  );
  return unused;
}

// Find large files (excluding styles.js)
function findLargeFiles() {
  return allFiles.filter((file) => {
    if (IGNORED_FILES.includes(path.basename(file))) return false;
    const lines = fs.readFileSync(file, "utf8").split("\n").length;
    return lines > 200;
  });
}

// Find files with many inline styles and no styles.js
function findFilesWithManyInlineStyles() {
  const candidates = [];
  allFiles.forEach((file) => {
    if (IGNORED_FILES.includes(path.basename(file))) return;
    const dir = path.dirname(file);
    const stylesFile = path.join(dir, "styles.js");
    if (!fs.existsSync(stylesFile)) {
      const content = fs.readFileSync(file, "utf8");
      // Count occurrences of style={{ or style = {
      const inlineStyleCount =
        (content.match(/style\s*=\s*{{/g) || []).length +
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

// Add color analysis
output += analyzeColorsByType();

fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
console.log(`Analysis complete! See ${OUTPUT_FILE}`);