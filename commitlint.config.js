module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复bug
        'docs', // 文档变更
        'style', // 代码格式（不影响代码运行的变动）
        'refactor', // 重构（既不是新增功能，也不是修改bug的代码变动）
        'perf', // 性能优化
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回退
        'build', // 打包
        'ci', // CI相关变更
      ],
    ],
    'type-case': [2, 'always', 'lower-case'], // type必须为小写
    'type-empty': [2, 'never'], // type不能为空
    'scope-empty': [0, 'always'], // scope可以为空
    'subject-empty': [2, 'never'], // subject不能为空
    'subject-full-stop': [2, 'never', '.'], // subject不能以.结尾
    'header-max-length': [0, 'always', 72], // header最大长度
  },
};
//手写提交信息为：git commit -m "feat: 新增功能" //注意新增前面有一个空格的,冒号是英文的冒号，不是中文的
