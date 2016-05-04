/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Repeats test #1 100 times. Must complete within 10-seconds. */

// include the script that we'll invoke
include( "./maintree/Discovery Services/Discovery Get Endpoints/Test Cases/001.js" );

function getendpoints007() {
    const MAXCOUNT = 100;
    // interatively invoke the test
    try {
        for( var i=0; i<MAXCOUNT-1; i++ ) getEndpoints552001();
        return( true );
    }
    catch( ex ) {
        addError( "Unexpected error invoking the test-script '5.5.1-014'.\n\t" + ex.toString() );
        return( false );
    }
}

Test.Execute( { Procedure: getendpoints007 } );