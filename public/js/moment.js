// const moment = require("moment");

const clock = document.getElementById("clock");
function updateTime() {
  const now = moment();
  const clockFormat = now.format("hh: mm: ss a ");
  clock.textContent = clockFormat;
}
setInterval(updateTime, 1000);
updateTime();
console.log("clock");
