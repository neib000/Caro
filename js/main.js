
$(document).ready(function() {
	color = null;
	playerColor = null;
	endGame = false;
	// Đầu tiên chọn X hoặc O
	$("#pick-color").modal("show");
	//Tạo bàn cờ
	b = new Board(19);
	let matrix = b.getMatrix();

	/* Vẽ bàn cờ */
	matrix.forEach(function(column, i) {
		$("#board").append(`<tr id="row-${i}"></tr>`);
		column.forEach(function(square, j) {
			$(`#row-${i}`).append(`<td id="square-${i}-${j}">0</td>`);
		});
	});

	/* Sư kiện khi nhấp chuột */
	$("td").click(function(event) {
		if(!endGame) {
			let position = String(event.target.id).split("-");
			let x = position[1];
			let y = position[2];
	
			if(b.getColor(x,y) == "blank") {
				play(x, y);
			}
		} else {
			$("#end-game").modal("show");
		}
	});
});

function checkVictory(x, y) {
	if(b.checkVictory(x, y)) {
		endGame = true;
		if(b.getColor(x,y) == playerColor) {
			$("#wingame").addClass("humanwin");
		} else {
			$("#wingame").addClass("comwin");
		}
		$("#end-game").modal("show");

		return true;
	} else {
		return false;
	}
}
//Chọn X và O
function pickColor(c) {
	color = c;
	playerColor = c;
	$("#pick-color").modal("hide");
	//chọn depth
	let depth = parseInt($("#depth").val());

	//Tạo Ai
	ia = new AI(depth, c);

	// Nếu chọn X thì máy đánh trước
	if(playerColor == "white") {
		color = "black";
		computerPlay();
	}
}
//Đổi lượt chơi X và O
function switchColor() {
	switch (color) {
	case "black":
		color = "white";
		break;
	case "white":
		color = "black";
	}
}

function play(x, y) {
	b.play(color, x, y);
	$(`#square-${x}-${y}`).addClass(color);

	// b.printMatrix();
	switchColor();
	
	//Nếu chưa thắng thì máy đánh
	if(!checkVictory(x, y)) {
		computerPlay();
	}
}

//Máy đánh 
function computerPlay() {
	let iaMove = ia.getBestMove(b);
	b.play(color, iaMove[0], iaMove[1]);
	$(`#square-${iaMove[0]}-${iaMove[1]}`).addClass(color);

	// b.printMatrix();
	switchColor();
	checkVictory(iaMove[0], iaMove[1]);
}
//Xem lại kết quả
function lookBoard() {
	$("#end-game").modal("hide");
}