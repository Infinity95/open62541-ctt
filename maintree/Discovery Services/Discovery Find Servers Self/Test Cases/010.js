/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        The following test-case covers a multi-homed PC.
        Call FindServers to obtain a list of all endpoints.
        Identify if the endpoints returned indicate that the Server is on a multi-homed PC. If not multi-homed then skip the test.
        For each IP/hostname identified in the endpoints list, call FindServers and specify a filter for a specific IP/hostname.
    Expected results:
        All service results are Good.
        The Servers array is not empty, and contains valid data.
        Each FindServers call that requests a filtered list will return only the endpoints that match the filter, and match 
        those entries (that apply) received in the initial FindServers request. */

function findServers551019() {
    var epFilter = readSetting( "/Server Test/Server URL" ).toString();
    // call findservers to obtain a raw list of endpoints
    if( !FindServersHelper.Execute( { EndpointUrl: epFilter } ) ) return( false );

    var rawEndpoints = FindServersHelper.Response.clone();
    print( "raw endpoints: " + rawEndpoints.toString() );

    // construct a list of hostnames and/or IPs
    FindServersHelper.CollectIpHostnames();
    if( FindServersHelper.Hostnames.length < 2 ) {
        addSkipped( "Not enough endpoints to test. This test is designed for multi-endpoint and/or multi-homed hosts." );
        return( false );
    }

    // check to make sure that the endpoint received matches the filter
    Assert.Equal( epFilter, FindServersHelper.Response.Servers[0].DiscoveryUrls[0], "Expected FindServers to return a DiscoveryUrl that matched the endpoint specified. " );

    // do we have a multi-homed PC?
    if( !FindServersHelper.IsMultiHomed() ) {
        addSkipped( "Not a multihomed host; skipping test." );
        return( false );
    }

    // iteratively call FindServers by passing in a filter based on each of the hostnames/IPs that we have previously detected.
    for( var n=0; n<FindServersHelper.Hostnames.length; n++ ) {
        var hostname = FindServersHelper.Hostnames[n];
        var eps = FindServersHelper.FindEndpointsForHostname( hostname );
        // iterate through each endpoint
        for( var e=0; e<eps.length; e++ ) {
            FindServersHelper.Execute( { EndpointUrl: eps[e] } );
            if( Assert.GreaterThan( 0, FindServersHelper.Response.Servers.length, "FindServers expected to receive at least 1 server matching the specified endpoint filter '" + FindServersHelper.Hostnames[n] + "'." ) ) {
                addLog( "FindServers returned one record, as expected." );
            }
            if( Assert.Equal( eps[e], FindServersHelper.Response.Servers[0].DiscoveryUrls[0], "Expected to receive the same discovery endpoint as requested." ) ) {
                addLog( "FindServers returned the same DiscoveryUrl as expected: '" + eps[e] + "'." );
            }
        }
    }//for n
    return( true );
}

Test.Execute( { Procedure: findServers551019 } );