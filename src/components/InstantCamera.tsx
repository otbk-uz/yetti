import React, { useRef, useState, useEffect } from 'react';
import { Camera, Send, X, Upload, RefreshCw } from 'lucide-react';
import { SupabaseService } from '../services/supabase';
import type { MediaPost } from '../types';

interface InstantCameraProps {
  onPublishPost: (post: MediaPost) => void;
  onGoToFeed: () => void;
  authorName: string;
  authorNickname: string;
  authorAvatar: string;
}

export const InstantCamera: React.FC<InstantCameraProps> = ({
  onPublishPost,
  onGoToFeed,
  authorName,
  authorNickname,
  authorAvatar
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('oddiy');
  const [capturedMedia, setCapturedMedia] = useState<{ type: 'photo' | 'video'; url: string } | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Filter CSS mapping
  const filterStyles: Record<string, string> = {
    oddiy: 'none',
    noir: 'grayscale(1) contrast(1.35)'
  };

  useEffect(() => {
    let stream: MediaStream | null = null;
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode, width: { ideal: 720 }, height: { ideal: 1280 } },
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch (err) {
        console.log('Camera inactive or desktop mode:', err);
        setCameraActive(false);
      }
    }

    if (!capturedMedia) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [capturedMedia, facingMode]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCapturedMedia({
          type: isVideo ? 'video' : 'photo',
          url: reader.result
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Photo Snapshot
  const handleTakeSnapshot = () => {
    if (cameraActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 800;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.filter = filterStyles[selectedFilter];
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        setCapturedMedia({ type: 'photo', url: dataUrl });
        return;
      }
    }

    // Trigger device file upload if camera offline
    fileInputRef.current?.click();
  };

  // Handle Video Recording
  const handleRecordVideo = () => {
    if (cameraActive) {
      if (isRecording) {
        setIsRecording(false);
      } else {
        setIsRecording(true);
        setRecordingTime(0);
        const interval = setInterval(() => {
          setRecordingTime(prev => {
            if (prev >= 5) {
              clearInterval(interval);
              setIsRecording(false);
              return 5;
            }
            return prev + 1;
          });
        }, 1000);
      }
    } else {
      fileInputRef.current?.click();
    }
  };

  // Publish post to Database & Feed
  const handlePublish = async () => {
    if (!capturedMedia) return;

    setIsSyncing(true);

    const newPost: MediaPost = {
      id: `post-${Date.now()}`,
      type: capturedMedia.type,
      mediaUrl: capturedMedia.url,
      authorName,
      authorNickname,
      authorAvatar,
      timestamp: 'Hozirgina',
      likes: 1,
      commentsCount: 0,
      shares: 0,
      caption: caption.trim() || 'Momental lahza ⚡',
      filter: selectedFilter
    };

    const uploadRes = await SupabaseService.uploadInstantPost(newPost);
    if (uploadRes.mediaUrl) {
      newPost.mediaUrl = uploadRes.mediaUrl;
    }

    setIsSyncing(false);
    onPublishPost(newPost);
    setCapturedMedia(null);
    setCaption('');
    onGoToFeed();
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#07080a', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*,video/*"
        style={{ display: 'none' }}
      />

      {/* Preview captured media vs camera viewfinder */}
      {capturedMedia ? (
        <div className="fade-in" style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {capturedMedia.type === 'photo' ? (
            <img
              src={capturedMedia.url}
              alt="Preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: filterStyles[selectedFilter]
              }}
            />
          ) : (
            <video
              src={capturedMedia.url}
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: filterStyles[selectedFilter]
              }}
            />
          )}

          {/* Close preview button */}
          <div style={{
            position: 'absolute',
            top: 72,
            left: '1.25rem',
            zIndex: 10
          }}>
            <button
              onClick={() => setCapturedMedia(null)}
              style={{
                background: 'rgba(7,8,10,0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                borderRadius: '50%',
                padding: '10px',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Bottom caption input & publish button */}
          <div style={{
            position: 'absolute',
            bottom: 85,
            left: 0,
            right: 0,
            padding: '1.25rem',
            background: 'linear-gradient(to top, rgba(7,8,10,0.98), transparent)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <input
              type="text"
              placeholder="Izoh qoldiring..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(18,20,26,0.85)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                borderRadius: '14px',
                padding: '12px 16px',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />

            <button
              onClick={handlePublish}
              disabled={isSyncing}
              style={{
                width: '100%',
                background: '#ffffff',
                border: 'none',
                color: '#000000',
                fontWeight: 800,
                fontSize: '0.95rem',
                padding: '14px',
                borderRadius: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Send size={18} /> {isSyncing ? 'Sinxronlanmoqda...' : 'Tavsiyalarga Joylash'}
            </button>
          </div>
        </div>
      ) : (
        /* Live Camera Viewfinder */
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: filterStyles[selectedFilter]
            }}
          />

          {!cameraActive && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#07080a',
              color: '#fff',
              textAlign: 'center',
              padding: '2rem'
            }}>
              <div style={{
                padding: '20px',
                borderRadius: '24px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '1.25rem'
              }}>
                <Camera size={44} color="#ffffff" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
                INSTANT KAMERA
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', maxWidth: '280px', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                Webcam kameralari faol bo'lmaganda qurilmangizdan rasm yoki video tanlang.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Upload size={16} /> Fayl Tanlash
              </button>
            </div>
          )}

          {/* Top Filter Chips & Camera Switcher */}
          <div style={{
            position: 'absolute',
            top: 76,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            zIndex: 10,
            padding: '0 0.75rem'
          }}>
            {[
              { id: 'oddiy', label: 'Oddiy' },
              { id: 'noir', label: 'Noir 🖤' }
            ].map(f => (
              <button
                key={f.id}
                className={`filter-chip ${selectedFilter === f.id ? 'active' : ''}`}
                onClick={() => setSelectedFilter(f.id)}
              >
                {f.label}
              </button>
            ))}

            <button
              onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')}
              className="filter-chip"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(255,255,255,0.12)',
                borderColor: 'rgba(255,255,255,0.25)'
              }}
              title="Oldi / Orqa kameraga o'tkazish"
            >
              <RefreshCw size={13} />
              <span>{facingMode === 'user' ? 'Oldi' : 'Orqa'}</span>
            </button>
          </div>

          {/* Shutter & Mode Control Area */}
          <div style={{
            position: 'absolute',
            bottom: 95,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            zIndex: 10
          }}>
            {/* Mode Switcher */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              background: 'rgba(15,17,23,0.85)',
              backdropFilter: 'blur(16px)',
              padding: '4px',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.12)'
            }}>
              <button
                onClick={() => setMode('photo')}
                style={{
                  background: mode === 'photo' ? '#ffffff' : 'transparent',
                  color: mode === 'photo' ? '#000000' : '#ffffff',
                  border: 'none',
                  padding: '5px 16px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                📸 Rasm
              </button>
              <button
                onClick={() => setMode('video')}
                style={{
                  background: mode === 'video' ? '#ef4444' : 'transparent',
                  color: '#ffffff',
                  border: 'none',
                  padding: '5px 16px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                🎥 Video
              </button>
            </div>

            {/* Shutter Button */}
            {mode === 'photo' ? (
              <button className="shutter-btn" onClick={handleTakeSnapshot}>
                <div className="shutter-inner" />
              </button>
            ) : (
              <button className={`shutter-btn ${isRecording ? 'recording' : ''}`} onClick={handleRecordVideo}>
                <div className="shutter-inner" />
              </button>
            )}

            {isRecording && (
              <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.85rem' }}>
                🔴 Yozib olinmoqda: 00:0{recordingTime}s
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
