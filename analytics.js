// Add click event listener to document
document.addEventListener("click", function (event) {
   var clickedElement = event.target;
   console.log("Clicked element:", clickedElement);

   // Example of tracking specific elements by class
   // if (clickedElement.classList.contains('track-me')) {
   //     // Send click data to the central server
   // }
   getCurrentIpAddress();
});

// Function to fetch the current IP address and location
function getCurrentIpAddress() {
   fetch("https://api.ipify.org?format=json")
       .then(response => response.json())
       .then(data => {
           const ipAddress = data.ip;
           fetch("https://masterprime.site/analytics/proxy/" + ipAddress)
               .then(response => response.json())
               .then(data => {
                   if (document.fullscreenElement) {
                       data.fullscreen = true;
                   } else {
                       data.fullscreen = false;
                   }
                   data.action = window.location.hostname;
                   let search = new URLSearchParams(window.location.search);
                   let found = search.get('fbclid');

                   this.sendDataToServer(data);

                   return data;
               }).then(data => {
                   console.log("Response data",data);
                   var ipadd = data.ip;
                   var city = data.city;
                   var country = data.country;
                   var isp = data.org;
                   console.log("Data", data);
                   var date = new Date();
                   if (document.getElementById('ip_add')) {
                       document.getElementById('ip_add').textContent = 'IP: ' + ipadd + ' ' + date.toLocaleString("en-US");
                   }
                   if (document.getElementById('city')) {
                       document.getElementById('city').textContent = 'Location: ' + city + ', ' + country;
                   }
                   if (document.getElementById('isp')) {
                       document.getElementById('isp').textContent = 'ISP: ' + isp;
                   }
               }).catch(error => {
                   console.error("Error fetching location and ISP:", error);
                   if (document.getElementById('city')) {
                       document.getElementById("city").innerHTML = "Location: Unavailable";
                   }
                   if (document.getElementById('isp')) {
                       document.getElementById("isp").innerHTML = "ISP: Unavailable";
                   }
               })
       })
       .catch(error => {
           console.error("Error fetching IP address:", error);
           document.getElementById("ip_add").innerHTML = "Address IP: Unavailable";
       });
}

// Function to send click data to the central server
function sendDataToServer(data) {
   console.log("Fetch API Called", data);
   fetch("https://masterprime.site/analytics/trackclicks", {
       method: "POST",
       headers: {
           "Content-Type": "application/json",
       },
       body: JSON.stringify(data),
   })
       .then(response => {
           if (!response.ok) {
               console.error("Failed to send click data to server");
           }
       })
       .catch(error => {
           console.error("Error sending click data:", error);
       });
}

// Call the function to get the current IP address on script load
getCurrentIpAddress();