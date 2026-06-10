"use client";

import { Editor } from "@tiptap/react";
import { EditorButtonConfig } from "./editorConfig";

interface EditorButtonProps {
  config: EditorButtonConfig;
  editor: Editor; 
}

export function EditorButton({ config, editor }: EditorButtonProps) {
  const Icon = config.icon;
  const isActive = editor.isActive(config.action);
  const isDisabled =
    (config.action === "undo" && !editor.can().undo()) ||
    (config.action === "redo" && !editor.can().redo());

  return (
    <button
      type="button"
      onClick={() => config.onClick(editor)}
      disabled={isDisabled}
      className={`rounded p-1.5 transition-colors ${
        isActive
          ? "bg-gray-200 text-gray-900"
          : "text-gray-600 hover:bg-gray-100"
      } disabled:opacity-30`}
      title={config.label}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
