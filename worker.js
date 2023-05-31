const { reverse } = require('dns');
const fs = require('fs');

exports.runTest = async function (testFile) {
    const code = await fs.promises.readFile(testFile, 'utf8');
    const testResult = {
        success: false,
        errorMessage: null
    }

    const expect = received => ({
        toBe: (expected) => {
            if (received !== expected) {
                throw new Error(`Expected ${expected} but received ${received}.`)
            }
            return true;
        }
    })

    try {
        // in .test.js, when call expect function, it can access the expect in this scope.
        eval(code);
        testResult.success = true;
    } catch (e) {
        testResult.errorMessage = e.message;
    }
    // console.log(`worker id: ${process.env.JEST_WORKER_ID}\nfile: ${testFile}:\n${code}`);
    return testResult;
}
