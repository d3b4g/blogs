/**
 * Matrix Rain Background Effect
 * Creates a subtle falling binary/hex code animation
 */
(function() {
  'use strict';

  class MatrixRain {
    constructor(options = {}) {
      this.canvas = null;
      this.ctx = null;
      this.columns = [];
      this.fontSize = options.fontSize || 14;
      this.speed = options.speed || 0.5;
      this.opacity = options.opacity || 0.03;
      this.color = options.color || '#00ff41';
      this.characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
      this.resizeTimeout = null;
      
      this.init();
    }

    init() {
      // Create canvas element
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'matrix-rain';
      this.canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
        opacity: ${this.opacity};
      `;
      
      document.body.insertBefore(this.canvas, document.body.firstChild);
      this.ctx = this.canvas.getContext('2d');
      
      this.resize();
      window.addEventListener('resize', () => this.handleResize());
      
      this.animate();
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      
      const columnCount = Math.floor(this.canvas.width / this.fontSize);
      this.columns = [];
      
      for (let i = 0; i < columnCount; i++) {
        this.columns[i] = {
          y: Math.random() * this.canvas.height,
          speed: 0.5 + Math.random() * this.speed,
          chars: this.generateColumnChars()
        };
      }
    }

    handleResize() {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => this.resize(), 200);
    }

    generateColumnChars() {
      const chars = [];
      const length = Math.floor(5 + Math.random() * 15);
      for (let i = 0; i < length; i++) {
        chars.push(this.characters.charAt(Math.floor(Math.random() * this.characters.length)));
      }
      return chars;
    }

    draw() {
      // Fade effect
      this.ctx.fillStyle = 'rgba(13, 17, 23, 0.05)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.font = `${this.fontSize}px "JetBrains Mono", monospace`;
      
      for (let i = 0; i < this.columns.length; i++) {
        const column = this.columns[i];
        const x = i * this.fontSize;
        
        // Draw characters in the column
        for (let j = 0; j < column.chars.length; j++) {
          const y = column.y - (j * this.fontSize);
          
          if (y > 0 && y < this.canvas.height) {
            // Leading character is brighter
            if (j === 0) {
              this.ctx.fillStyle = '#ffffff';
            } else if (j < 3) {
              this.ctx.fillStyle = this.color;
            } else {
              const alpha = Math.max(0.1, 1 - (j / column.chars.length));
              this.ctx.fillStyle = `rgba(0, 255, 65, ${alpha * 0.5})`;
            }
            
            this.ctx.fillText(column.chars[j], x, y);
          }
        }
        
        // Move column down
        column.y += column.speed;
        
        // Reset column when it goes off screen
        if (column.y - (column.chars.length * this.fontSize) > this.canvas.height) {
          column.y = 0;
          column.chars = this.generateColumnChars();
          column.speed = 0.5 + Math.random() * this.speed;
        }
        
        // Randomly change a character
        if (Math.random() > 0.98) {
          const randomIndex = Math.floor(Math.random() * column.chars.length);
          column.chars[randomIndex] = this.characters.charAt(
            Math.floor(Math.random() * this.characters.length)
          );
        }
      }
    }

    animate() {
      this.draw();
      requestAnimationFrame(() => this.animate());
    }

    destroy() {
      window.removeEventListener('resize', this.handleResize);
      if (this.canvas && this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.matrixRain = new MatrixRain({
        opacity: 0.04,
        speed: 0.8,
        fontSize: 14
      });
    });
  } else {
    window.matrixRain = new MatrixRain({
      opacity: 0.04,
      speed: 0.8,
      fontSize: 14
    });
  }
})();
