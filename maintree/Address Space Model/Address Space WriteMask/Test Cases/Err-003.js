/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to a valid attributes (DisplayName, Value) of multiple invalid nodes, in a single call. */

function write582Err011() {
    // define the nodeIds we're going to read from the settings
    var invalidSyntaxNodeNames = Settings.Advanced.NodeIds.Invalid.Invalids;

    // build the write header objects
    var writeReq = new UaWriteRequest()
    var writeRes = new UaWriteResponse()
    Test.Session.Session.buildRequestHeader( writeReq.RequestHeader )

    // prepare our expected error array
    var errorsExpected = [];
    var currentNodeNumber = 0;



    // --------------< INVALID SYNTAX NODE >---------------------
    for( var i=0; i<invalidSyntaxNodeNames.length; i++ )
    {
        //write to the Value, as int 16
        writeReq.NodesToWrite[currentNodeNumber].NodeId = UaNodeId.fromString( readSetting( invalidSyntaxNodeNames[i] ).toString() );
        writeReq.NodesToWrite[currentNodeNumber].AttributeId = Attribute.Value;
        writeReq.NodesToWrite[currentNodeNumber].Value.Value = new UaVariant();
        writeReq.NodesToWrite[currentNodeNumber].Value.Value.setInt16( 100 );

        // prepare our expected error
        errorsExpected[currentNodeNumber] = new ExpectedAndAcceptedResults( StatusCode.BadNodeIdInvalid );
        errorsExpected[currentNodeNumber].addExpectedResult( StatusCode.BadNodeIdUnknown );

        // write to the DisplayName
        writeReq.NodesToWrite[++currentNodeNumber].NodeId = UaNodeId.fromString( readSetting( invalidSyntaxNodeNames[i] ).toString() );
        writeReq.NodesToWrite[currentNodeNumber].AttributeId = Attribute.DisplayName;
        writeReq.NodesToWrite[currentNodeNumber].Value.Value = new UaVariant();
        writeReq.NodesToWrite[currentNodeNumber].Value.Value.setString( "display #1" );

        // prepare our expected error
        errorsExpected[currentNodeNumber] = new ExpectedAndAcceptedResults( StatusCode.BadNodeIdInvalid );
        errorsExpected[currentNodeNumber].addExpectedResult( StatusCode.BadNodeIdUnknown );
    }


    var uaStatus = Test.Session.Session.write( writeReq, writeRes );
    if( uaStatus.isGood() )
    {
        // this is an array of ExpectedAndAcceptedResult. Size of the array = number of nodes to read
        checkWriteError( writeReq, writeRes, errorsExpected, false, invalidSyntaxNodeNames, true );
    }
    else
    {
        addError( "Write(): status " + uaStatus, uaStatus );
    }
    return( true );
}

Test.Execute( { Procedure: write582Err011 } );