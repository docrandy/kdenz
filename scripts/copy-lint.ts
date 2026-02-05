#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

/**
 * Copy Lint: Enforce language boundaries for VoiceLab
 *
 * Scans TypeScript/TSX files for banned words defined in
 * docs/foundation/product/language-boundaries-v1.md
 */

interface BannedWord {
  word: string;
  category: string;
  alternative?: string;
}

// Banned words from language-boundaries-v1.md
const BANNED_WORDS: BannedWord[] = [
  // Diagnostic / Clinical Terms
  { word: 'diagnose', category: 'Diagnostic/Clinical', alternative: 'identify patterns, track metrics' },
  { word: 'diagnosis', category: 'Diagnostic/Clinical', alternative: 'identify patterns, track metrics' },
  { word: 'disorder', category: 'Diagnostic/Clinical', alternative: 'Never needed' },
  { word: 'therapy', category: 'Diagnostic/Clinical', alternative: 'practice, coaching' },
  { word: 'therapeutic', category: 'Diagnostic/Clinical', alternative: 'practice, coaching' },
  { word: 'patient', category: 'Diagnostic/Clinical', alternative: 'user, coachee' },
  { word: 'treatment', category: 'Diagnostic/Clinical', alternative: 'practice plan, approach' },
  { word: 'symptom', category: 'Diagnostic/Clinical', alternative: 'pattern, observation' },

  // Psychological Attribution
  { word: 'anxious', category: 'Psychological', alternative: 'your pace increased' },
  { word: 'anxiety', category: 'Psychological', alternative: 'your pace increased' },
  { word: 'confident', category: 'Psychological', alternative: 'your pitch range was X semitones' },
  { word: 'confidence score', category: 'Psychological', alternative: 'your pitch range was X semitones' },
  { word: 'nervous', category: 'Psychological', alternative: 'speech rate was higher than your baseline' },
  { word: 'stressed', category: 'Psychological', alternative: 'Describe observable metrics only' },
  { word: 'emotional state', category: 'Psychological', alternative: 'vocal characteristics' },

  // Judgment / Prescriptive
  { word: 'good', category: 'Judgment', alternative: 'compared to your baseline' },
  { word: 'bad', category: 'Judgment', alternative: 'compared to your baseline' },
  { word: 'correct', category: 'Judgment', alternative: 'typical for you' },
  { word: 'incorrect', category: 'Judgment', alternative: 'different from your baseline' },
  { word: 'improve', category: 'Judgment', alternative: 'you may want to explore' },
  { word: 'you need to', category: 'Judgment', alternative: 'you might consider' },
  { word: 'weakness', category: 'Judgment', alternative: 'area of change' },
  { word: 'problem', category: 'Judgment', alternative: 'pattern, observation' },
  { word: 'normal', category: 'Judgment', alternative: 'your typical range' },
  { word: 'abnormal', category: 'Judgment', alternative: 'your typical range' },

  // Accuracy / Certainty Overreach
  { word: 'accurately detects', category: 'Accuracy Overreach', alternative: 'tracks, estimates' },
  { word: 'proven to', category: 'Accuracy Overreach', alternative: 'research suggests, designed to' },
  { word: 'scientifically validated', category: 'Accuracy Overreach', alternative: 'evidence-informed' },
  { word: 'AI-powered insights', category: 'Accuracy Overreach', alternative: 'Name the specific metric' },
];

interface Violation {
  file: string;
  line: number;
  word: string;
  context: string;
  category: string;
  alternative?: string;
}

function getAllFiles(dirPath: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules, dist, build directories
      if (!['node_modules', 'dist', 'build', '.git', '.vercel'].includes(file)) {
        getAllFiles(filePath, fileList);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function removeComments(content: string): string {
  // Remove single-line comments
  content = content.replace(/\/\/.*$/gm, '');
  // Remove multi-line comments
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  return content;
}

function scanFile(filePath: string): Violation[] {
  const violations: Violation[] = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Remove comments from the line
    const cleanLine = removeComments(line);

    // Check if line contains string literals (basic detection)
    const hasStringContent = cleanLine.includes('"') || cleanLine.includes("'") || cleanLine.includes('`');

    if (!hasStringContent) {
      return; // Skip lines without strings
    }

    BANNED_WORDS.forEach((banned) => {
      // Create word boundary regex for whole word matching
      const regex = new RegExp(`\\b${banned.word.replace(/\s+/g, '\\s+')}\\b`, 'gi');

      if (regex.test(cleanLine)) {
        // Find the match position to extract context
        const match = regex.exec(cleanLine);
        if (match) {
          const matchIndex = match.index;
          const contextStart = Math.max(0, matchIndex - 10);
          const contextEnd = Math.min(cleanLine.length, matchIndex + banned.word.length + 10);
          const context = cleanLine.substring(contextStart, contextEnd).trim();

          violations.push({
            file: filePath,
            line: index + 1,
            word: banned.word,
            context: context,
            category: banned.category,
            alternative: banned.alternative,
          });
        }
      }
    });
  });

  return violations;
}

function main() {
  const args = process.argv.slice(2);
  const targetPath = args[0] || 'src/';
  const fixMode = args.includes('--fix');

  console.log('🔍 Copy Lint: Scanning for language boundary violations...\n');
  console.log(`Target: ${targetPath}`);

  if (fixMode) {
    console.log('⚠️  --fix flag detected but auto-fix not yet implemented\n');
  }

  const fullPath = path.resolve(process.cwd(), targetPath);

  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Error: Path not found: ${fullPath}`);
    process.exit(1);
  }

  const files = getAllFiles(fullPath);
  console.log(`Found ${files.length} TypeScript files\n`);

  const allViolations: Violation[] = [];

  files.forEach((file) => {
    const violations = scanFile(file);
    allViolations.push(...violations);
  });

  if (allViolations.length === 0) {
    console.log('✅ No language boundary violations found!');
    process.exit(0);
  }

  console.log(`❌ Found ${allViolations.length} violation(s):\n`);

  // Group by file
  const violationsByFile = allViolations.reduce((acc, violation) => {
    if (!acc[violation.file]) {
      acc[violation.file] = [];
    }
    acc[violation.file].push(violation);
    return acc;
  }, {} as Record<string, Violation[]>);

  Object.entries(violationsByFile).forEach(([file, violations]) => {
    console.log(`\n📄 ${file}`);
    violations.forEach((v) => {
      console.log(`  Line ${v.line}: "${v.word}" (${v.category})`);
      console.log(`    Context: ...${v.context}...`);
      if (v.alternative) {
        console.log(`    Use instead: ${v.alternative}`);
      }
    });
  });

  console.log('\n');
  console.log('━'.repeat(60));
  console.log(`Total violations: ${allViolations.length}`);
  console.log('See docs/foundation/product/language-boundaries-v1.md for details');
  console.log('━'.repeat(60));

  process.exit(1); // Exit with error code if violations found
}

main();
