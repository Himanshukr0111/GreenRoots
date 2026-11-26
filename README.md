# GreenRoots

GreenRoots is a React + Vite hyperlocal gardening marketplace demo.

## Run locally

1. Open this `GreenRoots` folder in VS Code.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the local URL printed by Vite (normally `http://localhost:5173`).

## Plant photo identification (Gemini)

The Plant Scanner supports selecting an image and using a device camera. Real AI analysis requires a Gemini API key.

1. Create an API key in [Google AI Studio](https://aistudio.google.com/apikey).
2. In the project root, create a file named `.env`.
3. Add this line:

   ```env
   GEMINI_API_KEY=put_your_key_here
   ```

4. Stop the Vite server with `Ctrl + C`, then run `npm run dev` again.
5. Scroll to **GreenRoots AI Lab**, upload or capture a plant photo, then choose **Identify this plant**.

The key is read by the Vite development server and is not placed in frontend code. Do not commit or share your `.env` file. The API route in `vite.config.js` is a local development integration; before deploying the project, move this route to a protected backend/serverless function and configure the key there.

If no API key is configured, image selection and preview still work, but analysis will show a setup message rather than inventing an identification.

## Current project notes

- Marketplace listings and seller profiles are illustrative demo data.
- Category and listing photos use remote Unsplash image URLs and require an internet connection.
- Scroll reveal and reduced-motion support are implemented with CSS and the browser Intersection Observer API.
