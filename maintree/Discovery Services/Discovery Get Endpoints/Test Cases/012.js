/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Repeats test #1 100 times. Must complete within 10-seconds. */

// include the script that we'll invoke
include( "./maintree/Discovery Services/Discovery Get Endpoints/Test Cases/010.js" );

function getendpoints016() {
    const MAXCOUNT = 100;
    try {
        for( var i=0; i<MAXCOUNT-1; i++ ) getEndpoints552010();
        return( true );
    }
    catch( ex ) {
        addError( "Unexpected error invoking the test-script 'getEndpoints552010'.\n\t" + ex.toString() );
        return( false );
    }
}

Test.Execute( { Procedure: getendpoints016 } );