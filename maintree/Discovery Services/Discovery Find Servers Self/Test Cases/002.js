/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Provide an endpoint description Url with a hostname not known to the server. 
    Expected results: Service result = �Good�; Server returns suitable default discovery URL(s). */

function findServers551005() {
    if( FindServersHelper.Execute( { EndpointUrl:"opc.tcp://bigfoot:4840" } ) ) {
        // Server should return an acceptable discovery url 
        Assert.GreaterThan( 0, FindServersHelper.Response.Servers.length, "Expected the Discovery Server to return a set of results fora default discovery url." );
        Assert.NotEqual( "", FindServersHelper.Response.Servers[0].DiscoveryUrls[0], "FindServers().Response.Servers[0].DiscoveryUrls[0] is empty, but a default url for the DiscoveryServer should be specified." );
    }
    return( true );
}

Test.Execute( { Procedure: findServers551005 } );