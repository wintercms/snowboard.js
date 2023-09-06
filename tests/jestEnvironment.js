// Based off https://github.com/jestjs/jest/issues/8701#issuecomment-512130059

const { default: JSDOMEnvironment } = require('jest-environment-jsdom');
const jestResourceLoader = require('./jestResourceLoader');
const jestVirtualConsole = require('./jestVirtualConsole');

module.exports = class JSDOMEnvironmentWithResources extends JSDOMEnvironment {
    constructor(config, options) {
        super(
          {
            ...config,
            projectConfig: {
              ...config.projectConfig,
              testEnvironmentOptions: {
                ...config.projectConfig.testEnvironmentOptions,
                resources: new jestResourceLoader(),
                virtualConsole: jestVirtualConsole,
              },
            },
          },
          options,
        );
      }
}
