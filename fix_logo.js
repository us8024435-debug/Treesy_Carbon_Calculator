const fs = require('fs');
try {
  let html = fs.readFileSync('index.html', 'utf8');
  const logoBase64 = fs.readFileSync('TREESY LOGO BG.png').toString('base64');
  
  const regex = /var logoBase64 = 'data:image\/png;base64,[^']*';/;
  if (regex.test(html)) {
    html = html.replace(regex, `var logoBase64 = 'data:image/png;base64,${logoBase64}';`);
    fs.writeFileSync('index.html', html);
    console.log("Logo embedded successfully!");
  } else {
    console.log("Could not find logoBase64 variable in index.html");
  }
} catch (e) {
  console.error(e);
}
