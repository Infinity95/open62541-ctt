throw( "do not use me" );
/*
include( "./library/Base/connectChannel.js" );
include( "./library/ServiceBased/SessionServiceSet/CreateSession.js" );
include( "./library/ServiceBased/SessionServiceSet/ActivateSession.js" );

function connect( Channel, Session, overrides, suppressErrors ) {
    // check parameters
    if( arguments.length < 2 ) {
        addError( "function connect(Channel, Session): Not enough arguments." );
        return false;
    }
    // connect channel
    if( !connectChannel( Channel, undefined, overrides, suppressErrors ) ) return false;
    // create and activate session
    if( !createSession( Session ) ) {
        disconnectChannel( Channel );
        return false;
    }
    return true;
}

// Opens a session using an existing Channel. Used by multi-subscription (per session) tests.
function connectSession( Channel, Session ) {
    // create and activate session
    if( !createSession( Session ) ) {
        disconnectChannel( Channel );
        return( false );
    }
    return( true );
}
*/