import type { PackageJson as TypeFestPackageJson } from 'type-fest';
import * as path from 'path';
import * as fs from 'fs-extra';

export type PackageJson = TypeFestPackageJson & {
  externals?: string[];
};

export class ProjectInfo {
  public readonly name: string;
  public readonly private: boolean;
  public readonly isJsii: boolean;
  public readonly externals: PackageJson['externals'];
  public readonly peerDependencies: PackageJson['peerDependencies'];
  public readonly dependencies: PackageJson['dependencies'];
  public readonly devDependencies: PackageJson['devDependencies'];

  //ts-config
  public readonly typescriptIncludes: string[];
  public readonly typescriptExcludes: string[];

  //paths
  public readonly distPath: string;
  public readonly libPath: string;
  public readonly lambdasSrcPath: string;
  public readonly lambdasOutPath: string;

  private pkgJson: PackageJson;

  constructor(private readonly cwd: string) {
    this.pkgJson = fs.readJSONSync(
      path.join(cwd, 'package.json'),
    ) as PackageJson;

    if (!this.pkgJson.name) {
      throw new Error('Property "name" is missing in package.json');
    }

    this.name = this.pkgJson.name;
    this.private = this.pkgJson.private ?? false;
    this.isJsii = this.pkgJson.jsii !== undefined;
    this.externals = this.pkgJson.externals;
    this.peerDependencies = this.pkgJson.peerDependencies;
    this.dependencies = this.pkgJson.dependencies;
    this.devDependencies = this.pkgJson.devDependencies;

    this.typescriptIncludes = ['src'];
    this.typescriptExcludes = ['src/lambdas', 'src/**/__tests__'];

    this.distPath = this.resolve('dist');
    this.libPath = this.resolve('lib');
    this.lambdasSrcPath = this.resolve('src/lambdas');
    this.lambdasOutPath = this.resolve('lib/lambdas');
  }

  get workspaces(): string[] | undefined {
    if (!this.pkgJson.workspaces) return;

    return Array.isArray(this.pkgJson.workspaces)
      ? this.pkgJson.workspaces
      : this.pkgJson.workspaces.packages;
  }

  public async syncPkgJson(): Promise<void> {
    await fs.writeJSON(this.resolve('package.json'), this.pkgJson, {
      spaces: 2,
    });
  }

  private resolve(relativePath: string): string {
    return path.resolve(this.cwd, relativePath);
  }
}