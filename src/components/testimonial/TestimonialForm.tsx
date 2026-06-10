"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Send,
  Shield,
  Star,
  Upload,
  X,
  MapPin,
} from "lucide-react";

export default function TestimonialForm() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; message?: string; rating?: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const validate = () => {
    const newErrors: { name?: string; message?: string; rating?: string } = {};
    
    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = "Name is required (minimum 2 characters)";
    }
    
    if (rating === 0) {
      newErrors.rating = "Please select a rating";
    }
    
    if (!message.trim() || message.trim().length < 20) {
      newErrors.message = "Message must be at least 20 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setImageUrl(data.url);
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    setIsLoading(true);
    console.log("Submitting location:", location);

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          role: role,
          location: location,
          rating: rating,
          message: message,
          imageUrl: imageUrl || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }
      
      setIsSubmitted(true);
      setName("");
      setRole("");
      setLocation("");
      setRating(0);
      setMessage("");
      setImageUrl("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center mt-12">
        <p className="text-gray-700 mb-4 text-xl font-bold">
          Please login to submit a testimonial.
        </p>
        <Link
          href="/login"
          className="bg-linear-to-br from-orange-500 to-amber-300 hover:bg-orange-600 text-white px-8 py-3 rounded-lg inline-block text-lg font-bold"
        >
          Login to Submit
        </Link>
      </div>
    );
  }

  // if (isSubmitted) {
  //   return (
  //     <div className="mt-12">
  //       <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
  //         <h3 className="text-2xl font-bold text-green-800 mb-3">Thank You!</h3>
  //         <p className="text-green-700 text-lg font-medium">
  //           Thank you for sharing your feedback! Your testimonial has been
  //           received and will appear on the page once reviewed and approved by
  //           our team.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

if (isSubmitted) {
  return (
    <div className="mt-12 animate-fade-in">
      <div className="bg-white border border-green-200 rounded-2xl p-8 md:p-12 text-center shadow-lg">
        {/* Animated checkmark circle */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>
        
        {/* Main message */}
        <h3 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
          Thank You
        </h3>
        
        <p className="text-gray-700 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
          Your testimonial has been successfully submitted and will appear on the page once reviewed and approved by our team.
        </p>
        
        {/* Decorative divider with icon */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <div className="h-px w-12 bg-gray-200"></div>
          <CheckCircle className="w-4 h-4 text-green-500" />
          <div className="h-px w-12 bg-gray-200"></div>
        </div>
        
        {/* Secondary message with icon */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <MessageCircle className="w-5 h-5 text-gray-400" />
          <p className="text-gray-500 text-base">
            We appreciate you taking the time to share your experience.
          </p>
        </div>
      </div>
    </div>
  );
}

  const getCharWarning = () => {
    if (message.length >= 480 && message.length < 500) {
      return "⚠️ Approaching character limit (500 max)";
    }
    if (message.length >= 500) {
      return "❌ Character limit exceeded! Please shorten your message.";
    }
    return null;
  };

  const charWarning = getCharWarning();
  const isNearLimit = message.length >= 480 && message.length < 500;
  const isOverLimit = message.length >= 500;

  return (
    <div className="mt-12">
      <div className="grid grid-cols-1 md:grid-cols-10 gap-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="md:col-span-3">
          <div className="flex flex-col items-start gap-2 mb-4">
            <div className="w-22 h-22 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-full flex items-center justify-center mb-5">
              <MessageCircle className="w-12 h-12 text-orange-500" />
            </div>
            <h3 className="text-[33px] font-bold text-gray-900">
              Share Your Experience
            </h3>
          </div>
          <p className="text-gray-700 mb-4 text-xl font-medium leading-relaxed">
            We&apos;d love to hear your feedback. Submit your testimonial and
            our team will review it before publishing.
          </p>
          <div className="flex gap-4 p-4 bg-blue-50 rounded-lg">
            <Shield className="w-8 h-8 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xl font-medium text-blue-800 leading-relaxed">
              Your testimonial will not be published immediately. It will appear
              on the site <br />
              once approved by our team.
            </p>
          </div>
        </div>

        <div className="md:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 border rounded-lg focus:ring-orange-500 focus:border-orange-500 text-lg font-semibold placeholder:font-bold"
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm font-medium mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Role / Company
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-5 py-4 border rounded-lg focus:ring-orange-500 focus:border-orange-500 text-lg font-semibold placeholder:font-bold"
                  placeholder="e.g. Product Designer at ABC Ltd"
                />
              </div>
            </div>

            {/* Location Field */}
            <div>
              <label className="block text-lg font-bold text-gray-700 mb-2">
                Location <span className="text-gray-400 text-sm font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 border rounded-lg focus:ring-orange-500 focus:border-orange-500 text-lg font-semibold placeholder:font-bold"
                  placeholder="e.g., Lagos, Nigeria / New York, USA / London, UK"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-lg font-bold text-gray-700 mb-2">
                Profile Picture (Optional)
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                >
                  <Upload className="w-5 h-5" />
                  {isUploading ? "Uploading..." : "Upload Image"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {imageUrl && mounted && (
                  <div className="relative inline-block">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500">
                      <Image
                        src={imageUrl}
                        alt="Profile preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5 shadow-md z-10"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Star Rating Section */}
            <div>
              <label className="block text-lg font-bold text-gray-700 mb-2">
                Your Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        (hoverRating || rating) >= star
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-gray-500 text-sm ml-2">
                  {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
                </span>
              </div>
              {errors.rating && (
                <p className="text-red-500 text-sm font-medium mt-1">{errors.rating}</p>
              )}
            </div>

            <div>
              <label className="block text-lg font-bold text-gray-700 mb-2">
                Testimonial Message <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full px-5 py-4 pb-10 border rounded-lg focus:ring-orange-500 focus:border-orange-500 text-lg font-semibold placeholder:font-bold resize-none ${
                    isOverLimit ? "border-red-500" : isNearLimit ? "border-yellow-500" : ""
                  }`}
                  placeholder="Tell us about your experience..."
                  maxLength={500}
                />
                <div className="absolute bottom-3 right-3">
                  <p
                    className={`text-sm font-bold ${message.length >= 20 ? "text-green-600" : "text-gray-500"}`}
                  >
                    {message.length}/500
                  </p>
                </div>
              </div>
              {charWarning && (
                <p className={`text-sm font-medium mt-1 ${isOverLimit ? "text-red-500" : "text-yellow-600"}`}>
                  {charWarning}
                </p>
              )}
              {errors.message && (
                <p className="text-red-500 text-sm font-medium mt-1">
                  {errors.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Minimum 20 characters required</span>
              </div>
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-600">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <span>
                  Be honest and specific — it helps others know what to expect.
                </span>
              </div>
            </div>

            <div className="flex justify-start pt-4">
              <button
                type="submit"
                disabled={isLoading || isOverLimit}
                className={`bg-linear-to-br from-orange-500 to-amber-300 hover:bg-orange-600 text-white py-4 px-8 rounded-lg font-bold text-lg transition-all duration-150 active:scale-95 active:shadow-md disabled:opacity-50 flex items-center gap-2 ${
                  isAnimating ? "animate-bounce" : ""
                }`}
              >
                <Send className="w-5 h-5" />
                {isLoading ? "Submitting..." : "Submit Testimonial"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}