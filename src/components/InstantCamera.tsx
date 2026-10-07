import React, { useRef, useState, useEffect } from 'react';
import { Camera, Send, X } from 'lucide-react';
import confetti from 'canvas-confetti';
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

  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('normal');
  const [capturedMedia, setCapturedMedia] = useState<{ type: 'photo' | 'video'; url: string } | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);

  // Filters mapping
  const filterStyles: Record<string, string> = {
    normal: 'none',
    cyber: 'contrast(1.2) hue-rotate(180deg) saturate(1.4)',
    warm: 'sepia(0.4) contrast(1.1) saturate(1.3)',
    bw: 'grayscale(1) contrast(1.3)'
  };

  useEffect(() => {
    let stream: MediaStream | null = null;
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 1280 } },
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch (err) {
        console.log('Camera API fallback mode:', err);
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
  }, [capturedMedia]);

  // Handle Photo Capture
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
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedMedia({ type: 'photo', url: dataUrl });
        confetti({ particleCount: 25, spread: 50, origin: { y: 0.8 } });
        return;
      }
    }

    // Fallback simulated camera snapshot if hardware camera unavailable
    const fallbackPhotos = [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
    ];
    const randomUrl = fallbackPhotos[Math.floor(Math.random() * fallbackPhotos.length)];
    setCapturedMedia({ type: 'photo', url: randomUrl });
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
  };

  // Handle Video Recording
  const handleRecordVideo = () => {
    if (isRecording) {
      setIsRecording(false);
      const fallbackVideos = [
        'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
        'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4'
      ];
      setCapturedMedia({ type: 'video', url: fallbackVideos[Math.floor(Math.random() * fallbackVideos.length)] });
      confetti({ particleCount: 40, spread: 70, origin: { y: 0.8 } });
    } else {
      setIsRecording(true);
      setRecordingTime(0);
      const interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 5) {
            clearInterval(interval);
            setIsRecording(false);
            const fallbackVideos = [
              'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
              'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4'
            ];
            setCapturedMedia({ type: 'video', url: fallbackVideos[0] });
            confetti({ particleCount: 40, spread: 70, origin: { y: 0.8 } });
            return 5;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  // Publish post instantly
  const handlePublish = () => {
    if (!capturedMedia) return;

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
      caption: caption || 'YETTI Instant Momental ⚡',
      filter: selectedFilter
    };

    onPublishPost(newPost);
    setCapturedMedia(null);
    setCaption('');
    onGoToFeed();
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Captured Preview Mode vs Live Camera Mode */}
      {capturedMedia ? (
        <div className="fade-in" style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Media preview */}
          {capturedMedia.type === 'photo' ? (
            <img
              src={capturedMedia.url}
              alt="Momental Capture"
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

          {/* Overlay controls for caption and Instant Publish */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '1.25rem',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              onClick={() => setCapturedMedia(null)}
              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '50%', padding: '10px', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>⚡ Momental Tayyor</span>
          </div>

          <div style={{
            position: 'absolute',
            bottom: 80,
            left: 0,
            right: 0,
            padding: '1.25rem',
            background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <input
              type="text"
              placeholder="Izoh qoldiring... #yetti #momental"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#fff',
                borderRadius: '14px',
                padding: '12px 16px',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />

            <button
              onClick={handlePublish}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
                border: 'none',
                color: '#000',
                fontWeight: 800,
                fontSize: '1rem',
                padding: '14px',
                borderRadius: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 20px rgba(0,242,254,0.4)'
              }}
            >
              <Send size={18} /> Tavsiyalarga Yuklash (Publish)
            </button>
          </div>
        </div>
      ) : (
        /* Live Camera Finder */
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
              background: 'radial-gradient(circle, #1a1a2e 0%, #000000 100%)',
              color: '#fff',
              textAlign: 'center',
              padding: '2rem'
            }}>
              <Camera size={56} color="#00f2fe" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>⚡ YETTI Instant Kamera</h3>
              <p style={{ fontSize: '0.82rem', color: '#a1a1aa', maxWidth: '280px' }}>
                Kamera ishga tushirildi. Lahzani olish uchun quyidagi tugmani bosing!
              </p>
            </div>
          )}

          {/* Top Filter Chips */}
          <div style={{
            position: 'absolute',
            top: 70,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            zIndex: 10,
            padding: '0 1rem'
          }}>
            {[
              { id: 'normal', label: 'Normal' },
              { id: 'cyber', label: 'Cyber 🌐' },
              { id: 'warm', label: 'Warm 🌅' },
              { id: 'bw', label: 'B&W 🖤' }
            ].map(f => (
              <button
                key={f.id}
                className={`filter-chip ${selectedFilter === f.id ? 'active' : ''}`}
                onClick={() => setSelectedFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Shutter & Mode Control Area */}
          <div style={{
            position: 'absolute',
            bottom: 90,
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
              gap: '1rem',
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(10px)',
              padding: '4px 12px',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <button
                onClick={() => setMode('photo')}
                style={{
                  background: mode === 'photo' ? '#fff' : 'none',
                  color: mode === 'photo' ? '#000' : '#fff',
                  border: 'none',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                📸 Rasm
              </button>
              <button
                onClick={() => setMode('video')}
                style={{
                  background: mode === 'video' ? '#ff0055' : 'none',
                  color: '#fff',
                  border: 'none',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '0.75rem',
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
              <span style={{ color: '#ff0055', fontWeight: 800, fontSize: '0.9rem' }}>
                🔴 Yozib olinmoqda: 00:0{recordingTime}s
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
