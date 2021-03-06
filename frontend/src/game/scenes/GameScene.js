import Directions from '../utils/direction';
import config from '../utils/config';

let score = 0;
const level = localStorage.getItem('level') || 1;
let timerCountdownEvent;

export default class extends Phaser.Scene {
  rnd = new Phaser.Math.RandomDataGenerator(10);
  playTime = config.playTime;
  countDownText;

  preload() {}

  create() {
    this.playTime = config.playTime;
    score = 0;
    this.countDownText = this.add.text(10, 10, this.playTime);
    timerCountdownEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.playTime -= 1;
        this.countDownText.setText(this.playTime);
      },
      loop: true,
    });
    var Food = new Phaser.Class({
      Extends: Phaser.GameObjects.Image,

      initialize: function Food(scene, x, y) {
        Phaser.GameObjects.Image.call(this, scene);

        this.setTexture('food');
        this.setPosition(x * 16, y * 16);
        this.setOrigin(0);

        this.total = 0;

        scene.children.add(this);
      },

      eat: function () {
        this.total++;
      },
    });

    var Snake = new Phaser.Class({
      initialize: function Snake(scene, x, y) {
        this.headPosition = new Phaser.Geom.Point(x, y);

        this.body = scene.add.group();

        this.head = this.body.create(x * 16, y * 16, 'body');
        this.head.setOrigin(0);

        this.alive = true;

        this.speed = 150 - level * 5;

        this.moveTime = 0;

        this.tail = new Phaser.Geom.Point(x, y);

        this.heading = Directions.RIGHT;
        this.direction = Directions.RIGHT;
      },

      update: function (time) {
        if (time >= this.moveTime) {
          return this.move(time);
        }
      },

      faceLeft: function () {
        if (
          this.direction === Directions.UP ||
          this.direction === Directions.DOWN
        ) {
          this.heading = Directions.LEFT;
        }
      },

      faceRight: function () {
        if (
          this.direction === Directions.UP ||
          this.direction === Directions.DOWN
        ) {
          this.heading = Directions.RIGHT;
        }
      },

      faceUp: function () {
        if (
          this.direction === Directions.LEFT ||
          this.direction === Directions.RIGHT
        ) {
          this.heading = Directions.UP;
        }
      },

      faceDown: function () {
        if (
          this.direction === Directions.LEFT ||
          this.direction === Directions.RIGHT
        ) {
          this.heading = Directions.DOWN;
        }
      },

      move: async function (time) {
        /**
         * Based on the heading property (which is the direction the pgroup pressed)
         * we update the headPosition value accordingly.
         *
         * The Math.wrap call allow the snake to wrap around the screen, so when
         * it goes off any of the sides it re-appears on the other.
         */
        switch (this.heading) {
          case Directions.LEFT:
            this.headPosition.x = Phaser.Math.Wrap(
              this.headPosition.x - 1,
              0,
              40
            );
            break;

          case Directions.RIGHT:
            this.headPosition.x = Phaser.Math.Wrap(
              this.headPosition.x + 1,
              0,
              40
            );
            break;

          case Directions.UP:
            this.headPosition.y = Phaser.Math.Wrap(
              this.headPosition.y - 1,
              0,
              30
            );
            break;

          case Directions.DOWN:
            this.headPosition.y = Phaser.Math.Wrap(
              this.headPosition.y + 1,
              0,
              30
            );
            break;
        }

        this.direction = this.heading;

        //  Update the body segments and place the last coordinate into this.tail
        Phaser.Actions.ShiftPosition(
          this.body.getChildren(),
          this.headPosition.x * 16,
          this.headPosition.y * 16,
          1,
          this.tail
        );

        //  Check to see if any of the body pieces have the same x/y as the head
        //  If they do, the head ran into the body

        var hitBody = Phaser.Actions.GetFirst(
          this.body.getChildren(),
          { x: this.head.x, y: this.head.y },
          1
        );

        if (hitBody) {
          this.alive = false;

          return false;
        } else {
          //  Update the timer ready for the next movement
          this.moveTime = time + this.speed;

          return true;
        }
      },

      grow: function () {
        var newPart = this.body.create(this.tail.x, this.tail.y, 'body');

        newPart.setOrigin(0);
      },

      collideWithFood: function (food) {
        if (this.head.x === food.x && this.head.y === food.y) {
          this.grow();

          food.eat();

          //  For every 5 items of food eaten we'll increase the snake speed a little
          if (this.speed > 20 && food.total % 5 === 0) {
            this.speed -= 5;
          }

          return true;
        } else {
          return false;
        }
      },

      updateGrid: function (grid) {
        //  Remove all body pieces from valid positions list
        this.body.children.each(function (segment) {
          var bx = segment.x / 16;
          var by = segment.y / 16;

          grid[by][bx] = false;
        });

        return grid;
      },
    });

    this.food = new Food(this, 3, 4);

    this.snake = new Snake(this, 8, 8);

    //  Create our keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(time) {
    if (!this.snake.alive) {
      return this.scene.start('Death');
    }

    if (score >= 10 || this.playTime === 0) {
      localStorage.setItem('score', score);
      return this.scene.start('Win');
    }

    /**
     * Check which key is pressed, and then change the direction the snake
     * is heading based on that. The checks ensure you don't double-back
     * on yourself, for example if you're moving to the right and you press
     * the LEFT cursor, it ignores it, because the only valid directions you
     * can move in at that time is up and down.
     */
    if (this.cursors.left.isDown) {
      this.snake.faceLeft();
    } else if (this.cursors.right.isDown) {
      this.snake.faceRight();
    } else if (this.cursors.up.isDown) {
      this.snake.faceUp();
    } else if (this.cursors.down.isDown) {
      this.snake.faceDown();
    }

    if (this.snake.update(time)) {
      //  If the snake updated, we need to check for collision against food

      if (this.snake.collideWithFood(this.food)) {
        this.repositionFood();
      }
    }
  }

  /**
   * We can place the food anywhere in our 40x30 grid
   * *except* on-top of the snake, so we need
   * to filter those out of the possible food locations.
   * If there aren't any locations left, they've won!
   *
   * @method repositionFood
   * @return {boolean} true if the food was placed, otherwise false
   */
  repositionFood = () => {
    //  First create an array that assumes all positions
    //  are valid for the new piece of food

    //  A Grid we'll use to reposition the food each time it's eaten
    var testGrid = [];

    for (var y = 0; y < 30; y++) {
      testGrid[y] = [];

      for (var x = 0; x < 40; x++) {
        testGrid[y][x] = true;
      }
    }

    this.snake.updateGrid(testGrid);

    //  Purge out false positions
    var validLocations = [];

    for (var y = 0; y < 30; y++) {
      for (var x = 0; x < 40; x++) {
        if (testGrid[y][x] === true) {
          //  Is this position valid for food? If so, add it here ...
          validLocations.push({ x: x, y: y });
        }
      }
    }

    if (validLocations.length > 0) {
      //  Use the RNG to pick a random food position
      var pos = this.rnd.pick(validLocations);

      //  And place it
      this.food.setPosition(pos.x * 16, pos.y * 16);
      score += 1;

      return true;
    } else {
      return false;
    }
  };
}
