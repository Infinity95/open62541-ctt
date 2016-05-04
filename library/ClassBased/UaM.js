/* Includes: 
    UaMethodAttributes.New()
    .New()
*/
UaMethodAttributes.New = function( args ) {
    var x = new UaMethodAttributes();
    if( isDefined( args.Description ) ) {
        if( isDefined( args.Description.Text ) ) x.Description = args.Description;
        else x.Description.Text = args.Description;
    }
    if( isDefined( args.DisplayName ) ) {
        if( isDefined( args.DisplayName.Text ) ) x.DisplayName = args.DisplayName;
        else x.DisplayName.Text = args.DisplayName;
    }
    if( isDefined( args.Executable ) ) x.Executable = args.Executable;
    if( isDefined( args.SpecifiedAttributes ) ) x.SpecifiedAttributes = args.SpecifiedAttributes;
    if( isDefined( args.UserExecutable ) ) x.UserExecutable = args.UserExecutable;
    if( isDefined( args.UserWriteMask ) ) x.UserWriteMask = args.UserWriteMask;
    if( isDefined( args.WriteMask ) ) x.WriteMask = args.WriteMask;
    if( isDefined( args.ToExtensionObject ) ) {
        var extObj = new UaExtensionObject();
        extObj.setMethodAttributes( x );
        x = extObj;
    }
    return( x );
}// UaMethodAttributes.New = function( args )

ModellingRule = {
    Unspecified: 0,
    Mandatory: 1,
    Optional: 2,
    Constraint: 3,
    FromNodeId: function( nodeid ) {
        if( nodeid === undefined || nodeid === null ) throw( "ModellingRule.FromNodeId() nodeid not specified." );
        if( nodeid.NodeId !== undefined ) nodeid = nodeid.NodeId;
        if( nodeid.equals( new UaNodeId( Identifier.ModellingRule_Mandatory ) ) ) return( ModellingRule.Mandatory );
        if( nodeid.equals( new UaNodeId( Identifier.ModellingRule_Optional ) ) )  return( ModellingRule.Optional );
        if( nodeid.equals( new UaNodeId( Identifier.ModellingRule_CardinalityRestriction ) ) ) return( ModellingRule.Constraint );
        return( ModellingRule.Unspecified );
    },
    ToNodeId: function( value ) {
        if( value === ModellingRule.Unspecified ) return( null );
        if( value === ModellingRule.Mandatory ) return( new UaNodeId( Identifier.ModellingRule_Mandatory ) );
        if( value === ModellingRule.Optional  ) return( new UaNodeId( Identifier.ModellingRule_Optional  ) );
        if( value === ModellingRule.Constraint) return( new UaNodeId( Identifier.ModellingRule_CardinalityRestriction ) );
        return( null );
    },
    toString: function( value ) {
        var s = "";
        if( isDefined( value ) ) {
            switch( value ) {
                case ModellingRule.Unspecified: s = "Unspecified"; break;
                case ModellingRule.Mandatory:   s = "Mandatory";   break;
                case ModellingRule.Optional:    s = "Optional";    break;
                case ModellingRule.Constraint:  s = "Constraint";  break;
            }
        }
        return( s );
    },
    SubtypeModellingRuleValid: function( args ) {
        if( !isDefined( args ) || !isDefined( args.ParentModellingRule ) || !isDefined( args.ChildModellingRule ) ) throw( "ModellingRule.SubtypeModellingRuleValid() args not specified" );
        var result = true;
        if( args.ParentModellingRule === ModellingRule.Mandatory && args.ChildModellingRule !== ModellingRule.Mandatory ) {
            addError( "ParentType.ModellingRule is Mandatory; SubType.ModellingRule should be 'mandatory' but is actually: " + ModellingRule.toString( args.ChildModellingRule ) );
            result = false;
        }
        else if( args.ParentModellingRule === ModellingRule.Optional && ( !( args.ChildModellingRule === ModellingRule.Optional || args.ChildModellingRule === ModellingRule.Mandatory ) ) ) {
            addError( "ParentType.ModellingRule is Optional; SubType.ModellingRule should be 'optional' or 'mandatory', but is actually: " + ModellingRule.toString( args.ChildModellingRule ) );
            result = false;
        }
        else if( args.ParentModellingRule === ModellingRule.Constraint && args.ChildModellingRule !== ModellingRule.Constraint ) {
            addError( "ParentType.ModellingRule is Constraint; SubType.ModellingRule should be 'constraint', but is actually: " + ModellingRule.toString( args.ChildModellingRule ) );
            result = false;
        }
        return( result );
    }
};