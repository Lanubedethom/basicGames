export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        
        // Configuración del juego
        this.gridSize = 20;
        this.gameWidth = 400;
        this.gameHeight = 400;
        this.gameOffsetX = 300;
        this.gameOffsetY = 100;
        
        // Variables del juego
        this.snake = [];
        this.food = {};
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.gameRunning = false;
        this.gameOver = false;
    }

    preload() {
        // Crear sprites simples con gráficos generados
        this.load.image('pixel', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    }

    create() {
        // Crear sprites en memoria
        this.createSprites();
        
        // UI Panel izquierdo
        this.createUI();
        
        // Área del juego
        this.createGameArea();
        
        // Controles
        this.setupControls();
        
        // Inicializar juego
        this.resetGame();
    }

    createSprites() {
        // Crear sprite para el cuerpo de la serpiente (negro)
        this.add.graphics()
            .fillStyle(0x000000)
            .fillRect(0, 0, this.gridSize, this.gridSize)
            .generateTexture('snake-body', this.gridSize, this.gridSize);
        
        // Crear sprite para la cabeza de la serpiente (negro con bordes)
        this.add.graphics()
            .lineStyle(2, 0x000000)
            .fillStyle(0x000000)
            .fillRect(0, 0, this.gridSize, this.gridSize)
            .strokeRect(0, 0, this.gridSize, this.gridSize)
            .generateTexture('snake-head', this.gridSize, this.gridSize);
        
        // Crear sprite para la comida (círculo negro)
        this.add.graphics()
            .fillStyle(0x000000)
            .fillCircle(this.gridSize/2, this.gridSize/2, this.gridSize/2 - 2)
            .generateTexture('food', this.gridSize, this.gridSize);
    }

    createUI() {
        // Panel izquierdo
    const panelBg = this.add.rectangle(150, 300, 280, 580, 0x161F2F);
    panelBg.setStrokeStyle(2, 0x222831);
        
        // Título SNAKE
        this.add.text(150, 80, 'SNAKE', {
            fontFamily: 'Courier New',
            fontSize: '48px',
            fill: '#E6EEF6',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        // Botones/Opciones
        const startBtn = this.add.text(150, 150, 'START', {
            fontFamily: 'Courier New',
            fontSize: '24px',
            fill: '#161F2F',
            backgroundColor: this.gameRunning ? '#cccccc' : '#161F2F',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive();
        
        this.scoreText = this.add.text(150, 200, 'SCORE\n0', {
            fontFamily: 'Courier New',
            fontSize: '18px',
            fill: '#E6EEF6',
            align: 'center'
        }).setOrigin(0.5);
        
        const exitBtn = this.add.text(150, 250, 'EXIT', {
            fontFamily: 'Courier New',
            fontSize: '24px',
            fill: '#E6EEF6',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive();
        
        // Controles
        this.add.text(150, 350, 'CONTROLS:', {
            fontFamily: 'Courier New',
            fontSize: '16px',
            fill: '#E6EEF6',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        this.add.text(150, 400, 'ARROW KEYS\nto move\n\nSPACE\nto start/pause', {
            fontFamily: 'Courier New',
            fontSize: '14px',
            fill: '#E6EEF6',
            align: 'center',
            lineSpacing: 5
        }).setOrigin(0.5);
        
        // Game Over text (oculto inicialmente)
        this.gameOverText = this.add.text(150, 480, 'GAME OVER\n\nPress SPACE\nto restart', {
            fontFamily: 'Courier New',
            fontSize: '18px',
            fill: '#E6EEF6',
            align: 'center',
            fontWeight: 'bold'
        }).setOrigin(0.5).setVisible(false);
        
        // Event listeners
        startBtn.on('pointerdown', () => this.startGame());
        exitBtn.on('pointerdown', () => window.location.href = '../../../index.html');
    }

    createGameArea() {
        // Fondo del área de juego
        const gameBg = this.add.rectangle(
            this.gameOffsetX + this.gameWidth/2, 
            this.gameOffsetY + this.gameHeight/2, 
            this.gameWidth, 
            this.gameHeight, 
            0x161F2F
        );
        gameBg.setStrokeStyle(3, 0x000000);
        
        // Grilla
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x000000, 0.3);
        
        // Líneas verticales
        for (let x = this.gameOffsetX; x <= this.gameOffsetX + this.gameWidth; x += this.gridSize) {
            graphics.moveTo(x, this.gameOffsetY);
            graphics.lineTo(x, this.gameOffsetY + this.gameHeight);
        }
        
        // Líneas horizontales
        for (let y = this.gameOffsetY; y <= this.gameOffsetY + this.gameHeight; y += this.gridSize) {
            graphics.moveTo(this.gameOffsetX, y);
            graphics.lineTo(this.gameOffsetX + this.gameWidth, y);
        }
        
        graphics.strokePath();
    }

    setupControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        this.input.keyboard.on('keydown', (event) => {
            if (!this.gameRunning || this.gameOver) return;
            
            switch (event.code) {
                case 'ArrowUp':
                    if (this.direction !== 'down') this.nextDirection = 'up';
                    break;
                case 'ArrowDown':
                    if (this.direction !== 'up') this.nextDirection = 'down';
                    break;
                case 'ArrowLeft':
                    if (this.direction !== 'right') this.nextDirection = 'left';
                    break;
                case 'ArrowRight':
                    if (this.direction !== 'left') this.nextDirection = 'right';
                    break;
            }
        });
        
        this.spaceKey.on('down', () => {
            if (this.gameOver) {
                this.resetGame();
            } else {
                this.toggleGame();
            }
        });
    }

    resetGame() {
        // Limpiar serpiente anterior
        this.snake.forEach(segment => segment.destroy());
        if (this.food.sprite) this.food.sprite.destroy();
        
        // Inicializar serpiente
        this.snake = [];
        const startX = 5;
        const startY = 10;
        
        for (let i = 0; i < 3; i++) {
            const segment = this.add.sprite(
                this.gameOffsetX + (startX - i) * this.gridSize + this.gridSize/2,
                this.gameOffsetY + startY * this.gridSize + this.gridSize/2,
                i === 0 ? 'snake-head' : 'snake-body'
            );
            this.snake.push(segment);
        }
        
        // Reset variables
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.gameRunning = false;
        this.gameOver = false;
        
        // Crear comida
        this.createFood();
        
        // Update UI
        this.updateScore();
        this.gameOverText.setVisible(false);
    }

    createFood() {
        let foodX, foodY;
        do {
            foodX = Phaser.Math.Between(0, (this.gameWidth / this.gridSize) - 1);
            foodY = Phaser.Math.Between(0, (this.gameHeight / this.gridSize) - 1);
        } while (this.isSnakePosition(foodX, foodY));
        
        if (this.food.sprite) this.food.sprite.destroy();
        
        this.food = {
            x: foodX,
            y: foodY,
            sprite: this.add.sprite(
                this.gameOffsetX + foodX * this.gridSize + this.gridSize/2,
                this.gameOffsetY + foodY * this.gridSize + this.gridSize/2,
                'food'
            )
        };
    }

    isSnakePosition(x, y) {
        return this.snake.some(segment => {
            const segX = Math.floor((segment.x - this.gameOffsetX - this.gridSize/2) / this.gridSize);
            const segY = Math.floor((segment.y - this.gameOffsetY - this.gridSize/2) / this.gridSize);
            return segX === x && segY === y;
        });
    }

    startGame() {
        this.gameRunning = true;
        this.gameLoop = this.time.addEvent({
            delay: 150,
            callback: this.updateGame,
            callbackScope: this,
            loop: true
        });
    }

    toggleGame() {
        if (this.gameRunning && this.gameLoop) {
            this.gameLoop.paused = !this.gameLoop.paused;
        } else {
            this.startGame();
        }
    }

    updateGame() {
        if (!this.gameRunning || this.gameOver) return;
        
        this.direction = this.nextDirection;
        
        // Obtener posición de la cabeza
        const head = this.snake[0];
        const headX = Math.floor((head.x - this.gameOffsetX - this.gridSize/2) / this.gridSize);
        const headY = Math.floor((head.y - this.gameOffsetY - this.gridSize/2) / this.gridSize);
        
        // Calcular nueva posición
        let newX = headX;
        let newY = headY;
        
        switch (this.direction) {
            case 'up': newY--; break;
            case 'down': newY++; break;
            case 'left': newX--; break;
            case 'right': newX++; break;
        }

    // Debug: log positions
    console.debug('updateGame tick:', { headX, headY, direction: this.direction, newX, newY, cols: this.gameWidth/this.gridSize, rows: this.gameHeight/this.gridSize });
    console.debug('snake positions:', this.snake.map(s => Math.floor((s.x - this.gameOffsetX - this.gridSize/2)/this.gridSize) + ',' + Math.floor((s.y - this.gameOffsetY - this.gridSize/2)/this.gridSize)));
        
        // Verificar colisiones con paredes
        if (newX < 0 || newX >= this.gameWidth/this.gridSize || 
            newY < 0 || newY >= this.gameHeight/this.gridSize) {
            console.debug('hit wall -> endGame');
            this.endGame();
            return;
        }
        
        // Verificar colisión con cuerpo
        if (this.isSnakePosition(newX, newY)) {
            console.debug('hit self -> endGame');
            this.endGame();
            return;
        }
        
        // Verificar comida
        const ateFood = (newX === this.food.x && newY === this.food.y);
        
        // Mover serpiente
        if (!ateFood) {
            const tail = this.snake.pop();
            tail.destroy();
        } else {
            this.score += 10;
            this.updateScore();
            this.createFood();
        }
        
        // Agregar nueva cabeza
        const newHead = this.add.sprite(
            this.gameOffsetX + newX * this.gridSize + this.gridSize/2,
            this.gameOffsetY + newY * this.gridSize + this.gridSize/2,
            'snake-head'
        );
        
        // Convertir cabeza anterior en cuerpo
        if (this.snake[0]) {
            this.snake[0].setTexture('snake-body');
        }
        
        this.snake.unshift(newHead);
    }

    endGame() {
        this.gameOver = true;
        this.gameRunning = false;
        if (this.gameLoop) this.gameLoop.destroy();
        this.gameOverText.setVisible(true);
    }

    updateScore() {
        this.scoreText.setText(`SCORE\n${this.score}`);
    }
}