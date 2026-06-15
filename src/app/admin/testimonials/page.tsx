"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


interface Testimonial {
  id: string;
  title: string;
  description: string;
  rating: number;
  status: string;
  location?: string;
  role?: string;
  imageUrl?: string;
  createdAt: string;
  user: { id: string; name: string };
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      setTestimonials(data);
    } catch {
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        toast.success(`Testimonial ${status}`);
        fetchTestimonials();
      } else {
        toast.error("Failed to update");
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  const deleteTestimonial = async () => {
    if (!testimonialToDelete) return;

    try {
      const res = await fetch(`/api/admin/testimonials?id=${testimonialToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Testimonial deleted");
        fetchTestimonials();
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteDialogOpen(false);
      setTestimonialToDelete(null);
    }
  };

  const openDeleteDialog = (testimonial: Testimonial) => {
    setTestimonialToDelete(testimonial);
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const filteredTestimonials = testimonials.filter((t) => t.status === activeTab);

  const counts = {
    pending: testimonials.filter((t) => t.status === "pending").length,
    approved: testimonials.filter((t) => t.status === "approved").length,
    rejected: testimonials.filter((t) => t.status === "rejected").length,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl border p-10 shadow-sm flex flex-col">
      <div className="flex gap-8">
        <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
        <div className="flex-1">
          <div className="flex flex-wrap justify-between items-start gap-2">
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-32 mb-2" />
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-11/12" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-10/12" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-9/12" />
          </div>
          <div className="mt-3">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-40" />
          </div>
        </div>
      </div>
      <div className="mt-6 pt-5 border-t border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1 h-9 bg-gray-200 rounded-lg animate-pulse" />
          <div className="flex-1 h-9 bg-gray-200 rounded-lg animate-pulse" />
          <div className="flex-1 h-9 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-full px-4 py-8">
          <div className="flex gap-2 mb-8">
            <div className="h-9 w-20 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-9 w-24 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-9 w-20 bg-gray-200 rounded-md animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 py-8">
        {/* Status Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-2 rounded-lg w-fit shadow-sm">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2.5 rounded-md font-medium text-sm transition-all ${
              activeTab === "pending"
                ? "bg-orange-500 text-white shadow-md"
                : "text-gray-500"
            }`}
          >
            Pending ({counts.pending})
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={`px-4 py-2.5 rounded-md font-medium text-sm transition-all ${
              activeTab === "approved"
                ? "bg-orange-500 text-white shadow-md"
                : "text-gray-500"
            }`}
          >
            Approved ({counts.approved})
          </button>
          <button
            onClick={() => setActiveTab("rejected")}
            className={`px-4 py-2.5 rounded-md font-medium text-sm transition-all ${
              activeTab === "rejected"
                ? "bg-orange-500 text-white shadow-md"
                : "text-gray-500"
            }`}
          >
            Rejected ({counts.rejected})
          </button>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredTestimonials.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-lg border">
              <p className="text-gray-500">No {activeTab} testimonials found</p>
            </div>
          ) : (
            filteredTestimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="bg-white rounded-xl border p-10 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex gap-8">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center flex-shrink-0">
                    {testimonial.imageUrl ? (
                      <Image
                        src={testimonial.imageUrl}
                        alt={testimonial.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-orange-600 font-semibold text-2xl">
                        {testimonial.title.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <h3 className="font-medium text-base text-gray-900">
                          {testimonial.title}
                        </h3>
                        <div className="flex items-center gap-0.5 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < testimonial.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {formatDate(testimonial.createdAt)}
                      </span>
                    </div>

                    {/* Message */}
                    <p className="text-gray-600 mt-3 text-[12px] leading-relaxed font-normal">
                      {testimonial.description}
                    </p>

                    {/* Role & Location */}
                    {(testimonial.role || testimonial.location) && (
                      <p className="text-xs text-gray-500 mt-2">
                        {testimonial.role && <span>{testimonial.role}</span>}
                        {testimonial.role && testimonial.location && <span> • </span>}
                        {testimonial.location && <span>📍 {testimonial.location}</span>}
                      </p>
                    )}
                  </div>
                </div>

                {/* Separator + Actions */}
                <div className="mt-6 pt-5 border-t border-gray-200">
                  {activeTab === "pending" && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateStatus(testimonial.id, "approved")}
                        className="flex-1 bg-transparent border border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(testimonial.id, "rejected")}
                        className="flex-1 bg-transparent border border-red-300 text-red-500 hover:bg-red-50 hover:border-red-400 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </div>
                  )}

                  {activeTab === "approved" && (
                    <div className="flex gap-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3" />
                        Approved
                      </span>
                      <button
                        onClick={() => openDeleteDialog(testimonial)}
                        className="flex-1 bg-transparent border border-gray-300 text-gray-600 hover:bg-red-50 hover:border-red-400 hover:text-red-600 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  )}

                  {activeTab === "rejected" && (
                    <div className="flex gap-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <XCircle className="w-3 h-3" />
                        Rejected
                      </span>
                      <button
                        onClick={() => openDeleteDialog(testimonial)}
                        className="flex-1 bg-transparent border border-gray-300 text-gray-600 hover:bg-red-50 hover:border-red-400 hover:text-red-600 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the testimonial from{" "}
              <span className="font-semibold text-red-600">{testimonialToDelete?.title}</span>?
              <br />
              <br />
              This action <span className="font-semibold">cannot be undone</span>. The testimonial will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteTestimonial}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}