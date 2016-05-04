/*    This class object is responsible for calling the GetEndpoints() service and for also
      performing any validation etc. This is a quick-use class. See the bottom of this file for an example on using it. */

/* returns a new RegisteredServer object.
    Parameters include: 
        DiscoveryUrls 
        GatewayServerUri 
        IsOnline 
        ProductUri 
        SemaphoreFilePath 
        ServerNames 
        ServerType 
        ServerUri */
function RegisteredServer( args ) {
    this.DiscoveryUrls = [];
    this.ServerNames = [];

    if( !isDefined( args ) ) throw( "registerServer.js::RegisteredServer() args not specified." );
    if( isDefined( args.DiscoveryUrls ) ) {
        if( args.DiscoveryUrls.length === undefined )args.DiscoveryUrls = [ args.DiscoveryUrls ];
        for( var i=0; i<args.DiscoveryUrls.length; i++ )this.DiscoveryUrls[i] = args.DiscoveryUrls[i];
    }
    this.GatewayServerUri = isDefined( args.GatewayServerUri )? args.GatewayServerUri : "";
    this.IsOnline = isDefined( args.IsOnline )? args.IsOnline : true;
    this.ProductUri = isDefined( args.ProductUri )? args.ProductUri : "";
    this.SemaphoreFilePath = isDefined( args.SemaphoreFilePath )? args.SemaphoreFilePath : "../semaphoreFilePath/semaphoreFile.txt";
    if( isDefined( args.ServerNames ) ) {
        if( args.ServerNames.length === undefined ) args.ServerNames = [ args.ServerNames ];
        for( var i=0; i<args.ServerNames.length; i++ ) {
            var lt = new UaLocalizedText();
            lt.Text = args.ServerNames[i];
            this.ServerNames.push( lt );
        }
    }
    else {
        this.ServerNames.push( new UaLocalizedText() );
        this.ServerNames[0].Text = "UACTT";
    }
    this.ServerType = isDefined( args.ServerType )? args.ServerType : ApplicationType.Server;
    this.ServerUri = isDefined( args.ServerUri )? args.ServerUri : "";
    
    this.toString = function() {
        return( "DiscoveryUrls (" + this.DiscoveryUrls.length + "); GatewayServerUri: " + this.GatewayServerUri +
            "; IsOnline: " + this.IsOnline + "; ProductUri: " + this.ProductUri + "; SemaphoreFilePath: " + this.SemaphoreFilePath +
            "; ServerNames (" + this.ServerNames.length + ") " + ( this.ServerNames.length > 0? " with[0]=" + this.ServerNames[0].Text : "" ) + "; ServerType: " + this.ServerType + "; ServerUri: " + this.ServerUri );
    }
}

function RegisterServer( args ) {
    this.Name = "RegisterServer";
    this.Session = null;
    this.Request = null;
    this.Response = null;
    this.UaStatus = null;

    if( !isDefined( args ) ) throw( "RegisterServer() instanciation failed, argument 'session' is missing or not a Session object." );
    if( !isDefined( args.Session ) ) throw( "RegisterServer() instancation failed, argument 'session' is not a Session object." );
    if( !isDefined( args.Session.Channel ) ) throw( this.Name + "() instanciation failed; argument 'session' is not of the right type." );
    else this.Session = args.Session;

    /* Reads values.
        Parameters are: 
            Server,
            ExpectedErrors
            SuppressValidation
            ExpectInFindServers */
    this.Execute = function( args ) {
        if( !isDefined( args ) ){ throw( "registerServer.js::Execute() no args specified." ); }
        if( !isDefined( args.Server ) ){ throw( "registerServer.js::Execute() args.Server not specified." ); }
        if( !isDefined( this.Session ) ){ throw( "registerServer.js::Execute() session not defined." ); }
        if( !isDefined( args.SuppressMessaging ) ) args.SuppressMessaging = false;
        if( !isDefined( args.SuppressWarnings ) ) args.SuppressWarnings = false;

        // register that this service is tested
        ServiceRegister.Register( { Service: ServiceRegister.UaService( { Name: this.Name, Available: true, Tested: true } ) } );

        // define the headers
        this.Request  = new UaRegisterServerRequest();
        var session = isDefined( this.Session.Session )? this.Session.Session : this.Session;
        if( isDefined( session.buildRequestHeader ) ) this.Request.RequestHeader = UaRequestHeader.New( { Session: session } );
        else this.Request.RequestHeader.Timestamp = UaDateTime.utcNow();
        this.Response = new UaRegisterServerResponse();

        // configure the header request
        for( var i=0; i<args.Server.DiscoveryUrls.length; i++ )this.Request.Server.DiscoveryUrls[i] = args.Server.DiscoveryUrls[i];
        this.Request.Server.GatewayServerUri = args.Server.GatewayServerUri;
        this.Request.Server.IsOnline = args.Server.IsOnline;
        this.Request.Server.ProductUri = args.Server.ProductUri;
        this.Request.Server.SemaphoreFilePath = args.Server.SemaphorePath;
        for( var i=0; i<args.Server.ServerNames.length; i++ ) {
            if( args.Server.ServerNames.Text === undefined ) this.Request.Server.ServerNames[i].Text = args.Server.ServerNames[i];
            else this.Request.Server.ServerNames[i] = args.Server.ServerNames[i];
        }
        this.Request.Server.ServerType = args.Server.ServerType;
        this.Request.Server.ServerUri = args.Server.ServerUri;

        // issue the call
        if( isDefined( args.PreHook ) ) args.PreHook();
        this.UaStatus = session.registerServer( this.Request, this.Response );
        if( isDefined( args.PostHook ) ) args.PostHook();
        // check result
        if( this.UaStatus.isGood() ) {
            var result = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging, SuppressWarnings: args.SuppressWarnings, SuppressErrors: args.SuppressErrors, ServiceInfo: "IsOnline: " + this.Request.Server.IsOnline } );
            if( result && this.Response.ResponseHeader.ServiceResult.isGood() ) {
                // validation, when we call FindServers does the pseudo server show-up in the list?
                if( !( isDefined( args.SuppressValidation ) && args.SuppressValidation === true ) ) {
                    // create a findServers helper, invoke the call, then check the results 
                    if( Assert.True( FindServersHelper.Execute( { EndpointUrl:readSetting( "/Discovery/Endpoint Url" ).toString() } ), "FindServers() unable to validate the RegisterServer() call." ) ) {
                        if( Assert.GreaterThan( 0, FindServersHelper.Response.Servers.length, "Expected 1 or more Response.Servers in FindServers() call." ) ) {
                            // can we find a server that matches the server that was just registered?
                            var found = false;
                            found = this.serverInFindServersResponse( FindServersHelper.Response, this.Request.Server );
                            // should it be visible? this is based on the "IsOnline" paramter
                            var expectInFind = isDefined( args.ExpectInFindServers )? args.ExpectInFindServers : this.Request.Server.IsOnline;
                            if( Assert.Equal( expectInFind, found, "FindServers() did" + (!expectInFind?"":" not") + " find an exact match for the server registered via RegisterServer() [IsOnline=" + this.Request.Server.IsOnline + "] which is incorrect.\n\tSearched for: '" + this.Request.Server.toString() + "'." ) )                                 {
                                if( !args.SuppressMessaging ) addLog( "FindServers() did" + (this.Request.Server.IsOnline?"":" not") + " find the Server, as verification of the prior RegisterServer() call where serverUri was: '" + this.Request.Server.ServerUri + "'." );
                            }
                        }
                    }
                }// suppress validation?
            }// expected errors?
        }
        else {
            ServiceRegister.SetFailed( { Name: this.Name } );
            if( isDefined( args.ChannelError ) ) result = Assert.StatusCodeIsOneOf( args.ChannelError, this.UaStatus, "Channel error does not match expected result." );
            else {
                addError( "RegisterServer() status: " + this.UaStatus, this.UaStatus );
                result = false;
            }
        }
        return( result );
    };//RegisterServer Execute


    this.serverInFindServersResponse = function( fsResponse, serverType ) {
        var found = false;
        for( var i=0; i<fsResponse.Servers.length; i++ ) {
            var currFsServer = fsResponse.Servers[i];
            if( currFsServer.ApplicationType === serverType.ServerType &&
                currFsServer.ApplicationUri === serverType.ServerUri &&
                currFsServer.ProductUri === serverType.ProductUri &&
                currFsServer.GatewayServerUri === serverType.GatewayServerUri && 
                currFsServer.DiscoveryUrls.length === serverType.DiscoveryUrls.length ) {
                found = true;
                // now check the discoveryUrls match
                for( var d=0; d<serverType.DiscoveryUrls.length; d++ ) {
                    if( !Assert.Equal( serverType.DiscoveryUrls[d], currFsServer.DiscoveryUrls[d], "FindServers().Servers[" + i + "].DiscoveryUrls[" + d + "] does not match the value specified in RegisterServers().Server.DiscoveryUrls[" + d + "]" +
                        "\n\tRegisterServer().Server.DiscoveryUrls = " + serverType.DiscoveryUrls.toString( ) + 
                        "\n\tFindServers().Response.Server[" + i + "].DiscoveryUrls = " + currFsServer.DiscoveryUrls.toString() ) ) found = false;
                }//for d...
                // now check the server names can be found
                for( var n=0; n<serverType.ServerNames.length; n++ ) {
                    if( ( serverType.ServerNames[n].Text === currFsServer.ApplicationName.Text &&
                            serverType.ServerNames[n].Locale === currFsServer.ApplicationName.Locale ) ) break;
                }//for n...
                if( found ) break;
            }
        }//for i...
        return( found );
    }
}