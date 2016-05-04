function CancelService( args ) {
    // properties
    this.Name = "Cancel";
    this.Session = null;
    this.Request = null;
    this.Response = null;
    this.UaStatus = null;
    this.CallCount = 0;

    // parameter validation
    if( !isDefined( args ) ) throw( this.Name + " CTOR, arguments not specified." );
    if( !isDefined( args.Session ) ) throw( this.Name + " CTOR, session not specified." );
    else this.Session = args.Session;

    /* Execute() parameters:
        - RequestHandle [integer] 
        - ServiceResult [ExpectedAndAcceptedResults]
        - OperationResults  [ExpectedAndAcceptedResults] */
    this.Execute = function( args ) {
        if( !isDefined( args ) ) throw( "cancel.js::Execute() no arguments specified." );
        if( !isDefined( args.RequestHandle ) ) throw( "cancel.js::Execute() argument missing: RequestHandle." );
        if( !isDefined( args.SuppressMessaging ) ) args.SuppressMessaging = false;

        // register that this service is tested
        ServiceRegister.SetTested( { Name: this.Name } );

        // define the request/response objects
        this.Request = new UaCancelRequest();
        this.Response = new UaCancelResponse();
        var session = isDefined( this.Session.Session )? this.Session.Session : this.Session;
        this.Request.RequestHeader = UaRequestHeader.New( { Session: session } );
        this.Request.RequestHandle = args.RequestHandle;

        var result = false;

        // invoke the call
        this.UaStatus = session.cancel( this.Request, this.Response );

        result = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging, SuppressErrors: args.SuppressErrors, ServiceInfo: "RequestHandle: " + this.Request.RequestHandle  } );
        if( result ) result = checkCancelValidParameter( this.Request, this.Response );

        // if the call failed then register that 
        if( !result ) ServiceRegister.SetFailed( { Name: this.Name } )
        return( result );
    }
}





// the service is expected to succeed
// all operations are expected to succeed
function checkCancelValidParameter( Request, Response, ExpectedResults ) {
    var bSucceeded = true;
    // check in parameters
    if ( arguments.length < 2 ) {
        addError( "function checkCancelValidParameter(): min. required arguments 2!" );
        return( false );
    }
    // check response header
    if( isDefined( ExpectedResults ) ) {
        if( !ExpectedResults.containsStatusCode( Response.ResponseHeader.ServiceResult.StatusCode ) ) {
            addError( "Cancel().Response.ResponseHeader.ServiceResult is '" + Response.ResponseHeader.ServiceResult.StatusCode + "'; which does not match any of the following expected codes:\n\t" + ExpectedErrors.toString() );
            bSucceeded = false;
        }
    }
    else bSucceeded = false;
    return bSucceeded;
}