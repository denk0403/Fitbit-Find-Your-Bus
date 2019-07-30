/*
 * Entry point for the companion app
 */
import * as messaging from "messaging";

const preKeyJSONURL = 'https://bustime.mta.info/api/siri/stop-monitoring.json?key=';
const APIKey = "ac049272-4a5f-49e3-90ff-591e9eb54f55";
const version = '&version=2';
const operator = '&OperatorRef=MTA';
const detailLevel = '&StopMonitoringDetailLevel=minimum';

// Message socket opens
messaging.peerSocket.onopen = () => {
  
};

messaging.peerSocket.onmessage = evt => {
  updateBusInfo(evt.data);
};

// Send data to device using Messaging API
function sendVal(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  }
}

function updateBusInfo(stop) {
  
  let monitor = '&MonitoringRef=' + stop.stopNumber;
  let line = '&LineRef=MTABC_' + stop.busName;
  
  let URL = preKeyJSONURL + APIKey + version + operator + detailLevel + monitor + line;
  console.log(URL);
  
  fetch(URL)
    .then(function(response) { return response.json(); })
    // .then(function(json) { console.log(JSON.stringify(json)); 
    //                        return json; })
    .then(function(json) { return json
                                  .Siri
                                  .ServiceDelivery
                                  .StopMonitoringDelivery[0]
                                  .MonitoredStopVisit[0]
                                  .MonitoredVehicleJourney
                                  .MonitoredCall; })
    .then(function(monitoredCall) {
      let stopsLeft = parseInt(monitoredCall.NumberOfStopsAway);
      stop.stopsLeft = stopsLeft;
      
      let dateString = monitoredCall.ExpectedArrivalTime;
      let ms = new Date(dateString).getTime() - Date.now();
      let sec = parseInt(ms/1000);
      let min = parseInt(sec/60);
      let hour = parseInt(min/60);
      stop.hours = hour;
      stop.minutes = min % 60;
      stop.seconds = sec % 60;
      sendVal(stop);
    });
}

