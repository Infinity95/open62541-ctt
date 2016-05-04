function CloseSessionService() {
    this.Name = "CloseSession";     // Name of this service
    this.Session = null;            // UaSession object; purely internal use only
    this.Request = null;            // CreateSession request
    this.Response = null;           // CreateSession response
    this.Result = null;             // Result of the CreateSession call

    /* CloseSession.Execute() invokes the CloseSession service.
       Parameters (all are optional; if missing then defaults are assumed, which mostly come from SETTINGS): 
           DeleteSubscriptions: 
           PreHook: 
           PostHook: 
           Session: (REQUIRED) UaSession object
           ServiceResult: */
    this.Execute = function( args ) {
        // validate all parameters first; assume the values for any parameters that are not specified
        if (!isDefined( args ) ) throw( "CloseSession.Execute::args not specified." );
        if( !isDefined( args.Session ) )throw( "CloseSession.Execute::session not specified." );
        var result = true;
        var session = isDefined( args.Session.Session )? args.Session.Session : args.Session;
        // check if the session is already closed
        if( isDefined( args.Session.Connected ) && args.Session.Connected ) return( true );
        // build the request
        this.Request = new UaCloseSessionRequest();
        session.buildRequestHeader( this.Request.RequestHeader );
        this.Request.RequestHeader = UaRequestHeader.New( { Session: session } );
        this.Request.DeleteSubscriptions = isDefined( args.DeleteSubscriptions ) ? args.DeleteSubscriptions : true;
        // prepare the call and invoke
        this.Response = new UaCloseSessionResponse();
        if( isDefined( args.PreHook ) ) args.PreHook();
        this.Result = session.closeSession( this.Request, this.Response );
        if( this.Result.isGood() ) {
            result = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging, ServiceInfo: "DeleteSubscriptions=" + this.Request.DeleteSubscriptions } );
        }
        // register that this service is tested
        ServiceRegister.Register( { Service: ServiceRegister.UaService( { Name: "CloseSession", Available: true, Tested: true } ) } );
        // if the call failed then register that 
        if( !result ) ServiceRegister.SetFailed( { Name: "CloseSession" } )
        // decorate the session object with a "Connected" property, set to FALSE
        args.Session.Connected = false;
        return( result );
    }// this.Execute()
}