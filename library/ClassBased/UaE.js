/* Includes: 
    UaExpandedNodeId.New = function()        : creates a new type
    UaEndpointDescription.FindTokenType()    : Searches a given endpoint for a specific token-type
    UaEndpointDescription.FindSecurityMode() : Searches a given endpoint for a specific security mode
    **UaExtensionObject.FromUaType()           : Converts an ExtensionObject to its encoded type

                ** is INCOMPLETE
*/

UaExpandedNodeId.New = function( args ) {
    var x = new UaExpandedNodeId();
    if( isDefined( args ) )  {
        if( isDefined( args.NamespaceUri ) ) x.NamespaceUri = args.NamespaceUri;
        if( isDefined( args.ServerIndex ) )  x.ServerIndex  = args.ServerIndex;
        if( isDefined( args.NodeId ) ) x.NodeId = args.NodeId;
    }
    return( x );
}

UaEndpointDescription.FindTokenType = function( args ) {
    if( !isDefined( args ) ) throw( "UaEndpointDescription::FindTokenType: args not specified" );
    if( !isDefined( args.Endpoint ) || !isDefined( args.Endpoint.UserIdentityTokens ) ) throw( "UaEndpointDescription::FindTokenType: args.Endpoint not specified or is of the wrong type" );
    if( !isDefined( args.TokenType ) ) throw( "UaEndpointDescription::FindTokenType: args.TokenType not specified" );
    for( var u=0; u<args.Endpoint.UserIdentityTokens.length; u++ ) { // iterate thru each user identity token
        if( args.TokenType === args.Endpoint.UserIdentityTokens[u].TokenType ) {
            // some servers do not put the securityPolicyUri and leave the field empty; if so, grab it from the parent endpoint
            if( args.Endpoint.UserIdentityTokens[u].SecurityPolicyUri.length < 1 ) {
                args.Endpoint.UserIdentityTokens[u].SecurityPolicyUri = args.Endpoint.SecurityPolicyUri;
                addWarning( "SecurityPolicyUri empty in EndpointDescription. Verify all EndpointDescription fields contain valid information." );
            }
            return( args.Endpoint.UserIdentityTokens[u].clone() );
        }
    }//for u
    return( null );
}

UaEndpointDescription.FindSecurityMode = function( args ) {
    if( !isDefined( args ) ) throw( "UaEndpointDescription::FindSecurityMode: args not specified" );
    if( !isDefined( args.Endpoints ) || !isDefined( args.Endpoints.length ) ) throw( "UaEndpointDescription::FindSecurityMode: args.Endpoints not specified or is of the wrong type" );
    if( !isDefined( args.MessageSecurityMode ) ) throw( "UaEndpointDescription::FindSecurityMode: args.MessageSecurityMode not specified" );
    for( var e=0; e<args.Endpoints.length; e++ ) { // iterate thru each endpoint
        if( args.MessageSecurityMode === args.Endpoints[e].SecurityMode ) return( args.Endpoints[e] );
    }//for u
    return( null );
}

UaExtensionObject.FromUaType = function( xo ) {
    if( !isDefined( xo ) ) throw( "UaExtensionObject.FromUaType() extensionObject not specified." );
    if( isDefined( xo.toExtensionObject ) ) xo = xo.toExtensionObject();
    if( xo.TypeId.NodeId.equals( new UaNodeId( Identifier.AddNodesItem ) ) )           return( xo.toAddNodesItem() );
    if( xo.TypeId.NodeId.equals( new UaNodeId( Identifier.AddNodesResult ) ) )         return( xo.toAddNodesResult() );
    if( xo.TypeId.NodeId.equals( new UaNodeId( Identifier.AddReferencesItem ) ) )      return( xo.toAddReferencesItem() );
    if( xo.TypeId.NodeId.equals( new UaNodeId( Identifier.AggregateConfiguration ) ) ) return( xo.toAggregateConfiguration() );
    if( xo.TypeId.NodeId.equals( new UaNodeId( Identifier.AggregateFilter ) ) )        return( xo.toAggregateFilter() );
    if( xo.TypeId.NodeId.equals( new UaNodeId( Identifier.AggregateFilterResult ) ) )  return( xo.toAggregateFilterResult() );
    if( xo.TypeId.NodeId.equals( new UaNodeId( Identifier.Annotation ) ) )             return( xo.toAnnotation() );
    if( xo.TypeId.NodeId.equals( new UaNodeId( Identifier.Range ) )         || xo.TypeId.NodeId.equals( new UaNodeId( Identifier.Range_Encoding_DefaultXml ) )         || xo.TypeId.NodeId.equals( new UaNodeId( Identifier.Range_Encoding_DefaultBinary ) ) ) return( xo.toRange() );
    if( xo.TypeId.NodeId.equals( new UaNodeId( Identifier.EUInformation ) ) || xo.TypeId.NodeId.equals( new UaNodeId( Identifier.EUInformation_Encoding_DefaultXml ) ) || xo.TypeId.NodeId.equals( new UaNodeId( Identifier.EUInformation_Encoding_DefaultBinary ) ) ) return( xo.toEUInformation() );
    throw( "UaExtensionObject.FromUaType() unrecognized type '" + xo.TypeId.NodeId + "' (BuiltInType: " + BuiltInType.toString( xo.TypeId.NodeId ) + ")." );
}