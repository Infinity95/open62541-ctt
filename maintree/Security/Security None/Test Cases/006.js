/*  Test prepared Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: per Errata 1.02.2: attempt a DoS attack on Server by consuming SecureChannels and NOT using them!
                 When creating a valid/real SecureChannel, prior [unused] channels should be clobbered. */

function DoSAttempt( args ) {
    if( !isDefined( args ) ) throw( "DoSAttempt.args not specified." );
    if( !isDefined( args.RequestedSecurityPolicyUri ) ) throw( "DoSAttempt.args.RequestedSecurityPolicyUri not specified." );
    if( !isDefined( args.MessageSecurityMode ) ) throw( "DoSAttempt.args.MessageSecurityMode not specified." );
    var result = true;
    var maxChannels = readSetting( "/Server Test/Capabilities/Max SecureChannels" );
    if( maxChannels < 10 ) { addSkipped( "Default Value for MaxSecureChannels setting is 10. Please check settig: " + "/Server Test/Capabilities/Max SecureChannels" + "." ); return (result);}
    if( maxChannels === 0 || maxChannels > 50 ) maxChannels = 50; // 50 is the current MAX of the CTT, if the setting is not configured (default=0, to force configuration).
    addLog( "Creating " + maxChannels + " SecureChannel(s)" );

    // the test-case states that a 1-second delay should be added between each new SecureChannel.
    // if we do that, then large systems could take a long time to execute. So lets add the delay ONLY
    // if the # of secure channels is 10 or less
    var waitTime = maxChannels <= 10? 1000 : 0;

    // step 1: create the max # of supported channels (according to the following CTT setting)
    addLog( "Step 1: Create " + maxChannels + " SecureChannels. All expected to succeed." );
    var channels = [];
    var createResults = [];
    var closeResults = [];
    for( var i=0; i<maxChannels; i++ ) {
        channels.push( new OpenSecureChannelService() );
        createResults.push( channels[i].Execute( { RequestedSecurityPolicyUri: args.RequestedSecurityPolicyUri, MessageSecurityMode: args.MessageSecurityMode } ) );
        if( !createResults[i] ) { 
            result = false;
            addError( "Aborting Step #1 creation of max supported SecureChannels.\nIteration #" + i + "\nEven though the Server might not have enough resources, it should reuse the resources not in use!" );
            break;
        }
        wait( waitTime );
    }//for i...

    // only continue if ALL secure channels were created successfully;
    // otherwise close the channels that were created successfully.
    if( result ) { 

        // step 2: create 10% more secure channels than allowed
        addLog( "Step 2: add 10% more SecureChannels than officially supported. Still expected to succeed!" );
        var maxChannelsPercent = parseInt( maxChannels * 0.1 );
        for( var i=0; i<maxChannelsPercent; i++ ) {
            channels.push( new OpenSecureChannelService() );
            createResults.push( channels[channels.length - 1].Execute( { RequestedSecurityPolicyUri: SecurityPolicy.None, MessageSecurityMode: MessageSecurityMode.None } ) );
            wait( waitTime );
        }//for i...

        // last: close ALL secure channels, but we expect the first 10% to fail
        addLog( "Step 3: Closing ALL SecureChannel(s); expecting first 10% to fail (because they should have been recycled)." );
        for( var i=0; i<channels.length; i++ ) {
            if( i<maxChannelsPercent ) closeResults.push( CloseSecureChannelHelper.Execute( { Channel: channels[i], ServiceResult: new ExpectedResults( { Expected: [ StatusCode.BadInvalidState, StatusCode.BadSecureChannelIdInvalid, StatusCode.BadResourceUnavailable ], Accepted: [ StatusCode.Good ] } ) } ) );
            else closeResults.push( CloseSecureChannelHelper.Execute( { Channel: channels[i], ServiceResult: new ExpectedAndAcceptedResults( StatusCode.Good ) } ) );
            if( !closeResults[i] ) {
                print( "SecureChannel[" + i + "] failed by returning a different code." );
                result = false;
            }
        }//for i...

    }// all channels successful
    else for( var i=0; i<createResults.length; i++ ) if( createResults[i] ) CloseSecureChannelHelper.Execute( { Channel: channels[i], ServiceResult: new ExpectedAndAcceptedResults( StatusCode.Good ) } );

    // analyze the results
    // first, the successful secure channels
    var successfulOpens = 0, failedOpens = 0;
    var successfulClose = 0, failedClose = 0;
    for( var i=0; i<createResults.length; i++ ) if( createResults[i] ) successfulOpens++; else failedOpens++;
    for( var i=0; i<closeResults.length;  i++ ) if( closeResults[i]  ) successfulClose++; else failedClose++;
    if( !result ) addError( "Server was expected to purge the older/unused SecureChannels so those resources could be used for the newly created SecureChannels.\nSee errors in log for this test.\nIT IS IMPORTANT THAT THE SETTING 'Server Test/Capabilities/Max SecureChannels' IS CONFIGURED CORRECTLY!\n" );

    return( result );
}

Test.Execute( { Procedure: DoSAttempt, 
                   Args: { RequestedSecurityPolicyUri: SecurityPolicy.None, 
                           MessageSecurityMode: MessageSecurityMode.None } } );