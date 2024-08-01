const { ContactEmergency } = require('@mui/icons-material');
const { exec } = require('child_process');

function generateRecipe(message) {
  return new Promise((resolve, reject) => {
    exec(`python3 generateRecipe.py "${message}"`, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`);
      } else if (stderr) {
        reject(`Stderr: ${stderr}`);
      } else {
        resolve(JSON.parse(stdout));
      }
    });
  });
}

// Example usage
generateRecipe('Generate a recipe based on pantry items')
  .then(result => console.log(result))
  .catch(error => console.error(error));
