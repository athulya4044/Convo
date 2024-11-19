export const uploadFile = async (file, channelId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("channelId", channelId);
  try {
    const response = await fetch("http://localhost:4000/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (data.url) {
      return data.url; 
    } 
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const fetchSharedItemsFromBackend = async (channelId) => {
  try {
    const response = await fetch(`http://localhost:4000/shared-items?channelId=${channelId}`);
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching shared items:", error);
    return [];
  }
};

