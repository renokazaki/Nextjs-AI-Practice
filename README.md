### if拡張機能を入れれない場合 scriptをpush前に実行してもらいつつciではじく

huskyは自動でできるのは良いが、無理に入れず、手動でコマンドで実行してもらいつつ、
ciでチェックを行い問題があれば弾き修正してもらうでもいいかも


### 拡張機能は入れれる場合 以下の拡張機能で自動保存をしてもらいつつ、ciで念のため確認
# チーム開発ルール

## 必須拡張機能
- ESLint
- Prettier - Code formatter

## 設定ファイル
- .vscode/settings.json をリポジトリに含める
- 全員が同じ設定を使用

## コミット前の確認
```bash
npm run quality:check
```


// .vscode/settings.json

```
内容については再度確認
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}

```
