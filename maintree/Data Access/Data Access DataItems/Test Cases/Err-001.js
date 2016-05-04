/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Write a value using the wrong data-type to a dataitem node that has property "Definition" */

function write614Err001 ()
{
    var skippedNodes = [];

    // Get handle to dataitem nodes
    var monitoredItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.DataItem.Settings, 1 );
    if ( monitoredItems.length == 0 )
    {
        addSkipped( "Static DataItem" );
        return( false );
    }

    // read the items first
    ReadHelper.Execute( { NodesToRead: monitoredItems } );

    // Loop through the items
    for ( var i=0; i<monitoredItems.length; i++ )
    {
        var hasPropertyReferenceType = MonitoredItem.fromNodeIds( new UaNodeId( Identifier.HasProperty ) )[0];//fromSetting( "/Server Test/NodeIds/References/HasProperty", 1 );
        if ( hasPropertyReferenceType == null )
        {
            addWarning( "Test cannot be completed: HasProperty types not set in settings." );
            _dataTypeUnavailable.store( "HasPropertyType" );
            return( false );
        }
        
        var browseRequest = GetDefaultBrowseRequest( Test.Session.Session, monitoredItems[i].NodeId );
        var browseResponse = new UaBrowseResponse();
        browseRequest.NodesToBrowse[0].ReferenceTypeId = hasPropertyReferenceType.NodeId;
        print ( "Browsing the Definition property of the dataitem node '" + monitoredItems[0].NodeSetting + "'." );
        var uaStatus = Test.Session.Session.browse( browseRequest, browseResponse );
        if ( uaStatus.isGood() )
        {
            AssertBrowseValidParameter( browseRequest, browseResponse );
            
            var definitionFound = false;
            for ( var n=0; n<browseResponse.Results.length; n++ )
            {
                for ( var r=0; r<browseResponse.Results[n].References.length; r++ )
                {
                    if ( browseResponse.Results[n].References[r].BrowseName.Name == "Definition" )
                    {
                        definitionFound = true;
                        break;
                    }
                }
                // Our work here in this loop is done if we have found the Definition property
                if ( definitionFound ) break;
            }
            
            // If Definition found
            if ( definitionFound )
            {
                addLog ( "Definition property found in node '" + monitoredItems[i].NodeSetting + "'. Writing an Int16 value to this node." );
                
                // Now do a write to this node
                // Since we want to invoke an incorrect data-type failure we need to make sure that 
                // we don't write the correct data type to any nodes
                if( monitoredItems[i].Value.Value.DataType === BuiltInType.Int16 )
                {
                    monitoredItems[i].Value.Value.setUInt16 ( 4084 );
                }
                else
                {
                    monitoredItems[i].Value.Value.setInt16 ( 4084 );
                }
                // Expected result
                var results = [];
                results[0] = new ExpectedAndAcceptedResults( StatusCode.BadTypeMismatch );
                // Write the value
                if( WriteHelper.Execute( { NodesToWrite: monitoredItems[i], OperationResults: results } ) == false )
                {                
                    addError( "Write failed for node: '" + monitoredItems[i].NodeSetting + "'." );
                    continue;
                }
            }
            else
            {
                skippedNodes.push( monitoredItems[i].NodeSetting );
            }
        }
        else
        {
            addError( "Browse(): status " + uaStatus, uaStatus );
        }
    }

    // test success?
    if( skippedNodes.length === monitoredItems.length )addSkipped( "Test aborted because none of the  DataItem nodes configured in the settings have the optional 'Definition' property defined." );
    return( true );
}

Test.Execute( { Procedure: write614Err001 } );