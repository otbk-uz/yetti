import React, { useState } from 'react';
import { Camera, Flame, User, ChevronRight, CheckCircle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OnboardingModalProps {
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  const [step, setStep] = useState<number>(1);

  const steps = [
    {
      id: 1,
      icon: ShieldCheck,
      color: '#d4af37',
      title: '1-Qadam: 📝 Birinchi o\'rinda Ro\'yxatdan O\'tish',
      desc: 'Platformaga ilk kirganda Telefon, Ism va Nikneym (@nickname) orqali ro\'yxatdan o\'tiladi. Ma\'lumotlaringiz va barcha momental postlaringiz bazada xavfsiz biriktiriladi.'
    },
    {
      id: 2,
      icon: Camera,
      color: '#f5e396',
      title: '2-Qadam: 📸 Momental Kamera Knopkalari',
      desc: 'Kamerada 📸 Rasm va 🎥 Video rejimini tanglaysiz. "Oddiy" va "Noir 🖤" filtrlari bor. Oltin tugmani 1 marta bosib, "Tavsiyalarga Yuklash" tugmasi orqali reski nashr qilasiz.'
    },
    {
      id: 3,
      icon: Flame,
      color: '#ff0055',
      title: '3-Qadam: 🔥 Tavsiyalar tasmamasi Knopkalari',
      desc: 'Yuklagan rasm va videolaringiz darhol "🔥 Tavsiyalar" tasmamasiga tushadi va barcha foydalanuvchilar ❤️ Reaksiya (layk) va 💬 Izoh qoldirishi mumkin.'
    },
    {
      id: 4,
      icon: User,
      color: '#00f2fe',
      title: '4-Qadam: 👤 Profil va Yordam Knopkalari',
      desc: 'Profil bo\'limida barcha shaxsiy momental postlaringiz saqlanadi. Yuqoridagi "❓ Qanday ishlaydi?" va "⚙️ Profilni tahrirlash" knopkalari orqali ma\'lumotlarni boshqarasiz.'
    }
  ];

  const current = steps[step - 1];
  const IconComp = current.icon;

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 }, colors: ['#d4af37', '#f5e396'] });
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 5, 7, 0.94)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      padding: '1.25rem'
    }}>
      <div className="fade-in" style={{
        width: '100%',
        maxWidth: '420px',
        background: '#0d0c12',
        border: '1px solid rgba(212, 175, 55, 0.4)',
        borderRadius: '28px',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '1.25rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.9), 0 0 35px rgba(212,175,55,0.2)'
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
                background: i === step ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.15)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Icon */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(212,175,55,0.15)',
          border: '2px solid rgba(212,175,55,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 25px rgba(212,175,55,0.3)'
        }}>
          <IconComp size={36} color={current.color} />
        </div>

        {/* Text content */}
        <div>
          <h3 className="text-gold-metallic" style={{ fontSize: '1.25rem', margin: 0, fontWeight: 900 }}>
            {current.title}
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5, marginTop: '10px' }}>
            {current.desc}
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={handleNext}
          style={{
            width: '100%',
            background: 'var(--gold-gradient)',
            border: 'none',
            color: '#000',
            fontWeight: 900,
            fontSize: '1rem',
            padding: '14px',
            borderRadius: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '0.5rem',
            boxShadow: '0 4px 25px rgba(212,175,55,0.4)'
          }}
        >
          {step === 4 ? (
            <>
              <CheckCircle size={18} /> Platformadan Foydalanish
            </>
          ) : (
            <>
              Keyingisi <ChevronRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

