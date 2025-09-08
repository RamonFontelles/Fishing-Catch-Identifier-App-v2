import React, { useState, useCallback, useRef, useEffect } from 'react';

interface ImageUploaderProps {
  onImageUpload: (base64: string, mimeType: string) => void;
}

const CameraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
        <circle cx="12" cy="13" r="4"></circle>
    </svg>
);

const VideoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m22 8-6 4 6 4V8Z"></path>
        <rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect>
    </svg>
);


interface CameraViewProps {
  stream: MediaStream;
  onTakePhoto: (dataUrl: string) => void;
  onClose: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ stream, onTakePhoto, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onTakePhoto(dataUrl);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
      <video ref={videoRef} autoPlay playsInline className="w-full max-w-3xl h-auto rounded-lg shadow-2xl"></video>
      <canvas ref={canvasRef} className="hidden"></canvas>
      <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <button onClick={takePhoto} className="bg-sea-green hover:bg-sea-green/80 text-white font-bold py-3 px-6 rounded-full text-lg">Snap Photo</button>
        <button onClick={onClose} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-full text-lg">Cancel</button>
      </div>
    </div>
  );
};


const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        onImageUpload(base64, file.type);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const onBrowseClick = () => {
    inputRef.current?.click();
  };

  const handleOpenCamera = async () => {
    setCameraError(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setCameraStream(stream);
        setShowCamera(true);
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setCameraError("Could not access the camera. Please check permissions and try again.");
      }
    } else {
      setCameraError("Camera access is not supported by your browser.");
    }
  };

  const handleCloseCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
    setCameraStream(null);
  };

  const handleTakePhoto = (dataUrl: string) => {
    const base64 = dataUrl.split(',')[1];
    onImageUpload(base64, 'image/jpeg');
    handleCloseCamera();
  };


  return (
    <>
      {showCamera && cameraStream && (
        <CameraView stream={cameraStream} onTakePhoto={handleTakePhoto} onClose={handleCloseCamera} />
      )}
      <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Identify Your Catch</h2>
          <p className="text-slate-400 mb-6">Upload a clear photo of your fish, or use your camera.</p>
          
          <div className="mb-4">
              <button
                  type="button"
                  onClick={handleOpenCamera}
                  className="inline-flex items-center justify-center bg-ocean-blue hover:bg-ocean-blue/70 text-white font-bold py-3 px-6 rounded-lg transition-colors w-full sm:w-auto"
              >
                  <VideoIcon />
                  Use Camera
              </button>
          </div>

          <div className="flex items-center my-6">
              <div className="flex-grow border-t border-slate-600"></div>
              <span className="flex-shrink mx-4 text-slate-400">OR</span>
              <div className="flex-grow border-t border-slate-600"></div>
          </div>
          
          {cameraError && <p className="text-red-400 mb-4">{cameraError}</p>}
          
          <form 
              id="form-file-upload" 
              className={`relative p-8 border-2 border-dashed rounded-xl transition-colors ${dragActive ? 'border-sea-green bg-ocean-blue/50' : 'border-slate-600 hover:border-sea-green'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onSubmit={(e) => e.preventDefault()}
          >
              <input ref={inputRef} type="file" id="input-file-upload" accept="image/*" className="hidden" onChange={handleChange}/>
              <label id="label-file-upload" htmlFor="input-file-upload" className="flex flex-col items-center justify-center cursor-pointer">
                  <CameraIcon />
                  <p className="font-medium text-slate-300 mt-4">Drag & drop your photo here or</p>
                  <button 
                      type="button"
                      onClick={onBrowseClick} 
                      className="mt-2 bg-sea-green hover:bg-sea-green/80 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                  >
                      Browse Files
                  </button>
              </label>
          </form>
      </div>
    </>
  );
};

export default ImageUploader;
