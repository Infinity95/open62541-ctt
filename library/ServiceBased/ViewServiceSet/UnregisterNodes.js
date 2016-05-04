include( "./library/ServiceBased/ViewServiceSet/UnregisterNodes/check_unregisterNodes_valid.js" );

function UnregisterNodesService( args ) {
    this.Name = "UnregisterNodes";
    this.Session  = null;
    this.Request  = null;
    this.Response = null;
    this.UaStatus = null;
    this.CallCount = 0;
    if( !isDefined( args ) ) throw( "UnregisterNodes() instanciation failed, argument missing or not a Session object." );
    if( !isDefined( args.Session ) ) throw( this.Name + "() CTOR, session missing" );
    else this.Session = args.Session;

    this.Execute = function( args ) {
        var result = true;
        // check the parameters
        if( !isDefined( args ) ) args = new Object();
        if( !isDefined( args.SuppressMessaging ) ) args.SuppressMessaging = false;
        // prepare the request/response headers
        this.Request = new UaUnregisterNodesRequest();
        this.Response = new UaUnregisterNodesResponse();
        var session = isDefined( this.Session.Session )? this.Session.Session : this.Session;
        this.Request.RequestHeader = UaRequestHeader.New( { Session: session } );
        // add the nodes to register
        if( isDefined( args ) && isDefined( args.NodesToUnregister ) ) {
            if( !isDefined( args.NodesToUnregister.length ) ) args.NodesToUnregister = [ args.NodesToUnregister ];
            for( var n=0; n<args.NodesToUnregister.length; n++ ) this.Request.NodesToUnregister[n] = args.NodesToUnregister[n];
        }
        // invoke the call
        if( isDefined( args.PreHook ) ) args.PreHook();
        this.UaStatus = session.unregisterNodes( this.Request, this.Response );
        if( isDefined( args.PostHook ) ) args.PostHook();
        if( this.UaStatus.isGood() ) {
            result = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging, SuppressErrors: args.SuppressErrors, ServiceInfo: "NodesToUnregister #" + this.Request.NodesToUnregister.length } );
            if( result ) result = checkUnregisterNodesValidParameter( this.Session.Session, this.Request, this.Response, args.SuppressMessaging );
        }
        return( result );
    };
}