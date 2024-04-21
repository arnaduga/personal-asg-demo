// Preparing the timeout objects
const timeoutSet = 2000
const refreshDelay = 4000
const controller = new AbortController()
const timeoutId = setTimeout(() => controller.abort(), timeoutSet)
const machineName = document.getElementById("machine-id");

// Fetching the server ID
fetch("http://169.254.169.254/latest/meta-data/instance-id", 
{ method: "POST", signal: controller.signal })
.then(response => {
  console.log("API call succeeded")
  machineName.innerHTML = `Server ID: ${response}`;
  clearTimeout(timeoutId)
})
.catch(error => {
  console.log("API call failed")
  machineName.innerHTML = `No server ID found`;
})



setTimeout(() => {
  location.reload()
}, refreshDelay)