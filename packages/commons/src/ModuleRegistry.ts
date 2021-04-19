import { Module } from './types';

/**
 * @example
 * ```ts
 * const registry = new ModuleRegistry()
 *   .register(nervosModule)
 *  .register(ethModule)
 *  .register(tronModule)
 *  .register(eosModule)
 *
 *  const ckbModule = register.find<NervosModule>('Nervos');
 * ```
 */
export class ModuleRegistry {
  modules: Module[];

  constructor() {
    this.modules = [];
  }

  register(module: Module): this {
    this.modules.push(module);
    return this;
  }

  unregister(module: Module | string): void {
    const network = typeof module === 'string' ? module : module.network;
    const index = this.modules.findIndex((m) => m.network === network);
    this.modules.splice(index, 1);
  }

  find<M extends Module>(network: string): undefined | M {
    return this.modules.find<M>(((m) => m.network === network) as (x: Module) => x is M);
  }

  getNetworks(): string[] {
    return this.modules.map((m) => m.network) as string[];
  }
}
