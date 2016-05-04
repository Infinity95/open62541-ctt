/*  This class object is responsible for calling the HistoryUpdate() service and for also 
    performing any validation etc. This is a quick-use class.
    Helper object for the HistoryRead UA Service call.
        Properties:
            Session:    the sesson object, defined during instanciation.
            Request:    the historyRead request object created by the helper.
            Response:   the response received from the UA Server being tested.
            Success:    a simple true/false flag to indicate a success/fail of the call.
        Functions:
            Execute:                        invokes the HistoryRead call.
            CheckHistoryReadValidParameter: validates the HistoryRead response. */

function HistoryUpdateService( args ) {
    this.Name = "HistoryUpdate";
    this.Session = null;       // session object reference
    this.Request = null;       // copy of the last/current HistoryRead request header
    this.Response = null;      // copy of the last/current HistoryRead server response header
    this.Success  = false;     // simple flag indicating if the last/current call succeeded or not.

    if( !isDefined( args ) ) throw( this.Name + " CTOR, arguments not specified." );
    if( !isDefined( args.Session ) ) throw( this.Name + " CTOR, session not specified." );
    else this.Session = args.Session;


    /* Reads values.
         Default values shown in [ ]
          Parameters are: 
              HistoryUpdateDetails = one or more HistoryUpdateDetails objects
              Debug                = [empty] True/False to show verbose info. FALSE=default. */
    this.Execute = function( args ) {
        if( !isDefined( args ) ) throw( "HistoryUpdate.Execute() arguments missing" );
        if( !isDefined( args.HistoryUpdateDetails ) ) throw( "HistoryUpdate.Execute() HistoryUpdateDetails missing" );
        if( !isDefined( args.HistoryUpdateDetails.length ) ) args.HistoryUpdateDetails = [ args.HistoryUpdateDetails ];
        if( !isDefined( args.Debug ) ) args.Debug = false;
        if( !isDefined( args.Verify ) ) args.Verify = true;

        // register that this service is tested
        ServiceRegister.Register( { Service: ServiceRegister.UaService( { Name: this.Name, Available: true, Tested: true } ) } );

        // prepare our return value
        var result = true;

        // define the historyUpdate headers
        this.Request  = new UaHistoryUpdateRequest.New( args.HistoryUpdateDetails );
        this.Response = new UaHistoryUpdateResponse();
        var session = isDefined( this.Session.Session )? this.Session.Session : this.Session;
        this.Request.RequestHeader = UaRequestHeader.New( { Session: session } );

        // issue the update
        if( isDefined( args.PreHook ) ) args.PreHook();
        var uaStatus = session.historyUpdate( this.Request, this.Response );
        if( isDefined( args.PostHook ) ) args.PostHook();
        // check result
        this.Success = uaStatus.isGood();
        if( uaStatus.isGood() ) {
            result = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging, SuppressErrors: args.SuppressErrors, ServiceInfo: "HistoryUpdateDetails #" + this.Request.HistoryUpdateDetails.length } );
            if( result ) result = this.CheckHistoryUpdateValidParameter( { Request: this.Request, Response: this.Response, ServiceResult: args.ServiceResult, OperationResults: args.OperationResults } );
            //TODO: Insert routine to READ the data back from the server
        }
        else {
            addError( "HistoryUpdate() status: " + uaStatus, uaStatus );
            result = false;
        }

        // if the call failed then register that 
        if( !result ) ServiceRegister.SetFailed( { Name: this.Name } )
        return( result );
    }// this.Execute = function( args )

    // check the response, which contains: DiagnosticInfos[], ResponseHeader, Results[]
    this.CheckHistoryUpdateValidParameter = function( args ) {
        // check in parameters
        if( !isDefined( args ) ){ throw( "HistoryReadHelper.CheckHistoryReadValidParameter missing required argument." ); }
        if( !isDefined( args.Request ) ){ throw( "HistoryReadHelper.CheckHistoryReadValidParameter missing required argument: Request." ); }
        if( !isDefined( args.Response ) ){ throw( "HistoryReadHelper.CheckHistoryReadValidParameter missing required argument: Response." ); }
        if( args.Response.ResponseHeader.ServiceResult.isBad() ) return( false ); // don't check response if overall called failed
        var result = false;
        // check the individual results 
        if( Assert.Equal( args.Request.HistoryUpdateDetails.length, args.Response.Results.length, "HistoryUpdate.Results length do not match the number of requests." ) ) {
            if( isDefined( args.OperationResults ) && Assert.Equal( args.OperationResults.length, args.Response.Results.length, "Expected # of OperationResults does not match the number of actual results received." ) ) {
                for( var i=0; i<args.Response.Results.length; i++ ) {
                    if( !Assert.StatusCodeIsOneOf( args.OperationResults[i], args.Response.Results[i].StatusCode, "HistoryUpdate.Results[" + i + "].StatusCode does not match expectations." ) ) result = false;
                    if( isDefined( args.OperationResults[i].TransactionResults ) ) {
                        if( Assert.Equal( args.OperationResults[i].TransactionResults.length, args.Response.Results[i].OperationResults.length, "HistoryUpdate.Results[" + i + "].OperationResults[] length mismatch." ) ) {
                            for( var t=0; t<args.OperationResults[i].TransactionResults.length; t++ ) {
                                if( !Assert.StatusCodeIsOneOf( args.OperationResults[i].TransactionResults[t], args.Response.Results[i].OperationResults[t], "HistoryUpdate.Results[" + i + "].OperationResults[" + t + "].StatusCode does not match expectations." ) ) result = false;
                            }//for t...
                        }
                    }
                }//for i...
            }
            else for( var i=0; i<args.Response.Results.length; i++ ) result = result && UaHistoryUpdateResult.Validate( args.Response.Results[i] );
        }
        return( result );
    }// this.CheckHistoryUpdateValidParameter = function( args )

}// function HistoryUpdateService( session )