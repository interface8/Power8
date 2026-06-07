"use client";

import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Plus, Pencil, Trash2, ImageIcon, Link2, Search, X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import type { CarouselSlideDto as CarouselSlide, CreateCarouselSlideInput, UpdateCarouselSlideInput } from "@/modules/carousel/types";

interface SlideFormData {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  sort: number;
  isActive: boolean;
}

// Preview component for each slide card
function SlidePreview({ slide, index }: { slide: CarouselSlide; index: number }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border border-gray-200">
      <div className="relative h-40 bg-gray-100">
        {slide.imageUrl ? (
          <Image
            src={slide.imageUrl}
            alt={slide.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          #{index + 1}
        </div>
        {!slide.isActive && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="bg-gray-800 text-white px-3 py-1">
              Inactive
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">{slide.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-2 mt-1">
              {slide.description || "No description"}
            </p>
            {slide.linkUrl && (
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                <Link2 className="w-3 h-3" />
                <span className="truncate">{slide.linkUrl}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {slide.sort}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CarouselPage() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [deletingSlide, setDeletingSlide] = useState<CarouselSlide | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState<SlideFormData>({
    title: "",
    description: "",
    imageUrl: "",
    linkUrl: "",
    sort: 0,
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState<{ title?: string; imageUrl?: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all slides
  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/carousel");
      const json = await res.json();
      if (res.ok) {
        setSlides(json.data || []);
      } else {
        toast.error(json.message || "Failed to fetch slides");
      }
    } catch {
      toast.error("Failed to fetch slides");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // Filter slides based on search
  const filteredSlides = slides.filter((slide) =>
    slide.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      linkUrl: "",
      sort: 0,
      isActive: true,
    });
    setFormErrors({});
    setEditingSlide(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (slide: CarouselSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      description: slide.description || "",
      imageUrl: slide.imageUrl,
      linkUrl: slide.linkUrl || "",
      sort: slide.sort,
      isActive: slide.isActive,
    });
    setModalOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: { title?: string; imageUrl?: string } = {};
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }
    if (!formData.imageUrl.trim()) {
      errors.imageUrl = "Image is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: uploadFormData });
      const data = await res.json();
      if (res.ok) {
        return data.url;
      }
      toast.error("Failed to upload image");
      return null;
    } catch {
      toast.error("Failed to upload image");
      return null;
    }
  };

  const handleImageUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const file = fileArray[0];
    setUploadingImage(true);

    // Show preview immediately - using functional update to preserve other fields
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, imageUrl: previewUrl }));

    // Upload the file
    const uploadedUrl = await uploadImage(file);
    if (uploadedUrl) {
      setFormData(prev => ({ ...prev, imageUrl: uploadedUrl }));
    } else {
      setFormData(prev => ({ ...prev, imageUrl: "" }));
    }
    setUploadingImage(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleImageUpload(files);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const url = editingSlide
        ? `/api/admin/carousel/${editingSlide.id}`
        : "/api/admin/carousel";
      const method = editingSlide ? "PATCH" : "POST";

      const submitData: CreateCarouselSlideInput | UpdateCarouselSlideInput = {
        title: formData.title,
        description: formData.description || undefined,
        imageUrl: formData.imageUrl,
        linkUrl: formData.linkUrl || undefined,
        sort: formData.sort,
        isActive: formData.isActive,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save slide");
      }

      toast.success(editingSlide ? "Slide updated" : "Slide created");
      setModalOpen(false);
      resetForm();
      fetchSlides();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSlide) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/carousel/${deletingSlide.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete slide");
      }

      toast.success("Slide deleted");
      fetchSlides();
      setDeletingSlide(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleActiveStatus = async (slide: CarouselSlide) => {
    const newStatus = !slide.isActive;
    
    // Optimistic update - UI changes instantly
    setSlides(prev => prev.map(s => 
      s.id === slide.id ? { ...s, isActive: newStatus } : s
    ));
    
    try {
      const res = await fetch(`/api/admin/carousel/${slide.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (!res.ok) {
        // Revert on error
        setSlides(prev => prev.map(s => 
          s.id === slide.id ? { ...s, isActive: slide.isActive } : s
        ));
        throw new Error("Failed to update status");
      }
      
      toast.success(newStatus ? "Slide activated" : "Slide deactivated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Sort input handler - allows clearing the 0
  const handleSortChange = (value: string) => {
    if (value === "") {
      setFormData(prev => ({ ...prev, sort: 0 }));
    } else {
      const num = parseInt(value, 10);
      if (!isNaN(num)) {
        setFormData(prev => ({ ...prev, sort: num }));
      }
    }
  };

  // Format sort display - show empty when 0
  const getSortDisplayValue = () => {
    return formData.sort === 0 ? "" : formData.sort.toString();
  };

  // Loading skeleton
  if (loading && slides.length === 0) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-64 mt-2 animate-pulse" />
          </div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-40 bg-gray-200" />
              <CardContent className="p-3">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Carousel Slides</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage slides that appear on the homepage carousel
          </p>
        </div>
        <Button
          onClick={openAddModal}
          className="bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Slide
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search slides by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-9 focus:ring-orange-500 focus:border-orange-500"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-500 mt-2">
            Found {filteredSlides.length} of {slides.length} slides
          </p>
        )}
      </div>

      {/* Slides Grid - Card View - 3 cards per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSlides.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {searchTerm ? "No matching slides found" : "No slides found. Click 'Add New Slide' to create one."}
            </p>
          </div>
        ) : (
          filteredSlides.map((slide, index) => (
            <div key={slide.id} className="relative group">
              <SlidePreview slide={slide} index={index} />
              
              {/* Action Buttons - Visible on hover */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openEditModal(slide)}
                  className="h-7 w-7 p-0 bg-white/90 hover:bg-orange-100"
                  title="Edit slide"
                >
                  <Pencil className="w-3 h-3" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setDeletingSlide(slide)}
                  className="h-7 w-7 p-0 bg-white/90 hover:bg-red-100"
                  title="Delete slide"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              
              {/* Status Toggle at bottom right - Orange color */}
              <div className="absolute bottom-2 right-2">
                <Switch
                  checked={slide.isActive}
                  onCheckedChange={() => toggleActiveStatus(slide)}
                  className="data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-gray-300"
                  title={slide.isActive ? "Deactivate slide" : "Activate slide"}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingSlide ? "Edit Slide" : "Add New Slide"}
            </DialogTitle>
            <DialogDescription>
              {editingSlide
                ? "Update the slide details below."
                : "Fill in the details to create a new carousel slide."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Power Your Home with Solar"
                className="focus:ring-orange-500 focus:border-orange-500"
              />
              {formErrors.title && (
                <p className="text-red-500 text-sm">{formErrors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Description
              </Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the slide content..."
                rows={2}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Image Upload - Drag & Drop Only (No URL input) */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Image <span className="text-red-500">*</span>
              </Label>
              
              {/* Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative rounded-xl p-3 text-center transition-all duration-200 cursor-pointer border-2 border-dashed ${
                  isDragging 
                    ? "border-orange-500 bg-orange-50 scale-[1.02]" 
                    : "border-gray-300 bg-gray-50 hover:border-orange-500"
                }`}
              >
                {uploadingImage ? (
                  <div className="py-2">
                    <Loader2 className="w-5 h-5 mx-auto mb-1 animate-spin text-orange-500" />
                    <p className="text-xs text-gray-600">Uploading...</p>
                  </div>
                ) : formData.imageUrl ? (
                  <div className="relative">
                    <div className="relative h-24 rounded-lg overflow-hidden">
                      <Image
                        src={formData.imageUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                        onError={() => toast.error("Invalid image")}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData(prev => ({ ...prev, imageUrl: "" }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center shadow-md hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className={`w-5 h-5 mx-auto mb-1 transition-colors ${isDragging ? "text-orange-500" : "text-gray-400"}`} />
                    <p className="text-xs text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      await handleImageUpload(files);
                    }
                  }}
                />
              </div>
              {formErrors.imageUrl && (
                <p className="text-red-500 text-sm">{formErrors.imageUrl}</p>
              )}
            </div>

            {/* Link URL and Sort Order - side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="linkUrl" className="text-sm font-semibold">
                  Link URL
                </Label>
                <Input
                  id="linkUrl"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
                  placeholder="/products"
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
                <p className="text-xs text-gray-400">Where slide links to</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort" className="text-sm font-semibold">
                  Sort Order
                </Label>
                <Input
                  id="sort"
                  type="text"
                  value={getSortDisplayValue()}
                  onChange={(e) => handleSortChange(e.target.value)}
                  placeholder="1, 2, 3..."
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
                <p className="text-xs text-gray-400">Lower = appears first</p>
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <Label htmlFor="isActive" className="text-sm font-semibold">
                Slide is active and visible on homepage
              </Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                className="data-[state=checked]:bg-orange-500"
              />
            </div>
          </div>

          {/* Buttons - Half width each */}
          <DialogFooter className="gap-3 sm:gap-3">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              {isSubmitting ? "Saving..." : editingSlide ? "Update Slide" : "Add Slide"}
            </Button>
            <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingSlide} onOpenChange={() => setDeletingSlide(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Slide</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-600">&quot;{deletingSlide?.title}&quot;</span>
              <br />
              <br />
              This action <span className="font-semibold">cannot be undone</span>. The slide will be permanently removed from the carousel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isSubmitting ? "Deleting..." : "Yes, Delete Slide"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}