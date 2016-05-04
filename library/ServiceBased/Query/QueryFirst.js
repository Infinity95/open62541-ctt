function QueryFirstService( args ) {
    this.Name      = "QueryFirst";
    this.Session   = null;
    this.Request   = null;
    this.Response  = null;
    this.UaStatus  = null;
    this.CallCount = 0;

    if( !isDefined( args ) ) throw( this.Name + " CTOR, arguments not specified." );
    if( !isDefined( args.Session ) ) throw( this.Name + " CTOR, session not specified." );
    else this.Session = args.Session;



    /* Arguments include: 
        - View:                  ViewDescription......Optional
        - NodeTypes[]:           NodeTypeDescription..REQUIRED
        - Filter:                ContentFilter........Optional
        - MaxDataSetsToReturn:   Counter..............Optional
        - MaxReferencesToReturn: Counter..............Optional 
        - ServiceResult: 
        - OperationResults: 
        - SuppressMessaging: */
    this.Execute = function( args ) {
        var result = false;
        // check the parameters
        if( !isDefined( args ) ) throw( this.Name + ".Execute() arguments not specified." );
        if( !isDefined( args.NodeTypes ) ) throw( this.Name + ".Execute() argument.NodeTypes[] not specified." );
        if( !isDefined( args.NodeTypes.length ) ) args.NodeTypes = [ args.NodeTypes ];
        if( !isDefined( args.SuppressMessaging ) ) args.SuppressMessaging = false;
        // register this service call within our UA Service register 
        ServiceRegister.Register( { Service: ServiceRegister.UaService( { Name: this.Name, Available: true } ) } );
        // prepare the request/response headers
        this.Request = new UaQueryFirstRequest();
        this.Response = new UaQueryFirstResponse();
        var session = isDefined( this.Session.Session )? this.Session.Session : this.Session;
        this.Request.RequestHeader = UaRequestHeader.New( { Session: session } );
        // specify any override parameters
        if( isDefined( args.View ) )   this.Request.View = args.View;
        if( isDefined( args.Filter ) ) this.Request.Filter = args.Filter;
        if( isDefined( args.MaxDataSetsToReturn ) )   this.Request.MaxDataSetsToReturn = args.MaxDataSetsToReturn;
        if( isDefined( args.MaxReferencesToReturn ) ) this.Request.MaxReferencesToReturn = args.MaxReferencesToReturn;
        // add the requested node types
        for( var n=0; n<args.NodeTypes; n++ ) { // iterate thru all inbound items
            this.Request.NodeTypes[n] = args.NodeTypes[n];
        }//for n...
        // invoke the call
        if( isDefined( args.PreHook ) ) args.PreHook();
        this.UaStatus = session.queryFirst( this.Request, this.Response );
        if( isDefined( args.PostHook ) ) args.PostHook();
        if( this.UaStatus.isGood() ) {
            result = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging, SuppressErrors: args.SuppressErrors, ServiceInfo: "MaxDataSetsToReturn: " + this.Request.MaxDataSetsToReturn + "; MaxReferencesToReturn: " + this.Request.MaxReferencesToReturn + "; ..." } );
            if( result ) result = this.ValidateHeader( { Request: this.Request, Response: this.Response, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging } );
        }
        return( result );
    }
    
    this.ValidateHeader = function( args ) {
        return( false );
    }
}