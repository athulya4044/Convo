import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit2, X } from "lucide-react";
import axios from "axios";
import { AppContext } from "@/utils/store/appContext";

function AccountInfo({ isAccountInfoOpen, setIsAccountInfoOpen, client }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(client?.user?.name || "");
  const [phoneNumber, setPhoneNumber] = useState(client?.user?.phoneNumber || "");
  const [aboutMe, setAboutMe] = useState(client?.user?.aboutMe || "");
  const [imageFile, setImageFile] = useState(null);
  const _ctx = useContext(AppContext);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Reset values to current user data when toggling edit mode off
      setName(client?.user?.name || "");
      setPhoneNumber(client?.user?.phoneNumber || "");
      setAboutMe(client?.user?.aboutMe || "");
      setImageFile(client?.user?.image_url || "");
    }
  };

  const handleSave = async () => {
    let imageUrl = client?.user?.image_url;

    if (imageFile) {
      imageUrl = URL.createObjectURL(imageFile);
    }
    const updatedUserData = {
      name,
      phoneNumber,
      aboutMe,
      image_url: imageUrl,
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/update",
        {
          ...updatedUserData,
          email: _ctx.email,
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to update user in the database");
      } else {
        console.log("User updated successfully");
        alert("Your profile has been updated!");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while updating your profile.");
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <Dialog open={isAccountInfoOpen} onOpenChange={setIsAccountInfoOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            Account Information
            <Button variant="ghost" size="icon" onClick={handleEditToggle}>
              {isEditing ? (
                <X className="h-4 w-4" />
              ) : (
                <Edit2 className="h-4 w-4" />
              )}
            </Button>
          </DialogTitle>
          <DialogDescription>
            Your Stream Chat account details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={client?.user?.image_url}
                alt={client?.user?.name}
              />
              <AvatarFallback className="bg-primary text-white">{client?.user?.name?.[0]}</AvatarFallback>
            </Avatar>
          </div>
          {isEditing ? (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="aboutMe" className="text-right">
                  About Me
                </Label>
                <Input
                  id="aboutMe"
                  value={aboutMe}
                  onChange={(e) => setAboutMe(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Image
                </Label>
                <Input
                  id="image"
                  type="file"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="col-span-3"
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Name</Label>
                <span className="col-span-3">{client?.user?.name}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Email</Label>
                <span className="col-span-3">{client?.user?.email}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Phone</Label>
                <span className="col-span-3">
                  {client?.user?.phoneNumber || "Not provided"}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">About Me</Label>
                <span className="col-span-3">{client?.user?.aboutMe || "Not provided"}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">ID</Label>
                <span className="col-span-3">{client?.user?.id}</span>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Go Back
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          ) : (
            <Button onClick={() => setIsAccountInfoOpen(false)}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AccountInfo;
