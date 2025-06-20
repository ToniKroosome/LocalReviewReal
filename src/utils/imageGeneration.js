// Function to generate image using Imagen API
const generateImage = async (prompt) => {
    try {
        const payload = { instances: [{ prompt: prompt }], parameters: { "sampleCount": 1} };
        const apiKey = ""; // Canvas will automatically provide the API key
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            let errorDetails = `Status: ${response.status}`;
            try {
                const errorBody = await response.text();
                errorDetails += `, Body: ${errorBody}`;
            } catch (readError) {
                errorDetails += `, Failed to read response body`;
            }
            throw new Error(`API call failed: ${errorDetails}`);
        }

        const result = await response.json();

        if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
            return `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
        } else {
            console.error("Image generation failed or returned no data:", result);
            return null;
        }
    } catch (error) {
        console.error("Error generating image:", error);
        return null;
    }
};





export default generateImage;
