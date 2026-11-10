import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, Eye, X, Image as ImageIcon, Sparkles, Camera, PenTool } from 'lucide-react';
import { compressImage, CompressionResult } from '../utils/imageCompressor';
import { SignaturePadModal } from './SignaturePadModal';

interface DocumentUploadFieldProps {
  label: string;
  helperText?: string;
  required?: boolean;
  maxDimension?: number;
  value?: string;
  onChange: (base64: string | undefined) => void;
  lang?: 'hi' | 'en';
  isSignature?: boolean;
}

export const DocumentUploadField: React.FC<DocumentUploadFieldProps> = ({
  label,
  helperText,
  required = false,
  maxDimension = 1200,
  value,
  onChange,
  lang = 'en',
  isSignature = false,
}) => {
  const [compressing, setCompressing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<CompressionResult | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setCompressing(true);
      const result = await compressImage(file, maxDimension);
      setCompressionInfo(result);
      onChange(result.dataUrl);
    } catch (err) {
      console.error('Image compression error:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setCompressing(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    setCompressionInfo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-medium text-slate-700">
        <label className="flex items-center gap-1 font-semibold">
          {label}
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>
        {value && (
          <span className="text-emerald-700 flex items-center gap-1 font-semibold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Attached
          </span>
        )}
      </div>

      {!value ? (
        <div
          className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all bg-white ${
            compressing ? 'border-amber-400 bg-amber-50/50' : 'border-slate-300 hover:border-amber-500'
          }`}
        >
          {/* Hidden inputs for File and Camera */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />

          {compressing ? (
            <div className="py-3 flex flex-col items-center gap-1.5 text-amber-700">
              <Sparkles className="w-6 h-6 animate-spin text-amber-600" />
              <p className="text-xs font-semibold">
                Auto-compressing image for fast mobile upload...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <p className="text-xs text-slate-500 font-medium">
                {helperText || 'Upload clear image or document'}
              </p>

              {/* Mobile Action Buttons */}
              <div className="flex items-center gap-2 w-full justify-center flex-wrap pt-1">
                {/* 1. Camera Button */}
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-600" />
                  <span>Take Photo (Camera)</span>
                </button>

                {/* 2. Gallery Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-600" />
                  <span>Choose File (Gallery)</span>
                </button>

                {/* 3. Draw on screen (if Signature) */}
                {isSignature && (
                  <button
                    type="button"
                    onClick={() => setSignatureModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    <PenTool className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sign on Screen</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <div
              onClick={() => setPreviewOpen(true)}
              className="w-14 h-14 rounded-lg border border-slate-200 overflow-hidden bg-white shrink-0 cursor-pointer hover:opacity-90 transition-opacity relative group"
            >
              <img
                src={value}
                alt={label}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                <Eye className="w-4 h-4" />
              </div>
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{label}</p>
              {compressionInfo ? (
                <p className="text-[11px] text-slate-500 mt-0.5">
                  <span className="line-through text-slate-400 mr-1">{compressionInfo.originalSizeKb} KB</span>
                  <span className="font-bold text-emerald-600">{compressionInfo.compressedSizeKb} KB</span>
                  <span className="text-slate-400 ml-1">({Math.round(((compressionInfo.originalSizeKb - compressionInfo.compressedSizeKb) / compressionInfo.originalSizeKb) * 100)}% smaller)</span>
                </p>
              ) : (
                <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                  <ImageIcon className="w-3 h-3" /> Ready for submission
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white text-xs transition-colors"
              title="Preview"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 text-xs transition-colors"
              title="Remove"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Full Preview Modal */}
      {previewOpen && value && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3.5 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-900">{label}</h4>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-slate-950 flex items-center justify-center max-h-[70vh] overflow-auto">
              <img
                src={value}
                alt={label}
                className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Touch Screen Signature Pad Modal */}
      {isSignature && (
        <SignaturePadModal
          isOpen={signatureModalOpen}
          onClose={() => setSignatureModalOpen(false)}
          onSave={(dataUrl) => onChange(dataUrl)}
        />
      )}
    </div>
  );
};
