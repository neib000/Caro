var A_Atk = [0,2,4,20,100,105,110,115,120,130];
var A_Def = [0,1,3,15,55,56,57,58,60,62];

function AIMode()
{
	if (!InGame) return;
	var vmax = -Infinity;
	var px = py = -1;
	var TBoard = GetBoard();
	//thuật toán minmax tìm điểm cao nhất để đánh
	for (y = 0; y < size; y++)
	{
		for (x = 0; x < size; x++)
		{
			//nếu nước cờ chưa có ai đánh và không bị cắt tỉa thì mới xét giá trị MinMax
			if (TBoard[x+y*size] == -1)
			{
				//Thử dánh X rồi tính điểm
				TBoard[x+y*size] = 1;
				//Tính điểm mỗi ô đánh
				var mark = GetMark(x,y,TBoard);
				//Reset lại ô 
				TBoard[x+y*size] = -1;
				if (mark > vmax)
				{
					px = x;py = y;
					vmax = mark;
					
				}
			}
		}
	}
	console.log(vmax);
	console.log(py, px);
	try
	{
		var sqr = document.getElementsByClassName("square");
		sqr.item(px + py*size).setAttribute("player","1");
		sqr.item(px + py*size).style.backgroundImage = "url('Images/Xpng.png')";
		l_played.push(px+py*size);
	}
	catch(e) {alert(e.message)}
}

// function minimax(node, depth, maxmimizingPlayer){
// 	if(node || depth == 0){
// 		return node;
// 	}
// 	if(maxmimizingPlayer){
// 		max = -Infinity;
// 		node.forEach(element => {
// 			max = maxab(max,minimax(element,depth-1,false))
// 		});
// 		return max;
// 	}else{
// 		min = Infinity;
// 		node.forEach(element => {
// 			min = minab(min,minimax(element,depth-1,true))
// 		});
// 		return min;
// 	}
// }
// function minimax2(node, depth, maxmimizingPlayer){
// 	return alphabeta(node, depth,-Infinity,-Infinity, maxmimizingPlayer)
// }
// function alphabeta(node, depth,a,b, maxmimizingPlayer){
// 	if(node || depth == 0){
// 		return node;
// 	}
// 	if(maxmimizingPlayer){
		
// 		node.forEach(element => {
// 			a = maxab(max,alphabeta(element,depth-1,a,b ,false));
// 			if (a >= b) break;
// 		});
// 		return max;
// 	}else{
// 		min = Infinity;
// 		node.forEach(element => {
// 			b = minab(min,alphabeta(element,depth-1,a,b ,true));
// 			if (a >= b) break;
// 		});
// 		return min;
// 	}
// }

//Tính điểm cho mỗi ô
function GetMark(x,y,Tboard)
{
	var val = Tboard[x+y*size];
	if (val == -1) return 0;
	var result = A_Atk[GetMarkHor(x,y,Tboard,1)] + A_Atk[GetMarkVer(x,y,Tboard,1)] 
	+ A_Atk[GetMarkCross1(x,y,Tboard,1)] + A_Atk[GetMarkCross2(x,y,Tboard,1)];
	// console.log(result);
	//console.log(A_Atk[GetMarkHor(x,y,Tboard,1)]);
	result += A_Def[GetMarkHor(x,y,Tboard,0)] + A_Def[GetMarkVer(x,y,Tboard,0)] 
	+ A_Def[GetMarkCross1(x,y,Tboard,0)] + A_Def[GetMarkCross2(x,y,Tboard,0)];
	return result;
}

//Lấy các trường hợp đánh ngang
function GetMarkHor(x,y,TBoard,player)
{
	//count là AI, counto là người chơi
	var count = 0,counto = 0;
	for (i = x-1;i > 0;i--)
	{
		if (TBoard[i+y*size] == player) count++;
		else {if (TBoard[i+y*size] != -1) counto++;break;}
	}
	for (i = x+1;i < size;i++)
	{
		if (TBoard[i+y*size] == player) count++;
		else {if (TBoard[i+y*size] != -1) counto++;break;}
	}
	if (mode == 1 && counto >= 2) return 0;
	//x==0 là điểm đầu hàng
	//x==size-1 là điểm cuối hàng
	if ((x == 0 || x == size-1) && count < 4) counto++;
	if (count <= counto) return 0;
	else if (count - counto >= 3) return count + counto;
	else return count - counto;
}

//Lấy các trường hợp đánh dọc
function GetMarkVer(x,y,TBoard,player)
{
	
	var count = 0,counto = 0;
	for (i = y-1;i > 0;i--)
	{
		if (TBoard[x+i*size] == player) count++;
		else {if (TBoard[x+i*size] != -1) counto++;break;}
	}
	for (i = y+1;i < size;i++)
	{
		if (TBoard[x+i*size] == player) count++;
		else {if (TBoard[x+i*size] != -1) counto++;break;}
	}
	if (mode == 1 && counto >= 2) return 0;
	if ((y == 0 || y == size-1) && count < 4) counto++;
	if (count <= counto) return 0;
	else if (count - counto >= 3) return count + counto;
	else return count - counto;
}

//Lấy các trường hợp đánh chéo \
function GetMarkCross1(x,y,TBoard,player)
{
	var count = 0,counto = 0;
	for (i = 1;i < minab(size-x,y+1);i++)
	{
		if (TBoard[(x+i)+(y-i)*size] == player) count++;
		else {if (TBoard[(x+i)+(y-i)*size] != -1) counto++;break;}
	}
	for (i = 1;i < minab(x+1,size-y);i++)
	{
		if (TBoard[(x-i)+(y+i)*size] == player) count++;
		else {if (TBoard[(x-i)+(y+i)*size] != -1) counto++;break;}
	}
	if (mode == 1 && counto >= 2) return 0;
	//4 góc
	if ((x == 0 || x == size-1 || y == 0 || y == size-1) && count < 4) counto++;
	if (count <= counto) return 0;
	else if (count - counto >= 3) return count + counto;
	else return count - counto;
}

//Lấy các trường hợp đánh chéo /

function GetMarkCross2(x,y,TBoard,player)
{
	var count = 0,counto = 0;
	for (i = 1;i < minab(x+1,y+1);i++)
	{
		if (TBoard[(x-i)+(y-i)*size] == player) count++;
		else {if (TBoard[(x-i)+(y-i)*size] != -1) counto++;break;}
	}
	for (i = 1;i < minab(size-x,size-y);i++)
	{
		if (TBoard[(x+i)+(y+i)*size] == player) count++;
		else {if (TBoard[(x+i)+(y+i)*size] != -1) counto++;break;}
	}
	if (mode == 1 && counto >= 2) return 0;
	if ((x == 0 || x == size-1 || y == 0 || y == size-1) && count < 4) counto++;
	if (count <= counto) return 0;
	else if (count - counto >= 3) return count + counto;
	else return count - counto;
}