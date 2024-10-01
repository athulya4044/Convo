import { Button } from "@/components/ui/button";
import { heroimage } from "@/assets/images";
import { useNavigate } from "react-router-dom";

const Test = () => {
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
    </div>
  );
};

export default Test;
