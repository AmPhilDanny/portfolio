"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { 
  Bold, Italic, List, ListOrdered, Quote, Undo, Redo, Link as LinkIcon, 
  Strikethrough, Underline as UnderlineIcon, Code, Sparkles, Loader2,
  Wand2, Briefcase, AlignLeft, AlignJustify, CheckCircle
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { generateEditorContent } from '@/app/actions/editor-ai';

type EditorAiAction = 
  | 'improve'
  | 'professional'
  | 'shorter'
  | 'longer'
  | 'fix_grammar'
  | 'custom';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  label?: string;
}

const MenuButton = ({ 
  onClick, 
  active = false, 
  children, 
  title 
}: { 
  onClick: () => void; 
  active?: boolean; 
  children: React.ReactNode;
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-2 rounded-md transition-colors ${
      active 
        ? 'bg-primary text-white' 
        : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
    }`}
  >
    {children}
  </button>
);

export default function RichTextEditor({ content, onChange, label }: RichTextEditorProps) {
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const aiMenuRef = useRef<HTMLDivElement>(null);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none min-h-[150px] p-4 focus:outline-none bg-white dark:bg-zinc-900 rounded-b-lg border border-zinc-200 dark:border-zinc-800',
      },
    },
  });

  if (!editor) {
    return null;
  }

  // Handle clicking outside to close AI menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (aiMenuRef.current && !aiMenuRef.current.contains(event.target as Node)) {
        setIsAiMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAiAction = async (actionType: EditorAiAction) => {
    setIsAiLoading(true);
    try {
      const selection = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(selection.from, selection.to, ' ');
      
      const res = await generateEditorContent(aiCustomPrompt, selectedText, actionType);
      
      if (res.success && res.content) {
        if (selectedText) {
          editor.chain().focus().insertContentAt(
            { from: selection.from, to: selection.to },
            res.content
          ).run();
        } else {
          editor.chain().focus().insertContent(res.content).run();
        }
        setIsAiMenuOpen(false);
        setAiCustomPrompt('');
      } else {
        alert("Failed to generate content: " + res.error);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during AI generation.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const hasSelection = !editor.state.selection.empty;

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">{label}</label>}
      <div className="flex flex-wrap gap-1 p-1 bg-zinc-50 dark:bg-zinc-950 border border-b-0 border-zinc-200 dark:border-zinc-800 rounded-t-lg">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          title="Code"
        >
          <Code className="w-4 h-4" />
        </MenuButton>
        
        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1 self-center" />
        
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </MenuButton>
        
        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1 self-center" />
        
        <MenuButton
          onClick={addLink}
          active={editor.isActive('link')}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1 self-center" />
        
        <div className="relative" ref={aiMenuRef}>
          <button
            type="button"
            onClick={() => setIsAiMenuOpen(!isAiMenuOpen)}
            title="AI Assistant"
            className={`flex items-center gap-1 px-2 py-1.5 rounded-md transition-colors text-sm font-medium ${
              isAiMenuOpen
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                : 'hover:bg-purple-50 text-purple-600 dark:hover:bg-purple-900/20 dark:text-purple-500'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">AI Assistant</span>
          </button>
          
          {isAiMenuOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col">
              <div className="p-2 border-b border-zinc-100 dark:border-zinc-800">
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 px-2 uppercase tracking-wider">
                  {hasSelection ? 'Refine Selected Text' : 'Generate Content'}
                </p>
                {hasSelection && (
                  <div className="space-y-1">
                    <button onClick={() => handleAiAction('improve')} disabled={isAiLoading} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors disabled:opacity-50">
                      <Wand2 className="w-4 h-4 text-purple-500" /> Improve writing
                    </button>
                    <button onClick={() => handleAiAction('professional')} disabled={isAiLoading} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors disabled:opacity-50">
                      <Briefcase className="w-4 h-4 text-blue-500" /> Make professional
                    </button>
                    <button onClick={() => handleAiAction('shorter')} disabled={isAiLoading} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors disabled:opacity-50">
                      <AlignLeft className="w-4 h-4 text-green-500" /> Make shorter
                    </button>
                    <button onClick={() => handleAiAction('longer')} disabled={isAiLoading} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors disabled:opacity-50">
                      <AlignJustify className="w-4 h-4 text-orange-500" /> Make longer
                    </button>
                    <button onClick={() => handleAiAction('fix_grammar')} disabled={isAiLoading} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors disabled:opacity-50">
                      <CheckCircle className="w-4 h-4 text-red-500" /> Fix grammar & spelling
                    </button>
                  </div>
                )}
              </div>
              <div className="p-2 bg-zinc-50 dark:bg-zinc-950">
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 px-2 uppercase tracking-wider">
                  Custom Prompt
                </p>
                <div className="flex flex-col gap-2">
                  <textarea
                    className="w-full text-sm p-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                    placeholder="Tell AI what to write..."
                    rows={2}
                    value={aiCustomPrompt}
                    onChange={(e) => setAiCustomPrompt(e.target.value)}
                    disabled={isAiLoading}
                  />
                  <button
                    onClick={() => handleAiAction('custom')}
                    disabled={isAiLoading || !aiCustomPrompt.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {isAiLoading ? 'Generating...' : 'Generate'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-grow" />
        
        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </MenuButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
