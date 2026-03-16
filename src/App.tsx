import React, { useState, useEffect, useRef } from 'react';
import { renderMermaidSVG, THEMES as BM_THEMES } from 'beautiful-mermaid';
import { Download, Copy, Code, Check, AlertCircle, Palette } from 'lucide-react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';

const DEFAULT_MERMAID = `graph TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[Car]`;

type ThemeId = 'zinc' | 'blue' | 'emerald' | 'violet' | 'orange';

const THEMES: Record<ThemeId, any> = {
  zinc: {
    name: 'Graphite',
    dot: 'bg-zinc-500',
    mermaid: {
      light: { fg: '#18181b', line: '#a1a1aa', border: '#d4d4d8', surface: '#ffffff', accent: '#000000' },
      dark: { fg: '#f4f4f5', line: '#52525b', border: '#3f3f46', surface: '#18181b', accent: '#ffffff' },
    },
    ui: {
      appBg: 'bg-zinc-100 dark:bg-zinc-900',
      appText: 'text-zinc-900 dark:text-zinc-100',
      selection: 'selection:bg-zinc-300 dark:selection:bg-zinc-700',
      panelBg: 'bg-white dark:bg-zinc-950',
      panelBorder: 'border-zinc-200 dark:border-zinc-800',
      iconBg: 'bg-zinc-900 dark:bg-zinc-100',
      iconText: 'text-white dark:text-zinc-900',
      resizeHandle: 'bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-400 dark:hover:bg-zinc-600',
      previewBg: 'bg-zinc-50 dark:bg-zinc-900',
      previewHeaderBg: 'bg-white dark:bg-zinc-950',
      previewTitle: 'text-zinc-500 dark:text-zinc-400',
      btnSecondary: 'text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600',
      btnPrimary: 'text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white',
      editorLineNum: 'text-zinc-400 dark:text-zinc-600 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800',
      editorText: 'text-zinc-800 dark:text-zinc-200',
    }
  },
  blue: {
    name: 'Ocean',
    dot: 'bg-blue-500',
    mermaid: {
      light: { fg: '#1e3a8a', line: '#93c5fd', border: '#bfdbfe', surface: '#ffffff', accent: '#2563eb' },
      dark: { fg: '#eff6ff', line: '#3b82f6', border: '#1e40af', surface: '#0f172a', accent: '#60a5fa' },
    },
    ui: {
      appBg: 'bg-slate-100 dark:bg-slate-900',
      appText: 'text-slate-900 dark:text-slate-100',
      selection: 'selection:bg-blue-200 dark:selection:bg-blue-900',
      panelBg: 'bg-white dark:bg-slate-950',
      panelBorder: 'border-blue-200 dark:border-blue-900',
      iconBg: 'bg-blue-600 dark:bg-blue-500',
      iconText: 'text-white dark:text-white',
      resizeHandle: 'bg-blue-200 dark:bg-blue-800 hover:bg-blue-400 dark:hover:bg-blue-600',
      previewBg: 'bg-slate-50 dark:bg-slate-900',
      previewHeaderBg: 'bg-white dark:bg-slate-950',
      previewTitle: 'text-blue-600 dark:text-blue-400',
      btnSecondary: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/50 hover:border-blue-300 dark:hover:border-blue-700',
      btnPrimary: 'text-white bg-blue-600 dark:bg-blue-500 dark:text-white hover:bg-blue-700 dark:hover:bg-blue-400',
      editorLineNum: 'text-blue-400 dark:text-blue-600 bg-slate-50 dark:bg-slate-900/50 border-blue-200 dark:border-blue-900',
      editorText: 'text-slate-800 dark:text-slate-200',
    }
  },
  emerald: {
    name: 'Forest',
    dot: 'bg-emerald-500',
    mermaid: {
      light: { fg: '#064e3b', line: '#6ee7b7', border: '#a7f3d0', surface: '#ffffff', accent: '#059669' },
      dark: { fg: '#ecfdf5', line: '#10b981', border: '#065f46', surface: '#022c22', accent: '#34d399' },
    },
    ui: {
      appBg: 'bg-stone-100 dark:bg-stone-900',
      appText: 'text-stone-900 dark:text-stone-100',
      selection: 'selection:bg-emerald-200 dark:selection:bg-emerald-900',
      panelBg: 'bg-white dark:bg-stone-950',
      panelBorder: 'border-emerald-200 dark:border-emerald-900',
      iconBg: 'bg-emerald-600 dark:bg-emerald-500',
      iconText: 'text-white dark:text-white',
      resizeHandle: 'bg-emerald-200 dark:bg-emerald-800 hover:bg-emerald-400 dark:hover:bg-emerald-600',
      previewBg: 'bg-stone-50 dark:bg-stone-900',
      previewHeaderBg: 'bg-white dark:bg-stone-950',
      previewTitle: 'text-emerald-600 dark:text-emerald-400',
      btnSecondary: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-700',
      btnPrimary: 'text-white bg-emerald-600 dark:bg-emerald-500 dark:text-white hover:bg-emerald-700 dark:hover:bg-emerald-400',
      editorLineNum: 'text-emerald-400 dark:text-emerald-600 bg-stone-50 dark:bg-stone-900/50 border-emerald-200 dark:border-emerald-900',
      editorText: 'text-stone-800 dark:text-stone-200',
    }
  },
  violet: {
    name: 'Lavender',
    dot: 'bg-violet-500',
    mermaid: {
      light: { fg: '#4c1d95', line: '#c4b5fd', border: '#ddd6fe', surface: '#ffffff', accent: '#7c3aed' },
      dark: { fg: '#f5f3ff', line: '#8b5cf6', border: '#4c1d95', surface: '#1e1b4b', accent: '#a78bfa' },
    },
    ui: {
      appBg: 'bg-neutral-100 dark:bg-neutral-900',
      appText: 'text-neutral-900 dark:text-neutral-100',
      selection: 'selection:bg-violet-200 dark:selection:bg-violet-900',
      panelBg: 'bg-white dark:bg-neutral-950',
      panelBorder: 'border-violet-200 dark:border-violet-900',
      iconBg: 'bg-violet-600 dark:bg-violet-500',
      iconText: 'text-white dark:text-white',
      resizeHandle: 'bg-violet-200 dark:bg-violet-800 hover:bg-violet-400 dark:hover:bg-violet-600',
      previewBg: 'bg-neutral-50 dark:bg-neutral-900',
      previewHeaderBg: 'bg-white dark:bg-neutral-950',
      previewTitle: 'text-violet-600 dark:text-violet-400',
      btnSecondary: 'text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/50 hover:border-violet-300 dark:hover:border-violet-700',
      btnPrimary: 'text-white bg-violet-600 dark:bg-violet-500 dark:text-white hover:bg-violet-700 dark:hover:bg-violet-400',
      editorLineNum: 'text-violet-400 dark:text-violet-600 bg-neutral-50 dark:bg-neutral-900/50 border-violet-200 dark:border-violet-900',
      editorText: 'text-neutral-800 dark:text-neutral-200',
    }
  },
  orange: {
    name: 'Sunset',
    dot: 'bg-orange-500',
    mermaid: {
      light: { fg: '#7c2d12', line: '#fdba74', border: '#fed7aa', surface: '#ffffff', accent: '#ea580c' },
      dark: { fg: '#fff7ed', line: '#f97316', border: '#9a3412', surface: '#431407', accent: '#fb923c' },
    },
    ui: {
      appBg: 'bg-orange-50 dark:bg-stone-900',
      appText: 'text-stone-900 dark:text-stone-100',
      selection: 'selection:bg-orange-200 dark:selection:bg-orange-900',
      panelBg: 'bg-white dark:bg-stone-950',
      panelBorder: 'border-orange-200 dark:border-orange-900',
      iconBg: 'bg-orange-600 dark:bg-orange-500',
      iconText: 'text-white dark:text-white',
      resizeHandle: 'bg-orange-200 dark:bg-orange-800 hover:bg-orange-400 dark:hover:bg-orange-600',
      previewBg: 'bg-orange-50/50 dark:bg-stone-900',
      previewHeaderBg: 'bg-white dark:bg-stone-950',
      previewTitle: 'text-orange-600 dark:text-orange-400',
      btnSecondary: 'text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/50 hover:border-orange-300 dark:hover:border-orange-700',
      btnPrimary: 'text-white bg-orange-600 dark:bg-orange-500 dark:text-white hover:bg-orange-700 dark:hover:bg-orange-400',
      editorLineNum: 'text-orange-400 dark:text-orange-600 bg-orange-50/50 dark:bg-stone-900/50 border-orange-200 dark:border-orange-900',
      editorText: 'text-stone-800 dark:text-stone-200',
    }
  }
};

export default function App() {
  const [code, setCode] = useState(DEFAULT_MERMAID);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [themeId, setThemeId] = useState<ThemeId>('zinc');
  const [diagramTheme, setDiagramTheme] = useState<string>('auto');
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
    if (!code.trim()) {
      setSvgContent('');
      setError(null);
      return;
    }

    try {
      const currentTheme = diagramTheme === 'auto' 
        ? THEMES[themeId].mermaid[isDark ? 'dark' : 'light']
        : BM_THEMES[diagramTheme];
        
      const svg = renderMermaidSVG(code, {
        transparent: true,
        bg: 'transparent',
        fg: currentTheme.fg,
        line: currentTheme.line,
        border: currentTheme.border,
        surface: currentTheme.surface,
        accent: currentTheme.accent,
        font: 'ui-sans-serif, system-ui, sans-serif'
      });
      setSvgContent(svg);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to render diagram');
    }
  }, [code, isDark, themeId, diagramTheme]);

  const handleCopyPNG = async () => {
    if (!svgContent) return;
    try {
      const currentTheme = diagramTheme === 'auto' 
        ? THEMES[themeId].mermaid[isDark ? 'dark' : 'light']
        : BM_THEMES[diagramTheme];
        
      const blob = await svgToPng(svgContent, 3, isDark, currentTheme);
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
      const currentTheme = diagramTheme === 'auto' 
        ? THEMES[themeId].mermaid[isDark ? 'dark' : 'light']
        : BM_THEMES[diagramTheme];
        
      const blob = await svgToPng(svgContent, 3, isDark, currentTheme);
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

  const activeTheme = THEMES[themeId];

  return (
    <div className={`h-screen w-screen flex flex-col ${activeTheme.ui.appBg} ${activeTheme.ui.appText} overflow-hidden font-sans ${activeTheme.ui.selection} transition-colors duration-300`}>
      <PanelGroup orientation={isMobile ? "vertical" : "horizontal"}>
        
        {/* Editor Panel */}
        <Panel defaultSize={40} minSize={20} className={`flex flex-col ${activeTheme.ui.panelBg} relative z-10 shadow-xl shadow-black/5 dark:shadow-black/50 transition-colors duration-300`}>
          <div className={`h-14 border-b ${activeTheme.ui.panelBorder} flex items-center px-5 justify-between shrink-0 transition-colors duration-300`}>
            <div className="flex items-center gap-3 font-semibold text-sm tracking-tight">
              <div className={`w-7 h-7 rounded-md ${activeTheme.ui.iconBg} ${activeTheme.ui.iconText} flex items-center justify-center shadow-sm transition-colors duration-300`}>
                <Code size={16} strokeWidth={2.5} />
              </div>
              Graphite
            </div>
            <div className="flex items-center gap-1">
              {Object.entries(THEMES).map(([id, theme]) => (
                <button
                  key={id}
                  onClick={() => setThemeId(id as ThemeId)}
                  className={`w-5 h-5 rounded-full ${theme.dot} border-2 ${themeId === id ? 'border-zinc-900 dark:border-white scale-110' : 'border-transparent hover:scale-110'} transition-all shadow-sm`}
                  title={theme.name}
                />
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <Editor code={code} setCode={setCode} theme={activeTheme} />
          </div>
        </Panel>
        
        {/* Resize Handle */}
        <PanelResizeHandle className={`w-1.5 h-1.5 md:w-1.5 md:h-auto ${activeTheme.ui.resizeHandle} transition-colors z-20`} />
        
        {/* Preview Panel */}
        <Panel minSize={30} className={`flex flex-col ${activeTheme.ui.previewBg} relative z-0 transition-colors duration-300`}>
          <div className={`h-14 border-b ${activeTheme.ui.panelBorder} flex items-center px-5 justify-between shrink-0 ${activeTheme.ui.previewHeaderBg} transition-colors duration-300`}>
            <span className={`text-sm font-medium ${activeTheme.ui.previewTitle} transition-colors duration-300`}>Preview</span>
            <div className="flex items-center gap-2">
              <select 
                value={diagramTheme} 
                onChange={e => setDiagramTheme(e.target.value)}
                className={`text-xs px-2 py-1.5 rounded-md border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 outline-none cursor-pointer transition-all ${activeTheme.ui.btnSecondary}`}
              >
                <option value="auto">Auto (Matches UI)</option>
                {Object.keys(BM_THEMES).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <button
                onClick={handleCopyPNG}
                disabled={!svgContent}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-transparent rounded-md transition-all disabled:opacity-50 ${activeTheme.ui.btnSecondary}`}
              >
                {copied ? <Check size={14} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleExportPNG}
                disabled={!svgContent}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all disabled:opacity-50 shadow-sm ${activeTheme.ui.btnPrimary}`}
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
              {!code.trim() ? (
                <div className="flex flex-col items-center justify-center text-center max-w-sm opacity-80">
                  <div className={`w-16 h-16 mb-6 rounded-2xl ${activeTheme.ui.iconBg} ${activeTheme.ui.iconText} flex items-center justify-center shadow-sm opacity-80`}>
                    <Palette size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Select a Theme</h3>
                  <p className="text-sm mb-8 opacity-80">Choose a color theme below, then start typing Mermaid syntax in the editor to see your diagram.</p>
                  
                  <div className="flex flex-wrap items-center justify-center gap-3 p-4 rounded-xl bg-black/5 dark:bg-white/5">
                    {Object.entries(THEMES).map(([id, theme]) => (
                      <button
                        key={id}
                        onClick={() => setThemeId(id as ThemeId)}
                        className={`w-8 h-8 rounded-full ${theme.dot} border-2 ${themeId === id ? 'border-zinc-900 dark:border-white scale-110 shadow-md' : 'border-transparent hover:scale-110 opacity-70 hover:opacity-100'} transition-all`}
                        title={theme.name}
                      />
                    ))}
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 px-6 py-5 rounded-xl shadow-sm max-w-lg w-full z-10 flex gap-4 items-start">
                  <AlertCircle className="shrink-0 mt-0.5" size={18} />
                  <div>
                    <h3 className="font-semibold mb-1 text-sm">Syntax Error</h3>
                    <p className="text-xs font-mono whitespace-pre-wrap break-words opacity-80 leading-relaxed">{error}</p>
                  </div>
                </div>
              ) : (
                <div 
                  className={`${activeTheme.ui.panelBg} ${activeTheme.ui.panelBorder} shadow-xl shadow-black/5 dark:shadow-black/50 border rounded-2xl p-10 transition-all duration-300 ease-in-out z-10 flex items-center justify-center`}
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
function Editor({ code, setCode, theme }: { code: string, setCode: (c: string) => void, theme: any }) {
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
    <div className={`flex h-full w-full ${theme.ui.panelBg} font-mono text-[13px] overflow-hidden transition-colors duration-300`}>
      <div 
        ref={lineRef} 
        className={`w-12 flex-shrink-0 text-right pr-3 py-5 select-none overflow-hidden border-r ${theme.ui.editorLineNum} transition-colors duration-300`}
      >
        {lines.map((_, i) => <div key={i} className="leading-6">{i + 1}</div>)}
      </div>
      <textarea
        ref={textRef}
        value={code}
        onChange={e => setCode(e.target.value)}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        className={`flex-1 p-5 leading-6 bg-transparent resize-none outline-none ${theme.ui.editorText} whitespace-pre transition-colors duration-300`}
        spellCheck={false}
        wrap="off"
        placeholder="Enter Mermaid syntax..."
      />
    </div>
  );
}

// Export Utility
async function svgToPng(svgString: string, scale: number = 2, isDark: boolean, currentTheme: any): Promise<Blob> {
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
      
      ctx.fillStyle = currentTheme.surface || (isDark ? '#18181b' : '#ffffff');
      ctx.fill();
      
      // Draw border
      ctx.lineWidth = borderWidth;
      ctx.strokeStyle = currentTheme.border || (isDark ? '#3f3f46' : '#d4d4d8');
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

