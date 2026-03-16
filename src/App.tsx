import React, { useState, useEffect, useRef } from 'react';
import { renderMermaidSVG } from 'beautiful-mermaid';
import { Download, Copy, Code, Check, AlertCircle } from 'lucide-react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';

const DEFAULT_MERMAID = `graph TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[Car]`;

export default function App() {
  const [code, setCode] = useState(DEFAULT_MERMAID);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);

  // Detect dark mode and mobile
  useEffect(() => {
    const darkMedia = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(darkMedia.matches);
    const darkListener = (e: MediaQueryListEvent) => setIsDark(e.matches);
    darkMedia.addEventListener('change', darkListener);

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Apply dark class to html for tailwind
    if (darkMedia.matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    return () => {
      darkMedia.removeEventListener('change', darkListener);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Sync html dark class when isDark changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Render SVG
  useEffect(() => {
    try {
      const svg = renderMermaidSVG(code, {
        transparent: true,
        bg: 'transparent',
        fg: isDark ? '#f4f4f5' : '#18181b', // zinc-100 or zinc-900
        line: isDark ? '#52525b' : '#a1a1aa', // zinc-600 or zinc-400
        border: isDark ? '#3f3f46' : '#d4d4d8', // zinc-700 or zinc-300
        surface: isDark ? '#18181b' : '#ffffff', // zinc-900 or white
        accent: isDark ? '#ffffff' : '#000000',
        font: 'ui-sans-serif, system-ui, sans-serif'
      });
      setSvgContent(svg);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to render diagram');
    }
  }, [code, isDark]);

  const handleCopyPNG = async () => {
    if (!svgContent) return;
    try {
      const blob = await svgToPng(svgContent, 3, isDark);
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy PNG:', err);
      alert('Failed to copy PNG to clipboard.');
    }
  };

  const handleExportPNG = async () => {
    if (!svgContent) return;
    try {
      const blob = await svgToPng(svgContent, 3, isDark);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'graphite-diagram.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExported(true);
      setTimeout(() => setExported(false), 2000);
    } catch (err) {
      console.error('Failed to export PNG:', err);
      alert('Failed to export PNG');
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 overflow-hidden font-sans selection:bg-zinc-300 dark:selection:bg-zinc-700">
      <PanelGroup orientation={isMobile ? "vertical" : "horizontal"}>
        
        {/* Editor Panel */}
        <Panel defaultSize={40} minSize={20} className="flex flex-col bg-white dark:bg-zinc-950 relative z-10 shadow-xl shadow-zinc-200/50 dark:shadow-black/50">
          <div className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-5 justify-between shrink-0">
            <div className="flex items-center gap-3 font-semibold text-sm tracking-tight">
              <div className="w-7 h-7 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shadow-sm">
                <Code size={16} strokeWidth={2.5} />
              </div>
              Graphite
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <Editor code={code} setCode={setCode} />
          </div>
        </Panel>
        
        {/* Resize Handle */}
        <PanelResizeHandle className="w-1.5 h-1.5 md:w-1.5 md:h-auto bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-400 dark:hover:bg-zinc-600 transition-colors z-20" />
        
        {/* Preview Panel */}
        <Panel minSize={30} className="flex flex-col bg-zinc-50 dark:bg-zinc-900 relative z-0">
          <div className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-5 justify-between shrink-0 bg-white dark:bg-zinc-950">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Preview</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyPNG}
                disabled={!svgContent}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 rounded-md transition-all disabled:opacity-50"
              >
                {copied ? <Check size={14} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleExportPNG}
                disabled={!svgContent}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-md hover:bg-zinc-800 dark:hover:bg-white transition-all disabled:opacity-50 shadow-sm"
              >
                {exported ? <Check size={14} /> : <Download size={14} />}
                {exported ? 'Exported' : 'Export'}
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-8 flex items-center justify-center relative">
            {/* Checkerboard pattern */}
            <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>
            
            <div className="min-h-full min-w-full flex items-center justify-center p-4">
              {error ? (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 px-6 py-5 rounded-xl shadow-sm max-w-lg w-full z-10 flex gap-4 items-start">
                  <AlertCircle className="shrink-0 mt-0.5" size={18} />
                  <div>
                    <h3 className="font-semibold mb-1 text-sm">Syntax Error</h3>
                    <p className="text-xs font-mono whitespace-pre-wrap break-words opacity-80 leading-relaxed">{error}</p>
                  </div>
                </div>
              ) : (
                <div 
                  className="bg-white dark:bg-zinc-950 shadow-xl shadow-zinc-200/50 dark:shadow-black/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-10 transition-all duration-300 ease-in-out z-10 flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              )}
            </div>
          </div>
        </Panel>
        
      </PanelGroup>
    </div>
  );
}

// Custom Editor Component with Line Numbers
function Editor({ code, setCode }: { code: string, setCode: (c: string) => void }) {
  const lineRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const lines = code.split('\n');
  
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineRef.current) {
      lineRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      
      // Move cursor after setState
      setTimeout(() => {
        if (textRef.current) {
          textRef.current.selectionStart = textRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };
  
  return (
    <div className="flex h-full w-full bg-white dark:bg-zinc-950 font-mono text-[13px] overflow-hidden">
      <div 
        ref={lineRef} 
        className="w-12 flex-shrink-0 text-right pr-3 py-5 text-zinc-400 dark:text-zinc-600 select-none overflow-hidden bg-zinc-50 dark:bg-zinc-900/50 border-r border-zinc-200 dark:border-zinc-800"
      >
        {lines.map((_, i) => <div key={i} className="leading-6">{i + 1}</div>)}
      </div>
      <textarea
        ref={textRef}
        value={code}
        onChange={e => setCode(e.target.value)}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        className="flex-1 p-5 leading-6 bg-transparent resize-none outline-none text-zinc-800 dark:text-zinc-200 whitespace-pre"
        spellCheck={false}
        wrap="off"
        placeholder="Enter Mermaid syntax..."
      />
    </div>
  );
}

// Export Utility
async function svgToPng(svgString: string, scale: number = 2, isDark: boolean): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    let processedSvg = svgString;
    if (!processedSvg.includes('xmlns=')) {
      processedSvg = processedSvg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
    }
    
    const svgBlob = new Blob([processedSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      
      // Match the preview panel styling
      const padding = 40 * scale; // p-10 is 40px
      const borderRadius = 16 * scale; // rounded-2xl is 16px
      const borderWidth = 1 * scale; // border is 1px
      
      canvas.width = (img.width * scale) + (padding * 2);
      canvas.height = (img.height * scale) + (padding * 2);
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      // Draw rounded background
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(borderWidth/2, borderWidth/2, canvas.width - borderWidth, canvas.height - borderWidth, borderRadius);
      } else {
        // Fallback for older browsers
        ctx.rect(borderWidth/2, borderWidth/2, canvas.width - borderWidth, canvas.height - borderWidth);
      }
      ctx.fillStyle = isDark ? '#09090b' : '#ffffff'; // zinc-950 or white
      ctx.fill();
      
      // Draw border
      ctx.lineWidth = borderWidth;
      ctx.strokeStyle = isDark ? '#27272a' : '#e4e4e7'; // zinc-800 or zinc-200
      ctx.stroke();
      
      // Draw SVG
      ctx.scale(scale, scale);
      ctx.drawImage(img, padding / scale, padding / scale);
      URL.revokeObjectURL(url);
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/png');
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG into Image element'));
    };
    
    img.src = url;
  });
}

