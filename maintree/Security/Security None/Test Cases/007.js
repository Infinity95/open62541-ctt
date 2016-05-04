/*  Test prepared Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: per Errata 1.02.2: attempt a DoS attack on Server by consuming SecureChannels and using only SOME of them!
                 When creating a valid/real SecureChannel, prior [unused] channels should be clobbered. */

function DoSAttempt() {
    var result = true;
    var maxChannels = readSetting( "/Server Test/Capabilities/Max SecureChannels" );
    var maxSessions = maxChannels - 1;
    var sessions = [];

    if( maxChannels === 0 || maxChannels >= 45 ) maxChannels = 45; // arbitrarily choose 50, if the setting is not configured (default=0, to force configuration).

    // the test-case states that a 1-second delay should be added between each new SecureChannel.
    // if we do that, then large systems could take a long time to execute. So lets add the delay ONLY
    // if the # of secure channels is 10 or less
    var waitTime = maxChannels <= 10? 1000 : 0;

    // step 1: create 1 less than max # of supported channels 
    addLog( "Step 1: Create " + maxSessions + " SecureChannels with Sessions. All should succeed." );
    var channels = [];
    var createResults = [];
    var closeResults = [];
    for( var i=0; i<maxSessions; i++ ) {
        addLog( "Create SecureChannel #" + ( i + 1 ) );
        channels.push( new OpenSecureChannelService() );
        createResults.push( channels[channels.length - 1].Execute( { RequestedSecurityPolicyUri: SecurityPolicy.None, MessageSecurityMode: MessageSecurityMode.None } ) );
        if( !createResults[i] ) { 
            result = false;
            addError( "Aborting Step #1 Create SecureChannel #" + ( i + 1 ) + " failed." );
            break;
        }
        addLog( "Create Session #" + ( i + 1 ) );
        sessions[i] = new CreateSessionService( { Channel: channels[i] } );
        if( !sessions[i].Execute() ) { 
            result = false; 
            addError( "Aborting Step #1 Create Session #" + ( i + 1 ) + " failed." );
            break; 
        }
        addLog( "Activate Session #" + ( i + 1 ) );
        if( !ActivateSessionHelper.Execute( { Session: sessions[i] } ) ) { 
            result = false;
            addError( "Aborting Step #1 Activate Session #" + ( i + 1 ) + " failed." );
            break; 
        }
        wait( waitTime );
    }//for i...

    // only continue if ALL secure channels were created successfully;
    // otherwise close the channels that were created successfully.
    if( result ) { 
        // test case says to create 5 more SecureChannels, but without Sessions!
        addLog( "Step 2: Add 5 more [idle] SecureChannels, which should succeed!" );
        for( i=0; i<5; i++ ) {
            channels.push( new OpenSecureChannelService() );
            createResults.push( channels[channels.length - 1].Execute( { RequestedSecurityPolicyUri: SecurityPolicy.None, MessageSecurityMode: MessageSecurityMode.None } ) );
        }

        // close all channels with sessions; should be ok.
        addLog( "Step 3: Remove all Sessions (added in step #2); should be successful." );
        for( var i=0; i<sessions.length; i++ ) if( !CloseSessionHelper.Execute( { Session: sessions[i] } ) ) result = false;

        // close all channels that did not have a session; all except the last should fail with BadSecureChannelIdInvalid
        addLog( "Step 4: Remove all remaining SecureChannels, all-but-one should fail; the last channel should delete successfully." );
        for( var i=0; i<5; i++ ) if( !CloseSecureChannelHelper.Execute( { Channel: channels[i], ServiceResult: new ExpectedResults( { Expected: [ StatusCode.BadSecureChannelIdInvalid, StatusCode.BadInvalidState ], Accepted: [ StatusCode.Good ] } ) } ) ) result = false;
    }// all channels successful
    else {
        // cleanup all sessions and channels
        for( var s=0; s<sessions.length; s++ ) {
            CloseSessionHelper.Execute( { Session: sessions[s] } );
        }
        for( var i=0; i<createResults.length; i++ ) {
            if( createResults[i] ) CloseSecureChannelHelper.Execute( { Channel: channels[i], ServiceResult: new ExpectedAndAcceptedResults( StatusCode.Good ) } );
        }
    }
    return( result );
}

Test.Execute( { Procedure: DoSAttempt } );