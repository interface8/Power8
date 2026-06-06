"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorToolbar } from "./blog-editor";
import { toast } from "sonner";

interface BlogEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function BlogEditor({ content, onChange }: BlogEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: true, allowBase64: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { target: "_blank" } }),
      Placeholder.configure({ placeholder: "Write your blog content here..." }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: { attributes: { class: "prose prose-sm sm:prose lg:prose-lg focus:outline-none min-h-[300px] max-w-none p-4" } },
  });

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/admin/blogs/upload-image", { method: "POST", credentials: "include", body: formData });
        if (!response.ok) throw new Error("Upload failed");
        const result = await response.json();
        editor?.chain().focus().setImage({ src: result.url }).run();
        toast.success("Image added successfully");
      } catch {
        toast.error("Failed to upload image");
      }
    };
    input.click();
  };

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <EditorToolbar editor={editor} onImageUpload={handleImageUpload} />
      <EditorContent editor={editor} className="bg-white" />
    </div>
  );
}