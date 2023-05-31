const fs = require('fs');
const expect = require('expect').default;
const mock = require('jest-mock');
const vm = require('vm')
const { describe, it, run, resetState } = require('jest-circus');
exports.runTest = async function (testFile) {
    const code = await fs.promises.readFile(testFile, 'utf8');
    const testResult = {
        success: false,
        errorMessage: null
    }
    const NodeEnvironment  = require('jest-environment-node').default;
    console.log('NodeEnvironment', NodeEnvironment)
    const environment = new NodeEnvironment({
        projectConfig: {
            testEnvironmentOptions: {describe, it, expect, mock}
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
        testResult.errorMessage =  e.message;
    }
    // console.log(`worker id: ${process.env.JEST_WORKER_ID}\nfile: ${testFile}:\n${code}`);
    return testResult;
};
