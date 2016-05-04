/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:EndpointUrl=null
    Expected results:Bad_InvalidArgument, or Good and contains default Url */

function findServers551Err001()
{
    FindServersHelper.Execute( {
            EndpointUrl:"null",
            ExpectedResults: new ExpectedAndAcceptedResults( StatusCode.Good )
        } );
    return( true );
}

Test.Execute( { Procedure: findServers551Err001 } );