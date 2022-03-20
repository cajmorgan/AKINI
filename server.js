const express = require('express');
const { Compiler } = require('./akini.js');

const app = express();
app.use(express.static('build'));

(async () => {
  const compiler = new Compiler([], '', { isBuilding: true });
  await compiler.watch();

  // console.log(compiler)
})()

app.get('*', (req, res) => {
  res.send('helo')
})

app.listen(5001);