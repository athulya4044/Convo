import { Button } from "@/components/ui/button";
import { hero } from "@/assets/images";

const Test = () => {
  return (
    <section>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Image Section */}
        <img src={hero} alt="Hero Image" style={{ width: "100%", height: "auto" }} />
      </div>
    </section>
  );
};
export default Test;
