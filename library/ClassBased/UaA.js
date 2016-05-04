/* Includes: 
    UaArgument.New()
    UaAddNodesItem.New()
    UaAddReferencesItem.New()
    UaNodeAttributes.New()
*/

UaArgument.New = function( args ) {
    var x = new UaArgument();
    if ( isDefined( args ) ) {
    	if( isDefined( args.ArrayDimensions ) ) x.ArrayDimensions = args.ArrayDimensions;
    	if( isDefined( args.DataType ) )  x.DataType = args.DataType;
    	if( isDefined( args.ValueRank ) ) x.ValueRank = args.ValueRank;
    }
    return( x );
}

UaAddNodesItem.New = function( args ) {
    var x = new UaAddNodesItem();
    if( isDefined( args ) ) {
        if( isDefined( args.BrowseName ) ) {
            if( isDefined( args.BrowseName.Name ) ) x.BrowseName = args.BrowseName;
            else {
                x.BrowseName.NamespaceIndex = 2;
                x.BrowseName.Name = args.BrowseName;
            }
            if( isDefined( args.NodeAttributes ) ) {
                if( isDefined( args.NodeAttributes.DisplayName ) ) x.NodeAttributes.setNodeAttributes( args.NodeAttributes );
                else x.NodeAttributes = args.NodeAttributes;
            }
            if( isDefined( args.NodeClass ) ) x.NodeClass = args.NodeClass;
            if( isDefined( args.ParentNodeId ) ) {
                if( isDefined( args.ParentNodeId.NodeId ) ) x.ParentNodeId = args.ParentNodeId;
                else x.ParentNodeId.NodeId = args.ParentNodeId;
            }
            if( isDefined( args.ReferenceTypeId ) ) x.ReferenceTypeId = args.ReferenceTypeId;
            if( isDefined( args.RequestedNewNodeId ) ) {
                if( isDefined( args.RequestedNewNodeId.NodeId ) ) x.RequestedNewNodeId = args.RequestedNewNodeId;
                else x.RequestedNewNodeId.NodeId = args.RequestedNewNodeId;
            }
            if( isDefined( args.TypeDefinition ) ) {
                if( isDefined( args.TypeDefinition.NodeId ) ) x.TypeDefinition = args.TypeDefinition;
                else x.TypeDefinition.NodeId = args.TypeDefinition;
            }
        }
    }
    return( x );
}// UaAddNodesItem.New = function( args )

UaAddReferencesItem.New = function( args ) { 
    var o = new UaAddReferencesItem();
    if( isDefined( args ) ) { 
        if( isDefined( args.IsForward ) ) o.IsForward = args.IsForward;
        if( isDefined( args.ReferenceTypeId ) ) o.ReferenceTypeId = args.ReferenceTypeId;
        if( isDefined( args.SourceNodeId ) ) o.SourceNodeId = args.SourceNodeId;
        if( isDefined( args.TargetNodeClass ) ) o.TargetNodeClass = args.TargetNodeClass;
        if( isDefined( args.TargetNodeId ) ) o.TargetNodeId = args.TargetNodeId;
        if( isDefined( args.TargetServerUri ) ) o.TargetServerUri = args.TargetServerUri;
    }
    return( o );
}// UaAddReferencesItem.New = function( args )

UaNodeAttributes.New = function( args ) {
    var x = new UaNodeAttributes();
    if( isDefined( args.Description ) ) {
        if( isDefined( args.Description.Text ) ) x.Description = args.Description;
        else x.Description.Text = args.Description;
    }
    if( isDefined( args.DisplayName ) ) {
        if( isDefined( args.DisplayName.Text ) ) x.DisplayName = args.DisplayName;
        else x.DisplayName.Text = args.DisplayName;
    }
    if( isDefined( args.SpecifiedAttributes ) ) x.SpecifiedAttributes = args.SpecifiedAttributes;
    if( isDefined( args.WriteMask ) ) x.WriteMask = args.WriteMask;
    return( x );
}// UaNodeAttributes.New = function( args )