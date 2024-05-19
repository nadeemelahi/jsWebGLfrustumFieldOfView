/*
 * author: Nadeem Elahi
 * nadeem.elahi@gmail.com
 * nad@3deem.com
 * license: gpl v3
 */
"use strict"; 

// matrix operations - multiplication
// COLUMN MAJOR MATRIX LAYOUT CONVENTION REQUIRED
var nmm = {

	print4Dvector : function ( vec ) {

		var idx , 
			lim = vec.length ,
			dim = 4 ;

		for ( idx = 0 ; idx < lim ; idx += dim ) {

			console.log ( 
				( vec [ idx ] ).toFixed(2) + "  " +
				( vec [ idx + 1 ] ).toFixed(2) + "  " +
				( vec [ idx + 2 ] ).toFixed(2) + "  " +
				( vec [ idx + 3 ] ).toFixed(2) + "  " 
			);

		}
	},

	print4x4mat : function ( mat ) {
		var idx , inc = 4 , lim = 16 ;

		for ( idx = 0 ; idx < lim ; idx += inc ) {

			console.log(
				( mat[idx] ).toFixed(2) + "  " +
				( mat[idx + 1] ).toFixed(2) + "  " +
				( mat[idx + 2] ).toFixed(2) + "  " +
				( mat[idx + 3] ).toFixed(2) + "  " 
			);
				
		}
	},


	// row major 4x4 by 1x4
	// column major 1x4 by 4x4
	multiply1x4times4x4 : function ( vec , four ) {

		var idx, 
			len = vec.length ,
			cnt = len / 4 ,
			cpy = new Float32Array( len );

		for ( idx = 0 ; idx < len ; idx ++ ) {
			cpy[idx] = vec[idx];
		}

		function multiply ( offset ) {

			var idx, jdx , vecdx , cpydx , lim = 4 ;
			
			for ( idx = 0 ; idx < lim ; idx ++ ) {

				vecdx = lim*offset + idx;
				vec[ vecdx ] = 0;

				for ( jdx = 0 ; jdx < lim ; jdx ++ ) {

					cpydx = lim*offset + jdx;

					//console.log( vecdx , cpydx , idx + jdx*lim ) ;
					vec[ vecdx ] += cpy[ cpydx ] * four[ idx + jdx*lim ]
				}
			}
		}

		for ( idx = 0 ; idx < cnt ; idx ++ ) {
			multiply( idx ) ;
		}

	}
};
