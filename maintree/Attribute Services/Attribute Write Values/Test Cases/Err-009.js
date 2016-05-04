/* Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
   Description: Write a NULL value for each supported data-type. Expect a Bad_TypeMismatch for each operation level result. */

function write582019() { 
    var scalarNodes = Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings;
    var items = MonitoredItem.fromSettings( scalarNodes, 0, Attribute.Value);
    if( items == null || items.length < 2 ) { addSkipped( SETTING_UNDEFINED_SCALARSTATIC ); return( false ); }
    if( !ReadHelper.Execute( { NodesToRead: items } ) ) {
        addError( "Read(): status " + ReadHelper.uaStatus,ReadHelper.uaStatus );
        return( false );
    }

    // check if ANY of our nodes support the "AllowNulls" property; if so,
    // then check if the [boolean] value is
    // TRUE (nulls are accepted) or FALSE (nulls not accepted)
    for( var i=0; i<items.length; i++ ) {
        if( TranslateBrowsePathsToNodeIdsHelper.Execute( { Node:items[i].NodeId, BrowsePaths: [ "AllowNulls" ], OperationResults: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoMatch ] ) } )) {
            if( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].StatusCode.isGood() ) {
                var temp = new MonitoredItem( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].Targets[0].TargetId.NodeId );
                items[i].AllowNulls = temp.Value.Value.toBoolean();
            }
        }
    }// for i...

    var expectedResults = [];
    var replacementValues = [];

    //dynamically construct IDs of nodes to write, specifically their values.
    for( var i=0; i<items.length; i++ ) {
        if( isDefined( items[i].AllowNulls ) ) {
            if( items[i].AllowNulls ) expectedResults[i] = new ExpectedAndAcceptedResults(StatusCode.Good);
            else expectedResults[i] = new ExpectedAndAcceptedResults(StatusCode.BadTypeMismatch );
        }
        else {
            expectedResults[i] = new ExpectedAndAcceptedResults( StatusCode.BadTypeMismatch );
            expectedResults[i].addExpectedResult( StatusCode.Good );
        }

        // add exceptions for String and ByteString
        if( items[i].Value.Value.DataType === BuiltInType.String || items[i].Value.Value.DataType === BuiltInType.ByteString ||
            items[i].Value.Value.DataType === BuiltInType.XmlElement ) {
            expectedResults[i].addAcceptedResult( StatusCode.Good );
        }

        // store the value retrieved first
        replacementValues[i] = items[i].Value.Value;

        //get the value of the setting, and make sure it contains a value
        items[i].Value.Value = new UaVariant();
    }//for


    //WRITE the nodes.
    WriteHelper.Execute( { NodesToWrite: items, OperationResults:expectedResults } );

    // in case we did write nulls, replace them with normal values (having nulls can screw up following scripts)
    for( i=0; i<replacementValues.length; i++ ) {
        items[i].Value.Value = replacementValues[i];
        expectedResults[i] = new ExpectedAndAcceptedResults( StatusCode.Good );
        expectedResults[i].addExpectedResult( StatusCode.BadWriteNotSupported );
    }

    WriteHelper.Execute( { NodesToWrite: items, CheckNotSupported: true } );
    return( true );
}

Test.Execute( { Procedure: write582019 } );