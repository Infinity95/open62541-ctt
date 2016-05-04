/*  Test prepared by Nathan Pocock: nathan.pocock@opcfoundation.org
    Description: Reads the same (valid) attribute from the same (valid) node multiple times
        in the same call, checking the values are the same for all returned results. */

function read581013() {
    var items = [ originalScalarItems[0].clone() ];
    for( var i=0; i<4; i++ ) items.push( items[0].clone() );
    if( ReadHelper.Execute( { NodesToRead: items } ) ) {
        //store the value here for comparing to each item read.
        var cachedValue = ReadHelper.Response.Results[0].Value;
        addLog( "Cached value is: " + cachedValue.toString() );

        for( var i=0; i<ReadHelper.Response.Results.length; i++ ) {             // iterate thru item results checking for good data
            if( !cachedValue.equals( ReadHelper.Response.Results[i].Value ) ) { //compare this value to the value in our variable 'cachedValue'
                addError( "Value difference detected. Cached = '" + cachedValue.toString() + "' vs '" + ReadHelper.Response.Results[i].Value.toString() + "'" );
            }
            else print( "  (" + i + ") Value = " + ReadHelper.Response.Results[i].Value.toString() );
        }//for
    }
    return( true );
}

Test.Execute( { Procedure: read581013 } );