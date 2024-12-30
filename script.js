// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Select the component by its ID
    const button = document.getElementById('test123');
    
    // Add a click event listener to the button
    button.addEventListener('click', () => {
        // Alert a message when the button is clicked
        alert('Button was clicked!');
    });
});
