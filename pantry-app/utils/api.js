export async function getRecipe(message) {
  console.log("testing"); 
    const response = await fetch('/api/generateRecipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
  
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
    const data = await response.json();
    return data.recipe;
  }
  