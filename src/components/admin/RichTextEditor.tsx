import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extension-placeholder";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Heading4,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { uploadMedia } from "@/lib/storage";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  folder: "notes" | "case-studies";
  placeholder?: string;
};

function ToolbarButton({
  active,
  onClick,
  disabled,
  label,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Toggle
      size="sm"
      pressed={active ?? false}
      onPressedChange={onClick}
      disabled={disabled}
      aria-label={label}
      className="data-[state=on]:bg-secondary"
    >
      {children}
    </Toggle>
  );
}

function LinkButton({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setUrl(editor.getAttributes("link")["href"] ?? "");
      }}
    >
      <PopoverTrigger asChild>
        <span>
          <ToolbarButton
            active={editor.isActive("link")}
            onClick={() => setOpen((v) => !v)}
            label="Link"
          >
            <LinkIcon className="size-4" />
          </ToolbarButton>
        </span>
      </PopoverTrigger>
      <PopoverContent className="flex w-72 gap-2 p-2">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="h-8"
        />
        <Button
          type="button"
          size="sm"
          onClick={() => {
            if (url.trim()) {
              editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
            } else {
              editor.chain().focus().unsetLink().run();
            }
            setOpen(false);
          }}
        >
          Apply
        </Button>
      </PopoverContent>
    </Popover>
  );
}

function ImageButton({
  editor,
  folder,
}: {
  editor: Editor;
  folder: RichTextEditorProps["folder"];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          setUploading(true);
          try {
            const url = await uploadMedia(file, folder, "content");
            editor.chain().focus().setImage({ src: url }).run();
          } finally {
            setUploading(false);
          }
        }}
      />
      <ToolbarButton
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        label="Insert image"
      >
        <ImageIcon className="size-4" />
      </ToolbarButton>
    </>
  );
}

function Toolbar({ editor, folder }: { editor: Editor; folder: RichTextEditorProps["folder"] }) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border p-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo className="size-4" />
      </Button>
      <Separator orientation="vertical" className="mx-1 h-6" />
      <ToolbarButton
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        label="Bold"
      >
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        label="Italic"
      >
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        label="Strikethrough"
      >
        <Strikethrough className="size-4" />
      </ToolbarButton>
      <Separator orientation="vertical" className="mx-1 h-6" />
      <ToolbarButton
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        label="Heading 2"
      >
        <Heading2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        label="Heading 3"
      >
        <Heading3 className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("heading", { level: 4 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        label="Heading 4"
      >
        <Heading4 className="size-4" />
      </ToolbarButton>
      <Separator orientation="vertical" className="mx-1 h-6" />
      <ToolbarButton
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        label="Bullet list"
      >
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        label="Numbered list"
      >
        <ListOrdered className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        label="Quote"
      >
        <Quote className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        label="Code block"
      >
        <Code className="size-4" />
      </ToolbarButton>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus className="size-4" />
      </Button>
      <Separator orientation="vertical" className="mx-1 h-6" />
      <LinkButton editor={editor} />
      <ImageButton editor={editor} folder={folder} />
    </div>
  );
}

/** Controlled Tiptap rich-text editor, storing/emitting HTML. */
export function RichTextEditor({ value, onChange, folder, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false, autolink: true },
        heading: { levels: [2, 3, 4] },
      }),
      Image,
      Placeholder.configure({ placeholder: placeholder ?? "Write something..." }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-3",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return <div className="skeleton-shimmer h-[380px] w-full rounded-xl" />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border panel-card">
      <Toolbar editor={editor} folder={folder} />
      <EditorContent editor={editor} />
    </div>
  );
}
