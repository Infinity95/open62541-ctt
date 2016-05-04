include( "./library/ServiceBased/ViewServiceSet/RegisterNodes/check_registerNodes_valid.js" );

function RegisterNodesService( args ) {
    this.Name = "RegisterNodes";
    this.Session   = null;
    this.Request   = null;
    this.Response  = null;
    this.UaStatus  = null;
    this.CallCount = 0;
    if( !isDefined( args ) ) throw( "RegisterNodes() instanciation failed, arguments is missing or not a Session object." );
    if( !isDefined( args.Session ) ) throw( this.Name + " CTOR failed; session not specified." );
    else this.Session = args.Session;

    this.Execute = function( args ) {
        var result = true;
        // check the parameters
        if( !isDefined( args ) ) args = new Object();
        if( !isDefined( args.SuppressMessaging ) ) args.SuppressMessaging = false;
        // prepare the request/response headers
        this.Request = new UaRegisterNodesRequest();
        this.Response = new UaRegisterNodesResponse();
        var session = isDefined( this.Session.Session )? this.Session.Session : this.Session;
        this.Request.RequestHeader = UaRequestHeader.New( { Session: session } );
        // add the nodes to register
        if( isDefined( args ) && isDefined( args.NodesToRegister ) ) {
            if( !isDefined( args.NodesToRegister.length ) ) args.NodesToRegister = [ args.NodesToRegister ];
            for( var n=0; n<args.NodesToRegister.length; n++ ) this.Request.NodesToRegister[n] = args.NodesToRegister[n];
        }
        // invoke the call
        if( isDefined( args.PreHook ) ) args.PreHook();
        this.UaStatus = session.registerNodes( this.Request, this.Response );
        if( isDefined( args.PostHook ) ) args.PostHook();
        if( this.UaStatus.isGood() ) {
            result = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging, SuppressErrors: args.SuppressErrors, ServiceInfo: "NodesToRegister #" + this.Request.NodesToRegister.length } );
            if( result ) result = checkRegisterNodesValidParameter( this.Request, this.Response, args.SuppressMessaging );
        }
        return( result );
    };
}