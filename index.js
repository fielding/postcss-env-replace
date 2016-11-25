var postcss = require('postcss');
var plugin = require('./package.json');

/**
 * Regex searching for the function-name and its parameters
 */
var functionRegex = /env_replace\(([a-zA-Z_]+)\)/gi;

/**
 * Verifies the found options and checks whether they are configured or not
 *
 * @param {Object} replacements - Object containing replacement information
 *    per environment
 * @param {String} value - String found inside the declaration that should
 *    be replaced
 * @param {Declaration} decl - Declaration currently examined
 * @param {String} environment - Name of the current environment
 */
function verifyParameters(replacements, value, decl, environment) {
    if (undefined === replacements[value]) {
        throw decl.error(
            'Unknown variable ' + value,
            { plugin: plugin.name }
        );
    }

    if (undefined === replacements[value][environment]) {
        throw decl.error(
            'No suitable replacement for "' + value +
            '" in environment "' + environment + '"',
            { plugin: plugin.name }
        );
    }
}

/**
 * Parses one CSS-declaration from the given AST and checks for
 * possible replacements
 *
 * @param {Declaration} decl - one CSS-Declaration from the AST
 * @param {String} environment - current environment
 * @param {String} replacements - Object containing all replacements that we
 *   have inside the options
 */
function walkDeclaration(decl, environment, replacements) {
    decl.value = decl.value.replace(functionRegex, function (match, value) {
        verifyParameters(replacements, value, decl, environment);

        return replacements[value][environment];
    });
}

module.exports = postcss.plugin('postcss-env-replace', function (opts) {

    return function (css) {
        opts = opts || {};
        var environment = opts.environment || process.env.ENVIRONMENT;
        var replacements = opts.replacements;

        if (undefined === replacements || typeof replacements !== 'object') {
            throw css.error(
                'No replacements were given. Please check with documentation' +
                'on how to pass minimal configuration properties.',
                { plugin: plugin.name }
            );
        }

        if (undefined === environment || typeof environment !== 'string') {
            throw css.error(
                'No environment was given. Please check with documentation' +
                'on how to pass minimal configuration properties.',
                { plugin: plugin.name }
            );
        }

        css.walkRules(function walkRule(rule) {
            rule.walkDecls(function (decl) {
                walkDeclaration(decl, environment, replacements);
            });
        });

        css.walkAtRules(function walkAtRule(rule) {
            rule.walkDecls(function (decl) {
                walkDeclaration(decl, environment, replacements);
            });
        });
    };
});
