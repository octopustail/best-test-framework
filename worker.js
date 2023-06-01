const fs = require('fs');
const expect = require('expect').default;
const mock = require('jest-mock');
const vm = require('vm')
const { describe, it, run, resetState } = require('jest-circus');
const { join, dirname } = require('path');
exports.runTest = async function (testFile) {
    const code = await fs.promises.readFile(testFile, 'utf8');
    const testResult = {
        success: false,
        errorMessage: null
    }

    const customRequire = fileName => {
        const code = fs.readFileSync(join(dirname(testFile), fileName), 'utf8');
        const moduleFactory = vm.runInContext(
            `(function(module) {${code}})`,
            environment.getVmContext(),
        );
        const module = { exports: {} };
        console.log('module before', module)
        // Run the sandboxed function with our module object.
        moduleFactory(module);
        console.log('module after', module)

        return module.exports;
    }

    const NodeEnvironment = require('jest-environment-node').default;
    const environment = new NodeEnvironment({
        projectConfig: {
            testEnvironmentOptions: { describe, it, expect, mock, require: customRequire }
        }
    })

    try {
        // reset state, because jest-circus won't clean it state by itself, so when running multiple test file, the state will be wrong;
        resetState();
        // in .test.js, when call expect function, it can access the expect in this scope.
        vm.runInContext(code, environment.getVmContext());

        const { testResults } = await run();
        testResult.testResults = testResults;
        testResult.success = testResults.every(result => !result.errors.length);
    } catch (e) {
        testResult.errorMessage = e.message;
    }
    // console.log(`worker id: ${process.env.JEST_WORKER_ID}\nfile: ${testFile}:\n${code}`);
    return testResult;
};
