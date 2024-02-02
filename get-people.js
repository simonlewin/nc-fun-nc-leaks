const https = require("https");
const { writeFile } = require("fs");

const getPeople = () => {
  const options = {
    hostname: "nc-leaks.herokuapp.com",
    path: "/api/people",
    method: "GET",
  };

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

      writeFile("northcoders.json", JSON.stringify({ northcoders }), (err) => {
        if (err) throw err;
        console.log("The file northcoders.json has been saved");
      });
    });
  });

  req.on("error", (e) => {
    console.error(e);
  });

  req.end();
};

getPeople();
