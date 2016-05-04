var postcss = require('postcss');
var _ = require('lodash');
var plugin = require('./package.json');

/*+
 * Regex searching for the function-name and its parameters
 */
var functionRegex = /env_replace\(([a-zA-Z_]+)\)/gi;

/**
 * Current environment, set via Environment Variable ENVIRONMENT
 */
var environment = process.env.ENVIRONMENT;

/**
 * Searches for matches inside the given string-value and returns a array with unique matches.
 *
 * @param {String} value - String that should be checked for matched results
 * @returns [String] - Array of matches if any, empty array otherwise
 */
function getRegexMatches(value) {
    var regexMatches = functionRegex.exec(value);

    if (_.isNull(regexMatches)) {
        return [];
    }

    regexMatches = _.uniq(regexMatches);

    if (regexMatches.length > 1) {
        // drop the full string of matched characters
        regexMatches = _.drop(regexMatches);
    }
}

/**
 * Parses one CSS-declaration from the given AST and checks for possible replacements
 *
 * @param {Declaration} decl - one CSS-Declaration from the AST
 */
function walkDeclaration(decl) {
    var regexMatches = getRegexMatches(decl.value);

    _.forEach(regexMatches, function (value) {
        if (_.isUndefined(opts[value])) {
            throw decl.error(
                'Unknown variable ' + value,
                { plugin: plugin.name }
            );
        } else if (_.isUndefined(opts[value][environment])) {
            throw decl.error(
                'No suitable replacement for "' + value + '" in environment "' + environment + '"',
                { plugin: plugin.name }
            );
        } else {
            decl.value = _.replace(
                decl.value,
                'env_replace(' + value + ')',
                opts[value][environment]
            );
        }
    });
}

module.exports = postcss.plugin('postcss-env-replace', function (opts) {
    return function (css) {
        if (_.isUndefined(opts)) {
            throw 'No options available, please specify them';
        }

        css.walkRules(function walkRule(rule) {
                rule.walkDecls();
            }
        );
    };
});
