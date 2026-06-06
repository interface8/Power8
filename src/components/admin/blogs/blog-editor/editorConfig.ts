import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";

export interface EditorButtonConfig {
  action: string;
  icon: React.ElementType;
  label: string;
  onClick: (editor: Editor) => void; 
}

export const getToolbarButtons = (
  editor: Editor,
  onImageUpload: () => void,
): EditorButtonConfig[] => {

  return [
    {
      action: "bold",
      icon: Bold,
      label: "Bold",
      onClick: (e) => e.chain().focus().toggleBold().run(),
    },
    {
      action: "italic",
      icon: Italic,
      label: "Italic",
      onClick: (e) => e.chain().focus().toggleItalic().run(),
    },
    {
      action: "heading1",
      icon: Heading1,
      label: "Heading 1",
      onClick: (e) => e.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      action: "heading2",
      icon: Heading2,
      label: "Heading 2",
      onClick: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      action: "bulletList",
      icon: List,
      label: "Bullet List",
      onClick: (e) => e.chain().focus().toggleBulletList().run(),
    },
    {
      action: "orderedList",
      icon: ListOrdered,
      label: "Numbered List",
      onClick: (e) => e.chain().focus().toggleOrderedList().run(),
    },
    {
      action: "link",
      icon: LinkIcon,
      label: "Insert Link",
      onClick: (e) => {
        const url = window.prompt("Enter URL:");
        if (url) e.chain().focus().setLink({ href: url }).run();
      },
    },
    {
      action: "image",
      icon: ImageIcon,
      label: "Insert Image",
      onClick: () => onImageUpload(),
    },
    {
      action: "undo",
      icon: Undo,
      label: "Undo",
      onClick: (e) => e.chain().focus().undo().run(),
    },
    {
      action: "redo",
      icon: Redo,
      label: "Redo",
      onClick: (e) => e.chain().focus().redo().run(),
    },
  ];
};
