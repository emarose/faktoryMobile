const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, '..', 'src');
const OUTPUT_FILE = path.join(__dirname,'..',  'analysis-result.txt');
const IGNORED_EXTENSIONS = [".json", ".md", ".lock"];
const IGNORED_FILES = ["styles.js"];
const INLINE_STYLE_THRESHOLD = 5; // Puedes ajustar este valor

let allFiles = [];
let importMap = {};

function analyzeNodeColors() {
  // Primero, extraer la fuente de verdad desde nodeTypes.js
  const nodeTypesFile = path.join(SRC_DIR, 'data', 'nodeTypes.js');
  let sourceOfTruth = {};
  
  if (fs.existsSync(nodeTypesFile)) {
    const nodeTypesContent = fs.readFileSync(nodeTypesFile, 'utf8');
    // Extraer definiciones del NODE_TYPES_MAP
    const nodeMapRegex = /{\s*type:\s*["']([^"']+)["']\s*,\s*name:\s*["'][^"']*["']\s*,\s*color:\s*["'](#[^"']+)["']\s*}/g;
    let match;
    while ((match = nodeMapRegex.exec(nodeTypesContent))) {
      const nodeType = match[1];
      const color = match[2].toUpperCase();
      sourceOfTruth[nodeType] = {
        officialColor: color,
        usages: []
      };
    }
  }

  // Ahora buscar todos los usos de colores en el proyecto
  const allColorUsages = {};
  const inconsistencies = [];

  allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const fileName = path.relative(SRC_DIR, file);

    // Buscar definiciones de colores hardcodeados
    const colorDefRegex = /(\w*(?:ore|coal|limestone|quartz|crudeOil|caterium|bauxite|uranium|sulfur)\w*)\s*:\s*['"`](#[0-9a-fA-F]{3,8})['"`]/gi;
    let match;
    while ((match = colorDefRegex.exec(content))) {
      const nodeType = match[1];
      const color = match[2].toUpperCase();
      
      if (!allColorUsages[color]) {
        allColorUsages[color] = {
          usedFor: [],
          files: new Set()
        };
      }
      
      if (!allColorUsages[color].usedFor.includes(nodeType)) {
        allColorUsages[color].usedFor.push(nodeType);
      }
      allColorUsages[color].files.add(fileName);

      // Verificar contra la fuente de verdad
      Object.keys(sourceOfTruth).forEach(officialNodeType => {
        if (nodeType.toLowerCase().includes(officialNodeType.toLowerCase().replace('_node', '')) ||
            officialNodeType.toLowerCase().includes(nodeType.toLowerCase().replace('_node', ''))) {
          
          sourceOfTruth[officialNodeType].usages.push({
            color: color,
            file: fileName,
            context: nodeType
          });

          if (color !== sourceOfTruth[officialNodeType].officialColor) {
            inconsistencies.push({
              nodeType: officialNodeType,
              officialColor: sourceOfTruth[officialNodeType].officialColor,
              foundColor: color,
              file: fileName,
              context: nodeType
            });
          }
        }
      });
    }
  });

  let output = '\n=== NODE COLORS ANALYSIS (vs nodeTypes.js) ===\n';
  
  // Mostrar fuente de verdad
  output += '\n📚 OFFICIAL NODE COLORS (from nodeTypes.js):\n';
  if (Object.keys(sourceOfTruth).length > 0) {
    Object.keys(sourceOfTruth).sort().forEach(nodeType => {
      const info = sourceOfTruth[nodeType];
      output += `📌 ${nodeType.padEnd(20)} → ${info.officialColor}\n`;
    });
  } else {
    output += '❌ Could not read nodeTypes.js\n';
  }

  // Mostrar todos los colores encontrados en el proyecto
  output += '\n🔍 ALL COLORS FOUND IN PROJECT:\n';
  const sortedColors = Object.keys(allColorUsages).sort();
  sortedColors.forEach(color => {
    const usage = allColorUsages[color];
    const nodeTypesForThisColor = usage.usedFor.join(', ');
    const fileCount = usage.files.size;
    output += `🎨 ${color} → ${nodeTypesForThisColor} (${fileCount} file${fileCount > 1 ? 's' : ''})\n`;
  });

  // Mostrar inconsistencias
  if (inconsistencies.length > 0) {
    output += '\n🚨 INCONSISTENCIES DETECTED:\n';
    inconsistencies.forEach(inc => {
      output += `❌ ${inc.nodeType}: Official=${inc.officialColor} but found ${inc.foundColor} in ${inc.file} (as ${inc.context})\n`;
    });
    output += '\n💡 Fix: Update hardcoded colors to match nodeTypes.js or use getNodeColor() function\n';
  } else {
    output += '\n✅ All colors match the official nodeTypes.js definitions!\n';
  }

  // Estadísticas
  const totalOfficialNodes = Object.keys(sourceOfTruth).length;
  const totalColorsFound = Object.keys(allColorUsages).length;
  const inconsistentCount = inconsistencies.length;
  
  output += `\n📊 STATS: ${totalOfficialNodes} official nodes | ${totalColorsFound} colors found | ${inconsistentCount} inconsistencies\n`;

  return output;
}

function analyzeColorsByType() {
  const bgColorRegex = /backgroundColor\s*:\s*['"`]([^'"`]+)['"`]/g;
  const textColorRegex = /[^a-zA-Z]color\s*:\s*['"`]([^'"`]+)['"`]/g; // avoid matching shadowColor
  // Exclude shadowColor
  const shadowColorRegex = /shadowColor\s*:\s*['"`]([^'"`]+)['"`]/g;

  const bgColorCount = {};
  const textColorCount = {};
  const nodeRelatedColors = {};
  let totalBg = 0;
  let totalText = 0;

  allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const fileName = path.relative(SRC_DIR, file);

    // Exclude shadowColor
    let contentNoShadow = content.replace(shadowColorRegex, '');

    // Check if this file seems to be node/ore related
    const isNodeRelated = /(?:node|ore|coal|limestone|quartz|oil|caterium|mining|miner)/i.test(fileName) ||
                         /(?:getNodeColor|nodeColor|nodeType|ore|mining)/i.test(content);

    // Background colors
    let match;
    while ((match = bgColorRegex.exec(contentNoShadow))) {
      const color = match[1];
      if (color && (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl'))) {
        bgColorCount[color] = (bgColorCount[color] || 0) + 1;
        totalBg++;
        
        // Track node-related colors separately
        if (isNodeRelated) {
          if (!nodeRelatedColors[color]) {
            nodeRelatedColors[color] = { files: [], type: 'background' };
          }
          if (!nodeRelatedColors[color].files.includes(fileName)) {
            nodeRelatedColors[color].files.push(fileName);
          }
        }
      }
    }

    // Text colors (avoid shadowColor)
    while ((match = textColorRegex.exec(contentNoShadow))) {
      const color = match[1];
      if (color && (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl'))) {
        textColorCount[color] = (textColorCount[color] || 0) + 1;
        totalText++;
        
        // Track node-related colors separately
        if (isNodeRelated) {
          if (!nodeRelatedColors[color]) {
            nodeRelatedColors[color] = { files: [], type: 'text' };
          }
          if (!nodeRelatedColors[color].files.includes(fileName)) {
            nodeRelatedColors[color].files.push(fileName);
          }
          if (nodeRelatedColors[color].type === 'background') {
            nodeRelatedColors[color].type = 'mixed';
          } else if (nodeRelatedColors[color].type !== 'mixed') {
            nodeRelatedColors[color].type = 'text';
          }
        }
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

  // Node-related colors summary (simplified)
  function nodeColorsToString() {
    let out = '\n=== OTHER COLORS IN NODE/MINING FILES ===\n';
    if (Object.keys(nodeRelatedColors).length === 0) {
      out += 'No additional node-related colors found.\n';
      return out;
    }

    // Group colors by frequency
    const colorsByFrequency = Object.entries(nodeRelatedColors)
      .map(([color, info]) => ({
        color,
        count: info.files.length,
        type: info.type
      }))
      .sort((a, b) => b.count - a.count);

    // Show top colors without file details
    out += 'Most used colors in node-related files:\n';
    colorsByFrequency.slice(0, 10).forEach(stat => {
      out += `${stat.color} → ${stat.count} file${stat.count > 1 ? 's' : ''} (${stat.type})\n`;
    });
    
    if (colorsByFrequency.length > 10) {
      out += `... and ${colorsByFrequency.length - 10} more colors\n`;
    }
    
    out += `\nTotal colors in node-related files: ${colorsByFrequency.length}\n`;
    return out;
  }

  // Add a global total summary
  const totalUniqueColors = Object.keys(bgColorCount).length + Object.keys(textColorCount).length;
  let summary = `\n=== GLOBAL COLOR SUMMARY ===\nTotal unique backgroundColor: ${Object.keys(bgColorCount).length}\nTotal unique text color: ${Object.keys(textColorCount).length}\nTotal unique colors (all): ${totalUniqueColors}\nColors in node-related files: ${Object.keys(nodeRelatedColors).length}\n`;

  return (
    summary +
    statsToString(bgColorCount, totalBg, 'backgroundColor usage') +
    statsToString(textColorCount, totalText, 'text color usage') +
    nodeColorsToString()
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

const largeFiles = findLargeFiles();
const filesWithManyInlineStyles = findFilesWithManyInlineStyles();

let output = '';

output += '\n=== Files with more than 300 lines (excluding styles.js) ===\n';
largeFiles.forEach(f => output += f + '\n');

output += '\n=== Files with many inline styles and NO styles.js in the same folder ===\n';
filesWithManyInlineStyles.forEach(f =>
  output += `${f.file} (inline styles: ${f.inlineStyleCount})\n`
);

// Add color analysis
output += analyzeNodeColors();
output += analyzeColorsByType();

fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
console.log(`Analysis complete! See ${OUTPUT_FILE}`);