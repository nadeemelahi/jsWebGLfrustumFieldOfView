/*
 * author: Nadeem Elahi
 * nadeem.elahi@gmail.com
 * nad@3deem.com
 * license: gpl v3
 */
"use strict"; 

var gl = ngl.get_gl();

var cw = ngl.get_cw() , 
ch = ngl.get_ch();
console.log(cw , ch );

var x0 = 0 , y0 = 0;

var clr = [ 0.1 , 0.1 , 0.1 ];
ngl.configureDraw( clr , x0 , y0 , cw , ch );

// 3 x 3D(x,y,z) geometry vertices 
// 3 x 3D(red,green,blue) colour channels 
var startIdx = 0;
var dimVec = 4;
var dimClr = 3;

function gen3pointPyramid( radius ){

	var xloc = radius * nmg.calcCOS(120),
		yloc = radius * nmg.calcSIN(120);

	return new Float32Array ( [

		radius   ,   0   ,   0   ,   1   , // 0 right
		 xloc    ,   0   , -yloc ,   1   , // 1 near left
		 xloc    ,   0   ,  yloc ,   1   , // 2 far left

		 0       , radius,   0   ,   1   , // 3 tip
		 xloc    ,   0   , -yloc ,   1   , // 1 near left
		radius   ,   0   ,   0   ,   1   , // 0 right

		 0       , radius,   0   ,   1   , // 3 tip
		radius   ,   0   ,   0   ,   1   , // 0 right
		 xloc    ,   0   ,  yloc ,   1   , // 2 far left

		 0       , radius,   0   ,   1   , // 3 tip
		 xloc    ,   0   ,  yloc ,   1   , // 2 far left
		 xloc    ,   0   , -yloc ,   1   , // 1 near left

	] )
}
var colours =  new Float32Array( [ 
		0.3,0.3,0.3 ,
		0.3,0.3,0.3 ,
		0.3,0.3,0.3 ,

		1,0,0  ,  
		1,0,0  ,  
		1,0,0  ,  

		0.7,0.5,0.8  ,  
		0.7,0.5,0.8  ,  
		0.7,0.5,0.8  ,  

		0.2,0.5,0.2  ,  
		0.2,0.5,0.2  ,  
		0.2,0.5,0.2  ,  

] );

function setPerspective ( verts ) {

	var idx , zdex , step = 4 , lim = verts.length;
	
	// 0-x , 1-y , 2-z , 3-w
	for ( idx = 0 ; idx < lim ; idx += step ) {

		zdex = idx + 2;

		verts[idx+0] *= ( 1 - verts[zdex] ); // x
		verts[idx+1] *= ( 1 - verts[zdex] ); // y
		verts[idx+2] *= ( 1 - verts[zdex] ); // z
	}
}

function setWperspective ( verts ) {

	var idx , zdex , step = 4 , lim = verts.length;
	
	var viewAngle = 
		// 1 // wide
		 0.75 // narrow 
		// 0.5 // more narrow - boring: barely noticeable
		//0.25 // even more narrow - borring: almost orthographics

	;
	// 0-x , 1-y , 2-z , 3-w
	for ( idx = 0 ; idx < lim ; idx += step ) {

		zdex = idx + 2;

		verts[idx+3] = 1 / ( 1 - viewAngle * verts[zdex] ); 
	}

}

var verts , 
	roty = 0 , matroty ,
	rotx = 10 , matrotx ,
	//tx = -0.5 ,
	tz = -0.5 , tzInc = 0.01 , mattrans 
	;

matrotx = nmg.genRotateAboutXmatrix(rotx);

var cnt = colours.length / 3;

ngl.loadAttribute ( "colour" , colours , dimClr );

function drawframe(){

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	function drawPyramid( tx ){
		verts = gen3pointPyramid( 0.25 );

		matroty = nmg.genRotateAboutYmatrix(roty);
		nmm.multiply1x4times4x4( verts , matroty );

		nmm.multiply1x4times4x4( verts , matrotx );

		mattrans = nmg.genTranslationMatrix(tx,0,tz);
		nmm.multiply1x4times4x4( verts , mattrans );

		//setPerspective ( verts );
		setWperspective ( verts );

		ngl.loadAttribute ( "vert" , verts , dimVec );

		gl.drawArrays(gl.TRIANGLES, startIdx, cnt);
	}

	function incrementingDraw( inc , lim ){
		drawPyramid( 0 );
		for ( var idx = 1 ; idx < lim ; idx ++ ){
			drawPyramid (  idx * inc ) ;
			drawPyramid (  -idx * inc ) ;
		}
	}

	incrementingDraw( 0.5 , 4 ); // total 7
	


	roty += 5;
	if (roty > 359) roty = 0;

	tz += tzInc;
	if ( tz > 0.5 || tz < -0.5 ) tzInc *= -1;

	setTimeout ( drawframe , 50 );

}
drawframe();

