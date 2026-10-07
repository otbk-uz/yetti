import React, { useState } from 'react';
import { Camera, Flame, User, ChevronRight, CheckCircle, ShieldCheck } from 'lucide-react';

interface OnboardingModalProps {
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  const [step, setStep] = useState<number>(1);

  const steps = [
    {
      id: 1,
      icon: ShieldCheck,
      title: '1. Kirish va Profil Boshqaruvi',
      desc: 'Platformada shaxsiy @nikneymingiz va telefon raqamingiz orqali ro\'yxatdan o\'tasiz. Barcha yuklangan postlaringiz bazada xavfsiz biriktiriladi.'
    },
    {
      id: 2,
      icon: Camera,
      title: '2. Instant Kamera va Media Yuklash',
      desc: 'Kamera orqali instant rasm va video oling yoki qurilmangizdan real media fayl tanlang. Oddiy va Noir (Qora-Oq) filtrlari mavjud.'
    },
    {
      id: 3,
      icon: Flame,
      title: '3. Tavsiyalar Tasmamasi va Reaksiyalar',
      desc: 'Siz joylagan instant postlar darhol Tavsiyalar bo\'limiga chiqadi. Boshqa foydalanuvchilar postlaringizga layk bosishi va izoh qoldirishi mumkin.'
    },
    {
      id: 4,
      icon: User,
      title: '4. Profil va Sozlamalar Knopkasi',
      desc: 'Profilingizda faqat o\'zingizning saqlangan postlaringiz aks etadi. Yuqori menyudagi "❓ Qanday ishlaydi?" va "@nikneym" tugmalari orqali profilni tahrirlashingiz mumkin.'
    }
  ];

  const current = steps[step - 1];
  const IconComp = current.icon;

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(7, 8, 10, 0.88)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      padding: '1.25rem'
    }}>
      <div className="fade-in" style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(18, 20, 26, 0.92)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '2rem 1.75rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '1.25rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)'
      }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '0.25rem' }}>
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              style={{
                width: i === step ? '28px' : '8px',
                height: '8px',
                borderRadius: '999px',
                background: i === step ? '#ffffff' : 'rgba(255,255,255,0.15)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Icon Wireframe Badge */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '18px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <IconComp size={32} color="#ffffff" />
        </div>

        {/* Text content */}
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            {current.title}
          </h3>
          <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.5, marginTop: '10px' }}>
            {current.desc}
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={handleNext}
          style={{
            width: '100%',
            background: '#ffffff',
            border: 'none',
            color: '#000000',
            fontWeight: 800,
            fontSize: '0.95rem',
            padding: '13px',
            borderRadius: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '0.5rem',
            boxShadow: '0 4px 20px rgba(255, 255, 255, 0.15)'
          }}
        >
          {step === 4 ? (
            <>
              <CheckCircle size={18} /> Tushunarli, foydalanish
            </>
          ) : (
            <>
              Davom etish <ChevronRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
