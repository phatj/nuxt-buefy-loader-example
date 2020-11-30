import { join } from 'path';
import consola from 'consola';

export class PurgeCSSDependencyAutoloaderPlugin {
  constructor(nodeModuleFolder, extensions) {
    const folder = join('node_modules', nodeModuleFolder);
    const extensionRegex = extensions.join('|');

    this.pluginName = 'PurgeCSSDependencyAutoloaderPlugin';
    this.tapPluginName = 'PurgeCSS';
    this.pattern = new RegExp(`${folder}.*?(?:${extensionRegex})`);
    this.logger = consola.withScope('purgecss-dependency-autoloader');

    this.logger.debug(`Folder path pattern resolved to ${this.pattern}`);
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(this.pluginName, (compilation) => {
      const plugin = compilation.options.plugins.find(
        ({ purgedStats, options }) => purgedStats && options.whitelist
      );

      // intercept and overwrite the additionalAssets hook
      compilation.hooks.additionalAssets.intercept({
        register: (tapInfo) => {
          if (tapInfo.name === this.tapPluginName) {
            tapInfo.fn = async () =>
              await plugin.runPluginHook(compilation, plugin.options.paths);

            this.logger.debug(`Overwrote ${this.tapPluginName} function...`);
          }

          return tapInfo;
        },
      });

      compilation.hooks.additionalAssets.tap(this.pluginName, () => {
        if (!plugin) {
          return;
        }

        // Find files loaded from node_modules
        const dependencies = this.getDependencies(compilation);
        const { paths } = plugin.options;

        // Add dependencies to the PurgeCSS path
        if (dependencies.length) {
          paths.push(...dependencies);

          this.logger.info(
            `${paths.length} paths to be parsed; ${dependencies.length} dependencies autoloaded...`
          );
          this.logger.debug(dependencies);
        }
      });
    });
  }

  getDependencies({ chunks }) {
    const dependencies = [];

    for (const chunk of chunks) {
      for (const {
        _identifier,
        buildInfo: { fileDependencies },
      } of chunk.getModules()) {
        if (!fileDependencies) {
          continue;
        }

        const deps = Array.from(fileDependencies).filter((value) =>
          value.match(this.pattern)
        );

        if (deps.length) {
          this.logger.debug(_identifier, chunk.name, deps);
          dependencies.push(...deps);
        }
      }
    }

    return dependencies;
  }
}
