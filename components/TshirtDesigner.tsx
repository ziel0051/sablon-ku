'use client';

import { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Upload, Type, RotateCcw, Download, X, Layers, Hand, Smile, Sticker } from 'lucide-react';

export default function TshirtDesigner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<any>(null);
  const canvasInstanceRef = useRef<any>(null);
  
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [textValue, setTextValue] = useState('');
  const [isPanningMode, setIsPanningMode] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'tools' | 'stickers'>('tools');

  const stickers = [
    '/stickers/star.png',
    '/stickers/fire.png', 
    '/stickers/skull.png',
    '/stickers/heart.png',
    '/stickers/smile.png',
    '/stickers/lightning.png'
  ];

  const TSHIRT_IMAGE_URL = '/images/kaos-template.png'; 

  useEffect(() => {
    let isMounted = true;

    const initCanvas = async () => {
      const fabricModule = await import('fabric');
      
      if (!canvasRef.current || !containerRef.current) return;

      if (canvasInstanceRef.current) {
        canvasInstanceRef.current.dispose();
        canvasInstanceRef.current = null;
      }

      const containerWidth = containerRef.current.clientWidth;
      
      const imgElement = new Image();
      imgElement.src = TSHIRT_IMAGE_URL;
      
      imgElement.onload = () => {
        if (!isMounted) return;
        if (!canvasRef.current) return;

        if (canvasInstanceRef.current) {
             canvasInstanceRef.current.dispose();
        }

        const aspectRatio = imgElement.width / imgElement.height;
        const calculatedHeight = (containerWidth / aspectRatio) + 50; 

        // Fix TypeScript: Gunakan tanda seru (!)
        const newCanvas = new fabricModule.Canvas(canvasRef.current!, {
          width: containerWidth,
          height: calculatedHeight,
          backgroundColor: 'transparent', 
          preserveObjectStacking: true,
          selection: true, 
        });

        const fabricImg = new fabricModule.FabricImage(imgElement, {
            originX: 'left', 
            originY: 'center', 
            top: calculatedHeight / 2, 
            scaleX: containerWidth / imgElement.width,
            scaleY: containerWidth / imgElement.width,
            selectable: false,
            evented: false, 
        });

        newCanvas.backgroundImage = fabricImg;
        newCanvas.renderAll();

        newCanvas.on('selection:created', handleSelection);
        newCanvas.on('selection:updated', handleSelection);
        newCanvas.on('selection:cleared', () => {
            setSelectedObject(null);
            setTextValue('');
        });

        let isDragging = false;
        let lastPosX = 0;
        let lastPosY = 0;

        // --- FIX TYPESCRIPT DI SINI ---
        newCanvas.on('mouse:down', function(opt) {
          // Paksa jadi 'any' agar TS tidak rewel soal clientX
          const evt = opt.e as any; 
          
          if (opt.target) return;
          
          if (newCanvas.getZoom() > 1 || newCanvas.defaultCursor === 'grab') {
               isDragging = true;
               newCanvas.setCursor('grabbing');
               lastPosX = evt.clientX;
               lastPosY = evt.clientY;
          }
        });

        newCanvas.on('mouse:move', function(opt) {
          if (isDragging) {
            // Paksa jadi 'any' di sini juga
            const e = opt.e as any;
            
            const vpt = newCanvas.viewportTransform!;
            vpt[4] += e.clientX - lastPosX;
            vpt[5] += e.clientY - lastPosY;
            newCanvas.requestRenderAll();
            lastPosX = e.clientX;
            lastPosY = e.clientY;
          }
        });
        // ------------------------------

        newCanvas.on('mouse:up', function() {
          if (isDragging) {
              isDragging = false;
              newCanvas.setCursor(newCanvas.defaultCursor);
          }
        });

        if (isMounted) {
            canvasInstanceRef.current = newCanvas;
            setFabricCanvas(newCanvas);
        }
      };
    };

    initCanvas();

    return () => {
      isMounted = false;
      if (canvasInstanceRef.current) {
        canvasInstanceRef.current.dispose();
        canvasInstanceRef.current = null;
      }
      setFabricCanvas(null);
    };
  }, []);

  useEffect(() => {
      if(fabricCanvas) {
          fabricCanvas.defaultCursor = isPanningMode ? 'grab' : 'default';
          fabricCanvas.selection = !isPanningMode; 
          fabricCanvas.renderAll();
      }
  }, [isPanningMode, fabricCanvas]);

  const handleSelection = (e: any) => {
    const obj = e.selected?.[0];
    setSelectedObject(obj);
    if (obj && (obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox' || obj.type === 'fabric-text')) {
        setTextValue(obj.text);
    } else {
        setTextValue('');
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setTextValue(newVal);
    if (fabricCanvas && selectedObject) {
        selectedObject.set('text', newVal);
        fabricCanvas.renderAll();
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (fabricCanvas && selectedObject) {
        selectedObject.set('fill', e.target.value);
        fabricCanvas.renderAll();
    }
  };

  const handleZoom = (factor: number) => {
    if (!fabricCanvas) return;
    let zoom = fabricCanvas.getZoom();
    zoom *= factor;
    if (zoom > 4) zoom = 4;
    if (zoom < 0.5) zoom = 0.5;
    fabricCanvas.zoomToPoint({ x: fabricCanvas.width! / 2, y: fabricCanvas.height! / 2 }, zoom);
  };

  const resetZoom = () => {
      if(fabricCanvas) { 
          fabricCanvas.setZoom(1); 
          fabricCanvas.setViewportTransform([1,0,0,1,0,0]);
          setIsPanningMode(false);
      }
  }

  const addText = async () => {
    if (!fabricCanvas || isPanningMode) return; 
    const fabricModule = await import('fabric');
    const TextClass = fabricModule.FabricText || fabricModule.Text;

    const text = new TextClass('Teks Baru', {
      left: fabricCanvas.width! / 4,
      top: fabricCanvas.height! / 2,
      fontSize: 24,
      fontFamily: 'Arial',
      fill: '#000000',
      cornerColor: 'blue',
      cornerStyle: 'circle',
      fontWeight: 'bold',
      originY: 'center'
    });
    
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    setTextValue('Teks Baru');
    fabricCanvas.renderAll();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!fabricCanvas || isPanningMode || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (f) => {
      const data = f.target?.result as string;
      const fabricModule = await import('fabric');
      fabricModule.FabricImage.fromURL(data).then((img) => {
        const targetWidth = fabricCanvas.width! * 0.2; 
        img.scaleToWidth(targetWidth);
        img.set({
            left: fabricCanvas.width! / 4,
            top: fabricCanvas.height! / 2,
            cornerColor: 'blue',
            cornerStyle: 'circle',
            originY: 'center'
        });
        fabricCanvas.add(img);
        fabricCanvas.setActiveObject(img);
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const addSticker = async (url: string) => {
    if (!fabricCanvas || isPanningMode) return;
    const fabricModule = await import('fabric');
    
    fabricModule.FabricImage.fromURL(url).then((img) => {
        const targetWidth = fabricCanvas.width! * 0.15; 
        img.scaleToWidth(targetWidth);
        img.set({
            left: fabricCanvas.width! / 2,
            top: fabricCanvas.height! / 2,
            cornerColor: 'blue',
            cornerStyle: 'circle',
            originX: 'center',
            originY: 'center'
        });
        fabricCanvas.add(img);
        fabricCanvas.setActiveObject(img);
        fabricCanvas.renderAll();
    }).catch(err => {
        console.error("Gagal memuat stiker:", err);
        alert("Gagal memuat stiker. Pastikan file ada di folder public/stickers.");
    });
  };

  const deleteObject = () => {
    if (fabricCanvas && selectedObject) {
      fabricCanvas.remove(selectedObject);
      fabricCanvas.discardActiveObject();
      setSelectedObject(null);
      setTextValue('');
      fabricCanvas.renderAll();
    }
  };

  const downloadDesign = () => {
    if(!fabricCanvas) return;
    resetZoom(); 
    fabricCanvas.renderAll();

    setTimeout(() => {
        const dataURL = fabricCanvas.toDataURL({ format: 'png', quality: 1, multiplier: 2 });
        const link = document.createElement('a');
        link.download = 'desain-kaos-custom.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, 100);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center p-4">
      
      {/* --- SIDEBAR KIRI --- */}
      <div className="w-full lg:w-80 flex flex-col bg-white rounded-xl shadow-lg border border-gray-100 h-auto lg:h-[650px] overflow-hidden">
        
        {/* Header Sidebar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-lg text-gray-800">Editor Kaos</h3>
        </div>

        {/* Tab Navigasi */}
        <div className="flex border-b border-gray-100">
            <button 
                onClick={() => setActiveTab('tools')}
                className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 ${activeTab === 'tools' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <Layers size={16} /> Alat
            </button>
            <button 
                onClick={() => setActiveTab('stickers')}
                className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 ${activeTab === 'stickers' ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <Sticker size={16} /> Stiker
            </button>
        </div>
        
        {/* Isi Sidebar */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            
            {activeTab === 'tools' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tambah Elemen</p>
                    <button onClick={addText} disabled={isPanningMode} className="flex items-center gap-3 w-full bg-blue-50 hover:bg-blue-100 text-blue-700 disabled:bg-gray-100 disabled:text-gray-400 font-medium py-3 px-4 rounded-lg transition-all">
                        <Type size={18} /> <span>Tambah Teks</span>
                    </button>
                    <label className={`flex items-center gap-3 w-full ${isPanningMode ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-purple-50 hover:bg-purple-100 text-purple-700 cursor-pointer'} font-medium py-3 px-4 rounded-lg transition-all`}>
                        <Upload size={18} /> <span>Upload Gambar</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isPanningMode} className="hidden" />
                    </label>

                    <hr className="border-gray-100 my-4" />

                    {selectedObject ? (
                        <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center">
                                <p className="text-xs font-bold text-gray-500 uppercase">Edit Item</p>
                                <button onClick={deleteObject} className="text-red-500 hover:text-red-700 p-1 bg-white rounded shadow-sm" title="Hapus">
                                    <X size={16} />
                                </button>
                            </div>

                            {(selectedObject.type === 'text' || selectedObject.type === 'fabric-text' || selectedObject.type === 'i-text' || selectedObject.type === 'textbox') && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Teks:</label>
                                    <input 
                                        type="text" 
                                        value={textValue} 
                                        onChange={handleTextChange}
                                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <label className="block text-xs font-medium text-gray-600 mt-3 mb-1">Warna:</label>
                                    <input type="color" value={selectedObject.fill as string} onChange={handleColorChange} className="w-full h-8 cursor-pointer border border-gray-300 rounded overflow-hidden" />
                                </div>
                            )}
                            {selectedObject.type === 'image' && (<p className="text-xs text-gray-500 italic">Tarik ujung biru pada gambar untuk mengubah ukurannya.</p>)}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                            <Layers size={24} className="mb-2 opacity-30" />
                            <p className="text-xs">Pilih objek di kaos untuk diedit.</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'stickers' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Klik untuk Menambah</p>
                    <div className="grid grid-cols-3 gap-3">
                        {stickers.map((src, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => addSticker(src)}
                                disabled={isPanningMode}
                                className="aspect-square bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-lg flex items-center justify-center p-2 transition-all hover:scale-105"
                            >
                                <img src={src} alt="stiker" className="w-full h-full object-contain pointer-events-none" />
                            </button>
                        ))}
                    </div>
                    <div className="mt-6 bg-blue-50 p-3 rounded-lg text-xs text-blue-700 flex gap-2">
                        <Smile size={16} className="shrink-0" />
                        <p>Tips: Anda bisa menambahkan gambar stiker sendiri ke folder <b>public/stickers</b> di dalam project.</p>
                    </div>
                </div>
            )}
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-white">
             <button onClick={downloadDesign} className="flex items-center justify-center gap-2 w-full bg-black text-white hover:bg-gray-800 font-bold py-3 px-4 rounded-xl shadow-lg transition-transform active:scale-95">
                <Download size={18} /> Simpan Desain
            </button>
        </div>
      </div>

      {/* --- AREA CANVAS (TENGAH) --- */}
      <div className="flex flex-col items-center gap-4 w-full max-w-4xl">
        <div className="bg-white px-2 py-2 rounded-full shadow-md border border-gray-200 flex items-center gap-2 mb-2 z-10">
            <button 
                onClick={() => setIsPanningMode(!isPanningMode)} 
                className={`p-2 rounded-full transition-colors ${isPanningMode ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
                title={isPanningMode ? "Matikan Geser" : "Mode Geser (Pan)"}
            >
                <Hand size={20} />
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1"></div>
            <button onClick={() => handleZoom(0.9)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600"><ZoomOut size={20} /></button>
            <button onClick={() => handleZoom(1.1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600"><ZoomIn size={20} /></button>
            <button onClick={resetZoom} className="p-2 hover:bg-gray-100 rounded-full text-gray-600" title="Reset View"><RotateCcw size={18} /></button>
        </div>

        <div className="relative w-full">
            <div ref={containerRef} className="relative w-full shadow-xl border border-gray-200 rounded-xl overflow-hidden bg-white z-10">
                <canvas ref={canvasRef} />
            </div>
        </div>
        
        <p className="text-sm text-gray-500 mt-2 text-center flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <Hand size={14} /> 
            <span>Mode Geser (Tangan) aktif? Matikan dulu jika ingin memindahkan stiker/teks.</span>
        </p>
      </div>
    </div>
  );
}