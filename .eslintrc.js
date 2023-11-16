module.exports = {
	'env': {
		'browser': true,
		'commonjs': true,
		'es2021': true
	},
	'extends': 'eslint:recommended',
	'overrides': [
		{
			'env': { 'node': true },
			'files': [ '.eslintrc.{js,cjs}' ],
			'parserOptions': { 'sourceType': 'script' }
		}
	],
	'parserOptions': { 'ecmaVersion': 'latest' },
	'rules': {
		'indent': [	'error', 'tab' ],
		'space-infix-ops': 'error',
		'no-multi-spaces': 'error',
		'no-trailing-spaces': 'error',
		'semi': [ 'error', 'never' ],
		'curly': [ 'error', 'multi' ],
		'quotes': [ 'error', 'single' ],
		'eol-last': [ 'error', 'never' ],
		'comma-dangle': [ 'error', 'never' ],
		'padded-blocks': [ 'error', 'never' ],
		'brace-style': [ 'error', 'stroustrup' ],
		'arrow-parens': [ 'error', 'as-needed' ],
		'space-before-blocks': [ 'error', 'always' ],
		'object-curly-spacing': [ 'error', 'always' ],
		'array-bracket-spacing': [ 'error', 'always' ],
		'nonblock-statement-body-position': [ 'error', 'below' ],
		'arrow-spacing': [ 'error', { 'before': true, 'after': true } ],
		'object-curly-newline': [ 'error', { 'consistent': true } ],
		'comma-spacing': [ 'error', { 'before': false, 'after': true } ],
		'no-multiple-empty-lines': [ 'error', { 'max': 1, 'maxEOF': 0 } ],
		'key-spacing': [ 'error', { 'beforeColon': false, 'afterColon': true } ],
		'camelcase': [ 'error', { 'properties': 'never', 'ignoreDestructuring': true } ],
		'padding-line-between-statements': [ 'error', { 'blankLine': 'always', 'prev': '*', 'next': 'return' } ]
	}
}