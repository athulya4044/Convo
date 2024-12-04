import { useState, useRef } from "react";
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
import { tutorialCollections } from "../utils/tutorialCollections";

export default function Tutorial() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [collapsedSections, setCollapsedSections] = useState({});

  const categories = ["All", "Programming", "AI", "Soft Skills", "Web Design"];

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleToggleSection = (title) => {
    setCollapsedSections((prevState) => ({
      ...prevState,
      [title]: !prevState[title],
    }));
  };

  const filteredCollections = tutorialCollections
    .filter(
      (collection) =>
        selectedCategory === "All" || collection.category === selectedCategory
    )
    .map((collection) => ({
      ...collection,
      videos: collection.videos.filter((video) =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter(
      (collection) =>
        collection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.videos.length > 0
    );

  const trendingVideos = tutorialCollections
    .flatMap((collection) => collection.videos)
    .filter((video) => video.isTrending);

  const scrollContainerRefs = useRef({});

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
      onClick={() => setSearchTerm("")} // Clear the search term
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


        {/* Trending Videos Section */}
        {!searchTerm && selectedCategory === "All" && trendingVideos.length > 0 && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Trending Videos</h2>
            <div className="relative group">
              <button
                className="hidden group-hover:block absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-primary text-white rounded-full p-2 shadow-md hover:bg-primary-dark"
                onClick={() => scrollLeft(scrollContainerRefs.current["trending"])}
              >
                <ChevronLeft size={20} />
              </button>
              <div
                ref={(el) => (scrollContainerRefs.current["trending"] = el)}
                className="flex space-x-4 overflow-x-auto scroll-smooth scrollbar-hide"
              >
                {trendingVideos.map((video) => (
                  <Card
                    key={video.title}
                    className="w-64 cursor-pointer hover:shadow-lg flex-shrink-0"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <CardHeader>
                      <img
                        src={`https://img.youtube.com/vi/${video.url.split(
                          "/embed/"
                        )[1]}/0.jpg`}
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
              <button
                className="hidden group-hover:block absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-primary text-white rounded-full p-2 shadow-md hover:bg-primary-dark"
                onClick={() => scrollRight(scrollContainerRefs.current["trending"])}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Tutorial Collections */}
        <div className="p-6">
          {filteredCollections.length > 0 ? (
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
                    <div className="flex space-x-4 overflow-x-auto scroll-smooth scrollbar-hide">
                      {collection.videos.map((video) => (
                        <Card
                          key={video.title}
                          className="w-64 cursor-pointer hover:shadow-lg flex-shrink-0"
                          onClick={() => setSelectedVideo(video)}
                        >
                          <CardHeader>
                            <img
                              src={`https://img.youtube.com/vi/${video.url.split(
                                "/embed/"
                              )[1]}/0.jpg`}
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
                  </CardContent>
                )}
              </Card>
            ))
          ) : (
            <div className="text-center text-lg text-gray-500">
              No Video Found :(
            </div>
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
                  <X size={24} />
                </button>
              </div>
              <iframe
                className="w-full h-96 rounded-lg"
                src={selectedVideo.url}
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
