import { readFile, mkdir } from 'fs/promises';
import fse, { writeFile } from 'fs-extra';
import {readFileSync} from 'fs';
import { IntentsBitField } from 'discord.js';
import { Client, CommandMiddleware, Directories, GlobalMiddleware, GlobalMiddlewareOptions } from '..';

export type OfficialModule = '@rhidium/moderation' | '@rhidium/module-template' | '@rhidium/manage-modules';

export const officialModules: OfficialModule[] = [
  '@rhidium/moderation',
  '@rhidium/module-template',
  '@rhidium/manage-modules',
];

export type SourceCodeDirectories = {
  sourceFolder: string;
  mitLicense: string;
  packageJson?: string;
}

export interface ModuleOptions {
  name: string;
  directories: Client['directories'];
  /**
   * The source code directories for the module.
   * Only used when #eject is called on official/public modules
   */
  sourceCode: SourceCodeDirectories;
  globalMiddleware?: GlobalMiddlewareOptions;
  intents?: IntentsBitField[];
  extensions?: Record<string, unknown>;
  disabled?: boolean;
}

/**
 * Modules are a way to organize your code. They allow you to group commands, listeners, etc.
 * into a single module. They serve as plug-and-play modules that can be added to your client
 * instance. You can `#eject` the source code of a module to edit it, or build on top of it
 * in your own local project.
 * 
 * Note: We require all official supported modules to be MIT or ISC licensed, so you're
 * in full control.
 */
export class Module {
  name: string;
  disabled: boolean;
  version: string;
  tag: string;
  directories: Required<Client['directories']>;
  sourceCode: SourceCodeDirectories;
  globalMiddleware: GlobalMiddleware;
  intents: IntentsBitField[] = [];
  extensions: Record<string, unknown> = {};
  official: boolean;
  constructor(options: ModuleOptions) {
    this.name = options.name;
    this.disabled = options.disabled ?? false;

    this.sourceCode = options.sourceCode;
    const pkgString = this.sourceCode.packageJson
      ? readFileSync(this.sourceCode.packageJson, 'utf-8')
      : '{"version": "0.0.0"}';
    const pkg = JSON.parse(pkgString);
    this.official = pkg.name ? officialModules.includes(pkg.name as OfficialModule) : false;
    this.version = pkg.version ?? '0.0.0';

    this.tag = `[Module:${this.name}@${this.version}]`;
    this.directories = {
      chatInputs: options.directories.chatInputs ?? [],
      componentCommands: options.directories.componentCommands ?? [],
      autoCompletes: options.directories.autoCompletes ?? [],
      jobs: options.directories.jobs ?? [],
      listeners: options.directories.listeners ?? [],
      messageContextMenus: options.directories.messageContextMenus ?? [],
      userContextMenus: options.directories.userContextMenus ?? [],
    };
    this.globalMiddleware = new CommandMiddleware(options.globalMiddleware ?? {});
    this.intents = options.intents ?? [];
    this.extensions = options.extensions ?? {};
  }
  register(client: Client): void {
    client.logger.debug(`Registering module ${this.name}`);
    const {
      directories,
      globalMiddleware,
      intents,
      extensions,
    } = this;
    const { directories: {
      autoCompletes,
      chatInputs,
      componentCommands,
      jobs,
      listeners,
      messageContextMenus,
      userContextMenus,
    } } = client;
    const {
      postRunExecution,
      preRunChecks,
      preRunExecution,
      preRunThrottle,
      runExecutionReturnValues,
    } = client.globalMiddleware;

    const mergeDirectories = (dir: Directories | undefined, newDirs: Directories | undefined) => {
      client.logger.debug(
        `${this.tag} Merging directories ${dir?.length ?? 0} initial, adding ${newDirs?.length ?? 0}`
      );
      const resolved = dir ? typeof dir === 'string' ? [dir] : dir : [];
      if (typeof newDirs === 'undefined') return resolved;
      if (typeof newDirs === 'string') return [...resolved, newDirs];
      client.logger.debug(`${this.tag} Merged directories, resulting in ${resolved.length + newDirs.length} total`);
      return [...resolved, ...newDirs];
    };

    const newDirectories: Client['directories'] = {
      autoCompletes: mergeDirectories(autoCompletes, directories.autoCompletes),
      chatInputs: mergeDirectories(chatInputs, directories.chatInputs),
      componentCommands: mergeDirectories(componentCommands, directories.componentCommands),
      jobs: mergeDirectories(jobs, directories.jobs),
      listeners: mergeDirectories(listeners, directories.listeners),
      messageContextMenus: mergeDirectories(messageContextMenus, directories.messageContextMenus),
      userContextMenus: mergeDirectories(userContextMenus, directories.userContextMenus),
    };

    client.logger.debug(`${this.tag} Merging global middleware`);
    client.logger.debug(`${this.tag} Post Run Execution: ${globalMiddleware.postRunExecution.length}`);
    client.logger.debug(`${this.tag} Pre Run Checks: ${globalMiddleware.preRunChecks.length}`);
    client.logger.debug(`${this.tag} Pre Run Execution: ${globalMiddleware.preRunExecution.length}`);
    client.logger.debug(`${this.tag} Pre Run Throttle: ${globalMiddleware.preRunThrottle.length}`);
    client.logger.debug(`${this.tag} Run Execution Return Values: ${globalMiddleware.runExecutionReturnValues.length}`);
    
    const newMiddleware = new CommandMiddleware({
      postRunExecution: [...postRunExecution, ...globalMiddleware.postRunExecution],
      preRunChecks: [...preRunChecks, ...globalMiddleware.preRunChecks],
      preRunExecution: [...preRunExecution, ...globalMiddleware.preRunExecution],
      preRunThrottle: [...preRunThrottle, ...globalMiddleware.preRunThrottle],
      runExecutionReturnValues: [...runExecutionReturnValues, ...globalMiddleware.runExecutionReturnValues],
    });

    client.directories = newDirectories;
    client.globalMiddleware = newMiddleware;
    client.options.intents = new IntentsBitField().add(
      ...client.options.intents,
      ...intents,
    );
    client.extensions = {
      ...client.extensions,
      ...extensions,
    };
  }

  /**
   * This will extract all the commands, listeners, etc. from the module and write
   * them to your project. This is useful for developers who want to edit, or build
   * on top of the modules provided by the framework.
   * 
   * This is why all modules for this framework export the source code along with the
   * compiled code when publishing to NPM. This allows developers to eject the
   * source code and edit it. MIT or ISC Licensed.
   * 
   * After ejecting, you should remove the package Module from your client and instead
   * import the new, local module.
   * 
   * [DEV]: Make this a CLI script.
   * More useful as a CLI tool, but for now, this will do.
   * 
   * @param client The client instance that instantiated the module.
   * @param dirPath The path to write the files to.
   */
  async eject(client: Client, dirPath: string) {
    if (!this.official) throw new Error(`${this.tag} Ejecting source code is only supported for official modules.`);
    client.logger.debug(`${this.tag} Ejecting source code to ${dirPath}`);
    const license = await readFile(this.sourceCode.mitLicense, 'utf-8');
    const pkgString = this.sourceCode.packageJson
      ? await readFile(this.sourceCode.packageJson, 'utf-8')
      : '{"dependencies": {}, "devDependencies": {}}';

    client.logger.debug(`${this.tag} EJECT Creating module directory ${dirPath}`);
    await mkdir(dirPath, { recursive: true });

    const sourcePath = this.sourceCode.sourceFolder;
    client.logger.debug(`${this.tag} EJECT Copying source code to ${dirPath}`);
    fse.copySync(sourcePath, dirPath, { overwrite: true });
    await writeFile(`${dirPath}/LICENSE`, license);

    client.logger.debug(`${this.tag} EJECT Resolving packages/dependencies..`);
    const resolvedPkg = JSON.parse(pkgString);
    const dependencies = Object.entries(resolvedPkg.dependencies ?? {}).map(([name, v]) => `${name}_@_${v}`);
    const devDependencies = Object.entries(resolvedPkg.devDependencies ?? {}).map(([name, v]) => `${name}_@_${v}`);

    const masterPkgString = readFileSync('./package.json', 'utf-8');
    const masterPkg = JSON.parse(masterPkgString);
    
    let dependenciesAdded = 0;
    for (const dependency of dependencies) {
      const [name, version] = dependency.split('_@_');
      if (masterPkg.dependencies?.[name as string]) continue;
      client.logger.debug(`${this.tag} EJECT Adding dependency ${name}`);
      masterPkg.dependencies[name as string] = version;
      dependenciesAdded++;
    }
    for (const devDependency of devDependencies) {
      const [name, version] = devDependency.split('_@_');
      if (masterPkg.devDependencies?.[name as string]) continue;
      client.logger.debug(`${this.tag} EJECT Adding dev dependency ${name}`);
      masterPkg.devDependencies[name as string] = version;
      dependenciesAdded++;
    }
    if (this.official) delete masterPkg.dependencies[`${this.name}`];
    
    // This step triggers re-build in development
    client.logger.debug(`${this.tag} EJECT Resolved ${dependenciesAdded} dependencies`);
    if (dependenciesAdded) {
      client.logger.debug(`${this.tag} EJECT Writing master package.json`);
      await writeFile('./package.json', JSON.stringify(masterPkg, null, 2));
    }

    client.logger.debug(`${this.tag} Ejected source code to ${dirPath}`);
    client.logger.debug(`${this.tag} Please carefully review the ejected source code.`);
  }
}
