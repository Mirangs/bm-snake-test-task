import config from '../utils/config';

const level = localStorage.getItem('level');

export default class extends Phaser.Scene {
  preload() {
    this.add
      .text(
        config.width * 0.5,
        config.height * 0.45,
        `${
          level < 9
            ? 'You win! Go to next level?'
            : 'You have reached maximum level,\ncongratulations!'
        }`
      )
      .setFont('40px silkscreen')
      .setFill(config.fillColor)
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .on('pointerdown', this.nextLevel);
  }

  async create() {
    const userId = localStorage.getItem('userId');
    const score = +localStorage.getItem('score') || 0;

    try {
      await fetch('http://localhost:3000/api/ratings', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ userId, rating: score }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  nextLevel = () => {
    if (level < 10) {
      localStorage.setItem('level', +level + 1 || 1);
    }
    this.scene.start('Boot');
  };
}
