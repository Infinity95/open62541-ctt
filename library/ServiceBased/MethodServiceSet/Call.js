/* Nathan Pocock (nathan.pocock@opcfoundation.org)
    UA Service: Call

    Description: This class contains all functionality to quickly and easily invoke a Call method
                 and managing the response etc. */

UaCallMethodRequest.New = function( args ) {
    var x = new UaCallMethodRequest();
    if( isDefined( args ) ) {
        if( isDefined( args.InputArguments ) ) {
            if( !isDefined( args.InputArguments.length ) ) x.InputArguments[0] = args.InputArguments;
            else for( var i=0; i<args.InputArguments.length; i++ ) x.InputArguments[i] = args.InputArguments[i];
        }
        if( !isDefined( args.MethodId ) ) throw( "UaCallMethodRequest.New::args.MethodId not specified." );
        else x.MethodId = args.MethodId;
        if( !isDefined( args.ObjectId ) ) throw( "UaCallMethodRequest.New::args.ObjectId not specified." );
        else x.ObjectId = args.ObjectId;
    }
    return( x );
}

function CallService( args ) {
    this.Name = "Call";
    this.Session = null;
    this.Request = null;
    this.Response = null;
    this.UaStatus = null;
    this.CallCount = 0;

    if( !isDefined( args ) ) throw( this.Name + " CTOR, arguments not specified." );
    if( !isDefined( args.Session ) ) throw( this.Name + " CTOR, session not specified." );
    else this.Session = args.Session;


    /* args, parameters include: 
            ServiceResult: 
            OperationResults: 
            MethodsToCall: */
    this.Execute = function( args ) { 
        if( !isDefined( args ) ) args = new Object();
        if( isDefined( args.OperationResults ) && ( args.OperationResults.length !== args.MethodsToCall.length ) ) throw( "CallService.Execute::args.MethodsToCall.length (" + args.MethodsToCall.length + ") does not match args.OperationResults.length (" + args.OperationResults.length + ")." );
        if( !isDefined( args.SuppressMessaging ) ) args.SuppressMessaging = false;
        // are we working with one method, or multiple? always use multiples though!
        if( !isDefined( args.MethodsToCall ) ) throw( "CallService.Execute::args.MethodsToCall not specified." );
        if( !isDefined( args.MethodsToCall.length ) ) args.MethodsToCall = [ args.MethodsToCall ];

        this.Request = new UaCallRequest();
        this.Response = new UaCallResponse();
        var session = isDefined( this.Session.Session )? this.Session.Session : this.Session;
        this.Request.RequestHeader = UaRequestHeader.New( { Session: session } );
        for( var i=0; i<args.MethodsToCall.length; i++ ) this.Request.MethodsToCall[i] = UaCallMethodRequest.New( args.MethodsToCall[i] );

        // register that this service is tested
        ServiceRegister.Register( { Service: ServiceRegister.UaService( { Name: this.Name, Available: false, Tested: false } ) } );

        // invoke the call to the UA Server 
        if( isDefined( args.PreHook ) ) args.PreHook();
        this.UaStatus = session.call( this.Request, this.Response );
        if( isDefined( args.PostHook ) ) args.PostHook();
        // if the call failed then register that
        if( this.UaStatus.isBad() ) ServiceRegister.SetFailed( { Name: this.Name } )
        // Check Service Result 
        if( this.UaStatus.isGood() ) {
            result = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging, ServiceInfo: " MethodsToCall #: " + this.Request.MethodsToCall.length } );
            // Check the Operation Results
            if( result && isDefined( args.OperationResults ) ) {
                for( var i=0; i<args.OperationResults.length; i++ ) 
                    if( !Assert.StatusCodeIs( args.OperationResults[i], this.Response.Results[i].StatusCode, "Call.Results[" + i + "].StatusCode incorrect." ) ) result = false;
            }
        }
        return( result );
    }// Execute();

}//CallService