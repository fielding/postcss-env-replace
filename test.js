import postcss from 'postcss';
import test    from 'ava';

import plugin from './index';

function run(t, input, output, opts = {}) {
    return postcss([plugin(opts)])
        .process(input)
        .then(result => {
            t.deepEqual(result.css, output);
            t.deepEqual(result.warnings().length, 0);
        });
}

test('replaces single ENV-Variable with desired text from DEV-configuration',
    t => {
        var options = {
            environment: 'DEV',
            replacements: {
                VAR: {
                    PROD: 'http://my.domain',
                    DEV: 'http://localhost'
                }
            }
        };
        var input =
            'div { background-image: url(env_replace(VAR)/myImage.jpg); }';
        var expectedOutput =
            'div { background-image: url(http://localhost/myImage.jpg); }';

        return run(t, input, expectedOutput, options);
    }
);

test('replaces multiple ENV-Variable with desired text from DEV-configuration',
    t => {
        var options = {
            environment: 'DEV',
            replacements: {
                VAR: {
                    PROD: 'http://my.domain',
                    DEV: 'http://localhost'
                },
                OTHER_VAR: {
                    PROD: 'http://my.other.domain/someImage.jpg',
                    DEV: 'http://localhost/someImage.jpg'
                }
            }
        };
        var input =
            'div { background-image: url(env_replace(VAR)/myImage.jpg) ' +
            'url(env_replace(OTHER_VAR)); }';
        var expectedOutput =
            'div { background-image: url(http://localhost/myImage.jpg) ' +
            'url(http://localhost/someImage.jpg); }';

        return run(t, input, expectedOutput, options);
    }
);

test('Fail if no environment-option is given', t => {
    return t.throws(
        postcss([plugin( { replacements: {} } )]).process('a { }'),
        /No environment was given/);
});

test('Fail if no replacement-option is given', t => {
    return t.throws(
        postcss([plugin( { environment: 'someEnv' } )]).process('a { }'),
        /No replacements were given/);
});
