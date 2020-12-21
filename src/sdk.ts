import { defaultIntegrations } from '@sentry/browser';
import { initAndBind } from '@sentry/core';
import { getCurrentHub, Hub, makeMain } from '@sentry/hub';
import { RewriteFrames } from '@sentry/integrations';
import { StackFrame } from '@sentry/types';

import { CapacitorClient } from './client';
import { CapacitorAngularErrorHandler, Release } from './integrations';
import { CapacitorOptions } from './options';
import { CapacitorScope } from './scope';

const DEFAULT_OPTIONS: CapacitorOptions = {
  enableNative: true,
  enableNativeNagger: true,
};

/**
 * Inits the SDK
 */
export function init(
  passedOptions: CapacitorOptions = {
    enableNative: true,
    enableNativeNagger: true,
  },
): void {
  /* eslint-disable no-console */
  const capacitorHub = new Hub(undefined, new CapacitorScope());
  makeMain(capacitorHub);

  const options = {
    ...DEFAULT_OPTIONS,
    ...passedOptions,
  };

  if (options.framework) {
    console.log('FRAMEWORK WAS THERE: ', options.framework);
    createErrorHandler(options.framework);
  }

  if (options.defaultIntegrations === undefined) {
    options.defaultIntegrations = [new Release(), ...defaultIntegrations];

    options.defaultIntegrations.push(
      new RewriteFrames({
        iteratee: (frame: StackFrame) => {
          if (frame.filename) {
            frame.filename = frame.filename
              .replace(/^file:\/\//, '')
              .replace(/^address at /, '')
              .replace(/^.*\/[^.]+(\.app|CodePush|.*(?=\/))/, '');

            if (
              frame.filename !== '[native code]' &&
              frame.filename !== 'native'
            ) {
              const appPrefix = 'app://';
              // We always want to have a triple slash
              frame.filename =
                frame.filename.indexOf('/') === 0
                  ? `${appPrefix}${frame.filename}`
                  : `${appPrefix}/${frame.filename}`;
            }
          }
          return frame;
        },
      }),
    );
  }

  initAndBind(CapacitorClient, options);

  // set the event.origin tag.
  getCurrentHub().setTag('event.origin', 'javascript');
}

/**
 * TESTING cortney
 */
function createErrorHandler(framework: string): unknown {
  console.log('passed framework string cortney: ', framework);
  console.log('cortney TESTING ADDING IN AN ANGULAR ERROR HANDLER OVERRIDE');

  return new CapacitorAngularErrorHandler();
}

/**
 * If native client is available it will trigger a native crash
 * Use this only for testing purposes
 */
export function nativeCrash(): void {
  const client = getCurrentHub().getClient<CapacitorClient>();
  if (client) {
    client.nativeCrash();
  }
}
