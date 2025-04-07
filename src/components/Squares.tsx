import React, { useEffect, useRef } from 'react';

interface SquaresProps {
  speed?: number;
  squareSize?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'diagonal';
  borderColor?: string;
  hoverFillColor?: string;
}

const Squares: React.FC<SquaresProps> = ({
  speed = 0.5,
  squareSize = 40,
  direction = 'diagonal',
  borderColor = '#fff',
  hoverFillColor = '#222'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const squares: { x: number; y: number; filled: boolean }[] = [];
    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initSquares();
    };

    const initSquares = () => {
      squares.length = 0;
      const cols = Math.ceil(canvas.width / squareSize);
      const rows = Math.ceil(canvas.height / squareSize);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          squares.push({
            x: i * squareSize,
            y: j * squareSize,
            filled: false
          });
        }
      }
    };

    const drawSquares = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      squares.forEach(square => {
        ctx.beginPath();
        ctx.rect(square.x, square.y, squareSize, squareSize);
        ctx.strokeStyle = borderColor;
        ctx.stroke();
        
        if (square.filled) {
          ctx.fillStyle = hoverFillColor;
          ctx.fill();
        }
      });
    };

    const moveSquares = () => {
      squares.forEach(square => {
        switch (direction) {
          case 'up':
            square.y -= speed;
            if (square.y + squareSize < 0) square.y = canvas.height;
            break;
          case 'down':
            square.y += speed;
            if (square.y > canvas.height) square.y = -squareSize;
            break;
          case 'left':
            square.x -= speed;
            if (square.x + squareSize < 0) square.x = canvas.width;
            break;
          case 'right':
            square.x += speed;
            if (square.x > canvas.width) square.x = -squareSize;
            break;
          case 'diagonal':
            square.x += speed;
            square.y += speed;
            if (square.x > canvas.width) square.x = -squareSize;
            if (square.y > canvas.height) square.y = -squareSize;
            break;
        }
      });
    };

    const animate = () => {
      moveSquares();
      drawSquares();
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      squares.forEach(square => {
        square.filled = mouseX > square.x && 
                       mouseX < square.x + squareSize && 
                       mouseY > square.y && 
                       mouseY < square.y + squareSize;
      });
    };

    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed, squareSize, direction, borderColor, hoverFillColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        background: 'transparent'
      }}
    />
  );
};

export default Squares;