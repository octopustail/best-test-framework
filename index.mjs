import { glob } from "glob";
import { cpus } from "os";
import { dirname } from "path";
import { fileURLToPath } from "url";

const testFiles = glob.sync('**/*.test.js');

console.log(testFiles);