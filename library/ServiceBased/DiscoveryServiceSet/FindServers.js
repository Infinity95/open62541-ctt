/*    This class object is responsible for calling the FindServers() service and for also
      performing any validation etc. This is a quick-use class. */

function FindServersService( args ) {
    this.Name = "FindServers";
    this.Session = null;
    this.Request = null;
    this.Response = null;
    this.uaStatus = null;
    this.Hostnames = [];

    if( !isDefined( args ) ) throw( this.Name + " CTOR, arguments not specified." );
    if( !isDefined( args.Session ) ) throw( this.Name + " CTOR, session not specified." );
    else this.Session = args.Session;



    /* Reads values.
          Parameters are: 
              endpointUrl        = the endpoint
              locales            = array of locales
              serverUris         = array of ServerUris
              expectErrorNotFail = true means use check_read_error, else check_read_failed.
            EndpointUrl
            LocaleIds
            ServerUris
            ExpectedErrors
            SuppressMessaging
            PreHook */
    this.Execute = function( args ) {
        if( !isDefined( args ) ) args = new Object();
        if( !isDefined( args.EndpointUrl ) ) args.EndpointsUrl = readSetting( "/Discovery/Endpoint Url" ).toString();
        if( !isDefined( args.LocaleIds ) )args.LocaleIds = [];
        if( !isDefined( args.ServerUris ) )args.ServerUris = [];

        // register that this service is tested
        ServiceRegister.Register( { Service: ServiceRegister.UaService( { Name: this.Name, Available: true, Tested: true } ) } );

        if( !isDefined( args.SuppressMessaging ) ) args.SuppressMessaging = false;
        if( !args.SuppressMessaging ) print( "FindServers.Execute( EndpointUrl:" + args.EndpointUrl + " )" );

        // define the headers
        this.Request  = new UaFindServersRequest();
        var session = isDefined( this.Session.Session )? this.Session.Session : this.Session;
        if( isDefined( session.buildRequestHeader ) ) this.Request.RequestHeader = UaRequestHeader.New( { Session: session } );
        else this.Request.RequestHeader.Timestamp = UaDateTime.utcNow();
        this.Request.EndpointUrl = args.EndpointUrl;
        this.Response = new UaFindServersResponse();

        // populate the LocaleIds and ServerUris, if applicable.
        if( args.LocaleIds.length > 0 ) {
            if( !args.SuppressMessaging ) print( "... specifying " + args.LocaleIds.length + " LocaleIds in the request..." );
            for( var l=0; l<args.LocaleIds.length; l++ ) this.Request.LocaleIds[l] = args.LocaleIds[l];
        }
        else if( !args.SuppressMessaging ) print( "\tNo locale filters specified..." );
        if( args.ServerUris.length > 0 ) {
            if( !args.SuppressMessaging ) print( "... specifying " + args.ServerUris.length + " serverUris in the request..." );
            for( var s=0; s<args.ServerUris.length; s++ ) this.Request.ServerUris[s] = args.ServerUris[s];
        }
        else if( !args.SuppressMessaging ) print( "\tNo serverUri filters specified..." );

        // invoke any pre-hook now
        if( isDefined( args.PreHook ) )args.PreHook();
        this.UaStatus = session.findServers( this.Request, this.Response);
        if( isDefined( args.PostHook ) ) args.PostHook();
        // check result
        if( this.UaStatus.isGood() ) {
            result = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging, ServiceInfo: "LocaleIds #" + this.Request.LocaleIds.length + "; ServerUris #" + this.Request.ServerUris.length } );
            if( result ) result = this.ValidateResponse( this.Request, this.Response, args.SuppressMessaging );
        }
        else {
            addError( "FindServers() status " + this.UaStatus, this.UaStatus );
            result = false;
        }
        // if the call failed then register that 
        if( !this.UaStatus.isBad() ) ServiceRegister.SetFailed( { Name: this.Name } )
        return( this.UaStatus.isGood() );
    };//FindServers Execute

    this.ValidateResponse = function( Request, Response, suppressMessaging ) {
        var succeeded = true;
        // check in parameters
        if( arguments.length < 2 ) {
            addError( "function checkFindServersValidParameter(): Number of arguments must be 2!" );
            return false;
        }
        // check application descriptions.
        if( !suppressMessaging ) print( "FindServers returned " + Response.Servers.length + " Servers:" );
        for( var i=0; i<Response.Servers.length; i++ ) {
            var description = Response.Servers[i];
            if( !suppressMessaging ) print( "\t[" + (1+i) + "] " + description.toString() );
            // check that application name is not empty.
            if( description.ApplicationName.Locale.length == 0 ) {
                _warning.store( "Response.Servers[" + i + "].ApplicationName.Locale is empty: '" + description.ApplicationName.Locale.toString() + "'" );
                succeeded = false;
            }
            if(description.ApplicationName.Text.length == 0 ) { 
                addError( "Response.Servers[" + i + "].ApplicationName.Name (text) is empty: '" + description.ApplicationName.Text.toString() + "'" );
                succeeded = false;
            }
            // check that application uri is not empty.
            if( description.ApplicationUri.length == 0 ) {
                addError( "Response.Servers[" + i + "].ApplicationUri is empty: '" + description.ApplicationUri.toString() + "'" );
                succeeded = false;
            }      
            // check that product uri is not empty.
            if( description.ProductUri.length == 0 ) {
                addError( "Response.Servers[" + i + "].ProductUri is empty: '" + description.ProductUri + "'" );
                succeeded = false;
            }       
            // check that application type is not client.
            if( description.ApplicationType == ApplicationType.Client ) {
                addError( "Response.Servers[" + i + "].ApplicationType is client." );        
                succeeded = false;
            }
        }
        return succeeded;
    }

    // Responsible for checking the .response property and checking all
    // returned endpoints and building a list of IP addresses and/or
    // hostnames for storing in the .IPs and .Hostnames properties.
    this.CollectIpHostnames = function() {
        if( !isDefined( this.Response ) ) return;
        // iterate through all endpoints
        for( var i=0; i<this.Response.Servers.length; i++ ) {
            var currServer = this.Response.Servers[i];
            // iterate thru each discovery url; and clear existing IPs/hostnames etc.
            this.Hostnames = [];
            for( var d=0; d<currServer.DiscoveryUrls.length; d++ ) {
                var currH = this.GetIpHostnameFromEndpoint( currServer.DiscoveryUrls[d] );
                this.addHostname( currH );
            }//for d
        }//for i
    }


    this.GetIpHostnameFromEndpoint = function( endpoint ) {
        if( isDefined( endpoint ) ) {
            var ep = endpoint.toString();
            //find "//" index
            var start = ep.indexOf( "//" );
            if( start < 5 ){ return( "" )}
            start += 2;
            //find ":" index
            var end = ep.indexOf( ":", start );
            if( end < 6 ){ end = ep.length; }
            // substring
            s = ep.substring( start, end );
            return( s );
        }
        return( "" );
    }

    // this function will check the .Hostnames array for multiple IPs and/or hostnames.
    // If the .Hostnames array is empty, then it will abort and return FALSE.
    this.IsMultiHomed = function() {
        if( !isDefined( this.Hostnames ) ){ return( false ); }
        return( this.Hostnames.length >= 2 );
    }

    // searches through the "FindServers.Response.Servers" endpoints for those that are
    // for the specified hostname.
    this.FindEndpointsForHostname = function( hostname ) {
        var results = [];
        if( isDefined( hostname ) ) {
            for( var s=0; s<this.Response.Servers.length; s++ ) {
                for( var d=0; d<this.Response.Servers[s].DiscoveryUrls.length; d++ ) {
                    var currDiscoUrl = this.Response.Servers[s].DiscoveryUrls[d];
                    var foundHost = this.GetIpHostnameFromEndpoint( currDiscoUrl );
                    if( hostname === foundHost ) results.push( currDiscoUrl );
                }//for d
            }//for s
        }//if defined
        return( results );
    }

    // private function that will add a hostname to the .Hostnames property, but only
    // if the hostname is unique (not already added)
    this.addHostname = function( h ) {
        if( isDefined( h ) && h !== "" ) {
            for( var i=0; i<this.Hostnames.length; i++ ) {
                if( this.Hostnames[i] === h ) return( true );
            }
            this.Hostnames.push( h );
        }
    }
}