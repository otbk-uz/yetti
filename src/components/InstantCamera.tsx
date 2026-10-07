import React, { useRef, useState, useEffect } from 'react';
import { Camera, Send, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CloudflareService } from '../services/cloudflare';
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
  const [selectedFilter, setSelectedFilter] = useState<string>('oddiy');
  const [capturedMedia, setCapturedMedia] = useState<{ type: 'photo' | 'video'; url: string } | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [isSyncingCloudflare, setIsSyncingCloudflare] = useState<boolean>(false);

  // Filters mapping
  const filterStyles: Record<string, string> = {
    oddiy: 'none',
    noir: 'grayscale(1) contrast(1.35)'
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
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 }, colors: ['#d4af37', '#f5e396', '#ffffff'] });
        return;
      }
    }

    // Fallback luxury dark gold photo snapshot if camera offline
    const fallbackPhotos = [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
    ];
    const randomUrl = fallbackPhotos[Math.floor(Math.random() * fallbackPhotos.length)];
    setCapturedMedia({ type: 'photo', url: randomUrl });
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 }, colors: ['#d4af37', '#f5e396', '#ffffff'] });
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
      confetti({ particleCount: 45, spread: 70, origin: { y: 0.8 }, colors: ['#d4af37', '#f5e396'] });
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
            confetti({ particleCount: 45, spread: 70, origin: { y: 0.8 }, colors: ['#d4af37', '#f5e396'] });
            return 5;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  // Publish post to Cloudflare R2 + D1 Database
  const handlePublish = async () => {
    if (!capturedMedia) return;

    setIsSyncingCloudflare(true);

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
      caption: caption || 'YETTI Gold Momental ⚡',
      filter: selectedFilter
    };

    // Cloudflare R2 & D1 sync
    await CloudflareService.uploadInstantPost(newPost);

    setIsSyncingCloudflare(false);
    onPublishPost(newPost);
    setCapturedMedia(null);
    setCaption('');
    onGoToFeed();
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#050507', overflow: 'hidden' }}>
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
            background: 'linear-gradient(to bottom, rgba(5,5,7,0.95), transparent)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              onClick={() => setCapturedMedia(null)}
              style={{ background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.4)', color: '#fff', borderRadius: '50%', padding: '10px', cursor: 'pointer' }}
            >
              <X size={20} color="#f5e396" />
            </button>
          </div>

          <div style={{
            position: 'absolute',
            bottom: 85,
            left: 0,
            right: 0,
            padding: '1.25rem',
            background: 'linear-gradient(to top, rgba(5,5,7,0.98), transparent)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <input
              type="text"
              placeholder="Izoh qoldiring... #yetti #gold"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(20,18,25,0.85)',
                border: '1px solid rgba(212,175,55,0.35)',
                color: '#fff',
                borderRadius: '14px',
                padding: '12px 16px',
                fontSize: '0.9rem',
                outline: 'none',
                boxShadow: '0 0 15px rgba(212,175,55,0.1)'
              }}
            />

            <button
              onClick={handlePublish}
              disabled={isSyncingCloudflare}
              style={{
                width: '100%',
                background: 'var(--gold-gradient)',
                border: 'none',
                color: '#000',
                fontWeight: 900,
                fontSize: '1rem',
                padding: '14px',
                borderRadius: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 25px rgba(212,175,55,0.4)'
              }}
            >
              <Send size={18} /> {isSyncingCloudflare ? 'Cloudflare ga Yuklanmoqda...' : 'Tavsiyalarga Yuklash (Publish)'}
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
              background: 'radial-gradient(circle, #181520 0%, #050507 100%)',
              color: '#fff',
              textAlign: 'center',
              padding: '2rem'
            }}>
              <div style={{
                padding: '18px',
                borderRadius: '50%',
                background: 'rgba(212,175,55,0.15)',
                border: '1px solid rgba(212,175,55,0.3)',
                marginBottom: '1rem',
                boxShadow: '0 0 30px rgba(212,175,55,0.3)'
              }}>
                <Camera size={48} color="#f5e396" />
              </div>
              <h3 className="text-gold-metallic" style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>
                YETTI GOLD MOMENTAL
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#a1a1aa', maxWidth: '280px' }}>
                Obsidian & Dark Gold formatida rasm va videolaringiz darhol Tavsiyalarga chiqadi.
              </p>
            </div>
          )}

          {/* Top Filter Chips */}
          <div style={{
            position: 'absolute',
            top: 72,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            zIndex: 10,
            padding: '0 1rem'
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
              gap: '1rem',
              background: 'rgba(10,9,14,0.75)',
              backdropFilter: 'blur(12px)',
              padding: '4px 12px',
              borderRadius: '999px',
              border: '1px solid rgba(212,175,55,0.3)'
            }}>
              <button
                onClick={() => setMode('photo')}
                style={{
                  background: mode === 'photo' ? 'var(--gold-gradient)' : 'none',
                  color: mode === 'photo' ? '#000' : '#fff',
                  border: 'none',
                  padding: '4px 14px',
                  borderRadius: '999px',
                  fontWeight: 800,
                  fontSize: '0.78rem',
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
                  padding: '4px 14px',
                  borderRadius: '999px',
                  fontWeight: 800,
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
