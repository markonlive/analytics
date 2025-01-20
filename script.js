(function () {
    function getCurrentIpAddress() {
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                const ipAddress = data.ip;
                fetch("https://example.site/analytics/proxy/" + ipAddress)
                    .then(response => response.json())
                    .then(locationData => {
                        if (document.fullscreenElement) {
                            locationData.fullscreen = true;
                        } else {
                            locationData.fullscreen = false;
                        }
                        locationData.action = window.location.hostname;
                        sendDataToServer(locationData);

                        const ipAdd = locationData.ip || "Unknown IP";
                        const city = locationData.city || "Unknown City";
                        const country = locationData.country || "Unknown Country";
                        const isp = locationData.org || "Unknown ISP";
                        const date = new Date();

                        // Update HTML content
                        document.getElementById('ip_add').textContent = 'IP: ' + ipAdd + ' ' + date.toLocaleString("en-US");
                        document.getElementById('city').textContent = 'Location: ' + city + ', ' + country;
                        document.getElementById('isp').textContent = 'ISP: ' + isp;
                    })
                    .catch(error => {
                        console.error("Error fetching location and ISP:", error);
                        document.getElementById("city").textContent = "Location: Unavailable";
                        document.getElementById("isp").textContent = "ISP: Unavailable";
                    });
            })
            .catch(error => {
                console.error("Error fetching IP address:", error);
                document.getElementById("ip_add").textContent = "Address IP: Unavailable";
            });
    }

    // Function to send click data to the central server
    function sendDataToServer(data) {
        console.log("Fetch API Called", data);
        fetch('https://example.site/analytics/trackclicks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
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

    // Initialize on page load
    window.addEventListener('DOMContentLoaded', getCurrentIpAddress);
})();
