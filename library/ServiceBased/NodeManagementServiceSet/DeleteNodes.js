function DeleteNodeIdsService( args ) { 
    this.Name = "DeleteNodes";
    this.Session = null;       // session object reference
    this.Request = null;       // copy of the last/current call request header
    this.Response = null;      // copy of the last/current call server response header
    this.Success  = false;     // simple flag indicating if the last/current call succeeded or not.
    this.InvocationCount = 0;

    if( !isDefined( args ) ) throw( this.Name + " CTOR, arguments not specified." );
    if( !isDefined( args.Session ) ) throw( this.Name + " CTOR, session not specified." );
    else this.Session = args.Session;


    /* arguments include: 
        - NodesToDelete: [array] of UaAddNodesItem objects
        - ServiceResult: [array]
        - OperationResults: [array] */
    this.Execute = function( args ) { 
        if( !isDefined( args ) ) throw( this.Name + ".Execute() arguments missing" );
        if( !isDefined( args.NodesToDelete ) ) args.NodesToDelete = [];
        if( !isDefined( args.NodesToDelete.length ) ) args.NodesToDelete = [ args.NodesToDelete ];
        if( !isDefined( args.Debug ) ) args.Debug = false;

        // register that this service is tested
        ServiceRegister.Register( { Service: ServiceRegister.UaService( { Name: this.Name, Available: true, Tested: true } ) } );

        // prepare our return value
        var result = true;

        // prepare the actual call
        this.Request  = new UaDeleteNodesRequest();
        this.Response = new UaDeleteNodesResponse();
        var session = isDefined( this.Session.Session )? this.Session.Session : this.Session;
        this.Request.RequestHeader = UaRequestHeader.New( { Session: session } );

        // specify the nodes to add
        for( var i=0; i<args.NodesToDelete.length; i++ ) this.Request.NodesToDelete[i] = args.NodesToDelete[i];

        if( isDefined( args.PreHook ) ) args.PreHook();
        var uaStatus = session.deleteNodes( this.Request, this.Response );
        if( isDefined( args.PostHook ) ) args.PostHook();
        // check the results
        this.Success = uaStatus.isGood();
        if( uaStatus.isGood() ) {
            result = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging, SuppressErrors: args.SuppressErrors, ServiceName: "NodesToDelete #" + this.Request.NodesToDelete.length } );
            if( result ) result = this.CheckDeleteNodesResponse( { Request: this.Request, Response: this.Response, ServiceResult: args.ServiceResult, OperationResults: args.OperationResults } );
        }
        else {
            addError( this.Name + "() status: " + uaStatus, uaStatus );
            result = false;
        }

        return( result );
    };// this.Execute = function( args )

    this.CheckDeleteNodesResponse = function( args ) { 
        // check in parameters
        if( !isDefined( args ) ){ throw( "HistoryReadHelper.CheckHistoryReadValidParameter missing required argument." ); }
        if( !isDefined( args.Request ) ){ throw( "HistoryReadHelper.CheckHistoryReadValidParameter missing required argument: Request." ); }
        if( !isDefined( args.Response ) ){ throw( "HistoryReadHelper.CheckHistoryReadValidParameter missing required argument: Response." ); }
        if( isDefined( args.OperationResults ) && !isDefined( args.OperationResults.length ) ) args.OperationResults = [ args.OperationResults ];
        var result = true;
        // as this is a valid parameter test we don't expect any diagnositcinfo
        if( args.Response.DiagnosticInfos.length !== 0 ) {
            addError( "HistoryReadResponse.DiagnosticInfos was returned. No DiagnosticInfos were expected." );
            result = false;
        }
        // should we continue validation? do so if not in error
        if( args.Response.ResponseHeader.ServiceResult.isGood() ) {
            // check number of results
            if( !Assert.Equal( args.Request.NodesToDelete.length, args.Response.Results.length, "The number of NodesToDelete does not match the number of results." ) ) result = false;
            else {
                // do we need to check each result?
                // check each result
                if( isDefined( args.OperationResults ) ) 
                    for( var i=0; i<args.Response.Results.length; i++ )  {
                        Assert.StatusCodeIsOneOf( args.OperationResults[i], args.Response.Results[i] );
                        if( args.Response.Results[i].isGood() ) result = false;
                    }
                }
        }
        return result;
    };// this.CheckAddNodesResponse = function( args )

}// function DeleteNodesService( session )