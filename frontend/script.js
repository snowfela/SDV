document.addEventListener('DOMContentLoaded', function() {
  const uploadForm = document.getElementById('uploadForm'); 
  const fileInput = document.getElementById('fileInput');
  const messageDiv = document.getElementById('message');

  uploadForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    if (!fileInput.files || fileInput.files.length === 0) {
      showMessage("Please select a file.");
      return;
    }
    const formData = new FormData(uploadForm);
    // formData.append('fileInput', fileInput.files[0]);
    try {
      const response = await fetch('/upload', {method: 'POST',body: formData,});
      if (response.ok) {
        showMessage("File processed successfully");
        // Redirect to results.html after a short delay
        setTimeout(() => {window.location.href = 'results.html';}, 1000); // Adjust delay in milliseconds (1 second here)
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
});
