/* eslint-disable react/prop-types */
import { useState } from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function OTP({ setError, setLoading, phoneNumber, cancelAction }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();

  const handleChange = (element, index) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 6) {
      // Here you would typically verify the OTP with your backend
      console.log("Submitted OTP:", enteredOtp);
      try {
        const res = await axios.post(
          `http://localhost:4000/api/users/verify-otp`,
          {
            phoneNumber,
            code: enteredOtp,
          }
        );

        if (res.data.error) {
          setError(res.data.error);
          return;
        }

        // display password reset page
        navigate(`/reset-password/${res.data.userID}`);
      } catch (err) {
        console.error("Error during phone reset:", err);
        setError("Invalid OTP, Please try again !");
      } finally {
        setLoading(false);
      }
    } else {
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardContent>
        <div className="flex justify-center space-x-2">
          {otp.map((data, index) => (
            <Input
              key={index}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{1}"
              maxLength={1}
              className="w-12 h-12 text-center text-2xl"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center gap-3">
        <Button className="w-full" variant="outline" onClick={cancelAction}>Cancel</Button>
        <Button className="w-full" type="submit">
          Verify OTP
        </Button>
      </CardFooter>
    </form>
  );
}

export default OTP;
