/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org 
    Description: Verify the root folder contains the correct objects below it */

function test() {
const ERR_MSG = " missing from the system. This is legal for Nano and Micro UA Servers because the type-system is optional. All other Servers must include them.";
    this.checkNodeClasses = function( rootNode, expectedNodeClass ) {
        print( "Checking folder '" + rootNode + "' for nodes of type '" + NodeClass.toString( expectedNodeClass ) + "' only." );
        var result = true;
        if( BrowseHelper.Execute( { NodesToBrowse: MonitoredItem.fromNodeIds( rootNode )[0], SuppressMessage: true } ) ) {
            for( var r=0; r<BrowseHelper.Response.Results[0].References.length; r++ ) {
                var currRef = BrowseHelper.Response.Results[0].References[r];
                // don't check inverse references
                if( currRef.IsForward === false ) continue;
                // there's some nodes we don't want to browse, i.e. Properties, Methods, Sub-types
                var referencesToIgnore = [
                    new UaNodeId( Identifier.HasProperty ),
                    new UaNodeId( Identifier.HasComponent ),
                    new UaNodeId( Identifier.HasSubtype ),
                    new UaNodeId( Identifier.HasTypeDefinition )
                    ];
                var goDeeper = true;
                for( var e=0; e<referencesToIgnore.length; e++ ) {
                    if( currRef.ReferenceTypeId.equals( referencesToIgnore[e] ) ) {
                        goDeeper = false;
                        break;
                    }
                }
                if( goDeeper ) {
                    // now check the node-class
                    if( !Assert.Equal( NodeClass.toString( expectedNodeClass) , NodeClass.toString( currRef.NodeClass ), "NodeClass mismatch on NodeId '" + rootNode + "'." ) ) {
                        addError( "Reference... BrowseName: " + currRef.BrowseName + "; TypeDef: " + currRef.TypeDefinition.NodeId + "; RefType: " + currRef.ReferenceTypeId );
                        result = false;
                    }
                    // let's recursively browse this item
                    result &= this.checkNodeClasses( currRef.NodeId.NodeId, expectedNodeClass );
                }
            }//for r...
        }// browse success?
        return( result );
    };

    var expectedFolders = [
            new UaNodeId( Identifier.RootFolder ),
            new UaNodeId( Identifier.ObjectsFolder ),
            new UaNodeId( Identifier.TypesFolder   ),
            new UaNodeId( Identifier.ViewsFolder   ),
            new UaNodeId( Identifier.ObjectTypesFolder ),
            new UaNodeId( Identifier.VariableTypesFolder ),
            new UaNodeId( Identifier.ReferenceTypesFolder ),
            new UaNodeId( Identifier.DataTypesFolder ),
            new UaNodeId( Identifier.EventTypesFolder )
        ];

    var expectedResults = [
            new ExpectedAndAcceptedResults(   StatusCode.Good ),
            new ExpectedAndAcceptedResults(   StatusCode.Good ),
            new ExpectedAndAcceptedResults(   StatusCode.Good ),
            new ExpectedAndAcceptedResults(   StatusCode.Good ),
            new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNotFound, StatusCode.BadNodeIdUnknown ] ),
            new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNotFound, StatusCode.BadNodeIdUnknown ] ),
            new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNotFound, StatusCode.BadNodeIdUnknown ] ),
            new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNotFound, StatusCode.BadNodeIdUnknown ] ),
            new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNotFound, StatusCode.BadNodeIdUnknown ] ) ];

    if( BrowseHelper.Execute( { NodesToBrowse: expectedFolders, OperationResults: expectedResults } ) ) {
        var results = [];
        for( var i=0; i<BrowseHelper.Response.Results.length; i++ ) results.push( BrowseHelper.Response.Results[i].StatusCode.isGood() );
        if( !results[4] ) addWarning( "ObjectType"    + ERR_MSG );
        if(  results[5] ) result &= this.checkNodeClasses( expectedFolders[5], NodeClass.VariableType );  else addWarning( "VariableType"  + ERR_MSG );
        if(  results[6] ) result &= this.checkNodeClasses( expectedFolders[6], NodeClass.ReferenceType ); else addWarning( "ReferenceType" + ERR_MSG );
        if(  results[7] ) result &= this.checkNodeClasses( expectedFolders[7], NodeClass.DataType );      else addWarning( "DataType"   + ERR_MSG );
        if(  results[8] ) result &= this.checkNodeClasses( expectedFolders[8], NodeClass.ObjectType );    else addWarning( "ObjectType" + ERR_MSG );
    }
    else result = false;

    return( result );
}

Test.Execute( { Debug: true, Procedure: this.test } );