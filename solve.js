// solve.js
// Reconstruct the secret (P(0)) using Lagrange interpolation with BigInt.
// Usage: node solve.js <path-to-json>   (defaults to 'testcase1.json')

const fs = require('fs');

function parseValueToBigInt(base, valueStr) {
  base = parseInt(base);
  valueStr = String(valueStr).trim().toLowerCase();

  if (base === 2)  return BigInt('0b' + valueStr);
  if (base === 8)  return BigInt('0o' + valueStr);
  if (base === 16) return BigInt('0x' + valueStr);

  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
  let result = 0n;
  for (let i = 0; i < valueStr.length; i++) {
    const ch = valueStr[i];
    const idx = alphabet.indexOf(ch);
    if (idx < 0 || idx >= base) {
      throw new Error(`Invalid digit '${ch}' for base ${base}`);
    }
    result = result * BigInt(base) + BigInt(idx);
  }
  return result;
}

// Simple gcd for BigInt
function bigIntAbs(n) { return n < 0n ? -n : n; }
function bigIntGcd(a, b) {
  a = bigIntAbs(a); b = bigIntAbs(b);
  while (b !== 0n) {
    const t = b; b = a % b; a = t;
  }
  return a;
}

function main() {
  const inputFile = process.argv[2] || 'testcase1.json';
  const raw = fs.readFileSync(inputFile, 'utf-8');
  const data = JSON.parse(raw);

  const k = data.keys.k;
  // Collect points as {x, y} with x = BigInt, y = BigInt
  const points = [];
  for (const key of Object.keys(data)) {
    if (key === 'keys') continue;
    const x = BigInt(key);
    const share = data[key];
    const y = parseValueToBigInt(share.base, share.value);
    points.push({ x, y });
  }

  // Sort by x and take the first k shares (assignment says all are valid)
  points.sort((a, b) => (a.x < b.x ? -1 : a.x > b.x ? 1 : 0));
  const used = points.slice(0, k);

  // Lagrange interpolation at x=0: sum_j y_j * Π_{i≠j} (x_i / (x_i - x_j))
  let num = 0n; // running numerator
  let den = 1n; // running denominator
  for (let j = 0; j < k; j++) {
    const xj = used[j].x;
    const yj = used[j].y;

    let lj_num = 1n;
    let lj_den = 1n;
    for (let i = 0; i < k; i++) {
      if (i === j) continue;
      const xi = used[i].x;
      lj_num *= xi;               // multiply numerator by x_i
      lj_den *= (xi - xj);        // multiply denominator by (x_i - x_j)
    }

    // Add the fraction (yj * lj_num) / lj_den to (num/den)
    const termNum = yj * lj_num;
    const termDen = lj_den;

    num = num * termDen + termNum * den;
    den = den * termDen;

    // Reduce occasionally to keep numbers smaller
    const g1 = bigIntGcd(num, den);
    if (g1 > 1n) { num /= g1; den /= g1; }
  }

  // Final reduction and division (should be exact for valid inputs)
  const g = bigIntGcd(num, den);
  num /= g; den /= g;

  if (den !== 1n) {
    // If not exact, still show the rational result for diagnostics
    console.log('Warning: result not an integer. Showing rational form.');
    console.log(`Secret ≈ ${num} / ${den}`);
  }
  const secret = num / den;

  console.log('--- Result ---');
  console.log('k used:', k);
  console.log('shares used (x,y):', used.map(p => `(${p.x.toString()}, ${p.y.toString()})`).join(', '));
  console.log('Secret (P(0)):', secret.toString());
}

main();
