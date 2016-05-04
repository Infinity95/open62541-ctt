function QueryNextService( args ) {
    this.Name      = "QueryNext";
    this.Session   = null;
    this.Request   = null;
    this.Response  = null;
    this.UaStatus  = null;
    this.CallCount = 0;

    if( !isDefined( args ) ) throw( this.Name + " CTOR, arguments not specified." );
    if( !isDefined( args.Session ) ) throw( this.Name + " CTOR, session not specified." );
    else this.Session = args.Session;


    /* Arguments include: 
        - ReleaseContinuationPoint: Boolean......Optional
        - ContinuationPoint:        Boolean......REQUIRED
        - ServiceResult: 
        - OperationResults: 
        - SuppressMessaging: */
    this.Execute = function( args ) {
        var result = false;
        // check the parameters
        if( !isDefined( args ) ) throw( this.Name + ".Execute() arguments not specified." );
        if( !isDefined( args.ContinuationPoint ) ) throw( this.Name + ".Execute() argument.ContinuationPoint not specified." );
        if( !isDefined( args.ReleaseContinuationPoint ) ) args.ReleaseContinuationPoint = false;
        if( !isDefined( args.SuppressMessaging ) )        args.SuppressMessaging = false;
        // register this service call within our UA Service register 
        ServiceRegister.Register( { Service: ServiceRegister.UaService( { Name: this.Name, Available: true } ) } );
        // prepare the request/response headers
        this.Request =  new UaQueryNextRequest();
        this.Response = new UaQueryNextResponse();
        var session = isDefined( this.Session.Session )? this.Session.Session : this.Session;
        this.Request.RequestHeader = UaRequestHeader.New( { Session: session } );
        // specify any override parameters
        if( isDefined( args.ReleaseContinuationPoint ) ) this.Request.ReleaseContinuationPoint = args.ReleaseContinuationPoint;
        if( isDefined( args.ContinuationPoint ) )        this.Request.ContinuationPoint = args.ContinuationPoint;
        // invoke the call
        if( isDefined( args.PreHook ) ) args.PreHook();
        this.UaStatus = session.queryNext( this.Request, this.Response );
        if( isDefined( args.PostHook ) ) args.PostHook();
        if( this.UaStatus.isGood() ) {
            result = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging, SuppressErrors: args.SuppressErrors, ServiceInfo: "ContinuationPoint: " + this.Request.ContinuationPoint + "; ReleaseContinuationPoints: " + this.Request.ReleaseContinuationPoints } );
            if( result ) result = this.ValidateHeader( { Request: this.Request, Response: this.Response, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging } );
        }
        return( result );
    }
    
    this.ValidateHeader = function( args ) {
        return( false );
    }
}