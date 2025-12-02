"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { updateUser } from "@/lib/api-client";
import { User } from "@/types";
import { Toast } from "@/components/ui/toast";

interface AvatarUploadProps {
  user: User;
  currentAvatar: string;
  onUpdate: () => void;
}

export function AvatarUpload({ user, currentAvatar, onUpdate }: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatar || user.avatar || "");
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update avatarUrl when currentAvatar or user.avatar changes
  useEffect(() => {
    setAvatarUrl(currentAvatar || user.avatar || "");
  }, [currentAvatar, user.avatar]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setToast({ message: "Por favor selecciona una imagen", type: "error" });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setToast({ message: "La imagen debe ser menor a 5MB", type: "error" });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id);
      formData.append("type", "avatar");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al subir la imagen");
      }

      const data = await response.json();
      const newAvatarUrl = data.url;

      // Update user avatar in database
      await updateUser(user.id, { avatar: newAvatarUrl });

      // Update local state
      setAvatarUrl(newAvatarUrl);

      setToast({ message: "Avatar actualizado", type: "success" });

      // Refresh user data
      setTimeout(() => {
        onUpdate();
      }, 500);
    } catch (error) {
      setToast({ message: "Error al subir la imagen", type: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="relative">
        <Avatar className="h-24 w-24 border-4 border-background md:h-32 md:w-32">
          <AvatarImage src={avatarUrl} alt={user.name} />
          <AvatarFallback className="text-2xl md:text-3xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          disabled={isUploading}
        >
          <Camera className="h-4 w-4" />
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
