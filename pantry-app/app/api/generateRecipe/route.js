import { exec } from 'child_process';
import path from 'path';


export const POST = async (req) => {
  const { message } = await req.json();
  const scriptPath = path.join(process.cwd(), 'generateRecipe.py');

  return new Promise((resolve) => {
    exec(`python3 generateRecipe.py "${message}"`, (error, stdout, stderr) => {
      if (error) {
        resolve(new Response(JSON.stringify({ error: error.message }), { status: 500 }));
      } else if (stderr) {
        resolve(new Response(JSON.stringify({ error: stderr }), { status: 500 }));
      } else {
        try {
          console.log(JSON.parse(stdout));
          const output = JSON.parse(stdout); // Parse the JSON output from the Python script
          resolve(new Response(JSON.stringify(output), { status: 200 }));
        } catch (e) {
          console.log('Invalid JSON output from Python script');
          console.log(e);
          resolve(new Response(JSON.stringify({ error: 'Invalid JSON output from Python script' }), { status: 500 }));
        }
      }
    });
  });
};

