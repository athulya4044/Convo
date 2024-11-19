import { useChannelStateContext } from 'stream-chat-react';

const Share = ({ sharedItems }) => {
  const { channel } = useChannelStateContext(); // Access channel context here
  const channelId = channel?.id;
  const items = sharedItems[channelId] || []; // Use channelId for filtering shared items

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">Shared Files and Images</h3>
    {items.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="p-3 border rounded-lg bg-gray-50 hover:shadow-lg transition-shadow duration-300"
          >
            {item.type === 'image' ? (
              <div className="w-full h-48 overflow-hidden rounded-lg">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = 'fallback-image-url.png'; // Optional fallback
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-full text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v16h16V4M4 4l8 8m0 0l8-8M12 12v8"
                    />
                  </svg>
                </div>
                <a
                  href={item.assetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                  title={item.title}
                >
                  {item.title}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-600">No shared files or images yet.</p>
    )}
  </div>
  
  );
};

  
export default Share;  