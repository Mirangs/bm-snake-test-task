module.exports = {
	env: {
		node: true,
		es6: true,
		browser: false,
	},
	extends: ["airbnb-base", "prettier", "plugin:prettier/recommended"],
	plugins: ["prettier"],
	parser: "babel-eslint",
	rules: {
		"prettier/prettier": "error",
		"no-console": [0],
		"lines-around-directive": 0,
		strict: 0,
		"consistent-return": 0,
		"prefer-destructuring": [
			"error",
			{
				array: false,
				object: true,
			},
			{
				enforceForRenamedProperties: false,
			},
		],
	},
};
