import {abc} from './goofy.js'

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Select the component by its ID
    const button = document.getElementById('test123');
    
    // Add a click event listener to the button
    button.addEventListener('click', () => {
        // Alert a message when the button is clicked
        alert('Button was clicked!');
        abc();
    });
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
      // Fetch the data from the server using async/await
      const response = await fetch('/api/file');
      
      // Check if the response is okay (status 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      // Parse the JSON data
      const data = await response.json();
      
      // Update the DOM with the fetched data
        //   document.getElementById('output').textContent = data.content;
        alert(data.content)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });
  