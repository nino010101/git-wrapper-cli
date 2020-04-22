import * as commandLineArgs from 'command-line-args';
import * as commandLineUsage from 'command-line-usage';
import { prompt, QuestionCollection } from 'inquirer'
import { exec, execSync } from 'child_process';

type CommitConfig = {
    add?: string[]
};

type CommitOption = {
    msg: string,
    type: string
}

export class CommandCommit {

    private readonly usage = [
        {
            header: 'commit command',
            content: 'gitw commit -a <add_files>',
        },
        {
            header: 'Parameters',
            hide: ['command'],
            optionList: []
        }
    ];

    private readonly paramDef = [
        {
            name: 'command',
            type: String,
            require: true,
            defaultOption: true,
        },
        {
            name: 'add',
            alias: 'a',
            description: '追加するファイル',
            type: String,
            multiple: true,
            require: false,
        },
        {
            name: 'help',
            alias: 'h',
            type: Boolean,
            description: 'show help'
        }
    ];

    exec(): Promise<void> {
        const options = commandLineArgs(this.paramDef);
        if (options.help) {
            const usage = commandLineUsage(this.usage);
            console.log(usage);
            process.exit(0);
        }

        return this.run(options);
    }

    private async run(options: CommitConfig): Promise<void> {

        // commitメッセージなどの取得
        // ブランチの設定
        const commitOption: CommitOption = {
            msg: null,
            type: null
        }
        const questions: QuestionCollection = [
            {
                type: 'list',
                name: 'type',
                message: 'コミットの種類を選択してください :',
                choices: [
                    'feat',
                    'fix',
                    'docs',
                    'style',
                    'refactor',
                    'test',
                    'chore'
                ]
            },
            {
                type: 'input',
                message: 'コミットメッセージを入力してください :',
                name: 'msg'
            },
            {
                type: 'confirm',
                message: 'コミットします、よろしいですか？',
                name: 'isConfirm'
            }
        ]

        // commit処理
        await prompt(questions).then((answers: any) => {
            commitOption.msg = answers.msg;
            commitOption.type = answers.type;
            if(!answers.isConfirm){
                process.exit(0);
            }
        })

        // addオプションがある場合、git addをする
        if (options.add) {
            const addFiles = options.add.join(' ');
            const addResult = execSync(`git add ${addFiles}`)
            console.log(addResult.toString())
            const status = execSync(`git status`)
            console.log(status.toString())
        }

        if (!commitOption.msg) {
            console.log("コミットメッセージが入力されていません.");
            process.exit(0);
        }
        const stdout = execSync(`git commit -m "${commitOption.type}: ${commitOption.msg}"`);
        console.log(stdout.toString());

        return;
    }
}
