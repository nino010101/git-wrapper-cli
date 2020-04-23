import * as fs from 'fs-extra'
import * as Path from 'path'

export type Settings = {
  githubToken?: string,
  branchType?: string[],
  commitType?: string[]
}


export class HandleConfig {
    private defaultConfig: Settings = {}
    read(): Settings {
        const homePath = this.getHomePath();
        try {
        const configJson = Path.join(homePath,'.gitw/config.json')
        const settings: Settings = JSON.parse(fs.readFileSync(configJson, "utf-8"));
        return settings;
        } catch(e) {
          console.log("can not read config file.");
          return this.defaultConfig;
        }
    }

    private getHomePath(): string {
        if (process.platform === 'win32') {
            return process.env.USERPROFILE || process.env.HOMEDRIVE + process.env.HOMEPATH || process.env.HOME
        } else {
            return process.env.HOME
        }
    }
}  