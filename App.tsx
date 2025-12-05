import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Download, 
  Trash2, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Undo, 
  Redo, 
  Grid,
  Move,
  Layers,
  MousePointer2,
  ChevronDown,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  AlignStartHorizontal,
  AlignCenterHorizontal,
  AlignEndHorizontal,
  ArrowRight,
  Search,
  Settings,
  User,
  Users,
  Calendar,
  FileText,
  BarChart,
  CircleDot,
  GripHorizontal,
  GripVertical,
  Copy,
  CircleUser
} from 'lucide-react';
import { COMPONENT_LIBRARY, DEFAULT_STYLE, getIconSvg } from './constants';
import { CanvasElement, ComponentItem, ElementType } from './types';

// --- Helper Components ---

const Button: React.FC<{ 
  onClick?: () => void; 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  className?: string;
  disabled?: boolean;
  title?: string;
}> = ({ onClick, children, variant = 'secondary', className = '', disabled = false, title }) => {
  const baseStyles = "px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 justify-center";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50",
    secondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50",
    danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 disabled:opacity-50",
    ghost: "text-slate-600 hover:bg-slate-100 disabled:opacity-30"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      title={title}
    >
      {children}
    </button>
  );
};

// --- Icons Map for Renderer ---
const ICON_MAP: Record<string, React.ElementType> = {
  Search, Settings, User, Users, Calendar, FileText, BarChart, ArrowRight, Trash2
};

// --- Main App ---

export default function App() {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [clipboard, setClipboard] = useState<CanvasElement[]>([]);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 600 });
  const [history, setHistory] = useState<CanvasElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showGrid, setShowGrid] = useState(true);
  
  // Refs for accessing state in event handlers
  const selectedIdsRef = useRef(selectedIds);
  
  // Selection Box State
  const [selectionBox, setSelectionBox] = useState<{startX: number, startY: number, currentX: number, currentY: number} | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const dragItemRef = useRef<ComponentItem | null>(null);

  // Sync ref with state
  useEffect(() => {
    selectedIdsRef.current = selectedIds;
  }, [selectedIds]);

  // --- History Management ---
  const pushHistory = useCallback((newElements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
      setSelectedIds([]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
      setSelectedIds([]);
    }
  };

  // Initial History
  useEffect(() => {
    if (history.length === 0) {
      pushHistory([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Keyboard Shortcuts (Copy/Paste/Delete) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Copy: Ctrl+C
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        handleCopy();
      }
      // Paste: Ctrl+V
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        handlePaste();
      }
      // Delete: Backspace/Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Only delete if not editing text
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
           deleteElement();
        }
      }
      // Select All: Ctrl+A
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        setSelectedIds(elements.map(e => e.id));
      }
      // Undo: Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [elements, selectedIds, clipboard, historyIndex, history]);

  // --- Actions ---

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    if (dragItemRef.current) {
      // Dropping a new component from sidebar
      const item = dragItemRef.current;
      const newElement: CanvasElement = {
        id: crypto.randomUUID(),
        type: item.type,
        name: item.label,
        x: e.clientX - canvasRect.left - (item.defaultWidth / 2),
        y: e.clientY - canvasRect.top - (item.defaultHeight / 2),
        w: item.defaultWidth,
        h: item.defaultHeight,
        content: item.defaultContent,
        style: { ...DEFAULT_STYLE, ...item.defaultStyle },
        zIndex: elements.length + 1,
        iconName: item.iconName,
      };
      
      const nextElements = [...elements, newElement];
      setElements(nextElements);
      pushHistory(nextElements);
      setSelectedIds([newElement.id]);
      dragItemRef.current = null;
    }
  };

  const updateElement = (id: string, updates: Partial<CanvasElement> | { style: Partial<CanvasElement['style']> }) => {
    setElements(prev => prev.map(el => {
      if (el.id === id) {
        if ('style' in updates) {
          return { ...el, style: { ...el.style, ...updates.style } };
        }
        return { ...el, ...updates };
      }
      return el;
    }));
  };

  const updateSelectedElements = (updates: Partial<CanvasElement> | { style: Partial<CanvasElement['style']> }) => {
     setElements(prev => prev.map(el => {
      if (selectedIds.includes(el.id)) {
        if ('style' in updates) {
          return { ...el, style: { ...el.style, ...updates.style } };
        }
        return { ...el, ...updates };
      }
      return el;
    }));
  };

  // Move all selected elements by a delta
  const moveSelectedElements = (dx: number, dy: number) => {
    setElements(prev => prev.map(el => {
      if (selectedIdsRef.current.includes(el.id)) {
        return { ...el, x: el.x + dx, y: el.y + dy };
      }
      return el;
    }));
  };

  const deleteElement = () => {
    if (selectedIds.length > 0) {
      const nextElements = elements.filter(el => !selectedIds.includes(el.id));
      setElements(nextElements);
      pushHistory(nextElements);
      setSelectedIds([]);
    }
  };

  const handleCopy = () => {
    const selected = elements.filter(el => selectedIds.includes(el.id));
    if (selected.length > 0) {
      setClipboard(selected);
    }
  };

  const handlePaste = () => {
    if (clipboard.length > 0) {
      const newIds: string[] = [];
      const newElements = clipboard.map(el => {
        const newId = crypto.randomUUID();
        newIds.push(newId);
        return {
          ...el,
          id: newId,
          x: el.x + 20, // Offset pasted elements
          y: el.y + 20,
          zIndex: Math.max(...elements.map(e => e.zIndex), 0) + 1
        };
      });
      
      const nextElements = [...elements, ...newElements];
      setElements(nextElements);
      pushHistory(nextElements);
      setSelectedIds(newIds);
    }
  };

  const handleSelect = (id: string, multi: boolean) => {
    let newIds: string[];
    if (multi) {
      newIds = selectedIds.includes(id) 
        ? selectedIds.filter(i => i !== id) 
        : [...selectedIds, id];
    } else {
      // If clicking on an item that is part of a selection, keep the selection (allows dragging group)
      if (selectedIds.includes(id)) {
        newIds = selectedIds;
      } else {
        newIds = [id];
      }
    }
    setSelectedIds(newIds);
    selectedIdsRef.current = newIds; // Update ref immediately for drag handlers
  };

  // --- Alignment & Distribution ---

  const alignElements = (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (selectedIds.length < 2) return;
    
    const selectedEls = elements.filter(el => selectedIds.includes(el.id));
    let val: number;
    
    // Calculate reference value
    switch(type) {
      case 'left': val = Math.min(...selectedEls.map(e => e.x)); break;
      case 'center': {
        const minX = Math.min(...selectedEls.map(e => e.x));
        const maxX = Math.max(...selectedEls.map(e => e.x + e.w));
        val = (minX + maxX) / 2;
        break;
      }
      case 'right': val = Math.max(...selectedEls.map(e => e.x + e.w)); break;
      case 'top': val = Math.min(...selectedEls.map(e => e.y)); break;
      case 'middle': {
        const minY = Math.min(...selectedEls.map(e => e.y));
        const maxY = Math.max(...selectedEls.map(e => e.y + e.h));
        val = (minY + maxY) / 2;
        break;
      }
      case 'bottom': val = Math.max(...selectedEls.map(e => e.y + e.h)); break;
    }

    const nextElements = elements.map(el => {
      if (!selectedIds.includes(el.id)) return el;
      
      const newEl = { ...el };
      switch(type) {
        case 'left': newEl.x = val; break;
        case 'center': newEl.x = val - (el.w / 2); break;
        case 'right': newEl.x = val - el.w; break;
        case 'top': newEl.y = val; break;
        case 'middle': newEl.y = val - (el.h / 2); break;
        case 'bottom': newEl.y = val - el.h; break;
      }
      return newEl;
    });

    setElements(nextElements);
    pushHistory(nextElements);
  };

  const distributeElements = (type: 'horizontal' | 'vertical') => {
    if (selectedIds.length < 3) return;
    
    // Sort selected elements by position
    const selectedEls = elements.filter(el => selectedIds.includes(el.id));
    const sortedEls = [...selectedEls].sort((a, b) => type === 'horizontal' ? a.x - b.x : a.y - b.y);
    
    const first = sortedEls[0];
    const last = sortedEls[sortedEls.length - 1];
    
    const totalSpace = type === 'horizontal' 
      ? (last.x + last.w) - first.x 
      : (last.y + last.h) - first.y;
    
    const totalItemSize = sortedEls.reduce((sum, el) => sum + (type === 'horizontal' ? el.w : el.h), 0);
    // Simple distribution of centers
    const startPos = type === 'horizontal' ? first.x : first.y;
    const endPos = type === 'horizontal' ? last.x : last.y;
    const totalSpan = endPos - startPos;
    const step = totalSpan / (sortedEls.length - 1);

    const updates = new Map();
    sortedEls.forEach((el, index) => {
      const newPos = startPos + (step * index);
      updates.set(el.id, newPos);
    });

    const nextElements = elements.map(el => {
      if (!updates.has(el.id)) return el;
      return { 
        ...el, 
        [type === 'horizontal' ? 'x' : 'y']: updates.get(el.id) 
      };
    });

    setElements(nextElements);
    pushHistory(nextElements);
  };

  // --- Export ---

  const exportHtml = () => {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>PrototyperX Export</title>
  <style>
    body { margin: 0; display: flex; justify-content: center; background: #f0f2f5; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .canvas { position: relative; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; margin-top: 20px; }
    .element { position: absolute; box-sizing: border-box; display: flex; align-items: center; justify-content: center; overflow: hidden; }
  </style>
</head>
<body>
  <div class="canvas" style="width: ${canvasSize.w}px; height: ${canvasSize.h}px;">
    ${elements.sort((a,b) => a.zIndex - b.zIndex).map(el => {
      const styleStr = Object.entries(el.style).map(([k, v]) => {
        const key = k.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
        const val = typeof v === 'number' && key !== 'opacity' && key !== 'font-weight' ? `${v}px` : v;
        return `${key}: ${val}`;
      }).join('; ');
      
      const shadowStyle = el.style.shadow ? 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);' : '';
      
      let contentHtml = el.content;
      
      // Element Rendering Logic for HTML Export
      if (el.type === 'image') {
        contentHtml = `<img src="https://picsum.photos/${el.w}/${el.h}" style="width:100%;height:100%;object-fit:cover;" />`;
      }
      else if (el.type === 'input') {
        contentHtml = `<input type="text" placeholder="${el.content}" style="width:100%;height:100%;border:none;background:transparent;outline:none;" />`;
      }
      else if (el.type === 'checkbox') {
        contentHtml = `<input type="checkbox" checked style="transform: scale(1.5);" />`;
      }
      else if (el.type === 'radio') {
        contentHtml = `<input type="radio" checked style="transform: scale(1.5);" />`;
      }
      else if (el.type === 'select') {
        contentHtml = `<select style="width:100%;height:100%;border:none;background:transparent;"><option>${el.content}</option></select>`;
      }
      else if (el.type === 'switch') {
        contentHtml = `<div style="width:100%;height:100%;border-radius:99px;background-color:${el.style.backgroundColor};position:relative;"><div style="position:absolute;top:2px;bottom:2px;left:2px;aspect-ratio:1;background:white;border-radius:50%;"></div></div>`;
      }
      else if (el.type === 'slider') {
        contentHtml = `<div style="width:100%;height:100%;display:flex;align-items:center;"><div style="width:100%;height:4px;background:#e2e8f0;border-radius:2px;position:relative;"><div style="width:50%;height:100%;background:${el.style.color};border-radius:2px;"></div><div style="width:16px;height:16px;background:white;border:2px solid ${el.style.color};border-radius:50%;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);"></div></div></div>`;
      }
      else if (el.type === 'progress') {
        contentHtml = `<div style="width:100%;height:100%;background:${el.style.backgroundColor};border-radius:${el.style.borderRadius}px;overflow:hidden;"><div style="width:60%;height:100%;background:${el.style.color};"></div></div>`;
      }
      else if (el.type === 'avatar') {
        contentHtml = `<div style="width:100%;height:100%;background:${el.style.backgroundColor};border-radius:50%;display:flex;align-items:center;justify-content:center;color:#64748b;"><svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>`;
      }
      else if (el.type === 'badge') {
         // contentHtml already set to el.content, just element styling handles the rest
      }
      else if (el.type === 'icon' && el.iconName) {
        contentHtml = getIconSvg(el.iconName, el.style.color);
      }
      else if (el.type === 'line') {
        contentHtml = '';
      }

      return `<div class="element" style="left: ${el.x}px; top: ${el.y}px; width: ${el.w}px; height: ${el.h}px; z-index: ${el.zIndex}; ${styleStr}; ${shadowStyle}">${contentHtml}</div>`;
    }).join('\n    ')}
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prototype.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Interaction Logic ---

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Start Box Selection
    if (e.target === canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setSelectionBox({ startX: x, startY: y, currentX: x, currentY: y });
      
      if (!e.shiftKey) {
        setSelectedIds([]);
        selectedIdsRef.current = [];
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (selectionBox) {
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setSelectionBox(prev => prev ? { ...prev, currentX: x, currentY: y } : null);
    }
  };

  const handleCanvasMouseUp = () => {
    if (selectionBox) {
      // Calculate selected elements inside the box
      const x1 = Math.min(selectionBox.startX, selectionBox.currentX);
      const x2 = Math.max(selectionBox.startX, selectionBox.currentX);
      const y1 = Math.min(selectionBox.startY, selectionBox.currentY);
      const y2 = Math.max(selectionBox.startY, selectionBox.currentY);
      
      // If tiny movement, it's just a click, ignore box logic (cleared selection above)
      if (Math.abs(x2 - x1) > 2 || Math.abs(y2 - y1) > 2) {
        const newSelected = elements.filter(el => {
          return el.x < x2 && (el.x + el.w) > x1 && el.y < y2 && (el.y + el.h) > y1;
        }).map(el => el.id);
        
        // If shift, append. Else set.
        // Actually since we cleared above if not shift, just append logic is fine if unique
        setSelectedIds(prev => {
            const next = [...new Set([...prev, ...newSelected])];
            selectedIdsRef.current = next;
            return next;
        });
      }
      
      setSelectionBox(null);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden text-slate-800" onMouseMove={handleCanvasMouseMove} onMouseUp={handleCanvasMouseUp}>
      
      {/* Header / Toolbar */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
            <Layers className="w-6 h-6" />
            <span>PrototyperX</span>
          </div>
          <div className="h-6 w-px bg-slate-200 mx-2"></div>
          <div className="flex gap-1">
             <Button onClick={() => setCanvasSize({ w: 375, h: 812 })} variant="ghost" className="hidden md:flex" title="Mobile">
              <Smartphone size={16} />
            </Button>
            <Button onClick={() => setCanvasSize({ w: 768, h: 1024 })} variant="ghost" className="hidden md:flex" title="Tablet">
              <Tablet size={16} />
            </Button>
            <Button onClick={() => setCanvasSize({ w: 1280, h: 800 })} variant="ghost" className="hidden md:flex" title="Desktop">
              <Monitor size={16} />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => setShowGrid(!showGrid)} variant="ghost" title="Toggle Grid">
            <Grid size={16} />
          </Button>
          <div className="flex bg-slate-100 rounded-md p-0.5">
            <Button onClick={undo} disabled={historyIndex <= 0} variant="ghost" className="h-8 w-8 p-0 justify-center">
              <Undo size={16} />
            </Button>
            <Button onClick={redo} disabled={historyIndex >= history.length - 1} variant="ghost" className="h-8 w-8 p-0 justify-center">
              <Redo size={16} />
            </Button>
          </div>
           <Button onClick={handleCopy} disabled={selectedIds.length === 0} variant="secondary" title="Copy (Ctrl+C)">
            <Copy size={16} />
          </Button>
          <Button onClick={deleteElement} disabled={selectedIds.length === 0} variant="danger" title="Delete (Del)">
            <Trash2 size={16} />
          </Button>
          <Button onClick={exportHtml} variant="primary">
            <Download size={16} /> <span className="hidden sm:inline">Export HTML</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar: Components (Expanded) */}
        <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10">
          <div className="p-4 border-b border-slate-100 font-semibold text-slate-700 bg-slate-50">
            Components
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
            {COMPONENT_LIBRARY.map((category) => (
              <div key={category.name}>
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{category.name}</h3>
                 <div className="grid grid-cols-4 gap-2">
                   {category.items.map((item, idx) => (
                      <div
                        key={item.label + idx}
                        draggable
                        onDragStart={(e) => {
                          dragItemRef.current = item;
                          e.dataTransfer.effectAllowed = 'copy';
                        }}
                        className="flex flex-col items-center justify-center p-1.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-600 transition-all cursor-grab active:cursor-grabbing text-slate-500 group"
                        title={item.label}
                      >
                        <div className="mb-1">{React.cloneElement(item.icon as React.ReactElement<any>, { size: 18 })}</div>
                        <span className="text-[9px] font-medium text-center leading-tight">{item.label}</span>
                      </div>
                   ))}
                 </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center: Canvas Area */}
        <main className="flex-1 bg-slate-100 overflow-auto relative flex items-center justify-center p-8 select-none">
          <div 
            ref={canvasRef}
            onDrop={handleDrop}
            onDragOver={handleCanvasDragOver}
            onMouseDown={handleCanvasMouseDown}
            style={{ 
              width: canvasSize.w, 
              height: canvasSize.h,
              backgroundImage: showGrid ? 'radial-gradient(#cbd5e1 1px, transparent 1px)' : 'none',
              backgroundSize: '20px 20px'
            }}
            className="bg-white shadow-xl relative transition-all duration-300 ring-1 ring-slate-900/5"
          >
            {elements.map((el) => (
              <DraggableElement
                key={el.id}
                element={el}
                isSelected={selectedIds.includes(el.id)}
                onSelect={(id, e) => {
                  e.stopPropagation();
                  handleSelect(id, e.shiftKey);
                }}
                onMove={(dx, dy) => moveSelectedElements(dx, dy)}
                onResize={(id, updates) => updateElement(id, updates)}
                onDragEnd={() => pushHistory([...elements])}
              />
            ))}

            {/* Selection Box Visual */}
            {selectionBox && (
              <div 
                className="absolute bg-blue-500/10 border border-blue-500 pointer-events-none z-50"
                style={{
                  left: Math.min(selectionBox.startX, selectionBox.currentX),
                  top: Math.min(selectionBox.startY, selectionBox.currentY),
                  width: Math.abs(selectionBox.currentX - selectionBox.startX),
                  height: Math.abs(selectionBox.currentY - selectionBox.startY),
                }}
              />
            )}
          </div>
        </main>

        {/* Right Sidebar: Properties */}
        <aside className="w-72 bg-white border-l border-slate-200 flex flex-col shrink-0 z-10 overflow-hidden">
           <div className="p-4 border-b border-slate-100 font-semibold text-slate-700 bg-slate-50 flex justify-between items-center">
            <span>Properties</span>
            <span className="text-xs font-normal text-slate-400">v1.3</span>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {selectedIds.length === 1 ? (
              <PropertiesPanel 
                element={elements.find(e => e.id === selectedIds[0])!} 
                onChange={(updates) => updateElement(selectedIds[0], updates)}
                onHistoryPush={() => pushHistory(elements)}
              />
            ) : selectedIds.length > 1 ? (
              <div className="p-4 space-y-6">
                <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-medium text-slate-700">{selectedIds.length} items selected</div>
                </div>

                {/* Alignment Tools */}
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Align</label>
                   <div className="grid grid-cols-3 gap-1 mb-2">
                      <Button onClick={() => alignElements('left')} title="Align Left"><AlignStartVertical size={16}/></Button>
                      <Button onClick={() => alignElements('center')} title="Align Center"><AlignCenterVertical size={16}/></Button>
                      <Button onClick={() => alignElements('right')} title="Align Right"><AlignEndVertical size={16}/></Button>
                   </div>
                   <div className="grid grid-cols-3 gap-1">
                      <Button onClick={() => alignElements('top')} title="Align Top"><AlignStartHorizontal size={16}/></Button>
                      <Button onClick={() => alignElements('middle')} title="Align Middle"><AlignCenterHorizontal size={16}/></Button>
                      <Button onClick={() => alignElements('bottom')} title="Align Bottom"><AlignEndHorizontal size={16}/></Button>
                   </div>
                </div>

                {/* Distribution Tools */}
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Distribute</label>
                   <div className="grid grid-cols-2 gap-1">
                      <Button onClick={() => distributeElements('horizontal')} title="Distribute Horizontally" disabled={selectedIds.length < 3}><GripHorizontal size={16}/></Button>
                      <Button onClick={() => distributeElements('vertical')} title="Distribute Vertically" disabled={selectedIds.length < 3}><GripVertical size={16}/></Button>
                   </div>
                </div>

                {/* Bulk Style Edit */}
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Bulk Edit</label>
                   <div className="space-y-3">
                      <div>
                        <label className="text-xs text-slate-600 block mb-1">Background</label>
                         <div className="flex gap-2 items-center">
                            <input type="color" className="h-8 w-8 rounded cursor-pointer border-0 p-0" onChange={(e) => updateSelectedElements({ style: { backgroundColor: e.target.value } })} />
                            <span className="text-xs text-slate-400">Pick color</span>
                         </div>
                      </div>
                      <div>
                        <label className="text-xs text-slate-600 block mb-1">Text Color</label>
                         <div className="flex gap-2 items-center">
                            <input type="color" className="h-8 w-8 rounded cursor-pointer border-0 p-0" onChange={(e) => updateSelectedElements({ style: { color: e.target.value } })} />
                            <span className="text-xs text-slate-400">Pick color</span>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
                <MousePointer2 className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">Select an element to edit properties.<br/>Drag to select multiple.</p>
              </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
}

// --- Sub-components ---

const DraggableElement: React.FC<{
  element: CanvasElement;
  isSelected: boolean;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onMove: (dx: number, dy: number) => void;
  onResize: (id: string, updates: Partial<CanvasElement>) => void;
  onDragEnd: () => void;
}> = ({ element, isSelected, onSelect, onMove, onResize, onDragEnd }) => {
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    e.stopPropagation(); 
    e.preventDefault(); // Prevent native drag/select
    onSelect(element.id, e);
    
    const startX = e.clientX;
    const startY = e.clientY;

    let lastX = startX;
    let lastY = startY;

    const onMouseMoveDelta = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - lastX;
      const dy = moveEvent.clientY - lastY;
      lastX = moveEvent.clientX;
      lastY = moveEvent.clientY;
      onMove(dx, dy);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMoveDelta);
      document.removeEventListener('mouseup', onMouseUp);
      onDragEnd();
    };

    document.addEventListener('mousemove', onMouseMoveDelta);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleResize = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent native drag
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = element.w;
    const startH = element.h;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      const newW = Math.max(8, startW + deltaX);
      const newH = Math.max(8, startH + deltaY);
      
      onResize(element.id, { w: newW, h: newH });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      onDragEnd();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // Convert style object to React.CSSProperties
  const computedStyle: React.CSSProperties = {
    backgroundColor: element.style.backgroundColor,
    color: element.style.color,
    fontSize: `${element.style.fontSize}px`,
    fontWeight: element.style.fontWeight,
    borderRadius: `${element.style.borderRadius}px`,
    borderWidth: `${element.style.borderWidth}px`,
    borderColor: element.style.borderColor,
    borderStyle: element.style.borderWidth > 0 ? 'solid' : 'none',
    padding: `${element.style.padding}px`,
    textAlign: element.style.textAlign,
    opacity: element.style.opacity,
    boxShadow: element.style.shadow ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: element.style.textAlign === 'center' ? 'center' : element.style.textAlign === 'right' ? 'flex-end' : 'flex-start',
    overflow: 'hidden',
    userSelect: 'none',
    cursor: 'move',
  };

  const renderContent = () => {
    switch (element.type) {
      case 'image':
        return (
          <div className="w-full h-full bg-slate-200 flex flex-col items-center justify-center text-slate-400">
             <img 
              src={`https://picsum.photos/${Math.floor(element.w)}/${Math.floor(element.h)}`} 
              alt="placeholder" 
              className="w-full h-full object-cover pointer-events-none"
             />
          </div>
        );
      case 'input':
        return (
          <div className="w-full h-full bg-transparent border-none outline-none text-inherit px-2 flex items-center opacity-50 pointer-events-none">
            {element.content || 'Input placeholder'}
          </div>
        );
      case 'checkbox':
        return (
          <div className="w-full h-full flex items-center justify-center pointer-events-none">
             <div className="w-5 h-5 border-2 border-current rounded flex items-center justify-center">
               <div className="w-3 h-3 bg-current rounded-sm"></div>
             </div>
          </div>
        );
      case 'radio':
        return (
          <div className="w-full h-full flex items-center justify-center pointer-events-none">
             <div className="w-5 h-5 border-2 border-current rounded-full flex items-center justify-center">
               <div className="w-2.5 h-2.5 bg-current rounded-full"></div>
             </div>
          </div>
        );
      case 'switch':
        return (
          <div className="w-full h-full rounded-full relative pointer-events-none" style={{ backgroundColor: element.style.backgroundColor }}>
             <div className="absolute top-1 bottom-1 left-1 aspect-square bg-white rounded-full shadow-sm"></div>
          </div>
        );
      case 'slider':
        return (
           <div className="w-full h-full flex items-center px-1 pointer-events-none">
             <div className="w-full h-1.5 bg-slate-200 rounded-full relative">
                <div className="absolute left-0 top-0 bottom-0 w-1/2 rounded-full" style={{ backgroundColor: element.style.color }}></div>
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white border-2 rounded-full -translate-y-1/2 -translate-x-1/2 shadow-sm" style={{ borderColor: element.style.color }}></div>
             </div>
           </div>
        );
      case 'progress':
        return (
           <div className="w-full h-full rounded-full overflow-hidden pointer-events-none" style={{ backgroundColor: element.style.backgroundColor }}>
              <div className="h-full w-3/4 rounded-full" style={{ backgroundColor: element.style.color }}></div>
           </div>
        );
       case 'avatar':
         return (
            <div className="w-full h-full rounded-full flex items-center justify-center pointer-events-none text-slate-400" style={{ backgroundColor: element.style.backgroundColor }}>
               <CircleUser className="w-3/4 h-3/4 opacity-50" strokeWidth={1.5} />
            </div>
         );
       case 'select':
        return (
          <div className="w-full h-full flex items-center justify-between px-2 pointer-events-none">
             <span>{element.content}</span>
             <ChevronDown size={14} />
          </div>
        );
       case 'icon': {
         const IconCmp = element.iconName ? ICON_MAP[element.iconName] : CircleDot;
         return <IconCmp className="w-full h-full" strokeWidth={2} />;
       }
       case 'line':
         return null; // Lines are styled via the container background/border, no content needed
      default:
        return element.content;
    }
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`absolute group hover:ring-1 hover:ring-blue-300 transition-shadow ${isSelected ? 'ring-2 ring-blue-500 z-40' : ''}`}
      style={{
        left: element.x,
        top: element.y,
        width: element.w,
        height: element.h,
        zIndex: element.zIndex,
      }}
    >
      <div style={computedStyle}>
        {renderContent()}
      </div>

      {/* Resize Handle (Bottom Right) */}
      {isSelected && (
        <div
          onMouseDown={(e) => handleResize(e, 'se')}
          className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-se-resize z-50 shadow-sm"
        />
      )}
       {/* Position Indicator (On Hover) */}
       {isSelected && (
         <div className="absolute -top-6 left-0 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-50 pointer-events-none">
            x: {Math.round(element.x)}, y: {Math.round(element.y)}
         </div>
       )}
    </div>
  );
};

const PropertiesPanel: React.FC<{
  element: CanvasElement;
  onChange: (updates: Partial<CanvasElement> | { style: Partial<CanvasElement['style']> }) => void;
  onHistoryPush: () => void;
}> = ({ element, onChange, onHistoryPush }) => {
  
  const handleStyleChange = (key: keyof CanvasElement['style'], value: any) => {
    onChange({ style: { ...element.style, [key]: value } });
  };
  
  // Logic to determine which fields to show based on type
  const isTextBased = ['text', 'button', 'heading', 'badge', 'input', 'select'].includes(element.type);
  const isColorableBg = !['line', 'icon', 'slider'].includes(element.type);
  const isColorableText = isTextBased || ['icon', 'slider', 'progress', 'badge'].includes(element.type);

  return (
    <div className="p-4 space-y-6">
      
      {/* Content Section */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Content</label>
        {isTextBased && (
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Text / Label</label>
            <textarea
              value={element.content}
              onChange={(e) => onChange({ content: e.target.value })}
              onBlur={onHistoryPush}
              rows={2}
              className="w-full text-sm border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
           <div>
            <label className="text-xs text-slate-600 block mb-1">X</label>
            <input 
              type="number" 
              value={Math.round(element.x)} 
              onChange={(e) => onChange({ x: Number(e.target.value) })}
              onBlur={onHistoryPush}
              className="w-full text-sm border border-slate-300 rounded p-1.5"
            />
          </div>
          <div>
            <label className="text-xs text-slate-600 block mb-1">Y</label>
            <input 
              type="number" 
              value={Math.round(element.y)} 
              onChange={(e) => onChange({ y: Number(e.target.value) })}
              onBlur={onHistoryPush}
              className="w-full text-sm border border-slate-300 rounded p-1.5"
            />
          </div>
          <div>
            <label className="text-xs text-slate-600 block mb-1">Width</label>
            <input 
              type="number" 
              value={Math.round(element.w)} 
              onChange={(e) => onChange({ w: Number(e.target.value) })}
              onBlur={onHistoryPush}
              className="w-full text-sm border border-slate-300 rounded p-1.5"
            />
          </div>
          <div>
            <label className="text-xs text-slate-600 block mb-1">Height</label>
            <input 
              type="number" 
              value={Math.round(element.h)} 
              onChange={(e) => onChange({ h: Number(e.target.value) })}
              onBlur={onHistoryPush}
              className="w-full text-sm border border-slate-300 rounded p-1.5"
            />
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Typography */}
      {isTextBased && (
      <>
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Typography</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600 block mb-1">Size (px)</label>
              <input 
                type="number" 
                value={element.style.fontSize} 
                onChange={(e) => handleStyleChange('fontSize', Number(e.target.value))}
                className="w-full text-sm border border-slate-300 rounded p-1.5"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 block mb-1">Weight</label>
              <select 
                value={element.style.fontWeight}
                onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                className="w-full text-sm border border-slate-300 rounded p-1.5 bg-white"
              >
                <option value="normal">Normal</option>
                <option value="500">Medium</option>
                <option value="600">SemiBold</option>
                <option value="bold">Bold</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-600 block mb-1">Align</label>
            <div className="flex border border-slate-300 rounded overflow-hidden">
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  onClick={() => handleStyleChange('textAlign', align)}
                  className={`flex-1 py-1.5 text-xs capitalize ${element.style.textAlign === align ? 'bg-slate-200 font-medium' : 'bg-white hover:bg-slate-50'}`}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>
        </div>
        <hr className="border-slate-100" />
      </>
      )}

      {/* Appearance */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Appearance</label>
        
        {isColorableBg && (
        <div>
          <label className="text-xs text-slate-600 block mb-1">
             {element.type === 'progress' ? 'Track Color' : 'Background'}
          </label>
          <div className="flex gap-2 items-center">
            <input 
              type="color" 
              value={element.style.backgroundColor}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="h-8 w-8 rounded cursor-pointer border-0 p-0"
            />
            <input 
              type="text" 
              value={element.style.backgroundColor}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="flex-1 text-sm border border-slate-300 rounded p-1.5 uppercase"
            />
          </div>
        </div>
        )}

        {isColorableText && (
        <div>
          <label className="text-xs text-slate-600 block mb-1">
             {element.type === 'slider' || element.type === 'progress' ? 'Fill/Accent' : 'Color'}
          </label>
          <div className="flex gap-2 items-center">
            <input 
              type="color" 
              value={element.style.color}
              onChange={(e) => handleStyleChange('color', e.target.value)}
              className="h-8 w-8 rounded cursor-pointer border-0 p-0"
            />
            <input 
              type="text" 
              value={element.style.color}
              onChange={(e) => handleStyleChange('color', e.target.value)}
              className="flex-1 text-sm border border-slate-300 rounded p-1.5 uppercase"
            />
          </div>
        </div>
        )}

        {element.type !== 'line' && element.type !== 'icon' && element.type !== 'switch' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-600 block mb-1">Radius (px)</label>
            <input 
              type="number" 
              value={element.style.borderRadius} 
              onChange={(e) => handleStyleChange('borderRadius', Number(e.target.value))}
              className="w-full text-sm border border-slate-300 rounded p-1.5"
            />
          </div>
          <div>
            <label className="text-xs text-slate-600 block mb-1">Border Width</label>
             <input 
              type="number" 
              value={element.style.borderWidth} 
              onChange={(e) => handleStyleChange('borderWidth', Number(e.target.value))}
              className="w-full text-sm border border-slate-300 rounded p-1.5"
            />
          </div>
        </div>
        )}
        
        {element.type !== 'line' && (
        <div className="flex items-center gap-2 mt-2">
           <input 
            type="checkbox" 
            id="shadowCheck"
            checked={element.style.shadow}
            onChange={(e) => handleStyleChange('shadow', e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
           />
           <label htmlFor="shadowCheck" className="text-sm text-slate-700">Drop Shadow</label>
        </div>
        )}
         <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-xs text-slate-600 block">Opacity</label>
            <span className="text-xs text-slate-400">{Math.round(element.style.opacity * 100)}%</span>
          </div>
          <input 
            type="range" 
            min="0" max="1" step="0.05"
            value={element.style.opacity}
            onChange={(e) => handleStyleChange('opacity', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>
      
      {/* Z-Index Control */}
      <hr className="border-slate-100" />
      <div className="flex items-center justify-between">
         <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Layer Order</label>
         <div className="flex items-center gap-1">
            <Button onClick={() => onChange({ zIndex: element.zIndex - 1 })} variant="secondary" className="px-2 py-1 text-xs">
               <Move size={12} className="rotate-180" /> Back
            </Button>
            <span className="text-xs text-slate-400 w-6 text-center">{element.zIndex}</span>
             <Button onClick={() => onChange({ zIndex: element.zIndex + 1 })} variant="secondary" className="px-2 py-1 text-xs">
               Front <Move size={12} />
            </Button>
         </div>
      </div>

    </div>
  );
};
