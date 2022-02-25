// file: src/api/add.js

const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

/**
 * Executes user's add function in a supported language (javascript, python).
 * 
 * @param {*} req - expects body in form { a: 1, b: 2, language: "javascript", code: "function add(a, b) { ... }" }
 * @param {*} res - returns body in form { c: 3, output: " ... " }
 */
async function add(req, res) {
  // print status message
  console.log('[ STATUS ] POST /add -', Date());
  //console.log('request body:', req.body);

  // check for missing body fields
  if (!req.body.a || !req.body.b || !req.body.language || !req.body.code) {
    res.setHeader('Content-Type', 'application/json');
    res.status(400);
    res.send(JSON.stringify({ "error": "missing fields in body" }));
    return;
  }

  // generate unique string
  const unique = crypto.randomBytes(10).toString('hex');



  // run user code for specified language
  let stdout, stderr, fileName, contents;
  switch (req.body.language) {
    case 'javascript':
      // write user code to unique filename
      fileName = `${unique}.js`;
      contents = [
        req.body.code,
        `const c = add(${req.body.a}, ${req.body.b});`,
        `console.log('--- ${unique} ---');`,
        'console.log(c);',
      ].join('\n');
      fs.writeFileSync(fileName, contents);

      // attempt to run user code and record output
      try {
        ({ stdout, stderr } = await exec(`node ${fileName}`));
      } catch (error) {
        console.log('[ ERROR ] an error occured while executing user\'s code:\n', error);
        stderr += error;
      }

      // remove user code file
      fs.unlinkSync(fileName);
      break;

    case 'python':
      // write user code to unique filename
      fileName = `${unique}.py`;
      contents = [
        req.body.code,
        `c = add(${req.body.a}, ${req.body.b})`,
        `print('--- ${unique} ---');`,
        'print(c);',
      ].join('\n');
      fs.writeFileSync(fileName, contents);

      // attempt to run user code and record output
      try {
        ({ stdout, stderr } = await exec(`python3 ${fileName}`));
      } catch (error) {
        console.log('[ ERROR ] an error occured while executing user\'s code:\n', error);
        stderr += error;
      }

      // remove user code file
      fs.unlinkSync(fileName);
      break;

    // if langauge did not match an option, send error
    default:
      res.setHeader('Content-Type', 'application/json');
      res.status(400);
      res.send(JSON.stringify({ "error": `unsupported language (${req.body.language})` }));
      return;
  }

  // separate program output from result
  if (!stdout) stdout = '';
  const splitStdout = stdout.split(`--- ${unique} ---\n`)
  const output = ['--- stdout ---', splitStdout[0], '--- stderr ---', stderr].join('\n');

  // extract result
  const c = parseInt(splitStdout[1]);

  // send response
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ 'c': c, 'output': output }));
}

module.exports = add;

//
// end of file: src/api/add.js
