#!/usr/bin/env node
import * as commandLineArgs from 'command-line-args';
import * as commandLineUsage from 'command-line-usage';
import { CommandVersion } from "./cmd-version";
import { CommandMakeBranch } from "./cmd-make-branch"
import { CommandCommit } from "./cmd-commit";

type CommandType = "version" | "makebranch" | "mb" | "addcommit" | "ac";

type MainConfig = {
  command: CommandType,
};

class Main {
  private readonly mainUsage = [
    {
      header: 'Command Line Interface for git',
      content: 'git wrapper',
    },
    {
      header: 'Commands',
      content: {
        data: [
          { colA: 'gitw makebranch', colB: 'ブランチの作成'},
          { colA: 'gitw addcommit -a <file>', colB: 'git add/git commitを同時に行う'},
          { colA: 'gitw version', colB: 'バージョン表示'},
        ],
        options: { maxWidth: 100 }
      }    
    }
  ];

  private readonly paramDef = [
    {
      name: 'command', 
      type: String,
      require: true,
      defaultOption: true,
    }
  ];

  private commandMap =  new Map<CommandType, ()=>Promise<void>>([
    [ "makebranch", () => new CommandMakeBranch().exec() ],
    [ "mb", () => new CommandMakeBranch().exec() ],
    [ "addcommit", () => new CommandCommit().exec() ],
    [ "ac", () => new CommandCommit().exec() ],
    [ "version", () => new CommandVersion().exec() ],
  ]);
  
  run() {
    const cfg = commandLineArgs(this.paramDef, { partial: true }) as MainConfig;
    const exec = this.commandMap.get(cfg.command);
    if (exec != null) {
      exec().then(()=>
      {
        process.exit(0);
      }).catch((e)=>{
        if(e.stdout){
          console.log(e.stdout.toString());
        }
        process.exit(1);
      })
    } else {
      const usg = commandLineUsage(this.mainUsage);
      console.log(usg);  
      process.exit(1);
    }
  }
};

new Main().run();
