/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Invoke GetEndpoints with default parameters while specifying 
        a list of transport ProfileUris to filter.
        How this test works:
            1.) call getEndpoints using default parameters only
            2.) record the list of endpoints returned
            3.) specify a single filter
            4.) issue another call to getEndpoints
            5.) compare the 2nd list with the first! */

function testFilteredEndpoints552003( profileUri, expectedEndpointCount ) {
    if( GetEndpointsHelper.Execute2( { ProfileUris: profileUri } ) ) {
        Assert.Equal( expectedEndpointCount, GetEndpointsHelper.Response.Endpoints.length, "Filtering with ProfileUri " + profileUri + " returned the wrong number of endpoints" );
    }
}

function getEndpoints552003() {
    const XMLSECURITYPROFILEURI = "http://opcfoundation.org/UA-Profile/Transport/soaphttp-wssc-uaxml-uabinary";
    const TCPSECURITYPROFILEURI = "http://opcfoundation.org/UA-Profile/Transport/uatcp-uasc-uabinary";
    
    this.AcceptedProfileUris = [ "http://opcfoundation.org/UA-Profile/Transport/uatcp-uasc-uabinary", 
                                 "http://opcfoundation.org/UA-Profile/Transport/soaphttp-wssc-uaxml", 
                                 "http://opcfoundation.org/UA-Profile/Transport/soaphttp-wssc-uabinary",
                                 "http://opcfoundation.org/UA-Profile/Transport/soaphttp-wssc-uaxml-uabinary",
                                 "http://opcfoundation.org/UA-Profile/Transport/https-uabinary",
                                 "http://opcfoundation.org/UA-Profile/Transport/https-uasoapxml" ];
    this.AcceptedProfileUris.contains = function( uri ) {
        for( profileUri in this ) {
            if( this[profileUri] === uri ) return( true );
        }//for each
        return( false );
    };

    var uatcpCount = 0;
    var uaxmlCount = 0;
    if( GetEndpointsHelper.Execute2() ) {
        for( var i=0; i<GetEndpointsHelper.Response.Endpoints.length; i++ ) {
            if( Assert.True( this.AcceptedProfileUris.contains( GetEndpointsHelper.Response.Endpoints[i].TransportProfileUri ), "Unexpected type: " + GetEndpointsHelper.Response.Endpoints[i].TransportProfileUri, "Valid Transport '" + GetEndpointsHelper.Response.Endpoints[i].TransportProfileUri + "' received." ) ) {
                // count the UA TCP and UA XML profiles returned
                print( "\nTransport Profiles returned:" );
                switch( GetEndpointsHelper.Response.Endpoints[i].TransportProfileUri ) {
                    case XMLSECURITYPROFILEURI: uaxmlCount++; break;
                    case TCPSECURITYPROFILEURI: uatcpCount++; break;
                }// switch
            }//if
        }// for i
        print( "Discovery Server returned " + uaxmlCount + " Endpoints with TransportProfileUri " + XMLSECURITYPROFILEURI );
        print( "Discovery Server returned " + uatcpCount + " Endpoints with TransportProfileUri " + TCPSECURITYPROFILEURI );

        if( uatcpCount === 0 && uaxmlCount === 0 ) addWarning( "Can't test Transport Profile Uri filter. No Endpoints were of an expected TransportProfileUri type." );
        else {
            testFilteredEndpoints552003( XMLSECURITYPROFILEURI, uaxmlCount );
            testFilteredEndpoints552003( TCPSECURITYPROFILEURI, uatcpCount );
        }
    }// getendpoints call
    return( true );
}

Test.Execute( { Procedure: getEndpoints552003 } );