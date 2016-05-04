/*    This class object is responsible for calling the GetEndpoints() service and for also
      performing any validation etc. This is a quick-use class.
      See the bottom of this file for an example on using it.
*/

include( "./library/Base/warnOnce.js" );
include( "./library/Base/certificates.js" );
include( "./library/Base/Objects/expectedResults.js" )

function GetEndpointsService( args ) {
    this.Name = "GetEndpoints";
    this.Session = null;
    this.Request = null;
    this.Response = null;
    this.UaStatus = null;

    if( !isDefined( args ) ) throw( this.Name + " CTOR, arguments not specified." );
    if( !isDefined( args.Session ) ) throw( this.Name + " CTOR, session not specified." );
    else this.Session = args.Session;


    /* Reads values.
          Parameters are: 
              endpointUrl        = the endpoint
              locales            = array of locales
              serverUris         = array of ServerUris
              expectErrorNotFail = true means use check_read_error, else check_read_failed. */
    this.Execute = function( endpointUrl, locales, serverUris, expectedErrors, suppressMessaging, preHook, profileUris, postHook ) {
        if( !isDefined( suppressMessaging ) ) suppressMessaging = false;
        if( !isDefined( endpointUrl ) ) endpointUrl = readSetting( "/Server Test/Server URL" );

        // register that this service is tested
        ServiceRegister.Register( { Service: ServiceRegister.UaService( { Name: this.Name, Available: true, Tested: true } ) } );

        // define the headers
        this.Request  = new UaGetEndpointsRequest();
        var session = isDefined( this.Session.Session )? this.Session.Session : this.Session;
        if( isDefined( this.Session.buildRequestHeader ) ) this.Request.RequestHeader = UaRequestHeader.New( { Session: session } );
        else this.Request.RequestHeader.Timestamp = UaDateTime.utcNow();
        this.Request.EndpointUrl = endpointUrl == "null"? null : endpointUrl;
        this.Response = new UaGetEndpointsResponse();

        // populate the LocaleIds if applicable.
        if( isDefined( locales ) && locales.length > 0 ) for( var l=0; l<locales.length; l++ ) this.Request.LocaleIds[l] = locales[l];
        // populate the ServerUris if applicable.
        if( isDefined( serverUris ) && serverUris.length > 0 ) for( var s=0; s<serverUris.length; s++ ) this.Request.ServerUris[s] = serverUris[s];
        // populate the profileUris, if applicable
        if( isDefined( profileUris ) && profileUris.length > 0 ) {
            if( !( profileUris instanceof Array ) ) profileUris = [ profileUris ];
            for( var i=0; i<profileUris.length; i++ ) this.Request.ProfileUris[i] = profileUris[i];
        }

        // invoke any pre-hook now
        if( isDefined( preHook ) ) preHook();
        this.UaStatus = session.getEndpoints( this.Request, this.Response);
        if( isDefined( postHook ) ) postHook();
        // check result
        if( this.UaStatus.isGood() ) {
            result = UaResponseHeader.IsValid( { Service: this, ServiceResult: expectedErrors, SuppressMessaging: suppressMessaging, ServiceInfo: "LocaleIds #" + this.Request.LocaleIds.length + "; ProfileUris #" + this.Request.ProfileUris.length } );
            if( result ) result = checkGetEndpointsValidParameter( this.Request, this.Response, suppressMessaging );
        }
        else {
            addError( "GetEndpoints() status " + this.UaStatus, this.UaStatus );
            result = false;
        }
        // if the call failed then register that 
        if( this.UaStatus.isBad() ) ServiceRegister.SetFailed( { Name: this.Name } )
        return( this.UaStatus.isGood() );
    };//FindServers Execute

    /* Wrapper for 'Execute' which uses named arguments instead of specific parameters
        EndpointUrl
        LocaleIds
        ServerUris
        ProfileUris
        ExpectedErrors
        SuppressMEssaging 
        PreHook // */
    this.Execute2 = function( args ) {
        if( !isDefined( args ) ) args = new Object();
        if( !isDefined( args.EndpointUrl ) ) args.EndpointUrl = readSetting("/Server Test/Server URL");
        if( !isDefined( args.LocaleIds ) ) args.LocaleIds = [];
        if( !isDefined( args.ServerUris ) ) args.ServerUris = [];
        if( !isDefined( args.ProfileUris ) ) args.ProfileUris = [];
        var result = this.Execute( args.EndpointUrl, args.LocaleIds, args.ServerUris, args.ExpectedResults, args.SuppressMessaging, args.PreHook, args.ProfileUris, args.PostHook );
        return( result );
    }//Execute2

}



// the service is expected to succeed
// all operations are expected to succeed
function checkGetEndpointsValidParameter( Request, Response, suppressMessaging ) {
    var result = true;
    // check in parameters
    if( arguments.length < 2 ) {
        addError( "function checkGetEndpointsValidParameter(): Number of arguments must be a minimum of 2!" );
        result = false;
    }
    // check response header
    //result = checkResponseHeaderValid( Request.RequestHeader, Response.ResponseHeader );
    if( !result ) return( result );
    // check the contents of the endpoints
    for( var i=0; i<Response.Endpoints.length; i++ ) {
        var currentEndpoint = Response.Endpoints[i];
        // check the application description.
        if( currentEndpoint.Server.ApplicationName.Text.length == 0 ) {
          addError( "function checkGetEndpointsValidParameter(): application name (text) is empty." );        
          result = false;
        }
        // check that application uri is not empty.
        if( currentEndpoint.Server.ApplicationUri.length == 0 ) {
          addError( "function checkGetEndpointsValidParameter(): application uri is empty." );        
          result = false;
        }
        // check that product uri is not empty.
        if( currentEndpoint.Server.ProductUri.length == 0 ) {
          addError( "function checkGetEndpointsValidParameter(): product uri is empty." );        
          result = false;
        }
        // check that application type is not client.
        if( currentEndpoint.Server.ApplicationType == ApplicationType.Client ) {
          addError( "function checkGetEndpointsValidParameter(): application type is client." );        
          result = false;
        }
        // check that EndpointUri is not empty.
        if( currentEndpoint.EndpointUrl == null || currentEndpoint.EndpointUrl.length == 0 || currentEndpoint.EndpointUrl == "" ) {
          addError( "Endpoint #" + i + " EndpointUrl is empty." );        
          result = false;
        }
        // check that SecurityPolicyUri.
        Assert.True( SecurityPolicy.Validate( currentEndpoint.SecurityPolicyUri ), "GetEndpoints.Response.Endpoints[" + i + "].SecurityPolicyUri invalid, value received: " + currentEndpoint.SecurityPolicyUri );
        // check that TransportProfileUri is not empty.
        if( currentEndpoint.TransportProfileUri == "" ) {
          addError( "Endpoint #" + i + " TransportProfileUri is empty." );        
          result = false;
        }
        // ERRATA 1.02.03
        // Original errata 1.02 dictated that a server should only send a certificate when security required it.
        // Modified errata for 1.02.03 says that the Server/Client will ignore certificates in the exchange, and no certificates are sent!
        if( currentEndpoint.ServerCertificate.isEmpty() ) {
            if( !isAuthenticationSecure() ) {
                _warning.store( "ServerCertificate is empty. This is allowed per Errata 1.02.03, but it can cause interoperability problems with older UA 1.01 Clients." );
            }
        }
    }
    if( result &&( suppressMessaging === undefined || suppressMessaging === false ) ) addLog( "GetEndpoints and ServerCertificate validation succeeded." );
    return( result );
}// function checkGetEndpointsValidParameter( Request, Response, suppressMessaging )