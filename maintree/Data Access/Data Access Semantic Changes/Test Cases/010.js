/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Subscribe to multiple items. Modify any property of any node. call Publish()() and expect SemanticsChanged bit = TRUE. */

function semantic010() {
    if( !isDefined( analogItems ) ) {
        addSkipped( "AnalogItemType is not configured. Skipping test." );
        return( false );
    }
    // get the EURange for the item into a Node.
    var expectedResults = [ 
        new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoMatch ] ),
        new ExpectedAndAcceptedResults( [ StatusCode.Good ] ),
        new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoMatch ] )
        ];
    // find the properties available for each analog item, and then cache their nodeIds.
    for( var i=0; i<analogItems.length; i++ ) {
        var uaBrowsePaths = [  
            TranslateBrowsePathsToNodeIdsHelper.stringsToBrowsePaths( analogItems[i].NodeId, [ "InstrumentRange" ] ), 
            TranslateBrowsePathsToNodeIdsHelper.stringsToBrowsePaths( analogItems[i].NodeId, [ "EURange" ] ), 
            TranslateBrowsePathsToNodeIdsHelper.stringsToBrowsePaths( analogItems[i].NodeId, [ "EngineeringUnits" ] ) 
            ];
        if( TranslateBrowsePathsToNodeIdsHelper.Execute( { Node: analogItems[i], UaBrowsePaths: uaBrowsePaths, OperationResults: expectedResults } ) ) {
            if( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].StatusCode.isGood() ) analogItems[i].InstrumentRangeItem = MonitoredItem.fromNodeIds( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].Targets[0].TargetId.NodeId )[0];
            if( TranslateBrowsePathsToNodeIdsHelper.Response.Results[1].StatusCode.isGood() ) analogItems[i].EURangeItem =  MonitoredItem.fromNodeIds( TranslateBrowsePathsToNodeIdsHelper.Response.Results[1].Targets[0].TargetId.NodeId )[0];
            if( TranslateBrowsePathsToNodeIdsHelper.Response.Results[2].StatusCode.isGood() ) analogItems[i].EngineeringUnitsItem =  MonitoredItem.fromNodeIds( TranslateBrowsePathsToNodeIdsHelper.Response.Results[2].Targets[0].TargetId.NodeId )[0];
        }
    }
    // now to subscribe to all of our items
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: analogItems, TimestampsToReturn: TimestampsToReturn.Server, SubscriptionId: defaultSubscription } ) ) {
        // call Publish(), to get the first data-change
        PublishHelper.WaitInterval( { Items: analogItems[0], Subscription: defaultSubscription } );
        PublishHelper.Execute( { FirstPublish: true } );
        Assert.True( PublishHelper.CurrentlyContainsData(), "Publish().Response.NotificationMessage is empty; although the initial data-change was expected." );

        var instrumentRangeChecked = false;
        var engineeringUnitsChecked = false;
        var properties = [];
        for( var i=0; i<analogItems.length; i++ ) {
            // we will add only the first InstrumentRange and EngineeringUnits properties that we find, but we will add ALL EURange properties.
            if( instrumentRangeChecked === false && isDefined( analogItems[i].InstrumentRangeItem ) ) properties.push( analogItems[i].InstrumentRangeItem );
            if( engineeringUnitsChecked === false && isDefined( analogItems[i].EngineeringUnitsItem ) ) properties.push( analogItems[i].EngineeringUnitsItem );
            properties.push( analogItems[i].EURangeItem );
        }

        // read all properties, and then we can adjust them and write them back 
        ReadHelper.Execute( { NodesToRead: properties } );

        // now try to update the properties 
        var expectedResults = [];
        for( var i=0; i<properties.length; i++ ) {
            // try casting to a "extension object" first
            var currItem = ReadHelper.Response.Results[i].Value.toExtensionObject();
            if( isDefined( currItem ) ) {
                // try casting to a Range type; if fails then try an EUInformation type. Anything else is a problem 
                var currProperty = currItem.toRange();
                if( isDefined( currProperty ) ) {
                    properties[i].OriginalValue = currProperty.clone();
                    var newValue = 1 + currProperty.High;
                    print( "Changing Read().Response.Results[" + i + "].Value.High from '" + currProperty.High + ", to " + newValue );
                    currProperty.High = newValue;
                    currItem.setRange( currProperty );
                    properties[i].Value.Value.setExtensionObject( currItem );
                }
                else {
                    currProperty = currItem.toEUInformation();
                    if( !isDefined( currProperty ) ) {
                        addError( "Read().Response.Results[" + i + "] received an item that is an ExtensionObject, but is not a Range or EUInformation." );
                        continue;
                    }
                    currProperty.DisplayName.Text = "CTT" + currProperty.DisplayName.Text;
                    currItem.setEUInformation( currProperty );
                    properties[i].Value.Value.setExtensionObject( currItem );
                }
                expectedResults.push( new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNotSupported, StatusCode.BadUserAccessDenied, StatusCode.BadNotWritable ] ) );
            }
            else addError( "Read().Response.Results[" + i + "].Value received a value that cannot be cast to an ExtensionObject type." );
        }

        // write all properties to the server 
        WriteHelper.Execute( { NodesToWrite: properties, ReadVerification: false, OperationResults: expectedResults } );

        // did the write succeed?
        // we can assume that if one worked, then they all should have worked...
        if( WriteHelper.Response.Results[0].isGood() ) {
            // now call Publish() and make sure ALL items show their semantic bit has changed
            PublishHelper.Execute();
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish expected to return a DataChange notification." ) )
                Assert.Equal( StatusCode.Good | SEMANTICCHANGE_BIT, PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.StatusCode.StatusCode, "Expected the SemanticChanged bit = TRUE because the semantic (EngineeringUnits) has changed.", "SemanticChange bit changed as expected."  );

            // write a value to the item so that we can get a data-change
            for( var i=0; i<analogItems.length; i++ ) {
                // set all values to their EURange.Low, to begin with...
                print( "Item: " + analogItems[i].NodeSetting + "; Value (before): " + analogItems[i].Value.Value.toString() );
                UaVariant.Increment( { Value: analogItems[i].Value, Range: analogItems[i].EURangeItem.Value.Value.toExtensionObject().toRange() } );
                print( "Item: " + analogItems[i].NodeSetting + "; Value (after): " + analogItems[i].Value.Value.toString() + "; range: " + analogItems[i].EURangeItem.Value.Value.toExtensionObject().toRange().toString() );
            }
            WriteHelper.Execute( { NodesToWrite: analogItems, ReadVerification: false } );

            // last publish call, we expect the semantics changed bit to go FALSE
            PublishHelper.WaitInterval( { Items: analogItems[0], Subscription: defaultSubscription } );
            PublishHelper.Execute();
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish expected to return another DataChange notification." ) )
                Assert.Equal( StatusCode.Good, PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.StatusCode.StatusCode, "Expected the SemanticChanged bit = FALSE because we received the notification on the previous Publish() call.", "SemanticChange bit changed has reset to FALSE as expected."  );

            _EngUnitsWritable = true;
        }
        else {
            addSkipped( "The properties (EngineeringUnits, EURange, and/or InstrumentRange) could not be written to " + WriteHelper.Response.Results[0] + ".\nAborting the call to Publish() to check all items have their SemanticChanged bit = TRUE." );
            _EngUnitsWritable = false;
        }

        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: analogItems[0], SubscriptionId: defaultSubscription } );

        // revert all items back to their original EURange only if the write was successful.
        print( "***** Revert all EURange properties back to their initial value *****" );
        if( WriteHelper.Response.Results[0].isGood() ) {
            var itemsToRevert = [];
            for( var i=0; i<properties.length; i++ ) {
                if( isDefined( properties[i].OriginalValue ) ) {
                    var xo = new UaExtensionObject();
                    xo.setRange( properties[i].OriginalValue );
                    properties[i].Value.Value.setExtensionObject( xo );
                    itemsToRevert.push( properties[i] );
                }
            }
            WriteHelper.Execute( { NodesToWrite: itemsToRevert, ReadVerification: false } );
        } // if(WriteHelper)
    }
    return( true );
}// function semantic010()

Test.Execute( { Procedure: semantic010 } );