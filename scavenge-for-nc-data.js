const getPeople = require("./get-people");
const getInterests = require("./get-interests");
const getPets = require("./get-pets");

const scavengeForNcData = () => {
  getPeople((error, result) => {
    console.log(result);

    getInterests((error, result) => console.log(result));
    getPets((error, result) => console.log(result));
  });
};

scavengeForNcData();
