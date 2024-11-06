// client/src/utils/uploadFile.js
export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch("http://localhost:4000/upload", { 
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.url; 
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };