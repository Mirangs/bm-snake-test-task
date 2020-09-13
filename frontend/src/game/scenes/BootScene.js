import Phaser from 'phaser';
import config from '../utils/config';
import food from '../assets/coin.png';
import body from '../assets/player.png';

export default class extends Phaser.Scene {
  preload() {
    this.load.image('food', food);
    this.load.image('body', body);

    this.add
      .text(config.width * 0.5, config.height * 0.3, 'Click to start game')
      .setFont('40px silkscreen')
      .setFill(config.fillColor)
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .on('pointerdown', this.startGame);
  }

  startGame = () => {
    this.scene.start('Game');
  };
}
