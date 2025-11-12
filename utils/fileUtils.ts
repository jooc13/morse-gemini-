
export const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // The result is in the format: "data:[mime-type];base64,[base64-data]"
            const base64Data = result.split(',')[1];
            const mimeType = result.substring(result.indexOf(':') + 1, result.indexOf(';'));
            resolve({ base64: base64Data, mimeType });
        };
        reader.onerror = (error) => reject(error);
    });
};
