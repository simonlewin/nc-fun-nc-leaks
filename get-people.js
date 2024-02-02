const https = require("https");
const { writeFile } = require("fs");

const options = {
  hostname: "nc-leaks.herokuapp.com",
  path: "/api/people",
  method: "GET",
};

const getPeople = () => {
  const req = https.request(options, (res) => {
    let body = "";

    res.on("data", (packet) => {
      body += packet;
    });

    res.on("end", () => {
      const { people } = JSON.parse(body);

      const northcoders = people.filter(
        ({ job: { workplace } }) => workplace === "northcoders"
      );

      writeFile(
        "northcoders.json",
        JSON.stringify({ people: northcoders }),
        (err) => {
          if (err) throw err;
          console.log("The file has been saved");
        }
      );

      console.log(northcoders);
    });
  });

  req.on("error", (e) => {
    console.error(e);
  });

  req.end();
};

getPeople();
