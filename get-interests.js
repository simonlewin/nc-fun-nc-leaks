const https = require("https");
const { readFile, writeFile } = require("fs");

const getInterests = (cb) => {
  readFile("./northcoders.json", "utf8", (err, data) => {
    if (err) throw err;

    const northcoders = JSON.parse(data).northcoders;

    const usernames = northcoders.map(({ username }) => username);

    const interests = [];
    let counter = 0;

    usernames.forEach((username, index) => {
      const options = {
        hostname: "nc-leaks.herokuapp.com",
        path: `/api/people/${username}/interests`,
        method: "GET",
      };

      const req = https.request(options, (res) => {
        let body = "";

        res.on("data", (packet) => {
          body += packet;
        });

        res.on("end", () => {
          const { person } = JSON.parse(body);

          interests[index] = person;
          counter++;

          if (counter === usernames.length) {
            writeFile(
              "interests.json",
              JSON.stringify({ interests }),
              (err) => {
                if (err) throw err;
                cb(null, "The file interests.json has been saved");
              }
            );
          }
        });
      });

      req.on("error", (e) => {
        console.error(e);
      });

      req.end();
    });
  });
};

// getInterests((error, result) => console.log(result));

module.exports = getInterests;
