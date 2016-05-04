/* Includes: 
    IdentifierType.Validate()
    isDefined(obj)
*/

IdentifierType.Validate = function( args ) { 
    return( args === IdentifierType.Guid || args === IdentifierType.Numeric || args === IdentifierType.Opaque || args === IdentifierType.String );
}

// function that is useful for ALL scripts
function isDefined( obj ) {
    var result = true;
    if( obj === undefined || obj === null ) {
        result = false;
    }
    else if( obj.length !== undefined && obj.length > 0 && typeof( obj ) !== "string" && typeof( obj ) !== "function" ) {
        for( var o=0; o<obj.length; o++ ) {
            if( !isDefined( obj[o] ) ) { 
                result = false;
                break;
            }
        }//for o
    }
    return( result);
}// function isDefined( obj )