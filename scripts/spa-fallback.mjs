// GitHub Pages has no rewrite rules: serving index.html as 404.html lets
// deep links such as /work/medieval-castle load the app and route client-side.
import { copyFileSync, writeFileSync } from 'node:fs';
copyFileSync('dist/index.html', 'dist/404.html');
writeFileSync('dist/.nojekyll', '');
console.log('SPA fallback written: dist/404.html');
