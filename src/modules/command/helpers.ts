import { AutoCompleteOption, Module } from '../..';

export const SelectModuleOption = new AutoCompleteOption<Module>({
  name: 'module',
  description: 'The module to perform this action on',
  required: true,
  run: async (query, client) => {
    const allModules = client.modules.map((module) => module.name);
    const modules = allModules.filter((module) => module.includes(query));
    if (!modules.length) return [{
      name: 'No modules found',
      value: 'No modules found',
    }];
    return modules.map((module) => ({
      name: module,
      value: module,
    }));
  },
  resolveValue: (moduleName, client) => {
    const module = client.modules.find((module) => module.name === moduleName);
    return module ?? null;
  },
});
