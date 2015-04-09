$(document).ready(function () {
	// Get canvas attributes
	var canvas = $("#canvas")[0];
	var context = canvas.getContext("2d");
	var h = canvas.getAttribute("height");
	var w = canvas.getAttribute("width");

	// Create the snake
	var snake;
	var cell_w = 10;
	var d, game_loop, food;
	var score;
	
	// Start game
	function init() {
		d = "right";
		create_snake();
		create_food();
		score = 0;
		if (typeof game_loop != "undefined") {
			clearInterval(game_loop);
		}
		game_loop = setInterval(paint, 60);
	}

	init();

	// Create snake array
	function create_snake() {
		var length = 5;
		snake = [];

		for (var i = length - 1; i >= 0; i--) {
			snake.push({
				x: i,
				y: 0
			});
		}
	}

	// Paint the snake
	function paint() {
		// Painting canvas
		context.fillStyle = "white";
		context.fillRect(0, 0, w, h);
		context.strokeStyle = "black";
		context.strokeRect(0, 0, w, h);

		// Move snake. Pop tail and put it to head.
		var nx = snake[0].x;
		var ny = snake[0].y;
		// Position of the head cell
		if (d == "right") nx++;
		else if (d == "left") nx--;
		else if (d == "up") ny--;
		else if (d == "down") ny++;


		// Restart game on snake collision
		if (nx == -1 || nx == w / cell_w || ny == -1 || 
			ny == h / cell_w || check_collision(nx, ny, snake)) {
			init();
			return;
		}

		// Snake eat food
		if (nx == food.x && ny == food.y) {
			var tail = {
				x: nx,
				y: ny
			};
			score++;
			create_food();
		} else {
			var tail = snake.pop();
			tail.x = nx;
			tail.y = ny;
		}

		snake.unshift(tail);

		for (var i = 0; i < snake.length; i++) {
			var c = snake[i];
			paint_cell(c.x, c.y);
		}

		paint_cell(food.x, food.y);
		var score_text = "Score: " + score;
		context.fillText(score_text, 5, h-5);
	}

	// Paint snake cell
	function paint_cell(x, y) {
		context.fillStyle = "green";
		context.fillRect(x * cell_w, y * cell_w, cell_w, cell_w);
		context.strokeStyle = "white";
		context.strokeRect(x * cell_w, y * cell_w, cell_w, cell_w);
	}

	// Create food for snake
	function create_food() {
		food = {
			x: Math.round(Math.random() * (w - cell_w) / cell_w),
			y: Math.round(Math.random() * (h - cell_w) / cell_w),
		};
	}

	function check_collision(x, y, array) {
		for (var i = 0; i < array.length; i++) {
			if (array[i].x == x && array[i].y == y)
				return true;
		}
		return false;
	}

	// Keyboard controls
	$(document).keydown(function (e) {
		var key = e.which;
		if (key == "37" && d != "right") d = "left";
		else if (key == "38" && d != "down") d = "up";
		else if (key == "39" && d != "left") d = "right";
		else if (key == "40" && d != "up") d = "down";
	})
});