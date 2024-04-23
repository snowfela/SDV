document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const sensitiveAttributesInput = document.getElementById('sensitiveAttributes');
    const messageDiv = document.getElementById('message');
    const outputDiv = document.getElementById('output');
    const downloadLink = document.getElementById('downloadLink');
    
    uploadForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData();
        formData.append('fileInput', fileInput.files[0]);
        formData.append('sensitiveAttributes', sensitiveAttributesInput.value);
        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                const data = await response.json();
                showMessage(data.message);
                if (data.head && data.columnPlot && data.columnPairPlot) {
                    outputDiv.innerHTML = `
                        <h2>Head of the Dataset:</h2>
                        <pre>${data.head}</pre>
                        <h2>Graphs:</h2>
                        <img src="${data.columnPlot}" alt="Column Plot">
                        <img src="${data.columnPairPlot}" alt="Column Pair Plot">
                    `;
                }
                if (data.resultFile) {
                    // Update download link href attribute to the resultFile path
                    downloadLink.innerHTML = `<a href="${data.resultFile}" download>Download Processed File</a>`;
                    // Display the download link
                    downloadLink.style.display = 'block';
                }
            } else {
                showMessage('Error: ' + response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('An error occurred. Please try again later.');
        }
    });

    function showMessage(message) {
        messageDiv.textContent = message;
      }
    
      function displaySpeedometer(canvas, speedValue) {
        const ctx = canvas.getContext('2d');
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        const radius = Math.min(centerX, centerY) - 10; // Adjust radius based on canvas size
    
        // Clear the canvas before drawing
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
        // Draw the speedometer dial (adjust styles as needed)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#ddd';
        ctx.stroke();
    
        // Draw the needle based on speed value (adjust range and styling)
        const needleAngle = (speedValue / 100) * Math.PI * 2 - Math.PI / 2; // Assuming speed range 0-100
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        const needleLength = radius * 0.7; // Adjust needle length
        const needleX = centerX + Math.cos(needleAngle) * needleLength;
        const needleY = centerY + Math.sin(needleAngle) * needleLength;
        ctx.lineTo(needleX, needleY);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#f00';
        ctx.stroke();
        // Display speed value in the center (adjust styling)
        ctx.font = '20px Arial';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.fillText(Math.round(speedValue) + '%', centerX, centerY + 5); // Adjust vertical offset
      }

    // Get accuracy value from server and update display
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/accuracy', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const accuracyValue = parseFloat(xhr.responseText).toFixed(2);
            document.getElementById('accuracyValue').textContent = accuracyValue;
            // Code for displaying speedometer goes here
        } else {
            console.error('Error fetching accuracy');
        }
    };
    xhr.send();
});
