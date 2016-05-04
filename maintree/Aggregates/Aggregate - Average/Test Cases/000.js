/*  Test prepared by Nathan Pocock; compliance@opcfoundation.org
    Description: Check the aggregate is listed under the ServerCapabilities.Aggregates folder */

function aggregate000() { 
    var aggregateItem = MonitoredItem.fromNodeIds( CUVariables.Aggregate.Type )[0];
    aggregateItem.BrowseDirection = BrowseDirection.Inverse;
    var result = true;

    if( !BrowseHelper.Execute( { NodesToBrowse: aggregateItem } ) ) result = false;
    if( Assert.GreaterThan( 0, BrowseHelper.Response.Results.length, "Aggregate not found in the Server's address space." ) ) {
        if( Assert.GreaterThan( 0, BrowseHelper.Response.Results[0].References.length, "1 or more INVERSE references expected." ) ) {
            var found = false;
            for( var r=0; r<BrowseHelper.Response.Results[0].References.length; r++ ) {
                if( BrowseHelper.Response.Results[0].References[r].BrowseName.Name === "AggregateFunctions" ) {
                    found = true;
                    break;
                }
            }//for ...
            if( !found ) { addError( "Aggregate '" + CUVariables.Aggregate.Name + "' not found under 'AggregateFunctions' in the Server's address space." ); result = false; }
            else if( CUVariables.Debug ) print( "Aggregate '" + CUVariables.Aggregate.Name + "' found in 'AggregateFunctions'." );
        }
        else result = false;
    }
    else result = false;


    return( result );
}

Test.Execute( { Procedure: aggregate000 } );