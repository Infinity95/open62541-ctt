/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Specify numerous localeIds supported by the server, in a ranked order. */

function activateSession002() {
    // check the Max # of channels first.
    if( gServerCapabilities.MaxSecureChannels === 1 ) {
        addSkipped( "Only one channel supported (see setting /Server Test/Capabilities/Max SecureChannels) therefore skipping test." );
        return( false );
    }
    // create a default session and then activate it
    var session = new CreateSessionService( { Channel: Test.Channel } );
    if( !( session.Execute() && ActivateSessionHelper.Execute( { Session: session } ) ) ) {
        addError( "Unable to establish a session. Aborting." );
        return( false );
    }
    // now to browse the server capabilities
    var readHelper = new ReadService( { Session: session } );
    var localeIdArray = MonitoredItem.fromNodeIds( new UaNodeId( Identifier.Server_ServerCapabilities_LocaleIdArray ) )[0];
    if( !readHelper.Execute( { NodesToRead: [ localeIdArray ] } ) ) {
        CloseSessionHelper.Execute( { Session: session } );
        return( false );
    }
    var localeArray = UaVariantToSimpleType( localeIdArray.Value.Value );
    if( localeArray.length < 2 ) {
        addSkipped( "Not enough locales supported by server. Need 2 or more; server supports " + localeArray.length + "; which contains: " + localeArray.toString() );
        CloseSessionHelper.Execute( { Session: session } );
        return( false );
    }
    CloseSessionHelper.Execute( { Session: session } );

    // we'll create another session and then
    // request the locales in the REVERSE-ORDER as seen in the address space.
    var newSortOrder = [];
    for( var i=localeArray.length-1; i>=0; i-- )newSortOrder[localeArray.length-(1+i)] = localeArray[i];
    print( "old order: " + localeArray.toString() );
    print( "new order: " + newSortOrder.toString() );
    if( session.Execute() ) {
        result = Assert.True( ActivateSessionHelper.Execute( { Session: session, LocaleIds: newSortOrder } ), "Expected ActivateSession to succeed." );
    }
    // clean-up
    CloseSessionHelper.Execute( { Session: session } );
    return( true );
}

Test.Execute( { Procedure: activateSession002 } );