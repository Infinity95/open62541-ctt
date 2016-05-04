/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Write to an AnalogItemType that DOES have an InstrumentRange defined, 3 values to 
        each data type where the values are: max value of the data-type, lowest value of the data-type, 
        and any number in the middle of the data-type range. */

function read613007() {
    var messages = [];
    // Get handle to an analog node
    if( AnalogItems == null || AnalogItems.length == 0 ) {
        addSkipped( "Static Analog" );
        return( false );
    }

    var nodesWithInstrRange = [];
    var euRangeNodes = [];
    var expectedResults = [ new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoMatch ] ), new ExpectedAndAcceptedResults( [ StatusCode.Good ] ) ];

    // find items that we can test with; we're looking for nodes that HAVE InstrumentRange property.
    for( var i=0; i<AnalogItems.length; i++ ) {
        var uaBrowsePaths = [ 
            TranslateBrowsePathsToNodeIdsHelper.stringsToBrowsePaths( AnalogItems[i], [ "InstrumentRange" ] ), 
            TranslateBrowsePathsToNodeIdsHelper.stringsToBrowsePaths( AnalogItems[i], [ "EURange" ] ) ];

         if( !TranslateBrowsePathsToNodeIdsHelper.Execute( { Node: AnalogItems[i], UaBrowsePaths: uaBrowsePaths, OperationResults: expectedResults, } ) ) return( false );
         
         if( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].StatusCode.isGood() ) {
             nodesWithInstrRange.push( AnalogItems[i] );
             euRangeNodes.push( MonitoredItem.fromNodeIds( TranslateBrowsePathsToNodeIdsHelper.Response.Results[1].Targets[0].TargetId.NodeId )[0] );
         }
    }//for i

    if( nodesWithInstrRange.length === 0 ) addSkipped( "All nodes of type AnalogItemType are missing the InstrumentRange property, and this test applies ONLY when an InstrumentRange exists." );
    else {
        // read all items, so that we can get their data-types
        ReadHelper.Execute( { NodesToRead: nodesWithInstrRange.concat( euRangeNodes ) } );

        // now to write the MAX value of each data-type to each node: 
        addLog( "Writing the MAX value of each data-type to " + nodesWithInstrRange.length + " nodes of type AnalogItemType." );
        var expectedResults = [];
        for( var i=0; i<nodesWithInstrRange.length; i++ ) {
            nodesWithInstrRange[i].OriginalValue = nodesWithInstrRange[i].Value.Value.clone();
            expectedResults.push( new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadOutOfRange ] ) );
            UaVariant.SetValueMax( { Value: nodesWithInstrRange[i].Value } );
        }
        WriteHelper.Execute( { NodesToWrite: nodesWithInstrRange, ReadVerification: false, OperationResults: expectedResults } );
        /* now to check the results, which might be:
            a. Good, because its supported
            b. Good, but the value is Clamped to the EURange
            c. Bad_OutOfRange */
        ReadHelper.Execute( { NodesToRead: nodesWithInstrRange } );
        for( var i=0; i<WriteHelper.Response.Results.length; i++ ) {
            if( WriteHelper.Response.Results[i].isGood() ) {
                // the value should either match the value we wrote, or match the EURange.High 
                if( !Assert.Equal( WriteHelper.Request.NodesToWrite[i].Value.Value, ReadHelper.Response.Results[i].Value, undefined, undefined, true ) ) {
                    var range = euRangeNodes[i].Value.Value.toExtensionObject().toRange();
                    Assert.Equal( range.High, ReadHelper.Response.Results[i].Value, "Read().Response.Results[" + i + "].Value (" + ReadHelper.Response.Results[i].Value + ") does not match the value written (" + WriteHelper.Request.NodesToWrite[i].Value.Value + ") or the EURange.High (" + range.High + "). One of these values was expected." );
                }
                else if( !isDefined( messages[0] ) ) messages[0] = "Server allows Write() to exceed the value of property: EURange.High.";
            }
            else {
                addLog( "Server rejected out-of-bounds Write() (exceeding EURange.High) returning: " + WriteHelper.Response.Results[i].StatusCode.toString() );
                messages.push( "Server rejects Write() that exceeds EURange.High." );
            }
        }//for i

        // now to write the MIN value of each data-type to each node: 
        addLog( "Writing the MIN value of each data-type to " + nodesWithInstrRange.length + " nodes of type AnalogItemType." );
        for( var i=0; i<nodesWithInstrRange.length; i++ ) UaVariant.SetValueMin( { Value: nodesWithInstrRange[i].Value } );
        WriteHelper.Execute( { NodesToWrite: nodesWithInstrRange, ReadVerification: false, OperationResults: expectedResults } );
        /* now to check the results, which might be:
            a. Good, because its supported
            b. Good, but the value is Clamped to the EURange
            c. Bad_OutOfRange */
        ReadHelper.Execute( { NodesToRead: nodesWithInstrRange } );
        for( var i=0; i<WriteHelper.Response.Results.length; i++ ) {
            if( WriteHelper.Response.Results[i].isGood() ) {
                // the value should either match the value we wrote, or match the EURange.High 
                if( !Assert.Equal( WriteHelper.Request.NodesToWrite[i].Value.Value, ReadHelper.Response.Results[i].Value, undefined, undefined, true ) ) {
                    var range = euRangeNodes[i].Value.Value.toExtensionObject().toRange();
                    Assert.Equal( range.Low, ReadHelper.Response.Results[i].Value, "Read().Response.Results[" + i + "].Value (" + ReadHelper.Response.Results[i].Value + ") does not match the value written (" + WriteHelper.Request.NodesToWrite[i].Value.Value + ") or the EURange.Low (" + range.Low + "). One of these values was expected." );
                }
                else if( !isDefined( messages[1] ) ) messages[1] = "Server allows Write() to exceed the value of property: EURange.Low.";
            }
            else {
                addLog( "Server rejected out-of-bounds Write() (exceeding EURange.Low) returning: " + WriteHelper.Response.Results[i].StatusCode.toString() );
                messages.push( "Server rejects Write() that exceeds EURange.Low." );
            }
        }//for i

        // now to write the middle value of each data-type to each node: 
        addLog( "Writing the middle value of each data-type to " + nodesWithInstrRange.length + " nodes of type AnalogItemType." );
        for( var i=0; i<nodesWithInstrRange.length; i++ ) UaVariant.SetValueMiddle( { Value: nodesWithInstrRange[i].Value } );
        WriteHelper.Execute( { NodesToWrite: nodesWithInstrRange, ReadVerification: false, OperationResults: expectedResults } );
        /* now to check the results, which might be:
            a. Good, because its supported
            b. Good, but the value is Clamped to the EURange
            c. Bad_OutOfRange */
        ReadHelper.Execute( { NodesToRead: nodesWithInstrRange } );
        for( var i=0; i<WriteHelper.Response.Results.length; i++ ) {
            if( WriteHelper.Response.Results[i].isGood() ) {
                // the value should either match the value we wrote, or match the EURange.High 
                if( !Assert.Equal( WriteHelper.Request.NodesToWrite[i].Value.Value, ReadHelper.Response.Results[i].Value, undefined, undefined, true ) ) {
                    var range = euRangeNodes[i].Value.Value.toExtensionObject().toRange();
                    Assert.InRange( range.Low, range.High, ReadHelper.Response.Results[i].Value, "Read().Response.Results[" + i + "].Value (" + ReadHelper.Response.Results[i].Value + ") does not match the value written (" + WriteHelper.Request.NodesToWrite[i].Value.Value + ") or the EURange.Low (" + range.Low + "). One of these values was expected." );
                }
                else if( !isDefined( messages[2] ) ) messages[2] = "Server allows Write() to exceed the value of property: EURange.High and Low.";
            }
            else {
                addLog( "Server rejected out-of-bounds Write() (exceeding EURange.Low) returning: " + WriteHelper.Response.Results[i].StatusCode.toString() );
                messages.push( "Server rejects Write() that exceeds EURange.Low." );
            }
        }//for i
    }
    // clean-up
    nodesWithInstrRange = null;
    for( var i=0; i<messages.length; i++ ) addLog( messages[i].toString() );
    return( true );
}

Test.Execute( { Procedure: read613007 } );