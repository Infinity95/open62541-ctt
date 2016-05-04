include( "./library/Base/Objects/integerSet.js" );
include( "./library/Base/array.js" );
include( "./library/ResourceTesting/getItemsFromCSV.js" );
include( "./library/Base/safeInvoke.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );

include( "./library/ServiceBased/MonitoredItemServiceSet/CreateMonitoredItems/basicCreateMonitoredItemsTest.js" );
include( "./library/ServiceBased/Helpers.js" );

const BAD_TOOMANYMONITOREDITEMS = 0x80DB0000;
const MIN_MONITOREDITEMS_SIZE = 5000;

var originalItems5000 = MonitoredItem.GetRequiredNodes( { Number: 5000, Settings: Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings } );

var defaultSubscription = new Subscription();
if( !Test.Connect() ) stopCurrentUnit();
else if( !CreateSubscriptionHelper.Execute( { Subscription: defaultSubscription } ) ) stopCurrentUnit();