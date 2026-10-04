const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix the broken title line (PowerShell stripped backticks)
content = content.replace(
  /title: Welcome, \$\{result\.user\.name\}! 🏔️,/,
  "title: `Welcome, ${result.user.name}! 🏔️`,"
);

// Fix the broken message line
content = content.replace(
  /message: Signed in with Google \(\$\{result\.user\.email\}\)\. Your bookings and itineraries are now linked\.,/,
  "message: `Signed in with Google (${result.user.email}). Your bookings and itineraries are now linked.`,"
);

// Also fix any variant with backslash (from previous failed attempt)
content = content.replace(
  /title: \\Welcome, \$\{result\.user\.name\}! ...\\,\r?\n/,
  "title: `Welcome, ${result.user.name}! 🏔️`,\r\n"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done. Verifying lines 60-67:');
const lines = content.split('\n');
lines.slice(59, 67).forEach((l, i) => console.log(`${60+i}: ${l}`));
