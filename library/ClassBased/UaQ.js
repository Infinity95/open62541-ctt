/* Includes: 
    UaQualifiedName.IsEmpty()
    UaQualifiedName.New()
    UaQueryDataDescription.New()
*/

UaQualifiedName.IsEmpty = function( thisQN ) {
    if( thisQN.Name.length > 0 ) return( false );
    if( thisQN.NamespaceIndex > 0 ) return( false );
    return( true );
}


UaQualifiedName.New = function( args ) { 
    var q = new UaQualifiedName();
    if( isDefined( args ) ){
        if( isDefined( args.NamespaceIndex ) ) q.NamespaceIndex = args.NamespaceIndex;
        if( isDefined( args.Name ) ) q.Name = args.Name;
    }
    return( q );
}

UaQueryDataDescription.New = function( args ) {
    var t = new UaQueryDataDescription();
    if( isDefined( AttributeId ) ) t.AttributeId = args.AttributeId;
    if( isDefined( IndexRange ) ) t.IndexRange = args.IndexRange;
    if( isDefined( RelativePath ) ) t.RelativePath = args.RelativePath;
    if( isDefined( RelativePathStrings ) ) 
    return( t );
}
