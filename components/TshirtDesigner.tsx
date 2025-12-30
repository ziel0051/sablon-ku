'use client';

import { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Upload, Type, RotateCcw, Download, X, Layers, Hand } from 'lucide-react';

export default function TshirtDesigner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<any>(null);
  
  // Ref untuk menyimpan instance canvas agar tidak hilang saat re-render
  const canvasInstanceRef = useRef<any>(null);
  
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [textValue, setTextValue] = useState('');
  const [isPanningMode, setIsPanningMode] = useState(false);

  const TSHIRT_IMAGE_URL = '/images/kaos.png'; 

  useEffect(() => {
    // Flag untuk menandai apakah komponen masih aktif
    let isMounted = true;

    const initCanvas = async () => {
      const fabricModule = await import('fabric');
      
      // Cek apakah elemen DOM masih ada
      if (!canvasRef.current || !containerRef.current) return;

      // Hapus canvas lama sebelum memulai (Penting!)
      if (canvasInstanceRef.current) {
        canvasInstanceRef.current.dispose();
        canvasInstanceRef.current = null;
      }

      const containerWidth = containerRef.current.clientWidth;
      
      const imgElement = new Image();
      imgElement.src = TSHIRT_IMAGE_URL;
      
      imgElement.onload = () => {
        // PERBAIKAN: Jika komponen sudah unmount (tidak aktif), hentikan proses
        if (!isMounted) return;

        // Double check: Jika canvas entah bagaimana sudah ada, hapus dulu
        if (canvasInstanceRef.current) {
             canvasInstanceRef.current.dispose();
        }

        const aspectRatio = imgElement.width / imgElement.height;
        const calculatedHeight = (containerWidth / aspectRatio) + 50; 

        // Inisialisasi Canvas Baru
        const newCanvas = new fabricModule.Canvas(canvasRef.current, {
          width: containerWidth,
          height: calculatedHeight,
          backgroundColor: 'transparent', 
          preserveObjectStacking: true,
          selection: true, 
        });

        // Setup Background Image
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

        // --- EVENT LISTENER ---
        newCanvas.on('selection:created', handleSelection);
        newCanvas.on('selection:updated', handleSelection);
        newCanvas.on('selection:cleared', () => {
            setSelectedObject(null);
            setTextValue('');
        });

        // --- LOGIKA PANNING (GESER) ---
        let isDragging = false;
        let lastPosX = 0;
        let lastPosY = 0;

        newCanvas.on('mouse:down', function(opt) {
          const evt = opt.e;
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
            const e = opt.e;
            const vpt = newCanvas.viewportTransform!;
            vpt[4] += e.clientX - lastPosX;
            vpt[5] += e.clientY - lastPosY;
            newCanvas.requestRenderAll();
            lastPosX = e.clientX;
            lastPosY = e.clientY;
          }
        });

        newCanvas.on('mouse:up', function() {
          if (isDragging) {
              isDragging = false;
              newCanvas.setCursor(newCanvas.defaultCursor);
          }
        });

        // Simpan instance ke Ref dan State
        if (isMounted) {
            canvasInstanceRef.current = newCanvas;
            setFabricCanvas(newCanvas);
        }
      };
    };

    initCanvas();

    // CLEANUP FUNCTION
    return () => {
      isMounted = false; // Tandai bahwa komponen sudah mati
      if (canvasInstanceRef.current) {
        canvasInstanceRef.current.dispose();
        canvasInstanceRef.current = null;
      }
      setFabricCanvas(null);
    };
  }, []); // Dependency kosong [] artinya hanya jalan sekali saat mount

  // Effect terpisah untuk update mode Panning/Geser
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
      <div className="w-full lg:w-72 flex flex-col gap-5 bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-auto lg:min-h-[600px]">
        <h3 className="font-bold text-xl text-gray-800">Editor</h3>
        
        <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tambah Elemen</p>
            <button onClick={addText} disabled={isPanningMode} className="flex items-center gap-3 w-full bg-blue-50 hover:bg-blue-100 text-blue-700 disabled:bg-gray-100 disabled:text-gray-400 font-medium py-3 px-4 rounded-lg transition-all">
                <Type size={18} /> <span>Tambah Teks</span>
            </button>
            <label className={`flex items-center gap-3 w-full ${isPanningMode ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-purple-50 hover:bg-purple-100 text-purple-700 cursor-pointer'} font-medium py-3 px-4 rounded-lg transition-all`}>
                <Upload size={18} /> <span>Upload Gambar</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isPanningMode} className="hidden" />
            </label>
        </div>

        <hr className="border-gray-100" />

        {selectedObject ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Properti Item</p>
                    <button onClick={deleteObject} className="text-red-500 hover:text-red-700 p-1" title="Hapus">
                        <X size={18} />
                    </button>
                </div>

                {(selectedObject.type === 'text' || selectedObject.type === 'fabric-text' || selectedObject.type === 'i-text' || selectedObject.type === 'textbox') && (
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Isi Tulisan:</label>
                        <input 
                            type="text" 
                            value={textValue} 
                            onChange={handleTextChange}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <label className="block text-xs font-medium text-gray-600 mt-3 mb-1">Warna Teks:</label>
                        <div className="flex items-center gap-2">
                            <input type="color" value={selectedObject.fill as string} onChange={handleColorChange} className="w-8 h-8 cursor-pointer border-none p-0 rounded overflow-hidden" />
                        </div>
                    </div>
                )}
                {selectedObject.type === 'image' && (<p className="text-sm text-gray-500 italic">Geser ujung gambar untuk mengubah ukuran.</p>)}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
                <Layers size={32} className="mb-2 opacity-20" />
                <p className="text-sm">Klik teks atau gambar di kaos untuk mengedit.</p>
            </div>
        )}
        
        <div className="mt-auto pt-4 border-t border-gray-100">
             <button onClick={downloadDesign} className="flex items-center justify-center gap-2 w-full bg-black text-white hover:bg-gray-800 font-bold py-4 px-4 rounded-xl shadow-lg transition-transform active:scale-95">
                <Download size={20} /> Simpan & Download
            </button>
        </div>
      </div>

      {/* --- AREA CANVAS (TENGAH) --- */}
      <div className="flex flex-col items-center gap-4 w-full max-w-5xl">
        
        {/* Zoom & Pan Controls */}
        <div className="bg-white px-2 py-2 rounded-full shadow-md border border-gray-200 flex items-center gap-2 mb-2 z-10">
            <button 
                onClick={() => setIsPanningMode(!isPanningMode)} 
                className={`p-2 rounded-full transition-colors ${isPanningMode ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
                title="Mode Geser (Pan)"
            >
                <Hand size={20} />
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1"></div>
            <button onClick={() => handleZoom(0.9)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600"><ZoomOut size={20} /></button>
            <button onClick={() => handleZoom(1.1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600"><ZoomIn size={20} /></button>
            <button onClick={resetZoom} className="p-2 hover:bg-gray-100 rounded-full text-gray-600" title="Reset View"><RotateCcw size={18} /></button>
        </div>

        {/* CONTAINER UTAMA */}
        <div className="relative w-full">
            <div ref={containerRef} className="relative w-full shadow-xl border border-gray-200 rounded-xl overflow-hidden bg-white z-10">
                <canvas ref={canvasRef} />
            </div>
        </div>
        
        <p className="text-sm text-gray-500 mt-3 text-center flex items-center gap-2 bg-white p-2 rounded-full shadow-sm border border-gray-100">
            <Hand size={14} /> 
            <span>Gunakan tombol <b>Tangan</b> di atas untuk menggeser tampilan saat di-zoom.</span>
        </p>
      </div>
    </div>
  );
}