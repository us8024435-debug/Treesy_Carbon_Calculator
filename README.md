# Treesy project

## Local utility files
- `__read.js` is a local debugging helper to print file snippets from the repository and should not be committed with hardcoded local paths.
- The repo includes `.gitignore` entry for `__read.js` so environment-specific paths are not shared.

### Usage
`node __read.js <file> [startLine] [endLine]`

Example:
`node __read.js app.js 100 200`
