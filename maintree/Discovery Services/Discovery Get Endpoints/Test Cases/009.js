/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Multiple hostnames defined on the computer, the certificate contains those hostnames. */

function getEndpoints552009() {
    // first, check if *this* PC has multiple host names; if not then skip the test.
    var hostNameFinder = new Hostnames( "127.0.0.1" );
    if( !isDefined( hostNameFinder.Hostnames ) ) {
        addError( "Unable to query the hostnames available on this PC. Please check your TCP/IP configuration and verify a host name is configured." );
        return( false );
    }
    // check the contents of the hostnames
    var hostNameCount = 0;
    for( var i=0; i<hostNameFinder.Hostnames.length; i++ ) {
        if( hostNameFinder.Hostnames[i] === "127.0.0.1" ) continue;
        if( hostNameFinder.Hostnames[i] === "localhost" ) continue;
        hostNameCount++;
    }
    if( hostNameCount < 2 ) {
        addSkipped( "Skipping this test because this computer does not have multiple hostnames configured (both `localhost` and `127.0.0.1` are ignored).\n\tHostnames needed: 2\n\tHostnames received: " + hostNameFinder.Hostnames.toString() );
        return( false );
    }

    // if we get this far then this machine IS multi-homed and we CAN query the certificate
    if( !GetEndpointsHelper.Execute2( { EndpointUrl: readSetting( "/Discovery/Endpoint Url" ) } ) ) return( false );
    if( !Assert.GreaterThan( 0, GetEndpointsHelper.Response.Endpoints.length, "GetEndpoints.Response.Endpoints is empty; we need at least one endpoint to continue with this test." ) ) return( false );

    // check the certificate and check the hostnames
    var cert = UaPkiCertificate.fromDER( GetEndpointsHelper.Response.Endpoints[0].ServerCertificate );
    for( var i=0; i<cert.Hostnames.length; i++ ) {
        if( !hostNameFinder.Contains( cert.Hostnames[i] ) ) addError( "Could not find ServerCertificate.Hostnames[" + i + "] '" + cert.Hostnames[i] + "' in the hostnames reported by the OS, which are:\n\t" + hostNameFinder.Hostnames.toString() );
    }
    return( true );
}

Test.Execute( { Procedure: getEndpoints552009 } );