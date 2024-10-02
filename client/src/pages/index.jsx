import { Button } from "@/components/ui/button";
import { heroimage, ai, realtime, videocall, fileshare, groupchat,sign,create,startcolab} from "@/assets/images";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Home = () => {
  const navigate = useNavigate();

  const goToAuth = () => navigate("/auth");

  return (
    <div className="px-4">
      <section className="flex flex-col lg:flex-row items-center justify-between bg-purple-200 p-8 lg:p-16 rounded-3xl max-w-[1260px] h-auto lg:h-[500px] mx-auto">
        <div className="lg:w-1/2">
          <h1 className="text-3xl lg:text-5xl font-bold text-purple-900 mb-4">
            Where Collaboration meets Innovation
          </h1>
          <p className="text-base lg:text-xl font-semibold text-purple-800 mb-4">
            Join Convo to connect, collaborate, and achieve results. Our
            AI-powered platform fosters meaningful conversations and real-time
            teamwork.
          </p>
          <p className="text-base lg:text-lg font-semibold text-purple-800 mb-8">
            Let’s turn ideas into action — together.
          </p>
          <Button className="md:block font-semibold" onClick={goToAuth}>
            Get Started
          </Button>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0">
          <img
            src={heroimage}
            alt="Collaboration"
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      <section className="w-full text-center mt-8">
        <p
          className="text-lg md:text-3xl font-semibold text-purple-900 max-w-4xl mx-auto"
          style={{ lineHeight: "1.5" }}
        >
          Convo is where ideas turn into action. Connect, collaborate, and
          thrive with our
          <span className="text-purple-600 font-bold">
            {" "}
            AI-powered platform{" "}
          </span>
          that ignites real-time learning and fosters meaningful conversations.
        </p>
      </section>

      <section className="flex flex-wrap justify-center gap-12 mt-12 max-w-6xl mx-auto">
        <Card className="bg-purple-200 max-w-xs">
          <CardHeader className="flex justify-center">
            <img src={ai} alt="AI Help" className="w-30 h-24 mx-auto" />
          </CardHeader>
          <CardContent className="text-center">
            <CardTitle className="text-xl font-semibold text-purple-900">
              Get Instant AI Help Now by Google Gemini
            </CardTitle>
            <CardDescription className="mt-2 text-purple-900">
              Need help while studying or working? Convo&apso;s integrated AI assistant is at your service !!!
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-purple-200 max-w-xs">
          <CardHeader className="flex justify-center">
            <img src={realtime} alt="Real Time Chat" className="w-30 h-24 mx-auto" />
          </CardHeader>
          <CardContent className="text-center text-purple-900">
            <CardTitle className="text-xl font-semibold text-purple-900">
              Start Your First Real-Time Chat
            </CardTitle>
            <CardDescription className="mt-2 text-purple-900">
              Engage with peers and colleagues through fast, secure messaging. Brainstorm ideas, and work together in both public and private groups.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-purple-200 max-w-xs">
          <CardHeader className="flex justify-center">
            <img src={videocall} alt="Virtual Meeting" className="w-30 h-24 mx-auto" />
          </CardHeader>
          <CardContent className="text-center">
            <CardTitle className="text-xl font-semibold text-purple-900">
              Host Your First Virtual Meeting (Coming Soon)
            </CardTitle>
            <CardDescription className="mt-2 text-purple-900">
              Take collaboration to the next level with upcoming video conferencing features. Host virtual meetings, group study session without leaving the platform.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-purple-200 max-w-xs">
          <CardHeader className="flex justify-center">
            <img src={fileshare} alt="File Sharing" className="w-30 h-24 mx-auto" />
          </CardHeader>
          <CardContent className="text-center">
            <CardTitle className="text-xl font-semibold text-purple-900">
              Easy File Sharing
            </CardTitle>
            <CardDescription className="mt-2 text-purple-900">
              No more back-and-forth emails. Upload and share documents, presentations, and media directly in your chat. All files are stored securely in the cloud, powered by AWS S3.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-purple-200 max-w-xs ">
          <CardHeader className="flex justify-center">
            <img src={groupchat} alt="Group Chat" className="w-30 h-24 mx-auto" />
          </CardHeader>
          <CardContent className="text-center">
            <CardTitle className="text-xl font-semibold text-purple-900">
              Group Chats & Private Messaging
            </CardTitle>
            <CardDescription className="mt-2 text-purple-900">
              Collaborate in small groups or engage in one-on-one conversations. This feature gives you the flexibility you need.
            </CardDescription>
          </CardContent>
        </Card>
      </section>

    {/* How It Works Section */}
<section className="text-center my-16">
  <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-12">How it works?</h2>

  {/* Flex container for the ellipses and steps */}
  <div className="max-w-6xl mx-auto">

    {/* Flex container for Step 1 and Step 3 */}
    <div className="flex justify-between mb-8">
      {/* Step 1 */}
      <div
        className="relative flex items-center bg-purple-800 text-white p-8 rounded-[50%]"
        style={{ width: '520px', height: '260px' }}
      >
        <img src={sign} alt="Sign Up" className="w-24 h-24 mr-6" />
        <div className="flex flex-col text-left">
          <h3 className="text-lg font-bold mb-2">1. Sign Up</h3>
          <p className="text-sm">Get started by creating an account. It's free and quick!</p>
        </div>
      </div>

      {/* Step 3 */}
      <div
        className="relative flex items-center bg-purple-800 text-white p-8 rounded-[50%]"
        style={{ width: '520px', height: '260px' }}
      >
        <img src={startcolab} alt="Start Collaborating" className="w-24 h-24 mr-6" />
        <div className="flex flex-col text-left">
          <h3 className="text-lg font-bold mb-2">3. Start Collaborating</h3>
          <p className="text-sm">Chat in real-time, upload files, get AI-powered assistance, and work with your peers.</p>
        </div>
      </div>
    </div>

    {/* Step 2 centered below Steps 1 and 3 */}
    <div
      className="relative flex items-center bg-purple-800 text-white p-8 rounded-[50%] mx-auto mb-8"
      style={{ width: '500px', height: '260px' }}
    >
      <img src={create} alt="Create or Join Groups" className="w-24 h-24 mr-6" />
      <div className="flex flex-col text-left">
        <h3 className="text-lg font-bold mb-2">2. Create or Join Groups</h3>
        <p className="text-sm">Join a public group or create your private group for focused discussions.</p>
      </div>
    </div>
  </div>
</section>


<section className="w-full text-center mt-8">
  <p
    className="text-lg md:text-3xl font-semibold text-purple-900 max-w-4xl mx-auto uppercase"
    style={{ lineHeight: "1.5" }}
  >
   Scrolling can wait. Let’s chat and share ideas!
  </p>
  <div className="mb-8"></div>
  <div className="mt-4 flex justify-center">
    <Button className="md:block font-semibold" onClick={goToAuth}>
      Get Started
    </Button>
  </div>
  <div className="mb-8"></div>
</section>


    </div>
  );
};

export default Home;
