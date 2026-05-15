"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Send,
  Shield,
  Star,
} from "lucide-react";

export default function TestimonialForm() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState<{ name?: string; message?: string; rating?: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          role: role,
          rating: rating,
          message: message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setIsSubmitted(true);
      setName("");
      setRole("");
      setRating(0);
      setMessage("");
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
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg inline-block text-lg font-bold"
        >
          Login to Submit
        </Link>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="mt-12">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-green-800 mb-3">Thank You!</h3>
          <p className="text-green-700 text-lg font-medium">
            Thank you for sharing your feedback! Your testimonial has been
            received and will appear on the page once reviewed and approved by
            our team.
          </p>
        </div>
      </div>
    );
  }

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
                  className="w-full px-5 py-4 pb-10 border rounded-lg focus:ring-orange-500 focus:border-orange-500 text-lg font-semibold placeholder:font-bold resize-none"
                  placeholder="Tell us about your experience..."
                />
                <div className="absolute bottom-3 right-3">
                  <p
                    className={`text-sm font-bold ${message.length >= 20 ? "text-green-600" : "text-gray-500"}`}
                  >
                    {message.length}/500
                  </p>
                </div>
              </div>
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
                disabled={isLoading}
                className="bg-linear-to-br from-orange-500 to-amber-300 hover:bg-orange-600 text-white py-4 px-8 rounded-lg font-bold text-lg transition-all duration-150 active:scale-95 active:shadow-md disabled:opacity-50 flex items-center gap-2"
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