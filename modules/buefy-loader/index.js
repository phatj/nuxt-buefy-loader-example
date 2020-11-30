import { resolve } from 'path';
import consola from 'consola';
import {
  createOptions,
  findTags,
  PurgeCSSDependencyAutoloaderPlugin as AutoloaderPlugin,
} from './lib';

export default function BuefyLoader(moduleOptions = {}) {
  const logger = consola.withScope('buefy-loader');
  const options = createOptions(findTags(this.options), moduleOptions);

  // add icons
  if (options.buefy.materialDesignIcons !== false) {
    this.options.head.link.push({
      rel: 'stylesheet',
      type: 'text/css',
      href: options.buefy.materialDesignIconsHRef,
    });
  }

  // add plugin
  this.addPlugin({
    src: resolve(
      __dirname,
      'templates',
      this.options.debug ? 'plugin-dev.ejs' : 'plugin.ejs'
    ),
    fileName: `plugins/buefy-loader.js`,
    options,
  });

  if (this.options.debug) {
    logger.info('Skipping purgeCSS fixes in dev mode');
    return;
  }

  logger.info('Autoloading purgeCSS dependencies...');
  const { build, purgeCSS } = this.options;

  // Inject autoloader
  build.plugins.push(new AutoloaderPlugin('buefy', ['js', 'vue']));

  if (purgeCSS) {
    const { whitelistPatternsChildren = [], whitelistPatterns = [] } = purgeCSS;
    const patterns = {
      whitelistPatternsChildren,
      whitelistPatterns,
    };

    for (const patternType in patterns) {
      patterns[patternType].push(/navbar-/, /is-.+?by.+?/, /card-/);
      purgeCSS[patternType] = patterns[patternType];
    }
  }
}
