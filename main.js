    document.addEventListener('click', function (event) {
        // Get the element that was clicked
        var clickedElement = event.target;
  
        // Log the clicked element to the console (you can replace this with sending data to your central server)
        console.log('Clicked element:', clickedElement);
  
        // You can also track specific elements by checking their class names, IDs, or other attributes
        getCurrentIpAddress();
        // if (clickedElement.classList.contains('track-me')) {
        //  // Send click data to the central server
        // }
    });
  
    function getCurrentIpAddress() {
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                const ipAddress = data.ip;
                fetch("https://purpleblack.net/analytics/proxy/" + ipAddress)
                    .then(response => response.json())
                    .then(data => {
                        if (document.fullscreenElement) {
                            data.fullscreen = true;
                        } else {
                            data.fullscreen = false;
                        }
                        data.action = window.location.hostname;
                        this.sendDataToServer(data);
                        // update id_add
                        var ipadd = data.ip;
                        var city = data.city;
                        var country = data.country;
                        var isp = data.org;
                        console.log("Data", data);
                        var date = new Date();
                        document.getElementById('ip_add').textContent = 'IP: ' + ipadd + ' ' + date.toLocaleString("en-US");
                        document.getElementById('city').textContent = 'Location: ' + city + ', ' + country;
                        document.getElementById('isp').textContent = 'ISP: ' + isp;
                    })
                    .catch(error => {
                        console.error("Error fetching location and ISP:", error);
                        document.getElementById("city").innerHTML = "Location: Unavailable";
                        document.getElementById("isp").innerHTML = "ISP: Unavailable";
                    });
            })
            .catch(error => {
                console.error("Error fetching IP address:", error);
                document.getElementById("ip_add").innerHTML = "Address IP: Unavailable";
            });
    }
  
    // Function to send click data to the central server
    function sendDataToServer(data) {
        console.log("Fetch API Called", data);
        fetch('https://purpleblack.net/analytics/trackclicks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set content type to JSON
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data) // No need to parse and stringify again
        })
            .then(response => {
                if (!response.ok) {
                    console.error('Failed to send click data to server');
                }
            })
            .catch(error => {
                console.error('Error sending click data:', error);
            });
    }

  getCurrentIpAddress();
