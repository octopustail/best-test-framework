const fs = require('fs');
const expect = require('expect').default;
const mock = require('jest-mock');
exports.runTest = async function (testFile) {
    const code = await fs.promises.readFile(testFile, 'utf8');
    const testResult = {
        success: false,
        errorMessage: null
    }

    try {
        const describeFns = [];
        let currentDescribeFns;

        const describe = (name, fn) => describeFns.push([name, fn]);
        const it = (name, fn) => currentDescribeFns.push([name, fn]);

        // in .test.js, when call expect function, it can access the expect in this scope.
        eval(code);

        for (const [name, fn] of describeFns) {
            currentDescribeFns = [];
            testName = name;
            fn();
            
            for(const [name, fn] of currentDescribeFns){
                testName += '  ' + name;
                fn();
            }
        }

        testResult.success = true;
    } catch (e) {
        testResult.errorMessage = testName + ': ' + e.message;
    }
    // console.log(`worker id: ${process.env.JEST_WORKER_ID}\nfile: ${testFile}:\n${code}`);
    return testResult;
}
