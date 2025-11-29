import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { Maximize2, Minimize2, RotateCw } from 'lucide-react';
import { Button } from './ui/button';

interface Room3DPreviewProps {
  roomImage: string;
  roomName: string;
}

export function Room3DPreview({ roomImage, roomName }: Room3DPreviewProps) {
  const [isFullView, setIsFullView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateYValue = ((e.clientX - centerX) / rect.width) * 30;
    const rotateXValue = -((e.clientY - centerY) / rect.height) * 30;
    
    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div className="relative">
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsFullView(true)}
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="relative w-full h-full"
        >
          {/* Main image */}
          <img
            src={roomImage}
            alt={roomName}
            className="w-full h-full object-cover"
          />
          
          {/* 3D layers */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
            style={{
              transform: 'translateZ(10px)',
            }}
          />
          
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-6 text-white"
            style={{
              transform: 'translateZ(20px)',
            }}
          >
            <h3 className="text-2xl font-bold mb-2">{roomName}</h3>
            <p className="text-sm opacity-80">Interactive 3D Preview</p>
          </motion.div>

          {/* Floating indicators */}
          <motion.div
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full"
            style={{
              transform: 'translateZ(30px)',
            }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <RotateCw className="w-5 h-5 text-white" />
          </motion.div>
        </motion.div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </motion.div>

      {/* Fullscreen modal */}
      {isFullView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-lg p-8"
          onClick={() => setIsFullView(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-w-6xl w-full">
              <img
                src={roomImage}
                alt={roomName}
                className="w-full h-auto rounded-xl shadow-2xl"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm"
                onClick={() => setIsFullView(false)}
              >
                <Minimize2 className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
