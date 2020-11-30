import { join } from 'path';
import { readFileSync } from 'fs';
import glob from 'glob-all';
import consola from 'consola';

const pattern = /<b-\w+/g;
const capitalize = (w) => w.charAt(0).toUpperCase() + w.slice(1);
const kebabToPascal = (w) => w.split('-').map(capitalize).join('');

export const findTags = ({ srcDir }) => {
  const logger = consola.withScope('buefy-loader:search');

  // pages, layouts, components
  const paths = [
    'pages/**/*.vue',
    'layouts/**/*.vue',
    'components/**/*.vue',
  ].map((pattern) => join(srcDir, pattern));

  const matchedPaths = glob.sync(paths);
  const matchedTags = new Set();

  matchedPaths.forEach((path) => {
    const content = readFileSync(path, { encoding: 'utf-8' });
    const matches = content.match(pattern, content) || [];

    for (const match of matches) {
      matchedTags.add(kebabToPascal(match.substr(3)));
    }
  });

  const tags = [...matchedTags].sort();

  logger.info(`Found ${matchedTags.size} buefy root tags...`);
  logger.debug(`Root tags:`, tags);

  return tags;
};
