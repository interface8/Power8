"use client";

import { Editor } from "@tiptap/react";
import { EditorButton } from "./EditorButton";
import { getToolbarButtons } from "./editorConfig";

interface EditorToolbarProps {
  editor: Editor; 
  onImageUpload: () => void;
}

export function EditorToolbar({ editor, onImageUpload }: EditorToolbarProps) {
  const buttons = getToolbarButtons(editor, onImageUpload);

  return (
    <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 p-2">
      {buttons.map(
        (
          btn,
        ) => (
          <EditorButton key={btn.action} config={btn} editor={editor} />
        ),
      )}
    </div>
  );
}
