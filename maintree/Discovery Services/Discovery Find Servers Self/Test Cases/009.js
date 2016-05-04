/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Repeats test test 008, 100 times. Must complete within 10-seconds. */

function findServers551016() { 
    const MAXCOUNT = 100;
    for( var i=0; i<MAXCOUNT-1; i++ ) {
        if( FindServersHelper.Execute( { EndpointUrl: "This is my endpoint" } ) ) Assert.GreaterThan( 0, FindServersHelper.Response.Servers.length, "FindServers should have returned a default endpoint url, even with the invalid url '" + FindServersHelper.Request.EndpointUrl + "' request." );
    }
    return( true );
}

Test.Execute( { Procedure: findServers551016 } );