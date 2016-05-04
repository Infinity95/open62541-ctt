include( "./library/Base/safeInvoke.js" );

var CUVariables = new Object();

// Connect to the UA Server using default parameters (settings)
if( !Test.Connect() ) { addError( "Unable to connect to Server. Aborting tests." ); stopCurrentUnit(); }
else {
    CUVariables.Debug = true;
}