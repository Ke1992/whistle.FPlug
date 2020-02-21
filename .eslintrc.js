module.exports = {
    env: {
        es6: true,
        node: true,
    },
    plugins: [
        'react',
        '@typescript-eslint'
    ],
    parser: '@typescript-eslint/parser',
    extends: [
        'airbnb-base',
        // 启用react的规则
        'plugin:react/recommended',
        // 启用typescript的规则
        'plugin:@typescript-eslint/recommended',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2018, // ES的版本
        // 支持JSX语法
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        browser: true, // 是否启用浏览器全局变量
    },
    settings: {
        "import/resolver": {
            node: { // 限制node端的import
                extensions: [".js", ".ts"]
            },
            webpack: { // 限制webpack方式的import，主要用于解决tsx的问题，需要引入eslint-import-resolver-webpack
                config: './webpack.config.js',
            },
        }
    },
    rules: {
        'indent': ['error', 4, {
            "SwitchCase": 1
        }],
        'no-console': ['error', {
            allow: ['log', 'error']
        }],
        'no-underscore-dangle': ['error', {
            'allowAfterThis': true
        }],
        'no-unused-expressions': ['error', {
            'allowShortCircuit': true
        }],
        'spaced-comment': ['error', 'always', {
            'exceptions': ['*']
        }],
        'no-await-in-loop': 'off',
        'no-use-before-define': ['error', 'nofunc'],
        // 解决react提示需要this的问题
        'class-methods-use-this': ['error', {
            'exceptMethods': [
                'render',
                'getInitialState',
                'getDefaultProps',
                'getChildContext',
                'componentWillMount',
                'componentDidMount',
                'componentWillReceiveProps',
                'shouldComponentUpdate',
                'componentWillUpdate',
                'componentDidUpdate',
                'componentWillUnmount',
            ],
        }],
        // 解决airbnb新版导致的问题
        'import/extensions': [
            'error',
            'ignorePackages',
            {
              'js': 'never',
              'jsx': 'never',
              'ts': 'never',
              'tsx': 'never'
            }
        ],
        '@typescript-eslint/no-explicit-any': ["error", { "ignoreRestArgs": true }]
    },
};
