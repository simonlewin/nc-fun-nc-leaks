const https = require("https");
const { readFile, writeFile } = require("fs");

const getPets = (cb) => {
  readFile("./northcoders.json", "utf8", (err, data) => {
    if (err) throw err;

    const northcoders = JSON.parse(data).northcoders;

    const usernames = northcoders.map(({ username }) => username);

    const rawPets = [];
    let counter = 0;

    usernames.forEach((username, index) => {
      const options = {
        hostname: "nc-leaks.herokuapp.com",
        path: `/api/people/${username}/pets`,
        method: "GET",
      };

      const req = https.request(options, (res) => {
        let body = "";

        res.on("data", (packet) => {
          body += packet;
        });

        res.on("end", () => {
          const { person } = JSON.parse(body);

          rawPets[index] = person;
          counter++;

          if (counter === usernames.length) {
            const pets = rawPets.filter((pet) => pet !== undefined);
            writeFile("pets.json", JSON.stringify({ pets }), (err) => {
              if (err) throw err;
              cb(null, "The file pets.json has been saved");
            });
          }
        });
      });

      req.end();
    });
  });
};

// getPets((error, result) => console.log(result));

module.exports = getPets;
