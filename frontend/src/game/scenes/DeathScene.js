import config from '../utils/config';

export default class extends Phaser.Scene {
  preload() {
    this.add
      .text(config.width * 0.5, config.height * 0.45, 'You are dead. Restart?')
      .setFont('40px silkscreen')
      .setFill(config.fillColor)
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .on('pointerdown', this.restart);
  }

  restart = () => {
    this.scene.start('Boot');
  };
}
