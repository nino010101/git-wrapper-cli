import * as fs from 'fs-extra'
import * as Path from 'path'

export class CommandVersion {
  exec(): Promise<void> {
    return this.run();
  }
  private async run(): Promise<void> {
    const packageJsonPath = Path.resolve(__dirname, '../package.json');
    const content = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    console.log(`gitw version ${content.version}`);
    return;
  }
}  