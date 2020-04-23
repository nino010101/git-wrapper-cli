import { prompt, QuestionCollection } from 'inquirer'
import { execSync } from 'child_process';
import { HandleConfig, Settings } from "./utils/handle-config"

type BranchOption = {
  name: string,
  type: string
}

export class CommandMakeBranch {

  exec(): Promise<void> {
    return this.run()
  }

  private async run(): Promise<void> {
    // configの読み出し
    const settings: Settings = new HandleConfig().read();
    let choices: string[] = [];
    if (settings.branchType && settings.branchType.length > 0) {
      choices = [...settings.branchType];
    } else {
      choices = [
        'feature',
        'bugfix',
        'release',
        'hotfix'
      ]
    }

    // ブランチの設定
    const branchOption: BranchOption = {
      name: null,
      type: null
    }
    const questions: QuestionCollection = [
      {
        type: 'list',
        name: 'type',
        message: '作成するブランチの種類を選択してください :',
        choices
      },
      {
        type: 'input',
        message: "ブランチ名を入力してください :",
        name: 'name'
      }
    ]
    await prompt(questions).then((answers: any) => {
      branchOption.name = answers.name;
      branchOption.type = answers.type;
    })

    if (!this.checkName(branchOption.name)) {
      console.log("ブランチ名は半角英数字で指定してください")
      return;
    }

    const stdout = execSync(`git checkout -b ${branchOption.type}/${branchOption.name}`)
    console.log(stdout.toString())
  }

  private checkName(str): boolean {
    const reg = /^[a-zA-Z0-9!-/:-@¥[-`{-~]+$/;
    return reg.test(str);
  }
}
