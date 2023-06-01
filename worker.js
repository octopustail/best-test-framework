const fs = require('fs');
const expect = require('expect').default;
const mock = require('jest-mock');
const vm = require('vm')
const { describe, it, run, resetState } = require('jest-circus');
const { join, dirname, basename } = require('path');
const NodeEnvironment = require('jest-environment-node').default;

exports.runTest = async function (testFile) {
    const testResult = {
        success: false,
        errorMessage: null
    }


    try {
        // reset state, because jest-circus won't clean it state by itself, so when running multiple test file, the state will be wrong;
        resetState();
        let environment
        const customRequire = fileName => {
            const code = fs.readFileSync(join(dirname(testFile), fileName), 'utf8');
            const moduleFactory = vm.runInContext(
                // inject require as a varviable here
                `(function(module, require) {${code}})`,
                environment.getVmContext(),
            );
            const module = { exports: {} };

            // pass customRequire 
            moduleFactory(module, customRequire);
            return module.exports;
        }
    
        environment = new NodeEnvironment({
            projectConfig: {
                testEnvironmentOptions: { describe, it, expect, mock }
            }
        })

        // use CustomRequrie to run the test file.
        customRequire(basename(testFile))

        const { testResults } = await run();
        testResult.testResults = testResults;
        testResult.success = testResults.every(result => !result.errors.length);
    } catch (e) {
        testResult.errorMessage = e.message;
    }
    return testResult;
};
