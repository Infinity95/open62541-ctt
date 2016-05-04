
function CloseSecureChannelService( args ) {
    this.Name = "CloseSecureChannel";
    this.UaStatus = null;

    this.Execute = function( args ) {
        if( !isDefined( args ) ) throw( "CloseSecureChannel::Execute() args not specified" );
        if( !isDefined( args.Channel ) ) throw( "CloseSecureChannel::Execute() args.Channel not specified" );
        if( isDefined ( args.Channel.Channel ) ) args.Channel = args.Channel.Channel; // make sure we are pointing to the channel object, not the helper!
        if( !isDefined( args.Channel.IsConnected ) ) throw( "CloseSecureChannel::Execute() args.Channel type mismatch. Could not find property 'IsConnected'." );
        if( !isDefined( args.SuppressMessaging ) ) args.SuppressMessaging = false;
        // invoke the disconnect, if connected
        if( args.Channel.IsConnected ) {
            if( isDefined( args.PreHook ) ) args.PreHook();
            this.UaStatus = args.Channel.disconnect();
            // prepare an output message to summarize the call
            var msg = this.Name + "(); Result = " + this.UaStatus;
            if( !args.SuppressMessaging ) addLog( msg );
            if( isDefined( args.PostHook ) ) args.PostHook();
            // any post validation needed?
            if( isDefined( args.ServiceResult ) ) { 
                var result = args.ServiceResult.containsStatusCode( this.UaStatus );
                if( !result ) addError( "CloseSecureChannel().Result received " + this.UaStatus.toString() + ", but expected any one of the following:\n\t" + ExpectedErrors.ExpectedResults.toString(), this.UaStatus );
            }
        }// connected already?
        return( !args.Channel.IsConnected );
    }

}