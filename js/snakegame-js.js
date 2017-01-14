var EMPTY = 0,
    SNAKE = 1,
    FOOD = 2;
var UP = 3,
    DOWN = 4,
    LEFT = 5,
    RIGHT = 6;
var C = 26,
    R = 26;
var Canvas, ctx, key, frames, scorecount;
var KLEFT = 37,
    KUP = 38,
    KRIGHT = 39,
    KDOWN = 40;
var PAUSE = 0;
if (window.innerHeight > window.innerWidth){
  var CELLSIZE = 0.0325 * window.innerWidth;
}else {
  var CELLSIZE = 0.0325 * window.innerHeight;
}

var Grid = {
    width: null,
    height: null,
    grid: null,
    init: function(v, c, r) {
        this.grid = [];
        this.width = c;
        this.height = r;
        for (var i = 0; i < c; i++) {
            this.grid.push([]);
            for (var j = 0; j < r; j++) {
                this.grid[i].push(v);
            }
        }
    },
    set: function(v, x, y) {
        this.grid[x][y] = v;
    },
    get: function(x, y) {
        return this.grid[x][y];
    }
};

var Snake = {
    direction: null,
    tail: null,
    snake: null,
    init: function(v, x, y) {
        this.direction = v;
        this.snake = [];
        this.addpart(x, y);
    },

    addpart: function(x, y) {
        this.snake.unshift({
            x: x,
            y: y
        });
        this.tail = this.snake[0];
    },

    cutpart: function() {
        return this.snake.pop();
    }
};

function setfoodposition() {
    var emptyarr = [];
    for (var i = 0; i < Grid.width; i++) {
        for (var j = 0; j < Grid.height; j++) {
            emptyarr.push({
                x: i,
                y: j
            });
        }
    }
    do {
        var foodpos = emptyarr[Math.floor(Math.random() * emptyarr.length)];
    } while (Grid.get(foodpos.x, foodpos.y) === SNAKE);
    Grid.set(FOOD, foodpos.x, foodpos.y);
    return foodpos;
}

function main() {
    Canvas = document.createElement('canvas');
    Canvas.width = C * CELLSIZE;
    Canvas.height = R * CELLSIZE;
    ctx = Canvas.getContext('2d');
    document.body.appendChild(Canvas);
    key = {};
    frames = 0;
    // scorecount = 0;
    document.addEventListener("keydown", function(event) {
        key[event.keyCode] = true;
        //console.log(event.keyCode);
    });
    document.addEventListener("keyup", function(event) {
        //console.log(event.keyCode);
        delete key[event.keyCode];
    });
    init();
    loop();
}

function init() {
    Grid.init(EMPTY, C, R);
    var randompos = {
        x: Math.floor(C / 2),
        y: R - 1,
    };
    scorecount = 0;
    Snake.init(UP, randompos.x, randompos.y);
    Grid.set(SNAKE, randompos.x, randompos.y);
    var x = setfoodposition();
}

function update() {
    frames++;
    if (key[KLEFT] && Snake.direction != RIGHT)
        Snake.direction = LEFT;
    if (key[KUP] && Snake.direction != DOWN)
        Snake.direction = UP;
    if (key[KRIGHT] && Snake.direction != LEFT)
        Snake.direction = RIGHT;
    if (key[KDOWN] && Snake.direction != UP)
        Snake.direction = DOWN;

    var tailx = Snake.tail.x;
    var taily = Snake.tail.y;
    //console.log(Snake.direction);
    if (frames % 5 === 0) {
        switch (Snake.direction) {
            case UP:
                taily--;
                break;
            case DOWN:
                taily++;
                break;
            case LEFT:
                tailx--;
                break;
            case RIGHT:
                tailx++;
                break;
        }
    }
    if (tailx < 0 || taily < 0 || tailx > Grid.width - 1 || taily > Grid.height - 1){
        alert('Game Over!! Your score was ' + scorecount);
        return init();
    }
    if (Grid.get(tailx, taily) === FOOD) {
        var newhead = {
            x: tailx,
            y: taily
        };
        var fx = setfoodposition();
        //console.log('food:' + fx.x + ':' + fx.y);
        scorecount++;

        //console.log(tailx + ":" + taily);
        //console.log(Snake.direction);
    } else {
        var newhead = Snake.cutpart();
        Grid.set(EMPTY, newhead.x, newhead.y);
        newhead.x = tailx;
        newhead.y = taily;
    }
    Grid.set(SNAKE, newhead.x, newhead.y);
    Snake.addpart(newhead.x, newhead.y);
    paint();
}

function loop() {
    if (PAUSE === 0) {
        update();
        window.requestAnimationFrame(loop, Canvas);
    }
}

function paint() {
    var cwidth = Canvas.width / Grid.width;
    var cheight = Canvas.height / Grid.height;
    for (var i = 0; i < Grid.width; i++) {
        for (var j = 0; j < Grid.height; j++) {
            switch (Grid.get(i, j)) {
                case EMPTY:
                    ctx.fillStyle = "#a1ed68";
                    break;
                case SNAKE:
                    ctx.fillStyle = "green";
                    break;
                case FOOD:
                    ctx.fillStyle = "red";
                    break;
            }
            ctx.fillRect(cwidth * i, cheight * j, cwidth, cheight);
        }
    }
    var score = "SCORE : " + scorecount;
    ctx.fillStyle = "blue";
    ctx.fillText(score, 10, Canvas.height - 10);
}

document.getElementById('Go').onclick = (function() {
    document.getElementById('intro').style.display = "none";
    document.getElementById('pause').style.display = "block";
    document.getElementById('quit').style.display = "block";
    main();
});
document.getElementById('pause').onclick = (function() {
  if(PAUSE === 0){
    PAUSE = 1;
    this.innerHTML = "Resume";
  }else {
    PAUSE = 0;
    this.innerHTML = "Pause";
    loop();
  }
});
document.getElementById('quit').onclick = (function () {
  PAUSE = 1;
  alert('Game Over!! Your score was ' + scorecount);
  setTimeout(function(){
    window.location.reload();
  }, 100);
});
