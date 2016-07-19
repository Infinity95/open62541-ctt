include( "./library/Base/safeInvoke.js" );
include( "./library/Base/connectChannel.js" );
include( "./library/Base/Objects/dictionary.js" );
include( "./library/ServiceBased/SessionServiceSet/CloseSession.js" );
include( "./library/ServiceBased/MonitoredItemServiceSet/CreateMonitoredItems.js" );
include( "./library/ServiceBased/SubscriptionServiceSet/CreateSubscription.js" );
include( "./library/ServiceBased/SubscriptionServiceSet/DeleteSubscriptions.js" );
include( "./library/Base/Objects/subscription.js" );
include( "./library/Base/Objects/monitoredItem.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );
include( "./library/ServiceBased/SubscriptionServiceSet/Publish.js" );
include( "./library/ServiceBased/MonitoredItemServiceSet/DeleteMonitoredItems.js" );

if( !Test.Connect( { SkipCreateSession: true } ) ) stopCurrentUnit();

// create and configure PkiProvider 
var g_pkiProvider = new UaPkiUtility();
g_pkiProvider.CertificateTrustListLocation = readSetting( "/Advanced/Certificates/CertificateTrustListLocation" );
g_pkiProvider.CertificateRevocationListLocation = readSetting( "/Advanced/Certificates/CertificateRevocationListLocation" );
g_pkiProvider.PkiType = PkiType.OpenSSL;