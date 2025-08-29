import snakeIcon from './assets/images/snake.svg';
import tetrisIcon from './assets/images/tetris.svg';
import birdIcon from './assets/images/bird.svg';

const games = [
  {
    id: "snake",
    name: "Snake",
    description: "El clásico juego de la serpiente que crece",
    icon: "🐍",
    shadowColor: "shadow-gray-400",
    path: "./src/games/game1/"
  },
  {
    id: "tetris", 
    name: "Tetris",
    description: "Encaja las piezas y completa líneas",
    icon: "■",
    shadowColor: "shadow-gray-500",
    path: "./src/games/game2/"
  },
  {
    id: "flappy-bird",
    name: "Flappy Bird", 
    description: "Vuela entre los obstáculos sin chocar",
    icon: "bird",
    shadowColor: "shadow-gray-600",
    path: "./src/games/game3/"
  },
];

class GameMenu {
  constructor() {
    this.displayText = "";
    this.isDeleting = false;
    this.fullText = "Games";
    this.init();
  }

  init() {
    this.createTypingAnimation();
    this.renderGames();
  }

  createTypingAnimation() {
    const titleElement = document.getElementById('animated-title');
    const cursor = titleElement.querySelector('.animate-pulse');
    
    const typeEffect = () => {
      const timeout = setTimeout(() => {
        if (!this.isDeleting) {
          if (this.displayText.length < this.fullText.length) {
            this.displayText = this.fullText.slice(0, this.displayText.length + 1);
            titleElement.innerHTML = `${this.displayText}<span class="animate-pulse text-gray-600">_</span>`;
          } else {
            setTimeout(() => {
              this.isDeleting = true;
              typeEffect();
            }, 2000);
            return;
          }
        } else {
          if (this.displayText.length > 0) {
            this.displayText = this.displayText.slice(0, -1);
            titleElement.innerHTML = `${this.displayText}<span class="animate-pulse text-gray-600">_</span>`;
          } else {
            this.isDeleting = false;
          }
        }
        typeEffect();
      }, this.isDeleting ? 100 : 200);
    };

    typeEffect();
  }

  renderGames() {
    const container = document.getElementById('games-container');
    
    games.forEach((game, index) => {
      const gameCard = this.createGameCard(game, index);
      container.appendChild(gameCard);
    });
  }

  createGameCard(game, index) {
  const card = document.createElement('div');
  // add a class matching the game id so CSS can apply per-card colors/glows
  card.className = `game-card ${game.id} overflow-hidden group cursor-pointer transition-all duration-300 rounded-lg game-card-hover`;
    card.style.animationDelay = `${index * 0.2}s`;
    
    card.addEventListener('click', () => this.handleGameSelect(game.id, game.path));

    card.innerHTML = `
      <div class="p-8 text-center relative">
        <!-- Icono principal -->
        <div class="w-20 h-20 mx-auto mb-6 rounded-2xl icon-box ${game.id}-icon flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          ${this.getGameIcon(game)}
        </div>

        <!-- Contenido -->
        <h3 class="text-2xl font-bold text-black mb-3 group-hover:text-gray-700 transition-colors">
          ${game.name}
        </h3>
        <p class="text-gray-600 mb-6 leading-relaxed">${game.description}</p>

        <!-- Botón -->
  <button class="w-full btn btn-${game.id} text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg">
          Jugar Ahora
        </button>
      </div>
    `;

    return card;
  }

  getGameIcon(game) {
    switch(game.id) {
      case 'snake':
        return `<img src="${snakeIcon}" alt="snake" class="game-icon"/>`;
      case 'tetris':
        return `<img src="${tetrisIcon}" alt="tetris" class="game-icon"/>`;
      case 'flappy-bird':
        return `<img src="${birdIcon}" alt="flappy bird" class="game-icon"/>`;
      default:
        return '<span class="text-white text-2xl">🎮</span>';
    }
  }

  handleGameSelect(gameId, gamePath) {
    console.log(`Navegando a ${gameId}`);
    // Redirigir al juego específico
    window.location.href = `${gamePath}index.html`;
  }
}

// Inicializar el menú cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new GameMenu();
});