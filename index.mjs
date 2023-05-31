/**
* upsides of using jest-haste-map: 
    https://github.com/jestjs/jest/blob/04b75978178ccb31bccb9f9b2f8a0db2fecc271e/packages/jest-haste-map/src/index.ts#L136
*   1. Crawls the entire project, extracts dependencies and analyzes files in parallel across worker processes.
*   2. Keeps a cache of the file system in memory and on disk so that file related operations are fast.
*   3. Only does the minimal amount of work necessary when files change.
*   4. Watches the file-system for changes, useful for building interactive tools.
*/
import JestHasteMap from "jest-haste-map";
import { cpus } from "os";
import { dirname } from "path";
import { fileURLToPath } from "url";

// import.meta.url contains the absolute path of the current module
// Get the root path to our project (Like `__dirname`).

const root = dirname(fileURLToPath(import.meta.url));
const hasteMapOptions = {
    extensions: ['js'],
    maxWorkers: cpus().length,
    name: 'best-test-framework',
    platforms: [],
    rootDir: root,
    roots: [root],
};
// Need to use `.default` as of Jest 27.
const hasteMap = new JestHasteMap.default(hasteMapOptions);
// This line is only necessary in `jest-haste-map` version 28 or later.
await hasteMap.setupCachePath(hasteMapOptions);

const { hasteFS } = await hasteMap.build();

// ⭐️ we can apply a set of globs to the in-memory representation of the file system instead of running actual file system operations:
const testFiles = hasteFS.matchFilesWithGlob(['**/*.test.js']);

console.log(testFiles)