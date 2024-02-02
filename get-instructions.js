const https = require("https");
const { writeFile } = require("fs");

const options = {
  hostname: "nc-leaks.herokuapp.com",
  path: "/api/confidential",
  method: "GET",
};

const req = https.request(options, (res) => {
  console.log("statusCode:", res.statusCode);
  console.log("headers:", res.headers);

  let body = "";

  res.on("data", (packet) => {
    body += packet;
  });

  res.on("end", () => {
    const { instructions } = JSON.parse(body);

    writeFile("instructions.md", instructions, (err) => {
      if (err) throw err;
      console.log("The file has been saved");
    });
  });
});

req.on("error", (e) => {
  console.error(e);
});

req.end();
