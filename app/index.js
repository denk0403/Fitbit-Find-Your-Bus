/*
 * Entry point for the watch app
 */
import document from "document";
import clock from "clock";
import * as messaging from "messaging";

////////////////////////////////////////////
// Copy the following code for a number pad
let numbers = document.getElementsByClassName("number");
let input = document.getElementById("input");
let numberPad = document.getElementById("number_entry_screen");
let enter = document.getElementById("number_enter");
let back = document.getElementById("back_button");
let selected;

numbers.forEach(element => {
  element.onclick = evt => {
    if (input.text.length < 15) {
      input.text = input.text + "" + element.text;
    }
  }
});

enter.onclick = evt => {
  selected.text = input.text;
  numberPad.style.visibility = "hidden";
}

back.onclick = evt => {
  input.text = input.text.slice(0, -1);
}

function setRecordTo(button) {
  input.text = button.text;
  selected = button;
}

function numberField(button) {
  button.text = "";
  button.onclick = evt => {
    setRecordTo(button);
    numberPad.style.visibility = "visible";
  }
}

let numberFields = document.getElementsByClassName("number_field");
numberFields.forEach(field => {
  numberField(field);
});

// End Copy Here
////////////////////////////////////////////

let addStopButton = document.getElementById("add_stop");
let stopScreen = document.getElementById("stop_entry_screen");
let stopID = document.getElementById("stop_id");
let region = document.getElementById("region_selector");
let busID = document.getElementById("bus_id");
let stopScreenDoneButton = document.getElementById("stop_enter");

let outputScreen = document.getElementById("output_screen");
let backButton = document.getElementById("exit_bus_info");
let stopNum = document.getElementById("stop");
let bus = document.getElementById("bus");
let stopsRem = document.getElementById("stopsRem");
let timeRem = document.getElementById("timeRem");
// addStopButton.onclick = evt => {
//   stopScreen.style.visibility = "visible";
// }

backButton.onclick = evt => {
  outputScreen.style.visibility = "hidden";
}

function printObject(object) {
  for(var propName in object) {
    var propValue = object[propName];
    console.log(propName + ": " + propValue);
  }
}

let stop = {
  stopNumber: "",
  busName: ""
};

stopScreenDoneButton.onclick = evt => {
  stop = {
    stopNumber: stopID.text,
    busName: region.getElementById("item" + region.value).getElementById("content").text + busID.text
  };
  printObject(stop);
  requestBusInfo(stop);
  outputScreen.style.visibility = "visible";
}

// Update the clock every minute
clock.granularity = "minutes";

// Message socket opens
messaging.peerSocket.onopen = () => {
  requestBusInfo(stop);
};

messaging.peerSocket.onmessage = evt => {
  printObject(evt.data);
  stop = evt.data;
  stopNum.text = stop.stopNumber;
  bus.text = stop.busName;
  stopsRem.text = (!isNaN(stop.stopsLeft)) ? stop.stopsLeft : "Not Sure";
  timeRem.text = (!isNaN(stop.hours) && !isNaN(stop.minutes) ) ? stop.hours + "h " + Math.round(stop.minutes + (stop.seconds / 60)) + "min" : "Not Sure";  
};

clock.ontick = evt => {
  requestBusInfo(stop);
}

function requestBusInfo(stop) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(stop);
  }
}

