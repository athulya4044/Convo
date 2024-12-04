import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, X } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { searchBg } from "@/assets/images";
import axios from "axios";
import { playlists } from "../utils/videoPlaylist";

export default function Tutorial() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [collapsedSections, setCollapsedSections] = useState({});
  const [videoData, setVideoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overflowState, setOverflowState] = useState({});

  const scrollContainerRefs = useRef({});

  const categories = ["All", ...playlists.map((playlist) => playlist.category)];

  const updateOverflowState = () => {
    const newOverflowState = {};
    Object.keys(scrollContainerRefs.current).forEach((key) => {
      const ref = scrollContainerRefs.current[key];
      if (ref) {
        newOverflowState[key] = ref.scrollWidth > ref.clientWidth;
      }
    });
    setOverflowState(newOverflowState);
  };

  useEffect(() => {
    const fetchPlaylists = async () => {
      setLoading(true);
      const fetchPromises = [];

      playlists.forEach((playlist) =>
        playlist.subcategories.forEach((subcategory) => {
          fetchPromises.push(
            axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
              params: {
                part: "snippet",
                playlistId: subcategory.id,
                maxResults: 20,
                key: import.meta.env.VITE_YOUTUBE_API_KEY,
              },
            }).then((response) => ({
              playlistCategory: playlist.category,
              subcategoryTitle: subcategory.title,
              videos: response.data.items.map((item) => ({
                id: item.snippet.resourceId.videoId,
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.high.url,
                description: item.snippet.description,
              })),
            }))
          );
        })
      );

      try {
        const resolvedData = await Promise.all(fetchPromises);

        const groupedData = playlists.map((playlist) => ({
          category: playlist.category,
          subcategories: playlist.subcategories.map((subcategory) => {
            const subcategoryData = resolvedData.find(
              (data) =>
                data.playlistCategory === playlist.category &&
                data.subcategoryTitle === subcategory.title
            );

            return {
              title: subcategory.title,
              videos: subcategoryData ? subcategoryData.videos : [],
            };
          }),
        }));

        setVideoData(groupedData);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  useEffect(() => {
    updateOverflowState();
    window.addEventListener("resize", updateOverflowState);

    return () => {
      window.removeEventListener("resize", updateOverflowState);
    };
  }, [videoData]);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleToggleSection = (title) => {
    setCollapsedSections((prevState) => ({
      ...prevState,
      [title]: !prevState[title],
    }));
  };

  const scrollLeft = (ref) => {
    if (ref) {
      ref.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = (ref) => {
    if (ref) {
      ref.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const filteredCollections = videoData
    .filter(
      (collection) =>
        selectedCategory === "All" || collection.category === selectedCategory
    )
    .flatMap((collection) =>
      collection.subcategories.map((subcategory) => ({
        ...subcategory,
        videos: subcategory.videos.filter((video) =>
          video.title.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
    )
    .filter((collection) => collection.videos.length > 0);

  return (
    <>
      <Header />
      <div className="w-full min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div
          className="relative bg-cover bg-center bg-no-repeat flex items-center justify-center text-center"
          style={{
            backgroundImage: `url(${searchBg})`,
            height: "37vh",
          }}
        >
          <div className="relative z-10 text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Welcome to the Learning Hub
            </h1>
            <p className="text-lg text-primary mb-6">
              Access curated educational videos to expand your knowledge and grow your skills.
            </p>
            <div className="flex items-center w-full max-w-45 bg-white rounded-lg shadow-md relative">
              <Input
                className="w-full p-3 border-0"
                placeholder="Search for tutorials"
                value={searchTerm}
                onChange={handleSearch}
              />
              {searchTerm && (
                <button
                  className="absolute right-20 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setSearchTerm("")}
                >
                  <X size={20} />
                </button>
              )}
              <Button variant="solid" className="bg-primary text-white">
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="p-6 flex justify-center space-x-4">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-primary text-white border border-primary shadow-lg"
                  : "bg-gray-200 text-gray-800 hover:border-primary hover:shadow-lg hover:bg-white"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Tutorial Collections */}
        <div className="p-6">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading videos...</div>
          ) : filteredCollections.length > 0 ? (
            filteredCollections.map((collection) => (
              <Card key={collection.title} className="mb-8">
                <CardHeader
                  className="flex items-center justify-between cursor-pointer p-4"
                  onClick={() => handleToggleSection(collection.title)}
                >
                  <CardTitle className="text-lg font-medium">
                    {collection.title}
                  </CardTitle>
                  {collapsedSections[collection.title] ? (
                    <ChevronDown size={20} />
                  ) : (
                    <ChevronUp size={20} />
                  )}
                </CardHeader>
                {!collapsedSections[collection.title] && (
                  <CardContent className="p-4">
                    <div className="relative group">
                      {overflowState[collection.title] && (
                        <button
                          className="hidden group-hover:block absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-primary text-white rounded-full p-2 shadow-md"
                          onClick={() =>
                            scrollLeft(scrollContainerRefs.current[collection.title])
                          }
                        >
                          <ChevronLeft size={20} />
                        </button>
                      )}
                      <div
                        ref={(el) => (scrollContainerRefs.current[collection.title] = el)}
                        className="flex space-x-4 overflow-x-auto scroll-smooth scrollbar-hide"
                      >
                        {collection.videos.map((video) => (
                          <Card
                            key={video.id}
                            className="w-64 cursor-pointer hover:shadow-lg flex-shrink-0"
                            onClick={() => setSelectedVideo(video)}
                          >
                            <CardHeader>
                              <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="rounded-lg"
                              />
                            </CardHeader>
                            <CardContent>
                              <CardTitle className="text-base">{video.title}</CardTitle>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      {overflowState[collection.title] && (
                        <button
                          className="hidden group-hover:block absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-primary text-white rounded-full p-2 shadow-md"
                          onClick={() =>
                            scrollRight(scrollContainerRefs.current[collection.title])
                          }
                        >
                          <ChevronRight size={20} />
                        </button>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          ) : (
            <div className="text-center text-lg text-gray-500">No Video Found :(</div>
          )}
        </div>

        {/* Fullscreen Video Playback */}
        {selectedVideo && (
          <div
            className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50"
          >
            <div className="relative w-3/4 max-w-4xl bg-black rounded-lg shadow-lg group">
              <div className="absolute top-0 left-0 right-0 flex justify-between items-center bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="font-bold">{selectedVideo.title}</span>
                <button
                  className="text-white hover:text-gray-400"
                  onClick={() => setSelectedVideo(null)}
                >
                  <X size={20} />
                </button>
              </div>
              <iframe
                className="w-full h-96 rounded-lg"
                src={`https://www.youtube.com/embed/${selectedVideo.id}`}
                frameBorder="0"
                allowFullScreen
                title={selectedVideo.title}
              ></iframe>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
